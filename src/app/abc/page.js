"use client"

import en from "../../../locales/en.json";
import az from "../../../locales/az.json";
import { usePathname } from 'next/navigation';

export default function Abc({ locale }) {
    const pathname = usePathname();

    const langMatch = pathname.match(/^\/([a-z]{2})\//);
    const language = langMatch ? langMatch[1] : 'default';

    const translations = language === 'az' ? az : en;

    return (
        <>
            <h1>{translations.hello}</h1>
            <br></br>
            <h2>Locale: {language}</h2>
        </>
    );
}
