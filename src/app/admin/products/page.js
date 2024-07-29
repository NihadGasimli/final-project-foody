"use client";

import { useDispatch } from "react-redux";
import { setPage } from "../../../features/infoSlice";
import styles from "./products.module.css";
import { Dropdown } from "react-bootstrap";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Delete from "../../../../components/Delete"
import SuccessMessage from "../../../../components/SuccessMessage";

export default function Products() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [restaurants, setRestaurants] = useState([]);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openSuccessMessage, setOpenSuccessMessage] = useState(false);
    const [deletingProductId, setDeletingProductId] = useState("");
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);


    function getProducts() {
        fetch("/api/products", { method: "GET" })
            .then((response) => response.json())
            .then((result) => {
                setProducts(result?.result.data);
                setLoading(false);
            });

        fetch("/api/category").then(response => response.json()).then(result => {
            setCategories(result?.result.data);
        })
    }

    useEffect(() => {
        fetch("/api/restuarants", { method: "GET" }).then(response => response.json()).then(result => {
            setRestaurants(result?.result.data);
            console.log(result.result.data)
        });
    }, []);

    useEffect(() => {
        getProducts();
    }, []);

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

    const dispatch = useDispatch();
    dispatch(setPage("products"));

    return (
        <>
            <div className={styles.container}>
                <div className={styles.heading}>
                    <h1>Products</h1>
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
                                    selectedRestaurant === restaurantOfProduct.cuisine ? (
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
                                                        />

                                                        <Image
                                                            src="/admin-delete.svg"
                                                            className={styles.deleteButton}
                                                            width={20}
                                                            height={20}
                                                            alt="delete"
                                                            onClick={() => { setOpenDeleteModal(true), setDeletingProductId(item.id) }}
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
                                                />

                                                <Image
                                                    src="/admin-delete.svg"
                                                    className={styles.deleteButton}
                                                    width={20}
                                                    height={20}
                                                    alt="delete"
                                                    onClick={() => { setOpenDeleteModal(true), setDeletingProductId(item.id) }}
                                                />
                                            </div>
                                        </div>
                                    </div>)
                            }
                            // return (
                            //     <div key={item.id} className={styles.productItem}>
                            //         <img src={item.img_url} alt={item.name} className={styles.productImage} />
                            //         <h2 className={styles.productName}>{item.name}</h2>
                            //         <p className={styles.restName}>{restaurantOfProduct?.name}</p>
                            //         <div className={styles.lowerDiv}>
                            //             <p className={styles.productPrice}>${item.price}</p>
                            //             <div className={styles.editDiv}>
                            //                 <Image
                            //                     src="/admin-edit.svg"
                            //                     className={styles.editButton}
                            //                     width={20}
                            //                     height={20}
                            //                     alt="edit"
                            //                 />

                            //                 <Image
                            //                     src="/admin-delete.svg"
                            //                     className={styles.deleteButton}
                            //                     width={20}
                            //                     height={20}
                            //                     alt="delete"
                            //                     onClick={() => { setOpenDeleteModal(true), setDeletingProductId(item.id) }}
                            //                 />
                            //             </div>
                            //         </div>
                            //     </div>
                            // )
                        })
                    )}
                </div>
                {openDeleteModal && (
                    <div className={styles.modalOverlay}>
                        <Delete id={deletingProductId} setClosing={setOpenDeleteModal} success={showSuccess} products={getProducts} whichPage={"products"} />
                    </div>
                )}

                {openSuccessMessage && (
                    <div className={styles.modalOverlay}>
                        <SuccessMessage />
                    </div>
                )}

            </div>

        </>
    );
}
