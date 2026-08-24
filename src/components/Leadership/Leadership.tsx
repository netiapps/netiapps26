import Image from "next/image";
import styles from "./Leadership.module.scss";
import { getMediaUrl } from "@/lib/media";

export default function Leadership(data: any) {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                {data.data.map((element: any, index: any)=>(
                <div className={styles.contentWrapper} key={index}>
                    <div className={styles.imageCol}>
                        <div className={styles.imageContainer}>
                            {/* Replace with actual leadership image name */}
                            <img
                                src={getMediaUrl(element.image)}
                                alt="Leadership Vision"
                                className={styles.image}
                            />
                        </div>
                    </div>
                    <div className={styles.textCol}>
                        <div dangerouslySetInnerHTML={{__html: element.text}} />
                    </div>
                </div>
                ))}
            </div>
        </section>
    );
}
