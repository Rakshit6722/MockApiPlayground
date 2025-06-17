// All example code snippets and endpoint patterns for quick reference

const getOrigin = () =>
  (typeof window !== "undefined" ? window.location.origin : "https://yourdomain.com");

// Example: Create a mock API endpoint
export const createMockExample = `// Create a new mock endpoint
fetch('${getOrigin()}/api/mock', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-user-id': '<your-user-id>'
  },
  body: JSON.stringify({
    route: 'products',
    method: 'GET',
    response: [{ id: 1, name: 'Sample Product' }],
    isArray: true,
    keyField: 'id'
  })
})
  .then(res => res.json())
  .then(data => console.log('Created:', data));
`;

// Example: Get all mocks for a user
export const getAllMocksExample = `// Get all your mock endpoints
fetch('${getOrigin()}/api/mock', {
  headers: { 'x-user-id': '<your-user-id>' }
})
  .then(res => res.json())
  .then(data => console.log('Your mocks:', data));
`;

// Example: Use a mock endpoint (public)
export const useMockExample = `// Fetch data from your public mock endpoint
fetch('${getOrigin()}/api/mocks/<username>/products')
  .then(res => res.json())
  .then(data => console.log('Mock data:', data));
`;

// Example: Create a mock authentication flow
export const createMockAuthExample = `// Create a new mock auth flow
fetch('${getOrigin()}/api/create-mock-auth', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-user-id': '<your-user-id>'
  },
  body: JSON.stringify({
    endpoint: 'users',
    fields: [
      { name: 'email', type: 'string', required: true },
      { name: 'password', type: 'string', required: true },
      { name: 'firstName', type: 'string', required: false }
    ]
  })
})
  .then(res => res.json())
  .then(data => console.log('Created mock auth:', data));
`;

// Example: Signup with mock auth
export const signupMockAuthExample = `// Signup a new mock user
fetch('${getOrigin()}/api/mock-auth/users/signup/<your-username>', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'password123',
    firstName: 'Test'
  })
})
  .then(res => res.json())
  .then(data => console.log('Signup response:', data));
`;

// Example: Login with mock auth
export const loginMockAuthExample = `// Login with mock auth
fetch('${getOrigin()}/api/mock-auth/users/login/<your-username>', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'password123'
  })
})
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      localStorage.setItem('mock_token', data.data.token);
      localStorage.setItem('mock_user_id', data.data.user._id);
      console.log('Login successful:', data.data.user);
    }
  });
`;

// Example: Get mock user profile
export const getMockProfileExample = `// Get profile of mock user (after login)
const token = localStorage.getItem('mock_token');
const userId = localStorage.getItem('mock_user_id');

fetch(\`${getOrigin()}/api/mock-auth/\${userId}\`, {
  headers: {
    'Authorization': \`Bearer \${token}\`
  }
})
  .then(res => res.json())
  .then(data => console.log('Profile:', data));
`;

// Example: Delete all mocks
export const deleteAllMocksExample = `// Delete all your mocks
fetch('${getOrigin()}/api/mock', {
  method: 'DELETE',
  headers: { 'x-user-id': '<your-user-id>' }
})
  .then(res => res.json())
  .then(data => console.log('Delete result:', data));
`;

// Export all examples as an array for easy mapping
export const exampleSnippets = [
  {
    title: "Create a Mock API Endpoint",
    code: createMockExample,
    description: "Create a new mock endpoint for your API."
  },
  {
    title: "Get All Your Mocks",
    code: getAllMocksExample,
    description: "Fetch all mock endpoints you have created."
  },
  {
    title: "Use a Public Mock Endpoint",
    code: useMockExample,
    description: "Consume your mock endpoint as a public API."
  },
  {
    title: "Create a Mock Authentication Flow",
    code: createMockAuthExample,
    description: "Set up a new authentication flow with custom fields."
  },
  {
    title: "Signup with Mock Auth",
    code: signupMockAuthExample,
    description: "Register a new mock user using your auth flow."
  },
  {
    title: "Login with Mock Auth",
    code: loginMockAuthExample,
    description: "Authenticate a mock user and receive a JWT token."
  },
  {
    title: "Get Mock User Profile",
    code: getMockProfileExample,
    description: "Fetch the profile of a mock user using their token and userId."
  },
  {
    title: "Delete All Mocks",
    code: deleteAllMocksExample,
    description: "Remove all your mock endpoints."
  }
];