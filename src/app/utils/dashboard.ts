export const getMethodColor = (method: string) => {
    switch (method.toUpperCase()) {
        case 'GET': return 'text-blue-400 border-blue-400';
        case 'POST': return 'text-emerald-400 border-emerald-400';
        case 'PUT': return 'text-amber-400 border-amber-400';
        case 'PATCH': return 'text-orange-400 border-orange-400';
        case 'DELETE': return 'text-rose-400 border-rose-400';
        default: return 'text-gray-400 border-gray-400';
    }
};

export const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'text-emerald-400';
    if (status >= 300 && status < 400) return 'text-blue-400';
    if (status >= 400 && status < 500) return 'text-amber-400';
    if (status >= 500) return 'text-rose-400';
    return 'text-gray-400';
};

export const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05
        }
    }
};

export const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: 'spring', stiffness: 200, damping: 20 }
    }
};