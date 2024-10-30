"use client"

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { settingPage } from "../../features/pagesSlice";
import styles from "./howitworks.module.css";
import Image from "next/image";
import { useLanguage } from "../../../context/LanguageContext";

import en from "../../../locales/en.json";
import az from "../../../locales/az.json";
import ru from "../../../locales/ru.json";

export default function HowItWorks() {

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
        dispatch(settingPage("howitworks"));
    }, [dispatch]);

    return (
        <>
            <div className={styles.container}>
                <h1>{translation.howitworks.heading}</h1>
                <p>{translation.howitworks.description}</p>
                <div className={styles.imagesDiv}>
                    <Image
                        src="/howitworks-man.svg"
                        className={styles.manImage}
                        width={0}
                        height={0}
                        alt="image"
                        priority
                    />
                </div>
            </div>
        </>
    )
}