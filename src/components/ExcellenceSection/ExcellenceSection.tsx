import Image from "next/image";
import styles from "./ExcellenceSection.module.scss";
import { getMediaUrl } from "@/lib/media";

export default function ExcellenceSection(data: any) {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.contentWrapper}>
                    <div className={styles.textCol}>
                        <div dangerouslySetInnerHTML={{__html: data.data.text}} />
                    </div>
                    <div className={styles.imageCol}>
                        <Image
                            src={getMediaUrl(data.data.image)}
                            alt="20+ Years of Excellence Badge"
                            width={350}
                            height={350}
                            className={styles.badgeImage}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
