const fs = require('fs').promises;
const path = require('path');

async function deleteFilesInFolder(folderPath) {
  try {
    // Read the list of files in the folder
    const files = await fs.readdir(folderPath);

    // Iterate through the files and delete each one
    for (const file of files) {
      const filePath = path.join(folderPath, file);
      await fs.unlink(filePath);
      console.log(`Deleted ${filePath}`);
    }

    console.log('All files in the folder have been deleted.');
  } catch (error) {
    console.error('Error deleting files:', error);
  }
}