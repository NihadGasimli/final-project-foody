"use client";

import styles from "./style.module.css";
import Image from "next/image";
import { settingPage } from "../../../features/pagesSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ErrorMessage from "../../../../components/ErrorMessage"

import en from "../../../../locales/admin/en.json";
import az from "../../../../locales/admin/az.json";
import ru from "../../../../locales/admin/ru.json";
import { useLanguage } from "../../../../context/LanguageContext";

export default function AdminLogin() {
    const dispatch = useDispatch();
    const router = useRouter();

    const inWhichPage = useSelector((state) => state.inWhichPage)

    const [errorAlert, setErrorAlert] = useState(false);

    const { language, setLanguage } = useLanguage();
    const [translation, setTranslation] = useState(en);

    const usernameRef = useRef();
    const passwordRef = useRef();

    const [flagSrc, setFlagSrc] = useState("/admin-flagEN.svg");
    const [languageMenuDisplay, setLanguageMenuDisplay] = useState("none");

    const [haveError, setHaveError] = useState({ username: false, password: false })

    const errors = {
        username: "Please write username",
        password: "Please write password"
    }

    function handleKeyDown(e) {
        if (e.key === "Enter") {
            onclickLogin(e);
        }
    }

    const toggleLanguage = (lang) => {
        setLanguage(lang);
        toggleDropdown();
        localStorage.setItem('lang', JSON.stringify(lang))
    };

    const toggleDropdown = () => {
        setLanguageMenuDisplay(languageMenuDisplay === "none" ? "flex" : "none");
    };

    useEffect(() => {
        if (language === "en") {
            setFlagSrc("/admin-flagEN.svg");
            setTranslation(en)
        }
        else if (language === "az") {
            setFlagSrc("/admin-flagAZ.svg");
            setTranslation(az)
        }
        else if (language === "ru") {
            setFlagSrc("/admin-flagRU.svg");
            setTranslation(ru)
        }
    }, [language])

    useEffect(() => {
        const keyDownHandler = (e) => handleKeyDown(e);
        window.addEventListener("keydown", keyDownHandler);

        return () => {
            window.removeEventListener("keydown", keyDownHandler);
        };
    }, []);

    function onclickLogin(e) {
        e.preventDefault();

        const username = usernameRef.current.value.trim();
        const password = passwordRef.current.value.trim();

        const newErrors = {
            username: username === "",
            password: password === ""
        };

        setHaveError(newErrors);

        if (!newErrors.username && !newErrors.password) {
            if (username === inWhichPage.admin.username && password === inWhichPage.admin.password) {
                sessionStorage.setItem("login", true);
                localStorage.setItem("access_token", JSON.stringify("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJvZElvdzBwRUJYYzE0MTlqQzZEV1drd09oY3ExIiwiaWF0IjoxNzMwMDk4MDU1LCJleHAiOjE3MzAxMDE2NTV9.V97OtFZTd9g7nZ1E1MEHct0Rltp6EJzLyUo8za2ewCg"))
                router.push("/admin/dashboard");
            } else {
                setErrorAlert(true);
                usernameRef.current.value === "";
                passwordRef.current.value === "";
                setTimeout(() => {
                    setErrorAlert(false);
                }, 3000);
            }
        }
    }

    useEffect(() => {
        dispatch(settingPage("loginn"));
    }, [dispatch]);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Image
                    src="/admin-logo.svg"
                    className={styles.logo}
                    width={50}
                    height={50}
                    alt="Logo"
                />
                <div className={styles.dropdown}>
                    <Image
                        src={flagSrc}
                        className={styles.flag}
                        width={50}
                        height={50}
                        alt="image"
                        onClick={toggleDropdown}
                    />

                    <div className={styles.dropdown_content} style={{ display: `${languageMenuDisplay}` }}>
                        <Image
                            src="/admin-flagEN.svg"
                            className={styles.flag}
                            width={50}
                            height={50}
                            alt="image"
                            onClick={() => { toggleLanguage("en") }}
                        />
                        <Image
                            src="/admin-flagAZ.svg"
                            className={styles.flag}
                            width={50}
                            height={50}
                            alt="image"
                            onClick={() => { toggleLanguage("az") }}
                        />
                        <Image
                            src="/admin-flagRU.svg"
                            className={styles.flag}
                            width={50}
                            height={50}
                            alt="image"
                            onClick={() => { toggleLanguage("ru") }}
                        />
                    </div>
                </div>
            </div>
            <div className={styles.loginPanel}>
                <div className={styles.leftSide}>
                    <h1>{translation.login.welcomeAdmin}</h1>
                    <div className={styles.usernameDiv}>
                        <input type="text" placeholder="Username" className={styles.usernameInput} ref={usernameRef} onKeyDown={handleKeyDown} />
                        {haveError.username ? (<p className={styles.errorText}>{errors.username}</p>) : ("")}
                    </div>
                    <div className={styles.passwordDiv}>
                        <input type="password" placeholder="Password" className={styles.passwordInput} ref={passwordRef} onKeyDown={handleKeyDown} />
                        {haveError.password ? (<p className={styles.errorText}>{errors.password}</p>) : ("")}
                    </div>
                    <button onClick={(e) => { onclickLogin(e) }}>Sign in </button>
                </div>
                <div className={styles.rightSide}>
                    <Image
                        src="/admin-loginPanel.svg"
                        className={styles.loginPanelImage}
                        width={50}
                        height={50}
                        alt="image"
                    />
                </div>
            </div>

            {errorAlert ? (
                <ErrorMessage message="This admin doesn't exists or password incorrect!" />
            ) : null}
        </div>
    )
}