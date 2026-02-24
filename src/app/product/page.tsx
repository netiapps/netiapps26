import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import LatestInsight from '@/components/LatestInsight';
import ProductBanner from '@/components/ProductBanner/ProductBanner';
import styles from './page.module.scss';

export const metadata: Metadata = {
    title: "Our Product | NetiApps",
    description: "Discover our comprehensive suite of innovative products tailored to elevate your business.",
};

export default function ProductPage() {
    return (
        <main>
            <ProductBanner />

            {/* Main Product Info Section */}
            <section className={styles.section}>
                <div className="container">
                    <div className={styles.grid}>
                        <div className={styles.content}>
                            <h2>Revolutionize Your Workflow</h2>
                            <p>
                                Our product is designed to streamline your business operations and maximize efficiency.
                                With an intuitive interface and powerful features, you can take your team's productivity to the next level.
                            </p>
                            <ul>
                                <li>Seamless Integration with your existing tools</li>
                                <li>Advanced analytics and reporting capabilities</li>
                                <li>24/7 dedicated customer support</li>
                                <li>Enterprise-grade security and compliance</li>
                            </ul>
                            <Link href="/contact" className={styles.btn}>
                                Get Started Today
                            </Link>
                        </div>
                        <div className={styles.imageWrapper}>
                            <img
                                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600&h=500"
                                alt="Product Dashboard"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Product Features Section */}
            <section className={styles.featuresSection}>
                <div className="container">
                    <h2>Key Features</h2>
                    <div className={styles.featuresGrid}>
                        <div className={styles.featureCard}>
                            <h3>High Performance</h3>
                            <p>Experience lightning-fast load times and smooth interactions built on modern, robust architecture.</p>
                        </div>
                        <div className={styles.featureCard}>
                            <h3>Scalable Infrastructure</h3>
                            <p>Our platform grows with your business, effortlessly handling increased data loads and active users.</p>
                        </div>
                        <div className={styles.featureCard}>
                            <h3>Highly Customizable</h3>
                            <p>Tailor the entire experience to match your brand and specific business needs with flexible settings.</p>
                        </div>
                    </div>
                </div>
            </section>

            <LatestInsight />
        </main>
    );
}
