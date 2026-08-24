"use client";

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './SingleFullImage.module.scss';
import { getMediaUrl } from '@/lib/media';

interface SingleFullImageProps {
    image?: {
      image: string;
      text: string;
    }[];
  }
  
  export default function SingleFullImage({ image }: SingleFullImageProps) {
  
    const imageRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (!imageRef.current) return;
            const element = imageRef.current;
            const container = element.parentElement;
            if (!container) return;
            const rect = container.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            if (rect.top < windowHeight && rect.bottom > 0) {
                // Calculate progress of container through viewport (0 to 1)
                const progress = (windowHeight - rect.top) / (windowHeight + rect.height);
                // Translate image vertically (approx -50px to 50px movement space)
                const translateY = (progress - 0.5) * 100;
                element.style.transform = `scale(1.2) translateY(${translateY}px)`;
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial position

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <section className={styles.section}>
            <div className={styles.imageWrapper}>
                {Array.isArray(image) && image.map((element, index) => (
                    <div key={index}>
                        <img ref={imageRef} src={getMediaUrl(element.image)} alt={element.text} width={1920} height={1080} className={styles.mainImg} />
                    </div>
                ))}
            </div>
        </section>
    );
}

