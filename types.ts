
export type Language = 'en' | 'cs' | 'sk';

export interface LanguageOption {
  code: Language;
  name: string;
  flag: string;
}

export interface ParsedContent {
  title: string;
  intro: string;
  keyPoints: string[];
}

export interface GroundingSource {
  web?: {
    uri: string;
    title: string;
  };
}

export interface NewsletterData {
  image: string;
  content: ParsedContent;
  sources: GroundingSource[];
}
