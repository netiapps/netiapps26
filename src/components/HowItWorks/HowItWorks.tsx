"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import styles from './HowItWorks.module.scss';

interface HowItWorksProps {
    howItWorksData?: any;
}

export default function HowItWorks({ howItWorksData }: HowItWorksProps) {
    const [activeIndex, setActiveIndex] = useState(0);

    if (!howItWorksData) return null;

    const pillBadge = howItWorksData.how_it_works;
    const mainTitle = howItWorksData.title_; // the ACF field is 'title_'

    const rawHtml = howItWorksData.list || "";

    // Extract description from the first <p> tag
    const pMatch = rawHtml.match(/<p>([\s\S]*?)<\/p>/);
    const descriptionText = pMatch ? pMatch[1].trim() : "";

    // Extract items from <li> tags. We look for a bold title and then a text description.
    const liRegex = /<li>\s*(?:<b>)?\s*(.*?)\s*(?:<\/b>)?\s*(?:<br\s*\/?>|—|–)?\s*([\s\S]*?)<\/li>/gi;
    const steps: { id: number; title: string; description: string; image: any }[] = [];

    let match;
    while ((match = liRegex.exec(rawHtml)) !== null) {
        // match[1] should be the title, match[2] should be the content after the break/separator
        steps.push({
            id: steps.length,
            title: match[1] ? match[1].trim() : "",
            description: match[2] ? match[2].trim() : "",
            image: howItWorksData.image || null
        });
    }

    const currentStep = steps[activeIndex] || null;
    const hasImage = currentStep && currentStep.image;

    return (
        <section className={styles.howItWorksSection}>
            <div className="container">
                <div className={styles.header}>
                    {pillBadge && <div className={styles.pillBadge}>{pillBadge}</div>}
                    {mainTitle && <h2 className={styles.title} dangerouslySetInnerHTML={{ __html: mainTitle }} />}
                    {descriptionText && (
                        <p className={styles.description} dangerouslySetInnerHTML={{ __html: descriptionText }} />
                    )}
                </div>

                {steps.length > 0 && (
                    <div className={styles.contentGrid}>
                        <div className={styles.accordionColumn}>
                            <h3 className={styles.columnTitle}>Our Process</h3>
                            <div className={styles.accordion}>
                                {steps.map((step, index) => (
                                    <div
                                        key={step.id}
                                        className={`${styles.accordionItem} ${activeIndex === index ? styles.active : ''}`}
                                        onClick={() => setActiveIndex(index)}
                                    >
                                        <div className={styles.accordionHeader}>
                                            <h4 dangerouslySetInnerHTML={{ __html: step.title }} />
                                        </div>
                                        <div
                                            className={styles.accordionContent}
                                            style={{ maxHeight: activeIndex === index ? '200px' : '0' }}
                                        >
                                            <p dangerouslySetInnerHTML={{ __html: step.description }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Only show image column if data exists, avoiding broken default images */}
                        {hasImage && (
                            <div className={styles.imageColumn}>
                                <div className={styles.imageWrapper}>
                                    <img
                                        src={currentStep.image}
                                        alt={currentStep.title} // Fallback alt text
                                        className={styles.featuredImage}
                                        key={activeIndex}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}

