import { Check, Loader2, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

interface Field {
    name: string;
    type: string;
    required: boolean;
}

interface MockAuth {
    _id: string;
    userId: string;
    endpoint: string;
    fields: Field[];
    createdAt: string;
    updatedAt: string;
}



export default function EditModal({
    open,
    onClose,
    onSubmit,
    loading,
    mockAuth,
}: {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: { endpoint: string; fields: Field[] }) => void;
    loading: boolean;
    mockAuth: MockAuth | null;
}) {
    const [endpoint, setEndpoint] = useState("");
    const [fields, setFields] = useState<Field[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (mockAuth) {
            setEndpoint(mockAuth.endpoint);
            setFields(mockAuth.fields.map(f => ({ ...f })));
            setError(null);
        }
    }, [mockAuth, open]);

    const handleFieldChange = (idx: number, key: keyof Field, value: any) => {
        setFields(fields =>
            fields.map((f, i) => (i === idx ? { ...f, [key]: value } : f))
        );
    };

    const handleAddField = () => {
        setFields(fields => [...fields, { name: "", type: "string", required: false }]);
    };

    const handleRemoveField = (idx: number) => {
        setFields(fields => fields.filter((_, i) => i !== idx));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!endpoint.trim()) {
            setError("Endpoint is required.");
            return;
        }
        if (fields.some(f => !f.name.trim())) {
            setError("All field names are required.");
            return;
        }
        setError(null);
        onSubmit({ endpoint, fields });
    };

    return createPortal(
        <AnimatePresence>
            {open && mockAuth && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.form
                        className="bg-gray-900 border border-gray-800 rounded-xl shadow-2xl w-full max-w-lg p-6 relative"
                        initial={{ scale: 0.92, opacity: 0, y: 40 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.92, opacity: 0, y: 40 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        onSubmit={handleSubmit}
                    >
                        <button
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-300"
                            onClick={onClose}
                            type="button"
                            aria-label="Close"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <h2 className="text-lg font-semibold text-gray-100 mb-4">Edit Mock Auth Endpoint</h2>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Endpoint
                            </label>
                            <input
                                className="w-full px-3 py-2 border border-gray-700 bg-gray-800 text-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={endpoint}
                                onChange={e => setEndpoint(e.target.value)}
                                disabled={loading}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Fields
                            </label>
                            <div
                                className="space-y-3 max-h-56 overflow-y-auto pr-1"
                                style={{ scrollbarGutter: "stable" }}
                            >
                                {fields.map((field, idx) => (
                                    <div key={idx} className="flex gap-2 items-center">
                                        <input
                                            className="flex-1 px-2 py-1 border border-gray-700 bg-gray-800 text-gray-100 rounded"
                                            placeholder="Field name"
                                            value={field.name}
                                            onChange={e => handleFieldChange(idx, "name", e.target.value)}
                                            disabled={loading}
                                            required
                                        />
                                        <select
                                            className="px-2 py-1 border border-gray-700 bg-gray-800 text-gray-100 rounded"
                                            value={field.type}
                                            onChange={e => handleFieldChange(idx, "type", e.target.value)}
                                            disabled={loading}
                                        >
                                            <option value="string">string</option>
                                            <option value="number">number</option>
                                            <option value="boolean">boolean</option>
                                        </select>
                                        <label className="flex items-center gap-1 text-xs text-gray-400">
                                            <input
                                                type="checkbox"
                                                checked={field.required}
                                                onChange={e => handleFieldChange(idx, "required", e.target.checked)}
                                                disabled={loading}
                                            />
                                            Required
                                        </label>
                                        <button
                                            type="button"
                                            className="text-gray-500 hover:text-red-500"
                                            onClick={() => handleRemoveField(idx)}
                                            disabled={loading}
                                            aria-label="Remove field"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <button
                                type="button"
                                className="mt-3 px-3 py-1 rounded bg-gray-800 text-gray-200 hover:bg-gray-700 text-sm"
                                onClick={handleAddField}
                                disabled={loading}
                            >
                                Add Field
                            </button>
                        </div>
                        {error && <div className="text-red-500 text-sm mt-3">{error}</div>}
                        <div className="flex justify-end gap-2 mt-6">
                            <button
                                type="button"
                                className="px-4 py-2 rounded bg-gray-800 text-gray-300 hover:bg-gray-700"
                                onClick={onClose}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-1 disabled:opacity-60"
                                disabled={loading}
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                Save
                            </button>
                        </div>
                    </motion.form>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
}