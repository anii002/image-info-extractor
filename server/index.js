const express = require("express");
const app = express();
const Tesseract = require("tesseract.js");
const cors = require("cors");
app.use(cors());
app.use(express.json());
const fs = require("fs");

let ocrResult = '';

app.post("/process-image", async (req, res) => {
  try {
    const { imageURL } = req.body;
    const result = await Tesseract.recognize(imageURL, "eng", {
      logger: (m) => console.log(m),
    });

    ocrResult = result.data.text;
    const extractedData = parseExtractedData(ocrResult);
    res.json({ extractedData });
  } catch (error) {
    console.error("Error processing image:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

function parseExtractedData(text) {
  const lines = text.split("\n");
  const data = [];
  lines.forEach((line) => {
    if (line.includes("Name:")) {
      const name = line.split(":")[1];
      const ageLine = lines[lines.indexOf(line) + 1];
      const age = ageLine.split(":")[1];
      data.push({ Name: name, Age: age });
    }
  });
  const csvHeader = Object.keys(data[0]).join(",");
  const csvRows = data.map((item) => Object.values(item).join(","));
  const csvContent = `${csvHeader}\n${csvRows.join("\n")}`;
  return csvContent;
}

app.get("/download-csv", (req, res) => {
  const csvContent = parseExtractedData(ocrResult);
  res.setHeader("Content-Type", "text/csv");
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=extracted_data.csv"
  );
  res.send(csvContent);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

