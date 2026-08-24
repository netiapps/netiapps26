import InnerPageBanner from '@/components/InnerPageBanner';
import styles from './page.module.scss';
import LatestInsight from '@/components/LatestInsight';
import type { Metadata } from 'next';
import Counter from "@/components/Counter/Counter";
import WhyUs from "@/components/WhyUs/WhyUs";
import ExcellenceSection from "@/components/ExcellenceSection/ExcellenceSection";
import Leadership from "@/components/Leadership/Leadership";
import MoreAboutCompany from "@/components/MoreAboutCompany/MoreAboutCompany";
import ConnectNow from '@/components/ConnectNow';
import { ApiService } from '@/services/api.service';
import { hasContent } from "@/utils/hasContent";
import { getMediaUrl, normalizeWpMediaUrls } from "@/lib/media";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getAboutPageData(slug: string) {
  const baseUrl = new ApiService();

  const res = await fetch(
    baseUrl.getBaseUrl() + `wp-json/wp/v2/about?slug=${slug}`,
    { next: { revalidate: 10 } }
  );

  if (!res.ok) return null;

  const data = normalizeWpMediaUrls(await res.json());
  return data?.[0] ?? null;
}
export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {

  const page = await getAboutPageData(params.slug);
  const seo = page?.yoast_head_json;

  if (!seo) {
    return {
      title: "About Us | NetiApps",
      description: "Learn more about NetiApps, our values, leadership, and the work we do.",
      alternates: {
        canonical: `/about/${params.slug}`,
      },
    };
  }

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: seo.canonical || `/about/${params.slug}`,
    },
    openGraph: {
      title: seo.og_title,
      description: seo.og_description,
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


export default async function AbtPage({ params }: PageProps) {
  const { slug } = await params;
  const about = await getAboutPageData(slug);

  if (!about?.acf) {
    return (
      <main className={styles.emptyState}>
        <h2>Content not available</h2>
        <p>Data is not available in your CMS for this page.</p>
      </main>
    );
  }

  const content = about?.acf.content?.[0];
  const clientDetails = content?.client_details;

  return (
    <main>
      {hasContent(about?.acf?.banner) && (
        <InnerPageBanner banner={about.acf.banner} />
      )}


      {about?.acf?.content?.length > 0 ? (
        about.acf.content.map((element: any, index: number) => (
          <div key={index}>
            {element.acf_fc_layout === 'client' && (
              <section className={styles.clientsSection}>
                <div className="container">

                  {/* Description */}
                  {clientDetails?.description && (
                    <div
                      className={styles.description}
                      dangerouslySetInnerHTML={{
                        __html: clientDetails.description,
                      }}
                    />
                  )}

                  {/* Logos */}
                  {Array.isArray(clientDetails?.logo) &&
                    clientDetails.logo.length > 0 && (
                      <div className={styles.clientsGrid}>
                        {clientDetails.logo.map(
                          (client: any, index: number) => (
                            <div
                              key={index}
                              className={styles.clientCard}
                            >
                              <img
                                src={getMediaUrl(client.image)}
                                alt={client.name || 'Client logo'}
                                width={160}
                                height={80}
                                className={styles.logo}
                              />
                            </div>
                          )
                        )}
                      </div>
                    )}
                </div>
              </section>
            )}

            {element.acf_fc_layout === 'policy' && (
              <section className={styles.container}>
                <div className={styles.content}>
                  <div dangerouslySetInnerHTML={{ __html: element.content }} />
                </div>
              </section>
            )}

            {element.acf_fc_layout === "about" && (
              <>
                {hasContent(element.whyus) && <WhyUs why={element.whyus} />}
                {hasContent(element.excellence) && (
                  <ExcellenceSection data={element.excellence} />
                )}
                {hasContent(element.leadership) && (
                  <Leadership data={element.leadership} />
                )}
                {hasContent(element.about) && (
                  <MoreAboutCompany about={element.about} />
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
