import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import { ensureDirExists } from "./utils.js";

// ======================================
// 1. Input YAML file (required)
// ======================================
const inputFile = process.argv[2] || "config/articles.yaml";
const yamlPath = path.join(process.cwd(), inputFile);

if (!fs.existsSync(yamlPath)) {
  console.error(`❌ ${inputFile} not found!`);
  process.exit(1);
}

// ======================================
// 2. Load YAML
// ======================================
const yamlContent = fs.readFileSync(yamlPath, "utf8");
const data = yaml.load(yamlContent);

if (!data?.articles?.items) {
  console.error("❌ YAML must contain a top-level `articles.items:` array.");
  process.exit(1);
}

console.log(`✅ Loaded YAML: ${inputFile}`);

// ======================================
// 3. Convert items array to articles object keyed by generated slug from title
// ======================================
const articles = {};

// Helper function to generate a slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

data.articles.items.forEach((item, index) => {
  if (!item.title) {
    console.warn(`⚠️ Skipping article without title at index ${index}`);
    return;
  }

  if (!item.url) {
    console.warn(`⚠️ Skipping article without url: ${item.title}`);
    return;
  }

  const now = new Date().toISOString();
  const slug = generateSlug(item.title);

  articles[slug] = {
    title: item.title || "Untitled",
    summary: item.summary || "",
    url: item.url,
    created_at: item.created_at || now,
    tags: item.tags || [],
    draft: item.draft || false,
  };
});

// ======================================
// 4. Sort articles by creation date (newest first)
// ======================================
const sortedEntries = Object.entries(articles).sort(([, a], [, b]) => {
  const dateA = a.created_at || "";
  const dateB = b.created_at || "";
  return dateB.localeCompare(dateA);
});

const sortedArticles = Object.fromEntries(sortedEntries);

// ======================================
// 5. Output directory
// ======================================
const outDir = path.join(process.cwd(), "src", "data", "generated");
ensureDirExists(outDir);

// ======================================
// 6. Write JSON
// ======================================
const outputPath = path.join(outDir, "articles.json");
fs.writeFileSync(
  outputPath,
  JSON.stringify(sortedArticles, null, 4),
  "utf-8",
);

console.log(
  `✅ articles.json generated with ${Object.keys(sortedArticles).length} articles`,
);
