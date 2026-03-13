"use client";

import Image from 'next/image';
import Link from 'next/link';
import styles from './ProductBanner.module.scss';
import { getMediaUrl } from '@/lib/media';

export default function ProductBanner() {
    return (
        <section className={styles.heroSection}>
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-6">
                        <div className={styles.brandTitle}>
                            <div className={styles.iconBox}>
                                <Image
                                    src={getMediaUrl("/images/product_logo.png")}
                                    alt="Product Logo"
                                    width={60}
                                    height={60}
                                />
                            </div>
                            <div className={styles.brandText}>
                                <h3 className={styles.productName}>Document Lifecycle</h3>
                                <p className={styles.companyName}>by Netiapps</p>
                            </div>
                        </div>

                        <h1 className={styles.mainTitle}>
                            Document Lifecycle and workflow management
                        </h1>

                        <p className={styles.description}>
                            Built for: Banks, Enterprises &amp; Process-Driven
                            Organizations
                        </p>

                        <div className={styles.buttonGroup}>
                            <Link href="#" className={styles.btnPrimary}>
                                Get Demo
                            </Link>
                            <Link href="#" className={styles.btnPrimary}>
                                Download
                            </Link>
                        </div>
                    </div>
                    <div className="col-lg-6 mt-5 mt-lg-0">
                        <div className={styles.imageWrapper}>
                            <Image
                                src={getMediaUrl("/images/pro1.png")}
                                alt="Dashboard Mockup"
                                width={800}
                                height={600}
                                className={styles.heroImage}
                                priority
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
