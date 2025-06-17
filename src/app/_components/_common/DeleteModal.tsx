import { AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { Trash2, X, Loader2 } from "lucide-react";

export function DeleteModal({
    open,
    onClose,
    onConfirm,
    loading,
}: {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading: boolean;
}) {
    return createPortal(
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="bg-gray-900 border border-gray-800 rounded-xl shadow-2xl w-full max-w-sm p-6 relative"
                        initial={{ scale: 0.92, opacity: 0, y: 40 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.92, opacity: 0, y: 40 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    >
                        <button
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-300"
                            onClick={onClose}
                            aria-label="Close"
                            type="button"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <h2 className="text-lg font-semibold text-gray-100 mb-2">Delete Endpoint?</h2>
                        <p className="text-gray-400 mb-6">
                            Are you sure you want to delete this mock auth endpoint? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-2">
                            <button
                                className="px-4 py-2 rounded bg-gray-800 text-gray-300 hover:bg-gray-700"
                                onClick={onClose}
                                disabled={loading}
                                type="button"
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 flex items-center gap-1 disabled:opacity-60"
                                onClick={onConfirm}
                                disabled={loading}
                                type="button"
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                Delete
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
}