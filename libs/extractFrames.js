const ffmpeg = require('fluent-ffmpeg');
const path = require('path');

// Function to extract frames from the input video
exports.extractFrames = (inputVideoPath, outputFrameDirectory) => {
  return new Promise((resolve, reject) => {

    // Get the framerate and resolution of the input video
    ffmpeg.ffprobe(inputVideoPath, (err, metadata) => {
      if (err) {
        reject(err);
        return;
      }

      const stream = metadata.streams.find((s) => s.codec_type === 'video');

      if (stream) {
        const framerate = eval(stream.r_frame_rate);
        const resolution = stream.width + 'x' + stream.height;

        ffmpeg()
          .input(inputVideoPath)
          .inputOptions(`-r ${framerate}`)
          .on('end', () => {
            console.log('Frames extracted successfully.');
            resolve({ framerate, resolution });
          })
          .on('error', (err) => {
            reject(err);
          })
          .output(path.join(outputFrameDirectory, '%05d.png'))
          .run();
      } else {
        reject(new Error('No video stream found in the input file.'));
      }
    });
  });
}