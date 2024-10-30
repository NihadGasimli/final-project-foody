"use client"
import Image from "next/image";
import styles from "./error.module.css";

export default function page404() {
    return (
        <>
            <div className={styles.container}>
                <Image
                    src="/404.svg"
                    className={styles.errorImage}
                    width={0}
                    height={0}
                    alt="error"
                    priority
                />
            </div>
        </>
    )
}