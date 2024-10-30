"use client"

import { useDispatch, useSelector } from "react-redux"
import { settingPage } from "../../features/pagesSlice";
import { useEffect, useRef, useState } from "react";
import styles from "./login.module.css";
import Image from "next/image";
import axios from "axios";
import { setInfo } from "../../features/userInfoSlice";
import ErrorMessage from "../../../components/ErrorMessage"
import SuccessMessage from "../../../components/SuccessMessage"
import { useRouter } from "next/navigation";
import { useLanguage } from "../../../context/LanguageContext";

import en from "../../../locales/en.json";
import az from "../../../locales/az.json";
import ru from "../../../locales/ru.json";

export default function Login() {
    const dispatch = useDispatch();
    const router = useRouter();

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [logOrReg, setLogOrReg] = useState("login");
    const [showPassword, setShowPassword] = useState(false);
    const [languageMenuDisplay, setLanguageMenuDisplay] = useState("none");
    const [lang, setLang] = useState("en");
    const [flagSrc, setFlagSrc] = useState("/admin-flagEN.svg");
    const { language, setLanguage } = useLanguage();
    const [translation, setTranslation] = useState(en);

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

    const [regError, setRegError] = useState({
        fullname: false,
        username: { empty: false, invalid: false },
        email: { empty: false, invalid: false },
        password: false
    });
    const [logError, setLogError] = useState({
        email: { empty: false, invalid: false },
        password: false
    })

    const [errorAlert, setErrorAlert] = useState(false);
    const [successAlert, setSuccessAlert] = useState(false);

    const [successRegisterAlert, setSuccessRegisterAlert] = useState(false);
    const [errorRegisterAlert, setErrorRegisterAlert] = useState(false);

    let emailLoginRef = useRef();
    let passwordLoginRef = useRef();

    let fullnameRegisterRef = useRef();
    let usernameRegisterRef = useRef();
    let emailRegisterRef = useRef();
    let passwordRegisterRef = useRef();

    async function checkLoginInputs(e) {
        e.preventDefault();

        const errors = { ...logError };

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailLoginRef.current.value.trim()) {
            errors.email.empty = true;
        } else {
            errors.email.empty = false;
        }

        if (!emailPattern.test(emailLoginRef.current.value) && !errors.email.empty) {
            errors.email.invalid = true
        }
        else {
            errors.email.invalid = false
        }

        if (!passwordLoginRef.current.value.trim()) {
            errors.password = true;
        }
        else {
            errors.password = false;
        }

        setLogError(errors)

        if (!errors.email.empty && !errors.email.invalid && !errors.password) {
            try {
                const response = await axios.post("/api/auth/signin", {
                    email: emailLoginRef.current.value,
                    password: passwordLoginRef.current.value
                })
                console.log("response", response)
                const userData = {
                    id: response.data.user.id,
                    email: response.data.user.email,
                    username: response.data.user.username,
                    fullname: response.data.user.fullname,
                    access_token: response.data.user.access_token,
                    refresh_token: response.data.user.refresh_token,
                    address: response.data.user.address,
                    phone: response.data.user.phone,
                }
                setSuccessAlert(true)
                dispatch(setInfo(userData))
                if (response) {
                    console.log(userData)
                    localStorage.setItem("user", JSON.stringify(userData));
                    localStorage.setItem("access_token", JSON.stringify(response.data.user.access_token));
                    localStorage.setItem("refresh_token", JSON.stringify(response.data.user.refresh_token))
                }
                setTimeout(() => {
                    setSuccessAlert(false);
                    localStorage.setItem("logged", true);
                    router.push("/");
                }, 2000);
            }
            catch (err) {
                setErrorAlert(true);
                emailLoginRef.current.value = "";
                passwordLoginRef.current.value = "";
                setTimeout(() => {
                    setErrorAlert(false)
                }, 3000);
                console.log(err)
            }
        }

    }

    async function checkRegisterInputs(e) {
        e.preventDefault();

        const errors = { ...regError };

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!fullnameRegisterRef.current.value.trim()) {
            errors.fullname = true;
        }
        else {
            errors.fullname = false;
        }

        if (!usernameRegisterRef.current.value.trim()) {
            errors.username.empty = true;
        }
        else {
            errors.username.empty = false;
        }

        if (usernameRegisterRef.current.value.trim().length < 6 && !errors.username.empty) {
            errors.username.invalid = true;
        }
        else {
            errors.username.invalid = false;
        }

        if (!emailRegisterRef.current.value.trim()) {
            errors.email.empty = true;
        } else {
            errors.email.empty = false;
        }

        if (!emailPattern.test(emailRegisterRef.current.value) && !errors.email.empty) {
            errors.email.invalid = true
        }
        else {
            errors.email.invalid = false
        }

        if (passwordRegisterRef.current.value.trim().length < 6) {
            errors.password = true;
        }
        else {
            errors.password = false;
        }

        setRegError(errors)

        if (!errors.fullname && !errors.username.empty && !errors.username.invalid && !errors.email.empty && !errors.email.invalid && !errors.password) {
            try {
                await axios.post("/api/auth/signup", {
                    email: emailRegisterRef.current.value,
                    password: passwordRegisterRef.current.value,
                    fullname: fullnameRegisterRef.current.value,
                    username: usernameRegisterRef.current.value
                });
                setSuccessRegisterAlert(true)
                setTimeout(() => {
                    setSuccessRegisterAlert(false);
                    // usernameRegisterRef.current.value = "";
                    // fullnameRegisterRef.current.value = "";
                    // emailRegisterRef.current.value = "";
                    // passwordRegisterRef.current.value = "";
                    setLogOrReg("login");
                }, 2000);
            }
            catch (err) {
                setErrorRegisterAlert(true);
                emailRegisterRef.current.value = "";
                passwordRegisterRef.current.value = "";
                setTimeout(() => {
                    setErrorRegisterAlert(false)
                }, 3000);
                console.log(err)
            }
        }
    }

    const toggleLanguage = (lang) => {
        setLanguage(lang);
        toggleDropdown();
        localStorage.setItem('lang', JSON.stringify(lang))
    };

    const errors = {
        register: {
            fullname: translation.errorsLogin.register.fullname,
            username: {
                empty: translation.errorsLogin.register.username.empty,
                invalid: translation.errorsLogin.register.username.invalid
            },
            email: {
                empty: translation.errorsLogin.register.email.empty,
                invalid: translation.errorsLogin.register.email.invalid
            },
            password: translation.errorsLogin.register.password
        },
        login: {
            email: {
                empty: translation.errorsLogin.login.email.empty,
                invalid: translation.errorsLogin.login.email.invalid
            },
            password: translation.errorsLogin.login.password
        }

    }

    useEffect(() => {
        dispatch(settingPage("login"));
    }, [dispatch]);

    const toggleDropdown = () => {
        setLanguageMenuDisplay(languageMenuDisplay === "none" ? "flex" : "none");
    };

    return (
        <>
            <div className={styles.container}>
                <header className={styles.header}>
                    <Image
                        src="/admin-logo.svg"
                        className={styles.logo}
                        width={0}
                        height={0}
                        alt="image"
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
                </header>

                <div className={styles.main}>
                    <div className={styles.leftSide}>
                        {logOrReg === "login" ? (
                            <Image
                                src="/login-photo.svg"
                                className={styles.loginPhoto}
                                width={50}
                                height={50}
                                alt="image"
                                priority
                            />
                        )
                            :
                            (
                                <Image
                                    src="/register-photo.svg"
                                    className={styles.registerPhoto}
                                    width={50}
                                    height={50}
                                    alt="image"
                                    priority
                                />
                            )
                        }
                    </div>

                    <div className={styles.rightSide}>
                        <div className={styles.topDiv}>
                            <div>
                                <button className={`${styles.loginPart} ${logOrReg === "login" ? styles.redText : ''}`} onClick={() => { setLogOrReg("login"); setShowPassword(false); }}>{translation.login.login}</button>
                                <button className={`${styles.registerPart} ${logOrReg === "register" ? styles.redText : ''}`} onClick={() => { setLogOrReg("register"); setShowPassword(false); }}>{translation.login.register}</button>
                            </div>
                            <div className={`${styles.line} ${logOrReg === "login" ? styles.lineLogin : styles.lineRegister}`}></div>
                        </div>

                        <div className={styles.inputsDiv}>
                            {logOrReg === "login" ? (
                                <div className={styles.inputs}>
                                    <div className={styles.labelAndErrorDiv}>
                                        <label>{translation.login.email}</label>
                                        {logError.email.empty ? <p>{errors.login.email.empty}</p> : null}
                                        {logError.email.invalid ? <p>{errors.login.email.invalid}</p> : null}
                                    </div>
                                    <input type="text" className={styles.input} ref={emailLoginRef} />

                                    <div className={styles.labelAndErrorDiv}>
                                        <label>{translation.login.password}</label>
                                        {logError.password ? <p>{errors.login.password}</p> : null}
                                    </div>
                                    <div className={styles.passwordDiv}>
                                        <input type={showPassword ? "text" : "password"} className={styles.input} ref={passwordLoginRef} />
                                        {showPassword ? (
                                            <Image
                                                src="/closeEyeImage.svg"
                                                className={styles.eyeImage}
                                                width={0}
                                                height={0}
                                                alt="image"
                                                onClick={() => { setShowPassword(false) }}

                                            />
                                        )
                                            :
                                            (
                                                <Image
                                                    src="/eyeImage.svg"
                                                    className={styles.eyeImage}
                                                    width={0}
                                                    height={0}
                                                    alt="image"
                                                    onClick={() => { setShowPassword(true) }}

                                                />
                                            )}
                                    </div>

                                    <button className={styles.confirmButton} onClick={(e) => { checkLoginInputs(e) }}>{translation.login.loginButton}</button>
                                </div>)
                                :
                                (
                                    <div className={styles.inputs}>
                                        <div className={styles.labelAndErrorDiv}>
                                            <label>{translation.login.fullname}</label>
                                            {regError.fullname ? <p>{errors.register.fullname}</p> : null}
                                        </div>
                                        <input type="text" className={styles.input} ref={fullnameRegisterRef} />

                                        <div className={styles.labelAndErrorDiv}>
                                            <label>{translation.login.username}</label>
                                            {regError.username.empty ? <p>{errors.register.username.empty}</p> : null}
                                            {regError.username.invalid ? <p>{errors.register.username.invalid}</p> : null}
                                        </div>
                                        <input type="text" className={styles.input} ref={usernameRegisterRef} />

                                        <div className={styles.labelAndErrorDiv}>
                                            <label>{translation.login.email}</label>
                                            {regError.email.empty ? <p>{errors.register.email.empty}</p> : null}
                                            {regError.email.invalid ? <p>{errors.register.email.invalid}</p> : null}
                                        </div>
                                        <input type="email" className={styles.input} ref={emailRegisterRef} />

                                        <div className={styles.labelAndErrorDiv}>
                                            <label>{translation.login.password}</label>
                                            {regError.password ? <p>{errors.register.password}</p> : null}
                                        </div>
                                        <div className={styles.passwordDiv}>
                                            <input type={showPassword ? "text" : "password"} className={styles.input} ref={passwordRegisterRef} />
                                            {showPassword ? (
                                                <Image
                                                    src="/closeEyeImage.svg"
                                                    className={styles.eyeImage}
                                                    width={0}
                                                    height={0}
                                                    alt="image"
                                                    onClick={() => { setShowPassword(false) }}
                                                />
                                            )
                                                :
                                                (
                                                    <Image
                                                        src="/eyeImage.svg"
                                                        className={styles.eyeImage}
                                                        width={0}
                                                        height={0}
                                                        alt="image"
                                                        onClick={() => { setShowPassword(true) }}

                                                    />
                                                )}
                                        </div>
                                        <button className={styles.confirmButton} onClick={(e) => { checkRegisterInputs(e) }}>{translation.login.registerButton}</button>
                                    </div>)}
                        </div>
                    </div>
                </div>
                {errorAlert ? (
                    <ErrorMessage message="This user doesn't exists or password incorrect!" />
                ) : null}
                {errorRegisterAlert ? (
                    <ErrorMessage message="Error! This mail already exists!" />
                ) : null}
                {successAlert ? (
                    <SuccessMessage message={translation.login.successfullLogin} />
                ) : null}
                {successRegisterAlert ? (
                    <SuccessMessage message={translation.login.successfullRegister} />
                ) : null}
            </div>
        </>
    )
}