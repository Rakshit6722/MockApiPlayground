"use client";
import { useState, useEffect } from "react";
import { Shield, X, Plus, ChevronRight, ChevronLeft, Loader2, Check, Trash } from "lucide-react";
import { createMockAuthRoute } from "@/app/_services/mock-auth";
import { toast } from "react-toastify";
import { createPortal } from "react-dom";

type FieldType = {
  name: string;
  type: string;
  required: boolean;
};

const FIELD_TEMPLATES = [
  {
    name: "Basic Profile",
    fields: [
      { name: "name", type: "string", required: true },
      { name: "avatar", type: "string", required: false }
    ]
  },
  {
    name: "Contact Details",
    fields: [
      { name: "firstName", type: "string", required: true },
      { name: "lastName", type: "string", required: true },
      { name: "phoneNumber", type: "string", required: false }
    ]
  }
];

export default function MockAuthFlowButton() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [fields, setFields] = useState<FieldType[]>([
    { name: "email", type: "string", required: true },
    { name: "password", type: "string", required: true },
  ]);
  const [newField, setNewField] = useState<FieldType>({ name: "", type: "string", required: false });
  const [endpointName, setEndpointName] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setStep(1);
        setEndpointName("");
        setFields([
          { name: "email", type: "string", required: true },
          { name: "password", type: "string", required: true },
        ]);
        setSuccess(false);
        setError("");
      }, 200);
    }
  }, [open]);

  const handleAddField = () => {
    if (!newField.name) return;
    if (fields.some(f => f.name === newField.name)) {
      setError("Field name already exists");
      return;
    }
    
    setFields([...fields, newField]);
    setNewField({ name: "", type: "string", required: false });
    setError("");
  };

  const handleRemoveField = (index: number) => {
    if (index < 2) return; // Don't remove email/password
    const newFields = [...fields];
    newFields.splice(index, 1);
    setFields(newFields);
  };

  const addTemplate = (templateIndex: number) => {
    const template = FIELD_TEMPLATES[templateIndex];
    const newFields = template.fields.filter(
      t => !fields.some(f => f.name === t.name)
    );
    setFields([...fields, ...newFields]);
  };

  const handleSubmit = async () => {
    if (!endpointName) {
      setError("Endpoint name is required");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const response = await createMockAuthRoute({endpoint: endpointName, fields})
      if(response?.status !== 201) {
        throw new Error(response?.data?.message || 'Failed to create auth flow');
      }
      setSuccess(true);
      toast.success("Authentication flow created successfully!");
      setTimeout(() => setOpen(false), 2000);
    } catch (err: any) {
      toast.error(err.message || 'Failed to create authentication flow');
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Modal component that will be rendered in the portal
  const Modal = () => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-2xl flex flex-col relative overflow-hidden"
        style={{ maxHeight: 'calc(100vh - 40px)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors z-10"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="px-8 pt-8 pb-0">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-3">
            <Shield size={22} className="text-indigo-500" />
            Create Authentication Flow
          </h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm">
            Set up authentication endpoints for your API in a few simple steps.
          </p>
        </div>

        {/* Steps Indicator */}
        <div className="px-8 pt-6">
          <div className="flex items-center w-full max-w-md mx-auto">
            <div className="relative flex items-center justify-center w-10 h-10">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 ring-2 ring-indigo-500' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500'}`}>
                1
              </div>
              <div className={`absolute w-5 h-5 rounded-full flex items-center justify-center ${step > 1 ? 'bg-indigo-500 text-white' : 'hidden'} -top-1 -right-1 text-xs shadow-sm`}>
                <Check size={12} />
              </div>
            </div>

            <div className={`h-0.5 flex-1 ${step > 1 ? 'bg-indigo-500' : 'bg-gray-200 dark:bg-gray-700'}`}></div>

            <div className="relative flex items-center justify-center w-10 h-10">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 ring-2 ring-indigo-500' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500'}`}>
                2
              </div>
              <div className={`absolute w-5 h-5 rounded-full flex items-center justify-center ${step > 2 ? 'bg-indigo-500 text-white' : 'hidden'} -top-1 -right-1 text-xs shadow-sm`}>
                <Check size={12} />
              </div>
            </div>

            <div className={`h-0.5 flex-1 ${step > 2 ? 'bg-indigo-500' : 'bg-gray-200 dark:bg-gray-700'}`}></div>

            <div className="flex items-center justify-center w-10 h-10">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 ring-2 ring-indigo-500' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500'}`}>
                3
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="overflow-y-auto py-6 px-8 flex-1 mt-2">
          {/* Step 1: Configure Endpoint */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Endpoint Configuration
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Endpoint Name
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-sm">
                        /api/mock-auth/
                      </span>
                      <input
                        type="text"
                        value={endpointName}
                        onChange={(e) => setEndpointName(e.target.value)}
                        placeholder="my-auth"
                        className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-indigo-500 focus:border-indigo-500 text-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                      />
                    </div>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Use lowercase letters, numbers, hyphens, and underscores
                    </p>
                  </div>
                  
                  {endpointName && (
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-800">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Your authentication endpoints will be:
                      </h4>
                      <ul className="space-y-2 text-sm font-mono">
                        <li className="flex items-center gap-2">
                          <span className="px-2 py-1 rounded-md bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs">POST</span>
                          <span className="text-gray-600 dark:text-gray-400">/api/mock-auth/{endpointName}/signup</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="px-2 py-1 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-xs">POST</span>
                          <span className="text-gray-600 dark:text-gray-400">/api/mock-auth/{endpointName}/login</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="px-2 py-1 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-xs">POST</span>
                          <span className="text-gray-600 dark:text-gray-400">/api/mock-auth/{endpointName}/logout</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="px-2 py-1 rounded-md bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 text-xs">GET</span>
                          <span className="text-gray-600 dark:text-gray-400">/api/mock-auth/{endpointName}/:userId</span>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Configure Fields */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  User Fields
                </h3>
                
                <div className="mb-5 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 rounded-md text-sm text-blue-800 dark:text-blue-300">
                  Email and password fields are required and cannot be removed.
                </div>
                
                {/* Templates */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Add field templates
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {FIELD_TEMPLATES.map((template, index) => (
                      <button
                        key={index}
                        onClick={() => addTemplate(index)}
                        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-sm transition-colors"
                      >
                        + {template.name}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Field List */}
                <div className="space-y-2 mb-6">
                  {fields.map((field, index) => (
                    <div 
                      key={index} 
                      className={`flex items-center gap-2 p-3 rounded-md ${
                        index < 2 
                          ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30' 
                          : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <div className="flex-1 flex items-center gap-2">
                        <span className="font-medium text-gray-900 dark:text-white">{field.name}</span>
                        <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-400 text-xs">
                          {field.type}
                        </span>
                        {field.required && (
                          <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 rounded text-indigo-700 dark:text-indigo-300 text-xs">
                            required
                          </span>
                        )}
                      </div>
                      
                      {index >= 2 && (
                        <button 
                          onClick={() => handleRemoveField(index)}
                          className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <Trash size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Add New Field */}
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-800">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Add New Field
                  </h4>
                  
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <input
                      type="text"
                      placeholder="Field name"
                      value={newField.name}
                      onChange={(e) => setNewField({...newField, name: e.target.value})}
                      className="col-span-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    
                    <select
                      value={newField.type}
                      onChange={(e) => setNewField({...newField, type: e.target.value})}
                      className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="string">string</option>
                      <option value="number">number</option>
                      <option value="boolean">boolean</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center mb-4">
                    <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newField.required}
                        onChange={(e) => setNewField({...newField, required: e.target.checked})}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      Required field
                    </label>
                  </div>
                  
                  {error && (
                    <div className="mb-3 text-sm text-red-600 dark:text-red-400">
                      {error}
                    </div>
                  )}
                  
                  <button
                    onClick={handleAddField}
                    className="w-full flex items-center justify-center gap-1.5 bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:hover:bg-indigo-800/50 text-indigo-700 dark:text-indigo-300 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    <Plus size={16} />
                    Add Field
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Review & Create */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Review Your Auth Flow
                </h3>
                
                <div className="space-y-4">
                  {/* Endpoint Summary */}
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Endpoints</h4>
                    <ul className="space-y-2 text-sm font-mono">
                      <li className="flex items-center gap-2">
                        <span className="px-2 py-1 rounded-md bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs">POST</span>
                        <span className="text-gray-600 dark:text-gray-400">/api/mock-auth/{endpointName}/signup</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="px-2 py-1 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-xs">POST</span>
                        <span className="text-gray-600 dark:text-gray-400">/api/mock-auth/{endpointName}/login</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="px-2 py-1 rounded-md bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 text-xs">GET</span>
                        <span className="text-gray-600 dark:text-gray-400">/api/mock-auth/{endpointName}/profile</span>
                      </li>
                    </ul>
                  </div>
                  
                  {/* Fields Summary */}
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      User Fields ({fields.length})
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      {fields.map((field, index) => (
                        <div key={index} className="flex items-center gap-1.5">
                          <span className="text-gray-800 dark:text-gray-200 text-sm">{field.name}:</span>
                          <span className="text-gray-500 dark:text-gray-400 text-sm">{field.type}</span>
                          {field.required && (
                            <span className="text-xs px-1.5 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 rounded text-indigo-700 dark:text-indigo-300">req</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-md text-sm text-red-800 dark:text-red-300">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30 rounded-md text-sm text-green-800 dark:text-green-300 flex items-center gap-2">
                  <Check size={16} className="flex-shrink-0" />
                  <span>Auth flow created successfully!</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <div>
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                <ChevronLeft size={16} className="mr-1.5" />
                Back
              </button>
            )}
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => setOpen(false)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Cancel
            </button>
            
            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={step === 1 && !endpointName}
                className={`inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${
                  step === 1 && !endpointName 
                    ? 'bg-indigo-400 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                Next
                <ChevronRight size={16} className="ml-1.5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading || success || !endpointName}
                className={`inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${
                  loading || success || !endpointName
                    ? 'bg-indigo-400 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="mr-1.5 animate-spin" />
                    Creating...
                  </>
                ) : success ? (
                  <>
                    <Check size={16} className="mr-1.5" />
                    Created!
                  </>
                ) : (
                  "Create Auth Flow"
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-md font-medium text-sm transition-colors"
      >
        <Shield size={16} className="text-indigo-200" />
        Create Auth Flow
      </button>

      {/* Render the modal using a portal if 'open' is true and the component is mounted */}
      {open && mounted && createPortal(<Modal />, document.body)}
    </>
  );
}