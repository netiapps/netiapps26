"use client";

import React, { useRef, useState, useEffect, useCallback } from 'react';
import styles from './WhyChooseUs.module.scss';

interface WhyChooseUsProps {
    whyChooseUsData?: any;
    industriesApplicationData?: any;
    why?: any;
}

export default function WhyChooseUs({ whyChooseUsData, industriesApplicationData, why }: WhyChooseUsProps) {
    const activeData = whyChooseUsData || why;
    if (!activeData) return null;

    const mainTitle = activeData.title || (industriesApplicationData?.title || "Why Choose Us");

    // Support both API formats: 'reasons' (current API) and 'description' (legacy)
    const items = Array.isArray(activeData.reasons)
        ? activeData.reasons
        : Array.isArray(activeData.description)
            ? activeData.description
            : [];

    if (items.length === 0) return null;

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <h2 className={styles.title} dangerouslySetInnerHTML={{ __html: mainTitle }} />
                <SliderTrack items={items} />
            </div>
        </section>
    );
}

/* ── Slider extracted into its own component so hooks are unconditional ── */
function SliderTrack({ items }: { items: any[] }) {
    const trackRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const calculatePages = useCallback(() => {
        if (!trackRef.current) return;
        const track = trackRef.current;
        const scrollWidth = track.scrollWidth;
        const clientWidth = track.clientWidth;
        if (clientWidth >= scrollWidth) {
            setTotalPages(1);
        } else {
            setTotalPages(Math.ceil(scrollWidth / clientWidth));
        }
    }, []);

    useEffect(() => {
        calculatePages();
        window.addEventListener('resize', calculatePages);
        return () => window.removeEventListener('resize', calculatePages);
    }, [calculatePages, items]);

    const handleScroll = () => {
        if (!trackRef.current) return;
        const track = trackRef.current;
        const scrollLeft = track.scrollLeft;
        const clientWidth = track.clientWidth;
        const newIndex = Math.round(scrollLeft / clientWidth);
        setActiveIndex(newIndex);
    };

    const goToPage = (pageIndex: number) => {
        if (!trackRef.current) return;
        const clientWidth = trackRef.current.clientWidth;
        trackRef.current.scrollTo({
            left: clientWidth * pageIndex,
            behavior: 'smooth',
        });
    };

    return (
        <>
            <div
                className={styles.sliderTrack}
                ref={trackRef}
                onScroll={handleScroll}
            >
                {items.map((item: any, idx: number) => (
                    <div key={idx} className={styles.card}>
                        <div className={styles.numberCircle}>
                            <span>{String(item.number || idx + 1).padStart(2, '0')}</span>
                        </div>
                        <p className={styles.cardText}>{item.text || item.list_}</p>
                        {item.details && (
                            <div
                                className={styles.cardDesc}
                                dangerouslySetInnerHTML={{ __html: item.details }}
                            />
                        )}
                    </div>
                ))}
            </div>

            {totalPages > 1 && (
                <div className={styles.dots}>
                    {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                            key={i}
                            className={`${styles.dot} ${i === activeIndex ? styles.dotActive : ''}`}
                            onClick={() => goToPage(i)}
                            aria-label={`Go to page ${i + 1}`}
                        />
                    ))}
                </div>
            )}
        </>
    );
}
