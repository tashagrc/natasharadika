import { Link } from "react-router";
import {
  FaWrench,
  FaGithub,
  FaGlobe,
  FaArrowRight,
} from "react-icons/fa6";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { featuredReposArray } from "@/data/repos";

export default function ProjectsSection() {
  return (
    <div className="space-y-6">
      <div className="flex flex-row justify-center items-center gap-2 text-plus font-semibold">
        <FaWrench />
        Projects
      </div>

      {featuredReposArray.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>No featured projects found.</p>
          <p className="text-sm mt-2">
            Make sure your projects are marked as <code>featured: true</code> in{" "}
            <code>config/projects.yaml</code> and run <code>npm run generate:projects-json</code> to update the data.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {featuredReposArray.map((repoData, index) => (
            <ProjectCard key={index} repoData={repoData} />
          ))}
        </div>
      )}

      <div className="relative w-full">
        <div className="absolute right-0">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="gap-1 text-muted-foreground"
          >
            <Link to="/projects">
              View all
              <FaArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function ProjectCard({
  repoData,
}: {
  repoData: (typeof featuredReposArray)[number];
}) {
  if (!repoData) {
    return (
      <Card className="rounded-md overflow-hidden">
        <div className="flex flex-col items-center justify-center p-4 w-full h-full bg-muted">
          <span className="text-xl font-semibold opacity-80">
            Project not found
          </span>
        </div>
      </Card>
    );
  }

  const imageLink = repoData.html_url || repoData.homepage || null;

  return (
    <Card className="rounded-md overflow-hidden gap-0 py-0 w-full flex flex-col h-full">
      <div className="flex flex-col flex-grow">
        {imageLink ? (
          <a
            href={imageLink}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <div className="aspect-3/2 w-full overflow-hidden">
              {repoData.previewImage ? (
                <img
                  src={repoData.previewImage}
                  alt={repoData.name || "Project image"}
                  className="w-full h-full object-cover"
                  style={{ overflowClipMargin: "unset" }}
                  loading="lazy"
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-4 w-full h-full bg-muted">
                  <span className="text-lg font-semibold opacity-80 text-center">
                    {repoData.name || "Unnamed Project"}
                  </span>
                  <span className="text-sm text-muted-foreground text-center">
                    Image not available
                  </span>
                </div>
              )}
            </div>
          </a>
        ) : (
          <div className="aspect-3/2 w-full overflow-hidden">
            {repoData.previewImage ? (
              <img
                src={repoData.previewImage}
                alt={repoData.name || "Project image"}
                className="w-full h-full object-cover"
                style={{ overflowClipMargin: "unset" }}
                loading="lazy"
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-4 w-full h-full bg-muted">
                <span className="text-lg font-semibold opacity-80 text-center">
                  {repoData.name || "Unnamed Project"}
                </span>
                <span className="text-sm text-muted-foreground text-center">
                  Image not available
                </span>
              </div>
            )}
          </div>
        )}

        <div className="w-full border-t" />

        <div className="flex flex-col flex-grow py-3 px-4 gap-y-2">
          <div className="text-base font-semibold line-clamp-2">
            {repoData.html_url ? (
              <a
                href={repoData.html_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub repository"
                className="cursor-pointer hover:underline underline-offset-4"
              >
                {repoData.displayName || repoData.name}
              </a>
            ) : (
              repoData.displayName || repoData.name
            )}
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {repoData.description || "Details unavailable"}
          </p>

          {repoData.topics?.length ? (
            <div className="flex flex-wrap gap-1.5">
              {repoData.topics.map((topic, idx) => (
                <Button
                  key={idx}
                  asChild
                  variant="secondary"
                  size="sm"
                  className="rounded-sm font-normal px-2 h-7 text-sm"
                >
                  <Link to={`/projects?topic=${encodeURIComponent(topic)}`}>
                    {topic}
                  </Link>
                </Button>
              ))}
            </div>
          ) : null}

          <div className="flex flex-row items-center justify-between text-muted-foreground mt-auto pt-2">
            <div className="flex items-center gap-2">
              <p className="text-sm">
                Language: {repoData.language || "Unknown"}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {repoData.homepage && (
                <a
                  href={repoData.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Project homepage"
                  className="hover:text-foreground"
                >
                  <FaGlobe className="w-6 h-6" />
                </a>
              )}
              {repoData.html_url && (
                <a
                  href={repoData.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub repository"
                  className="hover:text-foreground"
                >
                  <FaGithub className="w-6 h-6" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
