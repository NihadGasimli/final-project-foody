"use client"

import { useRouter, useSearchParams } from 'next/navigation';
import styles from "./user.module.css";
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { settingPage } from '../../features/pagesSlice';
import { useLanguage } from '../../../context/LanguageContext';

import en from "../../../locales/en.json";
import az from "../../../locales/az.json";
import ru from "../../../locales/ru.json";

export default function UserPage() {
    const searchParams = useSearchParams();
    let page = searchParams.get('page');
    const dispatch = useDispatch();

    const [translation, setTranslation] = useState(en);

    const { language } = useLanguage();

    useEffect(() => {
        if (language === "az") {
            setTranslation(az)
        }
        else if (language === "ru") {
            setTranslation(ru)
        }
        else {
            setTranslation(en)
        }
    }, [language])

    useEffect(() => {
        dispatch(settingPage(''));
    }, [dispatch]);

    const [profileImage, setProfileImage] = useState(null);
    const [profileImageUrl, setProfileImageUrl] = useState(null);
    const [basket, setBasket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [wait, setWait] = useState(false);
    const [info, setInfo] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [visibleOrder, setVisibleOrder] = useState(null);
    const [orders, setOrders] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showMore, setShowMore] = useState(false);
    const [errorsCheckout, setErrorsCheckout] = useState({ deliveryAddress: false, contactNumber: false, paymentMethod: false });
    const [errorsProfile, setErrorsProfile] = useState({ phoneNumber: false, email: false, fullname: false, username: false })
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [windowWidth, setWindowWidth] = useState(0);
    const [openMenu, setOpenMenu] = useState(false);
    const [successAlert, setSuccessAlert] = useState(false);

    let numberRef = useRef();
    let usernameRef = useRef();
    let fullnameRef = useRef();
    let emailRef = useRef();
    let addressRef = useRef();
    const modalRef = useRef(null);

    let checkoutAddressRef = useRef(null);
    let checkoutNumberRef = useRef(null);
    const fileInputRef = useRef(null);

    let checkoutErrors = {
        deliveryAddress: translation?.userpage.errorsCheckout.deliveryAddress,
        contactNumber: translation?.userpage.errorsCheckout.contactNumber,
        paymentMethod: translation?.userpage.errorsCheckout.paymentMethod
    }

    let profileErrors = {
        phoneNumber: translation?.userpage.errorsProfile.phoneNumber,
        email: translation?.userpage.errorsProfile.email,
        username: translation?.userpage.errorsProfile.username,
        fullname: translation?.userpage.errorsProfile.fullname
    }

    const handlePaymentChange = (e) => {
        setPaymentMethod(e.target.value);
    };

    const toggleVisibility = (orderId) => {
        if (visibleOrder === orderId) {
            setVisibleOrder(null);  // Hide if the same button is clicked again
        } else {
            setVisibleOrder(orderId);  // Show the clicked button's div
        }
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const handleResize = () => {
                setWindowWidth(window.innerWidth);
            };

            // Set the initial window width
            handleResize();

            // Add the resize event listener
            window.addEventListener("resize", handleResize);

            // Cleanup the event listener when the component unmounts
            return () => {
                window.removeEventListener("resize", handleResize);
            };
        }
    }, []);

    useEffect(() => {
        if (showMore) {
            document.body.classList.add(styles.hiddenOverflow)
        }
        else {
            document.body.classList.remove(styles.hiddenOverflow)
        }
    })

    useEffect(() => {
        const basket = JSON.parse(localStorage.getItem("basket"));
        setBasket(basket);
        fetchOrders();
    }, [])

    useEffect(() => {
        const handleClickOutside = (event) => {
            // Check if the clicked element is not inside the modal
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setShowMore(false);
            }
        };

        // Add event listener to capture all clicks
        document.addEventListener("mousedown", handleClickOutside);

        // Cleanup the event listener on component unmount
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [modalRef]);

    useEffect(() => {
        setInfo(JSON.parse(localStorage.getItem("user")))
    }, []);

    useEffect(() => {
        if (page === "basket" && basket) {
            setLoading(false);
        }
        page = searchParams.get('page');
    }, [basket, page])

    async function fetchOrders() {
        const token = JSON.parse(localStorage.getItem("access_token"));
        const response = await axios.get('/api/order/user', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        const sortedOrders = response?.data?.result?.data?.sort((a, b) => b.created - a.created);
        console.log(sortedOrders)
        setOrders(sortedOrders)
    }

    async function deleteOrder(id) {
        setLoading(true);
        const token = JSON.parse(localStorage.getItem("access_token"));
        const response = await axios.delete('/api/order', {
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: {
                order_id: id
            }
        });

        if (response) {
            const responseOrders = await axios.get('/api/order/user', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const sortedOrders = responseOrders?.data?.result?.data?.sort((a, b) => b.created - a.created);
            console.log(sortedOrders)
            setOrders(sortedOrders)
        }
    }

    useEffect(() => {
        if (orders) {
            setLoading(false);
        }
    }, [orders])

    useEffect(() => {
        if (page === "orders") {
            fetchOrders()
        }
    }, [page])

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("user"));
        if (userInfo?.phone) {
            setPhoneNumber(userInfo.phone);
        }
        if (userInfo?.address) {
            setAddress(userInfo.address);
        }
    }, []);

    function handleAddresBlur(e) {
        setAddress(e.target.value);
    }

    function handlePhoneNumberBlur(e) {
        setPhoneNumber(e.target.value);
    }

    function logout() {
        localStorage.removeItem("user");
        localStorage.setItem("logged", JSON.stringify(false))
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token")
        router.push("/login");
    }

    async function saveProfileInfo() {
        const sendingInfo = {
            "name": fullnameRef.current.value.split(" ")[0],
            "username": usernameRef.current.value.trim(),
            "fullname": fullnameRef.current.value.trim(),
            "phone": numberRef.current.value.trim(),
            "address": addressRef.current.value.trim(),
            "email": emailRef.current.value.trim(),
            "img_url": profileImageUrl
        }

        const token = JSON.parse(localStorage.getItem("access_token"));
        try {
            const res = await axios.put('/api/auth/user', {
                username: usernameRef.current.value,
                fullname: fullnameRef.current.value,
                phone: numberRef.current.value,
                address: addressRef.current.value,
                email: emailRef.current.value,
                img_url: "profileImageUrl"
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (res) {
                alert("Saved!")
            }
        } catch (error) {
            console.error('Error updating user:', error);
        }
        localStorage.setItem("user", JSON.stringify(sendingInfo));
    }

    function checkInputsCheckout() {
        let newErrors = { ...errorsCheckout };

        if (!checkoutAddressRef.current.value.trim()) {
            newErrors.deliveryAddress = true;
        }
        else {
            newErrors.deliveryAddress = false;
        }

        if (!phoneNumber.trim()) {
            newErrors.contactNumber = true;
        }
        else {
            newErrors.contactNumber = false;
        }

        if (!paymentMethod) {
            newErrors.paymentMethod = true;
        }
        else {
            newErrors.paymentMethod = false;
        }

        setErrorsCheckout(newErrors);

        if (!newErrors.deliveryAddress && !newErrors.contactNumber && !newErrors.paymentMethod) {
            checkoutOrder();
        }

    }

    function checkInputsProfile() {
        let newErrors = { ...errorsProfile };

        if (!emailRef.current.value.trim()) {
            newErrors.email = true;
        }
        else {
            newErrors.email = false;
        }

        if (!numberRef.current.value.trim()) {
            newErrors.phoneNumber = true;
        }
        else {
            newErrors.phoneNumber = false;
        }

        if (!usernameRef.current.value.trim()) {
            newErrors.username = true;
        }
        else {
            newErrors.username = false;
        }

        if (!fullnameRef.current.value.trim()) {
            newErrors.fullname = true;
        }
        else {
            newErrors.fullname = false;
        }

        setErrorsProfile(newErrors);

        if (!newErrors.email && !newErrors.username && !newErrors.fullname && !newErrors.phoneNumber) {
            saveProfileInfo();
        }
    }

    async function checkoutOrder() {
        const token = JSON.parse(localStorage.getItem("access_token"));
        let methodOfPayment;
        if (paymentMethod == "pay at the door") {
            methodOfPayment = 0;
        } else if (paymentMethod == "pay at the door by credit card") {
            methodOfPayment = 1;
        } else {
            alert("Invalid payment method");
            return; // Exit if the payment method is invalid
        }

        let contactInfo = checkoutNumberRef.current.value;
        let delivery_addressInfo = checkoutAddressRef.current.value;
        let idInfo = basket.id;

        try {
            await axios.post('/api/order', {
                basket_id: idInfo,
                contact: contactInfo,
                delivery_address: delivery_addressInfo,
                payment_method: methodOfPayment
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });


        } catch (err) {
            if (err.response && err.response.status === 404) {
                setAddress('');
                setPhoneNumber('');
                setPaymentMethod(null);
                clearBasket();
                setSuccessAlert(true);
                setTimeout(() => {
                    setSuccessAlert(false);
                }, 3000);
            } else {
                console.error("An error occurred:", err);
            }
        }

    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setProfileImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setProfileImageUrl(`${reader.result}`);
        };
        reader.readAsDataURL(file);
    };

    const handleDeleteImage = () => {
        setProfileImage(null);
        setProfileImageUrl(null);
        localStorage.setItem("user", JSON.stringify(info))
    };

    async function urlToFile(url, filename, mimeType) {
        const response = await fetch(url);
        const buffer = await response.arrayBuffer();
        return new File([buffer], filename, { type: mimeType || response.headers.get('content-type') });
    }

    useEffect(() => {
        if (info?.img_url && !profileImageUrl) {
            urlToFile(info.img_url, info.name).then(file => {
                setProfileImage(file);
                setProfileImageUrl(info.img_url);
            });
        }
    }, [profileImageUrl]);

    async function clearBasket() {
        const token = JSON.parse(localStorage.getItem("access_token"));
        let emptyBasket = {
            items: [],
            total_amount: 0,
            total_count: 0,
            total_item: 0
        }

        localStorage.setItem("basket", JSON.stringify(emptyBasket));
        setBasket(emptyBasket)

        try {
            const response = await axios.delete('/api/basket/clear', {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                data: {
                    basket_id: basket.id
                }
            });
            setBasket(response.data)
        }
        catch (err) {
            alert(err)
        }
    }

    async function removeItem(item) {
        if (wait) {
            alert("Please wait!")
            return
        }
        setWait(true);
        let items = basket.items;
        let currentBasket = basket;
        for (let i in items) {
            if (items[i].id === item.id) {
                items[i].count -= 1;
                if (items[i].count === 0) {
                    currentBasket.total_item -= 1;
                }
            }
        }

        currentBasket.total_amount -= Number(item.price);
        currentBasket.total_count--;

        const resultBasket = {
            ...currentBasket,
            items: items
        }

        localStorage.setItem("basket", JSON.stringify(resultBasket));

        setBasket(resultBasket)

        const token = JSON.parse(localStorage.getItem("access_token"));
        try {
            let retry = true;
            while (retry) {
                const response = await axios.delete('/api/basket/delete', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    data: {
                        product_id: item.id
                    }
                });

                const itemsCountInStorage = JSON.parse(localStorage.getItem("basket")).total_count;

                if (itemsCountInStorage === response.data.total_count) {
                    setWait(false);
                    localStorage.setItem("basket", JSON.stringify(response.data));
                    setBasket(response.data);
                    retry = false;
                }
            }
        } catch (error) {
            console.error("Error updating basket:", error);
        }
    }

    async function addItem(item) {
        if (wait) {
            alert("Please wait!")
            return
        }
        setWait(true);
        let items = basket?.items;
        let newProduct = true;

        for (let i in items) {
            if (items[i].id === item.id) {
                items[i].count += 1;
                newProduct = false;
            }
        }

        if (newProduct) {
            const newItem = {
                ...item,
                count: 1
            }
            items.push(newItem)
        }

        let currentBasket = basket;
        currentBasket.total_amount += Number(item.price);
        currentBasket.total_count++;
        if (newProduct) {
            currentBasket.total_item++;
        }

        const resultBasket = {
            ...currentBasket,
            items: items
        }

        localStorage.setItem("basket", JSON.stringify(resultBasket));

        setBasket(resultBasket)

        const token = JSON.parse(localStorage.getItem("access_token"));
        try {
            let retry = true;
            while (retry) {
                const response = await axios.post('/api/basket/add', {
                    product_id: item.id
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const itemsCountInStorage = JSON.parse(localStorage.getItem("basket")).total_count;

                if (itemsCountInStorage === response.data.total_count) {
                    setWait(false);
                    localStorage.setItem("basket", JSON.stringify(response.data));
                    setBasket(response.data);
                    retry = false;
                }
            }
        } catch (error) {
            console.error("Error updating basket:", error);
        }
    }

    const ProfileComponent = () =>
        <div className={styles.main}>
            <h1>{translation.userpage.profileHeading}</h1>
            <div className={styles.uploadImageDiv}>
                {profileImage ? (
                    <div className={styles.whenImageSelected}>
                        <p>{profileImage?.name}</p>
                        {profileImageUrl ? (
                            <Image
                                src={profileImageUrl}
                                className={styles.photo}
                                width={40}
                                height={40}
                                alt='ProfilImage'
                            />
                        ) : (
                            <div>Loading image...</div>
                        )}
                        <Image
                            src="/admin-delete.svg"
                            className={styles.deleteUploadedLogo}
                            width={40}
                            height={40}
                            alt="Logo"
                            onClick={() => { handleDeleteImage() }}
                        />
                    </div>
                ) : (
                    <>
                        <div className={styles.uploadImage} onClick={() => { fileInputRef.current.click(); }}>
                            <input ref={fileInputRef} style={{ display: "none" }} type="file" accept="image/*" onChange={handleFileChange} />
                            <Image
                                src="/upload.svg"
                                className={styles.logo}
                                width={50}
                                height={50}
                                alt="image"
                            />
                            <p>{translation.userpage.uploadButton}</p>
                        </div>
                    </>
                )
                }
            </div >
            <div className={styles.inputsDiv}>
                <div className={styles.leftSide}>
                    <span>
                        <label>{translation.userpage.contact}</label>
                        {errorsProfile.phoneNumber ? <p className={styles.error}>{profileErrors.phoneNumber}</p> : null}
                    </span>
                    <input type='number' ref={numberRef} className={styles.contactInput} placeholder='+994' defaultValue={info?.phone} />
                    <span>
                        <label>{translation.userpage.username}</label>
                        {errorsProfile.username ? <p className={styles.error}>{profileErrors.username}</p> : null}
                    </span>
                    <input type='name' ref={usernameRef} defaultValue={info?.username} />
                    <span>
                        <label>{translation.userpage.fullname}</label>
                        {errorsProfile.fullname ? <p className={styles.error}>{profileErrors.fullname}</p> : null}
                    </span>
                    <input type='name' ref={fullnameRef} defaultValue={info?.fullname} />
                </div>
                <div className={styles.rightSide}>
                    <span>
                        <label>{translation.userpage.email}</label>
                        {errorsProfile.email ? <p className={styles.error}>{profileErrors.email}</p> : null}
                    </span>
                    <input type='email' ref={emailRef} defaultValue={info?.email} />
                    <label>{translation.userpage.address}</label>
                    <input type='name' ref={addressRef} defaultValue={info?.address} />
                    <button className={styles.saveButton} onClick={(e) => { checkInputsProfile(); }}>{translation.userpage.saveButton}</button>
                </div>
            </div>
        </div >
    const BasketComponent = () => {
        if (loading) {
            return (
                <Image
                    src="/loading3.gif"
                    className={styles.loadingGif}
                    width={40}
                    height={40}
                    alt="Loading"
                    priority
                />
            );
        }

        return (
            <div className={styles.mainBasket}>
                <h1>{translation.userpage.basketHeading}</h1>
                <div className={styles.basketDiv}>
                    {!basket?.items?.length ? (
                        <div className={styles.noItemsDiv}>
                            <div className={styles.topDivBasket}>
                                <Image
                                    src="/shopping_basket_gray.svg"
                                    className={styles.logo}
                                    width={0}
                                    height={0}
                                    alt="image"
                                />
                                <p>0 {translation.userpage.items}</p>
                            </div>

                            <div className={styles.centeredDivBasket}>
                                <Image
                                    src="/emptyBasket.svg"
                                    className={styles.logo}
                                    width={0}
                                    height={0}
                                    alt="image"
                                    priority
                                />
                                <p>{translation.userpage.basketEmpty}</p>
                            </div>

                            <div className={styles.bottomDivBasket} onClick={() => { router.push("/user?page=checkout") }}>
                                <p>{translation.userpage.checkout}</p>
                                <h2>$0.00</h2>
                            </div>
                        </div>
                    ) :
                        (
                            <div className={styles.itemsDiv}>
                                <div className={styles.topDiv}>
                                    <div className={styles.topDivBasket}>
                                        <div className={styles.leftSideTopdiv}>
                                            <Image
                                                src="/shopping_basket_orange.svg"
                                                className={styles.logo}
                                                width={0}
                                                height={0}
                                                alt="image"
                                            />
                                            <p>{basket?.total_item} {translation.userpage.items}</p>
                                        </div>
                                        <Image
                                            src="/delete_sweep.svg"
                                            className={styles.deleteLogo}
                                            width={0}
                                            height={0}
                                            alt="image"
                                            onClick={() => { clearBasket() }}
                                        />
                                    </div>
                                    <hr></hr>
                                    <div className={styles.items}>
                                        {basket?.items.map((item, index) => (
                                            item.count === 0 ? null : (
                                                <div key={index}>
                                                    <div className={styles.basketItem}>
                                                        <Image
                                                            src={item.img_url}
                                                            className={styles.logo}
                                                            width={50}
                                                            height={50}
                                                            alt="image"
                                                        />
                                                        <div className={styles.nameAndPriceDiv}>
                                                            <h2>{item.name}</h2>
                                                            <p>${item.price}</p>
                                                        </div>
                                                        <div className={styles.itemCountDiv}>
                                                            <button onClick={() => { addItem(item) }}>+</button>
                                                            <p>{item.count}</p>
                                                            <button onClick={() => {
                                                                removeItem(item)
                                                            }}>-</button>
                                                        </div>
                                                    </div>
                                                    <hr></hr>
                                                </div>
                                            )

                                        ))}
                                    </div>
                                </div>
                                <div className={styles.bottomDiv} onClick={() => { router.push("/user?page=checkout") }}>
                                    <p>{translation.userpage.checkout}</p>
                                    <h2>${Number(basket.total_amount)?.toFixed(2) || "0.00"}</h2>
                                </div>
                            </div>
                        )}
                </div>
            </div>
        );
    }
    const CheckoutComponent = () => {
        return (
            <div className={styles.mainCheckout}>
                <div className={styles.leftSideCheckout}>
                    <h1>{translation.userpage.checkoutHeading}</h1>
                    <div className={styles.deliveryInputs}>
                        <span>
                            <label>{translation.userpage.deliveryAddress}</label>
                            {errorsCheckout.deliveryAddress ? <p className={styles.error}>{checkoutErrors.deliveryAddress}</p> : null}
                        </span>
                        <input type='name' placeholder='Ataturk 45 Gandjlik Baku' ref={checkoutAddressRef} defaultValue={address} onBlur={handleAddresBlur} />
                        <span>
                            <label>{translation.userpage.contactNumber}</label>
                            {errorsCheckout.contactNumber ? <p className={styles.error}>{checkoutErrors.contactNumber}</p> : null}
                        </span>
                        <input type='phone' placeholder='+994' ref={checkoutNumberRef} defaultValue={phoneNumber} onBlur={handlePhoneNumberBlur} />
                        <span>
                            <label>{translation.userpage.paymentMethod}</label>
                            {errorsCheckout.paymentMethod ? <p className={styles.error}>{checkoutErrors.paymentMethod}</p> : null}
                        </span>
                        <div className={styles.radioButtons}>
                            <div className={styles.wtCardDiv}>
                                <input type='radio' id='wt-card' name='radioBtn' value='pay at the door' checked={paymentMethod === 'pay at the door'}
                                    onChange={handlePaymentChange} />
                                <label htmlFor="wt-card">{translation.userpage.payment1}</label>
                            </div>
                            <div className={styles.wCardDiv}>
                                <input type='radio' id='w-card' name='radioBtn' value='pay at the door by credit card' checked={paymentMethod === 'pay at the door by credit card'}
                                    onChange={handlePaymentChange} />
                                <label htmlFor='w-card'>{translation.userpage.payment2}</label>
                            </div>
                        </div>
                    </div>
                    <button className={styles.checkoutButton} onClick={() => { checkInputsCheckout() }}>{translation.userpage.checkoutButton}</button>
                </div>

                <div className={styles.rightSideCheckout}>
                    <h2>{translation.userpage.yourOrder}</h2>
                    {!basket?.items?.length ? (
                        <div className={styles.noItemsDivCheckout}>
                            <div className={styles.centeredDivBasketCheckout}>
                                <Image
                                    src="/emptyBasket.svg"
                                    className={styles.logo}
                                    width={0}
                                    height={0}
                                    alt="image"
                                />
                                <p>{translation.userpage.basketEmpty}</p>
                            </div>
                        </div>
                    ) :
                        (
                            <div className={styles.itemsDivCheckout}>
                                <div className={styles.itemsCheckout}>
                                    {basket?.items.map((item, index) => (
                                        <div key={index} className={styles.item}>
                                            <div className={styles.leftSideOfItem}>
                                                <p className={styles.itemCount}>{item.count}</p>
                                                <p className={styles.itemName}>x {item.name}</p>
                                            </div>
                                            <p className={styles.itemPrice}>${Number(item.price).toFixed(item.price % 1 === 0 ? 2 : 2)}</p>                                        </div>
                                    ))}
                                </div>
                                <div className={styles.totalPriceDiv}>
                                    <hr></hr>
                                    <div className={styles.totalPrice}>
                                        <h2>{translation.userpage.total}</h2>
                                        <p>${basket?.total_amount?.toFixed(basket?.total_amount % 1 === 0 ? 2 : 2)}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                </div>
            </div>
        )
    }

    const OrdersComponent = () => {
        return (
            <div className={styles.mainOrders}>
                <h1>{translation.userpage.ordersHeading}</h1>

                {loading ? (
                    <Image
                        src="/loading3.gif"
                        className={styles.loadingGif}
                        width={40}
                        height={40}
                        alt="Loading"
                        priority
                    />
                ) : (
                    <>
                        <div className={styles.tableDiv}>
                            <table>
                                <th>
                                    <td>ID</td>
                                    <td>{translation.userpage.time}</td>
                                    <td>{translation.userpage.deliveryAddress}</td>
                                    <td>{translation.userpage.amount}</td>
                                    <td>{translation.userpage.paymentMethod}</td>
                                    <td>{translation.userpage.contact}</td>
                                    <td></td>
                                </th>

                                {orders?.map((item, index) => {
                                    const timestamp = item.created;
                                    const date = new Date(timestamp);
                                    const formattedDate = date.toLocaleDateString('en-GB', {
                                        day: '2-digit',
                                        month: 'long',
                                        year: 'numeric',
                                    });

                                    return (
                                        <>
                                            <hr></hr>
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{formattedDate}</td>
                                                <td>{item.delivery_address}</td>
                                                <td>${item.amount}</td>
                                                <td>{item.payment_method === 1 ? 'pay at the door' : 'pay at the door by credit card'}</td>
                                                <td>{item.contact}</td>
                                                <td>
                                                    <Image
                                                        src="/3dots.svg"
                                                        className={styles.moreButton}
                                                        width={20}
                                                        height={20}
                                                        alt="image"
                                                        onClick={(e) => { e.preventDefault(); toggleVisibility(index) }}
                                                    />
                                                </td>
                                                {visibleOrder === index && (
                                                    <div className={styles.showOrDeleteDiv}>
                                                        <button className={styles.showButton} onClick={() => {
                                                            setShowMore(true);
                                                            setSelectedOrder(item.products)
                                                            setVisibleOrder(null)
                                                        }}>{translation.userpage.showButton}</button>
                                                        <button className={styles.deleteButton} onClick={() => { deleteOrder(item.id); setVisibleOrder(null) }}>{translation.userpage.deleteButton}</button>
                                                    </div>
                                                )}
                                            </tr>
                                        </>
                                    )
                                })}
                            </table>
                        </div>

                        {showMore ? (
                            <div className={styles.modalOverlay}>
                                <div className={styles.orderMoreDiv} ref={modalRef}>
                                    <table>
                                        <th>
                                            <td>{translation.userpage.image}</td>
                                            <td>{translation.userpage.name}</td>
                                            <td>{translation.userpage.price}</td>
                                            <td>{translation.userpage.count}</td>
                                            <td>{translation.userpage.amount}</td>
                                        </th>

                                        {selectedOrder?.map((item, index) => {
                                            return (
                                                <>
                                                    <hr></hr>
                                                    <tr key={index}>
                                                        <td>
                                                            <Image
                                                                src={item.img_url}
                                                                className={styles.logo}
                                                                width={40}
                                                                height={40}
                                                                alt="image"
                                                            />
                                                        </td>
                                                        <td>{item.name}</td>
                                                        <td>{item.price}</td>
                                                        <td>{item.count}</td>
                                                        <td>{item.amount}</td>
                                                    </tr>
                                                </>
                                            )
                                        })}
                                    </table>
                                </div>
                            </div>
                        ) : null}
                    </>
                )}
            </div>
        )
    }


    const DefaultComponent = () => <div>Please select a page</div>;


    return (
        <div className={styles.container}>
            <div className={styles.leftSideContainer} style={{ display: windowWidth < 900 ? (openMenu ? 'flex' : 'none') : 'flex' }}>
                <div className={`${styles.asideMenuItem} ${page === "profile" ? `${styles.selectedPage}` : null}`} onClick={() => { setOpenMenu(false) }}>
                    <Image
                        src="/profile-logo.svg"
                        className={styles.logo}
                        width={50}
                        height={50}
                        alt="image"
                    />
                    <Link href="/user?page=profile">{translation.userpage.menu.profile}</Link>
                </div>

                <div className={`${styles.asideMenuItem} ${page === "basket" ? `${styles.selectedPage}` : null}`} onClick={() => { setOpenMenu(false) }}>
                    <Image
                        src="/basket-logo.svg"
                        className={styles.logo}
                        width={50}
                        height={50}
                        alt="image"
                    />
                    <Link href="/user?page=basket">{translation.userpage.menu.basket}</Link>
                </div>

                <div className={`${styles.asideMenuItem} ${page === "orders" ? `${styles.selectedPage}` : null}`} onClick={() => { setOpenMenu(false) }}>
                    <Image
                        src="/orders-logo.svg"
                        className={styles.logo}
                        width={50}
                        height={50}
                        alt="image"
                    />
                    <Link href="/user?page=orders">{translation.userpage.menu.orders}</Link>
                </div>

                <div className={`${styles.asideMenuItem} ${page === "checkout" ? `${styles.selectedPage}` : null}`} onClick={() => { setOpenMenu(false) }}>
                    <Image
                        src="/checkout-logo.svg"
                        className={styles.logo}
                        width={50}
                        height={50}
                        alt="image"
                    />
                    <Link href="/user?page=checkout">{translation.userpage.menu.checkout}</Link>
                </div>

                <div className={styles.asideMenuItem}>
                    <Image
                        src="/logout-logo.svg"
                        className={styles.logo}
                        width={50}
                        height={50}
                        alt="image"
                    />
                    <Link href="" onClick={logout}>{translation.userpage.menu.logout}</Link>
                </div>
            </div>
            {page === "checkout" ? (
                <div className={styles.rightSideCheckout}>
                    <CheckoutComponent />
                    {successAlert ? (
                        <div className={styles.successDiv}>
                            <Image
                                src="/success.svg"
                                className={styles.successLogo}
                                width={50}
                                height={50}
                                alt="image"
                                priority
                            />
                            <h2>{translation.userpage.orderReceived}</h2>
                        </div>
                    ) : null}
                </div>
            )
                :
                (
                    <div className={styles.rightSideContainer}>
                        {page === 'profile' && <ProfileComponent />}
                        {page === 'basket' && <BasketComponent />}
                        {page === 'orders' && <OrdersComponent />}
                        {!page && <DefaultComponent />}
                    </div>
                )
            }

            {windowWidth < 900 ? (
                <Image
                    src="/hamburgerLogoBlack.svg"
                    className={styles.hamburgerMenu}
                    width={50}
                    height={50}
                    alt="image"
                    priority
                    onClick={() => { setOpenMenu(!openMenu) }}
                />
            ) : null}
        </div>
    );
};

