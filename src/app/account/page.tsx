'use client'

import React from "react";
import UserAddressCard from "@/components/user-profile/UserAddressCard";
import UserInfoCard from "@/components/user-profile/UserInfoCard";
import UserMetaCard from "@/components/user-profile/UserMetaCard";
import { Navbar1 } from "@/components/navbar/Navbar";
import Footer from "@/components/Footer/Footer";

export default function Profile() {
    return (
        <div className="bg-background text-foreground min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-100 dark:from-[#1E1E2F] dark:to-[#0e0e15] ">
            <Navbar1 />
            <section className="border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6 bg-gradient-to-b from-white to-gray-100 dark:from-[#1E1E2F] dark:to-[#0e0e15]">
                <h3 className="mb-5 text-lg font-semibold text-blue-600 dark:text-blue-400 lg:mb-7">
                    Profile
                </h3>
                <div className="space-y-6">
                    <UserMetaCard />
                    <UserInfoCard />
                    <UserAddressCard />
                </div>
            </section>
            <Footer/>
        </div>
    );
}
