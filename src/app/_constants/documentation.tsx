  export const basicCode = `fetch('https://mockapi.yourusername.com/products')
  .then(res => res.json())
  .then(data => console.log(data));`;

  export const complexCode = `// Get page 1 with 5 items per page and include metadata
fetch('https://mockapi.yourusername.com/products?page=1&limit=5&_meta=true')
  .then(res => res.json())
  .then(data => {
    console.log(data.meta);  // { total: 20, page: 1, limit: 5, totalPages: 4 }
    console.log(data.data);  // Array of 5 items
  });`;