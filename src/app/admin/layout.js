"use client";
import "../global.css";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Dropdown, DropdownButton } from "react-bootstrap";
import styles from "./layout.module.css";

export default function RootLayout({ children }) {
    const [whichPage, setWhichPage] = useState("");
    const router = useRouter();
    const info = useSelector((state) => state.info);
    const [languageIsOpen, setLanguageIsOpen] = useState(false);

    useEffect(() => {
        setWhichPage(info?.page);
    }, [info]);

    return (
        <html lang="en">
            <body className={styles.body}>
                <header className={styles.header}>
                    <nav className={styles.navbar}>
                        <Image
                            src="/admin-logo.svg"
                            className={styles.logo}
                            width={0}
                            height={0}
                            alt="Logo"
                        />

                        <button className={styles.addProductButton}>+ ADD PRODUCT</button>

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
                                <Dropdown.Item href="#/action-1" className={`${styles.liFlags} custom-dropdown-item`}>
                                    <Image
                                        src="/admin-flagAZ.svg"
                                        className={styles.flagEN}
                                        width={0}
                                        height={0}
                                        alt="Logo"
                                    />
                                </Dropdown.Item>
                                <Dropdown.Item href="#/action-2" className={`${styles.liFlags} custom-dropdown-item`}>
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

                        <div className={styles.headerAdmin}>
                            <Image
                                src="/admin-avatar.svg"
                                className={styles.avatarImage}
                                width={0}
                                height={0}
                                alt="Logo"
                            />
                            <h1>Admin</h1>
                        </div>
                    </nav>
                </header>

                <div className={styles.container}>
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
                        <div className={styles.item} onClick={() => router.push("/logout")}>
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

                    <div className={styles.mainSide}>
                        {children}
                    </div>
                </div>
            </body>
        </html>
    );
}
