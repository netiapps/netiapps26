import type { Metadata } from 'next';
import Link from 'next/link';
import { ApiService } from '@/services/api.service';
import styles from './page.module.scss';
import { getMediaUrl } from '@/lib/media';

export const metadata: Metadata = {
    title: 'Our Products | NetiApps',
    description: 'Explore the full suite of NetiApps products — innovative digital solutions built to power your business forward.',
    alternates: {
        canonical: '/products',
    },
};

async function getAllProducts() {
    try {
        const baseUrl = new ApiService().getBaseUrl();
        const res = await fetch(`${baseUrl}wp-json/wp/v2/product?per_page=20`, {
            next: { revalidate: 60 },
        });
        if (!res.ok) return [];
        return await res.json();
    } catch {
        return [];
    }
}

export default async function ProductsPage() {
    const products = await getAllProducts();

    // Sort alphabetically by product title
    const sortedProducts = [...products].sort((a: any, b: any) => {
        const nameA = (a?.acf?.banner?.title || a?.title?.rendered || '').replace(/<[^>]+>/g, '').toLowerCase();
        const nameB = (b?.acf?.banner?.title || b?.title?.rendered || '').replace(/<[^>]+>/g, '').toLowerCase();
        return nameA.localeCompare(nameB);
    });

    return (
        <main className={styles.productsPage}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className="container">
                    <div className={styles.heroBadge}>Our Products</div>
                    <h1 className={styles.heroTitle}>
                        Innovative Solutions <br />
                        <span className={styles.heroAccent}>Built for Your Business</span>
                    </h1>
                    <p className={styles.heroSubtitle}>
                        We are now a software company delivering development services and products - customized applications, with a strong focus on the banking industry. Our solutions empower financial institutions with efficient, secure, and scalable digital capabilities
                    </p>
                </div>

                {/* Decorative blobs */}
                <div className={styles.blobTopRight} aria-hidden="true" />
                <div className={styles.blobBottomLeft} aria-hidden="true" />
            </section>

            {/* Products Grid */}
            <section className={styles.productsSection}>
                <div className="container">
                    {sortedProducts.length === 0 ? (
                        <div className={styles.emptyState}>
                            <p>No products available at the moment. Please check back soon.</p>
                        </div>
                    ) : (
                        <div className={styles.productsGrid}>
                            {sortedProducts.map((product: any, index: number) => {
                                const acf = product?.acf;
                                const banner = acf?.banner;
                                const slug = product?.slug;

                                const productName = banner?.title || product?.title?.rendered || 'Product';
                                const builtFor = banner?.built_for;
                                const demoButton = banner?.banner_details?.get_demo_button;
                                const demoLink = banner?.banner_details?.link || '#';

                                const logoData = banner?.logo || banner?.banner_details?.logo;
                                const logoSrc = typeof logoData === 'string' ? logoData : logoData?.url || null;

                                // First slider image as card backdrop
                                const sliderImages = banner?.banner_details?.[''];
                                const cardImage = Array.isArray(sliderImages) && sliderImages.length > 0
                                    ? sliderImages[0]?.image
                                    : null;

                                // Key features count
                                const keyFeatures = acf?.key_features?.items;
                                const featureCount = Array.isArray(keyFeatures) ? keyFeatures.length : null;

                                // Industries count
                                const industries = acf?.industry_applications?.industries;
                                const industryCount = Array.isArray(industries) ? industries.length : null;

                                return (
                                    <article key={product.id || index} className={styles.productCard}>
                                        {/* Card image area */}
                                        <div className={styles.cardImageArea}>
                                            {cardImage ? (
                                                <img
                                                    src={cardImage}
                                                    alt={productName}
                                                    className={styles.cardScreenshot}
                                                />
                                            ) : (
                                                <div className={styles.cardImagePlaceholder}>
                                                    <span className={styles.placeholderIcon}>◈</span>
                                                </div>
                                            )}
                                            <div className={styles.cardImageOverlay} />
                                        </div>

                                        {/* Card body */}
                                        <div className={styles.cardBody}>
                                            {/* Logo */}
                                            {logoSrc && (
                                                <div className={styles.cardLogo}>
                                                    <img src={logoSrc} alt={`${productName} logo`} />
                                                </div>
                                            )}

                                            {/* Title */}
                                            <h2
                                                className={styles.cardTitle}
                                                dangerouslySetInnerHTML={{ __html: productName }}
                                            />

                                            {/* Built for */}
                                            {builtFor && (
                                                <p className={styles.cardBuiltFor}>
                                                    <span className={styles.builtForLabel}>Built for</span>
                                                    {builtFor}
                                                </p>
                                            )}

                                            {/* Stats row */}
                                            {(featureCount || industryCount) && (
                                                <div className={styles.cardStats}>
                                                    {featureCount && (
                                                        <div className={styles.stat}>
                                                            <span className={styles.statNumber}>{featureCount}+</span>
                                                            <span className={styles.statLabel}>Key Features</span>
                                                        </div>
                                                    )}
                                                    {industryCount && (
                                                        <div className={styles.stat}>
                                                            <span className={styles.statNumber}>{industryCount}+</span>
                                                            <span className={styles.statLabel}>Industries</span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Actions */}
                                            <div className={styles.cardActions}>
                                                <Link href={`/product/${slug}`} className={styles.btnLearnMore}>
                                                    Learn More
                                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                                                        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </Link>
                                                {demoButton && (
                                                    <Link href={demoLink} className={styles.btnDemo}>
                                                        {demoButton}
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

        </main>
    );
}
