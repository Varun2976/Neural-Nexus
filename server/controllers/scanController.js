const { scanUrl, scanText } = require('../services/scanService');

exports.scanUrlHandler = async (req, res) => {
  try {
    const { url } = req.body;
    const result = await scanUrl(url);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.scanTextHandler = async (req, res) => {
  try {
    const { text } = req.body;
    const result = await scanText(text);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
