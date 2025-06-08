const express = require("express");
const multer = require("multer");
const router = express.Router();
const mediaController = require("../controllers/mediaController");

// File upload settings
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Routes
router.get("/", mediaController.getAllMedia);
router.post("/upload", upload.single("file"), mediaController.uploadMedia);

module.exports = router;
