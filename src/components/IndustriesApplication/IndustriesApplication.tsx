"use client";

import React from 'react';
import Image from 'next/image';
import styles from './IndustriesApplication.module.scss';
import { getMediaUrl } from '@/lib/media';

const industries = [
    {
        id: 1,
        title: "Banking & Financial Services",
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800&h=500"
    },
    {
        id: 2,
        title: "Government & Public Sector",
        image: "https://images.unsplash.com/photo-1596489392224-5d51de58f50c?auto=format&fit=crop&q=80&w=800&h=500"
    },
    {
        id: 3,
        title: "Healthcare",
        image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&q=80&w=800&h=500"
    },
    {
        id: 4,
        title: "Enterprises & Manufacturing",
        image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800&h=500"
    }
];

export default function IndustriesApplication() {
    return (
        <section className={styles.industriesSection}>
            <div className="container">
                <div className={styles.header}>
                    <div className={styles.pillBadge}>Industries Application</div>
                    <h2 className={styles.title}>
                        Built for organizations where documents<br />
                        actually matter.
                    </h2>
                    <p className={styles.description}>
                        We work best with teams that have real document volume, real compliance obligations, and
                        real consequences when something goes wrong.
                    </p>
                </div>

                <div className={styles.grid}>
                    {industries.map((ind) => (
                        <div key={ind.id} className={styles.card}>
                            <div className={styles.imageWrapper}>
                                <img
                                    src={ind.image}
                                    alt={ind.title}
                                    className={styles.image}
                                />
                            </div>
                            <h3 className={styles.cardTitle}>{ind.title}</h3>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
