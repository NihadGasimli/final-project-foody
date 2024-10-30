"use client"

import { settingPage } from "../../../features/pagesSlice";
import { useDispatch, useSelector } from "react-redux";
import styles from "./dashboard.module.css";
import DoughnutChart from "../../../../components/DoughnutChart";
import StackedAreaChart from "../../../../components/StackedAreaChart";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import en from "../../../../locales/admin/en.json";
import az from "../../../../locales/admin/az.json";
import ru from "../../../../locales/admin/ru.json";
import { useLanguage } from "../../../../context/LanguageContext";

export default function Dashboard() {
    const dispatch = useDispatch();
    const router = useRouter();

    const dataOffers = useSelector(state => state.offers.data)
    const [dataOrders, setDataOrders] = useState({ labels: [], values: [] });
    const [dataSalary, setDataSalary] = useState({ labels: [], values: [] });
    const [offers, setOffers] = useState(null);

    dataOffers.then(result => { setOffers(result) })

    const dataRestuarant = useSelector(state => state.restuarant.data)

    const logged = sessionStorage.getItem("login");

    const { language, setLanguage } = useLanguage();
    const [translation, setTranslation] = useState(en);

    useEffect(() => {
        dataRestuarant.then(result => {
            const labels = [];
            const values = [];
            result.map((item) => {
                labels?.push(item.name)
                values?.push(item.delivery_price)
            })
            setDataOrders({ labels, values })
        })
    }, [dataRestuarant]);

    dispatch(settingPage("dashboard"));

    useEffect(() => {
        if (language === "en") {
            setTranslation(en)
        }
        else if (language === "az") {
            setTranslation(az)
        }
        else if (language === "ru") {
            setTranslation(ru)
        }
    }, [language])

    return (
        logged === "true" ? (
            <>
                <div className={styles.container}>
                    <div className={styles.upperContainer}>
                        <div className={styles.upperLeftSide}>
                            <h1>{translation.dashboard.orders}</h1>
                            <div className={styles.doughnut}>
                                <DoughnutChart data={dataOrders} className={styles.doughnutChart} />
                            </div>
                        </div>

                        <div className={styles.upperRightSide}>
                            <h1>{translation.dashboard.totalSalary}</h1>
                            <div className={styles.totalSalary}>
                                <StackedAreaChart data={dataOrders} />
                            </div>
                        </div>
                    </div>

                    <div className={styles.lowerContainer}>
                        <div className={styles.lowerLeftSide}>
                            <h1>{translation.dashboard.offers}</h1>
                            <div className={styles.offersDiv} onClick={() => {
                                router.push("/admin/offers")
                            }}>
                                {offers ?
                                    (
                                        offers.map((item) => (
                                            <>
                                                <div className={styles.offer}>
                                                    <Image
                                                        src={item.img_url}
                                                        className={styles.loadingGif}
                                                        width={50}
                                                        height={30}
                                                        alt="Loading"
                                                    />
                                                    <h1 style={{ color: "#fff" }}>{item.name}</h1>
                                                </div>
                                            </>
                                        ))
                                    )
                                    :
                                    (
                                        <h1>There are no risks assigned.</h1>
                                    )}

                            </div>
                        </div>

                        <div className={styles.lowerRightSide}>
                            <h1>{translation.dashboard.assignedItems}</h1>
                        </div>
                    </div>
                </div>
            </>
        )
            : (<>
                <h1 style={{ color: "#fff" }}>{translation.loginFirst}</h1>
                <button className={styles.loginFirstButton} onClick={() => { router.push("/admin/login") }}>Login</button>
            </>
            )
    )
}