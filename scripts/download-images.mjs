const photos = {
  bali: "photo-1537996194471-e657df975ab4",
  bromo: "photo-1589308078059-be1415eab4c3",
  bajo: "photo-1516690561799-46d8f74f9abf",
  raja: "photo-1516690561799-46d8f74f9abf",
  forest: "photo-1448375240586-882707db888b",
  temple: "photo-1555400038-63f5ba517a47",
};
import fs from "node:fs/promises";
await Promise.all(
  Object.entries(photos).map(async ([name, id]) => {
    const r = await fetch(
      `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1400&q=85`,
    );
    if (!r.ok) throw Error(`${name}: ${r.status}`);
    await fs.writeFile(
      `public/images/${name}.jpg`,
      Buffer.from(await r.arrayBuffer()),
    );
    console.log(name);
  }),
);
