"use client";

import React from 'react';
import styles from './ProductOverview.module.scss';

export default function ProductOverview() {
    return (
        <section className={styles.overviewSection}>
            <div className="container">
                <div className={styles.header}>
                    <div className={styles.pillBadge}>Product Overview</div>
                    <h2 className={styles.title}>What Is Document Lifecycle &amp; Workflow Management?</h2>
                    <p className={styles.description}>
                        A fully customized web application designed to manage documents from creation to archival,
                        while automating approvals, tracking every action, and ensuring compliance at every stage of
                        the document lifecycle.
                    </p>
                </div>

                <div className={styles.contentGrid}>
                    <div className={styles.imageColumn}>
                        <img
                            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800&h=600"
                            alt="Document Management Dashboard"
                            className={styles.dashboardImage}
                        />
                    </div>

                    <div className={styles.textColumn}>
                        <h3 className={styles.columnTitle}>What It Does</h3>
                        <ul className={styles.featureList}>
                            <li>
                                Centralizes all organizational documents
                                in a single, secure repository
                            </li>
                            <li>
                                Automates multi-level approval workflows
                                to streamline document processing
                            </li>
                            <li>
                                Provides real-time visibility into document
                                status, ownership, and history
                            </li>
                            <li>
                                Maintains complete, tamper-proof audit
                                trails for transparency and compliance
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
