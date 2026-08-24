"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./ServiceHighlight.module.scss";
import { cachedTranslate, useLanguage } from "@/context/LanguageContext";
import { getMediaUrl } from "@/lib/media";

export default function ServiceHighlight(highlight: any) {
  const { language, translate } = useLanguage();

  const originalHighlight = highlight.highlight;
  const [translatedHighlight, setTranslatedHighlight] =
    useState(originalHighlight);

  /* ---------- TRANSLATION ---------- */

  useEffect(() => {
    async function translateHighlight() {
      // EN → no translation
      if (language.toUpperCase() === "EN") {
        setTranslatedHighlight(originalHighlight);
        return;
      }

      const translated = JSON.parse(
        JSON.stringify(originalHighlight)
      );

      const tasks: Promise<any>[] = [];
      const t = (text: string) =>
        cachedTranslate(text, language, translate);

      // Title
      if (translated.title) {
        tasks.push(
          t(translated.title).then((r) => (translated.title = r))
        );
      }

      // Sub menu labels
      translated.sub_menu?.forEach((item: any) => {
        if (item.lable) {
          tasks.push(
            t(item.lable).then((r) => (item.lable = r))
          );
        }
      });

      // Description (HTML)
      if (translated.description) {
        tasks.push(
          t(translated.description).then(
            (r) => (translated.description = r)
          )
        );
      }

      await Promise.all(tasks);
      setTranslatedHighlight(translated);
    }

    translateHighlight();
  }, [language, originalHighlight]);

  if (!translatedHighlight) return null;

  return (
    <section className={styles.section}>
      <div className="container">
        <div className="row align-items-stretch g-4">
          {/* Left Card */}
          <div className="col-lg-6">
            <div className={styles.leftCard}>
              <h2 className={styles.title}>
                {translatedHighlight.title}
              </h2>

              <ul className={styles.linkList}>
                {translatedHighlight.sub_menu.map(
                  (service: any, index: number) => (
                    <li key={index}>
                      <Link
                        href={service.link}
                        className={styles.serviceLink}
                      >
                        {service.lable}
                        <span className={styles.arrow}>→</span>
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>

          {/* Right Card */}
          <div className="col-lg-6">
            <div className={styles.rightCardWrapper}>
              <div className={styles.imageOverlay}>
                <img
                  src={getMediaUrl(translatedHighlight.image)}
                  alt="Service Illustration"
                  width={500}
                  height={400}
                  className={styles.mainImg}
                />
              </div>

              <div className={styles.rightCard}>
                <div className={styles.description}>
                  <div dangerouslySetInnerHTML={{__html: translatedHighlight.description, }}/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
