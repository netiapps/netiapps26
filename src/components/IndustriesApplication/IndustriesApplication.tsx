"use client";

import React from 'react';
import Image from 'next/image';
import styles from './IndustriesApplication.module.scss';

interface IndustriesApplicationProps {
    industriesApplicationData?: any;
}

export default function IndustriesApplication({ industriesApplicationData }: IndustriesApplicationProps) {
    if (!industriesApplicationData) return null;

    const mainTitle = industriesApplicationData.title;
    const mainDesc = industriesApplicationData.description;
    const industriesList = Array.isArray(industriesApplicationData.industry_details) ? industriesApplicationData.industry_details : [];

    return (
        <section className={styles.industriesSection}>
            <div className="container">
                <div className={styles.header}>
                    <div className={styles.pillBadge}>Industries Application</div>
                    {mainTitle && <h2 className={styles.title} dangerouslySetInnerHTML={{ __html: mainTitle }} />}
                    {mainDesc && (
                        <p className={styles.description} dangerouslySetInnerHTML={{ __html: mainDesc }} />
                    )}
                </div>

                <div className={styles.grid}>
                    {industriesList.map((ind: any, index: number) => {
                        const rawHtml = ind.industry_description || "";
                        
                        // Extract title cleanly from <p><b>...</b></p>
                        const pMatch = typeof rawHtml === 'string' ? rawHtml.match(/<p>\s*<b>([\s\S]*?)<\/b>\s*<\/p>/i) : null;
                        const cardTitle = pMatch ? pMatch[1].trim() : "";

                        // Extract list cleanly from <ul>...</ul>
                        const ulMatch = typeof rawHtml === 'string' ? rawHtml.match(/<ul>([\s\S]*?)<\/ul>/i) : null;
                        const listHtml = ulMatch ? ulMatch[1] : "";

                        return (
                            <div key={index} className={styles.card}>
                                {ind.industry_image && (
                                    <div className={styles.imageWrapper}>
                                        <img
                                            src={ind.industry_image}
                                            alt={cardTitle || "Industry"}
                                            className={styles.image}
                                        />
                                    </div>
                                )}
                                {cardTitle && <h3 className={styles.cardTitle} dangerouslySetInnerHTML={{ __html: cardTitle }} />}
                                {listHtml && (
                                    <ul className={styles.featureList} dangerouslySetInnerHTML={{ __html: listHtml }} />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

