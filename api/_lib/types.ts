export type FileType = 'png' | 'jpeg';

export interface ParsedRequest {
    fileType: FileType;
    page: string;
    text: string;
    realName: string;
    username: string;
    cve: string;
    repoOwner: string;
    repoName: string;
    score: Number;
    country: string;
    tier: string;
    cveCount: Number;
    vulnerabilityCount: Number;
    fixCount: Number;
    hallOfFame: string | string[];    
    badges: string | string[];
}
