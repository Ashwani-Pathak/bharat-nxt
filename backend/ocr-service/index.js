const express = require('express');
const cors = require('cors');
const multer = require('multer');
const app = express();
const upload = multer(); // For handling file uploads

app.use(cors());
app.use(express.json());

// Mock OCR endpoint
app.post('/api/ocr', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }
  
  // In a real OCR service, you would process the req.file.buffer here
  // and send it to an OCR engine. For this mock, we return a sample text.
  const sampleText = `Extracted text from ${req.file.originalname || 'document'}:
  Name: John Doe\nGSTIN: 29ABCDE1234F5Z6\nPAN: ABCDE1234F\nAddress: 123 Main St, Anytown, State - 12345`;
  
  // Simulate a delay for OCR processing
  setTimeout(() => {
    res.json({ text: sampleText });
  }, 1500);
});

const PORT = process.env.PORT || 4007;
app.listen(PORT, () => console.log(`OCR service running on port ${PORT}`)); 