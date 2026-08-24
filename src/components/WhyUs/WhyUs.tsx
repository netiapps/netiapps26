import Image from "next/image";
import styles from "./WhyUs.module.scss";
import { getMediaUrl } from "@/lib/media";

export default function WhyUs(why: any) {
    
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.contentWrapper}>
                    <div className={styles.imageCol}>
                        <div className={styles.imageContainer}>
                            <img src={getMediaUrl(why.why.image)} alt="Why Choose Us" />
                        </div>
                    </div>
                    <div className={styles.textCol}>
                       <div dangerouslySetInnerHTML={{__html: why.why.text}} />
                    </div>
                </div>
            </div>
        </section>
    );
}
