import { ParsedRequest, vector } from "./types";
import { request, gql } from 'graphql-request'
import { parseCvss3Vector } from 'vuln-vects';

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

async function getVulnerability(id: string) {
  const query = gql `query GetVulnerability($id: ID!) {
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
      }
    }
  }
  `
  const vulnerability = await request('https://mnk2smepzzdp5djxpbthzr6odq.appsync-api.eu-west-1.amazonaws.com/graphql', query, { id }, { 'X-API-KEY': 'da2-fql7xoajcng6pilmew4lfbi6ga'}).then(response => response.query);
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
    user_interaction
  } = vectors;

  const score = parseCvss3Vector(`AV:${attack_vector}/AC:${attack_complexity}/PR:${privileges_required}/UI:${user_interaction}/S:${scope}/C:${confidentiality}/I:${integrity}/A:${availability}`).overallScore; 
  return score;
}

async function getAdvisoryHtml(parsedReq: ParsedRequest) {
  const { id } = parsedReq;
  const vulnerability = await getVulnerability(id);
  const severityColour = getSeverityColour(cvssScore(vulnerability.cvss)); 
  const cveHtml = `<h1 class="cve" style="background-color: ${severityColour}49; border: 4px solid ${severityColour};">
                      ${vulnerability.cve?.id}
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
          <p class="caption">Security Advisory in ${vulnerability.repository.owner} / ${vulnerability.repository.name}</p>
          <h1 class="cwe">
              ${vulnerability.cwe.description || vulnerability.cwe.title}
          </h1>`;
        if (vulnerability.cve) html += cveHtml;
        html += `
          <img class="mouse" src="https://huntr.dev/_nuxt/image/1329be.svg" />
      
        <p class="author">
          By @${vulnerability._author.preferred_username} (<span class="name">${vulnerability._author.name}</span>)
        </p>
        <img
          style="
            border-radius: 100%;
            width: 180px;
            height: 180px;
            position: absolute;
            bottom: 14rem;
            right: 8.2rem;
          "
          src="https://github.com/${vulnerability._author.preferred_username}.png"
        />
        </div>


    </body>
  </html>`;
  return html;
}

export async function getHtml(parsedReq: ParsedRequest) {
  const { page } = parsedReq;
  let response = '<body style="margin: 0; height: 100%; background-color: black;"><img src="https://huntr.dev/img/og_image.png"></img></body>';
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
