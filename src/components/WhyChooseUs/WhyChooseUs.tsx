"use client";

import React from 'react';
import styles from './WhyChooseUs.module.scss';

interface WhyChooseUsProps {
    whyChooseUsData?: any;
    industriesApplicationData?: any; // To support the screenshot's header
    why?: any; // Backwards compatibility for previously existing service pages
}

export default function WhyChooseUs({ whyChooseUsData, industriesApplicationData, why }: WhyChooseUsProps) {
    // Determine the data source. Fallback to `why` if `whyChooseUsData` is empty (for services pages)
    const activeData = whyChooseUsData || why;

    if (!activeData) return null;

    // Based on the screenshot, it says "Industries Application \n Built for..."
    // as the title, but the items are from "why_choose_us". We'll combine them or use whyChooseUs title.
    const pillBadge = "Why Choose us";
    const mainTitle = activeData.title || (industriesApplicationData?.title || "What makes this different?");

    const items = Array.isArray(activeData.description) ? activeData.description : [];

    return (
        <section className={styles.whyChooseUsSection}>
            <div className="container">
                <div className={styles.header}>
                    <div className={styles.pillBadge}>{pillBadge}</div>
                    {mainTitle && <h2 className={styles.title} dangerouslySetInnerHTML={{ __html: mainTitle }} />}
                </div>

                <div className={styles.gridContainer}>
                    {items.map((item: any, idx: number) => (
                        <div key={idx} className={styles.gridItem}>
                            <h3 className={styles.itemTitle}>{item.list_}</h3>
                            <div 
                                className={styles.itemDesc} 
                                dangerouslySetInnerHTML={{ __html: item.details }} 
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
