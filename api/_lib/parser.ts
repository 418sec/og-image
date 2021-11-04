import { IncomingMessage } from "http";
import { parse } from "url";
import { ParsedRequest } from "./types";

export function parseRequest(req: IncomingMessage) {
  console.log("HTTP " + req.url);
  const { pathname, query } = parse(req.url || "/", true);
  const {
    page,
    realName,
    username,
    cve,
    repoOwner,
    repoName,
    score,
    country,
    tier,
    cveCount,
    vulnerabilityCount,
    fixCount,
    hallOfFame,
    badges,
    occurences,
    severity,
    popularity,
  } = query || {};

  const arr = (pathname || "/").slice(1).split(".");
  let extension = "";
  let text = "";
  if (arr.length === 0) {
    text = "";
  } else if (arr.length === 1) {
    text = arr[0];
  } else {
    extension = arr.pop() as string;
    text = arr.join(".");
  }

  const parsedRequest: ParsedRequest = {
    fileType: extension === "jpeg" ? extension : "png",
    page: String(page),
    text: decodeURIComponent(text),
    realName: String(realName),
    username: String(username),
    cve: String(cve),
    repoOwner: String(repoOwner),
    repoName: String(repoName),
    score: Number(score),
    country: String(country),
    tier: String(tier),
    occurences: Number(occurences),
    severity: Number(severity),
    popularity: Number(popularity),
    cveCount: Number(cveCount),
    vulnerabilityCount: Number(vulnerabilityCount),
    fixCount: Number(fixCount),
    hallOfFame: (hallOfFame as string).split("|"),
    badges: (badges as string).split("|"),
  };

  return parsedRequest;
}
