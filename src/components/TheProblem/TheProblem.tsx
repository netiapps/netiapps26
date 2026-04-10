"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import styles from './TheProblem.module.scss';

interface TheProblemProps {
    problemData?: any;
}

export default function TheProblem({ problemData }: TheProblemProps) {
    const [activeIndex, setActiveIndex] = useState(0);

    // Don't render if no data
    if (!problemData) {
        return null; // Or some meaningful fallback. But per user "dont had static data"
    }

    const problemBadge = problemData.tag || problemData.the_problem;
    const mainTitle = problemData.title || problemData.ttile; // fallback for spelling error in ACF JSON
    const mainDesc = problemData.description;
    const listTitle = problemData.list_title;

    const hasList = Array.isArray(problemData.list) && problemData.list.length > 0;

    const challenges = hasList ? problemData.list.map((item: any, idx: number) => {
        // the ACF data string combines title and desc (e.g. "Slow approval cycles—Manual routing causes...").
        const listText = item.list || "";
        const parts = listText.split(/—|–/);
        const title = parts[0]?.trim() || listText;
        const description = parts[1]?.trim() || "";
        
        // Use individual item image or global problem image, otherwise false/null
        const imageUrl = item.image ? item.image : (problemData.image ? problemData.image : null);

        return {
            id: idx,
            title,
            description,
            image: imageUrl
        };
    }) : [];

    const currentChallenge = challenges[activeIndex] || null;

    return (
        <section className={styles.problemSection}>
            <div className="container">
                <div className={styles.header}>
                    {problemBadge && <div className={styles.pillBadge}>{problemBadge}</div>}
                    {mainTitle && <h2 className={styles.title} dangerouslySetInnerHTML={{ __html: mainTitle }} />}
                    {mainDesc && (
                        <div className={styles.description} dangerouslySetInnerHTML={{ __html: mainDesc }} />
                    )}
                </div>

                {hasList && (
                    <div className={styles.contentGrid}>
                        <div className={styles.accordionColumn}>
                            {listTitle && <h3 className={styles.columnTitle}>{listTitle}</h3>}
                            <div className={styles.accordion}>
                                {challenges.map((challenge: any, index: number) => (
                                    <div
                                        key={challenge.id}
                                        className={`${styles.accordionItem} ${activeIndex === index ? styles.active : ''}`}
                                        onClick={() => setActiveIndex(index)}
                                    >
                                        <div className={styles.accordionHeader}>
                                            <h4 dangerouslySetInnerHTML={{ __html: challenge.title }} />
                                            <span className={styles.accordionChevron}>
                                                {activeIndex === index ? '−' : '+'}
                                            </span>
                                        </div>
                                        <div
                                            className={styles.accordionContent}
                                            style={{ maxHeight: activeIndex === index ? '200px' : '0' }}
                                        >
                                            {challenge.description && (
                                                <div dangerouslySetInnerHTML={{ __html: challenge.description }} />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {currentChallenge?.image && (
                            <div className={styles.imageColumn}>
                                <div className={styles.imageWrapper}>
                                    <img
                                        src={currentChallenge.image}
                                        alt={currentChallenge.title}
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

