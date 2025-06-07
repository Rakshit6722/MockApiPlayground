import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Form, { EndpointFormValues } from '../_common/Form';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/redux/store';

type CreateEndpointProps = {
    isOpen: boolean;
    onClose: () => void;
    onSave: (endpoint: any) => void;
}

function CreateEndpoint({ isOpen, onClose, onSave }: CreateEndpointProps) {
 
    const usernameFromSlice = useSelector((state: RootState) => state.user.userInfo.username)

    const [username, setUsername] = useState<string>(usernameFromSlice || '');

    useEffect(() => {
        if (isOpen) {
            localStorage.setItem('createEndpointOpen', 'true');
        } else {
            localStorage.removeItem('createEndpointOpen');
        }
    }, [isOpen]);

    const handleSubmit = (values: EndpointFormValues) => {
        try {
            const endpoint = {
                method: 'GET',
                route: values.route,
                status: values.status,
                response: values.response,
                isArray: values.isArray,
                keyField: values.keyField,
                defaultLimit: 10
            };
            onSave(endpoint);
            onClose();
            localStorage.removeItem('createEndpointOpen');
        } catch (err) {
            console.error('Error creating endpoint:', err);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="bg-gray-900 border border-gray-800 rounded-lg shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh]"
                >
                    {/* Header - fixed */}
                    <div className="px-5 py-4 border-b border-gray-800 flex justify-between items-center">
                        <h2 className="text-base font-medium text-gray-200">
                            Create GET Endpoint
                        </h2>
                        <button
                            onClick={() => {
                                onClose();
                                localStorage.removeItem('createEndpointOpen');
                            }}
                            className="text-gray-400 hover:text-gray-200 p-1 rounded-full hover:bg-gray-800"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Form Component */}
                    <Form 
                        onSubmit={handleSubmit}
                        onCancel={() => {
                            onClose();
                            localStorage.removeItem('createEndpointOpen');
                        }}
                        submitLabel="Create Endpoint"
                        username={username}
                    />
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

export default CreateEndpoint;