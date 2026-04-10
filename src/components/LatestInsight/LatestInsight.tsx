"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./LatestInsight.module.scss";
import { ApiService } from "@/services/api.service";
import { cachedTranslate, useLanguage } from "@/context/LanguageContext";

export default function LatestInsight() {
  const baseUrl = new ApiService();
  const { language, translate } = useLanguage();

  const [blogs, setBlogs] = useState<any[]>([]);
  const [translatedBlogs, setTranslatedBlogs] = useState<any[]>([]);
  const [sectionTitle, setSectionTitle] = useState("Latest Insight");
  const [sectionButton, setSectionButton] = useState("View More Blogs");

  /* ---------------- Fetch Blogs ---------------- */
  useEffect(() => {
    async function fetchBlogs() {
      try {
        const res = await fetch(
          baseUrl.getBaseUrl() +
            `wp-json/wp/v2/blogs?per_page=3&orderby=date&order=desc`,
          { cache: "no-store" }
        );

        const data = await res.json();
        setBlogs(data);
        setTranslatedBlogs(data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    }

    fetchBlogs();
  }, []);

  /* ---------------- Translate Content ---------------- */
  useEffect(() => {
    async function translateBlogs() {
      if (!blogs.length) return;

      if (language.toUpperCase() === "EN") {
        setTranslatedBlogs(blogs);
        setSectionTitle("Latest Insight");
        setSectionButton("View More Blogs");
        return;
      }

      const clonedBlogs = JSON.parse(JSON.stringify(blogs));
      const tasks: Promise<any>[] = [];

      const t = (text: string) =>
        cachedTranslate(text, language, translate);

      // Section title
      tasks.push(t("Latest Insight").then(r => setSectionTitle(r)));
      tasks.push(t("View More Blogs").then(r => setSectionButton(r)));

      // Blog fields
      clonedBlogs.forEach((blog: any) => {
        if (blog.acf?.title) {
          tasks.push(
            t(blog.acf.title).then(r => (blog.acf.title = r))
          );
        }

        if (blog.acf?.date) {
          tasks.push(
            t(blog.acf.date).then(r => (blog.acf.date = r))
          );
        }
      });

      await Promise.all(tasks);
      setTranslatedBlogs(clonedBlogs);
    }

    translateBlogs();
  }, [language, blogs]);

  /* ---------------- Empty State ---------------- */
  if (!translatedBlogs?.length || !translatedBlogs[0]?.acf) {
    return (
      <main className={styles.emptyState}>
        <h2>Content not available</h2>
        <p>Data is not available in your CMS for this service.</p>
      </main>
    );
  }

  /* ---------------- Render ---------------- */
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.sectionTitle}>{sectionTitle}</h2>

          <Link href="/blogs" className={styles.blogBtn}>
           {sectionButton} →
          </Link>
        </div>
        <div className="row">
          {translatedBlogs.map((insight: any, index: number) => (
            <div key={index} className="col-lg-4 col-md-6 mb-4">
              <Link
                href={`/blogs/${insight.slug}`}
                className={styles.card}
              >
                <div className={styles.imageWrapper}>
                  <img
                    src={insight.acf.image || undefined}
                    alt={insight.acf.title || "Insight"}
                    className={styles.image}
                  />
                </div>

                <div className={styles.content}>
                  <p className={styles.date}>{insight.acf.date}</p>
                  <h3 className={styles.title}>
                    {insight.acf.title}
                  </h3>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
