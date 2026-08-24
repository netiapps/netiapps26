import Image from 'next/image';
import styles from './ClientLogos.module.scss';
import { getMediaUrl } from '@/lib/media';

export default function ClientLogos(client: any) {

    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.clientHeading}>Trusted by top-tier companies</div>
                <div className={styles.wrapper}>
                    {client.client.map((client: any, index: any) => (
                        <div key={index} className={styles.logoBox}>
                            <img
                                src={getMediaUrl(client.logo)}
                                alt={client.name}
                                width={200}
                                height={100}
                                className={styles.logo}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

