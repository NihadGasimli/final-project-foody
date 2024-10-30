"use client";

import { useEffect, useRef, useState } from "react";
import { settingPage } from "../../../features/pagesSlice";
import styles from "./orders.module.css";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";

import en from "../../../../locales/admin/en.json";
import az from "../../../../locales/admin/az.json";
import ru from "../../../../locales/admin/ru.json";
import { useLanguage } from "../../../../context/LanguageContext";

export default function Orders() {
    const dispatch = useDispatch();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState(null);
    const [showMore, setShowMore] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [visibleOrder, setVisibleOrder] = useState(null);

    const logged = sessionStorage.getItem("login");

    const dataOrders = useSelector(state => state.orders.data)

    const modalRef = useRef(null);

    const { language, setLanguage } = useLanguage();
    const [translation, setTranslation] = useState(en);


    async function deleteOrder(id) {
        setLoading(true);
        const token = JSON.parse(localStorage.getItem("access_token"));
        const response = await axios.delete('/api/order', {
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: {
                order_id: id
            }
        });

        if (response) {
            const responseOrders = await axios.get('/api/order/user', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const sortedOrders = responseOrders?.data?.result?.data?.sort((a, b) => b.created - a.created);
            console.log(sortedOrders)
            setOrders(sortedOrders)
        }
    }

    useEffect(() => {
        if (orders) {
            setLoading(false);
        }
    }, [orders])

    const toggleVisibility = (orderId) => {
        if (visibleOrder === orderId) {
            setVisibleOrder(null);  // Hide if the same button is clicked again
        } else {
            setVisibleOrder(orderId);  // Show the clicked button's div
        }
    };

    function getOrders() {
        setLoading(true);
        dataOrders.then(result => { setOrders(result); setLoading(false); })
    }

    useEffect(() => {
        if (showMore) {
            document.body.classList.add(styles.hiddenOverflow)
        }
        else {
            document.body.classList.remove(styles.hiddenOverflow)
        }
    })

    useEffect(() => {
        const handleClickOutside = (event) => {
            // Check if the clicked element is not inside the modal
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setShowMore(false);
            }
        };

        // Add event listener to capture all clicks
        document.addEventListener("mousedown", handleClickOutside);

        // Cleanup the event listener on component unmount
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [modalRef]);

    useEffect(() => {
        dispatch(settingPage("orders"));
        getOrders()

    }, [dispatch, dataOrders]);


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
                    <div className={styles.heading}>
                        <h1>{translation.orders.orders}</h1>
                    </div>
                    <div className={styles.orders}>
                        {loading ? (
                            <Image
                                src="/loading3.gif"
                                className={styles.loadingGif}
                                width={40}
                                height={40}
                                alt="Loading"
                                priority
                            />
                        ) : (
                            <>
                                <div className={styles.tableDiv}>
                                    <table>
                                        <th>
                                            <td>ID</td>
                                            <td>{translation.orders.time}</td>
                                            <td>{translation.orders.deliveryAddress}</td>
                                            <td>{translation.orders.amount}</td>
                                            <td>{translation.orders.paymentMethod}</td>
                                            <td>{translation.orders.contact}</td>
                                            <td></td>
                                        </th>

                                        {orders?.map((item, index) => {
                                            const timestamp = item.created;
                                            const date = new Date(timestamp);
                                            const formattedDate = date.toLocaleDateString('en-GB', {
                                                day: '2-digit',
                                                month: 'long',
                                                year: 'numeric',
                                            });

                                            return (
                                                <>
                                                    <hr></hr>
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{formattedDate}</td>
                                                        <td>{item.delivery_address}</td>
                                                        <td>${item.amount}</td>
                                                        <td>{item.payment_method === 1 ? `pay at the door` : `pay at the door by credit card`}</td>
                                                        <td>{item.contact}</td>
                                                        <td>
                                                            <Image
                                                                src="/3dots.svg"
                                                                className={styles.moreButton}
                                                                width={20}
                                                                height={20}
                                                                alt="image"
                                                                onClick={(e) => { e.preventDefault(); toggleVisibility(index) }}
                                                            />
                                                        </td>
                                                        {visibleOrder === index && (
                                                            <div className={styles.showOrDeleteDiv}>
                                                                <button className={styles.showButton} onClick={() => {
                                                                    setShowMore(true);
                                                                    setSelectedOrder(item.products)
                                                                    setVisibleOrder(null)
                                                                }}>{translation.orders.showButton}</button>
                                                                <button className={styles.deleteButton} onClick={() => { deleteOrder(item.id); setVisibleOrder(null) }}>{translation.orders.deleteButton}</button>
                                                            </div>
                                                        )}
                                                    </tr>
                                                </>
                                            )
                                        })}
                                    </table>
                                </div>

                                {showMore ? (
                                    <div className={styles.modalOverlay}>
                                        <div className={styles.orderMoreDiv} ref={modalRef}>
                                            <table>
                                                <th>
                                                    <td>{translation.orders.image}</td>
                                                    <td>{translation.orders.name}</td>
                                                    <td>{translation.orders.price}</td>
                                                    <td>{translation.orders.count}</td>
                                                    <td>{translation.orders.amount}</td>
                                                </th>

                                                {selectedOrder?.map((item, index) => {
                                                    return (
                                                        <>
                                                            <hr></hr>
                                                            <tr key={index}>
                                                                <td>
                                                                    <Image
                                                                        src={item.img_url}
                                                                        className={styles.logo}
                                                                        width={40}
                                                                        height={40}
                                                                        alt="image"
                                                                    />
                                                                </td>
                                                                <td>{item.name}</td>
                                                                <td>{item.price}</td>
                                                                <td>{item.count}</td>
                                                                <td>{item.amount}</td>
                                                            </tr>
                                                        </>
                                                    )
                                                })}
                                            </table>
                                        </div>
                                    </div>
                                ) : null}
                            </>
                        )}
                    </div>
                </div >
            </>
        )
            : (<>
                <h1 style={{ color: "#fff" }}>{translation.loginFirst}</h1>
                <button className={styles.loginFirstButton} onClick={() => { router.push("/admin/login") }}>Login</button>
            </>
            )
    )
}