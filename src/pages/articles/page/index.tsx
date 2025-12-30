import { useEffect } from "react";
import { useParams, Link } from "react-router";
import { FaArrowLeft } from "react-icons/fa6";

import { usePageTitle } from "@/hooks/use-pagetitle";
import { Button } from "@/components/ui/button";
import ArticlesData from "@/data/generated/articles.json";
import type { ArticleProps } from "@/types/article";

type ArticlesDataType = Record<string, ArticleProps>;

const typedArticlesData = ArticlesData as ArticlesDataType;

export default function Article() {
  const { slug } = useParams<{ slug: string }>();

  const article = slug ? typedArticlesData[slug] : null;

  usePageTitle(article?.title ?? slug ?? "");

  useEffect(() => {
    if (!slug || !article) return;

    // Redirect to external URL if article exists
    window.location.href = article.url;
  }, [slug, article]);

  // Show error page if article not found
  if (!article) {
    return (
      <div className="flex justify-center">
        <div className="text-center max-w-6xl w-full bg-muted rounded-md space-y-4 p-6 sm:p-12 border shadow-sm">
          <div className="text-4xl font-semibold">Article Not Found</div>
          <p>The article "{slug}" does not exist.</p>
          <Button asChild variant="outline" className="mt-2 gap-1">
            <Link to="/articles">
              <FaArrowLeft className="w-4 h-4" /> Back to Articles
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Show loading/redirecting message
  return (
    <div className="flex justify-center">
      <div className="text-center max-w-6xl w-full bg-muted rounded-md space-y-4 p-6 sm:p-12 border shadow-sm">
        <div className="text-4xl font-semibold">{article.title}</div>
        <p>Redirecting to article...</p>
        <Button asChild variant="outline" className="mt-2 gap-1">
          <Link to="/articles">
            <FaArrowLeft className="w-4 h-4" /> Back to Articles
          </Link>
        </Button>
      </div>
    </div>
  );
}
