"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./ClientSpeaks.module.scss";
import { cachedTranslate, useLanguage } from "@/context/LanguageContext";
import { getMediaUrl } from "@/lib/media";

type FeedbackItem = {
  rating: string;
  feedback: string;
  name: string;
  designation: string;
  company: string;
  logo: string;
};

type ClientSpeaksProps = {
  testimonials: {
    title: string;
    feedback: FeedbackItem[];
  };
};

export default function ClientSpeaks({ testimonials }: ClientSpeaksProps) {
  const { language, translate } = useLanguage();

  const originalTestimonials = testimonials;
  const [translatedTestimonials, setTranslatedTestimonials] =
    useState(originalTestimonials);

  const [currentIndex, setCurrentIndex] = useState(0);

  const feedbackList = translatedTestimonials?.feedback || [];

  useEffect(() => {
    async function translateTestimonials() {
      // EN → no translation
      if (language.toUpperCase() === "EN") {
        setTranslatedTestimonials(originalTestimonials);
        return;
      }

      const translated = JSON.parse(
        JSON.stringify(originalTestimonials)
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

      // Feedback items
      translated.feedback.forEach((item: FeedbackItem) => {
        tasks.push(
          t(item.feedback).then((r) => (item.feedback = r))
        );
        tasks.push(
          t(item.name).then((r) => (item.name = r))
        );
        tasks.push(
          t(item.designation).then((r) => (item.designation = r))
        );
        tasks.push(
          t(item.company).then((r) => (item.company = r))
        );
      });

      await Promise.all(tasks);
      setTranslatedTestimonials(translated);
    }

    translateTestimonials();
  }, [language, originalTestimonials]);

  // Auto slider
  useEffect(() => {
    if (!feedbackList.length) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === feedbackList.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [feedbackList.length]);

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section className={styles.section}>
      <div className="container">
        <h2 className={styles.sectionTitle}>
          {translatedTestimonials.title}
        </h2>

        <div className={styles.sliderWrapper}>
          <div className={styles.testimonialGrid}>
            {feedbackList.map((item, index) => (
              <div
                key={index}
                className={`${styles.testimonialCard} ${
                  index === currentIndex ? styles.active : ""
                }`}
              >
                <div className="row">
                  <div className="col-md-6 d-flex flex-column justify-content-between">
                    <div className={styles.logoWrapper}>
                      <img
                        src={getMediaUrl(item.logo)}
                        alt={item.company}
                        width={140}
                        height={50}
                        className={styles.companyLogo}
                        style={{ objectFit: "contain" }}
                      />
                    </div>

                    <div className={styles.authorInfo}>
                      <div className={styles.rating}>
                        {[...Array(Number(item.rating))].map((_, i) => (
                          <Image
                            key={i}
                            src={getMediaUrl("/images/star.png")}
                            alt="Star"
                            width={18}
                            height={18}
                            className={styles.star}
                          />
                        ))}
                      </div>
                      <h4 className={styles.name}>{item.name}</h4>
                      <p className={styles.designation}>
                        {item.designation}
                      </p>
                    </div>
                  </div>

                  <div className="col-md-6 pt-4 pt-md-0">
                    <div className={styles.quoteContent}>
                      <div className={styles.quoteIcon}>
                        <Image
                          src={getMediaUrl("/images/quote.svg")}
                          alt="Quote"
                          width={48}
                          height={38}
                        />
                      </div>
                      <p className={styles.quoteText}>
                        {item.feedback}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.dots}>
            {feedbackList.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`${styles.dot} ${
                  index === currentIndex ? styles.activeDot : ""
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
