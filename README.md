# web-audio-hackday

## Project for Scotland JS 2015 Web Audio Hack Day

[http://scotlandjs.com/charity_tutorial/](http://scotlandjs.com/charity_tutorial/)

For the Scotland JS Web Audio Hack Day 2015, I decided to try my hand at real time audio visualisation and analysis in the browser.

## Demo

[http://davidcole1977.github.io/web-audio-hackday/](http://davidcole1977.github.io/web-audio-hackday/) (will likely only work in recent versions of Chrome and Firefox)

## Description

A drum rhythm audio track (.ogg file) is loaded, played and looped continuously in the web browser. A web audio API `AnalyserNode` is conected to the audio source and performs a Fast Fourier Transform (FFT), allowing us to access information about the sound in realtime. 

The API's `getByteFrequencyData` function provides 'slices' of information about the sound in the frequency domain – in other words, we can retrieve the amount of sound (amplitude) for a given frequency band. `requestAnimationFrame` is used to run a regular loop, each iteration of which retrieves the data for an audio 'slice' in the form of an array of values (0-255) for each frequency band. This information is then rendered to the web page using a canvas element.

So far, this is pretty much the hello world exercise for the web audio analyser node. This is the first time I had attempted audio analysis or used the canvas.

I decided to try and analyse the speed of the audio – to retrieve the number of beats per minute – by identifying and tracking peaks in the frequency bands. During a given time 'slice', each frequency band is checked to see if its amplitude is above a set threshold, in which case a time stamp is stored in an array. Each time the threshold is triggered, a new time stamp is stored, which theoretically could be used as the basis for identifying the music's timing. These peaks can be visually identified by the parts of the visualisation that turn green. You can see the effect of changing the threshold by adjusting the slider next to the canvas visualisation.

By the time the hack day finished, I had only just started to begin this analysis and was tracking the average time between peaks for each frequency band. While demonstrating the presence of patterns that could potentially be used to determine musical timing and rhythmic patterns, I would need a more sophisticated algorithm to correctly identify the tempo (speed) of the musical track.

### Learnings

The web audio API is surprisingly accessible. The combination of web audio and canvas can produce sophisticated audio visualisations; this hack barely scratched the surface.

The algorithm to determine the tempo of the musical track would have to be significantly more sophisticated than what's implemented here. I suppose that there would have to be some way of identifying repeated rhythmic patterns, as well as some kind of filtering mechanism to identify the best patterns to use for timing analysis. This would have to dynamically adjust to the quality of different music tracks and the changing qualities of a track as it progresses.

I imagine some music tracks would be too complex to be reliably analysed in this way. Similarly, some music tracks would probably not provide enough rhythmic information to be reliably analysed. Music of strong, simple, consistent rhythm with limited dynamics (such as a lot of pop music) would be the best candidate for this type of analysis.

### Fugly code caveat

The code quality is terrible. It was written without any thought given to quality, consistentcy, structure, maintainability and so on. The algorithms and maths are also flawed, but taken in the spirit of a hack day, this is probably acceptable.

## Dependencies
* [grunt](http://gruntjs.com/)
* [node](https://nodejs.org/)

## Basic useage

Source files live in `src/`

The compiled app files are copied into `_app/` (don't edit anything in this folder directly, as the grunt default task wipes it clean every time)

Mocha unit tests live in `test/`

### Set up

```bash
$ npm install
```

### Running the grunt tasks

```bash
#default tasks / compile & copy to app directory, start static dev server, watch files
$ grunt
```

*See `gruntfile.js` for more details of the grunt tasks*

### To view the project locally

After running the default grunt task, a basic web server will be running at `http://localhost:3000`