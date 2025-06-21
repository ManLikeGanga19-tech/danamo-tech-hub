import React from 'react'

function Spinner() {
    return (

        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-gray-100 to-white dark:from-[#0e0e15] dark:to-[#1E1E2F]">
            <div className="relative flex items-center justify-center">
                <div className="absolute h-16 w-16 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                <div className="h-12 w-12 animate-pulse rounded-full bg-blue-600/20"></div>
            </div>
        </div>
    )
}

export default Spinner