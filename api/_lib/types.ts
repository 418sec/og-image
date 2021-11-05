export type FileType = "png";

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

export interface permalink {
  status: string;
}
export interface response {
  query: {
    _author: {
      id: string;
      name: string;
      preferred_username: string;
    };
    cve: {
      id: string;
    };
    repository: {
      id: string;
      name: string;
      owner: string;
    };
    cwe: {
      pricing_multiplier: number;
      id: string;
      description: string;
      title: string;
    };
    cvss: {
      attack_complexity: string;
      attack_vector: string;
      availability: string;
      confidentiality: string;
      integrity: string;
      privileges_required: string;
      scope: string;
      user_interaction: string;
    };
    new_permalinks: {
      items: [
        {
          status: string;
        }
      ];
    };
  };
}
