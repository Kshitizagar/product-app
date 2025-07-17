import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import {
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import Card from './Card';
import { FaBox, FaTags, FaChartLine } from 'react-icons/fa';  
import './App.css';
import AddCategory from './AddCategory';
import UploadExcel from './UploadExcel';
const renderCustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#ffffff',
        border: '1px solid #ccc',
        padding: '10px 14px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        fontSize: '14px',
        color: '#333'
      }}>
        <strong>{payload[0].name}</strong>: {payload[0].value}
      </div>
    );
  }
  return null;
};



function App() {
  // const [adminPassword, setAdminPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const PASSWORD = "radhu";

  const requirePassword = () => {
    if (isAuthenticated) return true;

    const input = prompt("Enter admin password:");
    if (input === PASSWORD) {
      setIsAuthenticated(true);
      return true;
    } else {
      alert("Incorrect password!");
      return false;
    }
  };


  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: '',
    price: '',
    description: '',
    product_link: '',
    image_link: '',
    form1: '',
    form2: '',
    category: '',
    status:'',
    discountedprice: ''
  });
  
  
  const [editProduct, setEditProduct] = useState(null); // product being edited
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [categories, setCategories] = useState([]); //categories_new


//   const categoryData = ['A', 'B', 'C', 'D'].map(cat => ({
//   category: cat,
//   count: products.filter(p => p.category === cat).length,
// }));
const categoryData = categories.map(cat => ({
  category: cat.name,
  count: products.filter(p => p.category === cat.name).length,
}));

  const productsPerPage = 5;

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const filteredProducts = products
  .filter(p => categoryFilter ? p.category === categoryFilter : true)
  .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));


  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // const totalPages = Math.ceil(products.length / productsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  // useEffect(() => {
  //   fetch('https://appbackend-qmsw.onrender.com/api/products')
  //     .then(res => res.json())
  //     .then(data => setProducts(data));
  // }, []);

  useEffect(() => {
  fetch('https://appbackend-qmsw.onrender.com/api/products')
    .then(res => res.json())
    .then(data => setProducts(data));

  // 🔽 ADD THIS BLOCK TO FETCH CATEGORIES
  fetch('https://appbackend-qmsw.onrender.com/api/categories')
    .then(res => res.json())
    .then(data => setCategories(data));
}, []);    //categories_new


  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!requirePassword()) return;
    const res = await fetch('https://appbackend-qmsw.onrender.com/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const newProduct = await res.json();
    setProducts([...products, newProduct]);
    setForm({
      name: '',
      price: '',
      description: '',
      product_link: '',
      image_link: '',
      category: '',
      form1: '',
      form2: '',
      status: '',
      discountedprice: ''
    });
  };

  const handleDelete = async id => {
    if (!requirePassword()) return;
    await fetch(`https://appbackend-qmsw.onrender.com/api/products/${id}`, { method: 'DELETE' });
    setProducts(products.filter(p => p._id !== id));
  };

  const handleEditClick = (product) => {
    setEditProduct(product); // Open modal with prefilled product
  };

  const handleEditChange = e => {
    const { name, value } = e.target;
    setEditProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async e => {
    e.preventDefault();
    if (!requirePassword()) return;
    const res = await fetch(`https://appbackend-qmsw.onrender.com/api/products/${editProduct._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editProduct),
    });
    const updatedProduct = await res.json();
    setProducts(products.map(p => (p._id === updatedProduct._id ? updatedProduct : p)));
    setEditProduct(null); // Close modal
  };

  const limitWords = (text, wordLimit) => {
    const words = text.split(' ');
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(' ') + '...'
      : text;
  };

//   const convertToCSV = (arr) => {
//   const headers = ['Name', 'Price', 'category', 'Description', 'Product Link', 'Image Link'];
//   const rows = arr.map(p => [
//     p.name,
//     p.price,
//     p.category,
//     p.description.replace(/[\r\n]+/g, ' '),
//     p.product_link,
//     p.image_link
//   ]);

//   const csvContent = [
//     headers.join(','),
//     ...rows.map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
//   ].join('\n');

//   return csvContent;
// };

const convertToCSV = (arr) => {
  const headers = ['Name', 'Price', 'Discounted Price', 'Category', 'Description', 'Product Link', 'Image Link', 'Form1', 'Form2', 'Status'];
  const rows = arr.map(p => [
    p.name,
    p.price,
    p.discountedprice,
    p.category,
    p.description.replace(/[\r\n]+/g, ' '),
    `=HYPERLINK("${p.product_link}", "link")`,
    `=HYPERLINK("${p.image_link}", "link")`,
    p.form1,
    p.form2,
    p.status
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row =>
      row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')
    )
  ].join('\n');

  return csvContent;
};





  const downloadFile = (content, filename, mimeType) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

  const convertToText = (arr) => {
  return arr.map(p =>
    `Name: ${p.name}\nPrice: ₹${p.price}\nLess: ₹${p.discountedprice}\nCategory: ${p.category}\nDescription: ${p.description}\nProduct Link: ${p.product_link}\nForm1: ${p.form1}\nForm2: ${p.form2}\nImage Link: ${p.image_link}\nStatus: ${p.status}\n\n`
  ).join('');
};

//   const handleDownloadCSV = () => {
//   const csv = convertToCSV(products);
//   const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
//   const url = URL.createObjectURL(blob);

//   const link = document.createElement('a');
//   link.href = url;
//   link.setAttribute('download', 'products.csv');
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
// };

const priceRangeData = [
  { name: '< 500', value: products.filter(p => p.price < 500).length },
  { name: '500 - 1000', value: products.filter(p => p.price >= 500 && p.price <= 1000).length },
  { name: '1000 - 10000', value: products.filter(p => p.price > 1000 && p.price <= 10000).length },
  { name: '> 10000', value: products.filter(p => p.price > 10000).length },
];

const pieColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff6e76'];


// const handleSendEmail = async () => {
//   try {
//     const response = await fetch('http://localhost:5000/api/send-email', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ products }),  // send product data to backend
//     });
    
//     const result = await response.json();
//     if (response.ok) {
//       alert("✅ Email sent successfully!");
//     } else {
//       alert(`❌ Failed to send email----: ${result.error}`);
//     }
//   } catch (err) {
//     alert("❌ Error sending email.");
//     console.error(err);
//   }
// };

const handleSendEmail = async () => {
  if (!requirePassword()) return;
  setLoadingEmail(true); // Show loader
  try {
    const response = await fetch('https://appbackend-qmsw.onrender.com/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ products }),
    });

    const result = await response.json();
    if (response.ok) {
      alert("✅ Email sent successfully!");
    } else {
      alert(`❌ Failed to send email: ${result.error}`);
    }
  } catch (err) {
    alert("❌ Error sending email.");
    console.error(err);
  }
  setLoadingEmail(false); // Hide loader
};


  console.log("Fetched categories:", categories);
  return (
    <div className="container">
      {/* <div style={{
        display: 'flex',
        gap: '20px',
        marginBottom: '30px',
        marginTop: '10px',
        flexWrap: 'wrap',
      }}>
        <Card title="Total Products" value={products.length} icon={<FaBox />} />
        <Card title="Categories" value={[...new Set(products.map(p => p.category))].length} icon={<FaTags />} />
        <Card title="Inventory Value" value={"₹" + products.reduce((acc, p) => acc + Number(p.price || 0), 0)} icon={<FaChartLine />} />
      </div> */}

      {/* <h3>Send Product Email in Bulk</h3>
      <UploadExcel /> */}

      {/* <h2>Add Product</h2> */}
      <h2 className="section-heading">
        <span role="img" aria-label="add">🛒</span> Add Product
      </h2>

        {/* <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Product Name" value={form.name} onChange={handleChange} required />
          <input name="price" placeholder="Product Price" type="number" value={form.price} onChange={handleChange} required />
          <input name="description" placeholder="Product description" value={form.description} onChange={handleChange} required />
          <input name="product_link" placeholder="Product link" value={form.product_link} onChange={handleChange} required />
          <input name="image_link" placeholder="Image link" value={form.image_link} onChange={handleChange} required />
          <select name="category" value={form.category} onChange={handleChange} required>
            <option value="" disabled>Select Category</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
          </select>
          <button type="submit">Add</button>
        </form> */}
        <form onSubmit={handleSubmit}>
          <input className="form-input" name="name" placeholder="Product Name" value={form.name} onChange={handleChange} required />
          <input className="form-input" name="price" placeholder="Product Price" type="number" value={form.price} onChange={handleChange} required />
          <input className="form-input" name="description" placeholder="Product description" value={form.description} onChange={handleChange} required />
          <input className="form-input" name="product_link" placeholder="Product link" value={form.product_link} onChange={handleChange} required />
          <input className="form-input" name="image_link" placeholder="Image link" value={form.image_link} onChange={handleChange} required />
          {/* <input className="form-input" name="form1" placeholder="OForm" value={form.form1} onChange={handleChange} required />
          <input className="form-input" name="form2" placeholder="RForm" value={form.form2} onChange={handleChange} required /> */}
          
          {/* <select className="form-input" name="category" value={form.category} onChange={handleChange} required>
            <option value="" disabled>Select Category</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
          </select> */}
          <select className="form-input" name="category" value={form.category} onChange={handleChange} required>
            <option value="" disabled>Select Category</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat.name}>{cat.name}</option>
            ))}
          </select>  
          {/* categories_new */}

          <input className="form-input" name="form1" placeholder="OForm" value={form.form1} onChange={handleChange} required />
          <input className="form-input" name="form2" placeholder="RForm" value={form.form2} onChange={handleChange} required />
          {/* <input className="form-input" name="status" placeholder="Status" value={form.status} onChange={handleChange} required /> */}
          <select className="form-input" name="status" value={form.status} onChange={handleChange} required>
            <option value="">Select Status</option>
            <option value="Available">Available</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
          <input className="form-input" name="discountedprice" placeholder="Less" value={form.discountedprice} onChange={handleChange} required />
          <button type="submit">Add</button>
        </form>
        {/* <AddCategory /> */}


      {/* <h3>Product List</h3> */}

      {/* <div style={{ marginBottom: '10px' }}>
        <label style={{ fontWeight: 'bold', marginRight: '10px' }}>📥 Download Format:</label>
        <select
          onChange={(e) => {
            const type = e.target.value;
            if (type === 'csv') {
              const csv = convertToCSV(products);
              downloadFile(csv, 'products.csv', 'text/csv');
            } else if (type === 'txt') {
              const txt = convertToText(products);
              downloadFile(txt, 'products.txt', 'text/plain');
            }
            e.target.selectedIndex = 0; // Reset to placeholder
          }}
          style={{ padding: '6px' }}
        >
          <option value="">Select format</option>
          <option value="csv">Download as CSV</option>
          <option value="txt">Download as TXT</option>
        </select>
        <button
          onClick={handleSendEmail}
          style={{ padding: '8px 12px', backgroundColor: '#4CAF50', color: 'white', border: 'none', marginLeft: '10px' }}
        >
          📧 Send Product Email
        </button>
        <select
        value={categoryFilter}
        onChange={(e) => {
          setCategoryFilter(e.target.value);
          setCurrentPage(1);
        }}
        style={{ padding: '8px', marginRight: '10px', marginLeft: '10px' }}
        // style={{ padding: '1px', marginRight: '1px' }}
      >
        <option value="">All Categories</option>
        <option value="A">A</option>
        <option value="B">B</option>
        <option value="C">C</option>
        <option value="D">D</option>
      </select>
      <input
        type="text"
        placeholder="Search by product name"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
        style={{ padding: '8px', width: '300px' }}
        // style={{ padding: '1px', width: '31px' }}
      />
      </div> */}
      <div style={{
        marginBottom: '20px',
        padding: '16px',
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '12px'
      }}>
        <label style={{ fontWeight: 'bold', marginRight: '10px', fontSize: '16px' }}>📥 Download Format :</label>

        <select
          onChange={(e) => {
            const type = e.target.value;
            if (type === 'csv') {
              const csv = convertToCSV(products);
              downloadFile(csv, 'products.csv', 'text/csv');
            } else if (type === 'txt') {
              const txt = convertToText(products);
              downloadFile(txt, 'products.txt', 'text/plain');
            }
            e.target.selectedIndex = 0;
          }}
          style={{
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            fontSize: '15px',
            backgroundColor: '#f0f8ff',
            cursor: 'pointer'
          }}
        >
          <option value="">Select format</option>
          <option value="csv">Download as CSV</option>
          <option value="txt">Download as TXT</option>
        </select>

        {/* <button
          onClick={handleSendEmail}
          style={{
            padding: '8px 16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '15px',
          }}
        >
          📧 Send Product Email
        </button> */}

        <button
          onClick={handleSendEmail}
          disabled={loadingEmail}
          style={{
            padding: '8px 16px',
            backgroundColor: loadingEmail ? '#aaa' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: loadingEmail ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
            fontSize: '15px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          {loadingEmail ? (
            <>
              <span className="spinner" /> Sending...
            </>
          ) : (
            <>📧 Send Product Email</>
          )}
        </button>


        <select
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setCurrentPage(1);
          }}
          style={{
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            fontSize: '15px',
            backgroundColor: '#f9f9f9',
            cursor: 'pointer'
          }}
        >
          <option value="">All Categories</option>
          {/* <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option> */}
          {categories.map(cat => (
            <option key={cat._id} value={cat.name}>{cat.name}</option>
          ))} {/* categories_new */}
        </select>

        <input
          type="text"
          placeholder="🔍 Search by product name"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          style={{
            padding: '8px 12px',
            width: '250px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            fontSize: '15px'
          }}
        />
      </div>

      {/* <button
        onClick={handleSendEmail}
        style={{ padding: '8px 12px', backgroundColor: '#4CAF50', color: 'white', border: 'none', marginLeft: '10px' }}
      >
        📧 Send Product Email
      </button> */}
   {/* <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
      <select
        value={categoryFilter}
        onChange={(e) => {
          setCategoryFilter(e.target.value);
          setCurrentPage(1);
        }}
        style={{ padding: '8px', marginRight: '10px' }}
        // style={{ padding: '1px', marginRight: '1px' }}
      >
        <option value="">All Categories</option>
        <option value="A">A</option>
        <option value="B">B</option>
        <option value="C">C</option>
        <option value="D">D</option>
      </select>

      <input
        type="text"
        placeholder="Search by product name"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
        style={{ padding: '8px', width: '300px' }}
        // style={{ padding: '1px', width: '31px' }}
      />
    </div> */}

      {/* <h3>Product List</h3> */}
      {/* <h3>Dashboard</h3> */}
      {/* <br></br> */}
      <div style={{ marginTop: '20px' }}></div>

      {/* <UploadExcel />
      <AddCategory /> */}
      <div className="responsive-flex-container">
        <UploadExcel />
        <AddCategory />
      </div>
      {/* <div style={{ 
  display: 'flex', 
  flexDirection: 'row', 
  justifyContent: 'space-between', 
  gap: '16px', 
  alignItems: 'flex-start' 
}}>
  <UploadExcel />
  <AddCategory />
</div> */}


      <h1>Product List</h1>

      <div style={{ overflowX: 'auto' }}>
        <table border="1" cellPadding="10" style={{ marginTop: '20px', width: '100%', borderCollapse: 'collapse', minWidth: '800px'  }}>
          <colgroup>
            <col style={{ width: '5%' }} />   {/* S.No */}
            <col style={{ width: '20%' }} />  {/* Name */}
            <col style={{ width: '5%' }} />  {/* Price */}
            <col style={{ width: '5%' }} />  {/* Less */}
            <col style={{ width: '10%' }} />  {/* Category */}
            <col style={{ width: '20%' }} />  {/* Description */}
            <col style={{ width: '5%' }} />  {/* Product Link */}
            <col style={{ width: '5%' }} />  {/* Image */}
            <col style={{ width: '5%' }} />  {/* oform */}
            <col style={{ width: '5%' }} />  {/* rform */}
            <col style={{ width: '10%' }} />  {/* Actions */}
            <col style={{ width: '5%' }} />  {/* Status */}
          </colgroup>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>Price(₹)</th>
              <th>Less(₹)</th>
              <th>Category</th>            
              <th>Description</th>
              <th>Product Link</th>
              <th>Image</th>
              <th>OForm</th>
              <th>RForm</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.map((p, index) => (
              <tr key={p._id}>
                <td>{indexOfFirstProduct + index + 1}</td> {/* 👈 S.No logic */}
                
                <td style={{ position: 'relative' }}>
                  <div className="hover-description">
                    {limitWords(p.name || '', 3)}
                    <div className="hover-popup">
                      {p.name}
                    </div>
                  </div>
                </td>
                <td>{p.price}</td>
                <td>{p.discountedprice}</td>
                <td>{p.category}</td>
                <td style={{ position: 'relative' }}>
                  <div className="hover-description">
                    {limitWords(p.description || '', 4)}
                    <div className="hover-popup">
                      {p.description}
                    </div>
                  </div>
                </td>
                <td><a href={p.product_link} target="_blank" rel="noopener noreferrer">Open</a></td>
                <td><a href={p.image_link} target="_blank" rel="noopener noreferrer">Image</a></td>
                <td><a href={p.form1} target="_blank" rel="noopener noreferrer">Open</a></td>
                <td><a href={p.form2} target="_blank" rel="noopener noreferrer">Open</a></td>
                <td>{p.status}</td>
                <td>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'nowrap' }}>
                    <button className="delete-btn" onClick={() => handleDelete(p._id)}>Delete</button>
                    <button className="edit-btn" onClick={() => handleEditClick(p)}>Update</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>




      <div className="pagination">
        <button onClick={handlePrevious} disabled={currentPage === 1}>Previous</button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={handleNext} disabled={currentPage === totalPages}>Next</button>
      </div>

   <h1 style={{ marginTop: '40px' }}>Product Insights</h1>
  <div className="chart-wrapper">
  {/* Bar Chart */}
  <div className="chart-container">
    <h4 style={{ textAlign: 'center' }}>Distribution by Category</h4>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={categoryData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="category" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="count" fill="#4CAF50" />
      </BarChart>
    </ResponsiveContainer>
  </div>

  {/* Pie Chart */}
  <div className="chart-container">
    <h4 style={{ textAlign: 'center' }}>Distribution by Price Range</h4>
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <defs>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#ccc" />
          </filter>
        </defs>
        <Pie
          data={priceRangeData}
          cx="50%"
          cy="50%"
          outerRadius={100}
          dataKey="value"
          nameKey="name"
          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
          isAnimationActive={true}
          animationDuration={800}
          filter="url(#shadow)"
        >
          {priceRangeData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
          ))}
        </Pie>
        <Tooltip content={renderCustomTooltip} />
        <Legend
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
          iconType="circle"
          wrapperStyle={{
            marginTop: '10px',
            fontSize: '14px',
            color: '#444'
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  </div>
</div>


  <br></br>
  <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
  <Card
  title="Total Products"
  value={products.length}
  icon={<FaBox />}
  color="#4CAF50"
  bgColor="#E8F5E9" // Light green background
/>

<Card
  title="Categories"
  value={[...new Set(products.map(p => p.category))].length}
  icon={<FaTags />}
  color="#2196F3"
  bgColor="#E3F2FD" // Light blue background
/>

<Card
  title="Inventory Value"
  value={"₹" + products.reduce((acc, p) => acc + Number(p.price || 0), 0)}
  icon={<FaChartLine />}
  color="#FF5722"
  bgColor="#FBE9E7" // Light orange background
/>

</div>

      {/* EDIT MODAL */}
      {editProduct && (
        <div className="modal-overlay">
  <div className="modal">
    {/* <h3>Edit Product</h3> */}
    <h3 style={{ marginBottom: '8px' }}>Edit Product</h3>
    <form onSubmit={handleEditSubmit}>
      <label>Product Name</label>
      <input name="name" value={editProduct.name} onChange={handleEditChange} placeholder="Product Name" required />
      <label>Price (₹)</label>
      <input name="price" type="number" value={editProduct.price} onChange={handleEditChange} placeholder="Price" required />
      <label>Less (₹)</label>
      <input name="discountedprice" type="number" value={editProduct.discountedprice} onChange={handleEditChange} placeholder="Less" required />
      

      <label>Description</label>
      <input name="description" value={editProduct.description} onChange={handleEditChange} placeholder="Description" required />

      <label>Product Link</label>
      <input name="product_link" value={editProduct.product_link} onChange={handleEditChange} placeholder="Product Link" />

      <label>Image Link</label>
      <input name="image_link" value={editProduct.image_link} onChange={handleEditChange} placeholder="Image Link" />
      <label>Category</label>
      {/* <select className="select-category" name="category" value={editProduct.category} onChange={handleEditChange} required>
        <option value="" disabled>Select Category</option>
        <option value="A">A</option>
        <option value="B">B</option>
        <option value="C">C</option>
        <option value="D">D</option>
      </select> */}
      <select name="category" value={editProduct.category} onChange={handleEditChange} required>
        <option value="" disabled>Select Category</option>
        {categories.map(cat => (
          <option key={cat._id} value={cat.name}>{cat.name}</option>
        ))}
      </select>
      {/* categories_new */}

      <label>Order Form</label>
      <input name="form1" value={editProduct.form1} onChange={handleEditChange} placeholder="Order Form" />
      <label>Refund Form</label>
      <input name="form2" value={editProduct.form2} onChange={handleEditChange} placeholder="Refund Form" />
      {/* <label>Status</label>
      <input name="status" value={editProduct.status} onChange={handleEditChange} placeholder="Status" /> */}
      <label>Status</label>
      <select name="status" value={editProduct.status} onChange={handleEditChange} required>
        <option value="">Select Status</option>
        <option value="Available">Available</option>
        <option value="Out of Stock">Out of Stock</option>
      </select>


      <button type="submit">Update</button>
      <button type="button" onClick={() => setEditProduct(null)}>Cancel</button>
    </form>
  </div>
</div>

    
      )}
    </div>
  );
}

export default App;
