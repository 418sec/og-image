import { IncomingMessage } from 'http';
import { parse } from 'url';
import { ParsedRequest } from './types';

export function parseRequest(req: IncomingMessage) {
    console.log('HTTP ' + req.url);
    const { pathname, query } = parse(req.url || '/', true);
    const { page, realName, username, cve, repoOwner, repoName, score } = (query || {});
    
    const arr = (pathname || '/').slice(1).split('.');
    let extension = '';
    let text = '';
    if (arr.length === 0) {
        text = '';
    } else if (arr.length === 1) {
        text = arr[0];
    } else {
        extension = arr.pop() as string;
        text = arr.join('.');
    }

    const parsedRequest: ParsedRequest = {
        fileType: extension === 'jpeg' ? extension : 'png',
        page: String(page),
        text: decodeURIComponent(text),
        realName: String(realName),
        username: String(username),
        cve: String(cve),
        repoOwner: String(repoOwner),
        repoName: String(repoName),
        score: Number(score)
    };

    return parsedRequest;
}
