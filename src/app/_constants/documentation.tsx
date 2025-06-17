import { BookOpen, ChevronRight, Shield } from "lucide-react";
import React from "react";

// Get the origin dynamically
const getOrigin = () => {
  return typeof window !== 'undefined' ? window.location.origin : 'https://yoursite.com';
};

// Navigation items for sidebar
export const navItems = [
  {
    id: "overview",
    label: "Overview",
    icon: <BookOpen size={16} />,
    href: "#overview",
    isActive: true,
  },
  {
    id: "basic-usage",
    label: "Basic Usage",
    icon: <ChevronRight size={16} />,
    href: "#basic-usage",
    isActive: false,
  },
  {
    id: "query-parameters",
    label: "Query Parameters",
    icon: <ChevronRight size={16} />,
    href: "#query-parameters",
    isActive: false,
  },
  {
    id: "examples",
    label: "Examples",
    icon: <ChevronRight size={16} />,
    href: "#examples",
    isActive: false,
  },
  {
    id: "authentication",
    label: "Authentication",
    icon: <Shield size={16} />,
    href: "#authentication",
    isActive: false,
  },
];

// Query parameters documentation
export const queryParameters = [
  {
    name: "id",
    description: "Filter by a specific item ID (requires setting a keyField on your endpoint)",
    example: "?id=1",
  },
  {
    name: "page",
    description: "Paginate array responses (use with limit)",
    example: "?page=1&limit=10",
  },
  {
    name: "_meta",
    description: "Include pagination metadata with response",
    example: "?_meta=true",
  },
  {
    name: "delay",
    description: "Simulate network delay in milliseconds",
    example: "?delay=2000",
  },
  {
    name: "error",
    description: "Force an error response to test error handling",
    example: "?error=true",
  },
];

// Authentication cards - update with correct endpoint information
export const authCards = [
  {
    title: "Signup",
    description: "Register new users with customizable fields and validation.",
    endpoint: "POST /api/mock-auth/{endpoint}/signup/{username}",
    iconType: "userPlus",
    bgColor: "green",
  },
  {
    title: "Login",
    description: "Authenticate users and receive JWT tokens.",
    endpoint: "POST /api/mock-auth/{endpoint}/login/{username}",
    iconType: "logIn",
    bgColor: "blue",
  },
  {
    title: "User Profile",
    description: "Retrieve authenticated user data.",
    endpoint: "GET /api/mock-auth/{userId}", // This is correct
    iconType: "user",
    bgColor: "purple",
  },
];

