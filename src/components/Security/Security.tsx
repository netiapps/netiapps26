"use client";

import React from 'react';
import styles from './Security.module.scss';
import Image from 'next/image';

interface SecurityProps {
    securityData?: any;
}

export default function Security({ securityData }: SecurityProps) {
    if (!securityData) return null;

    const pillBadge = securityData.tag;
    const mainTitle = securityData.title;

    // description object in ACF is an HTML string containing both <p> and <ul> tags.
    const rawHtml = securityData.description || "";

    // Extract the first <p> section for the subtitle
    const pMatch = rawHtml.match(/<p>([\s\S]*?)<\/p>/);
    const descriptionText = pMatch ? pMatch[1].trim() : "";

    // Extract the <ul> list items separately
    const ulMatch = rawHtml.match(/<ul>([\s\S]*?)<\/ul>/);
    
    // Default image from local if provided in the screenshot? No, the user says "dont had static data if data is not available"
    // So we just render dynamic image, or if missing we hide the image explicitly.
    const imageUrl = securityData.image ? securityData.image : null;

    return (
        <section className={styles.securitySection}>
            <div className="container">
                <div className={styles.header}>
                    {pillBadge && <div className={styles.pillBadge}>{pillBadge}</div>}
                    {mainTitle && <h2 className={styles.title} dangerouslySetInnerHTML={{ __html: mainTitle }} />}
                    {descriptionText && (
                        <p className={styles.description} dangerouslySetInnerHTML={{ __html: descriptionText }} />
                    )}
                </div>

                <div className={styles.contentGrid}>
                    <div className={styles.textColumn}>
                        {ulMatch && (
                            <ul className={styles.featureList} dangerouslySetInnerHTML={{ __html: ulMatch[1] }} />
                        )}
                    </div>
                    
                    <div className={styles.imageColumn}>
                        {imageUrl && (
                            <img
                                src={imageUrl}
                                alt={pillBadge || "Security"}
                                className={styles.featuredImage}
                            />
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
