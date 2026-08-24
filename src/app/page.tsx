import LatestInsight from "@/components/LatestInsight";
import Industries from "@/components/Industries";
import ClientSpeaks from "@/components/ClientSpeaks";
import Solutions from "@/components/Solutions";
import Services from "@/components/Services";
import ClientLogos from "@/components/ClientLogos";
import Hero from "@/components/Hero";
import { ApiService } from "../services/api.service";
import { normalizeWpMediaUrls } from "@/lib/media";
import type { Metadata } from 'next';

async function getHomePageData() {
  const baseUrl = new ApiService();

  const res = await fetch(
    baseUrl.getBaseUrl() + "wp-json/wp/v2/homepagesection",
    { next: { revalidate: 10 } }
  );

  if (!res.ok) return null;

  const data = normalizeWpMediaUrls(await res.json());
  return data?.[0] ?? null;
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getHomePageData();
  const seo = page?.yoast_head_json;

  if (!seo) {
    return {
      title: "NetiApps",
      description: 'Get in touch with NetiApps. We are ready to help you build amazing digital solutions. Contact us for inquiries, partnerships, and support.',
      alternates: {
        canonical: '/',
      },
    };
  }

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: seo.canonical || '/',
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
export default async function Home() {
  const page = await getHomePageData();

  if (!page?.acf) {
    return (
      <main style={{ textAlign: "center", padding: "150px 20px" }}>
        <h2>Content not available</h2>
        <p>Homepage content is not configured in the CMS.</p>
      </main>
    );
  }

  const acf = page.acf;

  return (
    <main>

      {Array.isArray(acf.slides) && acf.slides.length > 0 && (
        <Hero slides={acf.slides} />
      )}

      {Array.isArray(acf.client_logo) && acf.client_logo.length > 0 && (
        <ClientLogos client={acf.client_logo} />
      )}

      {acf.services && Object.keys(acf.services).length > 0 && (
        <Services services={acf.services} />
      )}

      {acf.solution && Object.keys(acf.solution).length > 0 && (
        <Solutions solution={acf.solution} />
      )}

      {acf.client?.feedback?.length > 0 && (
        <ClientSpeaks testimonials={acf.client} />
      )}

      {acf.industry?.industry_section?.length > 0 && (
        <Industries industries={acf.industry} />
      )}

      <LatestInsight />
    </main>
  );
}
