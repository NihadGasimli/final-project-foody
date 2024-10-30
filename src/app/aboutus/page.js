"use client"

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { settingPage } from "../../features/pagesSlice";
import styles from "./aboutus.module.css";
import Image from "next/image";
import { useLanguage } from "../../../context/LanguageContext";

import en from "../../../locales/en.json";
import az from "../../../locales/az.json";
import ru from "../../../locales/ru.json";

export default function AboutUs() {

    const dispatch = useDispatch();
    const [translation, setTranslation] = useState(en);

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
        dispatch(settingPage("aboutus"));
    }, [dispatch]);

    return (
        <>
            <div className={styles.container}>
                <div className={styles.leftSide}>
                    <h1>{translation.aboutus.heading}</h1>
                    <p>{translation.aboutus.description}</p>
                </div>

                <div className={styles.rightSide}>
                    <div className={styles.yellowBackground}>


                    </div>

                    <div className={styles.foodCard1}>
                        <Image
                            src="/foodcard-burger.svg"
                            className={styles.foodCardImage}
                            width={0}
                            height={0}
                            alt="image"
                            priority
                        />
                        <h2 className={styles.foodCardName}>{translation.aboutus.hamburger}</h2>
                        <Image
                            src="/Stars.svg"
                            className={styles.foodCardStars}
                            width={0}
                            height={0}
                            alt="image"
                            priority
                        />
                        <p className={styles.foodCardPrice}>$5.90</p>
                    </div>

                    <div className={styles.foodCard2}>
                        <Image
                            src="/foodcard-pizza.svg"
                            className={styles.foodCardImage}
                            width={0}
                            height={0}
                            alt="image"
                            priority
                        />
                        <h2 className={styles.foodCardName}>{translation.aboutus.pizza}</h2>
                        <Image
                            src="/Stars.svg"
                            className={styles.foodCardStars}
                            width={0}
                            height={0}
                            alt="image"
                            priority
                        />
                        <p className={styles.foodCardPrice}>$7.90</p>
                    </div>

                    <div className={styles.foodCard3}>
                        <Image
                            src="/foodcard-soup.svg"
                            className={styles.foodCardImage}
                            width={0}
                            height={0}
                            alt="image"
                            priority
                        />
                        <h2 className={styles.foodCardName}>{translation.aboutus.soup}</h2>
                        <Image
                            src="/Stars.svg"
                            className={styles.foodCardStars}
                            width={0}
                            height={0}
                            alt="image"
                            priority
                        />
                        <p className={styles.foodCardPrice}>$8.90</p>
                    </div>

                    <div className={styles.foodCard4}>
                        <Image
                            src="/foodcard-coffee.svg"
                            className={styles.foodCardImage}
                            width={0}
                            height={0}
                            alt="image"
                            priority
                        />
                        <h2 className={styles.foodCardName}>{translation.aboutus.coffee}</h2>
                        <Image
                            src="/Stars.svg"
                            className={styles.foodCardStars}
                            width={0}
                            height={0}
                            alt="image"
                            priority
                        />
                        <p className={styles.foodCardPrice}>$1.40</p>
                    </div>
                </div>
            </div>
        </>
    )
}