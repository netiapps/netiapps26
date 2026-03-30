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

    const data = Array.isArray(howItWorksData) ? howItWorksData[0] : howItWorksData;
    
    if (!data) return null;

    const pillBadge = data.how_it_works;
    const mainTitle = data.title || data.title_; // ACF field might be 'title' or 'title_'

    const descriptionText = data.description || "";

    const steps: { id: number; title: string; description: string; image: any }[] = [];

    const stepsData = Array.isArray(data.list) ? data.list : [];
    
    stepsData.forEach((item: any) => {
        const text = item.list || "";
        let stepTitle = "";
        let stepDesc = "";
        
        // Split by dash/em-dash/en-dash
        const splitIndex = text.search(/[-—–]/);
        if (splitIndex !== -1) {
            stepTitle = text.substring(0, splitIndex).trim();
            // remove leading spaces
            stepDesc = text.substring(splitIndex + 1).trim();
        } else {
            stepTitle = text;
        }

        steps.push({
            id: steps.length,
            title: stepTitle,
            description: stepDesc,
            image: data.image || null
        });
    });

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

