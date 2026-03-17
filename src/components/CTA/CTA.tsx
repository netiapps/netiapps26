"use client";

import React from 'react';
import Link from 'next/link';
import styles from './CTA.module.scss';

interface CTAProps {
    ctaData?: any;
}

export default function CTA({ ctaData }: CTAProps) {
    if (!ctaData) return null;

    const rawHtml = ctaData.description || "";
    
    // Extract heading from the string (h2, h3, or h4)
    const hMatch = rawHtml.match(/<h[1-6]>([\s\S]*?)<\/h[1-6]>/i);
    const title = hMatch ? hMatch[1].trim() : "Ready to see it working for your team?";

    // Extract paragraph from the string
    const pMatch = rawHtml.match(/<p>([\s\S]*?)<\/p>/i);
    const description = pMatch ? pMatch[1].trim() : "We’ll walk you through the platform with your real use cases—no slides, no scripts, no generic demos. Just an honest look at whether this is the right fit.";

    // If button text comes from ACF, render it; otherwise default payload fallback
    const buttonText = ctaData.button || "Request a Demo";
    const buttonLink = ctaData.link || "#";

    return (
        <section className={styles.ctaSection}>
            <div className="container">
                <div className={styles.contentWrapper}>
                    {title && <h2 className={styles.title} dangerouslySetInnerHTML={{ __html: title }} />}
                    {description && <p className={styles.description} dangerouslySetInnerHTML={{ __html: description }} />}
                    
                    <div className={styles.buttonGroup}>
                        {buttonText && (
                            <Link href={buttonLink} className={styles.primaryBtn}>
                                {buttonText}
                            </Link>
                        )}
                        <Link href="/contact" className={styles.secondaryLink}>
                            Book a Free Consultation
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
