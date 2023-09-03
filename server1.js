const express = require('express');
const multer = require('multer');
const fs = require('fs').promises;
const { extractFrames } = require('./libs/extractFrames.js');
const { createVideo } = require('./libs/createVideo.js');
const { blurFacesInFrames } = require('./libs/blurFacesInFrames');

const app = express();
const port = 3000;

// Configure multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Handle file uploads and video processing
app.post('/upload', upload.single('video'), async (req, res) => {
  const inputVideoPath = 'input_video.mp4';
  const inputFrameDirectory = 'input_frames';
  const outputFrameDirectory = 'output_frames';
  const outputVideoPath = 'output_video.mp4';

  try {
    // Write uploaded file to disk
    await fs.writeFile(inputVideoPath, req.file.buffer);

    // Extract frames
    const { framerate, resolution } = await extractFrames(inputVideoPath, inputFrameDirectory);

    console.log('start extract frames')

    await blurFacesInFrames(inputFrameDirectory, outputFrameDirectory);

    // Create video
    await createVideo(
        outputFrameDirectory,
        outputVideoPath,
        framerate,
        resolution
    );

    res.send('ok');

  //   // Send the output video file as a response
  //   res.sendFile(outputVideoPath, (err) => {
  //     if (err) {
  //       console.error('Error sending the output video:', err);
  //       res.status(500).send('Error sending the output video');
  //     }
  //   });
  } catch (err) {
    console.error('Error processing the uploaded video:', err);
    res.status(500).send('Error processing the uploaded video');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});