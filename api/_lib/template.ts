import { ParsedRequest } from './types';

function getCss() {
    return `
    body {
        font-family: "Lato", serif;
        background-color: black;
        color: white;
        padding: 32px;
        padding-right: 0px;
        position: relative;
      }

      .caption {
        opacity: 70%;
        font-size: small;
        margin: 0;
      }

      .cve {
        border-radius: 4px;
        padding: 2px 10px;
        display: inline-block;
        font-size: small;
        margin: 0;
      }

      .cwe {
        font-size: x-large;
        margin: 0;
        margin-bottom: 10px;
      }

      .left-side {
        width: 66%;
      }

      .wrapper {
        display: flex;
        flex-direction: row;
      }

      .mouse {
        height: 150px;
        opacity: 20%;
        position: absolute;
        right: -25px;
        z-index: -1;
      }

      .author {
        color: rgba(255, 255, 255, 0.7);
        font-size: small;
        margin-bottom: 0;
        margin-top: 20px;
      }
      
      .name {
        color: rgb(255, 255, 255);
      }`;
}

function getSeverityColour(score: Number) {
    switch (true) {
        case score > 7.5:
            return '#ff0000'
        case score > 5.0:
            return '#ff9d00'
        case score > 2.5:
            return '#fbff00'
        default: 
            return '#ffffff'
    }
}

function getAdvisoryHtml(parsedReq: ParsedRequest) {
  const { text, realName, username, cve, repoOwner, repoName, score } = parsedReq;
  const severityColour = getSeverityColour(score);
    const cveHtml =`<h1 class="cve" style="background-color: ${severityColour}49; border: 1.5px solid ${severityColour};">
                        ${cve}
                    </h1>`

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
        <div class="wrapper">
          <div class="left-side">
            <p class="caption">Security Advisory in ${repoOwner} / ${repoName}</p>
            <h1 class="cwe">
                ${text}
            </h1>`
            if(cve) html += cveHtml
            html +=`
          </div>
          <img class="mouse" src="https://huntr.dev/_nuxt/image/1329be.svg" />
        </div>
        <div
          style="display: flex; flex-direction: row; width: 100%; margin-top: 10px"
        >
          <p class="author">
            By @${username} (<span class="name">${realName}</span>)
          </p>
          <img
            style="
              border-radius: 100%;
              width: 50px;
              height: 50px;
              margin-left: auto;
            "
            src="https://github.com/${username}.png"
          />
        </div>
      </body>
    </html>`
    return html;
}

function getProfileHtml(parsedReq: ParsedRequest) {
  console.log(parsedReq)
  return 'TODO :)'
}

export function getHtml(parsedReq: ParsedRequest) {
    const { page } = parsedReq
    switch (page) {
      case 'advisory':
        return getAdvisoryHtml(parsedReq)
      case 'profile':
        return getProfileHtml(parsedReq)
      default:
        return '<body style="margin: 0; height: 100%;"><img src="https://huntr.dev/img/og_image.png"></img></body>'
    };
}