import InnerPageBanner from '@/components/InnerPageBanner';
import ConnectNow from '@/components/ConnectNow';
import CareerCards from '@/components/CareerCards';
import Image from 'next/image';
import { ApiService } from "../../services/api.service";
import { hasContent } from '@/utils/hasContent';
import { getMediaUrl } from '@/lib/media';

export default async function CareersPage() {
    const baseUrl = new ApiService();
    let careers: any[] = [];

    try {
        const resCareers = await fetch(
            baseUrl.getBaseUrl() + "wp-json/wp/v2/careerpage",
            {  next: { revalidate: 60 }}
          );
          
          if (!resCareers.ok) {
            throw new Error(`API failed: ${resCareers.status}`);
          }
          
          careers = await resCareers.json();          
    } catch (error) {
        console.error("Careers API error:", error);
    }

    if (!careers?.length || !careers[0]?.acf) {
        return (
            <main style={{ textAlign: "center", padding: "150px 20px" }}>
                <h2>Content not available</h2>
                <p>Careerspage content is not configured in the CMS.</p>
            </main>
        );
    }

    const acf = careers[0].acf;
    // console.log(acf);
    return (
        <main>
            {hasContent(acf?.banner) && (
                 <InnerPageBanner banner={acf.banner} />
             )}

            {hasContent(acf?.job_list) && (
                <CareerCards jobList={acf.job_list} />
            )}
            {hasContent(acf?.image) && (
            <section style={{ padding: '4rem 0' }}>
                <img
                    src={getMediaUrl(acf.image)}
                    alt="Our Diverse Team"
                    width={1920}
                    height={400}
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                />
            </section>
            )}
            {hasContent(acf?.connect_now) && (
            <ConnectNow connect={acf.connect_now}  />
            )}
        </main>
    );
}
