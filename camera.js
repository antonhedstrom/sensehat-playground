import express
import 'raspberrypi-node-camera-web-streamer';

const app = express()
videoStream.acceptConnections(app, {
    width: 1280,
    height: 720,
    fps: 16,
    encoding: 'JPEG',
    quality: 7 //lower is faster
}, '/stream.mjpg', true);

app.listen(3000, () => console.log(`Listening on port ${port}!`));