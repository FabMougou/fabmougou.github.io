// oscilloscope.js

// Controls for the oscilloscope
var controls = {
    mainGain: 0.0,
    exposureStops: 0.0,
    hue: 125,
    persistence: 0,
    freezeImage: false,
    invertXY: false,
    grid: true
};

Number.prototype.toFixedMinus = function(k) {
    if (this < 0) return this.toFixed(k);
    else return '+' + this.toFixed(k);
};

// Audio system for microphone input
var AudioSystem = {
    microphoneActive: false,
    init: function(bufferSize) {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioContext = new window.AudioContext();
        this.sampleRate = this.audioContext.sampleRate;
        this.bufferSize = bufferSize;
        this.timePerSample = 1 / this.sampleRate;
        this.oldXSamples = new Float32Array(this.bufferSize);
        this.oldYSamples = new Float32Array(this.bufferSize);
        this.smoothedXSamples = new Float32Array(Filter.nSmoothedSamples);
        this.smoothedYSamples = new Float32Array(Filter.nSmoothedSamples);
        if (!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia)) {
            microphoneOutput.value = " unavailable in this browser";
        }
    },
    startSound: function() {
        this.audioVolumeNode = this.audioContext.createGain();
        this.scopeNode = this.audioContext.createScriptProcessor(this.bufferSize, 2, 2);
        this.scopeNode.onaudioprocess = doScriptProcessor;
        this.scopeNode.connect(this.audioVolumeNode);
        this.audioVolumeNode.connect(this.audioContext.destination);
    },
    tryToGetMicrophone: function() {
        if (this.microphoneActive) {
            AudioSystem.microphone.connect(AudioSystem.scopeNode);
            return;
        }
        var constraints = { audio: { mandatory: { echoCancellation: false } } };
        navigator.getUserMedia = navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia;
        if (navigator.getUserMedia) {
            navigator.getUserMedia(constraints, onStream, function() { micCheckbox.checked = false; });
        } else {
            micCheckbox.checked = false;
        }
    },
    disconnectMicrophone: function() {
        if (this.microphone) this.microphone.disconnect();
    }
};

function onStream(stream) {
    AudioSystem.microphoneActive = true;
    AudioSystem.microphone = AudioSystem.audioContext.createMediaStreamSource(stream);
    AudioSystem.microphone.connect(AudioSystem.scopeNode);
}

// Filter for smoothing the waveform
var Filter = {
    lanczosTweak: 1.5,
    init: function(bufferSize, a, steps) {
        this.bufferSize = bufferSize;
        this.a = a;
        this.steps = steps;
        this.radius = a * steps;
        this.nSmoothedSamples = this.bufferSize * this.steps + 1;
        this.allSamples = new Float32Array(2 * this.bufferSize);
        this.createLanczosKernel();
    },
    generateSmoothedSamples: function(oldSamples, samples, smoothedSamples) {
        var bufferSize = this.bufferSize;
        var allSamples = this.allSamples;
        var nSmoothedSamples = this.nSmoothedSamples;
        var a = this.a;
        var steps = this.steps;
        var K = this.K;
        for (var i = 0; i < bufferSize; i++) {
            allSamples[i] = oldSamples[i];
            allSamples[bufferSize + i] = samples[i];
        }
        var pStart = bufferSize - 2 * a;
        var pEnd = pStart + bufferSize;
        var i = 0;
        for (var position = pStart; position < pEnd; position++) {
            smoothedSamples[i] = allSamples[position];
            i += 1;
            for (var r = 1; r < steps; r++) {
                var smoothedSample = 0;
                for (var s = -a + 1; s < a; s++) {
                    var sample = allSamples[position + s];
                    var kernelPosition = -r + s * steps;
                    if (kernelPosition < 0) smoothedSample += sample * K[-kernelPosition];
                    else smoothedSample += sample * K[kernelPosition];
                }
                smoothedSamples[i] = smoothedSample;
                i += 1;
            }
        }
        smoothedSamples[nSmoothedSamples - 1] = allSamples[2 * bufferSize - 2 * a];
    },
    createLanczosKernel: function() {
        this.K = new Float32Array(this.radius);
        this.K[0] = 1;
        for (var i = 1; i < this.radius; i++) {
            var piX = (Math.PI * i) / this.steps;
            var sinc = Math.sin(piX) / piX;
            var window = this.a * Math.sin(piX / this.a) / piX;
            this.K[i] = sinc * Math.pow(window, this.lanczosTweak);
        }
    }
};

// UI initialization
var UI = {
    sidebarWidth: 360,
    init: function() {
        mainGain.oninput();
    }
};

// Render object (keep as in original, but only for oscilloscope display)
// ... (Insert Render code from original here, unchanged) ...

function doScriptProcessor(event) {
    var xSamplesRaw = event.inputBuffer.getChannelData(0);
    var ySamplesRaw = event.inputBuffer.getChannelData(1);
    var xOut = event.outputBuffer.getChannelData(0);
    var yOut = event.outputBuffer.getChannelData(1);
    var length = xSamplesRaw.length;
    for (var i = 0; i < length; i++) {
        xSamples[i] = xSamplesRaw[i];
        ySamples[i] = ySamplesRaw[i];
    }
    if (!controls.freezeImage) {
        if (!controls.disableFilter) {
            Filter.generateSmoothedSamples(AudioSystem.oldXSamples, xSamples, AudioSystem.smoothedXSamples);
            Filter.generateSmoothedSamples(AudioSystem.oldYSamples, ySamples, AudioSystem.smoothedYSamples);
            if (!controls.swapXY) Render.drawLineTexture(AudioSystem.smoothedXSamples, AudioSystem.smoothedYSamples);
            else Render.drawLineTexture(AudioSystem.smoothedYSamples, AudioSystem.smoothedXSamples);
        } else {
            if (!controls.swapXY) Render.drawLineTexture(xSamples, ySamples);
            else Render.drawLineTexture(ySamples, xSamples);
        }
    }
    for (var i = 0; i < length; i++) {
        AudioSystem.oldXSamples[i] = xSamples[i];
        AudioSystem.oldYSamples[i] = ySamples[i];
        xOut[i] = xSamplesRaw[i];
        yOut[i] = ySamplesRaw[i];
    }
}

var xSamples = new Float32Array(1024);
var ySamples = new Float32Array(1024);
UI.init();
Render.init();
document.onclick = function() {
    document.onclick = null;
    document.getElementById("clicktostart").remove();
    Filter.init(512, 10, 4);
    AudioSystem.init(1024);
    Render.setupArrays(Filter.nSmoothedSamples);
    AudioSystem.startSound();
    requestAnimationFrame(function drawCRTFrame() { Render.drawCRT(); requestAnimationFrame(drawCRTFrame); });
}; 