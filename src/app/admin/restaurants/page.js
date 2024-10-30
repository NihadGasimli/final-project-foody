"use client";

import { useDispatch, useSelector } from "react-redux";
import { settingPage } from "../../../features/pagesSlice";
import styles from "./restaurants.module.css";
import { Dropdown } from "react-bootstrap";
import { useEffect, useState } from "react";
import Image from "next/image";
import Delete from "../../../../components/Delete"
import SuccessMessage from "../../../../components/SuccessMessage";
import { deleteRestuarant } from "../../../features/restaurantsSlice";
import AsideModal from "../../../../components/AsideModal";
import { useRouter } from "next/navigation";
import { useLanguage } from "../../../../context/LanguageContext";

import en from "../../../../locales/admin/en.json";
import az from "../../../../locales/admin/az.json";
import ru from "../../../../locales/admin/ru.json";

export default function Restaurants() {
    const [categories, setCategories] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openSuccessMessage, setOpenSuccessMessage] = useState(false);
    const [deletingRestaurantId, setDeletingRestaurantId] = useState(null);
    const [editingRestaurantIdd, setEditingRestaurantId] = useState(null);
    const [addRestaurantModalOpened, setAddRestaurantModalOpened] = useState(false);
    const [editRestaurantModalOpened, setEditRestaurantModalOpened] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [item, setItem] = useState(null);

    const dataRestuarant = useSelector(state => state.restuarant.data)

    const logged = sessionStorage.getItem("login");

    const { language, setLanguage } = useLanguage();
    const [translation, setTranslation] = useState(en);

    function getRestaurants() {
        setLoading(true);
        dataRestuarant.then(result => { setRestaurants(result); setLoading(false); })
    }

    const dataCategory = useSelector(state => state.category.data)
    useEffect(() => {
        dataCategory.then(result => { setCategories(result); })
    }, [dataCategory])

    const dispatch = useDispatch();
    const router = useRouter();

    useEffect(() => {
        dispatch(settingPage("restaurants"));
        getRestaurants();
    }, [dispatch, dataRestuarant]);

    function showSuccess() {
        setOpenSuccessMessage(true);
        setTimeout(() => {
            setOpenSuccessMessage(false)
        }, 1500);
    }

    useEffect(() => {
        if (openDeleteModal) {
            document.body.classList.add(styles.hiddenOverflow)
        }
        else {
            document.body.classList.remove(styles.hiddenOverflow)
        }
    })

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
                        <h1>{translation.restaurants.restaurants}</h1>
                        <div className={styles.restaurantTypeDiv}>
                            <div className={styles.categoryDiv}>
                                <h2>{translation.restaurants.categoryType}</h2>
                                <Dropdown className={styles.dropdownMenu}>
                                    <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                                        {selectedCategory ? (selectedCategory.name) : (translation.restaurants.categoryType_all)}
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Dropdown.Item
                                            onClick={() => { setSelectedCategory(null) }}
                                        >{translation.restaurants.categoryType_all}</Dropdown.Item>
                                        {categories?.map(item => (
                                            <Dropdown.Item
                                                id={item.id}
                                                onClick={() => { setSelectedCategory(item) }}
                                            >{item.name}</Dropdown.Item>
                                        ))}

                                    </Dropdown.Menu>
                                </Dropdown>

                            </div>
                            <button className={styles.addRestaurantButton} onClick={() => { setAddRestaurantModalOpened(true) }}>{translation.restaurants.addRestaurant}</button>
                        </div>
                    </div>

                    <div className={styles.restaurants}>
                        {loading ? (
                            <Image
                                src="/loading3.gif"
                                className={styles.loadingGif}
                                width={50}
                                height={50}
                                alt="Loading"
                            />
                        ) : (
                            restaurants?.map((item) => {
                                return selectedCategory ? (
                                    selectedCategory.id === item.category_id ? (
                                        <div key={item.id} className={styles.restaurantItem}>
                                            <img src={item.img_url} alt={item.name} className={styles.restaurantImage} />
                                            <div className={styles.rightDivItem}>
                                                <h2>{item.name}</h2>
                                                <p>{item.cuisine}</p>
                                            </div>
                                            <div className={styles.rightEditAndDeleteDiv}>
                                                <Image
                                                    src="/admin-edit.svg"
                                                    className={styles.editButton}
                                                    width={20}
                                                    height={20}
                                                    alt="edit"
                                                    onClick={() => { setEditRestaurantModalOpened(true), setEditingRestaurantId(item.id), setItem(item) }}
                                                />

                                                <Image
                                                    src="/admin-delete.svg"
                                                    className={styles.deleteButton}
                                                    width={20}
                                                    height={20}
                                                    alt="delete"
                                                    onClick={() => { setOpenDeleteModal(true), setDeletingRestaurantId(item.id) }}
                                                />
                                            </div>
                                        </div>
                                    ) : ("")
                                ) : (<div key={item.id} className={styles.restaurantItem}>
                                    <img src={item.img_url} alt={item.name} className={styles.restaurantImage} />
                                    <div className={styles.rightDivItem}>
                                        <h2>{item.name}</h2>
                                        <p>{item.cuisine}</p>
                                    </div>
                                    <div className={styles.rightEditAndDeleteDiv}>
                                        <Image
                                            src="/admin-edit.svg"
                                            className={styles.editButton}
                                            width={20}
                                            height={20}
                                            alt="edit"
                                            onClick={() => { setEditRestaurantModalOpened(true), setEditingRestaurantId(item.id), setItem(item) }}
                                        />

                                        <Image
                                            src="/admin-delete.svg"
                                            className={styles.deleteButton}
                                            width={20}
                                            height={20}
                                            alt="delete"
                                            onClick={() => { setOpenDeleteModal(true), setDeletingRestaurantId(item.id) }}
                                        />
                                    </div>
                                </div>)
                            })
                        )
                        }
                    </div>
                    {openDeleteModal && (
                        <div className={styles.modalOverlay}>
                            <Delete id={deletingRestaurantId} setClosing={setOpenDeleteModal} success={showSuccess} restaurants={getRestaurants} whichPage={"restaurants"} />
                        </div>
                    )}

                    {openSuccessMessage && (
                        <div className={styles.modalOverlay}>
                            <SuccessMessage />
                        </div>
                    )}

                    {addRestaurantModalOpened && (
                        <div className={styles.modalOverlay}>
                            <AsideModal setClosing={setAddRestaurantModalOpened} whichModal={"restaurant"} />
                        </div>
                    )
                    }

                    {editRestaurantModalOpened && (
                        <div className={styles.modalOverlay}>
                            <AsideModal setClosing={setEditRestaurantModalOpened} whichModal={"editRestaurant"} item={item} editingRestaurantId={editingRestaurantIdd} />
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

    )
}
