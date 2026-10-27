/** RFC4180-style CSV parser: quoted commas, newlines, escaped quotes, BOM. */
export function parseCsv(
  text: string,
  requiredHeaders: string[] = [],
): Record<string, string>[] {
  const rows: string[][] = [];
  let row: string[] = [],
    cell = "",
    quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') {
      if (quoted && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else quoted = !quoted;
    } else if (c === "," && !quoted) {
      row.push(cell);
      cell = "";
    } else if ((c === "\n" || c === "\r") && !quoted) {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(cell);
      if (row.some((v) => v.trim())) rows.push(row);
      row = [];
      cell = "";
    } else cell += c;
  }
  if (quoted) throw Error("CSV tidak valid: tanda kutip belum ditutup.");
  row.push(cell);
  if (row.some((v) => v.trim())) rows.push(row);
  if (!rows.length)
    throw Error("Spreadsheet kosong atau belum dipublikasikan.");
  const headers = rows.shift()!.map((h) => h.replace(/^\uFEFF/, "").trim());
  if (new Set(headers).size !== headers.length)
    throw Error("Header spreadsheet duplikat.");
  for (const header of requiredHeaders) {
    if (!headers.includes(header))
      throw Error(`Kolom ${header} tidak tersedia pada CSV.`);
  }
  return rows.map((values, i) => {
    if (values.length !== headers.length)
      throw Error(`Jumlah kolom CSV baris ${i + 2} tidak sesuai.`);
    return Object.fromEntries(headers.map((h, j) => [h, values[j].trim()]));
  });
}
