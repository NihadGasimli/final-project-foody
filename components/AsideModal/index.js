import styles from "./addproduct.module.css";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import SuccessMessage from "../SuccessMessage";
import { useDispatch, useSelector } from "react-redux";
import { addProduct, editProduct } from "../../src/features/productSlice"
import { addRestaurant, editRestaurant } from "../../src/features/restaurantsSlice";
import { editCategory, addCategory } from "../../src/features/categorySlice";
import { editOffer, addOffer } from "../../src/features/offersSlice";
import { useLanguage } from "../../context/LanguageContext";

import en from "../../locales/admin/en.json";
import az from "../../locales/admin/az.json";
import ru from "../../locales/admin/ru.json";

export default function AsideModal({ setClosing, whichModal, item, editingRestaurantId }) {
    const dispatch = useDispatch();

    const [page, setPage] = useState(null);

    const [productImage, setProductImage] = useState(null);
    const [productImageURL, setProductImageURL] = useState(null);

    const [restaurantImage, setRestaurantImage] = useState(null);
    const [restaurantImageUrl, setRestaurantImageUrl] = useState(null);

    const [offerImage, setOfferImage] = useState(null);
    const [offerImageUrl, setOfferImageUrl] = useState(null);

    const [categoryImage, setCategoryImage] = useState(null);
    const [categoryImageUrl, setCategoryImageUrl] = useState(null);

    const [productErrors, setProductErrors] = useState({ photo: false, name: false, description: false, price: false, selection: false });
    const [restaurantErrors, setRestaurantErrors] = useState({ photo: false, name: false, cuisine: false, deliveryPrice: false, deliveryMin: false, address: false, category: false, slug: false });
    const [categoryErrors, setCategoryErrors] = useState({ photo: false, name: false, slug: false });
    const [offerErrors, setOfferErrors] = useState({ photo: false, name: false, description: false });

    const [restaurants, setRestaurants] = useState(null);
    const [categories, setCategories] = useState(null);

    const [selectedItemsRestaurant, setSelectedItemsRestaurant] = useState(null);
    const [editingRestaurantCategory, setEditingRestaurantCategory] = useState(null);

    const { language, setLanguage } = useLanguage();
    const [translation, setTranslation] = useState(en);

    const fileInputRef = useRef(null);

    const productName = useRef(null);
    const productDescription = useRef(null);
    const productPrice = useRef(null);
    const productRestaurant = useRef(null);

    const restaurantName = useRef(null);
    const restaurantCuisine = useRef(null);
    const restaurantDeliveryPrice = useRef(null);
    const restaurantDeliveryMin = useRef(null);
    const restaurantAddress = useRef(null);
    const restaurantCategory = useRef(null);
    const restaurantSlug = useRef(null);

    const categoryName = useRef(null);
    const categorySlug = useRef(null);

    const offerName = useRef(null);
    const offerDescription = useRef(null);


    const errors = {
        products: {
            photo: translation.asideModal.addProduct.errors.image,
            name: translation.asideModal.addProduct.errors.name,
            description: translation.asideModal.addProduct.errors.description,
            price: translation.asideModal.addProduct.errors.price,
            selection: translation.asideModal.addProduct.errors.restaurants
        },
        restaurants: {
            name: translation.asideModal.addRestaurant.errors.name,
            cuisine: translation.asideModal.addRestaurant.errors.cuisine,
            deliveryPrice: translation.asideModal.addRestaurant.errors.deliveryPrice,
            deliveryMin: translation.asideModal.addRestaurant.errors.deliveryMin,
            address: translation.asideModal.addRestaurant.errors.address,
            category: translation.asideModal.addRestaurant.errors.category,
            slug: translation.asideModal.addRestaurant.errors.slug,
            photo: translation.asideModal.addRestaurant.errors.image
        },
        categories: {
            name: translation.asideModal.addCategory.errors.name,
            slug: translation.asideModal.addCategory.errors.slug,
            photo: translation.asideModal.addCategory.errors.image
        },
        offers: {
            name: translation.asideModal.addOffer.errors.name,
            description: translation.asideModal.addOffer.errors.description,
            photo: translation.asideModal.addOffer.errors.image
        }
    };

    const dataRestuarant = useSelector(state => state.restuarant.data)
    useEffect(() => {
        dataRestuarant.then(result => { setRestaurants(result); })
    }, [dataRestuarant]);

    const dataCategory = useSelector(state => state.category.data)
    useEffect(() => {
        dataCategory.then(result => { setCategories(result); })
    }, [dataCategory])

    async function urlToFile(url, filename, mimeType) {
        const response = await fetch(url);
        const buffer = await response.arrayBuffer();
        return new File([buffer], filename, { type: mimeType || response.headers.get('content-type') });
    }

    useEffect(() => {
        if (whichModal === "editProduct" && item) {
            const restaurant = restaurants?.find(r => r.id === item.rest_id);
            if (restaurant) {
                setSelectedItemsRestaurant(restaurant.name);
            }

            urlToFile(item.img_url, item.name).then(file => {
                setProductImage(file);
                setProductImageURL(item.img_url);
            });
        }
        else if (whichModal === "editCategory" && item) {
            urlToFile(item?.img_url, item?.name).then(file => {
                setCategoryImage(file);
                setCategoryImageUrl(item.img_url);
            });
        }
        else if (whichModal === "editRestaurant" && editingRestaurantId) {
            urlToFile(item?.img_url, item?.name).then(file => {
                const category = categories?.find(c => c.id === item.category_id)
                setRestaurantImage(file);
                setRestaurantImageUrl(item.img_url);
                setEditingRestaurantCategory(category)
            });
        }
        else if (whichModal === "editOffer" && item) {
            urlToFile(item?.img_url, item?.name).then(file => {
                setOfferImage(file);
                setOfferImageUrl(item.img_url);
            });
        }
    }, [whichModal, item, restaurants]);

    useEffect(() => {
        if (language === "en") {
            setTranslation(en)
        }
        else if (language === "az") {
            setTranslation(az)
        }
        else if (language === "ru") {
            setTranslation(ru)
        }
    }, [language])

    function createProduct(e) {
        e.preventDefault();
        let newErrors = { ...productErrors };

        if (!productImageURL) {
            newErrors.photo = true;
        } else {
            newErrors.photo = false;
        }

        if (!productName.current.value) {
            newErrors.name = true;
        } else {
            newErrors.name = false;
        }

        if (!productDescription.current.value) {
            newErrors.description = true;
        } else {
            newErrors.description = false;
        }

        if (!productPrice.current.value) {
            newErrors.price = true;
        } else {
            newErrors.price = false;
        }

        if (!productRestaurant.current.value) {
            newErrors.selection = true;
        } else {
            newErrors.selection = false;
        }

        setProductErrors(newErrors);

        if (!newErrors.photo && !newErrors.name && !newErrors.description && !newErrors.price && !newErrors.selection) {
            const selectedRestaurant = restaurants.find(item => item.name === productRestaurant.current.value);

            if (selectedRestaurant) {
                dispatch(addProduct({
                    name: productName?.current.value,
                    description: productDescription?.current.value,
                    img_url: productImageURL,
                    rest_id: selectedRestaurant.id,
                    price: productPrice?.current.value
                }))
                alert("Your product added successfully!");
                setClosing(false);
            } else {
                alert("Selected restaurant not found!");
            }

        }
    }

    function createRestaurant(e) {
        e.preventDefault();
        let newErrors = { ...restaurantErrors };

        if (!restaurantImageUrl) {
            newErrors.photo = true;
        } else {
            newErrors.photo = false;
        }

        if (!restaurantName.current.value) {
            newErrors.name = true;
        } else {
            newErrors.name = false;
        }

        if (!restaurantCuisine.current.value) {
            newErrors.cuisine = true;
        } else {
            newErrors.cuisine = false;
        }

        if (!restaurantDeliveryPrice.current.value) {
            newErrors.deliveryPrice = true;
        } else {
            newErrors.deliveryPrice = false;
        }

        if (!restaurantDeliveryMin.current.value) {
            newErrors.deliveryMin = true;
        } else {
            newErrors.deliveryMin = false;
        }

        if (!restaurantAddress.current.value) {
            newErrors.address = true;
        } else {
            newErrors.address = false;
        }

        if (!restaurantCategory.current.value) {
            newErrors.category = true;
        } else {
            newErrors.category = false;
        }

        if (!restaurantSlug.current.value) {
            newErrors.slug = true;
        } else {
            newErrors.slug = false;
        }

        setRestaurantErrors(newErrors);

        //i shouldnt add new errors to haveerrorrestaurant with setHaveErrorRestaurant. Why? in console i see new newErrors, but when i setHaveErrorRestaurant(newErrors); , IN haveErrorResstaurant i dont see newErrors

        if (!newErrors.photo && !newErrors.name && !newErrors.cuisine && !newErrors.deliveryPrice && !newErrors.deliveryMin && !newErrors.deliveryPrice && !newErrors.address && !newErrors.category && !newErrors.slug) {
            const selectedCategory = categories.find(item => item.name === restaurantCategory.current.value);
            if (selectedCategory) {
                dispatch(addRestaurant({
                    name: restaurantName?.current.value,
                    category_id: selectedCategory?.id,
                    img_url: restaurantImageUrl,
                    cuisine: restaurantCuisine?.current.value,
                    address: restaurantAddress?.current.value,
                    delivery_min: restaurantDeliveryMin?.current.value,
                    delivery_price: restaurantDeliveryPrice?.current.value
                }))
                alert("Your restaurant added successfully!");
                setClosing(false);
            } else {
                alert("Selected category not found!");
            }

        }
    }

    function createCategory(e) {
        e.preventDefault();

        let newErrors = { ...categoryErrors };

        if (!categoryImageUrl) {
            newErrors.photo = true;
        } else {
            newErrors.photo = false;
        }

        if (!categoryName.current.value) {
            newErrors.name = true;
        } else {
            newErrors.name = false;
        }

        if (!categorySlug.current.value) {
            newErrors.slug = true;
        } else {
            newErrors.slug = false;
        }

        setCategoryErrors(newErrors);

        if (!newErrors.photo && !newErrors.name && !newErrors.slug) {

            dispatch(addCategory({
                name: categoryName?.current.value,
                img_url: categoryImageUrl,
                slug: categorySlug?.current.value,
            }))
            alert("Your category edited successfully!");
            setClosing(false);
        }
    }

    function createOffer(e) {
        e.preventDefault();

        let newErrors = { ...offerErrors };

        if (!offerImageUrl) {
            newErrors.photo = true;
        } else {
            newErrors.photo = false;
        }

        if (!offerName.current.value) {
            newErrors.name = true;
        } else {
            newErrors.name = false;
        }

        if (!offerDescription.current.value) {
            newErrors.description = true;
        } else {
            newErrors.description = false;
        }

        setOfferErrors(newErrors);

        if (!newErrors.photo && !newErrors.name && !newErrors.description) {

            dispatch(addOffer({
                name: offerName?.current.value,
                img_url: offerImageUrl,
                description: offerDescription?.current.value,
            }))
            alert("Your offer added successfully!");
            setClosing(false);
        }
    }

    async function editProductt(e) {
        e.preventDefault();
        let newErrors = { ...productErrors };

        if (!productImageURL) {
            newErrors.photo = true;
        } else {
            newErrors.photo = false;
        }

        if (!productName.current.value) {
            newErrors.name = true;
        } else {
            newErrors.name = false;
        }

        if (!productDescription.current.value) {
            newErrors.description = true;
        } else {
            newErrors.description = false;
        }

        if (!productPrice.current.value) {
            newErrors.price = true;
        } else {
            newErrors.price = false;
        }

        if (!productRestaurant.current.value) {
            newErrors.selection = true;
        } else {
            newErrors.selection = false;
        }

        setProductErrors(newErrors);

        if (!newErrors.photo && !newErrors.name && !newErrors.description && !newErrors.price && !newErrors.selection) {
            const selectedRestaurant = restaurants.find(item => item.name === productRestaurant.current.value);

            if (selectedRestaurant) {
                dispatch(editProduct({
                    id: item.id,
                    name: productName?.current.value,
                    description: productDescription?.current.value,
                    img_url: productImageURL,
                    rest_id: selectedRestaurant.id,
                    price: productPrice?.current.value
                }))
                alert("Your product edited successfully!");
                setClosing(false);
            } else {
                alert("Selected restaurant not found!");
            }

        }
    }

    function editCategoryy(e, selectedCategoryId) {
        e.preventDefault();

        let newErrors = { ...categoryErrors };

        if (!categoryImageUrl) {
            newErrors.photo = true;
        } else {
            newErrors.photo = false;
        }

        if (!categoryName.current.value) {
            newErrors.name = true;
        } else {
            newErrors.name = false;
        }

        if (!categorySlug.current.value) {
            newErrors.slug = true;
        } else {
            newErrors.slug = false;
        }

        setCategoryErrors(newErrors);

        if (!newErrors.photo && !newErrors.name && !newErrors.slug) {

            dispatch(editCategory({
                id: selectedCategoryId,
                name: categoryName?.current.value,
                img_url: categoryImageUrl,
                slug: categorySlug?.current.value,
            }))
            alert("Your category edited successfully!");
            setClosing(false);
        }

    }

    function editRestaurantt(e) {
        e.preventDefault();
        let newErrors = { ...restaurantErrors };

        if (!restaurantImageUrl) {
            newErrors.photo = true;
        } else {
            newErrors.photo = false;
        }

        if (!restaurantName.current.value) {
            newErrors.name = true;
        } else {
            newErrors.name = false;
        }

        if (!restaurantCuisine.current.value) {
            newErrors.cuisine = true;
        } else {
            newErrors.cuisine = false;
        }

        if (!restaurantDeliveryPrice.current.value) {
            newErrors.deliveryPrice = true;
        } else {
            newErrors.deliveryPrice = false;
        }

        if (!restaurantDeliveryMin.current.value) {
            newErrors.deliveryMin = true;
        } else {
            newErrors.deliveryMin = false;
        }

        if (!restaurantAddress.current.value) {
            newErrors.address = true;
        } else {
            newErrors.address = false;
        }

        if (!restaurantCategory.current.value) {
            newErrors.category = true;
        } else {
            newErrors.category = false;
        }

        if (!restaurantSlug.current.value) {
            newErrors.slug = true;
        } else {
            newErrors.slug = false;
        }

        setRestaurantErrors(newErrors);

        //i shouldnt add new errors to haveerrorrestaurant with setHaveErrorRestaurant. Why? in console i see new newErrors, but when i setHaveErrorRestaurant(newErrors); , IN haveErrorResstaurant i dont see newErrors

        if (!newErrors.photo && !newErrors.name && !newErrors.cuisine && !newErrors.deliveryPrice && !newErrors.deliveryMin && !newErrors.deliveryPrice && !newErrors.address && !newErrors.category && !newErrors.slug) {
            const selectedCategory = categories.find(item => item.name === restaurantCategory.current.value);

            if (selectedCategory) {
                dispatch(editRestaurant({
                    id: item?.id,
                    name: restaurantName?.current.value,
                    category_id: selectedCategory?.id,
                    img_url: restaurantImageUrl,
                    cuisine: restaurantCuisine?.current.value,
                    address: restaurantAddress?.current.value,
                    delivery_min: restaurantDeliveryMin?.current.value,
                    delivery_price: restaurantDeliveryPrice?.current.value
                }))
                alert("Your restaurant edited successfully!");
                setClosing(false);
            } else {
                alert("Selected category not found!");
            }

        }
    }

    function editOfferr(e) {
        e.preventDefault();
        let newErrors = { ...offerErrors };

        if (!offerImageUrl) {
            newErrors.photo = true;
        } else {
            newErrors.photo = false;
        }

        if (!offerName.current.value) {
            newErrors.name = true;
        } else {
            newErrors.name = false;
        }

        if (!offerDescription.current.value) {
            newErrors.description = true;
        } else {
            newErrors.description = false;
        }

        setOfferErrors(newErrors);

        if (!newErrors.photo && !newErrors.name && !newErrors.description) {
            dispatch(editOffer({
                id: item?.id,
                name: offerName?.current.value,
                img_url: offerImageUrl,
                description: offerDescription?.current.value
            }))
            alert("Your offer edited successfully!");
            setClosing(false);
        }
    }

    const handleFileChange = (e) => {
        if (whichModal === "product" || whichModal === "editProduct") {
            const file = e.target.files[0];
            setProductImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setProductImageURL(`${reader.result}`);
            };
            reader.readAsDataURL(file);
        }
        else if (whichModal === "restaurant" || whichModal === "editRestaurant") {
            const file = e.target.files[0];
            setRestaurantImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setRestaurantImageUrl(`${reader.result}`);
            };
            reader.readAsDataURL(file);
        }
        else if (whichModal === "editCategory" || whichModal === "category") {
            const file = e.target.files[0];
            setCategoryImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setCategoryImageUrl(`${reader.result}`);
            };
            reader.readAsDataURL(file);
        }
        else if (whichModal === "editOffer" || whichModal === "offer") {
            const file = e.target.files[0];
            setOfferImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setOfferImageUrl(`${reader.result}`);
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        if (whichModal === "product") {
            setPage(
                <>
                    <div className={styles.container}>
                        <div className={styles.main}>
                            <h1 className={styles.addProductHeading}>{translation.asideModal.addProduct.heading}</h1>

                            <div className={styles.uploadImageDiv}>
                                <div>
                                    <h2>{translation.asideModal.addProduct.uploadImage}</h2>
                                    {productErrors.photo && <p style={{ color: "#f00", paddingLeft: "20px" }}>{errors.products.photo}</p>}
                                </div>
                                <div className={styles.uploadImage}>
                                    {productImage ? (
                                        <div className={styles.whenImageSelected}>
                                            <h1>{productImage?.name}</h1>
                                            {productImageURL ? (
                                                <Image
                                                    src={productImageURL}
                                                    className={styles.logo}
                                                    width={40}
                                                    height={40}
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
                                                onClick={() => { setProductImage(null); setProductImageURL(null); }}
                                            />
                                        </div>
                                    ) : (
                                        <div className={styles.uploadImageAltDiv} onClick={() => { fileInputRef.current.click(); }}>
                                            <input ref={fileInputRef} style={{ display: "none" }} type="file" accept="image/*" onChange={handleFileChange} />
                                            <Image
                                                src="/admin-upload.svg"
                                                className={styles.uploadLogo}
                                                width={40}
                                                height={40}
                                                alt="Logo"
                                            />
                                            <h1>{translation.asideModal.addProduct.uploadText}</h1>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className={styles.descriptionDiv}>
                                <h2>{translation.asideModal.addProduct.secondHeading}</h2>
                                <div className={styles.description}>
                                    <label>{translation.asideModal.addProduct.form.name}</label>
                                    <input type="text" placeholder={translation.asideModal.addProduct.form.placeholders.name} ref={productName} />
                                    {productErrors.name && <p style={{ color: "#f00", paddingLeft: "20px" }}>{errors.products.name}</p>}

                                    <label>{translation.asideModal.addProduct.form.description}</label>
                                    <textarea ref={productDescription} type="text" placeholder={translation.asideModal.addProduct.form.placeholders.description} className={styles.descriptionInput}></textarea>
                                    {productErrors.description && <p style={{ color: "#f00", paddingLeft: "20px" }}>{errors.products.description}</p>}

                                    <label>{translation.asideModal.addProduct.form.price}</label>
                                    <input ref={productPrice} type="number" placeholder={translation.asideModal.addProduct.form.placeholders.price} className={styles.priceInput} />
                                    {productErrors.price && <p style={{ color: "#f00", paddingLeft: "20px" }}>{errors.products.price}</p>}

                                    <label>{translation.asideModal.addProduct.form.restaurants}</label>
                                    <select ref={productRestaurant}>
                                        <option value="">{translation.asideModal.addProduct.form.placeholders.restaurants}</option>
                                        {restaurants?.map(item => (
                                            <option value={item.name} key={item.id}>{item.name}</option>
                                        ))}

                                    </select>
                                    {productErrors.selection && <p style={{ color: "#f00", paddingLeft: "20px" }}>{errors.products.selection}</p>}
                                </div>
                            </div>

                            <div className={styles.buttons}>
                                <button className={styles.cancelButton} onClick={() => { setClosing(false); }}>{translation.asideModal.addProduct.cancelButton}</button>
                                <button className={styles.createButton} onClick={(e) => { createProduct(e); }}>{translation.asideModal.addProduct.confirmButton}</button>
                            </div>
                        </div>
                    </div>
                </>
            )
        }
        else if (whichModal === "editProduct") {
            setPage(
                <>
                    <div className={styles.container}>
                        <div className={styles.main}>
                            <h1 className={styles.addProductHeading}>{translation.asideModal.editProduct.heading}</h1>

                            <div className={styles.uploadImageDiv}>
                                <div>
                                    <h2>{translation.asideModal.editProduct.uploadImage}</h2>
                                    {productErrors.photo && <p style={{ color: "#f00", paddingLeft: "20px" }}>{errors.products.photo}</p>}
                                </div>
                                <div className={styles.uploadImage}>
                                    {productImage ? (
                                        <div className={styles.whenImageSelected}>
                                            <h1>{productImage?.name}</h1>
                                            {productImageURL ? (
                                                <Image
                                                    src={productImageURL}
                                                    className={styles.logo}
                                                    width={40}
                                                    height={40}
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
                                                onClick={() => { setProductImage(null); setProductImageURL(null); }}
                                            />
                                        </div>
                                    ) : (
                                        <div className={styles.uploadImageAltDiv} onClick={() => { fileInputRef.current.click(); }}>
                                            <input ref={fileInputRef} style={{ display: "none" }} type="file" accept="image/*" onChange={handleFileChange} />
                                            <Image
                                                src="/admin-upload.svg"
                                                className={styles.uploadLogo}
                                                width={40}
                                                height={40}
                                                alt="Logo"
                                            />
                                            <h1>{translation.asideModal.editProduct.uploadText}</h1>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className={styles.descriptionDiv}>
                                <h2>{translation.asideModal.editProduct.secondHeading}</h2>
                                <div className={styles.description}>
                                    <label>{translation.asideModal.editProduct.form.name}</label>
                                    <input type="text" placeholder={translation.asideModal.editProduct.form.placeholders.name} ref={productName} defaultValue={item.name} />
                                    {productErrors.name && <p style={{ color: "#f00", paddingLeft: "20px" }}>{errors.products.name}</p>}

                                    <label>{translation.asideModal.editProduct.form.description}</label>
                                    <textarea ref={productDescription} type="text" placeholder={translation.asideModal.editProduct.form.placeholders.description} className={styles.descriptionInput} defaultValue={item.description}></textarea>
                                    {productErrors.description && <p style={{ color: "#f00", paddingLeft: "20px" }}>{errors.products.description}</p>}

                                    <label>{translation.asideModal.editProduct.form.price}</label>
                                    <input ref={productPrice} type="number" placeholder={translation.asideModal.editProduct.form.placeholders.price} className={styles.priceInput} defaultValue={item.price} />
                                    {productErrors.price && <p style={{ color: "#f00", paddingLeft: "20px" }}>{errors.products.price}</p>}

                                    <label>{translation.asideModal.editProduct.form.restaurants}</label>
                                    <select ref={productRestaurant} value={selectedItemsRestaurant}>
                                        <option value="">{translation.asideModal.editProduct.form.placeholders.restaurants}</option>
                                        {restaurants?.map(item => (
                                            <option value={item.name} key={item.id}>{item.name}</option>
                                        ))}

                                    </select>

                                    {productErrors.selection && <p style={{ color: "#f00", paddingLeft: "20px" }}>{errors.products.selection}</p>}
                                </div>
                            </div>

                            <div className={styles.buttons}>
                                <button className={styles.cancelButton} onClick={() => { setClosing(false); }}>{translation.asideModal.editProduct.cancelButton}</button>
                                <button className={styles.createButton} onClick={(e) => { editProductt(e); }}>{translation.asideModal.editProduct.confirmButton}</button>
                            </div>
                        </div>
                    </div>
                </>
            )
        }
        else if (whichModal === "restaurant") {
            setPage(
                <>
                    <div className={styles.container}>
                        <div className={styles.main}>
                            <h1 className={styles.addProductHeading}>{translation.asideModal.addRestaurant.heading}</h1>

                            <div className={styles.uploadImageDiv}>
                                <div>
                                    <h2>{translation.asideModal.addRestaurant.upload}</h2>
                                    {restaurantErrors.photo && <p style={{ color: "#f00", paddingLeft: "20px" }}>{errors.restaurants.photo}</p>}
                                </div>
                                <div className={styles.uploadImage}>
                                    {restaurantImage ? (
                                        <div className={styles.whenImageSelected}>
                                            <h1>{restaurantImage?.name}</h1>
                                            {restaurantImageUrl ? (
                                                <Image
                                                    src={restaurantImageUrl}
                                                    className={styles.logo}
                                                    width={40}
                                                    height={40}
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
                                                onClick={() => { setRestaurantImage(null); setRestaurantImageUrl(null); }}
                                            />
                                        </div>
                                    ) : (
                                        <div className={styles.uploadImageAltDiv} onClick={() => { fileInputRef.current.click(); }}>
                                            <input ref={fileInputRef} style={{ display: "none" }} type="file" accept="image/*" onChange={handleFileChange} />
                                            <Image
                                                src="/admin-upload.svg"
                                                className={styles.uploadLogo}
                                                width={40}
                                                height={40}
                                                alt="Logo"
                                            />
                                            <h1>{translation.asideModal.addRestaurant.uploadText}</h1>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className={styles.descriptionDiv}>
                                <h2>{translation.asideModal.addRestaurant.secondHeading}</h2>
                                <div className={styles.description}>
                                    <label>{translation.asideModal.addRestaurant.form.name}</label>
                                    <input type="text" placeholder={translation.asideModal.addRestaurant.form.placeholders.name} ref={restaurantName} />
                                    {restaurantErrors.name && <p style={{ color: "#f00", paddingLeft: "20px" }}>{errors.restaurants.name}</p>}

                                    <label>{translation.asideModal.addRestaurant.form.cuisine}</label>
                                    <textarea ref={restaurantCuisine} type="text" placeholder={translation.asideModal.addRestaurant.form.placeholders.cuisine} className={styles.descriptionInput}></textarea>
                                    {restaurantErrors.cuisine && <p style={{ color: "#f00", paddingLeft: "20px" }}>{errors.restaurants.cuisine}</p>}

                                    <label>{translation.asideModal.addRestaurant.form.deliveryPrice}</label>
                                    <input ref={restaurantDeliveryPrice} type="number" placeholder={translation.asideModal.addRestaurant.form.placeholders.deliveryPrice} className={styles.priceInput} />
                                    {restaurantErrors.deliveryPrice && <p style={{ color: "#f00", paddingLeft: "20px" }}>{errors.restaurants.deliveryPrice}</p>}

                                    <label>{translation.asideModal.addRestaurant.form.deliveryMin}</label>
                                    <input ref={restaurantDeliveryMin} type="number" placeholder={translation.asideModal.addRestaurant.form.placeholders.deliveryMin} className={styles.priceInput} />
                                    {restaurantErrors.deliveryMin && <p style={{ color: "#f00", paddingLeft: "20px" }}>{errors.restaurants.deliveryMin}</p>}

                                    <label>{translation.asideModal.addRestaurant.form.address}</label>
                                    <input ref={restaurantAddress} type="text" placeholder={translation.asideModal.addRestaurant.form.placeholders.address} className={styles.priceInput} />
                                    {restaurantErrors.address && <p style={{ color: "#f00", paddingLeft: "20px" }}>{errors.restaurants.address}</p>}

                                    <label>{translation.asideModal.addRestaurant.form.category}</label>
                                    <select ref={restaurantCategory}>
                                        <option value="">{translation.asideModal.addRestaurant.form.placeholders.category}</option>
                                        {categories?.map(item => (
                                            <option value={item.name} key={item.id}>{item.name}</option>
                                        ))}
                                    </select>
                                    {restaurantErrors.category && <p style={{ color: "#f00", paddingLeft: "20px" }}>{errors.restaurants.category}</p>}

                                    <label>{translation.asideModal.addRestaurant.form.slug}</label>
                                    <input ref={restaurantSlug} type="text" placeholder={translation.asideModal.addRestaurant.form.placeholders.slug} className={styles.priceInput} />
                                    {restaurantErrors.slug && <p style={{ color: "#f00", paddingLeft: "20px" }}>{errors.restaurants.slug}</p>}
                                </div>
                            </div>

                            <div className={styles.buttons}>
                                <button className={styles.cancelButton} onClick={() => { setClosing(false); }}>{translation.asideModal.addRestaurant.cancelButton}</button>
                                <button className={styles.createButton} onClick={(e) => { createRestaurant(e); }}>{translation.asideModal.addRestaurant.confirmButton}</button>
                            </div>
                        </div>
                    </div>
                </>
            )
        }
        else if (whichModal === "category") {
            setPage(
                <>
                    <div className={styles.container}>
                        <div className={styles.main}>
                            <h1 className={styles.addProductHeading}>{translation.asideModal.addCategory.heading}</h1>

                            <div className={styles.uploadImageDiv}>
                                <div>
                                    <h2>{translation.asideModal.addCategory.uploadImage}</h2>
                                    {categoryErrors.photo && <p style={{ color: "#f00", paddingLeft: "20px" }}>{errors.categories.photo}</p>}
                                </div>
                                <div className={styles.uploadImage}>
                                    {categoryImage ? (
                                        <div className={styles.whenImageSelected}>
                                            <h1>{categoryImage?.name}</h1>
                                            {categoryImageUrl ? (
                                                <Image
                                                    src={categoryImageUrl}
                                                    className={styles.logo}
                                                    width={40}
                                                    height={40}
                                                    alt="category-image"
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
                                                onClick={() => { setCategoryImage(null); setCategoryImageUrl(null); }}
                                            />
                                        </div>
                                    ) : (
                                        <div className={styles.uploadImageAltDiv} onClick={() => { fileInputRef.current.click(); }}>
                                            <input ref={fileInputRef} style={{ display: "none" }} type="file" accept="image/*" onChange={handleFileChange} />
                                            <Image
                                                src="/admin-upload.svg"
                                                className={styles.uploadLogo}
                                                width={40}
                                                height={40}
                                                alt="Logo"
                                            />
                                            <h1>{translation.asideModal.addCategory.uploadText}</h1>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className={`${styles.descriptionDiv} ${styles.descriptionEditCategoryDiv}`}>
                                <h2>{translation.asideModal.addCategory.setProductErrors}</h2>
                                <div className={`${styles.description} ${styles.descriptionEditCategory}`}>
                                    <label>{translation.asideModal.addCategory.form.name}v</label>
                                    <input type="text" placeholder={translation.asideModal.addCategory.form.placeholders.name} ref={categoryName} />
                                    {categoryErrors.name && <p style={{ color: "#f00", paddingLeft: "20px" }}>{errors.categories.name}</p>}

                                    <label>{translation.asideModal.addCategory.form.slug}</label>
                                    <input ref={categorySlug} type="text" placeholder={translation.asideModal.addCategory.form.placeholders.slug} className={styles.priceInput} />
                                    {categoryErrors.slug && <p style={{ color: "#f00", paddingLeft: "20px" }}>{errors.categories.slug}</p>}

                                </div>
                            </div>

                            <div className={styles.buttons}>
                                <button className={styles.cancelButton} onClick={() => { setClosing(false); }}>{translation.asideModal.addCategory.cancelButton}</button>
                                <button className={styles.createButton} onClick={(e) => { createCategory(e); }}>{translation.asideModal.addCategory.confirmButton}</button>
                            </div>
                        </div>
                    </div>
                </>
            )
        }
        else if (whichModal === "editCategory") {
            setPage(
                <>
                    <div className={styles.container}>
                        <div className={styles.main}>
                            <h1 className={styles.addProductHeading}>{translation.asideModal.editCategory.heading}</h1>

                            <div className={styles.uploadImageDiv}>
                                <div>
                                    <h2>{translation.asideModal.editCategory.uploadImage}</h2>
                                    {categoryErrors.photo && <p style={{ color: "#f00", paddingLeft: "20px" }}>{errors.categories.photo}</p>}
                                </div>
                                <div className={styles.uploadImage}>
                                    {categoryImage ? (
                                        <div className={styles.whenImageSelected}>
                                            <h1>{categoryImage?.name}</h1>
                                            {categoryImageUrl ? (
                                                <Image
                                                    src={categoryImageUrl}
                                                    className={styles.logo}
                                                    width={40}
                                                    height={40}
                                                    alt="category-image"
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
                                                onClick={() => { setCategoryImage(null); setCategoryImageUrl(null); }}
                                            />
                                        </div>
                                    ) : (
                                        <div className={styles.uploadImageAltDiv} onClick={() => { fileInputRef.current.click(); }}>
                                            <input ref={fileInputRef} style={{ display: "none" }} type="file" accept="image/*" onChange={handleFileChange} />
                                            <Image
                                                src="/admin-upload.svg"
                                                className={styles.uploadLogo}
                                                width={40}
                                                height={40}
                                                alt="Logo"
                                            />
                                            <h1>{translation.asideModal.editCategory.uploadText}</h1>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className={`${styles.descriptionDiv} ${styles.descriptionEditCategoryDiv}`}>
                                <h2>{translation.asideModal.editCategory.secondHeading}</h2>
                                <div className={`${styles.description} ${styles.descriptionEditCategory}`}>
                                    <label>{translation.asideModal.editCategory.form.name}</label>
                                    <input type="text" placeholder={translation.asideModal.editCategory.form.placeholders.name} ref={categoryName} defaultValue={item.name} />
                                    {categoryErrors.name && <p style={{ color: "#f00", paddingLeft: "20px" }}>{errors.categories.name}</p>}

                                    <label>{translation.asideModal.editCategory.form.slug}</label>
                                    <input ref={categorySlug} type="text" placeholder={translation.asideModal.editCategory.form.placeholders.slug} className={styles.priceInput} defaultValue={item.slug} />
                                    {categoryErrors.slug && <p style={{ color: "#f00", paddingLeft: "20px" }}>{errors.categories.slug}</p>}

                                </div>
                            </div>

                            <div className={styles.buttons}>
                                <button className={styles.cancelButton} onClick={() => { setClosing(false); }}>{translation.asideModal.editCategory.cancelButton}</button>
                                <button className={styles.createButton} onClick={(e) => { editCategoryy(e, item.id); }}>{translation.asideModal.editCategory.confirmButton}</button>
                            </div>
                        </div>
                    </div>
                </>
            )
        }
        else if (whichModal === "editRestaurant") {
            setPage(
                <>
                    <div className={styles.container}>
                        <div className={styles.main}>
                            <h1 className={styles.addProductHeading}>{translation.asideModal.editRestaurant.heading}</h1>

                            <div className={styles.uploadImageDiv}>
                                <div>
                                    <h2>{translation.asideModal.editRestaurant.uploadImage}</h2>
                                    {restaurantErrors.photo && <p style={{ color: "#f00", paddingLeft: "20px" }}>{errors.restaurants.photo}</p>}
                                </div>
                                <div className={styles.uploadImage}>
                                    {restaurantImage ? (
                                        <div className={styles.whenImageSelected}>
                                            <h1>{restaurantImage?.name}</h1>
                                            {restaurantImageUrl ? (
                                                <Image
                                                    src={restaurantImageUrl}
                                                    className={styles.logo}
                                                    width={40}
                                                    height={40}
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
                                                onClick={() => { setRestaurantImage(null); setRestaurantImageUrl(null); }}
                                            />
                                        </div>
                                    ) : (
                                        <div className={styles.uploadImageAltDiv} onClick={() => { fileInputRef.current.click(); }}>
                                            <input ref={fileInputRef} style={{ display: "none" }} type="file" accept="image/*" onChange={handleFileChange} />
                                            <Image
                                                src="/admin-upload.svg"
                                                className={styles.uploadLogo}
                                                width={40}
                                                height={40}
                                                alt="Logo"
                                            />
                                            <h1>{translation.asideModal.editRestaurant.uploadText}</h1>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className={styles.descriptionDiv}>
                                <h2>{translation.asideModal.editRestaurant.secondHeading}</h2>
                                <div className={styles.description}>
                                    <label>{translation.asideModal.editRestaurant.form.name}</label>
                                    <input type="text" placeholder={translation.asideModal.editRestaurant.form.placeholders.name} ref={restaurantName} defaultValue={item.name} />
                                    {restaurantErrors.name && <p style={{ color: "#f00", paddingLeft: "20px" }}>{errors.restaurants.name}</p>}

                                    <label>{translation.asideModal.editRestaurant.form.cuisine}</label>
                                    <textarea ref={restaurantCuisine} type="text" placeholder={translation.asideModal.editRestaurant.form.placeholders.cuisine} className={styles.descriptionInput} defaultValue={item.cuisine}></textarea>
                                    {restaurantErrors.cuisine && <p style={{ color: "#f00", paddingLeft: "20px" }}>{errors.restaurants.cuisine}</p>}

                                    <label>{translation.asideModal.editRestaurant.form.deliveryPrice}</label>
                                    <input ref={restaurantDeliveryPrice} type="number" placeholder={translation.asideModal.editRestaurant.form.placeholders.deliveryPrice} className={styles.priceInput} defaultValue={item.delivery_price} />
                                    {restaurantErrors.deliveryPrice && <p style={{ color: "#f00", paddingLeft: "20px" }}>{errors.restaurants.deliveryPrice}</p>}

                                    <label>{translation.asideModal.editRestaurant.form.deliveryMin}</label>
                                    <input ref={restaurantDeliveryMin} type="number" placeholder={translation.asideModal.editRestaurant.form.placeholders.deliveryMin} className={styles.priceInput} defaultValue={item.delivery_min} />
                                    {restaurantErrors.deliveryMin && <p style={{ color: "#f00", paddingLeft: "20px" }}>{errors.restaurants.deliveryMin}</p>}

                                    <label>{translation.asideModal.editRestaurant.form.address}</label>
                                    <input ref={restaurantAddress} type="text" placeholder={translation.asideModal.editRestaurant.form.placeholders.address} className={styles.priceInput} defaultValue={item.address} />
                                    {restaurantErrors.address && <p style={{ color: "#f00", paddingLeft: "20px" }}>{errors.restaurants.address}</p>}

                                    <label>{translation.asideModal.editRestaurant.form.category}</label>
                                    <select ref={restaurantCategory} value={editingRestaurantCategory?.name}>
                                        <option value="">{translation.asideModal.editRestaurant.form.placeholders.category}</option>
                                        {categories?.map(item => (
                                            <option value={item.name} key={item.id}>{item.name}</option>
                                        ))}
                                    </select>
                                    {restaurantErrors.category && <p style={{ color: "#f00", paddingLeft: "20px" }}>{errors.restaurants.category}</p>}

                                    <label>{translation.asideModal.editRestaurant.form.slug}</label>
                                    <input ref={restaurantSlug} type="text" placeholder={translation.asideModal.editRestaurant.form.placeholders.slug} className={styles.priceInput} defaultValue={editingRestaurantCategory?.slug} />
                                    {restaurantErrors.slug && <p style={{ color: "#f00", paddingLeft: "20px" }}>{errors.restaurants.slug}</p>}
                                </div>
                            </div>

                            <div className={styles.buttons}>
                                <button className={styles.cancelButton} onClick={() => { setClosing(false); }}>{translation.asideModal.editRestaurant.cancelButton}</button>
                                <button className={styles.createButton} onClick={(e) => { editRestaurantt(e); }}>{translation.asideModal.editRestaurant.confirmButton}</button>
                            </div>
                        </div>
                    </div>
                </>
            )
        }
        else if (whichModal === "editOffer") {
            setPage(
                <>
                    <div className={styles.container}>
                        <div className={styles.main}>
                            <h1 className={styles.addProductHeading}>{translation.asideModal.editOffer.heading}</h1>

                            <div className={styles.uploadImageDiv}>
                                <div>
                                    <h2>{translation.asideModal.editOffer.uploadImage}</h2>
                                    {offerErrors.photo && <p style={{ color: "#f00", paddingLeft: "20px" }}>{errors.offers.photo}</p>}
                                </div>
                                <div className={styles.uploadImage}>
                                    {offerImage ? (
                                        <div className={styles.whenImageSelected}>
                                            <h1>{offerImage?.name}</h1>
                                            {offerImageUrl ? (
                                                <Image
                                                    src={offerImageUrl}
                                                    className={styles.logo}
                                                    width={40}
                                                    height={40}
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
                                                onClick={() => { setOfferImage(null); setOfferImageUrl(null); }}
                                            />
                                        </div>
                                    ) : (
                                        <div className={styles.uploadImageAltDiv} onClick={() => { fileInputRef.current.click(); }}>
                                            <input ref={fileInputRef} style={{ display: "none" }} type="file" accept="image/*" onChange={handleFileChange} />
                                            <Image
                                                src="/admin-upload.svg"
                                                className={styles.uploadLogo}
                                                width={40}
                                                height={40}
                                                alt="Logo"
                                            />
                                            <h1>{translation.asideModal.editOffer.uploadText}</h1>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className={styles.descriptionDiv}>
                                <h2>{translation.asideModal.editOffer.secondHeading}</h2>
                                <div className={styles.description}>
                                    <label>{translation.asideModal.editOffer.form.title}</label>
                                    <input type="text" placeholder={translation.asideModal.editOffer.form.placeholders.title} ref={offerName} defaultValue={item.name} />
                                    {offerErrors.name && <p style={{ color: "#f00", paddingLeft: "20px" }}>{errors.offers.name}</p>}

                                    <label>{translation.asideModal.editOffer.form.description}</label>
                                    <textarea ref={offerDescription} type="text" placeholder={translation.asideModal.editOffer.form.placeholders.description} className={styles.descriptionInput} defaultValue={item.description}></textarea>
                                    {offerErrors.cuisine && <p style={{ color: "#f00", paddingLeft: "20px" }}>{errors.offers.description}</p>}
                                </div>
                            </div>

                            <div className={styles.buttons}>
                                <button className={styles.cancelButton} onClick={() => { setClosing(false); }}>{translation.asideModal.editOffer.cancelButton}</button>
                                <button className={styles.createButton} onClick={(e) => { editOfferr(e) }}>{translation.asideModal.editOffer.confirmButton}</button>
                            </div>
                        </div>
                    </div>
                </>
            )
        }
        else if (whichModal === "offer") {
            setPage(
                <>
                    <div className={styles.container}>
                        <div className={styles.main}>
                            <h1 className={styles.addProductHeading}>{translation.asideModal.addOffer.heading}</h1>

                            <div className={styles.uploadImageDiv}>
                                <div>
                                    <h2>{translation.asideModal.addOffer.uploadImage}</h2>
                                    {offerErrors.photo && <p style={{ color: "#f00", paddingLeft: "20px" }}>{errors.offers.photo}</p>}
                                </div>
                                <div className={styles.uploadImage}>
                                    {offerImage ? (
                                        <div className={styles.whenImageSelected}>
                                            <h1>{offerImage?.name}</h1>
                                            {offerImageUrl ? (
                                                <Image
                                                    src={offerImageUrl}
                                                    className={styles.logo}
                                                    width={40}
                                                    height={40}
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
                                                onClick={() => { setOfferImage(null); setOfferImageUrl(null); }}
                                            />
                                        </div>
                                    ) : (
                                        <div className={styles.uploadImageAltDiv} onClick={() => { fileInputRef.current.click(); }}>
                                            <input ref={fileInputRef} style={{ display: "none" }} type="file" accept="image/*" onChange={handleFileChange} />
                                            <Image
                                                src="/admin-upload.svg"
                                                className={styles.uploadLogo}
                                                width={40}
                                                height={40}
                                                alt="Logo"
                                            />
                                            <h1>{translation.asideModal.addOffer.uploadText}</h1>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className={styles.descriptionDiv}>
                                <h2>{translation.asideModal.addOffer.secondHeading}</h2>
                                <div className={styles.description}>
                                    <label>{translation.asideModal.addOffer.form.title}</label>
                                    <input type="text" placeholder={translation.asideModal.addOffer.form.placeholders.title} ref={offerName} />
                                    {offerErrors.name && <p style={{ color: "#f00", paddingLeft: "20px" }}>{errors.offers.name}</p>}

                                    <label>{translation.asideModal.addOffer.form.description}</label>
                                    <textarea ref={offerDescription} type="text" placeholder={translation.asideModal.addOffer.form.placeholders.description} className={styles.descriptionInput}></textarea>
                                    {offerErrors.description && <p style={{ color: "#f00", paddingLeft: "20px" }}>{errors.offers.description}</p>}
                                </div>
                            </div>

                            <div className={styles.buttons}>
                                <button className={styles.cancelButton} onClick={() => { setClosing(false); }}>{translation.asideModal.addOffer.cancelButton}</button>
                                <button className={styles.createButton} onClick={(e) => { createOffer(e) }}>{translation.asideModal.addOffer.confirmButton}</button>
                            </div>
                        </div>
                    </div>
                </>
            )
        }
    }, [whichModal, item, restaurants, productImageURL, restaurantImage, restaurantImageUrl, categoryImage, categoryImageUrl, restaurantErrors, productErrors, categoryErrors, offerImage, offerImageUrl, offerErrors, translation])

    return (
        <>
            {page}
        </>
    );
}
