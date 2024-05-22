let detections = {};

const videoElement = document.getElementById('input_video');


function handsInFrame(results) {
    detections = results;
    console.log(detections.multiHandLandmarks);

    if (detections.multiHandLandmarks.length != 0){
        console.log("hand detected");
    }
};

const hands = new Hands({locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
}});

hands.setOptions({
    maxNumHands: 2,
    modelComplexity: 0,
    minDetectionConfidence: 0.2,
    minTrackingConfidence:0.2
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
