import { Colors } from "chart.js";
import styles from "./addproduct.module.css";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import SuccessMessage from "../SuccessMessage";

export default function AddProduct({ setClosing }) {
    const [productImage, setProductImage] = useState(null);
    const [productImageURL, setProductImageURL] = useState(null);
    const [haveError, setHaveError] = useState({ photo: false, name: false, description: false, price: false, selection: false });
    const [restaurants, setRestaurants] = useState([]);
    const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
    const fileInputRef = useRef(null);
    const productName = useRef(null);
    const productDescription = useRef(null);
    const productPrice = useRef(null);
    const productRestaurant = useRef(null);

    const errors = {
        photo: "Please select product image",
        name: "Please write product name",
        description: "Please write product description",
        price: "Please write product price",
        selection: "Please select restaurant type"
    };

    useEffect(() => {
        fetch("/api/restuarants", { method: "GET" }).then(response => response.json()).then(result => {
            setRestaurants(result?.result.data);
        });
    }, []);

    async function createProduct(e) {
        e.preventDefault();
        let newErrors = { ...haveError };

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

        setHaveError(newErrors);

        if (!newErrors.photo && !newErrors.name && !newErrors.description && !newErrors.price && !newErrors.selection) {
            const selectedRestaurant = restaurants.find(item => item.name === productRestaurant.current.value);

            if (selectedRestaurant) {
                await fetch("/api/products", {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json; charset=UTF-8"
                    },
                    body: JSON.stringify({
                        name: productName?.current.value,
                        description: productDescription?.current.value,
                        img_url: productImageURL,
                        rest_id: selectedRestaurant.id,
                        price: productPrice?.current.value
                    })
                }).then(() => {
                    alert("Your product added successfully!");
                    setClosing(false);
                });
            } else {
                alert("Selected restaurant not found!");
            }

        }
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        console.log(file)
        setProductImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setProductImageURL(reader.result);
            console.log(reader.result)
        };
        reader.readAsDataURL(file);
        console.log(productImageURL)
    };

    return (
        <>
            <div className={styles.container}>
                <div className={styles.main}>
                    <h1 className={styles.addProductHeading}>Add product</h1>

                    <div className={styles.uploadImageDiv}>
                        <div>
                            <h2>Upload your product image</h2>
                            {haveError.photo && <p style={{ color: "#f00", paddingLeft: "20px" }}>{errors.photo}</p>}
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
                                    <h1>Upload</h1>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={styles.descriptionDiv}>
                        <h2>Add your Product description and necessary information</h2>
                        <div className={styles.description}>
                            <label>Name</label>
                            <input type="text" placeholder="Name of product" ref={productName} />
                            {haveError.name && <p style={{ color: "#f00", paddingLeft: "20px" }}>{errors.name}</p>}

                            <label>Description</label>
                            <textarea ref={productDescription} type="text" placeholder="Description of product" className={styles.descriptionInput}></textarea>
                            {haveError.description && <p style={{ color: "#f00", paddingLeft: "20px" }}>{errors.description}</p>}

                            <label>Price</label>
                            <input ref={productPrice} type="number" placeholder="Price of product" className={styles.priceInput} />
                            {haveError.price && <p style={{ color: "#f00", paddingLeft: "20px" }}>{errors.price}</p>}

                            <label>Restaurants</label>
                            <select ref={productRestaurant}>
                                <option value="">Select restaurant</option>
                                {restaurants?.map(item => (
                                    <option value={item.name} key={item.id}>{item.name}</option>
                                ))}

                            </select>
                            {haveError.selection && <p style={{ color: "#f00", paddingLeft: "20px" }}>{errors.selection}</p>}
                        </div>
                    </div>

                    <div className={styles.buttons}>
                        <button className={styles.cancelButton} onClick={() => { setClosing(false); }}>Cancel</button>
                        <button className={styles.createButton} onClick={(e) => { createProduct(e); }}>Create Product</button>
                    </div>
                </div>
            </div>
        </>
    );
}
