"use client";

import { useDispatch, useSelector } from "react-redux";
import styles from "./offers.module.css";
import { useEffect, useState } from "react";
import { settingPage } from "../../../features/pagesSlice";
import Image from "next/image";
import AsideModal from "../../../../components/AsideModal";
import { useRouter } from "next/navigation";
import Delete from "../../../../components/Delete"
import SuccessMessage from "../../../../components/SuccessMessage";
import { useLanguage } from "../../../../context/LanguageContext";

import en from "../../../../locales/admin/en.json";
import az from "../../../../locales/admin/az.json";
import ru from "../../../../locales/admin/ru.json";

export default function Offers() {
    const dataOffers = useSelector(state => state.offers.data)
    const [offers, setOffers] = useState(null);
    const [deletingOfferId, setDeletingOfferId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editOfferModalOpened, setEditOfferModalOpened] = useState(false);
    const [addOfferModalOpened, setAddOfferModalOpened] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openSuccessMessage, setOpenSuccessMessage] = useState(false);
    const logged = sessionStorage.getItem("login");

    const { language, setLanguage } = useLanguage();
    const [translation, setTranslation] = useState(en);

    function getOffers() {
        setLoading(true);
        dataOffers.then(result => { setOffers(result); setLoading(false); })
    }

    const dispatch = useDispatch();
    const router = useRouter();

    useEffect(() => {
        dispatch(settingPage("offers"));
        getOffers()
    }, [dispatch, dataOffers])

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
                        <h1>{translation.offers.offers}</h1>
                        <button className={styles.addOfferButton} onClick={() => { setAddOfferModalOpened(true) }}>{translation.offers.addOffer}</button>
                    </div>

                    <div className={styles.offers}>
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
                                    <th>{translation.offers.image}</th>
                                    <th>{translation.offers.title}</th>
                                    <th>{translation.offers.description}</th>
                                    <hr></hr>
                                </tr>
                                {offers?.map((item) => (
                                    <>
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
                                            <td>{item.description}</td>
                                            <td><Image
                                                src="/admin-edit.svg"
                                                className={styles.editButton}
                                                width={20}
                                                height={20}
                                                alt="edit"
                                                onClick={() => { setEditOfferModalOpened(true); setEditingItem(item); }}
                                            />
                                                <Image
                                                    src="/admin-delete.svg"
                                                    className={styles.deleteButton}
                                                    width={20}
                                                    height={20}
                                                    alt="delete"
                                                    onClick={() => { setDeletingOfferId(item.id); setOpenDeleteModal(true); }}
                                                />
                                            </td>
                                        </tr>
                                    </>
                                ))}
                            </table>
                        )}
                    </div>

                    {openDeleteModal && (
                        <div className={styles.modalOverlay}>
                            <Delete id={deletingOfferId} setClosing={setOpenDeleteModal} success={showSuccess} offers={getOffers} whichPage={"offers"} />
                        </div>
                    )}

                    {editOfferModalOpened && (
                        <div className={styles.modalOverlay}>
                            <AsideModal setClosing={setEditOfferModalOpened} whichModal={"editOffer"} item={editingItem} />
                        </div>
                    )
                    }

                    {addOfferModalOpened && (
                        <div className={styles.modalOverlay}>
                            <AsideModal setClosing={setAddOfferModalOpened} whichModal={"offer"} />
                        </div>
                    )
                    }

                    {openSuccessMessage && (
                        <div className={styles.modalOverlay}>
                            <SuccessMessage />
                        </div>
                    )}
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