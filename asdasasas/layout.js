"use client";
import "./global.css";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AsideModal from "../../../../components/AsideModal";
import { Button, Dropdown, DropdownButton } from "react-bootstrap";
import styles from "./layout.module.css";

export default function RootLayout({ children }) {
    const [whichPage, setWhichPage] = useState(null);
    const router = useRouter();
    const dispatch = useDispatch();
    const [addProductModalOpened, setAddProductModalOpened] = useState(false);
    const [windowWidth, setWindowWidth] = useState(0);
    const [hamburgerMenu, setHamburgerMenu] = useState(false);
    const [asideOpened, setAsideOpened] = useState(false);

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
                                            <Image
                                                src="/hamburgerMenu.svg"
                                                className={styles.hamburgerLogo}
                                                width={50}
                                                height={50}
                                                alt="Logo"
                                                onClick={toggleAsideMenu}
                                            />
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

                                    <button className={styles.addProductButton} onClick={() => { setAddProductModalOpened(true) }}>{hamburgerMenu ? "+" : "+ ADD PRODUCT"}</button>

                                    {/* <div className={styles.languagesDiv}>
                        <Image
                            src="/admin-flagEN.svg"
                            className={styles.flagEN}
                            width={0}
                            height={0}
                            alt="Logo"
                            onClick={() => setLanguageIsOpen(!languageIsOpen)}
                        />

                        {languageIsOpen && <Language />}
                    </div> */}

                                    {!hamburgerMenu ? (
                                        <>
                                            <Dropdown className={`${styles.divFlags} custom-dropdown`}>
                                                <Dropdown.Toggle variant="secondary" id="dropdown-basic" className={styles.toggleFlags} style={{ backgroundColor: "transparent", border: "0" }}>
                                                    <Image
                                                        src="/admin-flagEN.svg"
                                                        className={styles.flagEN}
                                                        width={0}
                                                        height={0}
                                                        alt="Logo"
                                                    />
                                                </Dropdown.Toggle>

                                                <Dropdown.Menu className={`${styles.ulFlags} custom-dropdown-menu`} style={{ width: "10px", backgroundColor: "transparent", border: "0", display: "flex", flexDirection: "column" }}>
                                                    <Dropdown.Item className={`${styles.liFlags} custom-dropdown-item`}>
                                                        <Image
                                                            src="/admin-flagAZ.svg"
                                                            className={styles.flagEN}
                                                            width={0}
                                                            height={0}
                                                            alt="Logo"
                                                        />
                                                    </Dropdown.Item>
                                                    <Dropdown.Item className={`${styles.liFlags} custom-dropdown-item`}>
                                                        <Image
                                                            src="/admin-flagFR.svg"
                                                            className={styles.flagEN}
                                                            width={0}
                                                            height={0}
                                                            alt="Logo"
                                                        />
                                                    </Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </>
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
                                                <h1>Dashboard</h1>
                                            </div>
                                            <div className={`${styles.item} ${whichPage === "products" ? styles.selectedBackground : ""}`} onClick={() => { router.push("/admin/products"); toggleAsideMenu(); }}>
                                                <Image
                                                    src="/admin-aside-products.svg"
                                                    className={styles.asideLogo}
                                                    width={0}
                                                    height={0}
                                                    alt="Logo"
                                                />
                                                <h1>Products</h1>
                                            </div>
                                            <div className={`${styles.item} ${whichPage === "restaurants" ? styles.selectedBackground : ""}`} onClick={() => { router.push("/admin/restaurants"); toggleAsideMenu(); }}>
                                                <Image
                                                    src="/admin-aside-restaurants.svg"
                                                    className={styles.asideLogo}
                                                    width={0}
                                                    height={0}
                                                    alt="Logo"
                                                />
                                                <h1>Restaurants</h1>
                                            </div>
                                            <div className={`${styles.item} ${whichPage === "category" ? styles.selectedBackground : ""}`} onClick={() => { router.push("/admin/category"); toggleAsideMenu(); }}>
                                                <Image
                                                    src="/admin-aside-category.svg"
                                                    className={styles.asideLogo}
                                                    width={0}
                                                    height={0}
                                                    alt="Logo"
                                                />
                                                <h1>Category</h1>
                                            </div>
                                            <div className={`${styles.item} ${whichPage === "orders" ? styles.selectedBackground : ""}`} onClick={() => { router.push("/admin/orders"); toggleAsideMenu(); }}>
                                                <Image
                                                    src="/admin-aside-orders.svg"
                                                    className={styles.asideLogo}
                                                    width={0}
                                                    height={0}
                                                    alt="Logo"
                                                />
                                                <h1>Orders</h1>
                                            </div>
                                            <div className={`${styles.item} ${whichPage === "offers" ? styles.selectedBackground : ""}`} onClick={() => { router.push("/admin/offers"); toggleAsideMenu(); }}>
                                                <Image
                                                    src="/admin-aside-offers.svg"
                                                    className={styles.asideLogo}
                                                    width={0}
                                                    height={0}
                                                    alt="Logo"
                                                />
                                                <h1>Offer</h1>
                                            </div>
                                            <div className={styles.item} onClick={() => { router.push("/admin/login"); sessionStorage.setItem("login", false); toggleAsideMenu(); }}>
                                                <Image
                                                    src="/admin-aside-logout.svg"
                                                    className={styles.asideLogo}
                                                    width={0}
                                                    height={0}
                                                    alt="Logo"
                                                />
                                                <h1>Logout</h1>
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
                                                    <h1>Dashboard</h1>
                                                </div>
                                                <div className={`${styles.item} ${whichPage === "products" ? styles.selectedBackground : ""}`} onClick={() => router.push("/admin/products")}>
                                                    <Image
                                                        src="/admin-aside-products.svg"
                                                        className={styles.asideLogo}
                                                        width={0}
                                                        height={0}
                                                        alt="Logo"
                                                    />
                                                    <h1>Products</h1>
                                                </div>
                                                <div className={`${styles.item} ${whichPage === "restaurants" ? styles.selectedBackground : ""}`} onClick={() => router.push("/admin/restaurants")}>
                                                    <Image
                                                        src="/admin-aside-restaurants.svg"
                                                        className={styles.asideLogo}
                                                        width={0}
                                                        height={0}
                                                        alt="Logo"
                                                    />
                                                    <h1>Restaurants</h1>
                                                </div>
                                                <div className={`${styles.item} ${whichPage === "category" ? styles.selectedBackground : ""}`} onClick={() => router.push("/admin/category")}>
                                                    <Image
                                                        src="/admin-aside-category.svg"
                                                        className={styles.asideLogo}
                                                        width={0}
                                                        height={0}
                                                        alt="Logo"
                                                    />
                                                    <h1>Category</h1>
                                                </div>
                                                <div className={`${styles.item} ${whichPage === "orders" ? styles.selectedBackground : ""}`} onClick={() => router.push("/admin/orders")}>
                                                    <Image
                                                        src="/admin-aside-orders.svg"
                                                        className={styles.asideLogo}
                                                        width={0}
                                                        height={0}
                                                        alt="Logo"
                                                    />
                                                    <h1>Orders</h1>
                                                </div>
                                                <div className={`${styles.item} ${whichPage === "offers" ? styles.selectedBackground : ""}`} onClick={() => router.push("/admin/offers")}>
                                                    <Image
                                                        src="/admin-aside-offers.svg"
                                                        className={styles.asideLogo}
                                                        width={0}
                                                        height={0}
                                                        alt="Logo"
                                                    />
                                                    <h1>Offer</h1>
                                                </div>
                                                <div className={styles.item} onClick={() => { router.push("/admin/login"); sessionStorage.setItem("login", false) }}>
                                                    <Image
                                                        src="/admin-aside-logout.svg"
                                                        className={styles.asideLogo}
                                                        width={0}
                                                        height={0}
                                                        alt="Logo"
                                                    />
                                                    <h1>Logout</h1>
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
