'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary';
}

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
    const baseStyles =
        'px-4 py-2 rounded font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

    const variants = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
        secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400',
    };

    return <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props} />;
}
