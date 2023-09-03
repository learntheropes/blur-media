const faceapi = require('face-api.js');
const canvas = require('canvas');
const fs = require('fs').promises;

// Set up face-api.js
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

exports.blurFacesInFrames = async (inputFrameDirectory, outputFrameDirectory) => {
  await faceapi.nets.faceRecognitionNet.loadFromDisk('./models/face_recognition_model-weights_manifest.json');
  await faceapi.nets.ssdMobilenetv1.loadFromDisk('./models/ssd_mobilenetv1_model-weights_manifest.json');

  // Load frames
  const frameFiles = await fs.readdir(inputFrameDirectory);
  const filteredFrameFiles = frameFiles.filter(fileName => parseInt(fileName.replace('.png')) < 1000)
  for (const frameFile of filteredFrameFiles) {
    if (frameFile.endsWith('.png')) {
      const framePath = `${inputFrameDirectory}/${frameFile}`;
      const image = await canvas.loadImage(framePath);
      const imageCanvas = canvas.createCanvas(image.width, image.height);
      const ctx = imageCanvas.getContext('2d');
      ctx.drawImage(image, 0,0, image.width, image.height);

      const detections = await faceapi.detectAllFaces(image);

      for (const detection of detections) {
        const box = {
          spread: 1000,
          x: parseInt(detection.box.x.toString()),
          y: parseInt(detection.box.y.toString()),
          width: parseInt(detection.box.width.toString()),
          height: parseInt(detection.box.height.toString())
        }

        ctx.filter = 'blur('+ box.spread +'px)';
        // ctxModal.drawImage(modal, box.x, box.y, box.width, box.height, box.x, box.y, box.width, box.height);
        // ctxModal.filter = 'none';
        // ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.fillRect(box.x, box.y, box.width, box.height);
      }

      const buffer = imageCanvas.toBuffer('image/png');
      await fs.writeFile(`${outputFrameDirectory}/${frameFile}`, buffer);
    }
  }
}
