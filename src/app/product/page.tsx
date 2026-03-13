import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import LatestInsight from '@/components/LatestInsight';
import ProductBanner from '@/components/ProductBanner/ProductBanner';
import TheProblem from '@/components/TheProblem/TheProblem';
import ProductOverview from '@/components/ProductOverview/ProductOverview';
import HowItWorks from '@/components/HowItWorks/HowItWorks';
import KeyFeatures from '@/components/KeyFeatures/KeyFeatures';
import IndustriesApplication from '@/components/IndustriesApplication/IndustriesApplication';
import styles from './page.module.scss';

export const metadata: Metadata = {
    title: "Our Product | NetiApps",
    description: "Discover our comprehensive suite of innovative products tailored to elevate your business.",
};

export default function ProductPage() {
    return (
        <main>
            <ProductBanner />
            <TheProblem />
            <ProductOverview />
            <HowItWorks />
            <KeyFeatures />
            <IndustriesApplication />
        </main>
    );
}
