import React from 'react'

function AuthRoute({ children }: { children: React.ReactNode }) {
    const isLoggedIn = typeof window !== 'undefined' && localStorage.getItem('mockFlow-token') !== null;

    if (isLoggedIn) {
        window.location.href = '/dashboard';
        return null
    }

    return <>{children}</>;
}

export default AuthRoute
