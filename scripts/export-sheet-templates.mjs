import fs from "node:fs/promises";
import ts from "typescript";
const source = await fs.readFile("src/data/mock.ts", "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
  },
}).outputText;
// Embed the owned JSON module so the generated data URL needs no runtime TS loader.
const locations = await fs.readFile("src/data/cityLocations.json", "utf8");
const js = compiled.replace(
  'import cityLocations from "./cityLocations.json";',
  `const cityLocations = ${locations};`,
);
const { mockData } = await import(
  "data:text/javascript;base64," + Buffer.from(js).toString("base64")
);
await fs.mkdir("docs/sheets", { recursive: true });
for (const [key, value] of Object.entries(mockData)) {
  const rows = Array.isArray(value) ? value : [value];
  const headers = Object.keys(rows[0]);
  const escape = (v) => '"' + String(v ?? "").replaceAll('"', '""') + '"';
  const text = [
    headers.map(escape).join(","),
    ...rows.map((row) => headers.map((h) => escape(row[h])).join(",")),
  ].join("\r\n");
  await fs.writeFile(`docs/sheets/${key}.csv`, "\uFEFF" + text);
  console.log(key);
}
