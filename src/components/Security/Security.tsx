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

    // description object in ACF is an HTML string containing both paragraphs and <ul> tags.
    const rawHtml = securityData.description || "";

    // More robust splitting rather than strict <p> / <ul> regex
    const ulIndex = typeof rawHtml === 'string' ? rawHtml.indexOf('<ul') : -1;
    
    let descriptionText = "";
    let ulContent = "";

    if (ulIndex !== -1) {
        descriptionText = rawHtml.substring(0, ulIndex).trim();
        const afterUlStart = rawHtml.substring(ulIndex);
        
        // Extract inner HTML of the first <ul>
        const ulMatch = afterUlStart.match(/<ul[^>]*>([\s\S]*?)<\/ul>/i);
        if (ulMatch) {
            ulContent = ulMatch[1];
        }
    } else {
        descriptionText = rawHtml;
    }
    
    // Default image from local if provided in the screenshot? No, the user says "dont had static data if data is not available"
    // So we just render dynamic image, or if missing we hide the image explicitly.
    const imageUrl = securityData.image?.url || (typeof securityData.image === 'string' ? securityData.image : null);

    return (
        <section className={styles.securitySection}>
            <div className="container">
                <div className={styles.header}>
                    {pillBadge && <div className={styles.pillBadge}>{pillBadge}</div>}
                    {mainTitle && <h2 className={styles.title} dangerouslySetInnerHTML={{ __html: mainTitle }} />}
                    {descriptionText && (
                        <div className={styles.description} dangerouslySetInnerHTML={{ __html: descriptionText }} />
                    )}
                </div>

                <div className={styles.contentGrid}>
                    <div className={styles.textColumn}>
                        {ulContent && (
                            <ul className={styles.featureList} dangerouslySetInnerHTML={{ __html: ulContent }} />
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
