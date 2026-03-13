"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import styles from './HowItWorks.module.scss';

const steps = [
    {
        id: 0,
        title: "Requirement Analysis & Workflow Mapping",
        description: "A detailed assessment of your current document workflows, approval hierarchies, user roles, and compliance requirements.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800&h=600"
    },
    {
        id: 1,
        title: "Solution Design & UX Planning",
        description: "Designing a tailored solution with an intuitive user experience that matches your organizational needs.",
        image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800&h=600"
    },
    {
        id: 2,
        title: "Custom Development",
        description: "Building the custom application robustly based on the approved design and workflow requirements.",
        image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800&h=600"
    },
    {
        id: 3,
        title: "Testing & Quality Assurance",
        description: "Rigorous testing across multiple scenarios to ensure reliability, security, and performance.",
        image: "https://images.unsplash.com/photo-1450101499163-c8848c66cb85?auto=format&fit=crop&q=80&w=800&h=600"
    },
    {
        id: 4,
        title: "Deployment & Go-Live",
        description: "Seamless rollout of the system within your organization with proper training and support.",
        image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=800&h=600"
    }
];

export default function HowItWorks() {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <section className={styles.howItWorksSection}>
            <div className="container">
                <div className={styles.header}>
                    <div className={styles.pillBadge}>How it works</div>
                    <h2 className={styles.title}>From scattered chaos to structured control.</h2>
                    <p className={styles.description}>
                        We don&apos;t hand you a generic tool and expect you to adapt to it. Instead, we understand your
                        existing workflows and build a system tailored around them—ensuring the solution fits your
                        processes, not the other way around.
                    </p>
                </div>

                <div className={styles.contentGrid}>
                    <div className={styles.accordionColumn}>
                        <h3 className={styles.columnTitle}>Common Challenges Organizations Face</h3>
                        <div className={styles.accordion}>
                            {steps.map((step, index) => (
                                <div
                                    key={step.id}
                                    className={`${styles.accordionItem} ${activeIndex === index ? styles.active : ''}`}
                                    onClick={() => setActiveIndex(index)}
                                >
                                    <div className={styles.accordionHeader}>
                                        <h4>{step.title}</h4>
                                    </div>
                                    <div
                                        className={styles.accordionContent}
                                        style={{ maxHeight: activeIndex === index ? '200px' : '0' }}
                                    >
                                        <p>{step.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.imageColumn}>
                        <div className={styles.imageWrapper}>
                            <img
                                src={steps[activeIndex].image}
                                alt={steps[activeIndex].title}
                                className={styles.featuredImage}
                                key={activeIndex}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
