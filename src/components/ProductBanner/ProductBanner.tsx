import Link from 'next/link';
import styles from './ProductBanner.module.scss';

export default function ProductBanner() {
    return (
        <section className={styles.productBanner}>
            <div className="container">
                <div className={styles.content}>
                    <Link href="#" className={styles.pillBadge}>
                        <span className={styles.pillText}>Saying Goodbye: The End of Specify</span>
                        <span className={styles.pillIcon}>
                            <svg
                                width="16"
                                height="16"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </span>
                    </Link>

                    <h1 className={styles.title}>
                        <span className={styles.gradientText}>Your Design Token Engine</span>
                    </h1>

                    <p className={styles.subtitle}>
                        Flexible and powerful, Specify makes it easy to build the exact<br className={styles.desktopBr} />
                        Design Token workflow your Design System needs.
                    </p>
                </div>
            </div>
        </section>
    );
}
