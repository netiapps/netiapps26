"use client";

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
import styles from './KeyFeatures.module.scss';
import 'swiper/css';
import 'swiper/css/free-mode';

const features = [
    {
        title: "Role-Based\nAccess Control",
        description: "Fine-grained control over who can create, view, approve, or modify. Access is precisely defined so each role sees only what's necessary",
        icon: "https://cdn-icons-png.flaticon.com/512/2040/2040504.png"
    },
    {
        title: "Workflow\nAutomation",
        description: "Single or multi-level approvals with conditional routing. Documents move automatically — no chasing, no manual follow-up emails",
        icon: "https://cdn-icons-png.flaticon.com/512/2040/2040504.png"
    },
    {
        title: "Real-Time\nDocument Tracking",
        description: "Always know where a document stands, who has it, and how long it has been sitting there. Full visibility at every stage.",
        icon: "https://cdn-icons-png.flaticon.com/512/1164/1164338.png"
    },
    {
        title: "Reporting &\nAnalytics",
        description: "Track approval timelines, detect bottlenecks, and access compliance records anytime, not just before an audit.",
        icon: "https://cdn-icons-png.flaticon.com/512/2921/2921222.png"
    }
];

export default function KeyFeatures() {
    return (
        <section className={styles.keyFeaturesSection}>
            <div className="container">
                <div className={styles.header}>
                    <div className={styles.pillBadge}>Key Features</div>
                    <h2 className={styles.title}>Everything you need. Nothing you don&apos;t.</h2>
                    <p className={styles.description}>
                        Built for organisations that handle documents seriously—from the front-line employee
                        creating a draft to the senior executive signing off.
                    </p>
                </div>
            </div>

            <div className={styles.sliderContainer}>
                <Swiper
                    modules={[FreeMode]}
                    spaceBetween={30}
                    slidesPerView={1.2}
                    freeMode={true}
                    centeredSlides={true}
                    breakpoints={{
                        576: { slidesPerView: 2.2 },
                        768: { slidesPerView: 2.5 },
                        992: { slidesPerView: 3.2 },
                        1200: { slidesPerView: 3.5 },
                    }}
                    className={styles.swiperInstance}
                >
                    {features.map((feature, index) => (
                        <SwiperSlide key={index} className={styles.slide}>
                            <div className={styles.card}>
                                <div className={styles.iconWrapper}>
                                    <img src={feature.icon} alt="Feature Icon" className={styles.featureIcon} />
                                </div>
                                <h3
                                    className={styles.cardTitle}
                                    dangerouslySetInnerHTML={{ __html: feature.title.replace('\n', '<br />') }}
                                />
                                <p className={styles.cardDescription}>{feature.description}</p>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
}
