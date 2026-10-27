import fs from "node:fs/promises";
const url =
  "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_admin_0_countries.geojson";
const data = await (await fetch(url)).json();
const country = data.features.find((f) => f.properties.ADM0_A3 === "IDN");
if (!country) throw Error("Indonesia not found");
const groups = Object.fromEntries(
  [
    "sumatra",
    "jawa",
    "kalimantan",
    "sulawesi",
    "bali",
    "nusa-tenggara",
    "maluku",
    "papua",
  ].map((k) => [k, []]),
);
for (const polygon of country.geometry.coordinates) {
  const ring = polygon[0];
  const xs = ring.map((p) => p[0]),
    ys = ring.map((p) => p[1]);
  const x = (Math.min(...xs) + Math.max(...xs)) / 2,
    y = (Math.min(...ys) + Math.max(...ys)) / 2;
  let region;
  // Island-cluster bounds, including Bangka-Belitung, Raja Ampat and Maluku's southern islands.
  if (x < 108.7 && y > -5.8) region = "sumatra";
  else if (x < 114.9 && y < -5) region = "jawa";
  else if (x >= 114.4 && x < 115.75 && y < -8) region = "bali";
  else if (x >= 108.7 && x < 119.5 && y > -4.5) region = "kalimantan";
  else if (x < 127 && y < -7) region = "nusa-tenggara";
  else if (x < 125.9) region = "sulawesi";
  else if (x >= 130 && (y > -2.7 || x > 135.2 || (x > 131.6 && y > -5)))
    region = "papua";
  else region = "maluku";
  const pts = ring.filter(
    (p, i) =>
      i === 0 ||
      i === ring.length - 1 ||
      Math.hypot(p[0] - ring[i - 1][0], p[1] - ring[i - 1][1]) > 0.009,
  );
  if (pts.length < 4) continue;
  groups[region].push(
    pts
      .map(
        (p, i) =>
          `${i ? "L" : "M"}${((p[0] - 94) * 21).toFixed(1)},${((7 - p[1]) * 21).toFixed(1)}`,
      )
      .join("") + "Z",
  );
}
await fs.writeFile(
  "src/data/mapPaths.json",
  JSON.stringify(
    Object.fromEntries(Object.entries(groups).map(([k, v]) => [k, v.join("")])),
  ),
);
console.log(
  Object.fromEntries(Object.entries(groups).map(([k, v]) => [k, v.length])),
);
