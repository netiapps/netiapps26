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

export const metadata: Metadata = {
    title: "Our Product | NetiApps",
    description: "Discover our comprehensive suite of innovative products tailored to elevate your business.",
};

async function getProductData() {
    try {
        const res = await fetch(
            "https://2026wp.netiapps.net/wp-json/wp/v2/product",
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

export default async function ProductPage() {
    const product = await getProductData();
    const acf = product?.acf;

    return (
        <main>
            <ProductBanner banner={acf?.banner} title={product?.title?.rendered} />
            <TheProblem problemData={acf?.problem} />
            <ProductOverview overviewData={acf?.overview} />
            <HowItWorks howItWorksData={acf?.how_it_works} />
            <KeyFeatures keyFeaturesData={acf?.key_features} />
            <Security securityData={acf?.security_compliance} />
            <IndustriesApplication />
            <WhyChooseUs whyChooseUsData={acf?.why_choose_us} industriesApplicationData={acf?.industry_applications} />
            <CTA ctaData={acf?.contact_us} />
        </main>
    );
}

