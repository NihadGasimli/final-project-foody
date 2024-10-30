"use client";
import "./global.css";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AsideModal from "../../../components/AsideModal";
import styles from "./layout.module.css";
import { useLanguage } from "../../../context/LanguageContext";

import en from "../../../locales/admin/en.json";
import az from "../../../locales/admin/az.json";
import ru from "../../../locales/admin/ru.json";

export default function RootLayout({ children }) {
    const [whichPage, setWhichPage] = useState(null);
    const router = useRouter();
    const dispatch = useDispatch();
    const [addProductModalOpened, setAddProductModalOpened] = useState(false);
    const [windowWidth, setWindowWidth] = useState(0);
    const [hamburgerMenu, setHamburgerMenu] = useState(false);
    const [asideOpened, setAsideOpened] = useState(false);
    const [flagSrc, setFlagSrc] = useState("/admin-flagEN.svg");
    const { language, setLanguage } = useLanguage();
    const [translation, setTranslation] = useState(en);
    const [languageMenuDisplay, setLanguageMenuDisplay] = useState("none");


    const inWhichPage = useSelector((state) => state.inWhichPage)


    useEffect(() => {
        setWhichPage(inWhichPage.page)
    }, [inWhichPage])

    useEffect(() => {
        setWindowWidth(window.innerWidth);

        window.addEventListener('resize', () => { setWindowWidth(window.innerWidth) });

    }, []);


    useEffect(() => {
        if (windowWidth < 768) {
            setHamburgerMenu(true);
        }
        else {
            setHamburgerMenu(false);
        }
    }, [windowWidth])

    const toggleAsideMenu = () => {
        setAsideOpened(!asideOpened);
    };

    const toggleLanguage = (lang) => {
        setLanguage(lang);
        toggleDropdown();
        localStorage.setItem('lang', JSON.stringify(lang))
    };

    const toggleDropdown = () => {
        setLanguageMenuDisplay(languageMenuDisplay === "none" ? "flex" : "none");
    };

    useEffect(() => {
        if (language === "en") {
            setFlagSrc("/admin-flagEN.svg");
            setTranslation(en)
        }
        else if (language === "az") {
            setFlagSrc("/admin-flagAZ.svg");
            setTranslation(az)
        }
        else if (language === "ru") {
            setFlagSrc("/admin-flagRU.svg");
            setTranslation(ru)
        }
    }, [language])

    useEffect(() => {
        if (addProductModalOpened || asideOpened) {
            document.body.classList.add(styles.hiddenOverflow)
        }
        else {
            document.body.classList.remove(styles.hiddenOverflow)
        }
    })


    if (whichPage === null) {
        return "";
    }


    return (
        <>
            {whichPage === "loginn" ? (
                <html>
                    <body>
                        {children}
                    </body>
                </html>
            )
                :
                (<>
                    <html lang="en">
                        <body className={styles.body}>

                            {addProductModalOpened && (
                                <div className={styles.modalOverlay}>
                                    <AsideModal setClosing={setAddProductModalOpened} whichModal={"product"} />
                                </div>
                            )
                            }

                            <header className={styles.header}>
                                <nav className={styles.navbar}>
                                    <div className={styles.hamburgerAndLogoDiv}>
                                        {hamburgerMenu ? (
                                            <>
                                                <Image
                                                    src="/hamburgerMenu.svg"
                                                    className={styles.hamburgerLogo}
                                                    width={50}
                                                    height={50}
                                                    alt="Logo"
                                                    onClick={toggleAsideMenu}
                                                />
                                            </>
                                        )
                                            :
                                            null
                                        }
                                        <Image
                                            src="/admin-logo.svg"
                                            className={styles.logoResponsiveHeader}
                                            width={0}
                                            height={0}
                                            alt="Logo"
                                        />
                                        
                                    </div>
                                    <Image
                                        src="/admin-logo.svg"
                                        className={styles.logo}
                                        width={0}
                                        height={0}
                                        alt="Logo"
                                    />

                                    <button className={styles.addProductButton} onClick={() => { setAddProductModalOpened(true) }}>{hamburgerMenu ? "+" : translation.header.addProduct}</button>

                                    {!hamburgerMenu ? (
                                        <div className={styles.dropdown}>
                                            <Image
                                                src={flagSrc}
                                                className={styles.flag}
                                                width={50}
                                                height={50}
                                                alt="image"
                                                onClick={toggleDropdown}
                                            />

                                            <div className={styles.dropdown_content} style={{ display: `${languageMenuDisplay}` }}>
                                                <Image
                                                    src="/admin-flagEN.svg"
                                                    className={styles.flag}
                                                    width={50}
                                                    height={50}
                                                    alt="image"
                                                    onClick={() => { toggleLanguage("en") }}
                                                />
                                                <Image
                                                    src="/admin-flagAZ.svg"
                                                    className={styles.flag}
                                                    width={50}
                                                    height={50}
                                                    alt="image"
                                                    onClick={() => { toggleLanguage("az") }}
                                                />
                                                <Image
                                                    src="/admin-flagRU.svg"
                                                    className={styles.flag}
                                                    width={50}
                                                    height={50}
                                                    alt="image"
                                                    onClick={() => { toggleLanguage("ru") }}
                                                />
                                            </div>
                                        </div>
                                    ) : null}

                                    <div className={styles.headerAdmin}>
                                        <Image
                                            src="/admin-avatar.svg"
                                            className={styles.avatarImage}
                                            width={0}
                                            height={0}
                                            alt="Logo"
                                        />
                                        {!hamburgerMenu ? (<h1>Admin</h1>) : null}
                                    </div>
                                </nav>
                            </header>

                            <div className={styles.container}>
                                {hamburgerMenu ? (
                                    <>
                                        <div className={`${styles.asideMenu} ${asideOpened ? styles.asideMenuOpened : styles.asideMenuClosed}`}>
                                            <div className={styles.hamburgerLogoAndArrowDiv}>
                                                <Image
                                                    src="/admin-hamburger-arrowBack.svg"
                                                    className={styles.hamburgerArrow}
                                                    width={30}
                                                    height={30}
                                                    alt="Logo"
                                                    onClick={toggleAsideMenu}
                                                />
                                                <Image
                                                    src="/admin-logo.svg"
                                                    className={styles.hamburgerLogo}
                                                    width={80}
                                                    height={80}
                                                    alt="Logo"
                                                />
                                            </div>
                                            <div className={`${styles.item} ${whichPage === "dashboard" ? styles.selectedBackground : ""}`} onClick={() => { router.push("/admin/dashboard"); toggleAsideMenu(); }}>
                                                <Image
                                                    src="/admin-aside-dashboard.svg"
                                                    className={styles.asideLogoDashboard}
                                                    width={0}
                                                    height={0}
                                                    alt="Logo"
                                                />
                                                <h1>{translation.asideMenu.dashboard}</h1>
                                            </div>
                                            <div className={`${styles.item} ${whichPage === "products" ? styles.selectedBackground : ""}`} onClick={() => { router.push("/admin/products"); toggleAsideMenu(); }}>
                                                <Image
                                                    src="/admin-aside-products.svg"
                                                    className={styles.asideLogo}
                                                    width={0}
                                                    height={0}
                                                    alt="Logo"
                                                />
                                                <h1>{translation.asideMenu.products}</h1>
                                            </div>
                                            <div className={`${styles.item} ${whichPage === "restaurants" ? styles.selectedBackground : ""}`} onClick={() => { router.push("/admin/restaurants"); toggleAsideMenu(); }}>
                                                <Image
                                                    src="/admin-aside-restaurants.svg"
                                                    className={styles.asideLogo}
                                                    width={0}
                                                    height={0}
                                                    alt="Logo"
                                                />
                                                <h1>{translation.asideMenu.restaurants}</h1>
                                            </div>
                                            <div className={`${styles.item} ${whichPage === "category" ? styles.selectedBackground : ""}`} onClick={() => { router.push("/admin/category"); toggleAsideMenu(); }}>
                                                <Image
                                                    src="/admin-aside-category.svg"
                                                    className={styles.asideLogo}
                                                    width={0}
                                                    height={0}
                                                    alt="Logo"
                                                />
                                                <h1>{translation.asideMenu.category}</h1>
                                            </div>
                                            <div className={`${styles.item} ${whichPage === "orders" ? styles.selectedBackground : ""}`} onClick={() => { router.push("/admin/orders"); toggleAsideMenu(); }}>
                                                <Image
                                                    src="/admin-aside-orders.svg"
                                                    className={styles.asideLogo}
                                                    width={0}
                                                    height={0}
                                                    alt="Logo"
                                                />
                                                <h1>{translation.asideMenu.orders}</h1>
                                            </div>
                                            <div className={`${styles.item} ${whichPage === "offers" ? styles.selectedBackground : ""}`} onClick={() => { router.push("/admin/offers"); toggleAsideMenu(); }}>
                                                <Image
                                                    src="/admin-aside-offers.svg"
                                                    className={styles.asideLogo}
                                                    width={0}
                                                    height={0}
                                                    alt="Logo"
                                                />
                                                <h1>{translation.asideMenu.offer}</h1>
                                            </div>
                                            <div className={styles.item} onClick={() => { router.push("/admin/login"); sessionStorage.setItem("login", false); toggleAsideMenu(); }}>
                                                <Image
                                                    src="/admin-aside-logout.svg"
                                                    className={styles.asideLogo}
                                                    width={0}
                                                    height={0}
                                                    alt="Logo"
                                                />
                                                <h1>{translation.asideMenu.logout}</h1>
                                            </div>
                                        </div>
                                    </>
                                )
                                    :
                                    (
                                        <>
                                            <div className={styles.asideMenu}>
                                                <div className={`${styles.item} ${whichPage === "dashboard" ? styles.selectedBackground : ""}`} onClick={() => router.push("/admin/dashboard")}>
                                                    <Image
                                                        src="/admin-aside-dashboard.svg"
                                                        className={styles.asideLogoDashboard}
                                                        width={0}
                                                        height={0}
                                                        alt="Logo"
                                                    />
                                                    <h1>{translation.asideMenu.dashboard}</h1>
                                                </div>
                                                <div className={`${styles.item} ${whichPage === "products" ? styles.selectedBackground : ""}`} onClick={() => router.push("/admin/products")}>
                                                    <Image
                                                        src="/admin-aside-products.svg"
                                                        className={styles.asideLogo}
                                                        width={0}
                                                        height={0}
                                                        alt="Logo"
                                                    />
                                                    <h1>{translation.asideMenu.products}</h1>
                                                </div>
                                                <div className={`${styles.item} ${whichPage === "restaurants" ? styles.selectedBackground : ""}`} onClick={() => router.push("/admin/restaurants")}>
                                                    <Image
                                                        src="/admin-aside-restaurants.svg"
                                                        className={styles.asideLogo}
                                                        width={0}
                                                        height={0}
                                                        alt="Logo"
                                                    />
                                                    <h1>{translation.asideMenu.restaurants}</h1>
                                                </div>
                                                <div className={`${styles.item} ${whichPage === "category" ? styles.selectedBackground : ""}`} onClick={() => router.push("/admin/category")}>
                                                    <Image
                                                        src="/admin-aside-category.svg"
                                                        className={styles.asideLogo}
                                                        width={0}
                                                        height={0}
                                                        alt="Logo"
                                                    />
                                                    <h1>{translation.asideMenu.category}</h1>
                                                </div>
                                                <div className={`${styles.item} ${whichPage === "orders" ? styles.selectedBackground : ""}`} onClick={() => router.push("/admin/orders")}>
                                                    <Image
                                                        src="/admin-aside-orders.svg"
                                                        className={styles.asideLogo}
                                                        width={0}
                                                        height={0}
                                                        alt="Logo"
                                                    />
                                                    <h1>{translation.asideMenu.orders}</h1>
                                                </div>
                                                <div className={`${styles.item} ${whichPage === "offers" ? styles.selectedBackground : ""}`} onClick={() => router.push("/admin/offers")}>
                                                    <Image
                                                        src="/admin-aside-offers.svg"
                                                        className={styles.asideLogo}
                                                        width={0}
                                                        height={0}
                                                        alt="Logo"
                                                    />
                                                    <h1>{translation.asideMenu.offer}</h1>
                                                </div>
                                                <div className={styles.item} onClick={() => { router.push("/admin/login"); sessionStorage.setItem("login", false) }}>
                                                    <Image
                                                        src="/admin-aside-logout.svg"
                                                        className={styles.asideLogo}
                                                        width={0}
                                                        height={0}
                                                        alt="Logo"
                                                    />
                                                    <h1>{translation.asideMenu.logout}</h1>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                <div className={styles.mainSide}>
                                    {children}
                                </div>
                            </div>
                        </body>
                    </html>
                </>)}
        </>
    );
}
