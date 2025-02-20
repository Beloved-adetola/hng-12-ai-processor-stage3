interface DownloadProgress {
  loaded: number;
  total: number;
}

export interface LanguageDetectionResult {
  detectedLanguage: string;
  confidence: number;
}

export interface TranslationResult {
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
}

export interface SummaryResult {
  summary: string;
}

export interface Message {
  id: number;
  text: string;
  detectedLanguage: LanguageDetectionResult;
  translatedText?: string;
  summary: string;
}

export interface LanguageState {
  downloadProgress: DownloadProgress | null;
  outputText: string;
  detectedLanguage: Promise<LanguageDetectionResult> | null;

  messages: Message[];

  isLoading: { [key: number]: boolean };
  errors: { [key: number]: null | string };
}

export interface LanguageAction {
  addMessage?: (
    id: number,
    text: string,
    detectedLanguage?: LanguageDetectionResult
  ) => void;
  addTranslatedText: (id: number, text: string) => void;
  addSummarizedText: (id: number, text: string) => void;

  setDownloadProgress: (progress: DownloadProgress) => void;
  detectLanguage: (
    id: number,
    text: string
  ) => Promise<LanguageDetectionResult | undefined>;
  translate: (
    id: number,
    text: string,
    source: string,
    target: string
  ) => Promise<string>;
  summarize?: (id: number, text: string) => Promise<string>;
  clearError: () => void;
  setError?: (id: number, error: string) => void;
  setMessage?: (message: Partial<Message>) => void;
}
