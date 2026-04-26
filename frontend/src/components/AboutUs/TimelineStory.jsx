'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import './TimelineStory.css';
import Bestseller1 from '../../assets/img/Bestseller1.jpg';
import Bestseller2 from '../../assets/img/Bestseller2.jpg';
import Bestseller3 from '../../assets/img/Bestseller3.jpg';
import Bestseller4 from '../../assets/img/Bestseller4.jpg';
import Bestseller5 from '../../assets/img/Bestseller5.jpg';

function TimelineStory() {
    const timelineRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            if (!timelineRef.current) return;

            const timeline = timelineRef.current;
            const rect = timeline.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // Distance from top of page to timeline start
            const timelineTop = rect.top + window.scrollY;

            // Timeline total height
            const timelineHeight = timeline.offsetHeight;

            // Current scroll from top (middle of screen gives smoother effect)
            const scrollY = window.scrollY + windowHeight / 2;

            // Progress calculation
            let progress = ((scrollY - timelineTop) / timelineHeight) * 100;

            // Clamp between 0–100
            progress = Math.max(0, Math.min(100, progress));

            timeline.style.setProperty("--scroll-progress", `${progress}%`);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const timelineData = [
        {
            year: '2015',
            description: 'Welcome To Mateshwari Moorti Bhanda was founded with a vision to bring divine craftsmanship to every home. We started our journey by creating handcrafted idols and temple solutions, combining traditional artistry with modern precision.',
            image: Bestseller1,
            position: 'left'
        },
        {
            year: '2018',
            description: 'Expanded our product range to include custom temple designs and premium Pooja Room solutions. Our commitment to quality and authenticity helped us establish a strong presence in the spiritual home decor market.',
            image: Bestseller2,
            position: 'right'
        },
        {
            year: '2021',
            description: 'Launched our innovative virtual tour experience, becoming the first in the industry to offer immersive digital exploration of our sacred spaces. This milestone marked our entry into the digital era of spiritual commerce.',
            image: Bestseller3,
            position: 'left'
        },
        {
            year: '2022',
            description: 'Achieved significant growth in our manufacturing capabilities and customer base. We introduced bulk order services and expanded our reach to serve temples, institutions, and individual devotees nationwide.',
            image: Bestseller4,
            position: 'right'
        },
        {
            year: '2023',
            description: 'Continuing our legacy of excellence, we remain dedicated to preserving traditional craftsmanship while embracing innovation. Today, Welcome To Mateshwari Moorti Bhanda stands as a trusted name in divine home solutions.',
            image: Bestseller5,
            position: 'left'
        }
    ];

    return (
        <div className="timeline-container">
            <div className="timeline-header">
                <p className="timeline-subtitle">About Welcome To Mateshwari Moorti Bhanda</p>
                <h1 className="timeline-title">Our Story of Growth & Success</h1>
                <p className="timeline-description">
                    Since 2015, we&apos;ve been dedicated to creating divine experiences through our handcrafted idols and temple solutions, bringing spiritual elegance to homes and hearts across the nation.
                </p>
            </div>

            <div className="timeline" ref={timelineRef}>
                <div className="timeline-line"></div>

                {timelineData.map((item, index) => (
                    <div
                        key={index}
                        className={`timeline-item ${item.position === 'right' ? 'timeline-item-right' : 'timeline-item-left'}`}
                    >
                        <div className="timeline-content">
                            <div className="timeline-text">
                                <h2 className="timeline-year">{item.year}</h2>
                                <p className="timeline-text-description">{item.description}</p>
                            </div>
                            <div className="timeline-marker">
                                <div className="timeline-dot"></div>
                            </div>
                            <div className="timeline-image-wrapper">
                                <Image
                                    src={item.image}
                                    alt={`Timeline ${item.year}`}
                                    className="timeline-image"
                                    width={400}
                                    height={300}
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TimelineStory;
