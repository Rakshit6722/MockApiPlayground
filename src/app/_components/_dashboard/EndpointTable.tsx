import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import { Trash2, Edit, Play, Eye, Filter, Plus, X } from 'lucide-react';
import Form from '../_common/Form';
import { deleteMock, updateMock } from '@/app/_services/mockApi';
import DeletePopup from './DeletePopup';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/redux/store';
import { getMethodColor, getStatusColor, containerVariants, itemVariants } from '@/app/utils/dashboard';

type UserMock = {
  _id: string;
  userId: string;
  route: string;
  method: string;
  response: any;
  status: number;
  isArray: boolean;
  keyField: string;
}

type EndpointTableProps = {
  userMocks: UserMock[],
  openCreateModal?: () => void;
  handleChange: (action: string, data: any) => void;
}

function EndpointTable({ userMocks = [], openCreateModal, handleChange }: EndpointTableProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [selectedMock, setSelectedMock] = useState<any | null>(null);
  const [deletePopupOpen, setDeletePopupOpen] = useState(false);

  const username = useSelector((state: RootState) => state.user.userInfo.username);

  const router = useRouter()

  useEffect(() => {
    const editOpen = localStorage.getItem('editFormOpen') === 'true';
    const editId = localStorage.getItem('editMockId');
    if (userMocks.length > 0 && (editOpen && editId)) {
      const foundMock = userMocks.find(m => m._id === editId);
      if (foundMock) {
        setEditFormOpen(true);
        setSelectedMock({
          ...foundMock,
          responseBody: JSON.stringify(foundMock.response, null, 2)
        });
      }

      return () => {
        setEditFormOpen(false);
        setSelectedMock(null);
        localStorage.removeItem('editFormOpen');
        localStorage.removeItem('editMockId');
      }
    }
    const deleteOpen = localStorage.getItem('deletePopupOpen') === 'true';
    const deleteId = localStorage.getItem('deleteMockId');
    if (userMocks.length > 0 && (deleteOpen && deleteId)) {
      const foundMock = userMocks.find(m => m._id === deleteId);
      if (foundMock) {
        setDeletePopupOpen(true);
        setSelectedMock(foundMock);
      }
    }
  }, [userMocks]);

  const handleDelete = async () => {
    if (selectedMock._id) {
      try {
        const response = await deleteMock(selectedMock._id);
        if (response?.status !== 200) {
          throw new Error('Failed to delete mock');
        }
        handleChange('delete', selectedMock);
        setDeletePopupOpen(false);
        setSelectedMock(null);
      } catch (err: any) {
        console.error('Error deleting mock:', err);
      }
    }
  }

  const handleSubmit = async (data: any) => {
    try {
      const response = await updateMock(selectedMock?._id, data);
      if (response?.status !== 200) {
        throw new Error('Failed to update mock');
      }
      handleChange('update', response?.data?.mock)
      setEditFormOpen(false);
      setSelectedMock(null);
      localStorage.removeItem('editFormOpen');
      localStorage.removeItem('editMockId');
    } catch (err: any) {
      console.error('Error submitting form:', err);
    }
  }

  const handleEditOpen = (mock: any) => {
    setSelectedMock({
      ...mock,
      responseBody: JSON.stringify(mock.response, null, 2)
    });
    setEditFormOpen(true);
    localStorage.setItem('editFormOpen', 'true');
    localStorage.setItem('editMockId', mock._id);
  };

  const handleEditClose = () => {
    setEditFormOpen(false);
    setSelectedMock(null);
    localStorage.removeItem('editFormOpen');
    localStorage.removeItem('editMockId');
  };

  const handleDeleteOpen = (mock: any) => {
    setSelectedMock(mock);
    setDeletePopupOpen(true);
    localStorage.setItem('deletePopupOpen', 'true');
    localStorage.setItem('deleteMockId', mock._id);
  };

  const onCloseDeletePopup = () => {
    setDeletePopupOpen(false);
    setSelectedMock(null);
    localStorage.removeItem('deletePopupOpen');
    localStorage.removeItem('deleteMockId');
  };



  return (
    <div
      className="w-full overflow-hidden rounded-lg bg-gray-900 border border-gray-800 cursor-pointer">
      <div className="px-4 py-3 border-b border-gray-800 flex justify-between items-center">
        <h2 className="text-sm font-medium text-gray-200">API Endpoints</h2>
        <div className="flex gap-1">
          <button
            onClick={openCreateModal}
            className="p-1.5 rounded-md text-gray-400 hover:text-gray-200 hover:bg-gray-800 transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      <motion.div
        className="divide-y divide-gray-800"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {userMocks.length > 0 ? (
          // Existing mapping logic for userMocks
          userMocks.map((mock) => (
            <motion.div
              key={mock._id}
              className={`px-4 py-2.5 hover:bg-gray-800/50 transition-colors ${hoveredId === mock._id ? 'bg-gray-800/50' : ''}`}
              variants={itemVariants}
              onMouseEnter={() => setHoveredId(mock._id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => {
                router.push(`/dashboard/${mock.route}?id=${mock._id}`);
              }}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`border px-2 py-0.5 rounded text-xs font-medium ${getMethodColor(mock.method)}`}>
                    {mock.method}
                  </div>
                  <div className="font-mono text-xs text-gray-300 truncate">
                    {mock.route}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-xs">
                    {/* Status code indicator */}
                    <span className={`font-medium ${getStatusColor(mock.status)}`}>{mock.status}</span>

                    {/* Feature indicators - better aligned with fixed widths */}
                    <div className="flex items-center gap-2.5 ml-1">
                      {/* Array indicator */}
                      <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded font-mono text-[10px] min-w-[42px] ${mock.isArray
                        ? 'bg-blue-900/20 text-blue-400 border border-blue-800/30'
                        : 'bg-gray-800 text-gray-500'
                        }`}>
                        [ ]
                      </span>

                      {/* Key Field indicator */}
                      {mock.keyField && (
                        <span className="inline-flex items-center justify-center px-2 py-0.5 rounded font-mono text-[10px] bg-emerald-900/20 text-emerald-400 border border-emerald-800/30">
                          ?{mock.keyField}
                        </span>
                      )}
                    </div>
                  </div>

                  <motion.div
                    className="flex items-center gap-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredId === mock._id ? 1 : 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditOpen(mock);
                      }}
                      className="p-1 rounded-md text-gray-400 hover:text-gray-200 hover:bg-gray-700">
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteOpen(mock);
                      }}
                      className="p-1 rounded-md text-gray-400 hover:text-rose-300 hover:bg-rose-500/10">
                      <Trash2 size={14} />
                    </button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          // Empty state message inside the table
          <motion.div
            variants={itemVariants}
            className="py-10 text-center"
          >
            <h3 className="text-base font-medium text-gray-300 mb-2">No endpoints yet</h3>
            <p className="text-gray-400 text-sm mb-5 max-w-xs mx-auto">
              Create your first endpoint to start building your mock API
            </p>
            <button
              onClick={openCreateModal}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 text-sm rounded-md transition-colors flex items-center gap-2 mx-auto"
            >
              <Plus size={16} />
              <span>Create Endpoint</span>
            </button>
          </motion.div>
        )}
      </motion.div>

      <div className="px-4 py-2.5 border-t border-gray-800 flex justify-between items-center">
        <div className="text-xs text-gray-400">
          {userMocks.length} endpoint{userMocks.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Use React Portal to render the modal outside of the component hierarchy */}
      {editFormOpen && selectedMock && createPortal(
        <div className='fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
          <div className="bg-gray-900 border border-gray-800 rounded-lg shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-800 flex justify-between items-center">
              <h2 className="text-base font-medium text-gray-200">
                Edit Endpoint
              </h2>
              <button
                onClick={handleEditClose}
                className="text-gray-400 hover:text-gray-200 p-1 rounded-full hover:bg-gray-800"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form component */}
            <Form
              initialValues={selectedMock}
              onCancel={handleEditClose}
              onSubmit={handleSubmit}
              submitLabel='Update Endpoint'
              username={username || ''}
            />
          </div>
        </div>,
        document.body // This renders the modal directly to the body element
      )}

      {
        deletePopupOpen && selectedMock && createPortal(
          <DeletePopup handleDelete={handleDelete} onClose={onCloseDeletePopup} />,
          document.body
        )
      }
    </div>
  );
}

export default EndpointTable;
