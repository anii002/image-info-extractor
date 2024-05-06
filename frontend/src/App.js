import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";



function App() {
  const [file, setFile] = useState("");
  const [extractedData, setExtractedData] = useState(null);

  const handleFileIDChange = (event) => {
    setFile(event.target.value);
  };

  const handleUpload = async () => {
    try {
      const response = await axios.post("http://localhost:5000/process-image", {
        imageURL: file,
      });
      setExtractedData(response.data.extractedData);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleDownload = async () => {
    try {
       
      const response = await axios.get("http://localhost:5000/download-csv");
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "extracted_data.csv");
      document.body.appendChild(link);
      link.click();
     
    } catch (error) {
      console.error("Error downloading CSV:", error);
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-center items-center gap-2">
        {" "}
        <input
          className="border-1 rounded px-2"
          type="text"
          value={file}
          onChange={handleFileIDChange}
          placeholder="Enter image URL"
        />
        <button onClick={handleUpload} className="btn btn-sm btn-primary">
          Process Image
        </button>
      </div>

      {extractedData && (
        <div>
          <h2>Extracted Data:</h2>
          <div> {extractedData}</div>
          <button
            onClick={handleDownload}
            className="btn btn-sm btn-primary mt-5"
          >
            Download CSV
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
