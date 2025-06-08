const Media = require("../models/Media");

exports.getAllMedia = async (req, res) => {
  try {
    const media = await Media.find().sort({ uploadedAt: -1 });
    res.json(media);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};

exports.uploadMedia = async (req, res) => {
  const file = req.file;

  if (!file) return res.status(400).json({ error: "No file uploaded" });

  const media = new Media({
    title: file.originalname,
    type: file.mimetype.split("/")[0],
    url: `/uploads/${file.filename}`,
  });

  try {
    await media.save();
    res.status(201).json({ message: "Uploaded!", media });
  } catch (err) {
    res.status(500).json({ error: "Upload failed" });
  }
};
