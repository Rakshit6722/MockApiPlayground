"use client";
import { useState, useEffect, useRef } from "react";
import { Shield, X, Plus, ChevronRight, ChevronLeft, Loader2, Check, Trash } from "lucide-react";
import { createMockAuthRoute } from "@/app/_services/mock-auth";
import { toast } from "react-toastify";

export default function MockAuthFlowButton({setOpen}: any) {
 
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-md font-medium text-sm transition-colors"
      >
        <Shield size={16} className="text-indigo-200" />
        Create Auth Flow
      </button>

      {/* Modal without portal */}

    </>
  );
}