const { writeFileSync, readFileSync, copyFileSync, rmdirSync, mkdirSync, readdirSync } = require('fs');
const { sample } = require('lodash');
const timecut = require('timecut');
const ColorThief = require('colorthief');

const OUTPUT_DIR = 'export';
const ASSETS_DIR = 'src/assets'
const OUTPUT_PATH = `${OUTPUT_DIR}/index.html`;

async function main() {
  rmdirSync(OUTPUT_DIR, { recursive: true });
  mkdirSync(OUTPUT_DIR);

  const images = readdirSync(ASSETS_DIR).filter(image => image.includes('bg-'));
  const backgroundImagePath = sample(images);

  copyFileSync(`${ASSETS_DIR}/${backgroundImagePath}`, `${OUTPUT_DIR}/${backgroundImagePath}`);

  const palette = await ColorThief.getPalette(`export/${backgroundImagePath}`, 5);

  const colors = palette.map(color => `rgb(${color[0]}, ${color[1]}, ${color[2]})`);

  const css = `
    body {
      background-color: #2c3e50;
      background-image: url('${backgroundImagePath}');
      background-repeat: no-repeat;
      background-size: auto;
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
      background-color: black;
      opacity: 0.25;
    }

    svg {
      margin-left: auto;
      margin-right: auto;
      margin-top: 35vh;
      display:block;
    }

    path {
      stroke-dasharray: 10000px;
      stroke-dashoffset: 10000px;
      fill: #ffffff;
      fill-opacity: 0;
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
        targets: 'body',
        backgroundPositionX: '-1000px',
        duration: 15000,
        easing: 'linear',
        direction: 'alternate',
        loop: true
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
          width: 600,
          height: 600
        },
        fps: 60,
        duration: 5,
        output: 'intro-output.mp4'
      });
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  }
}

main();