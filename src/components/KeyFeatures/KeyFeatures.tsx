"use client";

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
import styles from './KeyFeatures.module.scss';
import 'swiper/css';
import 'swiper/css/free-mode';

interface KeyFeaturesProps {
    keyFeaturesData?: any;
}

export default function KeyFeatures({ keyFeaturesData }: KeyFeaturesProps) {
    if (!keyFeaturesData) return null;

    const mainTitle = keyFeaturesData.title;
    const mainDesc = keyFeaturesData.description;

    // Fallback if list is missing
    const featuresList = Array.isArray(keyFeaturesData.list) ? keyFeaturesData.list : [];

    return (
        <section className={styles.keyFeaturesSection}>
            <div className="container">
                <div className={styles.header}>
                    <div className={styles.pillBadge}>Key Features</div>
                    {mainTitle && <h2 className={styles.title} dangerouslySetInnerHTML={{ __html: mainTitle }} />}
                    {mainDesc && (
                        <div className={styles.description} dangerouslySetInnerHTML={{ __html: mainDesc }} />
                    )}
                </div>
                {featuresList.length > 0 && (
                    <div className={styles.sliderContainer}>
                        <Swiper
                            modules={[FreeMode]}
                            spaceBetween={30}
                            slidesPerView={1.2}
                            freeMode={true}
                            breakpoints={{
                                576: { slidesPerView: 2.2 },
                                768: { slidesPerView: 2.5 },
                                992: { slidesPerView: 3.2 },
                                1200: { slidesPerView: 3.5 },
                            }}
                            className={styles.swiperInstance}
                        >
                            {featuresList.map((feature: any, index: number) => (
                                <SwiperSlide key={index} className={styles.slide}>
                                    <div className={styles.card}>
                                        {feature.image && (
                                            <div className={styles.iconWrapper}>
                                                <img
                                                    src={feature.image}
                                                    alt={feature.feature_name || "Feature Icon"}
                                                    className={styles.featureIcon}
                                                />
                                            </div>
                                        )}
                                        <h3
                                            className={styles.cardTitle}
                                            dangerouslySetInnerHTML={{ __html: feature.feature_name ? feature.feature_name.replace('\n', '<br />') : '' }}
                                        />
                                        <p className={styles.cardDescription}>{feature.feature}</p>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                )}
            </div>
        </section>
    );
}

