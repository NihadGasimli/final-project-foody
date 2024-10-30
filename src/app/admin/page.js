"use client"

import { redirect } from "next/navigation";
export default function Admin() {
    const logged = sessionStorage.getItem("login");

    if (logged === "true") {
        redirect("/admin/dashboard")
    }
    else {
        redirect("/admin/login");
    }
}