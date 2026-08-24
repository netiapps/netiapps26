"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./InnerPageBanner.module.scss";
import { cachedTranslate, useLanguage } from "@/context/LanguageContext";
import { getMediaUrl } from "@/lib/media";

interface Breadcrumb {
  label: string;
  link?: string;
}

export default function InnerPageBanner(banner: any) {
  const { language, translate } = useLanguage();

  const originalBanner = banner.banner;
  const [translatedBanner, setTranslatedBanner] =
    useState(originalBanner);

  const containerRef = useRef<HTMLElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);

  /* ---------- TRANSLATION ---------- */

  useEffect(() => {
    async function translateBanner() {
      // EN → no translation
      if (language.toUpperCase() === "EN") {
        setTranslatedBanner(originalBanner);
        return;
      }

      const translated = JSON.parse(
        JSON.stringify(originalBanner)
      );

      const tasks: Promise<any>[] = [];
      const t = (text: string) =>
        cachedTranslate(text, language, translate);

      // Tag
      if (translated.tag) {
        tasks.push(
          t(translated.tag).then((r) => (translated.tag = r))
        );
      }

      // Title
      if (translated.title) {
        tasks.push(
          t(translated.title).then((r) => (translated.title = r))
        );
      }

      // Breadcrumb labels
      translated.breadcrumbs?.forEach((item: Breadcrumb) => {
        if (item.label) {
          tasks.push(
            t(item.label).then((r) => (item.label = r))
          );
        }
      });

      await Promise.all(tasks);
      setTranslatedBanner(translated);
    }

    translateBanner();
  }, [language, originalBanner]);

  /* ---------- SCROLL EFFECT ---------- */

  useEffect(() => {
    const handleScroll = () => {
      if (!imageWrapperRef.current) return;

      const scrollY = window.scrollY;
      const windowWidth = window.innerWidth;
      const containerWidth =
        imageWrapperRef.current.parentElement?.offsetWidth || 0;

      const maxExpand = Math.max(0, windowWidth - containerWidth);
      const progress = Math.min(scrollY / 500, 1);
      const currentExpand = maxExpand * progress;

      imageWrapperRef.current.style.setProperty(
        "--scroll-progress",
        progress.toString()
      );
      imageWrapperRef.current.style.setProperty(
        "--scroll-expand",
        `${currentExpand}px`
      );
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () =>
      window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!translatedBanner) return null;

  return (
    <section className={styles.section} ref={containerRef}>
      <div className="container">
        {/* Top Header Section */}
        <div className={styles.headerRow}>
          <div className={styles.leftCol}>
            <div className={styles.tagPill}>
              {translatedBanner.tag}
            </div>

            <h1 className={styles.title}>
              {translatedBanner.title}
            </h1>
          </div>

          <div className={styles.rightCol}>
            <nav className={styles.breadcrumbNav}>
              {translatedBanner.breadcrumbs.map(
                (item: Breadcrumb, index: number) => (
                  <span
                    key={index}
                    className={styles.breadcrumbItem}
                  >
                    {item.link ? (
                      <Link href={item.link}>
                        {item.label}
                      </Link>
                    ) : (
                      <span className={styles.active}>
                        {item.label}
                      </span>
                    )}

                    {index <
                      translatedBanner.breadcrumbs.length -
                        1 && (
                      <span className={styles.separator}>
                        /
                      </span>
                    )}
                  </span>
                )
              )}
            </nav>
          </div>
        </div>

        {/* Banner Image Section */}
        <div
          className={styles.imageWrapper}
          ref={imageWrapperRef}
        >
          <img
            src={getMediaUrl(translatedBanner.image)}
            alt="banner"
            width={1400}
            height={600}
            className={styles.bannerImg}
          />
        </div>
      </div>
    </section>
  );
}
