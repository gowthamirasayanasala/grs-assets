const fs = require("fs");

// Specify the path to the JSON file
const jsonfilePath = "assets-names.json";

// Specify the path to the folder
const imagesFolderPath = "images";

// Read the JSON file
function readJsonFile() {
  try {
    const data = fs.readFileSync(jsonfilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading JSON file:", error.message);
    return null;
  }
}

// Clear (delete) the contents of the JSON file
function clearJsonFile() {
  try {
    fs.writeFileSync(jsonfilePath, "[]", "utf-8");
    console.log("JSON file cleared.");
  } catch (error) {
    console.error("Error clearing JSON file:", error.message);
  }
}

// Write data to the JSON file
function writeJsonFile(data) {
  try {
    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFileSync(jsonfilePath, jsonData, "utf-8");
    console.log("Data written to JSON file.");
  } catch (error) {
    console.error("Error writing to JSON file:", error.message);
  }
}

// Read the contents of the folder
fs.readdir(imagesFolderPath, (err, files) => {
  if (err) {
    console.error("Error reading folder:", err);
    return;
  }
  // Clear the file (optional)
  clearJsonFile();
  // Log the file names
  console.log("Files in the folder:", files);

  const fileNames = [];
  files.forEach((element) => {
    fileNames.push({ name: element });
  });

  // Write the modified/new data to the file
  writeJsonFile(fileNames);
});
