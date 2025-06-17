"use client";
import { useState, useEffect } from "react";
import { Loader2, Pencil, Trash2, X, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  getMockAuthRoutes,
  updateMockAuthRoute,
  deleteMockAuthRoute,
} from "@/app/_services/mock-auth";
import EditModal from "../_common/EditModal";
import { DeleteModal } from "../_common/DeleteModal";

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



export default function MockAuthTable() {
  const router = useRouter();
  const [mockAuths, setMockAuths] = useState<MockAuth[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [editMock, setEditMock] = useState<MockAuth | null>(null);

  useEffect(() => {
    const fetchMockAuths = async () => {
      try {
        setLoading(true);
        const response = await getMockAuthRoutes();
        const data = response.data;
        setMockAuths(data.data || []);
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMockAuths();
  }, []);

  const navigateToDetails = (id: string) => {
    router.push(`/dashboard/mock-auth/${id}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getEndpointType = (endpoint: string) => {
    if (endpoint.includes("/signup")) return "Signup";
    if (endpoint.includes("/login")) return "Login";
    if (endpoint.includes("/profile")) return "Profile";
    const parts = endpoint.split("/");
    return parts[parts.length - 1] || "Auth";
  };

  const getMethodColor = (endpoint: string) => {
    if (endpoint.includes("/signup") || endpoint.includes("/login")) {
      return "bg-green-900/30 text-green-400 border border-green-800/40";
    }
    if (endpoint.includes("/profile")) {
      return "bg-purple-900/30 text-purple-400 border border-purple-800/40";
    }
    return "bg-blue-900/30 text-blue-400 border border-blue-800/40";
  };

  const getMethodName = (endpoint: string) => {
    if (endpoint.includes("/signup") || endpoint.includes("/login")) {
      return "POST";
    }
    if (endpoint.includes("/profile")) {
      return "GET";
    }
    return "POST";
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deleteId) return;
    setModalLoading(true);
    try {
      await deleteMockAuthRoute(deleteId);
      setMockAuths((prev) => prev.filter((m) => m._id !== deleteId));
      setDeleteId(null);
    } catch (err: any) {
      alert(err.message || "Failed to delete endpoint");
    } finally {
      setModalLoading(false);
    }
  };

  // Handle edit open
  const handleEditOpen = (id: string) => {
    const found = mockAuths.find((m) => m._id === id) || null;
    setEditMock(found);
    setEditId(id);
  };

  // Handle edit submit
  const handleEditSubmit = async (data: { endpoint: string; fields: Field[] }) => {
    if (!editId) return;
    setModalLoading(true);
    try {
      await updateMockAuthRoute(editId, data);
      setMockAuths((prev) =>
        prev.map((m) =>
          m._id === editId ? { ...m, endpoint: data.endpoint, fields: data.fields } : m
        )
      );
      setEditId(null);
      setEditMock(null);
    } catch (err: any) {
      alert(err.message || "Failed to update endpoint");
    } finally {
      setModalLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
        <span className="ml-3 text-gray-400">Loading authentication routes...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-900/30 text-red-400 p-4 rounded-md">
        <p>Error: {error}</p>
        <p className="text-sm mt-2">Please try refreshing the page.</p>
      </div>
    );
  }

  if (mockAuths.length === 0) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-md p-8 text-center">
        <div className="text-gray-400 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto mb-3 opacity-30"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-300 mb-2">
            No Auth Routes Found
          </h3>
          <p className="max-w-md mx-auto">
            You haven't created any authentication routes yet. Create your first
            auth flow to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <DeleteModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={modalLoading}
      />
      <EditModal
        open={!!editId}
        onClose={() => {
          setEditId(null);
          setEditMock(null);
        }}
        onSubmit={handleEditSubmit}
        loading={modalLoading}
        mockAuth={editMock}
      />
      <div className="w-full overflow-hidden rounded-lg bg-gray-900 border border-gray-800">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-900/80">
                <th className="px-4 py-3 text-left font-semibold text-gray-300 tracking-wide">
                  Endpoint
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-300 tracking-wide">
                  Fields
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-300 tracking-wide">
                  Created
                </th>
                <th className="px-4 py-3 text-right font-semibold text-gray-300 tracking-wide">
                  {/* Actions */}
                </th>
              </tr>
            </thead>
            <tbody>
              {mockAuths.map((auth) => (
                <tr
                  key={auth._id}
                  className="group hover:bg-gray-800/70 transition-colors duration-200 cursor-pointer"
                  onClick={() => navigateToDetails(auth._id)}
                >
                  <td className="px-4 py-3 whitespace-nowrap align-middle">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${getMethodColor(
                          auth.endpoint
                        )}`}
                      >
                        {getMethodName(auth.endpoint)}
                      </span>
                      <span className="text-gray-100 font-medium">
                        {getEndpointType(auth.endpoint)}
                      </span>
                    </div>
                    <div className="mt-0.5 text-xs text-gray-400 font-mono truncate max-w-[220px]">
                      {auth.endpoint}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap align-middle">
                    <span className="text-gray-300">
                      {auth.fields.length} field{auth.fields.length !== 1 ? "s" : ""}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap align-middle">
                    <span className="text-gray-400">{formatDate(auth.createdAt)}</span>
                  </td>
                  <td
                    className="px-4 py-3 whitespace-nowrap text-right align-middle"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div
                      className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200"
                    >
                      <button
                        className="text-gray-400 cursor-pointer hover:text-indigo-400 transition-colors p-1.5 rounded-full hover:bg-gray-800"
                        title="Edit endpoint"
                        onClick={() => handleEditOpen(auth._id)}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        className="text-gray-400 cursor-pointer hover:text-red-400 transition-colors p-1.5 rounded-full hover:bg-gray-800"
                        title="Delete endpoint"
                        onClick={() => setDeleteId(auth._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}