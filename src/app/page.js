"use client"

import { useDispatch, useSelector } from "react-redux";
import { settingPage } from "../features/pagesSlice";
import styles from "./home.module.css";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import { useLanguage } from "../../context/LanguageContext";

import en from "../../locales/en.json";
import ru from "../../locales/ru.json";
import az from "../../locales/az.json";

export default function Home() {
  const dispatch = useDispatch();
  const { language } = useLanguage();

  useEffect(() => {
    if (language === "az") {
      setTranslation(az)
    }
    else if (language === "ru") {
      setTranslation(ru)
    }
    else {
      setTranslation(en)
    }
  }, [language])

  useEffect(() => {
    dispatch(settingPage("home"));
  }, [dispatch]);

  const [animate, setAnimate] = useState(false);
  const [products, setProducts] = useState(null);
  const [translation, setTranslation] = useState(en);

  const router = useRouter();

  function animatee() {
    setAnimate(true);
    const timer = setTimeout(() => {
      setAnimate(false);
    }, 3000);

    return () => clearTimeout(timer);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      animatee();
    }, 6000);

    return () => clearInterval(interval);
  }, []);


  const dataProducts = useSelector(state => state.product.data);

  useEffect(() => {
    dataProducts.then(result => { setProducts(result); });
  }, [dataProducts])

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


  return (
    <>
      <div className={styles.container}>
        <div className={styles.headingDiv}>
          <div className={styles.leftSide}>
            <h1>{translation.homepage.heading}</h1>
            <p>{translation.homepage.description}</p>
            <div className={styles.buttonsDiv}>
              <button className={styles.registerButton} onClick={() => { router.push("/login") }}>{translation.homepage.registerButton}</button>
              <button className={styles.orderNowButton} onClick={() => { router.push("/restaurants") }}>{translation.homepage.orderNowButton}</button>
            </div>
          </div>
          <div className={styles.rightSide}>
            <div className={styles.photoDiv}>
              <Image
                src="/burger-photo.svg"
                className={styles.burgerPhoto}
                width={0}
                height={0}
                alt="image"
                priority
              />
            </div>
            <div className={`${styles.comment1} ${animate ? styles.animate1 : ''}`}>
              <Image
                src="/cheeseburger-photo.svg"
                className={styles.commentPhoto}
                width={0}
                height={0}
                alt="image"
              />
              <div className={styles.commentTexts}>
                <h2>Cheeseburger</h2>
                <p>Yummy ...</p>
              </div>
            </div>

            <div className={`${styles.comment2} ${animate ? styles.animate2 : ''}`}>
              <Image
                src="/fries-photo.svg"
                className={styles.commentPhoto}
                width={0}
                height={0}
                alt="image"
              />
              <div className={styles.commentTexts}>
                <h2>French Fries</h2>
                <p>Yummy ...</p>
              </div>
            </div>

            <div className={`${styles.comment3} ${animate ? styles.animate3 : ''}`}>
              <Image
                src="/pizza-photo.svg"
                className={styles.commentPhoto}
                width={0}
                height={0}
                alt="image"
              />
              <div className={styles.commentTexts}>
                <h2>Pizza Hut</h2>
                <p>Yummy ...</p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.featuresDiv}>
          <h2>{translation.homepage.features}</h2>
          <p>{translation.homepage.featuresDescription}</p>

          <div className={styles.features}>
            <div className={styles.feature1}>
              <Image
                src="/feature1-photo.svg"
                className={styles.featurePhoto}
                width={0}
                height={0}
                alt="image"
              />
              <h3>{translation.homepage.firstCardHeading}</h3>
              <p>Lorem ipsum is placeholder  commonly used in the graphic </p>
            </div>

            <div className={styles.feature2}>
              <Image
                src="/feature2-photo.svg"
                className={styles.featurePhoto}
                width={0}
                height={0}
                alt="image"
              />
              <h3>{translation.homepage.secondCardHeading}</h3>
              <p>Lorem ipsum is placeholder  commonly used in the graphic </p>
            </div>

            <div className={styles.feature3}>
              <Image
                src="/feature3-photo.svg"
                className={styles.featurePhoto}
                width={0}
                height={0}
                alt="image"
              />
              <h3>{translation.homepage.thirdCardHeading}</h3>
              <p>Lorem ipsum is placeholder  commonly used in the graphic </p>
            </div>
          </div>
        </div>

        <div className={styles.advertisementDiv}>
          <div className={styles.advertisement1}>
            <div className={styles.advertisementTexts}>
              <h2>{translation.homepage.firstAdvertisement}</h2>
              <p>Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.</p>
            </div>
            <Image
              src="/advertisement1-photo.svg"
              className={styles.advertisementPhoto}
              width={0}
              height={0}
              alt="image"
            />
          </div>

          <div className={styles.advertisement2}>
            <Image
              src="/advertisement2-photo.svg"
              className={styles.advertisementPhoto}
              width={0}
              height={0}
              alt="image"
            />
            <div className={styles.advertisementTexts}>
              <h2>{translation.homepage.secondAdvertisement}</h2>
              <p>Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.</p>
            </div>
          </div>

          <div className={styles.advertisement3}>
            <div className={styles.advertisementTexts}>
              <h2>{translation.homepage.thirdAdvertisement}</h2>
              <p>Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.</p>
            </div>
            <Image
              src="/advertisement3-photo.svg"
              className={styles.advertisementPhoto}
              width={0}
              height={0}
              alt="image"
            />
          </div>
        </div>

        <div className={styles.popularFoodsDiv}>
          <h2>{translation.homepage.popularFoodHeading}</h2>
          <p>{translation.homepage.popularFoodDescription}</p>
          <div className={styles.foodCards}>
            {products?.slice(0, 3).map((item, index) => (
              <div className={styles.foodCard} key={index}>
                <Image
                  src={item.img_url}
                  className={styles.foodCardImage}
                  width={0}
                  height={0}
                  alt="image"
                />
                <h3>{item.name}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.discoverDiv}>
          <Image
            src="pizza-photo.svg"
            className={styles.discoverFoodImage}
            width={0}
            height={0}
            alt="image"
          />
          <div className={styles.discoverCenterDiv}>
            <h2>{translation.homepage.discoverDiv}</h2>
            <button className={styles.exploreNowButton} onClick={() => { router.push("/restaurants") }}>{translation.homepage.discoverDivButton}</button>
          </div>
          <Image
            src="burger-photo.svg"
            className={styles.discoverFoodImage}
            width={0}
            height={0}
            alt="image"
          />
        </div>
      </div>
    </>
  )
}