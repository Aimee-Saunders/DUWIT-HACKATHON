const express = require("express");
const path = require("path");
const cors = require("cors");
const fs=require("fs");
const app = express();
const PORT = 5000;
app.use(cors());
app.use(express.json());

const CSV_PATH = path.join(__dirname,"productivity.csv");

app.post("/productivity", (req, res) => {
  try {
    const { day, hour, rating } = req.body;
    console.log("Received:", day, hour, rating);

    fs.readFile(CSV_PATH, "utf8", (err, data) => {
      if (err) {
        console.error("Read error:", err);
        return res.status(500).json({ error: err.message });
      }

      const lines = data.split("\n");
      const header = lines[0];
      const rows = lines.slice(1);

      const newRows = rows.map(line => {
        if (!line.trim()) return line;
        const parts = line.split(",");
        if (parts.length < 3) return line;
        const [rowDay, rowHour, frequencies] = parts;
        if (Number(rowDay) === Number(day) && Number(rowHour) === Number(hour)) {
          const freqArray = frequencies.split("|").map(Number);
          const index = Math.max(0, Math.min(4, rating - 1));
          freqArray[index] = (freqArray[index] || 0) + 1;
          const newFrequencies = freqArray.join("|");
          return [rowDay, rowHour, newFrequencies].join(",");
        }
        return line;
      });

      fs.writeFile(CSV_PATH, [header, ...newRows].join("\n"), err => {
        if (err) {
          console.error("Write error:", err);
          return res.status(500).json({ error: err.message });
        }
        res.json({ success: true });
      });
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});