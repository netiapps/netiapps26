"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./Blogs.module.scss";
import { cachedTranslate, useLanguage } from "@/context/LanguageContext";
import { getMediaUrl } from "@/lib/media";

const BLOGS_PER_PAGE = 9;

export default function Blogs({ blogs }: any) {
  const { language, translate } = useLanguage();

  const [translatedBlogs, setTranslatedBlogs] = useState<any[]>(blogs);
  const [visibleCount, setVisibleCount] = useState(BLOGS_PER_PAGE);

  /* -------- Translation -------- */
  useEffect(() => {
    async function translateBlogs() {
      if (language.toUpperCase() === "EN") {
        setTranslatedBlogs(blogs);
        return;
      }

      const cloned = JSON.parse(JSON.stringify(blogs));
      const tasks: Promise<any>[] = [];
      const t = (text: string) =>
        cachedTranslate(text, language, translate);

      cloned.forEach((blog: any) => {
        if (blog.acf?.title) {
          tasks.push(
            t(blog.acf.title).then(res => (blog.acf.title = res))
          );
        }

        if (blog.acf?.date) {
          tasks.push(
            t(blog.acf.date).then(res => (blog.acf.date = res))
          );
        }
      });

      await Promise.all(tasks);
      setTranslatedBlogs(cloned);
    }

    translateBlogs();
  }, [language, blogs]);

  /* -------- Load More -------- */
  const handleLoadMore = () => {
    setVisibleCount(prev => prev + BLOGS_PER_PAGE);
  };

  const visibleBlogs = translatedBlogs.slice(0, visibleCount);
  const hasMore = visibleCount < translatedBlogs.length;

  return (
    <main className={styles.main}>
      <div className="container">
        <div className="row">
          {visibleBlogs.map((insight: any, index: number) => (
            <div key={index} className="col-lg-4 col-md-6 mb-5">
              <Link
                href={`/blogs/${insight.slug}`}
                className={styles.card}
              >
                <div className={styles.imageWrapper}>
                  <img
                    src={getMediaUrl(insight.acf.image)}
                    alt={insight.acf.title}
                    className={styles.image}
                  />
                </div>

                <div className={styles.content}>
                  <p className={styles.date}>
                    {insight.acf.date}
                  </p>
                  <h3 className={styles.title}>
                    {insight.acf.title}
                  </h3>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className={styles.loadMoreWrapper}>
            <button
              onClick={handleLoadMore}
              className={styles.loadMoreBtn}
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
