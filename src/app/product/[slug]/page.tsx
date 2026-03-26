import type { Metadata } from 'next';
import ProductBanner from '@/components/ProductBanner/ProductBanner';
import TheProblem from '@/components/TheProblem/TheProblem';
import ProductOverview from '@/components/ProductOverview/ProductOverview';
import HowItWorks from '@/components/HowItWorks/HowItWorks';
import KeyFeatures from '@/components/KeyFeatures/KeyFeatures';
import IndustriesApplication from '@/components/IndustriesApplication/IndustriesApplication';
import Security from '@/components/Security/Security';
import WhyChooseUs from '@/components/WhyChooseUs/WhyChooseUs';
import CTA from '@/components/CTA/CTA';
import styles from './page.module.scss';
import { ApiService } from '@/services/api.service';

interface PageProps {
    params: Promise<{ slug: string }>;
}

async function getProductData(slug: string) {
    try {
        const baseUrl = new ApiService().getBaseUrl();
        const res = await fetch(
            `${baseUrl}wp-json/wp/v2/product?slug=${slug}`,
            { next: { revalidate: 10 } }
        );
        if (!res.ok) return null;
        const data = await res.json();
        return data?.[0] ?? null;
    } catch (e) {
        console.error("Failed to fetch product data", e);
        return null;
    }
}

export async function generateMetadata(
    { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
    const { slug } = await params;
    const product = await getProductData(slug);
    const seo = product?.yoast_head_json;

    if (!seo) {
        return {
            title: product?.title?.rendered || "Our Product | NetiApps",
            description: "Discover our comprehensive suite of innovative products tailored to elevate your business.",
        };
    }

    return {
        title: seo.title,
        description: seo.description,
        alternates: {
            canonical: seo.canonical || `/product/${slug}`,
        },
        openGraph: {
            title: seo.og_title,
            description: seo.og_description,
            type: "website",
            images: seo.og_image?.map((img: any) => ({
                url: img.url,
            })),
        },
        twitter: {
            card: "summary_large_image",
            title: seo.og_title || seo.title,
            description: seo.og_description || seo.description,
            images: seo.og_image?.[0]?.url,
        },
    };
}

export default async function ProductPage({ params }: PageProps) {
    const { slug } = await params;
    const product = await getProductData(slug);
    const acf = product?.acf;

    if (!acf) {
        return (
            <main className={styles.emptyState} style={{ padding: '100px 0', textAlign: 'center' }}>
                <h2>Product Not Found</h2>
                <p>The product you are looking for does not exist or has no content.</p>
            </main>
        );
    }

    return (
        <main>
            {acf?.banner && <ProductBanner banner={acf?.banner} title={product?.title?.rendered} />}
            {acf?.problem && <TheProblem problemData={acf?.problem} />}
            {acf?.overview && <ProductOverview overviewData={acf?.overview} />}
            {acf?.how_it_works && <HowItWorks howItWorksData={acf?.how_it_works} />}
            {acf?.key_features && <KeyFeatures keyFeaturesData={acf?.key_features} />}
            {acf?.security_compliance && <Security securityData={acf?.security_compliance} />}
            {acf?.industry_applications && <IndustriesApplication industriesApplicationData={acf?.industry_applications} />}
            {acf?.why_choose_us && <WhyChooseUs whyChooseUsData={acf?.why_choose_us} industriesApplicationData={acf?.industry_applications} />}
            {acf?.contact_us && <CTA ctaData={acf?.contact_us} />}
        </main>
    );
}

