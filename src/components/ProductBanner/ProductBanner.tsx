"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import styles from './ProductBanner.module.scss';
import { getMediaUrl } from '@/lib/media';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

interface ProductBannerProps {
    banner?: any;
    title?: string;
}

export default function ProductBanner({ banner, title }: ProductBannerProps) {
    // Data mapped from ACF
    let sliderImages: any[] = [];
    if (banner?.title?.[''] && Array.isArray(banner.title['']) && banner.title[''].length > 0) {
        sliderImages = banner.title[''].filter((img: any) => img.image).map((img: any) => ({
            type: 'remote',
            src: img.image,
            alt: banner?.tag || "Dashboard Mockup"
        }));
    }

    const productName = banner?.tag;
    const mainTitle = title;
    const builtFor = banner?.built_for;
    
    const demoButton = banner?.title?.get_demo_button;
    const downloadPdfBtn = banner?.title?.download_pdf;
    const demoLink = banner?.title?.link || "#";

    return (
        <section className={styles.heroSection}>
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-6">
                        <div className={styles.brandTitle}>
                            <div className={styles.iconBox}>
                                <Image
                                    src={getMediaUrl("/images/product_logo.png")}
                                    alt="Product Logo"
                                    width={60}
                                    height={60}
                                />
                            </div>
                            <div className={styles.brandText}>
                                {productName && <h3 className={styles.productName}>{productName}</h3>}
                                <p className={styles.companyName}>by Netiapps</p>
                            </div>
                        </div>

                        {mainTitle && (
                            <h1 className={styles.mainTitle} dangerouslySetInnerHTML={{ __html: mainTitle }} />
                        )}

                        {builtFor && (
                            <p className={styles.description}>
                                Built for: {builtFor}
                            </p>
                        )}

                        <div className={styles.buttonGroup}>
                            {demoButton && (
                                <Link href={demoLink} className={styles.btnPrimary}>
                                    {demoButton}
                                </Link>
                            )}
                            {downloadPdfBtn && (
                                <Link href="#" className={styles.btnPrimary}>
                                    {downloadPdfBtn}
                                </Link>
                            )}
                        </div>
                    </div>
                    <div className="col-lg-6 mt-5 mt-lg-0">
                        {sliderImages.length > 0 && (
                            <div className={styles.imageWrapper}>
                                <Swiper
                                    modules={[Autoplay, EffectFade, Pagination]}
                                    effect="fade"
                                    fadeEffect={{ crossFade: true }}
                                    spaceBetween={0}
                                    slidesPerView={1}
                                    loop={true}
                                    autoplay={{
                                        delay: 4000,
                                        disableOnInteraction: false,
                                    }}
                                    pagination={{
                                        clickable: true,
                                    }}
                                    className={styles.productSlider}
                                >
                                    {sliderImages.map((img, index) => (
                                        <SwiperSlide key={index}>
                                            <img
                                                src={img.src}
                                                alt={img.alt}
                                                width="800"
                                                height="600"
                                                className={styles.heroImage}
                                                style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                                            />
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
