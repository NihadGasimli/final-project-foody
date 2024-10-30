"use client"

import { usePathname, useRouter } from "next/navigation";
import styles from "./restaurant.module.css";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { settingPage } from "../../../features/pagesSlice";
import axios from "axios";

import en from "../../../../locales/en.json";
import az from "../../../../locales/az.json";
import ru from "../../../../locales/ru.json";
import { useLanguage } from "../../../../context/LanguageContext";

export default function Restaurant() {

    const dispatch = useDispatch();
    const pathname = usePathname();
    const router = useRouter();

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
        dispatch(settingPage("restaurants"));
    }, [dispatch]);

    const id = pathname.substring(pathname.lastIndexOf('/') + 1);
    const logged = JSON.parse(localStorage.getItem("logged"));

    const [restaurants, setRestaurants] = useState(null);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);

    const [products, setProducts] = useState(null);

    const [basket, setBasket] = useState(null);

    const [loading, setLoading] = useState(true);

    const [windowWidth, setWindowWidth] = useState(0);

    const [wait, setWait] = useState(false);

    const [openBasket, setOpenBasket] = useState(false);

    const [translation, setTranslation] = useState(en);

    const dataRestaurant = useSelector(state => state.restuarant.data);
    const dataProducts = useSelector(state => state.product.data);

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

    useEffect(() => {
        dataRestaurant.then(result => { setRestaurants(result) })
        dataProducts.then(result => { setProducts(result); })
    }, [dataProducts, dataRestaurant])

    useEffect(() => {
        if (selectedRestaurant && products) {
            setLoading(false);
        }
    }, [selectedRestaurant, products])

    useEffect(() => {
        const basket = JSON.parse(localStorage.getItem("basket"));
        setBasket(basket);
    }, [])

    useEffect(() => {
        if (openBasket) {
            document.body.classList.add(styles.hiddenOverflow)
        }
        else {
            document.body.classList.remove(styles.hiddenOverflow)
        }
    }, [openBasket])

    useEffect(() => {
        if (restaurants) {
            for (let i in restaurants) {
                if (restaurants[i].id === id) {
                    setSelectedRestaurant(restaurants[i])
                }
            }
        }
    }, [restaurants, id]);

    async function clearBasket() {
        const token = JSON.parse(localStorage.getItem("access_token"));
        let emptyBasket = {
            items: [],
            total_amount: 0,
            total_count: 0,
            total_item: 0
        }

        localStorage.setItem("basket", JSON.stringify(emptyBasket));
        setBasket(emptyBasket)

        const response = await axios.delete('/api/basket/clear', {
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: {
                basket_id: basket.id
            }
        });
        setBasket(response.data)
    }

    async function removeItem(item) {
        if (wait) {
            alert("Please wait!")
            return
        }
        setWait(true);
        let items = basket.items;
        let currentBasket = basket;
        for (let i in items) {
            if (items[i].id === item.id) {
                items[i].count -= 1;
                if (items[i].count === 0) {
                    currentBasket.total_item -= 1;
                }
            }
        }

        if (currentBasket.total_item === 0) {
            const emptyBasket = {
                ...currentBasket,
                total_item: 0
            }

            setBasket(emptyBasket)
        }

        currentBasket.total_amount -= Number(item.price);
        currentBasket.total_count--;

        const resultBasket = {
            ...currentBasket,
            items: items
        }

        localStorage.setItem("basket", JSON.stringify(resultBasket));

        setBasket(resultBasket)

        const token = JSON.parse(localStorage.getItem("access_token"));
        try {
            let retry = true;
            while (retry) {
                const response = await axios.delete('/api/basket/delete', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    data: {
                        product_id: item.id
                    }
                });

                const itemsCountInStorage = JSON.parse(localStorage.getItem("basket")).total_count;

                if (itemsCountInStorage === response.data.total_count) {
                    setWait(false);
                    localStorage.setItem("basket", JSON.stringify(response.data));
                    setBasket(response.data);
                    retry = false;
                }
            }
        } catch (error) {
            console.error("Error updating basket:", error);
        }
    }

    async function addItem(item) {
        if (logged) {
            if (wait) {
                alert("Please wait!")
                return
            }
            setWait(true);
            let items = basket?.items;
            let newProduct = true;

            for (let i in items) {
                if (items[i].id === item.id) {
                    items[i].count += 1;
                    newProduct = false;
                }
            }

            if (newProduct) {
                const newItem = {
                    ...item,
                    count: 1
                }
                items.push(newItem)
            }

            let currentBasket = basket;
            currentBasket.total_amount += Number(item.price);
            currentBasket.total_count++;
            if (newProduct) {
                currentBasket.total_item++;
            }

            const resultBasket = {
                ...currentBasket,
                items: items
            }

            localStorage.setItem("basket", JSON.stringify(resultBasket));

            setBasket(resultBasket)

            const token = JSON.parse(localStorage.getItem("access_token"));
            try {
                let retry = true;
                while (retry) {
                    const response = await axios.post('/api/basket/add', {
                        product_id: item.id
                    }, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });

                    const itemsCountInStorage = JSON.parse(localStorage.getItem("basket")).total_count;

                    if (itemsCountInStorage === response.data.total_count) {
                        setWait(false);
                        localStorage.setItem("basket", JSON.stringify(response.data));
                        setBasket(response.data);
                        retry = false;
                    }
                }
            } catch (error) {
                console.error("Error updating basket:", error);
            }
        }
        else {
            alert("Please login first!");
            router.push("/login")
        }
    }

    return (
        <>
            {loading ? (
                <Image
                    src="/loading3.gif"
                    className={styles.loadingGif}
                    width={0}
                    height={0}
                    alt="image"
                    priority
                />
            )
                :
                (
                    <>
                        <div className={styles.container}>
                            <div className={styles.infoDiv}>
                                <Image
                                    src={selectedRestaurant?.img_url}
                                    className={styles.infoImage}
                                    width={20}
                                    height={20}
                                    alt="image"
                                />
                                <div className={styles.rightSide}>
                                    <div className={styles.nameAndAddressDiv}>
                                        <h1>{selectedRestaurant.name}</h1>
                                        <p>{selectedRestaurant.address}</p>
                                    </div>
                                    <div className={styles.cuisineAndDeliveryDiv}>
                                        <div className={styles.cuisineDiv}>
                                            <h2>{translation.restaurant.cuisine}</h2>
                                            <p>{selectedRestaurant.cuisine}</p>
                                        </div>
                                        <div className={styles.deliveryAndGoBackDiv}>
                                            <h3>${selectedRestaurant.delivery_price} <br></br>{translation.restaurant.deliveryMin}</h3>
                                            <button className={styles.goBackButton} onClick={() => { router.push("/restaurants") }}>{translation.restaurant.goBackButton}</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={`${styles.productsAndBasketDiv}`}>
                                <div className={styles.productsDiv}>
                                    <h1>{translation.restaurant.products}</h1>
                                    {products?.map((item, index) => (
                                        item.rest_id === id ? (
                                            <div key={index}>
                                                <hr></hr>
                                                <div className={styles.product}>
                                                    <div className={styles.leftSide}>
                                                        <Image
                                                            src={item.img_url}
                                                            className={styles.productImage}
                                                            width={0}
                                                            height={0}
                                                            alt="image"
                                                        />
                                                        <div className={styles.productTexts}>
                                                            <h2>{item.name}</h2>
                                                            <p>{item.description}</p>
                                                        </div>
                                                    </div>
                                                    <div className={styles.rightSide}>
                                                        <p>From  <span className={styles.productPrice}> ${item.price}</span></p>
                                                        <button className={styles.addProductButton} onClick={() => { addItem(item) }}>+</button>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : null
                                    ))}
                                    {windowWidth < 900 ? (
                                        <div className={styles.mobileBottomDiv} onClick={() => { setOpenBasket(true); }}>
                                            <div className={styles.leftSide}>
                                                <Image
                                                    src="/shopping_basket_white.svg"
                                                    className={styles.logo}
                                                    width={0}
                                                    height={0}
                                                    alt="image"
                                                />
                                                <p>{basket?.total_item} ${translation.restaurant.items}</p>
                                            </div>
                                            <div className={styles.rightSide}>
                                                <h2>${Math.round(basket?.total_amount * 100) / 100}</h2>
                                            </div>
                                        </div>
                                    ) : null}
                                </div>

                                <div className={`${openBasket ? styles.modalOverlay : ''}`}>
                                    <div className={styles.basketDiv} style={{ display: windowWidth < 900 ? (openBasket ? 'flex' : 'none') : 'flex' }}>
                                        {!basket?.items?.length ? (
                                            <div className={styles.noItemsDiv}>
                                                <div className={styles.topDivBasket}>
                                                    <Image
                                                        src="/shopping_basket_gray.svg"
                                                        className={styles.logo}
                                                        width={0}
                                                        height={0}
                                                        alt="image"
                                                    />
                                                    <p>0 {translation.restaurant.items}</p>
                                                    {openBasket && (
                                                        <Image
                                                            src="/XButton.svg"
                                                            className={styles.closeBasketButton}
                                                            width={0}
                                                            height={0}
                                                            alt="image"
                                                            onClick={() => { setOpenBasket(false); }}
                                                        />
                                                    )}
                                                </div>
                                                <div className={styles.centeredDivBasket}>
                                                    <Image
                                                        src="/emptyBasket.svg"
                                                        className={styles.logo}
                                                        width={0}
                                                        height={0}
                                                        alt="image"
                                                    />
                                                    <p>{translation.restaurant.basketEmpty}</p>
                                                </div>

                                                <div className={styles.bottomDivBasket} onClick={() => { logged ? router.push("/user?page=checkout") : (alert("Please login first!"), router.push("/login")); }}>
                                                    <p>{translation.restaurant.checkout}</p>
                                                    <h2>$0.00</h2>
                                                </div>
                                            </div>
                                        ) :
                                            (
                                                <div className={styles.itemsDiv}>
                                                    <div className={styles.topDiv}>
                                                        <div className={styles.topDivBasket}>
                                                            <div className={styles.leftSide}>
                                                                <Image
                                                                    src="/shopping_basket_orange.svg"
                                                                    className={styles.logo}
                                                                    width={0}
                                                                    height={0}
                                                                    alt="image"
                                                                />
                                                                <p>{basket?.total_item} {translation.restaurant.items}</p>
                                                            </div>
                                                            {openBasket && (
                                                                <Image
                                                                    src="/XButton.svg"
                                                                    className={styles.closeBasketButton}
                                                                    width={0}
                                                                    height={0}
                                                                    alt="image"
                                                                    onClick={() => { setOpenBasket(false); }}
                                                                />
                                                            )}
                                                            <Image
                                                                src="/delete_sweep.svg"
                                                                className={styles.deleteLogo}
                                                                width={0}
                                                                height={0}
                                                                alt="image"
                                                                onClick={() => { clearBasket() }}
                                                            />
                                                        </div>
                                                        <hr></hr>
                                                        <div className={styles.items}>
                                                            {basket?.items.map((item, index) => (
                                                                item.count === 0 ? null : (
                                                                    <div key={index}>
                                                                        <div className={styles.basketItem}>
                                                                            <Image
                                                                                src={item.img_url}
                                                                                className={styles.logo}
                                                                                width={50}
                                                                                height={50}
                                                                                alt="image"
                                                                            />
                                                                            <div className={styles.nameAndPriceDiv}>
                                                                                <h2>{item.name}</h2>
                                                                                <p>${item.price}</p>
                                                                            </div>
                                                                            <div className={styles.itemCountDiv}>
                                                                                <button onClick={() => { addItem(item) }}>+</button>
                                                                                <p>{item.count}</p>
                                                                                <button onClick={() => {
                                                                                    removeItem(item)
                                                                                }}>-</button>
                                                                            </div>
                                                                        </div>
                                                                        <hr></hr>
                                                                    </div>
                                                                )

                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className={styles.bottomDiv} onClick={() => { logged ? router.push("/user?page=checkout") : (alert("Please login first!"), router.push("/login")); }}>
                                                        <p>{translation.restaurant.checkout}</p>
                                                        <h2>${Math.round(basket?.total_amount * 100) / 100}</h2>
                                                    </div>
                                                </div>
                                            )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )
            }

        </>
    )
}