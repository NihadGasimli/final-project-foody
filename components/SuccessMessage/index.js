import { useState, useEffect } from 'react';
import styles from "./success.module.css" // Assuming you're using CSS modules

const SuccessMessage = ({ message }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
        }, 3000); // Hide after 3 seconds
        return () => clearTimeout(timer);
    }, []);

    return (
        visible && (
            <div className={styles.successMessage}>
                {message}
            </div>
        )
    );
};

export default SuccessMessage;
