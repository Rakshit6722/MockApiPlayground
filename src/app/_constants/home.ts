export const HERO_CONTENT = {
  badge: "Launching Beta v1.0",
  heading: "Don't wait for backend. Keep building.",
  description: "Create realistic mock APIs in seconds. Build your frontend without waiting for backend APIs to be ready."
};

export const BEFORE_CODE = `// Waiting for backend API to be completed...
const fetchData = async () => {
  // TODO: Implement when backend is ready
  // const response = await fetch('/api/data');
  // const data = await response.json();
  
  // Using placeholder data for now
  return [{ id: 1, name: "Placeholder" }];
};`;

export const AFTER_CODE = `// Using Mock API Playground
const fetchData = async () => {
  const response = await fetch('https://mockapi.io/yourusername/products');
  const data = await response.json();
  return data; // Real-looking data, instantly available
};`;

export const PROBLEM_SECTION = {
  heading: "The Developer's Dilemma",
  description: "Every frontend developer knows the pain of waiting for backend APIs. Here's how we solve it.",
  without: {
    title: "Without Mock API",
    problems: [
      "Frontend work stalls waiting for backend",
      "Placeholder data doesn't match real API",
      "Project deadlines slip due to dependencies"
    ]
  },
  with: {
    title: "With Mock API",
    benefits: [
      "Frontend development continues uninterrupted",
      "API responses match exact expected structure",
      "Project timeline maintained despite delays"
    ]
  }
};

export const HOW_IT_WORKS = {
  badge: "How It Works",
  heading: "Three simple steps to unblock your development",
  steps: [
    {
      number: "1",
      title: "Replace Missing Endpoints",
      description: "Create mock endpoints that match your expected backend API structure.",
      time: "20 seconds",
      color: "from-blue-600 to-blue-400",
      iconName: "Plus",
      example: "GET /api/users",
      traditional: "Days or weeks"
    },
    {
      number: "2",
      title: "Define Realistic Responses",
      description: "Create JSON responses with real-looking data that match your specs.",
      time: "30 seconds",
      color: "from-cyan-600 to-cyan-400",
      iconName: "Code",
      example: `{"users": [...], "pagination": {...}}`,
      traditional: "Hours of refactoring"
    },
    {
      number: "3",
      title: "Swap When Backend's Ready",
      description: "Just change the API URL when the real backend is ready. No refactoring needed.",
      time: "10 seconds",
      color: "from-indigo-600 to-indigo-400",
      iconName: "Zap",
      example: "from /mock-api/users to /api/users",
      traditional: "Hours of integration"
    }
  ]
};

export const KEY_BENEFITS = {
  heading: "Key Benefits",
  description: "Everything you need to keep your frontend momentum going",
  benefits: [
    {
      iconName: "Clock4",
      title: "No More Waiting",
      description: "Continue frontend development at full speed regardless of backend timeline delays.",
      color: "bg-blue-500/20 text-blue-400"
    },
    {
      iconName: "Users",
      title: "Parallel Development",
      description: "Frontend and backend teams can work simultaneously without blocking each other.",
      color: "bg-purple-500/20 text-purple-400"
    },
    {
      iconName: "GitMerge",
      title: "Smooth Integration",
      description: "When backend is ready, transition is seamless with API-identical responses.",
      color: "bg-green-500/20 text-green-400"
    },
    {
      iconName: "FileCode2",
      title: "Better Testing",
      description: "Test edge cases, errors, and loading states without waiting for backend support.",
      color: "bg-amber-500/20 text-amber-400"
    }
  ]
};

export const TESTIMONIAL = {
  quote: "We had a hard deadline for our app launch, but the backend APIs were delayed. MockFlow saved us - we built the entire frontend against mock endpoints, then swapped them for real APIs at the last minute with zero refactoring.",
  name: "Unknown",
  role: "React Developer, Fintech Startup"
};

export const FINAL_CTA = {
  heading: "Stop waiting for backend. Start building today.",
  description: "Create your first mock API in under a minute",
  buttonText: "Get started now",
  benefits: ["No credit card", "No setup", "Instant results"]
};

export const API_RESPONSE_EXAMPLE = `[
  {
    "id": 1,
    "name": "Quantum X1 Headphones",
    "price": 299.99,
    "category": "Audio",
    "inStock": true,
    "rating": 4.8,
    "specs": {
      "color": "Midnight Black",
      "wireless": true,
      "batteryLife": "40 hours"
    }
  },
  {
    "id": 2,
    "name": "Stellar 4K Monitor",
    "price": 549.99,
    "category": "Display",
    "inStock": false,
    "rating": 4.6,
    "specs": {
      "size": "32 inch",
      "resolution": "3840x2160",
      "refreshRate": "144Hz"
    }
  }
]`;