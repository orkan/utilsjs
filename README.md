# @orkans/utilsjs `v4.6.0`

Bunch of scripts collected from all around the JS world

[HOME](https://github.com/orkan) | [NPM](https://www.npmjs.com/package/@orkans/utilsjs) | [GITHUB](https://github.com/orkan/utilsjs)

## Installation

`npm i @orkans/utilsjs`

## Help

* Why `.js` instead of `.mjs` in module extension?

  Many servers doesn't recognize `.mjs` extension, resulting in a strict MIME type checking error along the lines of "The server responded with a non-JavaScript MIME type" and the browser won't run your JavaScript.

* Running custom NodeJS scripts.

  Most scripts is defined in package.json file, including: `test`, `arrShuffle`, etc... These can be ran from root dir with `npm run <label>`. Those that require debuging are repeated in `launch.json` file. However, DEBUG mode doesn't load `Console` module, hence console?.log() notation.

## About

### Requirements

Node  ^18

### Author

[Orkan](https://github.com/orkan)

### License

MIT

### Updated

Wed, 19 Aug 2026 18:42:00 +02:00
