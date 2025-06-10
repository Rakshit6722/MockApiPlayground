import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, ChevronDown, ChevronRight, Code, AlertCircle, Info, Sparkles, Loader, X } from 'lucide-react';
import axios from 'axios';

export type EndpointFormValues = {
    route: string;
    status: number;
    responseBody: string;
    response: any;
    isArray: boolean;
    keyField: string;
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
    // Form state - simplified
    const [route, setRoute] = useState(initialValues.route || '');
    const [status, setStatus] = useState(initialValues.status || 200);
    const [responseBody, setResponseBody] = useState(
        initialValues.responseBody || '{\n  "message": "Success"\n}'
    );
    const [isArray, setIsArray] = useState(initialValues.isArray || false);
    const [keyField, setKeyField] = useState(initialValues.keyField || 'id');
    const [showUsageGuide, setShowUsageGuide] = useState(false);
    
    // Validation state
    const [routeError, setRouteError] = useState('');
    const [jsonError, setJsonError] = useState('');
    
    // AI Generation state
    const [showAIGenerator, setShowAIGenerator] = useState(false);
    const [generatingData, setGeneratingData] = useState(false);
    const [dataType, setDataType] = useState('');
    const [dataLength, setDataLength] = useState(10);
    const [keyFields, setKeyFields] = useState('');
    const [generationError, setGenerationError] = useState('');

    // Add ref for scrolling to AI section
    const aiSectionRef = useRef<HTMLDivElement>(null);

    // Update form fields if initialValues change (for edit mode)
    useEffect(() => {
        if (initialValues.route !== undefined) setRoute(initialValues.route);
        if (initialValues.status !== undefined) setStatus(initialValues.status);
        if (initialValues.responseBody !== undefined) setResponseBody(initialValues.responseBody);
        if (initialValues.isArray !== undefined) setIsArray(initialValues.isArray);
        if (initialValues.keyField !== undefined) setKeyField(initialValues.keyField);
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

    // Update the handleSubmit function to prevent double-wrapping arrays
    const handleSubmit = () => {
        try {
            // Only validate for creation, not for editing
            if (Object.keys(initialValues).length === 0 && !validateForm()) {
                return;
            }
            
            // First parse the responseBody to see what we're working with
            let parsedResponse;
            try {
                parsedResponse = JSON.parse(responseBody);
            } catch (err) {
                // If parsing fails, try wrapping it in array brackets if that's what user wants
                if (isArray) {
                    try {
                        parsedResponse = JSON.parse(`[${responseBody}]`);
                    } catch (nestedErr) {
                        setJsonError('Invalid JSON format');
                        return;
                    }
                } else {
                    setJsonError('Invalid JSON format');
                    return;
                }
            }
            
            // Check if we need to wrap the response in an array
            // Only wrap if isArray is true AND the parsed content is not already an array
            const finalResponse = isArray && !Array.isArray(parsedResponse) 
                ? [parsedResponse] 
                : parsedResponse;
            
            // Submit form values with the correctly formatted response
            onSubmit({
                route,
                status,
                responseBody,
                response: finalResponse,
                isArray,
                keyField
            });
        } catch (err) {
            console.error('Error submitting form:', err);
            setJsonError('Error processing JSON data');
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
            setJsonError(''); 
        } catch (err) {
            setJsonError('Invalid JSON format');
        }
    };

       // const generateAIData = async () => {
    //     // Validate inputs
    //     if (!dataType.trim()) {
    //         setGenerationError('Please specify what type of data to generate');
    //         return;
    //     }
        
    //     setGeneratingData(true);
    //     setGenerationError('');
        
    //     try {
    //         // Build the prompt
    //         const prompt = `Generate a JSON ${isArray ? 'array' : 'object'} of ${dataLength} ${dataType} items.${
    //             keyFields.trim() ? ` Each item should include these fields: ${keyFields}.` : ''
    //         } Make the data realistic and varied. Format it as valid JSON and dont put it inside a key field, directly return the array or object.`;
            
    //         // Send to API
    //         const response = await axios.post('/api/generate-response', {
    //             prompt
    //         });
            
    //         // Improved response handling with better error reporting
    //         if (response.data) {
    //             // Log the entire response structure for debugging
    //             console.log('AI Response structure:', response.data);
                
    //             let jsonContent;
                
    //             if (response.data.response) {
    //                 jsonContent = response.data.response;
    //             } else if (response.data.data) {
    //                 jsonContent = response.data.data;
    //             } else if (response.data.content) {
    //                 jsonContent = response.data.content;
    //             } else if (response.data.result) {
    //                 jsonContent = response.data.result;
    //             } else if (typeof response.data === 'string') {
    //                 jsonContent = response.data;
    //             } else {
    //                 jsonContent = JSON.stringify(response.data);
    //             }
                
    //             try {
    //                 let cleanedResponse = jsonContent;
                    
    //                 if (typeof cleanedResponse === 'string') {
    //                     if (cleanedResponse.includes('```json')) {
    //                         cleanedResponse = cleanedResponse.split('```json')[1].split('```')[0].trim();
    //                     } else if (cleanedResponse.includes('```')) {
    //                         cleanedResponse = cleanedResponse.split('```')[1].split('```')[0].trim();
    //                     }
                        
    //                     cleanedResponse = cleanedResponse
    //                         .replace(/^Here's the JSON data:/i, '')
    //                         .replace(/^I've generated/i, '')
    //                         .replace(/^The generated/i, '')
    //                         .trim();
    //                 }
                    
    //                 let parsedJSON;
    //                 if (typeof cleanedResponse === 'string') {
    //                     parsedJSON = JSON.parse(cleanedResponse);
    //                 } else {
    //                     parsedJSON = cleanedResponse;
    //                 }
                    
    //                 setResponseBody(JSON.stringify(parsedJSON, null, 2));
    //                 setJsonError('');
                    
    //                 if (Array.isArray(parsedJSON)) {
    //                     setIsArray(true);
    //                 }
                    
    //                 setShowAIGenerator(false);
    //             } catch (parseError) {
    //                 console.error('Error parsing AI generated response:', parseError);
    //                 console.log('Raw response that failed to parse:', jsonContent);
    //                 setGenerationError('The AI generated invalid JSON. Please try again.');
    //             }
    //         } else {
    //             throw new Error('Empty response from AI generator');
    //         }
    //     } catch (err: any) {
    //         console.error('Error generating data with AI:', err);
    //         setGenerationError(
    //             `Failed to generate data: ${err.response?.data?.error || err.message || 'Unknown error'}. Please try again.`
    //         );
    //     } finally {
    //         setGeneratingData(false);
    //     }
    // };
    
    // Handle AI data generation
    // Update the generateAIData function to use Groq API directly
    const generateAIData = async () => {
        // Validate inputs
        if (!dataType.trim()) {
            setGenerationError('Please specify what type of data to generate');
            return;
        }
        
        setGeneratingData(true);
        setGenerationError('');
        
        try {
            // Ensure 'id' is always included in keyFields
            let fields = keyFields
                .split(',')
                .map(f => f.trim())
                .filter(f => f.length > 0);

            if (!fields.includes('id')) {
                fields.unshift('id');
            }

            // Build the system message to guide the AI
            const systemMessage = `You are a JSON data generator. Generate valid, well-formatted JSON data based on user requests. 
Always respond with properly formatted JSON only - no explanations, comments, or markdown formatting.`;

            // Build the prompt
            const userPrompt = `Generate a JSON ${isArray ? 'array' : 'object'} of ${dataLength} ${dataType} items.${
                fields.length > 0 ? ` Each item should include these fields: ${fields.join(', ')}.` : ''
            } Make the data realistic and varied. Format as valid JSON without any explanations or text - I need pure JSON only.`;
            
            console.log("api key", process.env.NEXT_PUBLIC_GROK_API_KEY);

            // Send request directly to Groq API
            const response = await axios.post(
                'https://api.groq.com/openai/v1/chat/completions',
                {
                    model: "meta-llama/llama-4-scout-17b-16e-instruct",
                    messages: [
                        { role: "system", content: systemMessage },
                        { role: "user", content: userPrompt }
                    ],
                    temperature: 0.7,
                    max_tokens: 4000
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GROK_API_KEY}`
                    }
                }
            );
            
            console.log('Groq API response:', response.data);
            
            if (response.data && response.data.choices && response.data.choices.length > 0) {
                const jsonContent = response.data.choices[0].message.content;
                
                try {
                    let cleanedResponse = jsonContent;
                    
                    // Clean up response if needed
                    if (typeof cleanedResponse === 'string') {
                        // Remove markdown code blocks if present
                        if (cleanedResponse.includes('```json')) {
                            cleanedResponse = cleanedResponse.split('```json')[1].split('```')[0].trim();
                        } else if (cleanedResponse.includes('```')) {
                            cleanedResponse = cleanedResponse.split('```')[1].split('```')[0].trim();
                        }
                        
                        // Remove common prefixes
                        cleanedResponse = cleanedResponse
                            .replace(/^Here's the JSON data:/i, '')
                            .replace(/^I've generated/i, '')
                            .replace(/^The generated/i, '')
                            .trim();
                    }
                    
                    // Parse the JSON
                    let parsedJSON;
                    try {
                        parsedJSON = JSON.parse(cleanedResponse);
                        console.log('Successfully parsed JSON');
                    } catch (initialParseError) {
                        // If parsing fails, try to repair common issues
                        console.log('Initial parsing failed, attempting to repair JSON');
                        
                        // Try to extract JSON from text
                        const jsonRegex = /(\{|\[)[\s\S]*(\}|\])/;
                        const match = cleanedResponse.match(jsonRegex);
                        
                        if (match) {
                            try {
                                parsedJSON = JSON.parse(match[0]);
                                console.log('Extracted and parsed JSON successfully');
                            } catch (extractError) {
                                throw new Error('Failed to parse extracted JSON');
                            }
                        } else {
                            throw new Error('Could not find valid JSON in response');
                        }
                    }
                    
                    // Update form with parsed JSON
                    setResponseBody(JSON.stringify(parsedJSON, null, 2));
                    setJsonError('');
                    
                    // Update isArray if needed
                    if (Array.isArray(parsedJSON)) {
                        setIsArray(true);
                    }
                    
                    // Close AI generator
                    setShowAIGenerator(false);
                } catch (parseError) {
                    console.error('Error parsing AI generated response:', parseError);
                    console.log('Raw response that failed to parse:', jsonContent);
                    
                    // More specific error message
                    setGenerationError(
                        'The AI generated invalid JSON. Try with fewer items or simpler data structure.'
                    );
                }
            } else {
                throw new Error('Invalid or empty response from AI service');
            }
        } catch (err: any) {
            console.error('Error generating data with AI:', err);
            
            // More detailed error reporting
            const errorMessage = err.response?.data?.error?.message || 
                                err.response?.data?.error || 
                                err.message || 
                                'Unknown error';
            
            setGenerationError(`Failed to generate data: ${errorMessage}. Please try again.`);
        } finally {
            setGeneratingData(false);
        }
    };

    // Add effect to scroll when AI generator is shown
    useEffect(() => {
        if (showAIGenerator && aiSectionRef.current) {
            // Wait for the animation to start before scrolling
            setTimeout(() => {
                aiSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    }, [showAIGenerator]);

    return (
        // Main container - fixed height with scrollable content
        <div className="flex flex-col h-screen max-h-[calc(100vh-4rem)]">
            {/* Scrollable content area */}
            <div className="flex-1 overflow-y-auto">
                <div className="p-5 space-y-5">
                    {/* Main form column - no longer using grid for horizontal layout */}
                    <div className="space-y-5">
                        {/* Endpoint URL Builder - No changes */}
                        <div className="bg-gray-800/30 p-5 rounded-lg border border-gray-700/50">
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
                                <div className="mt-3 flex items-center gap-3 text-xs">
                                    <span className="px-1.5 py-0.5 bg-blue-500/20 text-blue-400 rounded font-medium">GET</span>
                                    
                                    <div className="flex items-center">
                                        <span className="text-gray-400 mr-1">Status:</span>
                                        <select
                                            value={status}
                                            onChange={(e) => setStatus(parseInt(e.target.value))}
                                            className={`bg-transparent border-none outline-none ${getStatusColor(status)}`}
                                        >
                                            {statusCodes.map(s => (
                                                <option key={s.code} value={s.code} className="bg-gray-800 text-white">
                                                    {s.code} - {s.text}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    <div className="flex items-center gap-1.5">
                                        <input
                                            type="checkbox"
                                            id="returnAsArray"
                                            checked={isArray}
                                            onChange={(e) => setIsArray(e.target.checked)}
                                            className="w-3 h-3 bg-gray-700 border-gray-600 rounded"
                                        />
                                        <label htmlFor="returnAsArray" className="text-gray-400">Return as array</label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Response Body - No changes except for the Generate with AI button */}
                        <div className="bg-gray-800/30 p-5 rounded-lg border border-gray-700/50">
                            <div className="flex justify-between items-center mb-3">
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
                                    <button
                                        onClick={() => navigator.clipboard.writeText(responseBody)}
                                        className="text-xs text-gray-400 hover:text-gray-300 flex items-center gap-1"
                                    >
                                        <Copy size={12} />
                                        <span>Copy</span>
                                    </button>
                                    <button
                                        onClick={() => setShowAIGenerator(!showAIGenerator)}
                                        className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${
                                            showAIGenerator 
                                                ? 'bg-gray-700 text-gray-300' 
                                                : 'bg-purple-700 text-white'
                                        }`}
                                    >
                                        <Sparkles size={12} />
                                        <span>{showAIGenerator ? 'Hide AI' : 'Generate with AI'}</span>
                                    </button>
                                </div>
                            </div>

                            <textarea
                                value={responseBody}
                                onChange={(e) => {
                                    setResponseBody(e.target.value);
                                    setJsonError('');
                                }}
                                rows={10}
                                placeholder="Enter JSON response"
                                className={`w-full bg-gray-800/60 border ${jsonError ? 'border-rose-500' : 'border-gray-700'} rounded-lg p-3 text-sm text-gray-300 font-mono resize-none focus:outline-none focus:ring-1 ${jsonError ? 'focus:ring-rose-500' : 'focus:ring-blue-500'}`}
                            />
                            
                            {jsonError ? (
                                <div className="mt-2 flex items-center gap-1.5 text-xs text-rose-400">
                                    <AlertCircle size={12} />
                                    <span>{jsonError}</span>
                                </div>
                            ) : (
                                <div className="mt-2 text-xs text-gray-500">
                                    {isArray ? 'Response will be wrapped in an array' : 'Response will be returned as an object'}
                                </div>
                            )}
                        </div>

                        {/* AI Generator panel - now with improved vertical layout */}
                        <AnimatePresence>
                            {showAIGenerator && (
                                <motion.div
                                    ref={aiSectionRef}
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="bg-purple-900/10 border border-purple-900/20 rounded-lg overflow-hidden"
                                >
                                    <div className="p-4 border-b border-purple-900/20 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Sparkles size={16} className="text-purple-400" />
                                            <h3 className="text-sm font-medium text-gray-200">AI Generator</h3>
                                        </div>
                                        <button 
                                            onClick={() => setShowAIGenerator(false)}
                                            className="p-1 rounded-full hover:bg-gray-800/40 text-gray-400 hover:text-gray-200"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                    
                                    <div className="p-5 space-y-5">
                                        {generationError && (
                                            <div className="bg-rose-900/20 border border-rose-900/30 text-rose-400 px-4 py-3 rounded-md text-xs flex items-center gap-2 mb-4">
                                                <AlertCircle size={16} />
                                                <span>{generationError}</span>
                                            </div>
                                        )}
                                        
                                        {/* AI Generator content in vertical layout */}
                                        <div className="space-y-5">
                                            {/* Type of data field */}
                                            <div>
                                                <label className="block text-sm text-gray-300 mb-2 font-medium">
                                                    What data to generate? <span className="text-rose-400">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={dataType}
                                                    onChange={(e) => setDataType(e.target.value)}
                                                    placeholder="users, products, etc."
                                                    className="w-full bg-gray-800/60 border border-gray-700 rounded-md px-3 py-2.5 text-sm text-gray-300 focus:outline-none focus:ring-1 focus:ring-purple-500"
                                                />
                                                <p className="mt-1.5 text-xs text-gray-500">
                                                    Examples: user profiles, products, blog posts, transactions, comments
                                                </p>
                                            </div>
                                            
                                            {/* Data length */}
                                            <div>
                                                <label className="block text-sm text-gray-300 mb-2 font-medium">
                                                    How many items? <span className="text-rose-400">*</span>
                                                </label>
                                                <div className="flex items-center gap-3">
                                                    <input
                                                        type="range"
                                                        min="1"
                                                        max="50"
                                                        value={dataLength}
                                                        onChange={(e) => setDataLength(parseInt(e.target.value))}
                                                        className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                                                    />
                                                    <div className="w-12 bg-gray-800/60 border border-gray-700 rounded-md px-2 py-1 text-sm text-purple-400 text-center">
                                                        {dataLength}
                                                    </div>
                                                </div>
                                                <p className="mt-1.5 text-xs text-gray-500">
                                                    Number of items the AI will generate
                                                </p>
                                            </div>
                                            
                                            {/* Key fields */}
                                            <div>
                                                <label className="block text-sm text-gray-300 mb-2 font-medium">
                                                    Key fields (optional)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={keyFields}
                                                    onChange={(e) => setKeyFields(e.target.value)}
                                                    placeholder="id, name, email, etc."
                                                    className="w-full bg-gray-800/60 border border-gray-700 rounded-md px-3 py-2.5 text-sm text-gray-300 focus:outline-none focus:ring-1 focus:ring-purple-500"
                                                />
                                                <p className="mt-1.5 text-xs text-gray-500">
                                                    Comma-separated list of fields each item should include
                                                </p>
                                            </div>
                                        </div>
                                        
                                        {/* Preview of what will be generated */}
                                        <div className="bg-gray-800/40 rounded-md p-3 border border-gray-700/50">
                                            <p className="text-xs text-gray-400 mb-2">
                                                <Info size={12} className="inline mr-1" /> 
                                                The AI will generate {isArray ? "an array" : "an object"} with {dataLength} {dataType || "items"}.
                                            </p>
                                            <pre className="text-xs text-gray-500 font-mono overflow-x-auto p-2 bg-gray-900/30 rounded">
{`// Example of what will be generated
${isArray ? '[' : '{'}
  ${keyFields ? keyFields.split(',').map(f => `"${f.trim()}": "..."`).join(',\n  ') : '"id": "...",\n  "name": "..."'}
${isArray ? '},' : ','}
  // ... more items
${isArray ? ']' : '}'}`}
                                            </pre>
                                        </div>
                                        
                                        {/* Generate button */}
                                        <div className="pt-2">
                                            <button
                                                onClick={generateAIData}
                                                disabled={generatingData || !dataType.trim()}
                                                className={`w-full flex items-center justify-center gap-2 py-3 rounded-md text-sm font-medium transition-colors ${
                                                    generatingData || !dataType.trim()
                                                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                                        : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'
                                                }`}
                                            >
                                                {generatingData ? (
                                                    <>
                                                        <Loader size={16} className="animate-spin" />
                                                        <span>Generating...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Sparkles size={16} />
                                                        <span>Generate Data</span>
                                                    </>
                                                )}
                                            </button>
                                            
                                            {/* New info message during generation */}
                                            {generatingData && (
                                                <div className="mt-3 bg-blue-900/20 border border-blue-900/30 text-blue-300 px-3 py-2 rounded-md text-xs flex items-center gap-2">
                                                    <Info size={14} />
                                                    <span>
                                                        Generating {dataLength} items may take a moment. 
                                                        The more items requested, the longer it takes. Please be patient.
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Key Field - No changes */}
                        <div className="bg-gray-800/30 p-5 rounded-lg border border-gray-700/50">
                            <label className="block text-sm text-gray-300 mb-2 font-medium">
                                Key Field
                            </label>
                            <div>
                                <input
                                    type="text"
                                    value={keyField}
                                    onChange={(e) => setKeyField(e.target.value)}
                                    placeholder="id"
                                    className="w-full md:w-1/2 bg-gray-800/60 border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    Field name used for filtering (e.g., <span className="font-mono text-gray-400">?{keyField || 'id'}=123</span>)
                                </p>
                            </div>
                            
                            <div className="mt-4">
                                <button
                                    onClick={() => setShowUsageGuide(!showUsageGuide)}
                                    className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-300"
                                >
                                    {showUsageGuide ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                    <span>Show query parameters usage guide</span>
                                </button>
                                
                                {showUsageGuide && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mt-3 bg-gray-800/40 border border-gray-800 rounded-lg p-3"
                                    >
                                        {/* Usage guide content */}
                                        <div className="text-xs text-gray-400">
                                            <div className="mb-2">
                                                <span className="text-gray-300 font-medium">Filtering:</span> <code className="px-1 py-0.5 bg-gray-700 rounded text-amber-400">?{keyField || 'id'}=value</code>
                                            </div>
                                            <div>
                                                <span className="text-gray-300 font-medium">Pagination:</span> <code className="px-1 py-0.5 bg-gray-700 rounded text-amber-400">?page=1&limit=10</code>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Fixed footer */}
            <div className="px-5 py-4 border-t border-gray-800 flex justify-end gap-3 bg-gray-900 sticky bottom-0">
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
        </div>
    );
}

export default Form;
