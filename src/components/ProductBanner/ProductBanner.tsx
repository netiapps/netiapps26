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
    if (banner?.banner_details?.[''] && Array.isArray(banner.banner_details['']) && banner.banner_details[''].length > 0) {
        sliderImages = banner.banner_details[''].filter((img: any) => img.image).map((img: any) => ({
            type: 'remote',
            src: img.image,
            alt: banner?.title || "Product Banner"
        }));
    }

    const productName = banner?.title;
    const mainTitle = title;
    const builtFor = banner?.built_for;

    const demoButton = banner?.banner_details?.get_demo_button;
    const downloadPdfBtn = banner?.banner_details?.download_pdf;
    const demoLink = banner?.banner_details?.link || "#";

    const productLogoData = banner?.logo || banner?.banner_details?.logo;
    const productLogoSrc = typeof productLogoData === 'string' ? productLogoData : productLogoData?.url || null;

    return (
        <section className={styles.heroSection}>
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-4">
                        {productLogoSrc && (
                            <div style={{ marginBottom: '30px' }}>
                                <img
                                    src={productLogoSrc}
                                    alt={productName || "Product Logo"}
                                    style={{ maxWidth: '100%', maxHeight: '80px', objectFit: 'contain' }}
                                />
                            </div>
                        )}

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
                    <div className="col-lg-8 mt-5 mt-lg-0">
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
