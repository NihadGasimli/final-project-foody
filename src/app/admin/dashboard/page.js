"use client"

import { setPage } from "../../../features/infoSlice";
import { useDispatch } from "react-redux";
import styles from "./dashboard.module.css";
import BarChart from "../../../../components/BarChart";
import { useState } from "react";
export default function Admin() {

    const [b, setB] = useState([
        { "name": "Product A", "value": 10 },
        { "name": "Product B", "value": 20 },
        { "name": "Product C", "value": 30 }
    ]);

    function myau() {
        fetch("/api/products").then(
            response => response.json()
        ).then(
            result => {
                console.log(result)
                setB(result.result.data);
                console.log(b)
            }
        )
    }

    const dispatch = useDispatch();

    dispatch(setPage("dashboard"));

    return (
        <>
            <div className={styles.container}>
                <div className={styles.upperContainer}>
                    <div className={styles.upperLeftSide}>
                        <h1>Orders</h1>
                    </div>

                    <div className={styles.upperRightSide}>
                        <h1>Total Salary</h1>
                    </div>
                </div>

                <div className={styles.lowerContainer}>
                    <div className={styles.lowerLeftSide}>
                        <h1>Assigned Risks</h1>
                    </div>

                    <div className={styles.lowerRightSide}>
                        <h1>Assigned Action Items</h1>
                    </div>
                </div>
            </div>
        </>
    )
}