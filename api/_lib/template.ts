import { ParsedRequest } from "./types";

function getCss() {
  return `
    body {
        font-family: "Lato", serif;
        background-color: black;
        color: white;
        padding: 4rem;
      margin: 0;
height: 492px;
  display: -webkit-box; /* OLD - iOS 6-, Safari 3.1-6 */
  display: -moz-box; /* OLD - Firefox 19- (buggy but mostly works) */
  display: -ms-flexbox; /* TWEENER - IE 10 */
  display: -webkit-flex; /* NEW - Chrome */
  display: flex; /* NEW, Spec - Opera 12.1, Firefox 20+ */
  -ms-flex-direction: column;
  -moz-flex-direction: column;
  -webkit-flex-direction: column;
  flex-direction: column;
      }

      .caption {
        opacity: 50%;
        font-size: 1.6rem;
        margin: 0;
        width: 75%;
      }

      .cwe {
        font-size: 3rem;
        margin: 0;
        margin-top: 1rem;
        width: 75%;
      }

            .author {
        color: rgba(255, 255, 255, 0.5);
        font-size: 1.6rem;
}

      .cve {

width: 100%;
text-align: right;
font-size: 1.7rem;
margin-top: 0px;
      }

            
      .name {
        color: rgb(255, 255, 255);
        font-weight: 600;
      }

      .mouse {
        height: 100px;
        position: absolute;
        right: 2rem;
        top: 2.5rem;
        z-index: -1;
        opacity: 50%;
      }
      
      .avatar{
          border-radius: 100%;
          border: 6px solid black;
          width: 150px;
          height: 150px;
          position: absolute;
          top: 5.2rem;
          right: 4rem;
      }

      .stat-column {
        display: flex; flex-direction: column; margin-right: 4rem;
      }

      .stat-description {
        opacity: 50%; font-size: 1.6rem; margin-top: 0.5rem;
      }
      
      `;
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
  const {
    text,
    realName,
    username,
    cve,
    repoOwner,
    repoName,
    score,
    severity,
    popularity,
    occurences,
  } = parsedReq;
  const severityColour = getSeverityColour(score);
  const cveHtml = `<h1 class="cve" >
                      ${cve}
  </h1>`;

  let html = `<!DOCTYPE html>
  <html>
      <head>
          <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Lato"/>
          <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta2/css/all.min.css"/>
        
          <meta charset="utf-8">
          <title>huntr.dev</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
              ${getCss()}
          </style>
      </head>
      <body >

          <p class="caption">Security Advisory in ${repoOwner} / ${repoName} </p>
          <h1 class="cwe">
              ${text}
          </h1>
        <p class="author">
          by ${realName} –  @${username} 
        </p>
          <div style="-webkit-box-flex: 1;  -moz-box-flex: 1;  -webkit-flex: 1; -ms-flex: 1; flex: 1; ">


</div>
          <img class="mouse" src="https://i.ibb.co/2NzwSSz/mouse-no-shadow.png" />

        <img
          class="avatar"
          src="https://github.com/${username}.png"
        />

        <div  style="display: flex; flex-direction: row; font-size: 1.7rem; border-top: 4px solid ${severityColour}; padding-top: 1.5rem;"> 
          <div class="stat-column">
           <span ><i class="fas fa-signal" style="margin-right: 1.5rem;"></i>Top ${popularity}%</span>  
           <span class="stat-description" style="padding-left: 3.6rem;">Popularity</span>
          </div>
          <div class="stat-column">
            <span><i class="fas fa-radiation" style="margin-right: 1.5rem;"></i>${severity}/5</span>
            <span class="stat-description" style="padding-left: 3.3rem;">Severity</span>
          </div><div class="stat-column">
            <span><i class="fas fa-crosshairs" style="margin-right: 1.5rem;"></i>${occurences}</span>
            <span class="stat-description" style="padding-left: 3.3rem;">Occurences</span>
          </div>
                    `;
  if (cve) html += cveHtml;
  html += `
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
