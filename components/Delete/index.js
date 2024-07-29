import { useState, useEffect } from "react";
import styles from "./delete.module.css";

export default function Delete({ id, setClosing, success, products, whichPage }) {
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
                                    fetch(`/api/products/${id}`, { method: "DELETE" }).then(() => {
                                        setClosing(false);
                                        success();
                                        products();
                                    });
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
            case "restaurants":
                setPage(
                    <>
                        <p>Attention! If you delete this restaurant, it will not come back...</p>
                        <div className={styles.buttons}>
                            <button
                                className={styles.deleteButton}
                                onClick={() => {
                                    fetch(`/api/restuarants/${id}`, { method: "DELETE" }).then(() => {
                                        setClosing(false);
                                        success();
                                    });
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
                                    fetch(`/api/category/${id}`, { method: "DELETE" }).then(() => {
                                        setClosing(false);
                                        success();
                                        products();
                                    });
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
