"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import styles from './TheProblem.module.scss';
import { ChevronDown, ChevronUp } from 'lucide-react';

const challenges = [
    {
        id: 0,
        title: "Multiple document versions everywhere",
        description: "Eliminate repetitive tasks with intelligent automation built specifically for your team's workflow.",
        image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=600&h=600"
    },
    {
        id: 1,
        title: "Slow approval cycles",
        description: "Streamline the review process so your documents are approved in minutes, not days.",
        image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600&h=600"
    },
    {
        id: 2,
        title: "Lack of visibility",
        description: "Always know where a document stands in its lifecycle and whose turn it is to act.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600&h=600"
    },
    {
        id: 3,
        title: "Audit and compliance pressure",
        description: "Maintain a complete history of all document changes and interactions to satisfy regulatory requirements easily.",
        image: "https://images.unsplash.com/photo-1450101499163-c8848c66cb85?auto=format&fit=crop&q=80&w=600&h=600"
    },
    {
        id: 4,
        title: "Security vulnerabilities",
        description: "Ensure your sensitive documents are protected with enterprise-grade security and role-based access.",
        image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=600&h=600"
    }
];

export default function TheProblem() {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <section className={styles.problemSection}>
            <div className="container">
                <div className={styles.header}>
                    <div className={styles.pillBadge}>The Problem</div>
                    <h2 className={styles.title}>Documents shouldn&apos;t live in people inboxes.</h2>
                    <p className={styles.description}>
                        In many organizations, document management is far from efficient. Files are scattered across shared drives,
                        approvals get delayed in email threads, ownership is unclear, and when audit time arrives, teams scramble to
                        piece everything together.
                    </p>
                </div>

                <div className={styles.contentGrid}>
                    <div className={styles.accordionColumn}>
                        <h3 className={styles.columnTitle}>Common Challenges Organizations Face</h3>
                        <div className={styles.accordion}>
                            {challenges.map((challenge, index) => (
                                <div
                                    key={challenge.id}
                                    className={`${styles.accordionItem} ${activeIndex === index ? styles.active : ''}`}
                                    onClick={() => setActiveIndex(index)}
                                >
                                    <div className={styles.accordionHeader}>
                                        <h4>{challenge.title}</h4>
                                    </div>
                                    <div
                                        className={styles.accordionContent}
                                        style={{ maxHeight: activeIndex === index ? '200px' : '0' }}
                                    >
                                        <p>{challenge.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.imageColumn}>
                        <div className={styles.imageWrapper}>
                            <img
                                src={challenges[activeIndex].image}
                                alt={challenges[activeIndex].title}
                                className={styles.featuredImage}
                                key={activeIndex} // This forces a re-render/animation if we add one later
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
