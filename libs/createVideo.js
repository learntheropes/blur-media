const { exec } = require('child_process');
const path = require('path');

// Function to create a video from extracted frames
exports.createVideo = (frameDirectory, outputVideoPath, framerate, resolution) => {
  return new Promise((resolve, reject) => {
    // Run the FFmpeg command to create the video
    const ffmpegCommand = `ffmpeg -framerate ${framerate} -i '${path.join(frameDirectory, '%05d.png')}' -s ${resolution} -c:v libx264 -pix_fmt yuv420p '${outputVideoPath}'`;

    exec(ffmpegCommand, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        console.log('Video created successfully.');
        resolve();
      }
    });
  });
}