const { writeFileSync, readFileSync, copyFileSync, rmdirSync, mkdirSync, readdirSync } = require('fs');
const { sample } = require('lodash');
const timecut = require('timecut');
const ColorThief = require('colorthief');

const OUTPUT_DIR = 'export';
const ASSETS_DIR = 'src/assets'
const OUTPUT_PATH = `${OUTPUT_DIR}/index.html`;

const deleteAndRemakeOutputFolder = () => {
  rmdirSync(OUTPUT_DIR, { recursive: true });
  mkdirSync(OUTPUT_DIR);
}

const VIDEO_TITLE = process.argv[3] || "Video Title";
const VIDEO_DESC = process.argv[4] || "Video Description";

async function main() {
  const images = readdirSync(ASSETS_DIR).filter(image => image.includes('bg-'));
  const backgroundImagePath = sample(images);

  copyFileSync(`${ASSETS_DIR}/${backgroundImagePath}`, `${OUTPUT_DIR}/${backgroundImagePath}`);

  const palette = await ColorThief.getPalette(`export/${backgroundImagePath}`, 5);
  const mainColor = await ColorThief.getColor(`export/${backgroundImagePath}`);

  const colors = palette.map(color => `rgb(${color[0]}, ${color[1]}, ${color[2]})`);

  const css = `
    html, body {margin: 0; height: 100%; overflow: hidden}

    body {
      background-image: url('${backgroundImagePath}');
      background-repeat: no-repeat;
      background-size: auto;
      font-family: 'Roboto Mono', sans-serif;
    }

    .bg {
      position: absolute;
      height: 100vh;
      width: 100vw;
      left: 0;
      top: 0;
    }

    .fade {
      position: absolute;
      height: 100vh;
      width: 100vw;
      left: 0;
      top: 0;
      background-color: rgb(${mainColor[0]}, ${mainColor[1]}, ${mainColor[2]});
      opacity: 0.25;
      z-index: -1;
      filter: brightness(0.5);
    }

    svg {
      margin-left: auto;
      margin-right: auto;
      margin-top: 35vh;
      display: block;
      z-index: 9999
    }

    path {
      stroke-dasharray: 10000px;
      stroke-dashoffset: 10000px;
      fill: #ffffff;
      fill-opacity: 0;
    }

    .intro-text-container {
      text-align: center;
      font-size: 1.5em;
      font-weight: 100;
      position: absolute;
      margin-left: auto;
      margin-right: auto;
      width: 100%;
      color: white;
      padding-top: 2.5vh;
      letter-spacing: 1vw;
      text-indent: 1vw;
    }

    .video-text-container {
      position: absolute;
      top: 25%;
      text-align: center;
      margin-left: auto;
      margin-right: auto;
      width: 100%;
    }

    .video-text {
      text-align: center;
      padding: 2vw;
      margin: 2vw;
      color: white;
      opacity: 0;
    }

    .video-text-title  {
      font-size: 6em;
      font-weight: 100;
    }

    .video-text-desc {
      font-size: 3em;
      font-weight: bold;
    }
  `;

  const script = `
    async function animate() {
      await anime({
        targets: 'body .bg',
        height: '0vh',
        easing: 'easeInOutExpo',
        duration: 2000,
        delay: anime.stagger(100)
      });

      await anime({
        targets: 'svg',
        easing: 'easeInOutExpo',
        duration: 3000,
        marginTop: '25vh'
      });

      await anime({
        targets: 'svg path',
        easing: 'easeInOutExpo',
        stroke: '#ffffff',
        duration: 3000,
      });

      await anime({
        targets: '.fade',
        duration: 15000,
        easing: 'easeInOutExpo',
        opacity: 1
      });

      await anime({
        targets: '.intro-text-container',
        easing: 'easeOutExpo',
        delay: 2000,
        duration: 2000,
        opacity: [0, 1],
        paddingTop: ['15vh', '2.5vh'],
      });

      await anime({
        targets: '.intro-text-1',
        delay: anime.stagger(100, { start: 2000 }),
        duration: 2000,
        opacity: [0, 1]
      });

      await anime({
        targets: '.intro-text-2',
        delay: anime.stagger(100, { start: 2500 }),
        duration: 2000,
        opacity: [0, 1]
      });

      await anime({
        targets: '.intro-text-3',
        delay: anime.stagger(100, { start: 3000 }),
        duration: 2000,
        opacity: [0, 1]
      });

      await anime({
        targets: 'svg path',
        strokeDashoffset: '8000px',
        easing: 'easeInExpo',
        duration: 3500,
      }).finished;

      await anime({
        targets: 'svg path',
        easing: 'easeInExpo',
        duration: 500,
        fillOpacity: 1,
      });

      await anime({
        targets: 'svg, .intro-text-container',
        easing: 'easeInOutExpo',
        delay: 1500,
        duration: 1500,
        opacity: 0,
        translateY: -100
      });

      await anime({
        targets: '.video-text',
        easing: 'easeInOutExpo',
        delay: 2000,
        opacity: 1,
        duration: 2000,
        transformY: [-100, 0]
      });
    }

    animate();
  `;

  const vendor = readFileSync('vendor/anime.min.js', 'utf8');

  let body = '';

  colors.forEach((color, index) => {
    const zIndex = colors.length - index;

    body += `
      <div
        style="background-color: ${color}; z-index: ${zIndex};"
        class="bg"
      >
      </div>
    `
  });

  const logo = readFileSync('src/assets/logo-dark.svg', 'utf8');

  body += `<div class="fade"></div>`;
  body += logo;

  const introText1 = "MUSIC PRODUCTION";
  const introText2 = "SOUND DESIGN";
  const introText3 = "MIDI CONTROLLERISM";

  body += `
    <div class="intro-text-container">
      <div id="intro-text-1">
        ${introText1.split('').map(x => `<span class="intro-text-1">${x}</span>`).join('')}
      </div>
      <div id="intro-text-2">
        ${introText2.split('').map(x => `<span class="intro-text-2">${x}</span>`).join('')}
      </div>
      <div id="intro-text-3">
        ${introText3.split('').map(x => `<span class="intro-text-3">${x}</span>`).join('')}
      </div>
    </div>
  `

  body += `
    <div class="video-text-container">
      <div class="video-text">
        <div class="video-text-title">${VIDEO_TITLE}</div>
        <div class="video-text-desc">${VIDEO_DESC}</div>
      </div>
    </div>
  `

  const template = `
  <!DOCTYPE html>
  <html>
    <head>
      <title>Brand Content Tools - Intro</title>
      <style>${css}</style>
      <script>${vendor}</script>
    </head>
    <body>
      ${body}
      <script>${script}</script>
    </body>
  </html>
  `

  console.log(`[ generate-intro.mjs ] Writing html...`);
  writeFileSync(OUTPUT_PATH, template, 'utf8');

  if (process.argv[2] === '-e' || process.argv[2] === '--export') {
    try {
      console.log(`[ generate-intro.mjs ] Rendering video...`);
      await timecut({
        url: 'export/index.html',
        viewport: {
          width: 1920,
          height: 1080
        },
        fps: 60,
        duration: 10,
        output: 'intro-output.mp4'
      });
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  }
}

main();