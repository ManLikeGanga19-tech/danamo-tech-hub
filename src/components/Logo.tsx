'use client';

import Link from "next/link";
import React from "react";

type LogoProps = {
    className?: string;
};

export function Logo({ className = "" }: LogoProps) {
    return (
        <Link
            href="/"
            className={`text-xl font-bold tracking-tight text-blue-600 dark:text-blue-400 ${className}`}
        >
            Danamo<span className="text-black dark:text-white">Tech</span>
        </Link>
    );
}
