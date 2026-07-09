const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;


const UPLOAD_DIR = path.join(__dirname, 'upload_images');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}


app.use(express.static(path.join(__dirname, 'public')));


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const base = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 60);
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${base}-${unique}${ext}`);
  }
});

function fileFilter(req, file, cb) {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'));
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }
});


app.post('/upload', upload.single('image'), function (req, res) {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file received.' });
  }
  res.json({
    success: true,
    file: {
      originalName: req.file.originalname,
      savedAs: req.file.filename,
      size: req.file.size,
      path: `upload_images/${req.file.filename}`
    }
  });
});


app.use((err, req, res, next) => {
  if (err) {
    return res.status(400).json({ error: err.message || 'Upload failed.' });
  }
  next();
});

app.listen(PORT, () => {
  console.log(`Click Fit server running on http://localhost:${PORT}`);
});