let detections = {};

const videoElement = document.getElementById('input_video');
console.log(videoElement);


function handsInFrame(results) {
    console.log("hand detected")
    detections = results;
};

const hands = new Hands({locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
}});

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
camera.start();