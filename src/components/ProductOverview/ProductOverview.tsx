"use client";

import React from 'react';
import styles from './ProductOverview.module.scss';
import Image from 'next/image';

interface ProductOverviewProps {
    overviewData?: any;
}

export default function ProductOverview({ overviewData }: ProductOverviewProps) {
    if (!overviewData) return null;

    const mainTitle = overviewData.title;
    const mainDesc = overviewData.description;
    const listTitle = overviewData.list_title;
    
    const hasList = Array.isArray(overviewData.list) && overviewData.list.length > 0;
    
    const imageUrl = overviewData.image ? overviewData.image : null; 

    return (
        <section className={styles.overviewSection}>
            <div className="container">
                <div className={styles.header}>
                    <div className={styles.pillBadge}>Product Overview</div>
                    {mainTitle && <h2 className={styles.title} dangerouslySetInnerHTML={{ __html: mainTitle }} />}
                    {mainDesc && (
                        <p className={styles.description} dangerouslySetInnerHTML={{ __html: mainDesc }} />
                    )}
                </div>

                <div className={styles.contentGrid}>
                    <div className={styles.imageColumn}>
                        {imageUrl && (
                            <img
                                src={imageUrl}
                                alt="Product Overview"
                                className={styles.dashboardImage}
                            />
                        )}
                    </div>

                    <div className={styles.textColumn}>
                        {listTitle && <h3 className={styles.columnTitle}>{listTitle}</h3>}
                        {hasList && (
                            <ul className={styles.featureList}>
                                {overviewData.list.map((item: any, idx: number) => (
                                    <li key={idx} dangerouslySetInnerHTML={{ __html: item.list }} />
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
