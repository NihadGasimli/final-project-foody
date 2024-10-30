"use client"

import { useDispatch, useSelector } from "react-redux";
import { settingPage } from "../../features/pagesSlice"
import styles from "./restaurants.module.css";
import { Pagination } from "@mui/material";
import { PaginationItem } from "@mui/material";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
export default function Restaurants() {
    const dispatch = useDispatch();
    const router = useRouter();

    useEffect(() => {
        dispatch(settingPage("restaurants"));
    }, [dispatch]);

    const [categories, setCategories] = useState(null); 4
    const [selectedCategory, setSelectedCategory] = useState("all");

    const [restaurants, setRestaurants] = useState(null);
    const [showingRestaurants, setShowingRestaurants] = useState(null);

    const [loading, setLoading] = useState(true);

    const [totalPages, setTotalPages] = useState(1);
    const [activePageNumber, setActivePageNumber] = useState(1);

    const dataCategory = useSelector(state => state.category.data);

    const dataRestaurant = useSelector(state => state.restuarant.data);

    const [filtersOpened, setFiltersOpened] = useState(false);

    useEffect(() => {
        dataCategory.then(result => { setCategories(result) })
        dataRestaurant.then(result => { setRestaurants(result); })
    }, [dataCategory, dataRestaurant])

    useEffect(() => {
        sortingPages(1)
    }, [restaurants])

    useEffect(() => {
        sortingPages(activePageNumber)
    }, [selectedCategory, activePageNumber])

    useEffect(() => {
        if (showingRestaurants && categories) {
            setLoading(false)
        }
    }, [showingRestaurants, categories])

    useEffect(() => {
        if (filtersOpened) {
            document.body.classList.add(styles.hiddenOverflow)
        }
        else {
            document.body.classList.remove(styles.hiddenOverflow)
        }
    }, [filtersOpened])

    const handlePageChange = (event, value) => {
        setActivePageNumber(value);
        sortingPages(value);
    };

    function sortingPages(pageNumber) {
        if (selectedCategory === "all" && restaurants) {
            setShowingRestaurants(restaurants?.slice((pageNumber * 4) - 4, pageNumber * 4));
            setTotalPages(Math.ceil(restaurants.length / 4));
        } else if (restaurants) {
            const filteredRestaurants = restaurants.filter(restaurant => restaurant.category_id === selectedCategory.id);
            console.log(filteredRestaurants)
            setShowingRestaurants(filteredRestaurants)
            setTotalPages(Math.ceil(filteredRestaurants.length / 4));
        }
    }

    return (
        <>
            <div className={styles.container}>
                {loading ? (
                    <Image
                        src="/loading3.gif"
                        className={styles.loadingGif}
                        width={50}
                        height={50}
                        alt="Loading"
                    />
                )
                    :
                    (
                        <>
                            <div className={styles.leftSide}>
                                <div onClick={() => { setSelectedCategory("all"); }} className={`${styles.categoryItem} ${selectedCategory === "all" ? styles.selectedCategory : ""}`}>
                                    <Image
                                        src="/pizza-photo.svg"
                                        className={styles.categoryImage}
                                        width={0}
                                        height={0}
                                        alt="image"
                                    />
                                    <h2>All</h2>
                                </div>
                                {categories?.map((item) => (
                                    <div key={item.id} onClick={() => { setSelectedCategory(item); }} className={`${styles.categoryItem} ${selectedCategory.name === `${item.name}` ? styles.selectedCategory : ""}`}>
                                        <Image
                                            src={item.img_url}
                                            className={styles.categoryImage}
                                            width={0}
                                            height={0}
                                            alt="image"
                                        />
                                        <h2>{item.name}</h2>
                                    </div>
                                ))}
                            </div>

                            <div className={styles.rightSide}>
                                <div className={styles.filterDiv}>
                                    <button className={styles.filtersButton} onClick={() => { setFiltersOpened(true); }}>☰ Filters</button>
                                    <p>{selectedCategory === "all" ? null : selectedCategory.name}</p>
                                </div>
                                <div className={styles.restaurants}>
                                    {showingRestaurants?.map((item) => (
                                        <div key={item.id} className={styles.restaurantDiv} onClick={() => { router.push(`/restaurants/${item.id}`) }}>
                                            <Image
                                                src={item.img_url}
                                                className={styles.restaurantImage}
                                                width={0}
                                                height={0}
                                                alt="image"
                                            />
                                            <div className={styles.restaurantTexts}>
                                                <h2 className={styles.restaurantName}>{item.name}</h2>
                                                <p className={styles.restaurantCuisine}>{item.cuisine}</p>
                                                <div className={styles.deliveryDiv}>
                                                    <p className={styles.restaurantDelivery_price}>${item.delivery_price} Delivery</p>
                                                    <p className={styles.restaurantDelivery_min}>{item.delivery_min} Min</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <Pagination
                                    style={{ margin: '0 auto' }}
                                    count={totalPages}
                                    onChange={handlePageChange}
                                    variant="outlined"
                                    shape="rounded"
                                    renderItem={(item) => (
                                        <PaginationItem
                                            {...item}
                                            sx={{
                                                '&.Mui-selected': {
                                                    backgroundColor: '#E53935',
                                                    color: '#fff',
                                                },
                                                '& .MuiPaginationItem-icon': {
                                                    color: '#E53935',
                                                },
                                            }}
                                        />
                                    )}
                                />
                            </div>

                            {filtersOpened && (
                                <div className={styles.modalOverlay}>
                                    <div className={styles.categoriesFilter}>
                                        <Image
                                            src="XButton.svg"
                                            className={styles.closeFilterButton}
                                            width={0}
                                            height={0}
                                            alt="image"
                                            onClick={() => { setFiltersOpened(false) }}
                                        />
                                        <hr></hr>
                                        <h2 onClick={() => { setSelectedCategory("all"); setFiltersOpened(false) }} className={`${styles.categoryItemFilter} ${selectedCategory === "all" ? styles.selectedCategoryFilter : ""}`}>All</h2>
                                        <hr></hr>
                                        {categories?.map((item) => (
                                            <>
                                                <div key={item.id} onClick={() => { setSelectedCategory(item); setFiltersOpened(false) }} className={`${styles.categoryItemFilter} ${selectedCategory.name === `${item.name}` ? styles.selectedCategoryFilter : ""}`}>
                                                    <h2>{item.name}</h2>
                                                </div>
                                                <hr></hr>
                                            </>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
            </div>
        </>
    )
}