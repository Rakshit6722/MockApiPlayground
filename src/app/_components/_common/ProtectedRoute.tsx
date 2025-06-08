import { useRouter } from 'next/navigation';
import React from 'react'

function ProtectedRoute({ children }: { children: React.ReactNode }) {

    const router = useRouter()

    const isLoggedIn = typeof window !== 'undefined' && localStorage.getItem('token') !== null;

    if (!isLoggedIn) {
        if (typeof window !== 'undefined') {
            router.push('/auth/login');
        }
        return null;
    }

    return <>{children}</>;
}

export default ProtectedRoute
