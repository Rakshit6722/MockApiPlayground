import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

function ProtectedRoute({ children }: { children: React.ReactNode }) {

    const router = useRouter()

    const [isChecking, setIsChecking] = useState(true)


    useEffect(() => {

        const isLoggedIn = localStorage.getItem('token');

        if (!isLoggedIn) {
            router.push('/auth/login');
        } else {
            setIsChecking(false);
        }

    }, [router])

    if (isChecking) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-gray-800 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    return <>{children}</>;
}

export default ProtectedRoute
