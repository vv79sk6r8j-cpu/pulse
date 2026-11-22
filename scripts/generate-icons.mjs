import sharp from "sharp";
import { readFile, mkdir } from "node:fs/promises";
const source = process.env.PULSE_PREVIEW === "1" ? "public/icon-test.svg" : "public/icon.svg";
await mkdir("public", { recursive: true });
await sharp(await readFile(source)).resize(180,180).png().toFile("public/apple-touch-icon.png");
await sharp(await readFile(source)).resize(192,192).png().toFile("public/icon-192.png");
