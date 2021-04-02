const { writeFileSync, readFileSync } = require('fs');
const timecut = require('timecut');

const OUTPUT_PATH = 'export/index.html'

const css = `
  body {
    background-color: #2c3e50;
  }

  .bg {
    position: absolute;
    height: 100vh;
    width: 100vw;
    left: 0;
    top: 0;
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

const colors = [
  '#8e44ad',
  '#2980b9',
  '#16a085'
];

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

async function main() {
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