export interface RepoLink {
  type: string;
  url: string;
  label?: string;
}

export interface RepoProps {
  name: string;
  id?: string;
  html_url?: string | null;
  description: string | null;
  topics: string[] | null;
  language: string | null;
  homepage: string | null;
  links?: RepoLink[] | null;
  created_at?: string | null;
  updated_at?: string | null;
  pushed_at?: string | null;
  displayName: string | null;
  previewImage: string | null;
  featured: boolean;
  [key: string]: any; // Allow additional custom fields
}
