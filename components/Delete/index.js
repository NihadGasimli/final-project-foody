import { useState, useEffect } from "react";
import styles from "./delete.module.css";
import { deleteProduct } from "../../src/features/productSlice";
import { deleteCategory } from "../../src/features/categorySlice";
import { useDispatch } from "react-redux";
import { deleteRestuarant } from "../../src/features/restaurantsSlice";
import { deleteOffer } from "../../src/features/offersSlice";

export default function Delete({ whichPage, setClosing, id, products, success, categories, restaurants, offers }) {
    const dispatch = useDispatch();
    const [page, setPage] = useState(null);

    useEffect(() => {
        switch (whichPage) {
            case "products":
                setPage(
                    <>
                        <p>Attention! If you delete this product, it will not come back...</p>
                        <div className={styles.buttons}>
                            <button
                                className={styles.deleteButton}
                                onClick={() => {
                                    dispatch(deleteProduct(id));
                                    setClosing(false);
                                    success();
                                    products();
                                }}
                            >Delete</button>
                            <button className={styles.cancelButton} onClick={() => { setClosing(false); }}>
                                Cancel
                            </button>
                        </div>
                    </>
                );
                break;
            case "restaurants":
                setPage(
                    <>
                        <p>Attention! If you delete this restaurant, it will not come back...</p>
                        <div className={styles.buttons}>
                            <button
                                className={styles.deleteButton}
                                onClick={() => {
                                    dispatch(deleteRestuarant(id));
                                    setClosing(false);
                                    success();
                                    restaurants();
                                }}
                            >
                                Delete
                            </button>
                            <button className={styles.cancelButton} onClick={() => { setClosing(false); }}>
                                Cancel
                            </button>
                        </div>
                    </>
                );
                break;
            case "category":
                setPage(
                    <>
                        <p>Attention! If you delete this category, it will not come back...</p>
                        <div className={styles.buttons}>
                            <button
                                className={styles.deleteButton}
                                onClick={() => {
                                    dispatch(deleteCategory(id));
                                    setClosing(false);
                                    success();
                                    categories();
                                }}
                            >
                                Delete
                            </button>
                            <button className={styles.cancelButton} onClick={() => { setClosing(false); }}>
                                Cancel
                            </button>
                        </div>
                    </>
                );
                break;
            case "offers":
                setPage(
                    <>
                        <p>Attention! If you delete this offer, it will not come back...</p>
                        <div className={styles.buttons}>
                            <button
                                className={styles.deleteButton}
                                onClick={() => {
                                    dispatch(deleteOffer(id));
                                    setClosing(false);
                                    success();
                                    offers();
                                }}
                            >
                                Delete
                            </button>
                            <button className={styles.cancelButton} onClick={() => { setClosing(false); }}>
                                Cancel
                            </button>
                        </div>
                    </>
                );
                break;
            default:
                setPage(null);
        }
    }, [whichPage, id, setClosing, success, products]);

    return (
        <>
            <div className={styles.main}>
                <h1>Are you sure it’s deleted ?</h1>
                {page}
            </div>
        </>
    );
}
