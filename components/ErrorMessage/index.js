import { useState, useEffect } from 'react';
import styles from "./error.module.css" // Assuming you're using CSS modules

const ErrorMessage = ({ message }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
        }, 3000); // Hide after 3 seconds
        return () => clearTimeout(timer);
    }, []);

    return (
        visible && (
            <div className={styles.errorMessage}>
                {message}
            </div>
        )
    );
};

export default ErrorMessage;
