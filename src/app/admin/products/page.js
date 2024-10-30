"use client";
import { useDispatch, useSelector } from "react-redux";
import { settingPage } from "../../../features/pagesSlice";
import styles from "./products.module.css";
import { Dropdown } from "react-bootstrap";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Delete from "../../../../components/Delete"
import SuccessMessage from "../../../../components/SuccessMessage";
import AsideModal from "../../../../components/AsideModal";
import { useRouter } from "next/navigation";
import { useLanguage } from "../../../../context/LanguageContext";

import en from "../../../../locales/admin/en.json";
import az from "../../../../locales/admin/az.json";
import ru from "../../../../locales/admin/ru.json";

export default function Products() {
    const dispatch = useDispatch();
    const router = useRouter();

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [restaurants, setRestaurants] = useState([]);

    const [loading, setLoading] = useState(true);

    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openSuccessMessage, setOpenSuccessMessage] = useState(false);

    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const [editProductModalOpened, setEditProductModalOpened] = useState(false);

    const dataProducts = useSelector(state => state.product.data);

    const logged = sessionStorage.getItem("login");

    const { language, setLanguage } = useLanguage();
    const [translation, setTranslation] = useState(en);

    useEffect(() => {
        dispatch(settingPage("products"));
        getProducts();
    }, [dataProducts, dispatch]);


    function getProducts() {
        setLoading(true);
        setProducts(null);
        dataProducts.then(result => { setProducts(result); setLoading(false); })
    }

    const dataRestuarant = useSelector(state => state.restuarant.data)
    useEffect(() => {
        dataRestuarant.then(result => { setRestaurants(result); })
    }, [dataRestuarant]);

    const dataCategory = useSelector(state => state.category.data)
    useEffect(() => {
        dataCategory.then(result => { setCategories(result); })
    }, [dataCategory])

    useEffect(() => {
        if (openDeleteModal || editProductModalOpened) {
            document.body.classList.add(styles.hiddenOverflow)
        }
        else {
            document.body.classList.remove(styles.hiddenOverflow)
        }
    })

    function showSuccess() {
        setOpenSuccessMessage(true);
        setTimeout(() => {
            setOpenSuccessMessage(false)
        }, 1500);
    }

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
                        <h1>{translation.products.products}</h1>
                        <div className={styles.restaurantTypeDiv}>
                            <h2>{translation.products.categoryType}</h2>
                            <Dropdown className={styles.dropdownMenu}>
                                <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                                    {selectedRestaurant ? (selectedRestaurant.name) : (translation.products.categoryType_all)}
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Dropdown.Item
                                        onClick={() => { setSelectedRestaurant(null) }}
                                    >{translation.products.categoryType_all}</Dropdown.Item>
                                    {categories?.map(item => (
                                        <Dropdown.Item
                                            id={item.id}
                                            onClick={() => { setSelectedRestaurant(item) }}
                                        >{item.name}</Dropdown.Item>
                                    ))}

                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </div>

                    <div className={styles.products}>
                        {loading ? (
                            <Image
                                src="/loading3.gif"
                                className={styles.loadingGif}
                                width={50}
                                height={50}
                                alt="Loading"
                            />
                        ) : (
                            products?.map((item) => {
                                const restaurantOfProduct = restaurants.find(restaurant => restaurant.id === item.rest_id);
                                {
                                    return selectedRestaurant ? (
                                        selectedRestaurant.id === restaurantOfProduct?.category_id ? (
                                            item.rest_id === restaurantOfProduct.id ? (
                                                <div key={item.id} className={styles.productItem}>
                                                    <img src={item.img_url} alt={item.name} className={styles.productImage} />
                                                    <h2 className={styles.productName}>{item.name}</h2>
                                                    <p className={styles.restName}>{restaurantOfProduct?.name}</p>
                                                    <div className={styles.lowerDiv}>
                                                        <p className={styles.productPrice}>${item.price}</p>
                                                        <div className={styles.editDiv}>
                                                            <Image
                                                                src="/admin-edit.svg"
                                                                className={styles.editButton}
                                                                width={20}
                                                                height={20}
                                                                alt="edit"
                                                                onClick={() => { setEditProductModalOpened(true), setSelectedProduct(item) }}
                                                            />

                                                            <Image
                                                                src="/admin-delete.svg"
                                                                className={styles.deleteButton}
                                                                width={20}
                                                                height={20}
                                                                alt="delete"
                                                                onClick={() => { setOpenDeleteModal(true), setSelectedProduct(item) }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>) : ("")
                                        ) : ("")
                                    ) : (
                                        <div key={item.id} className={styles.productItem}>
                                            <img src={item.img_url} alt={item.name} className={styles.productImage} />
                                            <h2 className={styles.productName}>{item.name}</h2>
                                            <p className={styles.restName}>{restaurantOfProduct?.name}</p>
                                            <div className={styles.lowerDiv}>
                                                <p className={styles.productPrice}>${item.price}</p>
                                                <div className={styles.editDiv}>
                                                    <Image
                                                        src="/admin-edit.svg"
                                                        className={styles.editButton}
                                                        width={20}
                                                        height={20}
                                                        alt="edit"
                                                        onClick={() => { setEditProductModalOpened(true), setSelectedProduct(item) }}
                                                    />

                                                    <Image
                                                        src="/admin-delete.svg"
                                                        className={styles.deleteButton}
                                                        width={20}
                                                        height={20}
                                                        alt="delete"
                                                        onClick={() => { setOpenDeleteModal(true), setSelectedProduct(item) }}
                                                    />
                                                </div>
                                            </div>
                                        </div>)
                                }
                            })
                        )}
                    </div>
                    {openDeleteModal && (
                        <div className={styles.modalOverlay}>
                            <Delete id={selectedProduct.id} setClosing={setOpenDeleteModal} success={showSuccess} products={getProducts} whichPage={"products"} />
                        </div>
                    )}

                    {openSuccessMessage && (
                        <div className={styles.modalOverlay}>
                            <SuccessMessage />
                        </div>
                    )}

                    {editProductModalOpened && (
                        <div className={styles.modalOverlay}>
                            <AsideModal setClosing={setEditProductModalOpened} whichModal={"editProduct"} item={selectedProduct} />
                        </div>
                    )
                    }

                </div>

            </>
        )
            : (<>
                <h1 style={{ color: "#fff" }}>{translation.loginFirst}</h1>
                <button className={styles.loginFirstButton} onClick={() => { router.push("/admin/login") }}>Login</button>
            </>
            )

    );
}
