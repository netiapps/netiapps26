"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./Industries.module.scss";
import { cachedTranslate, useLanguage } from "@/context/LanguageContext";
import { getMediaUrl } from "@/lib/media";

export default function Industries(industries: any) {
  const { language, translate } = useLanguage();

  const originalIndustries = industries.industries;
  const [translatedIndustries, setTranslatedIndustries] =
    useState(originalIndustries);

  /* ---------- TRANSLATION ---------- */

  useEffect(() => {
    async function translateIndustries() {
      // EN → no translation
      if (language.toUpperCase() === "EN") {
        setTranslatedIndustries(originalIndustries);
        return;
      }

      const translated = JSON.parse(
        JSON.stringify(originalIndustries)
      );

      const tasks: Promise<any>[] = [];
      const t = (text: string) =>
        cachedTranslate(text, language, translate);

      // Section title
      if (translated.title) {
        tasks.push(
          t(translated.title).then((r) => (translated.title = r))
        );
      }

      // Industry card titles
      translated.industry_section?.forEach((item: any) => {
        if (item.title) {
          tasks.push(
            t(item.title).then((r) => (item.title = r))
          );
        }
      });

      await Promise.all(tasks);
      setTranslatedIndustries(translated);
    }

    translateIndustries();
  }, [language, originalIndustries]);

  if (!translatedIndustries) return null;

  return (
    <section className={styles.section}>
      <div className="container">
        <h2 className={styles.sectionTitle}>
          {translatedIndustries.title}
        </h2>
      </div>

      <div className={styles.scrollWrapper}>
        <div className={styles.scrollContent}>
          {translatedIndustries.industry_section.map(
            (indus: any, index: number) => (
              <div key={index} className={styles.card}>
                <img
                  src={getMediaUrl(indus.image)}
                  alt={indus.title}
                  className={styles.image}
                />

                <div className={styles.overlay}>
                  <h3
                    className={styles.cardTitle}
                    style={{
                      color:
                        indus.text_color === "light"
                          ? "#ffffff"
                          : undefined,
                    }}
                  >
                    {indus.title}
                  </h3>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
