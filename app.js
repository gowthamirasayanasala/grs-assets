const fs = require("fs");

// Specify the paths to the folders
const imagesFolderPath = "images";
const docsFolderPath = "docs";
const audioFolderPath = "audio";

// Specify the path to the JSON file
const jsonfilePath = "assets-names.json";

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

// Read the contents of a folder and return files with their types
function readFolder(folderPath, type) {
  return new Promise((resolve, reject) => {
    fs.readdir(folderPath, (err, files) => {
      if (err) {
        console.error(`Error reading folder ${folderPath}:`, err.message);
        reject(err);
        return;
      }
      const fileNames = files.map((file) => ({
        name: file,
        type: type,
      }));
      resolve(fileNames);
    });
  });
}

// Combine all assets into one JSON file
async function generateAssetsJson() {
  try {
    clearJsonFile(); // Clear existing data

    // Read files from all folders
    const images = await readFolder(imagesFolderPath, "images");
    const docs = await readFolder(docsFolderPath, "docs");
    const audio = await readFolder(audioFolderPath, "audio");

    // Combine all files into one array
    const allAssets = [...images, ...docs, ...audio];

    // Write combined data to the JSON file
    writeJsonFile(allAssets);
  } catch (error) {
    console.error("Error generating assets JSON:", error.message);
  }
}

// Generate the JSON file
generateAssetsJson();
