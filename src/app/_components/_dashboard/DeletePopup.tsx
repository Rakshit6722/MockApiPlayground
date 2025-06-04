import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

type DeletePopupProps = {
  handleDelete: () => void;
  onClose: () => void;
}

function DeletePopup({ handleDelete, onClose }: DeletePopupProps) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="bg-gray-900 border border-gray-800 rounded-lg shadow-2xl w-full max-w-md"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-base font-medium text-gray-200 flex items-center gap-2">
            <AlertTriangle size={18} className="text-rose-400" />
            Confirm Deletion
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 p-1 rounded-full hover:bg-gray-800"
          >
            <X size={18} />
          </button>
        </div>
        
        {/* Content */}
        <div className="px-5 py-4">
          <p className="text-gray-300 text-sm mb-1">
            Are you sure you want to delete this endpoint?
          </p>
          <p className="text-gray-400 text-xs">
            This action cannot be undone. All data associated with this endpoint will be permanently removed.
          </p>
        </div>
        
        {/* Footer with buttons */}
        <div className="px-5 py-4 border-t border-gray-800 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-300 hover:text-gray-100 bg-gray-800 hover:bg-gray-700 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 text-sm text-rose-100 bg-rose-600 hover:bg-rose-700 rounded-md transition-colors focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default DeletePopup;
