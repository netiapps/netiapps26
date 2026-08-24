"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./BlogsDetail.module.scss";
import { Facebook, Twitter, Linkedin, Phone } from "lucide-react";
import { cachedTranslate, useLanguage } from "@/context/LanguageContext";
import { getMediaUrl } from "@/lib/media";

export default function BlogsDetail({ blog }: any) {
  const { language, translate } = useLanguage();
  const [data, setData] = useState<any>(blog);

  useEffect(() => {
    async function translateBlog() {
      if (language.toUpperCase() === "EN") {
        setData(blog);
        return;
      }

      const cloned = JSON.parse(JSON.stringify(blog));
      const tasks: Promise<any>[] = [];
      const t = (text: string) =>
        cachedTranslate(text, language, translate);

      // Blog title
      if (cloned.acf?.title) {
        tasks.push(
          t(cloned.acf.title).then(res => (cloned.acf.title = res))
        );
      }

      // Author
      if (cloned.acf?.author?.name) {
        tasks.push(
          t(cloned.acf.author.name).then(
            res => (cloned.acf.author.name = res)
          )
        );
      }

      if (cloned.acf?.author?.designation) {
        tasks.push(
          t(cloned.acf.author.designation).then(
            res => (cloned.acf.author.designation = res)
          )
        );
      }

      // Blog content (HTML)
      if (cloned.acf?.content) {
        tasks.push(
          t(cloned.acf.content).then(
            res => (cloned.acf.content = res)
          )
        );
      }

      await Promise.all(tasks);
      setData(cloned);
    }

    translateBlog();
  }, [language, blog]);

  if (!data) return null;

  const blogUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/blogs/${data.slug}`;

  return (
    <main>
      <div className={styles.main}>
        <div className="container">
          <article className={styles.blogCard}>
            {/* Header */}
            <div className={styles.headerLeft}>
              <Link href="/blogs" className={styles.backButton}>
                <svg
                  width="35"
                  height="35"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </Link>
              <h1 className={styles.title}>{data.acf.title}</h1>
            </div>

            {/* Author */}
            <div className={styles.author}>
              <img
                src={getMediaUrl(data.acf.author.image)}
                alt={data.acf.author.name}
              />
              <div>
                <h4>{data.acf.author.name}</h4>
                <p>{data.acf.author.designation}</p>
              </div>
            </div>

            {/* Image */}
            <div className={styles.image}>
              <img src={getMediaUrl(data.acf.image)} alt={data.acf.title} />
            </div>

            {/* Content */}
            <div
              className={styles.content}
              dangerouslySetInnerHTML={{
                __html: data.acf.content,
              }}
            />

            {/* Share */}
            <div className={styles.shareSection}>
              <p>Share this article</p>

              <div className={styles.shareIcons}>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                    blogUrl
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin size={20} />
                </a>

                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                    blogUrl
                  )}&text=${encodeURIComponent(data.acf.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Twitter size={20} />
                </a>

                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    blogUrl
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Facebook size={20} />
                </a>

                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    `${data.acf.title} - ${blogUrl}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Phone size={20} />
                </a>
              </div>
            </div>
          </article>
        </div>
      </div>
    </main>
  );
}
