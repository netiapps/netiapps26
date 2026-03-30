"use client";

import { cachedTranslate, useLanguage } from "@/context/LanguageContext";
import { useEffect, useState } from "react";
import Link from 'next/link';
import Image from 'next/image';
import styles from './Navbar.module.scss';
import SearchOverlay from '@/components/SearchOverlay';
import { ChevronDown, Menu, X, Phone } from 'lucide-react';

import { getMediaUrl } from "@/lib/media";

// Navigation data structure

export default function Navbar(nav: any) {
    // console.log('Nav',nav);
    const { language, translate } = useLanguage();
    const [translatedNav, setTranslatedNav] = useState<any>(null);

    // const originalNav = nav.nav.navigation_data;
    const [originalNav] = useState(nav.nav.navigation_data);

    const navigationData = translatedNav || originalNav;

    useEffect(() => {
        async function translateNav() {
            if (!originalNav) return;

            if (language.toUpperCase() === "EN") {
                setTranslatedNav(null);
                return;
            }

            const translated = JSON.parse(JSON.stringify(originalNav));
            const tasks: Promise<any>[] = [];

            const t = (text: string) =>
                cachedTranslate(text, language, translate);

            tasks.push(
                t(originalNav.home.name).then((r: any) => translated.home.name = r),
                t(originalNav.about.title).then((r: any) => translated.about.title = r),
                t(originalNav.services.title).then((r: any) => translated.services.title = r),
                t(originalNav.solutions.title).then((r: any) => translated.solutions.title = r),
                t(originalNav.career.name).then((r: any) => translated.career.name = r),
                t(originalNav.contact.name).then((r: any) => translated.contact.name = r)
            );

            translated.about.menu_items.forEach((item: any) => {
                tasks.push(t(item.name).then((r: any) => item.name = r));
            });

            translated.services.mega_menu.forEach((cat: any) => {
                tasks.push(t(cat.title).then((r: any) => cat.title = r));
                cat.menu_items.forEach((item: any) => {
                    tasks.push(t(item.name).then((r: any) => item.name = r));
                });
            });

            translated.solutions.mega_menu.forEach((cat: any) => {
                tasks.push(t(cat.title).then((r: any) => cat.title = r));
                cat.menu_items.forEach((item: any) => {
                    tasks.push(t(item.name).then((r: any) => item.name = r));
                });
            });

            if (translated.products?.mega_menu) {
                translated.products.mega_menu.forEach((cat: any) => {
                    tasks.push(t(cat.title).then((r: any) => cat.title = r));
                    cat.menu_items.forEach((item: any) => {
                        tasks.push(t(item.name).then((r: any) => item.name = r));
                    });
                });
            }

            await Promise.all(tasks);
            setTranslatedNav(translated);
        }

        translateNav();
    }, [language]);


    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [activeServiceTab, setActiveServiceTab] = useState(0);
    const [activeSolutionTab, setActiveSolutionTab] = useState(0);

    // Mobile Menu State
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [expandedMobileMenu, setExpandedMobileMenu] = useState<string | null>(null);




    const handleMouseEnter = (menu: string) => {
        if (window.innerWidth > 992) {
            setActiveDropdown(menu);
            if (menu === 'services') setActiveServiceTab(0);
            if (menu === 'solutions') setActiveSolutionTab(0);
        }
    };

    const handleMouseLeave = () => {
        if (window.innerWidth > 992) {
            setActiveDropdown(null);
        }
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
        setExpandedMobileMenu(null); // Reset expanded on toggle
    };

    const toggleMobileAccordion = (menu: string) => {
        setExpandedMobileMenu(expandedMobileMenu === menu ? null : menu);
    };

    return (
        <>
            <nav className={styles.navbar}>
                <div className="container d-flex align-items-center justify-content-between">
                    {/* Logo Section */}
                    <div className={styles.logoSection}>
                        <Link href={nav.nav.logo.link} className={styles.logoLink}>
                            <Image
                                src={nav.nav.logo.img}
                                alt="netiapps logo"
                                width={180}
                                height={60}
                                className={styles.logoImage}
                            />
                        </Link>
                    </div>

                    {/* Center Links Section (Desktop) */}
                    <div className={styles.navLinksWrapper}>
                        <ul className={styles.navLinks}>
                            <li>
                                <Link href={navigationData.home.link}>{navigationData.home.name}</Link>
                            </li>

                            {/* About Dropdown */}
                            <li
                                className={styles.hasDropdown}
                                onMouseEnter={() => handleMouseEnter('about')}
                                onMouseLeave={handleMouseLeave}
                            >
                                <span className={styles.dropdownTrigger}>
                                    {navigationData.about.title} <ChevronDown size={16} />
                                </span>
                                {activeDropdown === 'about' && (
                                    <div className={styles.dropdown}>
                                        <ul>
                                            {navigationData.about.menu_items.map((item: any, index: any) => (
                                                <li key={index}>
                                                    <Link href={item.link}>{item.name}</Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </li>

                            {/* Services Mega Menu */}
                            <li
                                className={styles.hasDropdown}
                                onMouseEnter={() => handleMouseEnter('services')}
                                onMouseLeave={handleMouseLeave}
                            >
                                <span className={styles.dropdownTrigger}>
                                    {navigationData.services.title} <ChevronDown size={16} />
                                </span>
                            </li>

                            {/* Solutions Mega Menu */}
                            <li
                                className={styles.hasDropdown}
                                onMouseEnter={() => handleMouseEnter('solutions')}
                                onMouseLeave={handleMouseLeave}
                            >
                                <span className={styles.dropdownTrigger}>
                                    {navigationData.solutions.title} <ChevronDown size={16} />
                                </span>
                            </li>


                            {/* Products Dropdown */}
                            {navigationData.products?.mega_menu?.[0]?.menu_items && navigationData.products.mega_menu[0].menu_items.length > 0 && (
                                <li
                                    className={styles.hasDropdown}
                                    onMouseEnter={() => handleMouseEnter('products')}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    <span className={styles.dropdownTrigger}>
                                        {navigationData.products.title || "Products"} <ChevronDown size={16} />
                                    </span>
                                    {activeDropdown === 'products' && (
                                        <div className={`${styles.dropdown} ${styles.productsDropdown}`}>
                                            <ul>
                                                {navigationData.products.mega_menu[0].menu_items.map((item: any, index: number) => {
                                                    return (
                                                        <li key={index}>
                                                            <Link href={item.link}>
                                                                <div className={styles.productMenuItem}>
                                                                    <div className={styles.productMenuIcon}>
                                                                        <Image src={item.product_icon || getMediaUrl("/images/product_logo.png")} alt="Product Logo" width={80} height={30} />
                                                                    </div>
                                                                    <div className={styles.productMenuText}>
                                                                        <span dangerouslySetInnerHTML={{ __html: item.name }} />
                                                                    </div>
                                                                </div>
                                                            </Link>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </div>
                                    )}
                                </li>
                            )}

                            <li>
                                <Link href={navigationData.career.link}>{navigationData.career.name}</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Right Section Actions */}
                    <div className={styles.actionsSection}>

                        <Link href={navigationData.contact.link} className={styles.contactBtn}>
                            <span className="d-none d-lg-block">{navigationData.contact.name}</span>
                            <span className="d-lg-none"><Phone size={20} /></span>
                        </Link>

                        <button className={styles.searchBtn} onClick={() => setIsSearchOpen(true)}>
                            <Image src={getMediaUrl("/images/search.svg")} alt="Search" width={22} height={22} />
                        </button>

                        {/* Mobile Hamburger Toggle */}
                        <button className={styles.mobileMenuToggle} onClick={toggleMobileMenu}>
                            {isMobileMenuOpen ? <X size={24} color="#1a1a1a" /> : <Menu size={24} color="#1a1a1a" />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <div className={`${styles.mobileMenuOverlay} ${isMobileMenuOpen ? styles.open : ''}`}>
                <div className="container">
                    <ul className={styles.mobileNavList}>

                        <li>
                            <Link href={navigationData.home.link} onClick={toggleMobileMenu}>
                                {navigationData.home.name}
                            </Link>
                        </li>

                        {/* Mobile About */}
                        <li className={styles.mobileNavItem}>
                            <div className={styles.mobileNavHeader} onClick={() => toggleMobileAccordion('about')}>
                                {navigationData.about.title}
                                <ChevronDown size={16} className={expandedMobileMenu === 'about' ? styles.rotate : ''} />
                            </div>
                            <div className={`${styles.mobileSubMenu} ${expandedMobileMenu === 'about' ? styles.open : ''}`}>
                                <ul>
                                    {navigationData.about.menu_items.map((item: any, index: any) => (
                                        <li key={index}>
                                            <Link href={item.link} onClick={toggleMobileMenu}>{item.name}</Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </li>

                        {/* Mobile Services */}
                        <li className={styles.mobileNavItem}>
                            <div className={styles.mobileNavHeader} onClick={() => toggleMobileAccordion('services')}>
                                {navigationData.services.title}
                                <ChevronDown size={16} className={expandedMobileMenu === 'services' ? styles.rotate : ''} />
                            </div>
                            <div className={`${styles.mobileSubMenu} ${expandedMobileMenu === 'services' ? styles.open : ''}`}>
                                {navigationData.services.mega_menu.map((category: any, idx: number) => (
                                    <div key={idx} className="mb-3">
                                        <strong className="d-block text-dark mb-2">{category.title}</strong>
                                        <ul className="list-unstyled ps-3">
                                            {category.menu_items.map((item: any, i: number) => (
                                                <li key={i} className="mb-1">
                                                    <Link href={item.link || '#'} onClick={toggleMobileMenu} className="text-secondary text-decoration-none">
                                                        {item.name}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </li>

                        {/* Mobile Solutions */}
                        <li className={styles.mobileNavItem}>
                            <div className={styles.mobileNavHeader} onClick={() => toggleMobileAccordion('solutions')}>
                                {navigationData.solutions.title}
                                <ChevronDown size={16} className={expandedMobileMenu === 'solutions' ? styles.rotate : ''} />
                            </div>
                            <div className={`${styles.mobileSubMenu} ${expandedMobileMenu === 'solutions' ? styles.open : ''}`}>
                                {navigationData.solutions.mega_menu.map((category: any, idx: number) => (
                                    <div key={idx} className="mb-3">
                                        <strong className="d-block text-dark mb-2">{category.title}</strong>
                                        <ul className="list-unstyled ps-3">
                                            {category.menu_items.map((item: any, i: number) => (
                                                <li key={i} className="mb-1">
                                                    <Link href={item.link || '#'} onClick={toggleMobileMenu} className="text-secondary text-decoration-none">
                                                        {item.name}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </li>

                        {/* Mobile Products */}
                        {navigationData.products?.mega_menu?.[0]?.menu_items && navigationData.products.mega_menu[0].menu_items.length > 0 && (
                            <li className={styles.mobileNavItem}>
                                <div className={styles.mobileNavHeader} onClick={() => toggleMobileAccordion('products')}>
                                    {navigationData.products.title || "Products"}
                                    <ChevronDown size={16} className={expandedMobileMenu === 'products' ? styles.rotate : ''} />
                                </div>
                                <div className={`${styles.mobileSubMenu} ${styles.mobileProductsMenu} ${expandedMobileMenu === 'products' ? styles.open : ''}`}>
                                    <ul>
                                        {navigationData.products.mega_menu[0].menu_items.map((item: any, index: number) => {
                                            return (
                                                <li key={index}>
                                                    <Link href={item.link} onClick={toggleMobileMenu}>
                                                        <div className={styles.productMenuItem}>
                                                            <div className={styles.productMenuIcon}>
                                                                <Image src={item.product_icon || getMediaUrl("/images/product_logo.png")} alt="Product Logo" width={60} height={24} />
                                                            </div>
                                                            <div className={styles.productMenuText}>
                                                                <span dangerouslySetInnerHTML={{ __html: item.name }} />
                                                            </div>
                                                        </div>
                                                    </Link>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            </li>
                        )}

                        <li>
                            <Link href={navigationData.career.link} onClick={toggleMobileMenu}>
                                {navigationData.career.name}
                            </Link>
                        </li>


                    </ul>
                </div>
            </div>

            {/* Desktop Services Mega Menu Dropdown */}
            {activeDropdown === 'services' && (
                <div
                    className={`${styles.megaMenu} ${styles.servicesMenu}`}
                    onMouseEnter={() => handleMouseEnter('services')}
                    onMouseLeave={handleMouseLeave}
                >
                    <div className={styles.tabContainer}>
                        {/* Left Tabs */}
                        <div className={styles.tabList}>
                            {navigationData.services.mega_menu.map((category: any, index: any) => (
                                <button
                                    key={index}
                                    className={`${styles.tab} ${activeServiceTab === index ? styles.activeTab : ''}`}
                                    onMouseEnter={() => setActiveServiceTab(index)}
                                >
                                    <a href={category.link}> {category.title} </a>
                                </button>
                            ))}
                        </div>

                        {/* Right Content */}
                        <div className={styles.tabContent}>
                            <Link
                                href={navigationData.services.mega_menu[activeServiceTab].link}
                                className={styles.tabContentTitle}
                            >
                                {navigationData.services.mega_menu[activeServiceTab].title}
                            </Link>
                            <ul className={styles.tabContentList}>
                                {navigationData.services.mega_menu[activeServiceTab].menu_items.map((item: any, idx: any) => (
                                    <li key={idx}><a href={item.link}>{item.name}</a></li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* Desktop Solutions Mega Menu Dropdown */}
            {activeDropdown === 'solutions' && (
                <div
                    className={`${styles.megaMenu} ${styles.solutionsMenu}`}
                    onMouseEnter={() => handleMouseEnter('solutions')}
                    onMouseLeave={handleMouseLeave}
                >
                    <div className={styles.tabContainer}>
                        {/* Left Tabs */}
                        <div className={styles.tabList}>
                            {navigationData.solutions.mega_menu.map((category: any, index: any) => (
                                <button
                                    key={index}
                                    className={`${styles.tab} ${activeSolutionTab === index ? styles.activeTab : ''}`}
                                    onMouseEnter={() => setActiveSolutionTab(index)}
                                >
                                    <a href={category.link}> {category.title} </a>
                                </button>
                            ))}
                        </div>

                        {/* Right Content */}
                        <div className={styles.tabContent}>
                            <Link
                                href={navigationData.solutions.mega_menu[activeSolutionTab].link}
                                className={styles.tabContentTitle}
                            >
                                {navigationData.solutions.mega_menu[activeSolutionTab].title}
                            </Link>
                            <ul className={styles.tabContentList}>
                                {navigationData.solutions.mega_menu[activeSolutionTab].menu_items.map((item: any, idx: any) => (
                                    <li key={idx}><a href={item.link}>{item.name}</a></li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            <SearchOverlay
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
            />
        </>
    );
}