// Code examples
export const codeExamples = {
  // Basic code example
  basic: `// Making a GET request to your mock API
fetch('${getOrigin()}/api/mock/products')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    console.log('Products:', data);
    // Handle your data here
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });`,

  // Complex code example
  complex: `// Fetching paginated data with metadata
async function fetchPaginatedData(page = 1, limit = 10) {
  try {
    const response = await fetch(
      '${getOrigin()}/api/mock/products?page=1&limit=10&_meta=true'
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    
    const result = await response.json();
    
    // The result will include both data and metadata
    console.log('Items:', result.data);
    console.log('Metadata:', result.meta);
    
    // Example metadata structure:
    // {
    //   "totalItems": 100,
    //   "totalPages": 10,
    //   "currentPage": 1,
    //   "pageSize": 10
    // }
    
    return result;
  } catch (error) {
    console.error('Error:', error);
  }
}

// Usage
fetchPaginatedData();`,

  // Updated auth examples
  signup: `// Example signup request
// -----------------------------------------
// Replace {endpoint} with your auth endpoint name (e.g. 'users')
// Replace {username} with your MockFlow username

const signupUser = async () => {
  try {
    // 1. Set up the request URL and data
    const url = '${getOrigin()}/api/mock-auth/users/signup/johndoe';
    
    const userData = {
      username: 'newuser',
      email: 'newuser@example.com',
      password: 'securepassword123',
      firstName: 'New',
      lastName: 'User'
      // Add any other fields you've configured in your auth endpoint
    };

    // 2. Make the API request
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    // 3. Parse and handle the response
    const result = await response.json();
    
    if (result.success) {
      console.log('Signup successful!');
      console.log('User data:', result.data);
      
      // You may want to automatically log in the user
      return result.data;
    } else {
      console.error('Signup failed:', result.message);
    }
  } catch (error) {
    console.error('Error during signup:', error);
  }
};

// Call the function to register a user
signupUser();`,

  login: `// Example login request
// -----------------------------------------
// Replace {endpoint} with your auth endpoint name (e.g. 'users')
// Replace {username} with your MockFlow username

const loginUser = async () => {
  try {
    // 1. Set up the request URL and credentials
    const url = '${getOrigin()}/api/mock-auth/users/login/johndoe';
    
    const credentials = {
      email: 'user@example.com',
      password: 'securepassword123'
    };

    // 2. Make the API request
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });

    // 3. Parse and handle the response
    const result = await response.json();
    
    if (result.success) {
      // 4. Save the authentication token
      const token = result.data.token;
      localStorage.setItem('auth_token', token);
      
      // 5. Save the user ID for profile requests
      const userId = result.data.user.id;
      localStorage.setItem('user_id', userId);
      
      console.log('Login successful!');
      console.log('User:', result.data.user);
      
      return result.data;
    } else {
      console.error('Login failed:', result.message);
    }
  } catch (error) {
    console.error('Error during login:', error);
  }
};

// Call the function to log in
loginUser();`,

  profile: `// Example authenticated profile request
// -----------------------------------------
// The userId comes from the login response (stored in previous step)

const getUserProfile = async () => {
  try {
    // 1. Get the authentication token and user ID
    const token = localStorage.getItem('auth_token');
    const userId = localStorage.getItem('user_id');
    
    // Check if we have the required information
    if (!token || !userId) {
      console.error('Missing authentication info. Please log in first.');
      return;
    }

    // 2. Set up the request with authentication
    const url = '${getOrigin()}/api/mock-auth/' + userId;
    
    // 3. Make the authenticated request
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': \`Bearer \${token}\`
      }
    });

    // 4. Parse and handle the response
    const result = await response.json();
    
    if (result.success) {
      console.log('Profile retrieved successfully!');
      console.log('User profile:', result.data);
      
      // Now you can update your UI with the user's information
      return result.data;
    } else {
      console.error('Failed to get profile:', result.message);
    }
  } catch (error) {
    console.error('Error fetching profile:', error);
  }
};

// Call the function to get the user's profile
getUserProfile();`,

  // New example for creating auth endpoint
  authSetup: `// This is managed through the MockFlow dashboard UI
// Example schema for reference:
{
  "endpoint": "users",  // This becomes part of your auth URLs
  "fields": [
    {
      "name": "username",
      "type": "string",
      "required": true
    },
    {
      "name": "email",
      "type": "string",
      "required": true
    },
    {
      "name": "password",
      "type": "string",
      "required": true
    },
    {
      "name": "firstName",
      "type": "string",
      "required": false
    },
    {
      "name": "lastName",
      "type": "string",
      "required": false
    }
    // Add any other fields you need
  ]
}`,
};

// New auth flow explanation section
export const authFlowExplanation = {
  setup: `To use the authentication flows, you first need to create an auth endpoint through the dashboard. 
This defines the structure of your authentication data including field names, types, and validation rules.`,
  
  flowStructure: `MockFlow uses a flexible authentication system with these key components:
  
1. **Auth Endpoint**: The base configuration that defines your auth flow (fields, validation rules)
2. **User Storage**: Secure storage for mock users created through your auth endpoints 
3. **JWT Tokens**: Authentication tokens issued upon successful login
4. **Custom Fields**: Define exactly what fields you need for your auth forms`,
  
  endpointStructure: `The authentication URLs follow this pattern:
  
- Signup: POST /api/mock-auth/{endpoint}/signup/{username}
- Login: POST /api/mock-auth/{endpoint}/login/{username}
- Profile: GET /api/mock-auth/{userId}

Where:
- {endpoint} is the custom endpoint name you defined
- {username} is your MockFlow username
- {userId} is the ID of the mock user created through signup`,
  
  validationRules: `The authentication system validates:
  
1. Required fields: Ensures all required fields are provided
2. Type validation: Validates fields against their defined types (e.g., string, number)
3. Custom rules: Any additional validation rules you've configured in the dashboard`,
};