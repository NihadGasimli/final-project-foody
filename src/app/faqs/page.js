"use client"

import { useDispatch } from "react-redux";
import { settingPage } from "../../features/pagesSlice";
import { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../global.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import styles from "./faq.module.css";
import { useLanguage } from "../../../context/LanguageContext";

import en from "../../../locales/en.json";
import az from "../../../locales/az.json";
import ru from "../../../locales/ru.json";

export default function Faq() {

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
        dispatch(settingPage("faqs"));
    }, [dispatch]);

    return (
        <>
            <div className={styles.container}>
                <h1>{translation.faq.heading}</h1>

                <div class="accordion" id="accordionExample" className={styles.accordion}>
                    <div class="accordion-item" className={styles.accordionItem}>
                        <h2 class="accordion-header" id="headingOne">
                            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                {translation.faq.firstQ}
                            </button>
                        </h2>
                        <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                            <div class="accordion-body" className={styles.accordionBody}>
                                {translation.faq.firstA}
                            </div>
                        </div>
                        <div class="accordion-item" className={styles.accordionItem}>
                            <h2 class="accordion-header" id="headingTwo">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                    {translation.faq.secondQ}
                                </button>
                            </h2>
                            <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                                <div class="accordion-body" className={styles.accordionBody}>
                                    {translation.faq.secondA}
                                </div>
                            </div>
                            <div class="accordion-item" className={styles.accordionItem}>
                                <h2 class="accordion-header" id="headingThree">
                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                        {translation.faq.thirdQ}
                                    </button>
                                </h2>
                                <div id="collapseThree" class="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                                    <div class="accordion-body" className={styles.accordionBody}>
                                        {translation.faq.thirdA}
                                    </div>
                                </div>
                            </div>
                            <div class="accordion-item" className={styles.accordionItem}>
                                <h2 class="accordion-header" id="headingFour">
                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                                        {translation.faq.fourthQ}
                                    </button>
                                </h2>
                                <div id="collapseFour" class="accordion-collapse collapse" aria-labelledby="headingFour" data-bs-parent="#accordionExample">
                                    <div class="accordion-body" className={styles.accordionBody}>
                                        {translation.faq.fourhA}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}