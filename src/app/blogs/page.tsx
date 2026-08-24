import styles from "./page.module.scss";
import { ApiService } from "@/services/api.service";
import { normalizeWpMediaUrls } from "@/lib/media";
import BlogsClient from "../../components/Blogs/Blogs";
import type { Metadata } from "next";



export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Blogs | NetiApps",
    description:
      "Explore insights, updates, and expert articles from NetiApps.",
    alternates: {
      canonical: '/blogs',
    },
  };
}
export default async function BlogsPage() {
  const baseUrl = new ApiService();

  let Blogs: any[] = [];

  try {
    const resBlogs = await fetch(
      baseUrl.getBaseUrl() + `wp-json/wp/v2/blogs?per_page=100`,
      { next: { revalidate: 10 } }
    );

    Blogs = normalizeWpMediaUrls(await resBlogs.json());
  } catch (error) {
    console.error("Error fetching Blogs:", error);
  }

  if (!Blogs?.length || !Blogs[0]?.acf) {
    return (
      <main className={styles.emptyState}>
        <h2>Content not available</h2>
        <p>Data is not available in your CMS for this service.</p>
      </main>
    );
  }

  return <BlogsClient blogs={Blogs} />;
}
