import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Copy, ChevronDown, ChevronRight, Code, AlertCircle } from 'lucide-react';

export type EndpointFormValues = {
    route: string;
    status: number;
    responseBody: string;
    delay: number;
    isArray: boolean;
    error: boolean;
    keyField: string;
    filterEnabled: boolean;
    paginationEnabled: boolean;
};

export type EndpointFormProps = {
    initialValues?: Partial<EndpointFormValues>;
    onSubmit: (values: EndpointFormValues) => void;
    onCancel: () => void;
    submitLabel?: string;
    username?: string;
};

const statusCodes = [
    { code: 200, text: 'OK' },
    { code: 404, text: 'Not Found' },
    { code: 500, text: 'Server Error' }
];

function Form({
    initialValues = {},
    onSubmit,
    onCancel,
    submitLabel = 'Create Endpoint',
    username = ''
}: EndpointFormProps) {
    // Form state
    const [route, setRoute] = useState(initialValues.route || '');
    const [status, setStatus] = useState(initialValues.status || 200);
    const [responseBody, setResponseBody] = useState(
        initialValues.responseBody || '{\n  "message": "Success"\n}'
    );
    const [delay, setDelay] = useState(initialValues.delay || 0);
    const [isArray, setIsArray] = useState(initialValues.isArray || false);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [error, setError] = useState(initialValues.error || false);
    const [keyField, setKeyField] = useState(initialValues.keyField || '');
    const [filterEnabled, setFilterEnabled] = useState(initialValues.filterEnabled || false);
    const [paginationEnabled, setPaginationEnabled] = useState(initialValues.paginationEnabled || false);
    
    // Validation state
    const [routeError, setRouteError] = useState('');
    const [jsonError, setJsonError] = useState('');

    // Update form fields if initialValues change (for edit mode)
    useEffect(() => {
        if (initialValues.route !== undefined) setRoute(initialValues.route);
        if (initialValues.status !== undefined) setStatus(initialValues.status);
        if (initialValues.responseBody !== undefined) setResponseBody(initialValues.responseBody);
        if (initialValues.delay !== undefined) setDelay(initialValues.delay);
        if (initialValues.isArray !== undefined) setIsArray(initialValues.isArray);
        if (initialValues.error !== undefined) setError(initialValues.error);
        if (initialValues.keyField !== undefined) setKeyField(initialValues.keyField);
        if (initialValues.filterEnabled !== undefined) setFilterEnabled(initialValues.filterEnabled);
        if (initialValues.paginationEnabled !== undefined) setPaginationEnabled(initialValues.paginationEnabled);

    }, [initialValues]);

    const validateForm = () => {
        let isValid = true;
        
        // Reset errors
        setRouteError('');
        setJsonError('');
        
        // Validate route
        if (!route.trim()) {
            setRouteError('Route is required');
            isValid = false;
        }
        
        // Validate JSON
        try {
            JSON.parse(isArray ? `[${responseBody}]` : responseBody);
        } catch (err) {
            setJsonError('Invalid JSON format');
            isValid = false;
        }
        
        return isValid;
    };

    const handleSubmit = () => {
        try {
            // Only validate for creation, not for editing
            if (Object.keys(initialValues).length === 0 && !validateForm()) {
                return;
            }
            
            // Submit form values
            onSubmit({
                route,
                status,
                response: JSON.parse(responseBody),
                delay,
                isArray,
                error,
                keyField,
                filterEnabled,
                paginationEnabled
            });
        } catch (err) {
            console.error('Error submitting form:', err);
        }
    };

    const getStatusColor = (code: number) => {
        if (code >= 200 && code < 300) return 'text-emerald-400';
        if (code >= 400 && code < 500) return 'text-amber-400';
        if (code >= 500) return 'text-rose-400';
        return 'text-gray-400';
    };

    const formatJson = () => {
        try {
            const parsed = JSON.parse(responseBody);
            setResponseBody(JSON.stringify(parsed, null, 2));
            setJsonError(''); // Clear error if formatting succeeds
        } catch (err) {
            setJsonError('Invalid JSON format');
        }
    };

    return (
        <>
            {/* Content - scrollable */}
            <div className="p-5 space-y-5 overflow-y-auto overflow-x-hidden
        [&::-webkit-scrollbar]:w-1.5
        [&::-webkit-scrollbar]:h-1.5
        [&::-webkit-scrollbar-track]:bg-gray-800/20
        [&::-webkit-scrollbar-track]:rounded-full
        [&::-webkit-scrollbar-thumb]:bg-gray-700
        [&::-webkit-scrollbar-thumb]:rounded-full
        [&::-webkit-scrollbar-thumb:hover]:bg-gray-600
        scrollbar-thin scrollbar-track-gray-800/20 scrollbar-thumb-gray-700">
                {/* Endpoint URL Builder */}
                <div>
                    <label className="block text-sm text-gray-300 mb-2 font-medium">
                        Endpoint URL <span className="text-rose-400">*</span>
                    </label>
                    <div className={`bg-gray-800/60 border ${routeError ? 'border-rose-500' : 'border-gray-700'} rounded-lg p-3`}>
                        <div className="flex items-center text-sm text-gray-300 font-mono">
                            <span className="text-gray-500">/api/mocks/{username}/</span>
                            <input
                                type="text"
                                value={route}
                                onChange={(e) => {
                                    setRoute(e.target.value);
                                    if (e.target.value.trim()) setRouteError('');
                                }}
                                placeholder="users"
                                className={`flex-1 bg-transparent border-none outline-none text-blue-400 placeholder-gray-600 ${routeError ? 'focus:ring-rose-500' : 'focus:ring-blue-500'}`}
                            />
                        </div>
                        {routeError && (
                            <div className="mt-2 flex items-center gap-1.5 text-xs text-rose-400">
                                <AlertCircle size={12} />
                                <span>{routeError}</span>
                            </div>
                        )}
                        <div className="mt-3 flex items-center justify-between text-xs">
                            <div className="flex items-center">
                                <span className="px-1.5 py-0.5 bg-blue-500/20 text-blue-400 rounded font-medium">GET</span>
                                <span className="ml-2 text-gray-400">Status:</span>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(parseInt(e.target.value))}
                                    className={`ml-1 bg-transparent border-none outline-none ${getStatusColor(status)}`}
                                >
                                    {statusCodes.map(s => (
                                        <option key={s.code} value={s.code} className="bg-gray-800 text-white">
                                            {s.code} - {s.text}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-center gap-1 text-gray-400">
                                <span>Delay:</span>
                                <input
                                    type="number"
                                    value={delay}
                                    onChange={(e) => setDelay(parseInt(e.target.value) || 0)}
                                    min={0}
                                    max={5000}
                                    className="w-16 bg-gray-700/50 border border-gray-700 rounded px-1 py-0.5 text-center"
                                />
                                <span>ms</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Response Body */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-sm text-gray-300 font-medium">
                            Response Body <span className="text-rose-400">*</span>
                        </label>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={formatJson}
                                className="text-xs text-gray-400 hover:text-gray-300 flex items-center gap-1"
                            >
                                <Code size={12} />
                                <span>Format</span>
                            </button>
                            <label className="flex items-center gap-1.5 text-xs text-gray-400">
                                <input
                                    type="checkbox"
                                    checked={isArray}
                                    onChange={(e) => setIsArray(e.target.checked)}
                                    className="w-3 h-3 bg-gray-700 border-gray-600 rounded"
                                />
                                <span>Return as array</span>
                            </label>
                        </div>
                    </div>

                    <div className="relative">
                        <textarea
                            value={responseBody}
                            onChange={(e) => {
                                setResponseBody(e.target.value);
                                setJsonError(''); // Clear error on change
                            }}
                            rows={8}
                            placeholder="Enter JSON response"
                            className={`w-full bg-gray-800/60 border ${jsonError ? 'border-rose-500' : 'border-gray-700'} rounded-lg p-3 text-sm text-gray-300 font-mono resize-none focus:outline-none focus:ring-1 ${jsonError ? 'focus:ring-rose-500' : 'focus:ring-blue-500'}`}
                        />
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(responseBody);
                            }}
                            className="absolute top-2 right-2 p-1 bg-gray-700/70 rounded text-gray-400 hover:text-gray-200"
                        >
                            <Copy size={12} />
                        </button>
                    </div>
                    
                    {jsonError ? (
                        <div className="mt-1 flex items-center gap-1.5 text-xs text-rose-400">
                            <AlertCircle size={12} />
                            <span>{jsonError}</span>
                        </div>
                    ) : (
                        <div className="mt-1 text-xs text-gray-500">
                            {isArray ? 'Response will be wrapped in an array' : 'Response will be returned as an object'}
                        </div>
                    )}
                </div>

                {/* Advanced Options Toggle */}
                <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-300"
                >
                    {showAdvanced ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    <span>Advanced Options</span>
                </button>

                {/* Advanced Options Panel - No validation needed here */}
                {showAdvanced && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-gray-800/40 border border-gray-800 rounded-lg p-4"
                    >
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={error}
                                        onChange={(e) => setError(e.target.checked)}
                                        className="w-3 h-3 bg-gray-700 border-gray-600 rounded"
                                    />
                                    <span className="text-xs text-gray-300">Simulate Error</span>
                                </label>

                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={filterEnabled}
                                        onChange={(e) => setFilterEnabled(e.target.checked)}
                                        className="w-3 h-3 bg-gray-700 border-gray-600 rounded"
                                    />
                                    <span className="text-xs text-gray-300">Enable Filtering</span>
                                </label>

                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={paginationEnabled}
                                        onChange={(e) => setPaginationEnabled(e.target.checked)}
                                        className="w-3 h-3 bg-gray-700 border-gray-600 rounded"
                                    />
                                    <span className="text-xs text-gray-300">Enable Pagination</span>
                                </label>
                            </div>

                            {/* Conditional Key Field input - only shown when filtering is enabled */}
                            {filterEnabled && (
                                <div>
                                    <label className="block text-xs text-gray-300 mb-1 font-medium">Key Field</label>
                                    <div className="flex flex-col space-y-1">
                                        <input
                                            type="text"
                                            value={keyField}
                                            onChange={(e) => setKeyField(e.target.value)}
                                            placeholder="id"
                                            className="w-full bg-gray-800/60 border border-gray-700 rounded-md px-3 py-2 text-xs text-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                        <p className="text-xs text-gray-500">
                                            Field name that will be used as identifier in query parameters (e.g., <span className="font-mono text-gray-400">?id=123</span> for filtering)
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Add explanation for pagination if enabled */}
                            {paginationEnabled && (
                                <div className="text-xs text-gray-500 pt-1">
                                    <p>Pagination will support query parameters:</p>
                                    <ul className="list-disc pl-4 pt-1 space-y-1">
                                        <li><span className="font-mono text-gray-400">?page=1</span> - Page number</li>
                                        <li><span className="font-mono text-gray-400">?limit=10</span> - Items per page</li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Footer - fixed */}
            <div className="px-5 py-4 border-t border-gray-800 flex justify-end gap-3 mt-auto">
                <button
                    onClick={onCancel}
                    className="px-4 py-2 text-sm text-gray-400 hover:text-gray-200 rounded-md"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
                >
                    {submitLabel}
                </button>
            </div>
        </>
    );
}

export default Form;
