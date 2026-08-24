"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./Services.module.scss";
import { cachedTranslate, useLanguage } from "@/context/LanguageContext";
import { getMediaUrl } from "@/lib/media";

export default function Services(services: any) {
  const { language, translate } = useLanguage();

  const originalServices = services.services;
  const [translatedServices, setTranslatedServices] =
    useState(originalServices);

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    async function translateServices() {
      // English → no translation
      if (language.toUpperCase() === "EN") {
        setTranslatedServices(originalServices);
        return;
      }

      const translated = JSON.parse(JSON.stringify(originalServices));
      const tasks: Promise<any>[] = [];

      const t = (text: string) =>
        cachedTranslate(text, language, translate);

      // Section title (HTML)
      if (translated.title) {
        tasks.push(
          t(translated.title).then((r) => (translated.title = r))
        );
      }

      // Services content
      translated.service_content.forEach((service: any) => {
        // Service title
        tasks.push(
          t(service.title).then((r) => (service.title = r))
        );

        // Button name
        tasks.push(
          t(service.button_name).then((r) => (service.button_name = r))
        );

        // Sub services
        service.sub_services.forEach((item: any) => {
          tasks.push(
            t(item.item).then((r) => (item.item = r))
          );
        });
      });

      await Promise.all(tasks);
      setTranslatedServices(translated);
    }

    translateServices();
  }, [language, originalServices]);

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={`${styles.header} text-center mb-5`}>
          <div
            dangerouslySetInnerHTML={{
              __html: translatedServices.title,
            }}
          />
        </div>

        <div className={styles.servicesWrapper}>
          {translatedServices.service_content.map(
            (service: any, index: number) => {
              const isActive = activeIndex === index;

              return (
                <div
                  key={index}
                  className={`${styles.serviceItem} ${isActive ? styles.active : ""
                    }`}
                  onClick={() => setActiveIndex(index)}
                >
                  {/* Vertical Header */}
                  <div className={styles.verticalHeader}>
                    <div className={styles.iconBox}>
                      <img
                        src={
                          isActive
                            ? getMediaUrl("/images/minus.svg")
                            : getMediaUrl("/images/add.svg")
                        }
                        alt="Toggle"
                        width={16}
                        height={16}
                      />
                    </div>
                    <h3 className={styles.verticalTitle}>
                      {service.title}
                    </h3>
                  </div>

                  {/* Expanded Content */}
                  <div className={styles.expandedWrapper}>
                    <div className={styles.expandedContent}>
                      <div className={styles.imageBlock}>
                        <img
                          src={getMediaUrl(service.img)}
                          alt={service.title}
                          width={400}
                          height={250}
                          className={styles.mainImage}
                        />
                      </div>

                      <div className={styles.detailsBlock}>
                        <ul className={styles.subServicesList}>
                          {service.sub_services.map(
                            (item: any, i: number) => (
                              <li key={i}>
                                <Link href={item.link}>
                                  {item.item}
                                  <img
                                    src={getMediaUrl("/images/arrow.svg")}
                                    alt="Arrow"
                                    width={16}
                                    height={16}
                                    className="ms-2"
                                  />
                                </Link>
                              </li>
                            )
                          )}
                        </ul>

                        <Link
                          href={service.button_link}
                          className={styles.readMore}
                        >
                          {service.button_name}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>
    </section>
  );
}
