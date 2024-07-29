"use client";

import { useDispatch } from "react-redux";
import { setPage } from "../../../features/infoSlice";
import styles from "./restaurants.module.css";
import { Dropdown } from "react-bootstrap";
import { useEffect, useState } from "react";
import Image from "next/image";
import Delete from "../../../../components/Delete"
import SuccessMessage from "../../../../components/SuccessMessage";

export default function Restaurants() {
    const dispatch = useDispatch();
    dispatch(setPage("restaurants"));

    const [categories, setCategories] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openSuccessMessage, setOpenSuccessMessage] = useState(false);
    const [deletingRestaurantId, setDeletingRestaurantId] = useState("");



    useEffect(() => {
        fetch("/api/restuarants", { method: "GET" }).then(response => response.json()).then(result => {
            setRestaurants(result?.result.data);
            setLoading(false);
        });

        fetch("/api/category").then(response => response.json()).then(result => {
            setCategories(result?.result.data);
        })
    }, []);

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


    return (
        <>
            <div className={styles.container}>
                <div className={styles.heading}>
                    <h1>Restaurants</h1>
                    <div className={styles.restaurantTypeDiv}>
                        <h2>Category Type</h2>
                        <Dropdown className={styles.dropdownMenu}>
                            <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                                {selectedRestaurant ? (selectedRestaurant) : ("All")}
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item
                                    onClick={() => { setSelectedRestaurant(null) }}
                                >All</Dropdown.Item>
                                {categories?.map(item => (
                                    <Dropdown.Item
                                        id={item.id}
                                        onClick={() => { setSelectedRestaurant(item.name) }}
                                    >{item.name}</Dropdown.Item>
                                ))}

                            </Dropdown.Menu>
                        </Dropdown>
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
                            return (
                                <>
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
                                        {openDeleteModal && (
                                            <div className={styles.modalOverlay}>
                                                <Delete id={deletingRestaurantId} setClosing={setOpenDeleteModal} success={showSuccess}  whichPage={"restaurants"} />
                                            </div>
                                        )}

                                        {openSuccessMessage && (
                                            <div className={styles.modalOverlay}>
                                                <SuccessMessage />
                                            </div>
                                        )}

                                    </div>
                                </>
                            )
                        })
                    )}
                </div>
            </div>
        </>
    )
}