"use client";

import React, { useState } from 'react';
import styles from './HowItWorks.module.scss';

interface HowItWorksProps {
    howItWorksData?: any;
}

function HowItWorksBlock({ block, blockIndex }: { block: any; blockIndex: number }) {
    const [activeIndex, setActiveIndex] = useState(0);

    const title = block?.title;
    const description = block?.description || "";
    const image = block?.image || null;
    const imageSrc = image ? (typeof image === 'object' ? image.url : image) : null;

    const steps: { title: string; description: string }[] = (
        Array.isArray(block?.list) ? block.list : []
    ).map((item: any) => {
        const text: string = item.list || "";
        const splitIndex = text.search(/[-—–]/);
        if (splitIndex !== -1) {
            return {
                title: text.substring(0, splitIndex).trim(),
                description: text.substring(splitIndex + 1).trim(),
            };
        }
        return { title: text, description: "" };
    });

    // even index (0, 2, …) → image left; odd index (1, 3, …) → image right
    const imageLeft = blockIndex % 2 === 0;

    return (
        <div className={styles.block}>
            {block?.how_it_works && (
                <div className={styles.blockBadge}>{block.how_it_works}</div>
            )}

            <div className={`${styles.contentGrid} ${imageLeft ? styles.imageLeftGrid : ''}`}>

                {/* Image — rendered first in DOM always, CSS order controls visual position */}
                {imageSrc && (
                    <div className={`${styles.imageColumn} ${imageLeft ? styles.orderFirst : styles.orderLast}`}>
                        <div className={styles.imageWrapper}>
                            <img
                                src={imageSrc}
                                alt={title || 'How it works'}
                                className={styles.featuredImage}
                            />
                        </div>
                    </div>
                )}

                <div className={`${styles.accordionColumn} ${imageLeft ? styles.orderLast : styles.orderFirst}`}>
                    {title && (
                        <h3 className={styles.title} dangerouslySetInnerHTML={{ __html: title }} />
                    )}
                    {description && (
                        <div className={styles.description} dangerouslySetInnerHTML={{ __html: description }} />
                    )}

                    {steps.length > 0 && (
                        <div className={styles.accordion}>
                            {steps.map((step, index) => (
                                <div
                                    key={index}
                                    className={`${styles.accordionItem} ${activeIndex === index ? styles.active : ''}`}
                                    onClick={() => setActiveIndex(index)}
                                >
                                    <div className={styles.accordionHeader}>
                                        <span className={styles.stepNum}>{String(index + 1).padStart(2, '0')}</span>
                                        <h4 dangerouslySetInnerHTML={{ __html: step.title }} />
                                        <span className={styles.accordionChevron}>
                                            {activeIndex === index ? '−' : '+'}
                                        </span>
                                    </div>
                                    <div
                                        className={styles.accordionContent}
                                        style={{ maxHeight: activeIndex === index ? '300px' : '0' }}
                                    >
                                        {step.description && (
                                            <div dangerouslySetInnerHTML={{ __html: step.description }} />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

export default function HowItWorks({ howItWorksData }: HowItWorksProps) {
    if (!howItWorksData) return null;

    const blocks: any[] = Array.isArray(howItWorksData)
        ? howItWorksData
        : (howItWorksData.list && Array.isArray(howItWorksData.list) ? howItWorksData.list : [howItWorksData]);

    if (blocks.length === 0) return null;

    const sectionBadge = (!Array.isArray(howItWorksData) ? howItWorksData.tag : null) || (blocks.length > 0 && blocks[0] ? blocks[0].how_it_works : null) || "How It Works";

    return (
        <section className={styles.howItWorksSection}>
            <div className="container">
                <div className={styles.header}>
                    <div className={styles.pillBadge}>{sectionBadge}</div>
                </div>

                <div className={styles.blocksWrapper}>
                    {blocks.map((block, idx) => (
                        <HowItWorksBlock key={idx} block={block} blockIndex={idx} />
                    ))}
                </div>
            </div>
        </section>
    );
}
