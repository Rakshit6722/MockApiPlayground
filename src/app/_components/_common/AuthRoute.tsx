import React from 'react'

function AuthRoute({children}: {children: React.ReactNode}) {
    const isLoggedIn = typeof window !== 'undefined' && localStorage.getItem('token') !== null;

    if (isLoggedIn) {
        if (typeof window !== 'undefined') {
            window.location.href = '/dashboard';
        }
        return null;
    }

    return <>{children}</>;
}

export default AuthRoute
