const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema({
  title: String,
  type: String, // image, video, audio
  url: String,
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Media", mediaSchema);

