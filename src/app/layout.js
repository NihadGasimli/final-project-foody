"use client";

import "./global.css";
import { useEffect, useRef, useState } from "react";
import { Provider, useSelector } from "react-redux";
import { store } from "./store/store";
import Image from "next/image";
import styles from "./layout.module.css";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import { LanguageProvider, useLanguage } from '../../context/LanguageContext';

import en from "../../locales/en.json"
import az from "../../locales/az.json"
import ru from "../../locales/ru.json"

export default function RootLayout({ children }) {
  return (
    <LanguageProvider>
      <Provider store={store}>
        <LayoutComponent>{children}</LayoutComponent>
      </Provider>
    </LanguageProvider>
  );
}

function LayoutComponent({ children }) {
  const logged = JSON.parse(localStorage.getItem("logged"))
  const [windowWidth, setWindowWidth] = useState(0);
  const [whichPage, setWhichPage] = useState(null);
  const [userData, setUserData] = useState(null);
  const [avatarText, setAvatarText] = useState(null);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(0);
  const [languageMenuDisplay, setLanguageMenuDisplay] = useState("none");
  const [flagSrc, setFlagSrc] = useState("/admin-flagEN.svg");
  const [asideOpened, setAsideOpened] = useState(false);
  const [hamburgerMenu, setHamburgerMenu] = useState(false);
  const [translation, setTranslation] = useState(en);
  const { language, setLanguage } = useLanguage();
  const avatarMenuRef = useRef(null);
  const avatarButtonRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        setWindowWidth(window.innerWidth);
      };

      // Set the initial window width
      handleResize();

      // Add the resize event listener
      window.addEventListener("resize", handleResize);

      // Cleanup the event listener when the component unmounts
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  const toggleLanguage = (lang) => {
    setLanguage(lang);
    toggleDropdown();
    localStorage.setItem('lang', JSON.stringify(lang))
  };

  useEffect(() => {
    if (windowWidth < 900) {
      setHamburgerMenu(true);
    }
    else {
      setHamburgerMenu(false)
    }
  }, [windowWidth]);

  useEffect(() => {
    if (asideOpened) {
      document.body.classList.add(styles.hiddenOverflow)
    }
    else {
      document.body.classList.remove(styles.hiddenOverflow)
    }
  }, [asideOpened])

  const toggleAsideMenu = () => {
    setAsideOpened(!asideOpened);
  };

  const inWhichPage = useSelector((state) => state.inWhichPage);
  useEffect(() => {
    setWhichPage(inWhichPage?.page);
  }, [inWhichPage]);

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

  const user = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    if (whichPage !== "login") {
      if (logged) {
        setUserData(user);
        if (user?.fullname) {
          const splitedName = user.fullname.split(" ")
          if (splitedName.length === 2) {
            const firstLettersOfName = `${splitedName[0][0]}${splitedName[1][0]}`;
            setAvatarText(firstLettersOfName);
          }
        }
      }
    }
  }, [whichPage])

  const toggleDropdown = () => {
    setLanguageMenuDisplay(languageMenuDisplay === "none" ? "flex" : "none");
  };

  const toggleClickAvatarMenu = () => {
    setAvatarMenuOpen(0);
  }

  function logout() {
    setAvatarMenuOpen(0);
    localStorage.removeItem("user");
    localStorage.setItem("logged", JSON.stringify(false))
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token")
    router.push("/login");
  }

  const openAvatarMenu = (e) => {
    e.stopPropagation();
    setAvatarMenuOpen((prev) => !prev); // Toggle the menu state
  };

  useEffect(() => {
    // localStorage.setItem("lang", JSON.stringify('en'));\
    if (!JSON.stringify(localStorage.getItem("lang"))) {
      localStorage.setItem("lang", JSON.stringify("en"))
    }

    const handleClickOutside = (event) => {
      if (
        avatarMenuRef.current &&
        !avatarMenuRef.current.contains(event.target) &&
        avatarButtonRef.current &&
        !avatarButtonRef.current.contains(event.target)
      ) {
        setAvatarMenuOpen(0);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchBasketData = async () => {
      const token = JSON.parse(localStorage.getItem("access_token"));
      try {
        const response = await axios.get('/api/basket', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const dataBasket = response.data.result.data;
        localStorage.setItem("basket", JSON.stringify(dataBasket));
        console.log("Basket data:", dataBasket);
      } catch (err) {
        console.error("Error fetching basket data:", err);
        if (err.response.status === 500) {
          localStorage.setItem("logged", JSON.stringify(false));
          localStorage.removeItem("user");
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("basket");
        }
      }
    };

    fetchBasketData();
  }, []);


  const getPageName = (href) => href.split("/").pop() || "home";

  return (
    <>
      {whichPage === "login" ? (
        <>
          <html>
            <body>
              {children}
            </body>
          </html>
        </>
      )
        :
        (
          <>
            <html lang="en">
              <body>
                <header className={styles.header}>
                  <nav className={styles.navbar}>
                    <div className={styles.leftSideOfHeader}>

                      {hamburgerMenu && (
                        <Image
                          src="/hamburgerLogoBlack.svg"
                          className={styles.hamburgerLogo}
                          width={50}
                          height={50}
                          alt="Hamburger Menu"
                          onClick={toggleAsideMenu}
                        />
                      )}

                      <Image
                        src="/logoBlack.svg"
                        className={styles.logo}
                        width={50}
                        height={50}
                        alt="image"
                      />

                      {hamburgerMenu ? (
                        <div className={`${asideOpened ? styles.asideMenuOpened : styles.asideMenuClosed}`}>
                          <h1 className={styles.closeAsideButton} onClick={toggleAsideMenu}>X</h1>
                          <ul className={`${styles.list} `}>
                            <li onClick={toggleAsideMenu}>
                              <Link
                                href="/"
                                className={getPageName("/") === whichPage ? styles.activeLink : ""}
                              >
                                Home
                              </Link>
                            </li>
                            <li onClick={toggleAsideMenu}>
                              <Link
                                href="/restaurants"
                                className={getPageName("/restaurants") === whichPage ? styles.activeLink : ""}
                              >
                                Restaurants
                              </Link>
                            </li>
                            <li onClick={toggleAsideMenu}>
                              <Link
                                href="/aboutus"
                                className={getPageName("/aboutus") === whichPage ? styles.activeLink : ""}
                              >
                                About us
                              </Link>
                            </li>
                            <li onClick={toggleAsideMenu}>
                              <Link
                                href="/howitworks"
                                className={getPageName("/howitworks") === whichPage ? styles.activeLink : ""}
                              >
                                How it works
                              </Link>
                            </li>
                            <li onClick={toggleAsideMenu}>
                              <Link
                                href="/faqs"
                                className={getPageName("/faqs") === whichPage ? styles.activeLink : ""}
                              >
                                FAQs
                              </Link>
                            </li>
                          </ul>
                        </div>

                      ) : (
                        <ul className={styles.list}>
                          <li>
                            <Link
                              href="/"
                              className={getPageName("/") === whichPage ? styles.activeLink : ""}
                            >
                              {translation.header.home}
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/restaurants"
                              className={getPageName("/restaurants") === whichPage ? styles.activeLink : ""}
                            >
                              {translation.header.restaurants}
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/aboutus"
                              className={getPageName("/aboutus") === whichPage ? styles.activeLink : ""}
                            >
                              {translation.header.aboutus}
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/howitworks"
                              className={getPageName("/howitworks") === whichPage ? styles.activeLink : ""}
                            >
                              {translation.header.howitworks}
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/faqs"
                              className={getPageName("/faqs") === whichPage ? styles.activeLink : ""}
                            >
                              {translation.header.faqs}
                            </Link>
                          </li>
                        </ul>
                      )}
                    </div>

                    <div className={styles.rightSideOfHeader}>
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
                            onClick={() => { toggleLanguage("en"); }}
                          />
                          <Image
                            src="/admin-flagAZ.svg"
                            className={styles.flag}
                            width={50}
                            height={50}
                            alt="image"
                            onClick={() => { toggleLanguage("az"); }}
                          />
                          <Image
                            src="/admin-flagRU.svg"
                            className={styles.flag}
                            width={50}
                            height={50}
                            alt="image"
                            onClick={() => { toggleLanguage("ru"); }}
                          />
                        </div>
                      </div>

                      {logged ? (<>
                        <Image
                          src="/shopping_basket_white.svg"
                          className={styles.basketLogo}
                          width={50}
                          height={50}
                          alt="image"
                          onClick={() => { router.push('/user?page=basket') }}
                        />
                        <div className={styles.avatarDiv}>
                          <button className={styles.avatar} onClick={openAvatarMenu} ref={avatarButtonRef}>{avatarText}</button>
                          <div className={`${styles.dropdownAvatar} ${avatarMenuOpen ? `${styles.open}` : ""}`} ref={avatarMenuRef} style={{ display: avatarMenuOpen ? "flex" : "none" }}>
                            <Link href="/user?page=profile" onClick={toggleClickAvatarMenu} className={styles.dropdownMenuItem}>
                              <Image
                                src="/profile-logo.svg"
                                className={styles.logo}
                                width={50}
                                height={50}
                                alt="image"
                              />
                              <h2>{translation.header.profile}</h2>
                            </Link>
                            <Link href="/user?page=basket" onClick={toggleClickAvatarMenu} className={styles.dropdownMenuItem}>
                              <Image
                                src="/basket-logo.svg"
                                className={styles.logo}
                                width={50}
                                height={50}
                                alt="image"
                              />
                              <h2>{translation.header.basket}</h2>
                            </Link>

                            <Link href="/user?page=orders" onClick={toggleClickAvatarMenu} className={styles.dropdownMenuItem}>
                              <Image
                                src="/orders-logo.svg"
                                className={styles.logo}
                                width={50}
                                height={50}
                                alt="image"
                              />
                              <h2>{translation.header.orders}</h2>
                            </Link>

                            <Link href="/user?page=checkout" onClick={toggleClickAvatarMenu} className={styles.dropdownMenuItem}>
                              <Image
                                src="/checkout-logo.svg"
                                className={styles.logo}
                                width={50}
                                height={50}
                                alt="image"
                              />
                              <h2>{translation.header.checkout}</h2>
                            </Link>

                            <Link href="/login" onClick={logout} className={styles.dropdownMenuItem}>
                              <Image
                                src="/logout-logo.svg"
                                className={styles.logo}
                                width={50}
                                height={50}
                                alt="image"
                              />
                              <h2>{translation.header.logout}</h2>
                            </Link>
                          </div>
                        </div>
                      </>
                      ) : (
                        <>
                          <button className={styles.signUpButton} onClick={() => { router.push("/login") }}>{translation.header.signup}</button>
                        </>
                      )}
                    </div>
                  </nav>
                </header>
                <div className={styles.childrenDiv}>
                  {children}
                </div>
                <footer className={styles.footer}>
                  <div className={styles.mainFooter}>
                    <div className={styles.leftSide}>
                      <Image
                        src="/admin-logo.svg"
                        className={styles.logoFooter}
                        width={50}
                        height={50}
                        alt="image"
                      />
                      <p>Quick and easy food delivery from your favorite local spots.</p>
                      <div className={styles.socialMedias}>
                        <Image
                          src="/facebook_icon.svg"
                          className={styles.logoSocialMediaFooter}
                          width={50}
                          height={50}
                          alt="image"
                        />
                        <Image
                          src="/instagram_icon.svg"
                          className={styles.logoSocialMediaFooter}
                          width={50}
                          height={50}
                          alt="image"
                        />
                        <Image
                          src="/twitter_icon.svg"
                          className={styles.logoSocialMediaFooter}
                          width={50}
                          height={50}
                          alt="image"
                        />
                      </div>
                    </div>

                    <div className={styles.rightSide}>
                      <div className={styles.list}>
                        <h2>Popular</h2>
                        <p>Programming</p>
                        <p>Books for children</p>
                        <p>Psychology</p>
                        <p>Business</p>
                      </div>

                      <div className={styles.list}>
                        <h2>Cash</h2>
                        <p>Delivery</p>
                        <p>Payment</p>
                        <p>About the store</p>
                      </div>

                      <div className={styles.list}>
                        <h2>Help</h2>
                        <p>Contacts</p>
                        <p>Purchase returns</p>
                        <p>Buyer help</p>
                      </div>
                    </div>

                  </div>
                  <h3>All rights reserved © 2003-2024 Foody TERMS OF USE | Privacy Policy</h3>
                </footer>
              </body>
            </html>
          </>
        )
      }
    </>
  );
}

