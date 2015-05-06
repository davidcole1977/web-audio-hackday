(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function () {

  function init() {
    var audioCtx = new window.AudioContext(),
        canvas = document.getElementById('analyserCanvas'),
        canvasCtx = canvas.getContext('2d');

    function loadSound () {
      var request = new XMLHttpRequest();
      
      request.open('GET', '/ogg/Podington_Bear_-_Bambi.ogg', true);
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

      analyser.fftSize = 1024;
      bufferLength = analyser.fftSize;
      dataArray = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(dataArray);

      source.buffer = buffer; 
      source.connect(analyser);
      analyser.connect(audioCtx.destination);
      source.start(0); 

      function draw() {
        var drawVisual = requestAnimationFrame(draw),
            WIDTH = 1024,
            HEIGHT = 400;

        analyser.getByteTimeDomainData(dataArray);

        canvasCtx.fillStyle = 'rgb(200, 200, 200)';
        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

        canvasCtx.beginPath();

        var sliceWidth = WIDTH * 1.0 / bufferLength;
        var x = 0;

        for(var i = 0; i < bufferLength; i++) {
     
          var v = dataArray[i] / 128.0;
          var y = v * HEIGHT/2;

          if(i === 0) {
            canvasCtx.moveTo(x, y);
          } else {
            canvasCtx.lineTo(x, y);
          }

          x += sliceWidth;
        }

        canvasCtx.lineTo(canvas.width, canvas.height/2);
        canvasCtx.stroke();
      }

      draw();
    }

    loadSound();
  }

  function onDOMReady () {
    init();
  }

  document.addEventListener("DOMContentLoaded", onDOMReady);

})();

},{}]},{},[1]);
