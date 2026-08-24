import type { Metadata } from 'next';
import InnerPageBanner from '@/components/InnerPageBanner';
import ContactForm from '@/components/ContactForm';
import ContactInfo from '@/components/ContactInfo';
import OfficeLocations from '@/components/OfficeLocations/OfficeLocations';
import { ApiService } from "../../services/api.service";
import { hasContent } from '@/utils/hasContent';
import { normalizeWpMediaUrls } from '@/lib/media';

async function getContactPageData() {
  const baseUrl = new ApiService();

  const res = await fetch(
    baseUrl.getBaseUrl() + "wp-json/wp/v2/contact",
    { next: { revalidate: 10 } }
  );

  if (!res.ok) return null;

  const data = normalizeWpMediaUrls(await res.json());
  return data?.[0] ?? null;
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getContactPageData();
  const seo = page?.yoast_head_json;

  if (!seo) {
    return {
      title: "Contact Us | NetiApps",
      description: 'Get in touch with NetiApps. We are ready to help you build amazing digital solutions. Contact us for inquiries, partnerships, and support.',
      alternates: {
        canonical: '/contact',
      },
    };
  }

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: seo.canonical || '/contact',
    },
    openGraph: {
      title: seo.og_title,
      description: seo.og_description,
      images: seo.og_image?.map((img: any) => ({
        url: img.url,
      })),
    },
  };
}

export default async function ContactPage() {
  const page = await getContactPageData();

  if (!page?.acf) {
    return (
      <main style={{ textAlign: "center", padding: "150px 20px" }}>
        <h2>Content not available</h2>
        <p>Contact page content is not configured in the CMS.</p>
      </main>
    );
  }

  const acf = page.acf;

  return (
    <main>
      {hasContent(acf?.banner) && (
        <InnerPageBanner banner={acf.banner} />
      )}

      {acf?.locations && <OfficeLocations locations={acf.locations} />}
      <ContactForm />
    </main>
  );
}
