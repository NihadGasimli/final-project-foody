"use client";

import { useDispatch, useSelector } from "react-redux";
import styles from "./category.module.css";
import { useEffect, useState } from "react";
import Image from "next/image";
import { settingPage } from "../../../features/pagesSlice";
import Delete from "../../../../components/Delete"
import SuccessMessage from "../../../../components/SuccessMessage";
import AsideModal from "../../../../components/AsideModal";
import { useRouter } from "next/navigation";
import { useLanguage } from "../../../../context/LanguageContext";

import en from "../../../../locales/admin/en.json";
import az from "../../../../locales/admin/az.json";
import ru from "../../../../locales/admin/ru.json";

export default function Category() {
    const dispatch = useDispatch();
    const router = useRouter();

    const [categories, setCategories] = useState(null);
    const [loading, setLoading] = useState(true);

    const [item, setItem] = useState(null);

    const [editCategoryModalOpened, setEditCategoryModalOpened] = useState(false);
    const [addCategoryModalOpened, setAddCategoryModalOpened] = useState(false);

    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openSuccessMessage, setOpenSuccessMessage] = useState(false);

    const dataCategory = useSelector(state => state.category.data)

    const logged = sessionStorage.getItem("login");

    const { language, setLanguage } = useLanguage();
    const [translation, setTranslation] = useState(en);

    function getCategories() {
        setLoading(true);
        dataCategory.then(result => { setCategories(result); setLoading(false); })
    }

    useEffect(() => {
        dispatch(settingPage("category"));
        getCategories()
    }, [dispatch, dataCategory]);

    useEffect(() => {
        if (openDeleteModal) {
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
                        <h1>{translation.category.category}</h1>
                        <button className={styles.addCategoryButton} onClick={() => { setAddCategoryModalOpened(true) }}>{translation.category.addCategory}</button>
                    </div>

                    <div className={styles.categories}>
                        {loading ? (
                            <Image
                                src="/loading3.gif"
                                className={styles.loadingGif}
                                width={50}
                                height={50}
                                alt="Loading"
                            />
                        ) : (
                            <table className={styles.table}>
                                <tr>
                                    <th>ID</th>
                                    <th>{translation.category.image}</th>
                                    <th>{translation.category.name}</th>
                                    <th>{translation.category.slug}</th>
                                    <hr></hr>
                                </tr>
                                {categories?.map((item) => (
                                    <tr>
                                        <td>{item.id}</td>
                                        <td> <Image
                                            src={item.img_url}
                                            className={styles.tableImage}
                                            width={50}
                                            height={50}
                                            alt="image"
                                        />
                                        </td>
                                        <td>{item.name}</td>
                                        <td>{item.slug}</td>
                                        <td><Image
                                            src="/admin-edit.svg"
                                            className={styles.editButton}
                                            width={20}
                                            height={20}
                                            alt="edit"
                                            onClick={() => { setItem(item), setEditCategoryModalOpened(true); }}
                                        />

                                            <Image
                                                src="/admin-delete.svg"
                                                className={styles.deleteButton}
                                                width={20}
                                                height={20}
                                                alt="delete"
                                                onClick={() => { setItem(item), setOpenDeleteModal(true) }}
                                            /></td>
                                    </tr>
                                ))}
                            </table>
                        )}
                    </div>

                    {openDeleteModal && (
                        <div className={styles.modalOverlay}>
                            <Delete id={item.id} setClosing={setOpenDeleteModal} success={showSuccess} categories={getCategories} whichPage={"category"} />
                        </div>
                    )}

                    {openSuccessMessage && (
                        <div className={styles.modalOverlay}>
                            <SuccessMessage />
                        </div>
                    )}

                    {editCategoryModalOpened && (
                        <div className={styles.modalOverlay}>
                            <AsideModal setClosing={setEditCategoryModalOpened} whichModal={"editCategory"} item={item} />
                        </div>
                    )
                    }

                    {addCategoryModalOpened && (
                        <div className={styles.modalOverlay}>
                            <AsideModal setClosing={setAddCategoryModalOpened} whichModal={"category"} />
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