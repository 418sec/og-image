import { ParsedRequest, vector, permalink, response } from "./types";
import { request, gql } from "graphql-request";
import { parseCvss3Vector } from "vuln-vects";

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
        opacity: 60%;
        font-size: 1.8rem;
        margin: 0;
        width: 75%;

      }

      .cwe {
        font-size: 3.4rem;
        margin: 0;
        margin-top: 1rem;
        width: 75%;
        display: flex;
        min-height: 6.5rem;
      }

            .author {
        color: white;
        opacity: 60%;
        font-size: 1.8rem;
}

      .cve {
     width: 100%;
     text-align: right;
     font-size: 1.8rem;
      margin-top: 0px;
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
        border-radius: 60%;
          border: 6px solid black;
          width: 160px;
          height: 160px;
          position: absolute;
          top: 5.3rem;
          right: 3.6rem;
      }

      .stat-column {
        display: flex; flex-direction: column; margin-right: 4rem;
      }

      .stat-description {
        opacity: 50%; font-size: 1.7rem; margin-top: 0.5rem;
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

function getSeverityScore(score: Number) {
  switch (true) {
    case score === 1:
      return 5;
    case score === 0.8:
      return 4;
    case score === 0.5:
      return 3;
    case score === 0.3:
      return 2;
    case score === 0.1:
      return 1;
    default:
      return 0;
  }
}

async function getVulnerability(id: string) {
  const query = gql`
    query GetVulnerability($id: ID!) {
      query: getVulnerability(id: $id) {
        id
        _author {
          id
          name
          preferred_username
        }
        repository {
          id
          name
          owner
        }
        cvss {
          attack_complexity
          attack_vector
          availability
          confidentiality
          integrity
          privileges_required
          scope
          user_interaction
        }
        cve {
          id
        }
        cwe {
          id
          description
          title
          pricing_multiplier
        }
        new_permalinks {
          items {
            status
          }
        }
      }
    }
  `;
  const vulnerability = await request(
    "https://mnk2smepzzdp5djxpbthzr6odq.appsync-api.eu-west-1.amazonaws.com/graphql",
    query,
    { id },
    { "X-API-KEY": "da2-fql7xoajcng6pilmew4lfbi6ga" }
  ).then((response: response) => response.query);
  return vulnerability;
}

function cvssScore(vectors: vector) {
  const {
    attack_complexity,
    attack_vector,
    availability,
    confidentiality,
    integrity,
    privileges_required,
    scope,
    user_interaction,
  } = vectors;

  const score = parseCvss3Vector(
    `AV:${attack_vector}/AC:${attack_complexity}/PR:${privileges_required}/UI:${user_interaction}/S:${scope}/C:${confidentiality}/I:${integrity}/A:${availability}`
  ).overallScore;
  return score;
}

async function getAdvisoryHtml(parsedReq: ParsedRequest) {
  const { id } = parsedReq;
  const vulnerability = await getVulnerability(id);
  const severityColour = getSeverityColour(cvssScore(vulnerability.cvss));
  const severityScore = getSeverityScore(vulnerability.cwe.pricing_multiplier);
  const occurences = vulnerability?.new_permalinks?.items?.filter(
    (permalink: permalink) => permalink?.status === "valid"
  ).length;
  const cveHtml = `<h1 class="cve">
                      ${vulnerability.cve?.id}
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

          <p class="caption">Vulnerability in ${
            vulnerability.repository.owner
          } / ${vulnerability.repository.name} </p>
          <h1 class="cwe">
          <span style="align-self: center;">
              ${vulnerability.cwe.description || vulnerability.cwe.title}
              </span>
          </h1>
        <p class="author">
          by ${
            vulnerability._author.name ? vulnerability._author.name + ` – ` : ``
          } @${vulnerability._author.preferred_username} 
        </p>
          <div style="-webkit-box-flex: 1;  -moz-box-flex: 1;  -webkit-flex: 1; -ms-flex: 1; flex: 1; ">


</div>
          <img class="mouse" src="https://i.ibb.co/2NzwSSz/mouse-no-shadow.png" />

        <img
          class="avatar"
          src="https://github.com/${
            vulnerability._author.preferred_username
          }.png"
        />

        <div  style="display: flex; flex-direction: row; font-size: 1.8rem; border-top: 4px solid ${severityColour}; padding-top: 1.9rem;"> 
          <div class="stat-column">
           <span style="font-weight: 700;" ><i class="fas fa-signal" style="margin-right: 1.5rem;"></i>Top 34%</span>  
           <span class="stat-description" style="padding-left: 3.6rem;">Popularity</span>
          </div>
          <div class="stat-column">
            <span style="font-weight: 700;"><i class="fas fa-radiation" style="margin-right: 1.5rem;"></i>${severityScore}/5</span>
            <span class="stat-description" style="padding-left: 3.3rem;">Severity</span>
          </div><div class="stat-column">
            <span style="font-weight: 700;"><i class="fas fa-crosshairs" style="margin-right: 1.5rem;"></i>${occurences}</span>
            <span class="stat-description" style="padding-left: 3.3rem;">Occurences</span>
          </div>
                    `;
  if (vulnerability.cve) html += cveHtml;
  html += `
        </div>
    </body>
  </html>`;
  return html;
}

export async function getHtml(parsedReq: ParsedRequest) {
  const { page } = parsedReq;
  let response =
    '<body style="margin: 0; height: 100%; background-color: black;"><img src="https://huntr.dev/img/og_image.png"></img></body>';
  switch (page) {
    case "advisory":
      response = await getAdvisoryHtml(parsedReq);
      break;
    case "profile":
      response = "coming soon :)";
      break;
    default:
      response;
      break;
  }
  return response;
}
