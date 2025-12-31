import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import { ensureDirExists } from "./utils.js";

const projectsYamlPath = path.join(process.cwd(), "config", "projects.yaml");
const outputPath = path.join(
  process.cwd(),
  "src",
  "data",
  "generated",
  "repos.json",
);

if (!fs.existsSync(projectsYamlPath)) {
  console.error(`❌ ${projectsYamlPath} not found!`);
  process.exit(1);
}

function generateProjectsJson() {
  try {
    const raw = fs.readFileSync(projectsYamlPath, "utf-8");
    const data = yaml.load(raw);

    if (!data?.projects?.items) {
      console.error("❌ YAML must contain a `projects.items` array.");
      process.exit(1);
    }

    const items = data.projects.items;
    const repos = {};

    for (const item of items) {
      if (!item.id) {
        console.warn("⚠️ Skipping item without `id` field");
        continue;
      }

      // Use id as the key, and include it as name as well
      const repoData = {
        name: item.id,
        id: item.id,
        displayName: item.displayName || item.id,
        description: item.description || null,
        topics: item.topics || item.topic ? (Array.isArray(item.topics) ? item.topics : item.topic ? [item.topic] : []) : null,
        language: item.language || null,
        homepage: item.homepage || item.homepageUrl || null,
        html_url: item.html_url || item.githubUrl || item.github || null,
        // Support multiple link types
        links: item.links || (item.html_url || item.githubUrl || item.github ? [{ type: "github", url: item.html_url || item.githubUrl || item.github }] : null),
        created_at: item.created_at || item.createdAt || new Date().toISOString(),
        updated_at: item.updated_at || item.updatedAt || null,
        pushed_at: item.pushed_at || item.pushedAt || item.updated_at || item.updatedAt || null,
        previewImage: item.previewImage || item.image || null,
        featured: item.featured !== undefined ? item.featured : false,
        // Include any additional fields
        ...Object.fromEntries(
          Object.entries(item).filter(
            ([key]) =>
              ![
                "id",
                "displayName",
                "description",
                "topics",
                "topic",
                "language",
                "homepage",
                "homepageUrl",
                "html_url",
                "githubUrl",
                "github",
                "links",
                "created_at",
                "createdAt",
                "updated_at",
                "updatedAt",
                "pushed_at",
                "pushedAt",
                "previewImage",
                "image",
                "featured",
              ].includes(key)
          )
        ),
      };

      repos[item.id] = repoData;
    }

    ensureDirExists(outputPath);
    fs.writeFileSync(outputPath, JSON.stringify(repos, null, 2));

    console.log(`✅ Projects JSON generated: ${outputPath}`);
    console.log(`   Generated ${Object.keys(repos).length} project(s)`);
  } catch (error) {
    console.error("❌ Failed to generate projects JSON:", error);
    process.exit(1);
  }
}

generateProjectsJson();

