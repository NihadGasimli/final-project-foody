"use client";

import { useDispatch } from "react-redux";
import { setPage } from "../../../features/infoSlice";
import styles from "./products.module.css";
import { Dropdown } from "react-bootstrap";
import { useEffect, useState } from "react";
import Image from "next/image";
import Delete from "../../../../components/Delete"
export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [deletingProductId, setDeletingProductId] = useState("");
    const [closingDeleteModal, setClosingDeleteModal] = useState(false);

    function getProducts() {
        fetch("/api/products")
            .then((response) => response.json())
            .then((result) => {
                setProducts(result.result.data);
                setLoading(false);
            });
    }

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

    const dispatch = useDispatch();
    dispatch(setPage("products"));
    
    return (
        <>
            <div className={styles.container}>
                <div className={styles.heading}>
                    <h1>Products</h1>
                    <Dropdown className={styles.dropdownMenu}>
                        <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                            Restaurant Type
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                            <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                            <Dropdown.Item href="#/action-3">Something else here</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
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
                        products.map((item) => (
                            <div key={item.id} className={styles.productItem}>
                                <img src={item.img_url} alt={item.name} className={styles.productImage} />
                                <h2 className={styles.productName}>{item.name}</h2>
                                <p className={styles.restName}>{item.rest_id}</p>
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
                            </div>
                        ))
                    )}
                </div>
                {openDeleteModal && (
                    <div className={styles.modalOverlay}>
                        <Delete id={deletingProductId} setClosing={setOpenDeleteModal} />
                    </div>
                )}

            </div>

        </>
    );
}
