(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function () {

  function init() {
    var audioCtx = new window.AudioContext(),
        canvas = document.getElementById('analyserCanvas'),
        canvasCtx = canvas.getContext('2d'),
        timeSlider = document.getElementById('changeTimeRange'),
        WIDTH = 1024,
        HEIGHT = 400,
        resolution = 2, // max 16, min 1, power of 2, lower is better
        divisions = 2048 / resolution / 2,
        peakValue = 255,
        thresholdRatio = 0.9,
        peakDelay = 0.2,
        peaksArray = [];

    for (var i = 0; i < divisions; i++) {
      peaksArray[i] = {
        timesPeaked: [],
        currentlyPeaking: false,
        averageTimeBetweenPeaks: 0,
        hasPeaked: false
      };
    }

    function loadSound () {
      var request = new XMLHttpRequest();
      
      request.open('GET', 'ogg/818[kb]101-bigfish-unstopable.ogg', true);
      request.responseType = 'arraybuffer';

      // Decode asynchronously
      request.onload = function() {
        audioCtx.decodeAudioData(request.response, function(buffer) {
          playSound(buffer);
        });
      };

      request.send();
    }

    function playSound (buffer) {
      var source = audioCtx.createBufferSource(),
          analyser = audioCtx.createAnalyser(),
          bufferLength,
          dataArray;

      analyser.fftSize = 2048 / resolution;
      bufferLength = analyser.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(dataArray);

      source.buffer = buffer; 
      source.connect(analyser);
      analyser.connect(audioCtx.destination);
      source.loop = true;
      source.start(audioCtx.currentTime); 

      timeSlider.addEventListener('change', function (event) {
        thresholdRatio = event.target.value;
      });

      function draw() {
        canvasCtx.clearRect(0, 0, 1024, 400);
        analyser.getByteFrequencyData(dataArray);

        for(var i = 0; i < bufferLength; i++) {
          canvasCtx.fillStyle = 'rgb(100, 100, 100)';

          // if the value for this frequency band is above the threshold
          // and it's not currently peaking, set it to peaking and record the peak start time
          if (dataArray[i] > peakValue * thresholdRatio) {
            canvasCtx.fillStyle = 'rgb(0, 255, 0)';

            peaksArray[i].hasPeaked = true;

            if (!peaksArray[i].currentlyPeaking) {
              peaksArray[i].timesPeaked.push(audioCtx.currentTime);
              peaksArray[i].currentlyPeaking = true;

              // get average time between peaks
              if (peaksArray[i].timesPeaked.length > 1) {
                var timesPeakedArray = peaksArray[i].timesPeaked,
                    firstTimePeaked = timesPeakedArray[0],
                    lastTimePeaked = timesPeakedArray[timesPeakedArray.length - 1];

                peaksArray[i].averageTimeBetweenPeaks = (lastTimePeaked - firstTimePeaked) / timesPeakedArray.length;
              } 
            }

          } else {
            if (typeof peaksArray[i] !== 'undefined' && peaksArray[i].currentlyPeaking) {
              peaksArray[i].currentlyPeaking = false;
            }
          }

          canvasCtx.fillRect(i * resolution, 400 - dataArray[i], resolution, dataArray[i]);
        }

        requestAnimationFrame(draw);
      }

      draw();
    }

    loadSound();

    setInterval(function () {
      for (var i = 0; i < peaksArray.length; i++) {
        if (peaksArray[i].hasPeaked) {
          console.log(i, peaksArray[i].averageTimeBetweenPeaks);
        }
      }
    }, 1000);
  }

  function onDOMReady () {
    init();
  }

  document.addEventListener("DOMContentLoaded", onDOMReady);

})();

},{}]},{},[1]);
