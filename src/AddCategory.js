// import React, { useState } from 'react';

// const AddCategory = () => {
//   const [categoryName, setCategoryName] = useState('');
//   const [status, setStatus] = useState('');

//   const handleAddCategory = async (e) => {
//     e.preventDefault();

//     if (!categoryName.trim()) {
//       setStatus('⚠️ Please enter a valid category name.');
//       return;
//     }

//     try {
//       const res = await fetch('https://appbackend-qmsw.onrender.com/api/categories', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ name: categoryName.trim() })
//       });

//       const data = await res.json();

//       if (res.ok) {
//         setStatus(`✅ Category "${data.category.name}" added successfully.`);
//         setCategoryName('');
//       } else {
//         setStatus(`❌ ${data.error}`);
//       }
//     } catch (err) {
//       setStatus('❌ Failed to connect to server.');
//     }
//   };

//   return (
//     <div style={{ marginBottom: '30px' }}>
//       {/* <h3>Add New Category</h3> */}
//       <form onSubmit={handleAddCategory} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
//         <input
//           type="text"
//           placeholder="Enter category name"
//           value={categoryName}
//           onChange={(e) => setCategoryName(e.target.value)}
//           required
//           style={{
//             padding: '8px',
//             borderRadius: '5px',
//             border: '1px solid #ccc',
//             flex: '1',
//             width: '200px',
//             height: '10px',
//           }}
//         />
//         <button
//           type="submit"
//           style={{
//             padding: '8px 14px',
//             backgroundColor: '#28a745',
//             color: '#fff',
//             border: 'none',
//             borderRadius: '5px',
//             cursor: 'pointer'
//           }}
//         >
//           ➕ Add
//         </button>
//       </form>
//       {status && <p style={{ marginTop: '10px', fontWeight: 'bold' }}>{status}</p>}
//     </div>
//   );
// };

// export default AddCategory;

import React, { useState } from 'react';

const CategoryManager = () => {
  const [categoryName, setCategoryName] = useState('');
  const [deleteCategoryName, setDeleteCategoryName] = useState('');
  const [status, setStatus] = useState('');

  // ✅ Add Category
  const handleAddCategory = async (e) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      setStatus('⚠️ Please enter a valid category name.');
      return;
    }

    try {
      const res = await fetch('https://appbackend-qmsw.onrender.com/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: categoryName.trim() })
      });

      const data = await res.json();

      if (res.ok) {
        setStatus(`✅ Category "${data.category.name}" added successfully.`);
        setCategoryName('');
      } else {
        setStatus(`❌ ${data.error}`);
      }
    } catch (err) {
      setStatus('❌ Failed to connect to server.');
    }
  };

  // 🗑 Delete Category
  const handleDeleteCategory = async (e) => {
    e.preventDefault();

    if (!deleteCategoryName.trim()) {
      setStatus('⚠️ Please enter a valid category name to delete.');
      return;
    }

    try {
      const res = await fetch('https://appbackend-qmsw.onrender.com/api/categories', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: deleteCategoryName.trim() })
      });

      const data = await res.json();

      if (res.ok) {
        setStatus(`🗑 Category "${data.deletedCategory.name}" deleted successfully.`);
        setDeleteCategoryName('');
      } else {
        setStatus(`❌ ${data.error}`);
      }
    } catch (err) {
      setStatus('❌ Failed to connect to server.');
    }
  };

  return (
    <div style={{ marginBottom: '30px' }}>
      {/* Add Category Form */}
      <form onSubmit={handleAddCategory} style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '15px' }}>
        <input
          type="text"
          placeholder="Enter category name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          required
          style={{
            padding: '8px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            flex: '1',
            width: '200px',
            height: '10px',
          }}
        />
        <button
          type="submit"
          style={{
            padding: '8px 14px',
            backgroundColor: '#28a745',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          ➕ Add
        </button>
      </form>

      {/* Delete Category Form */}
      <form onSubmit={handleDeleteCategory} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Enter category name to delete"
          value={deleteCategoryName}
          onChange={(e) => setDeleteCategoryName(e.target.value)}
          required
          style={{
            padding: '8px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            flex: '1',
            width: '200px',
            height: '10px',
          }}
        />
        <button
          type="submit"
          style={{
            padding: '8px 14px',
            backgroundColor: '#dc3545',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          🗑 Delete
        </button>
      </form>

      {/* Status message */}
      {status && <p style={{ marginTop: '10px', fontWeight: 'bold' }}>{status}</p>}
    </div>
  );
};

export default CategoryManager;

