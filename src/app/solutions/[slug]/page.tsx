import InnerPageBanner from '@/components/InnerPageBanner';
import styles from './page.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import LatestInsight from '@/components/LatestInsight';
import ConnectNow from '@/components/ConnectNow';
import CoreServices from '@/components/CoreServices';
import WhyChooseUs from '@/components/WhyChooseUs';
import WhatWeDo from '@/components/WhatWeDo';
import ServiceHighlight from '@/components/ServiceHighlight';
import ServiceIntroduction from '@/components/ServiceIntroduction';
import ServiceDualList from '@/components/ServiceDualList';
import SingleFullImage from '@/components/SingleFullImage';
import SingleText from '@/components/SingleText';
import WhyChoose from '@/components/WhyChoose';
import { services } from '@/data/servicesData';
import { ApiService } from '@/services/api.service';
import { hasContent } from "@/utils/hasContent";
import { normalizeWpMediaUrls } from "@/lib/media";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}
async function getSolutionPageData(slug: string) {
  const baseUrl = new ApiService();

  const res = await fetch(
    baseUrl.getBaseUrl() + `wp-json/wp/v2/solutions?slug=${slug}`,
    { next: { revalidate: 10 } }
  );

  if (!res.ok) return null;

  const data = normalizeWpMediaUrls(await res.json());
  return data?.[0] ?? null;
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {

  const { slug } = await params; // ✅ REQUIRED

  const service = await getSolutionPageData(slug);
  const seo = service?.yoast_head_json;

  if (!seo) {
    return {
      title: service?.title?.rendered || "Solution | NetiApps",
      description:
        "Explore our solution and discover how NetiApps helps businesses grow with technology.",
      alternates: {
        canonical: `/solutions/${slug}`,
      },
    };
  }

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: seo.canonical || `/solutions/${slug}`,
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

export default async function ServicesPage({ params }: PageProps) {
  const { slug } = await params;
  const solution = await getSolutionPageData(slug);

  if (!solution?.acf) {
    return (
      <main className={styles.emptyState}>
        <h2>Content not available</h2>
        <p>Data is not available in your CMS for this service.</p>
      </main>
    );
  }

  return (
    <main>

      {hasContent(solution?.acf?.banner) && (
        <InnerPageBanner banner={solution.acf.banner} />
      )}


      {solution?.acf?.content?.length > 0 ? (
        solution.acf.content.map((element: any, index: number) => (
          <div key={index}>
            {element.acf_fc_layout === "main_page" && (
              <>
                {hasContent(element.highlight) && (
                  <ServiceHighlight highlight={element.highlight} />
                )}

                {hasContent(element.what_we_do) && (
                  <WhatWeDo content={element.what_we_do} />
                )}

                {hasContent(element.why_choose_us) && (
                  <WhyChooseUs why={element.why_choose_us} />
                )}

                {hasContent(element.connect_now) && (
                  <ConnectNow connect={element.connect_now} />
                )}
              </>
            )}

            {element.acf_fc_layout === "inner_page" && (
              <>
                {hasContent(element.introduction) && (
                  <ServiceIntroduction intro={element.introduction} />
                )}

                {hasContent(element.dual_list) && (
                  <ServiceDualList data={element.dual_list} />
                )}

                {Array.isArray(element.single_image) &&
                  element.single_image.map((imgBlock: any, imgIndex: number) => (
                    <div key={imgIndex}>
                      {hasContent(imgBlock) && (
                        <SingleFullImage image={[imgBlock]} />
                      )}

                      {hasContent(element.text_content?.[imgIndex]) && (
                        <SingleText
                          data={[element.text_content[imgIndex]]}
                        />
                      )}
                    </div>
                  ))}

                {hasContent(element.why_choose) && (
                  <WhyChoose data={element.why_choose} />
                )}

                {hasContent(element.why_choose_us) && (
                  <WhyChooseUs why={element.why_choose_us} />
                )}

                {hasContent(element.connect_now) && (
                  <ConnectNow connect={element.connect_now} />
                )}
              </>
            )}
          </div>
        ))
      ) : (
        <div className={styles.emptyState}>
          <p>Content is not configured in your CMS.</p>
        </div>
      )}


      <LatestInsight />
    </main>
  );
}
