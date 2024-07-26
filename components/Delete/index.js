import { useState } from "react"
import styles from "./delete.module.css"
export default function Delete({ id, setClosing, getProducts }) {
    return (
        <>
            <div className={styles.main}>
                <h1>Are you sure it’s deleted ?</h1>
                <p>Attention! If you delete this product, it will not come back...</p>
                <div className={styles.buttons}>
                    <button className={styles.deleteButton} onClick={() => { fetch(`/api/products/${id}`, { method: "DELETE" }), setClosing(false) }}>Delete</button>
                    <button className={styles.cancelButton} onClick={() => { setClosing(false) }}>Cancel</button>
                </div>
            </div>
        </>
    )
}