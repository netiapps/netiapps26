"use client";

import { useEffect, useState } from "react";
import styles from "./Solutions.module.scss";
import { cachedTranslate, useLanguage } from "@/context/LanguageContext";
import { getMediaUrl } from "@/lib/media";

/* ---------- TYPES ---------- */

type BackendItem = {
  img: string | false;
  title?: string;
  text_color?: "light" | "dark";
  link?: string;
};

type CardItem = {
  img?: string;
  title?: string;
  text_color: "light" | "dark";
  link?: string;
};

/* ---------- UTILS ---------- */

const shuffle = (arr: CardItem[]) =>
  [...arr].sort(() => Math.random() - 0.5);

/* ---------- COMPONENT ---------- */

export default function Solutions({ solution }: any) {
  const { language, translate } = useLanguage();

  const originalSolution = solution;
  const [translatedSolution, setTranslatedSolution] =
    useState(originalSolution);

  const [cards, setCards] = useState<CardItem[]>([]);

  /* ---------- TRANSLATION ---------- */

  useEffect(() => {
    async function translateSolution() {
      // EN → no translation
      if (language.toUpperCase() === "EN") {
        setTranslatedSolution(originalSolution);
        return;
      }

      const translated = JSON.parse(
        JSON.stringify(originalSolution)
      );

      const tasks: Promise<any>[] = [];
      const t = (text: string) =>
        cachedTranslate(text, language, translate);

      // Section title (HTML)
      if (translated?.title) {
        tasks.push(
          t(translated.title).then(
            (r) => (translated.title = r)
          )
        );
      }

      // Card titles
      translated?.image_content?.forEach(
        (item: BackendItem) => {
          if (item.title) {
            tasks.push(
              t(item.title).then((r) => (item.title = r))
            );
          }
        }
      );

      await Promise.all(tasks);
      setTranslatedSolution(translated);
    }

    translateSolution();
  }, [language, originalSolution]);

  /* ---------- CARD NORMALIZATION ---------- */

  useEffect(() => {
    if (!translatedSolution?.image_content) return;

    const normalized: CardItem[] =
      translatedSolution.image_content
        .map((item: BackendItem) => ({
          img: typeof item.img === "string" ? item.img : undefined,
          title: item.title,
          text_color: item.text_color || "light",
          link: item.link,
        }))
        .filter((item: CardItem) => item.img || item.title);

    if (!normalized.length) return;

    setCards(shuffle(normalized).slice(0, 4));
  }, [translatedSolution]);

  if (cards.length < 4) return null;

  return (
    <section className={styles.section}>
      {/* SECTION TITLE */}
      {translatedSolution?.title && (
        <div
          className="container text-center mb-5"
          dangerouslySetInnerHTML={{
            __html: translatedSolution.title,
          }}
        />
      )}

      <div className="container">
        <div className={styles.grid}>
          {/* BIG */}
          <CardWrapper
            item={cards[0]}
            className={`${styles.card} ${styles.bigCard}`}
          />

          <div className={styles.rightColumn}>
            {/* WIDE */}
            <CardWrapper
              item={cards[1]}
              className={`${styles.card} ${styles.wideCard}`}
            />

            <div className={styles.bottomRow}>
              {/* SMALL */}
              <CardWrapper
                item={cards[2]}
                className={`${styles.card} ${styles.smallCard}`}
              />

              {/* SMALL */}
              <CardWrapper
                item={cards[3]}
                className={`${styles.card} ${styles.smallCard}`}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- CARD WRAPPER ---------- */

function CardWrapper({
  item,
  className,
}: {
  item: CardItem;
  className: string;
}) {
  if (item.link) {
    return (
      <a
        href={item.link}
        className={className}
        rel="noopener noreferrer"
        style={{ cursor: "pointer" }}
      >
        <Card item={item} />
      </a>
    );
  }

  return (
    <div className={className}>
      <Card item={item} />
    </div>
  );
}

/* ---------- CARD ---------- */

function Card({ item }: { item: CardItem }) {
  const isTextOnly = !item.img;

  return (
    <>
      {item.img && (
        <img src={getMediaUrl(item.img)} alt="" className={styles.image} />
      )}

      {item.title && (
        <div
          className={`${styles.cardContent} ${
            isTextOnly ? styles.centerContent : ""
          }`}
        >
          <div
            className={
              item.text_color === "dark"
                ? styles.cardTitleDark
                : styles.cardTitle
            }
            dangerouslySetInnerHTML={{ __html: item.title }}
          />
        </div>
      )}
    </>
  );
}
