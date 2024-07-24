import "@/app/global.css";

export const metadata = {
    title: "Admin | Foody",
    description: "Admin Panel for Foody App",
    icons: {
        icon: "/logoBlack.svg",

    }
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
