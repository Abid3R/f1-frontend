// ─────────────────────────────────────────────────────────────────────────────
// Pulls main image for each F1 record from Wikipedia's REST summary endpoint
// (free, no API key) and saves to public/images/records/<slot>.<ext>
// ─────────────────────────────────────────────────────────────────────────────
import fs from "fs/promises";
import path from "path";

const RECORDS = [
  { slot: "most-championships",  title: "Michael_Schumacher" },
  { slot: "most-wins",           title: "Lewis_Hamilton" },
  { slot: "most-poles",          title: "Mercedes_F1_W11_EQ_Performance" },
  { slot: "verstappen-2023",     title: "Max_Verstappen" },
  { slot: "vettel-2010",         title: "Sebastian_Vettel" },
  { slot: "fangio-1957",         title: "Juan_Manuel_Fangio" },
  { slot: "ferrari-dynasty",     title: "Scuderia_Ferrari" },
  { slot: "monza-2020",          title: "Autodromo_Nazionale_Monza" },
  { slot: "barrichello-career",  title: "Rubens_Barrichello" },
  { slot: "farina-1950",         title: "Nino_Farina" },
  { slot: "verstappen-streak",   title: "Red_Bull_RB19" },
  { slot: "senna-monaco",        title: "Ayrton_Senna" },
];

const OUT_DIR = path.resolve("public/images/records");
await fs.mkdir(OUT_DIR, { recursive: true });

const UA = "F1IntelEducational/1.0 (https://example.com; learning project)";

async function downloadOne({ slot, title }) {
  const summaryUrl =
    `https://en.wikipedia.org/api/rest_v1/page/summary/${title}`;
  try {
    const res = await fetch(summaryUrl, {
      headers: { "User-Agent": UA, Accept: "application/json" },
    });
    if (!res.ok) {
      console.log(`x ${slot}: summary HTTP ${res.status}`);
      return null;
    }
    const data = await res.json();
    const imageUrl =
      data?.originalimage?.source || data?.thumbnail?.source || null;
    if (!imageUrl) {
      console.log(`x ${slot}: no image returned for ${title}`);
      return null;
    }

    const img = await fetch(imageUrl, { headers: { "User-Agent": UA } });
    if (!img.ok) {
      console.log(`x ${slot}: image HTTP ${img.status}`);
      return null;
    }
    const buf = Buffer.from(await img.arrayBuffer());

    const u = new URL(imageUrl);
    let ext = path.extname(u.pathname).toLowerCase();
    if (![".jpg", ".jpeg", ".png", ".webp", ".avif"].includes(ext)) {
      // Skip svg / unsupported
      console.log(`x ${slot}: unsupported ext ${ext} (${imageUrl})`);
      return null;
    }

    const filename = `${slot}${ext}`;
    const outPath = path.join(OUT_DIR, filename);
    await fs.writeFile(outPath, buf);

    console.log(
      `ok ${slot} -> ${filename}  (${(buf.length / 1024).toFixed(0)} KB)  [${title}]`
    );
    return { slot, filename };
  } catch (e) {
    console.log(`x ${slot}: ${e.message}`);
    return null;
  }
}

const mapping = {};
for (const rec of RECORDS) {
  const r = await downloadOne(rec);
  if (r) mapping[r.slot] = r.filename;
  // Be polite to Wikipedia
  await new Promise((res) => setTimeout(res, 250));
}

// Write the resolved mapping so the page can pick it up
await fs.writeFile(
  path.resolve("app/records/image-map.json"),
  JSON.stringify(mapping, null, 2)
);

console.log("\nMapping written to app/records/image-map.json:");
console.log(JSON.stringify(mapping, null, 2));
