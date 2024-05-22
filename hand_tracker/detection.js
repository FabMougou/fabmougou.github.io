let detections = {};

const videoElement = document.getElementById('input_video');
console.log(videoElement);


function handsInFrame(results) {
    console.log("ran")
    detections = results;
    console.log(detections);
};

const hands = new Hands({locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
}});
console.log("welp im phwecked!!!");

hands.setOptions({
    maxNumHands: 2,
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence:0.5
});

hands.onResults(handsInFrame);

const camera = new Camera(videoElement, {
    onFrame: async () => {
        await hands.send({image: videoElement});
    },
    width: 640,
    height: 480
});
console.log("then there were 4")
camera.start();
console.log("ayyayayay")

// const videoElement = document.getElementsByClassName('input_video')[0];
// const canvasElement = document.getElementsByClassName('output_canvas')[0];
// const canvasCtx = canvasElement.getContext('2d');

// function onResults(results) {
//   canvasCtx.save();
//   canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
//   canvasCtx.drawImage(
//       results.image, 0, 0, canvasElement.width, canvasElement.height);
//   if (results.multiHandLandmarks) {
//     for (const landmarks of results.multiHandLandmarks) {
//       drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS,
//                      {color: '#00FF00', lineWidth: 5});
//       drawLandmarks(canvasCtx, landmarks, {color: '#FF0000', lineWidth: 2});
//     }
//   }
//   canvasCtx.restore();
// }

// const hands = new Hands({locateFile: (file) => {
//   return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
// }});
// hands.setOptions({
//   maxNumHands: 2,
//   minDetectionConfidence: 0.5,
//   minTrackingConfidence: 0.5
// });
// hands.onResults(onResults);

// const camera = new Camera(videoElement, {
//   onFrame: async () => {
//     await hands.send({image: videoElement});
//   },
//   width: 1280,
//   height: 720
// });
// camera.start();