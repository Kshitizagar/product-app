import React from 'react';

function UploadExcel() {
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
 const res = await fetch("https://appbackend-qmsw.onrender.com/api/send-email-excel", {
      method: "POST",
      body: formData
    });

    const result = await res.json();
    if (res.ok) {
      alert("✅ Emails sent successfully!");
    } else {
      alert(`❌ Failed: ${result.error || "Unknown error"}`);
    }
  };

  return (
    <div style={{ margin: '16px 0' }}>
      <label style={{ fontWeight: 'bold', marginRight: '10px' }}>📤 Upload Email Excel:</label>
      <input type="file" accept=".xlsx" onChange={handleUpload} />
    </div>
  );
}

export default UploadExcel;

