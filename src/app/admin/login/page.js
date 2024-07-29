"use client"

import styles from "./style.module.css";
import Image from "next/image";

export default function AdminLogin() {
    return (
        <>
            <div className={styles.container}>
                <Image
                    src="/admin-logo.svg"
                    className={styles.logo}
                    width={0}
                    height={0}
                    alt="Logo"
                />
                <div className={styles.loginPanel}>
                    <div className={styles.leftSide}>
                        <h1>Welcome Admin</h1>
                        <input type="text" placeholder="Username" className={styles.usernameInput} />
                        <input type="password" placeholder="Password" className={styles.passwordInput} />
                        <button>Sign in </button>
                    </div>
                    <div className={styles.rightSide}>
                        <Image
                            src="/admin-loginPanel.svg"
                            className={styles.loginPanelImage}
                            width={0}
                            height={0}
                            alt="image"
                        />
                    </div>
                </div>
            </div>
        </>
    )
}