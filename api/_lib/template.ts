import { ParsedRequest } from "./types";

function getCss() {
  return `
    body {
        font-family: "Lato", serif;
        background-color: black;
        color: white;
        padding: 4rem;
        padding-right: 0px;
        position: relative;
        height: 100vh;
      }

      .caption {
        opacity: 70%;
        font-size: 2rem;
        margin: 0;
        margin-bottom: 1rem;
      }

      .cve {
        border-radius: 10px;
        padding: 0.3rem 2rem 0.5rem 2rem;
        display: inline-block;
        font-size: 2rem;
        margin: 0;
      }

      .cwe {
        font-size: 3.5rem;
        margin: 0;
        margin-bottom: 3rem;
      }

      .left-side {
        width: 66%;
      }

      .wrapper {
        display: flex;
        flex-direction: row;
      }

      .mouse {
        height: 500px;
        opacity: 10%;
        position: absolute;
        right: -2rem;
        top: 2.5rem;
        z-index: -1;
      }

      .author {
        color: rgba(255, 255, 255, 0.7);
        font-size: 2rem;
        position: absolute;
        bottom: 12rem;
      }
      
      .name {
        color: rgb(255, 255, 255);
      }`;
}

function getSeverityColour(score: Number) {
  switch (true) {
    case score > 9:
      return "#7C3AED";
    case score > 7:
      return "#DC2626";
    case score > 4:
      return "#FF8800";
    default:
      return "#FFD501";
  }
}

// function getTierColour(tier: String) {
//   switch (true) {
//       case tier === 'legend':
//         return '#ff0000'
//       case tier === 'legend':
//         return '#ff9d00'
//       case tier === 'legend':
//         return '#fbff00'
//       default:
//         return '#ffffff'
//   }
// }

function getAdvisoryHtml(parsedReq: ParsedRequest) {
  const { text, realName, username, cve, repoOwner, repoName, score } =
    parsedReq;
  const severityColour = getSeverityColour(score);
  const cveHtml = `<h1 class="cve" style="background-color: ${severityColour}49; border: 4px solid ${severityColour};">
                      ${cve}
                  </h1>`;

  let html = `<!DOCTYPE html>
  <html>
      <head>
          <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Lato"/>
          <meta charset="utf-8">
          <title>huntr.dev</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
              ${getCss()}
          </style>
      </head>
      <body>
        <div class="left-side">
          <p class="caption">Security Advisory in ${repoOwner} / ${repoName}</p>
          <h1 class="cwe">
              ${text}
          </h1>`;
  if (cve) html += cveHtml;
  html += `
          <img class="mouse" src="https://huntr.dev/_nuxt/image/1329be.svg" />
      
        <p class="author">
          By @${username} (<span class="name">${realName}</span>)
        </p>
        <img
          style="
            border-radius: 100%;
            width: 180px;
            height: 180px;
            position: absolute;
            bottom: 14rem;
            right: 8rem;
          "
          src="https://github.com/${username}.png"
        />
        </div>


    </body>
  </html>`;
  return html;
}

// function getProfileHtml(parsedReq: ParsedRequest) {
//   const { country, tier, vulnerabilityCount, fixCount, hallOfFame, badges } = parsedReq;
//   // const tierColour = getTierColour(tier)
//   const html = ''

//   // brand url: https://huntr.dev/brands/alibaba.png

//   // TODO: get badge colour codes

//   return 'TODO :)'
// }

export function getHtml(parsedReq: ParsedRequest) {
  const { page } = parsedReq;
  switch (page) {
    case "advisory":
      return getAdvisoryHtml(parsedReq);
    case "profile":
      return "coming soon :)"; // getProfileHtml(parsedReq)
    default:
      return '<body style="margin: 0; height: 100%; background-color: black;"><img src="https://huntr.dev/img/og_image.png"></img></body>';
  }
}
