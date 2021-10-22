export type FileType = 'png';

export interface ParsedRequest {
    fileType: FileType;
    page: string;
    id: string;
}

export interface vector {
    attack_complexity: string;
    attack_vector: string;
    availability: string;
    confidentiality: string;
    integrity: string;
    privileges_required: string;
    scope: string;
    user_interaction: string;
}