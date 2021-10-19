export type FileType = 'png' | 'jpeg';
export type Theme = 'light' | 'dark';

export interface ParsedRequest {
    fileType: FileType;
    text: string;
    realName: string;
    username: string;
    cve: string;
    repoOwner: string;
    repoName: string;
    score: Number;
}
