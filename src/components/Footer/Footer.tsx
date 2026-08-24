"use client";

import Link from "next/link";
import Image from "next/image";
import { Twitter, Linkedin } from "lucide-react";
import styles from "./Footer.module.scss";
import { useEffect, useState } from "react";
import { cachedTranslate, useLanguage } from "@/context/LanguageContext";
import { getMediaUrl } from "@/lib/media";

export default function Footer(footer: any) {
  const { language, translate } = useLanguage();

  const originalFooter = footer.footer;
  const [translatedFooter, setTranslatedFooter] = useState(originalFooter);

  useEffect(() => {
    async function translateFooter() {
      if (language.toUpperCase() === "EN") {
        setTranslatedFooter(originalFooter);
        return;
      }

      const translated = JSON.parse(JSON.stringify(originalFooter));
      const tasks: Promise<any>[] = [];
      const t = (text: string) =>
        cachedTranslate(text, language, translate);

      tasks.push(
        t(originalFooter.footer_top.title).then(r => translated.footer_top.title = r),
        t(originalFooter.footer_top.button).then(r => translated.footer_top.button = r),
        t(originalFooter.copyright).then(r => translated.copyright = r)
      );

      translated.menu.forEach((column: any) => {
        tasks.push(t(column.title).then(r => column.title = r));
        column.menu_list.forEach((item: any) => {
          tasks.push(t(item.name).then(r => item.name = r));
        });
      });

      translated.address_field.forEach((addr: any) => {
        tasks.push(
          t(addr.country).then(r => addr.country = r),
          t(addr.address).then(r => addr.address = r)
        );
      });

      await Promise.all(tasks);
      setTranslatedFooter(translated);
    }

    translateFooter();
  }, [language]);

  const addresses = translatedFooter.address_field;

  // Default first country
  const [activeCountry, setActiveCountry] = useState(addresses[0]);

  // Update active country when language changes
  useEffect(() => {
    setActiveCountry(addresses[0]);
  }, [addresses]);

  return (
    <footer className={styles.footer}>
      <div className="container">
        {/* Hire CTA */}
        <div className={styles.hireCta}>
          <div className="d-flex flex-column flex-md-row align-items-center justify-content-between p-3">
            <h2 className={styles.hireTitle}>
              {translatedFooter.footer_top.title}
            </h2>

            <Link
              href={translatedFooter.footer_top.link}
              className={styles.hireBtn}
            >
              {translatedFooter.footer_top.button}
            </Link>
          </div>
        </div>

        {/* Main Footer */}
        <div className={styles.footerContent}>
          <div className="row">
            {translatedFooter.menu.map((element: any, index: number) => (
              <div
                className="col-lg-3 col-md-6 mb-4 mb-lg-0"
                key={index}
              >
                <h3 className={styles.columnTitle}>{element.title}</h3>

                <ul className={styles.linkList}>
                  {element.menu_list.map((ele: any, ind: number) => (
                    <li key={ind}>
                      <Link href={ele.link}>{ele.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Address Section */}
            <div className="col-lg-3 col-md-6">
              <div className={styles.locationTabs}>
                {addresses.map((element: any, index: number) => (
                  <button
                    key={index}
                    className={`${styles.tabBtn} ${activeCountry.country === element.country
                      ? styles.active
                      : ""
                      }`}
                    onClick={() => setActiveCountry(element)}
                  >
                    {element.country}
                  </button>
                ))}
              </div>

              <div className={styles.addressInfo}>
                <p>{activeCountry.address}</p>

                <p className="mt-4">
                  Email:{" "}
                  <a href={`mailto:${activeCountry.email}`}>
                    {activeCountry.email}
                  </a>
                </p>
              </div>

              <div className={styles.certificates}>
                {translatedFooter.certificates.map(
                  (element: any, index: number) => (
                    <img
                      key={index}
                      src={getMediaUrl(element.img)}
                      alt={element.name}
                      width={50}
                      height={50}
                    />
                  )
                )}
              </div>

              <div className={styles.socialLinks}>
                <a href={footer.footer.social_media.twitter} target="_blank" rel="noopener noreferrer"><Twitter size={20} /></a>
                <a href={footer.footer.social_media.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin size={20} /></a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className={styles.copyrightBar}>
        <div className="container">
          <p className="mb-0 text-center">
            {translatedFooter.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
