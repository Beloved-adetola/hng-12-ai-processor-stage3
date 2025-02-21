/* eslint-disable @typescript-eslint/no-unused-vars */
// Language Detection
interface LanguageDetectorCapabilities {
  available: "no" | "readily" | "after-download";
  languageAvailable: (language: string) => boolean;
}

interface LanguageDetectionResult {
  detectedLanguage: string;
  confidence: number;
}

interface LanguageDetector {
  detect: (text: string) => Promise<LanguageDetectionResult[]>;
  ready: Promise<void>;
}

//Translation Interfaces
interface TranslatorCapabilities {
  available: "no" | "readily" | "after-download";
  languagePairAvailable: (source: string, target: string) => boolean;
}

interface TranslatorOptions {
  sourceLanguage: string;
  targetLanguage: string;
  monitor?: (monitor: DownloadMonitor) => void;
}

interface Translator {
  translate: (text: string) => Promise<string>;
  ready: Promise<void>;
}

// Summarization Interfaces
interface SummarizerCapabilities {
  available: "no" | "readily" | "after-download";
}

type SummaryType = "key-points" | "tldr" | "teaser" | "headline";
type SummaryFormat = "plain-text";
type SummaryLength = "short" | "medium";

interface Summarize {
  sharedContext?: string;
  type?: SummaryType;
  format?: SummaryFormat;
  length?: SummaryLength;
  monitor?: (monitor: DownloadMonitor) => void;
}

interface SummarizeOptions {
  context?: string;
}

interface Summarizer {
  summarize: (text: string, options?: Summarize) => Promise<string>;
  ready: Promise<void>;
}

// Shared Interfaces
interface DownloadProgressEvent extends Event {
  loaded: number;
  total: number;
}

interface DownloadMonitor {
  addEventListener: (
    event: "downloadprogress",
    callback: (event: DownloadProgressEvent) => void
  ) => void;
  removeEventListener: (
    event: "downloadprogress",
    callback: (event: DownloadProgressEvent) => void
  ) => void;
}

// AI Interfaces
interface ChromeAI {
  languageDetector: {
    capabilities: () => Promise<LanguageDetectorCapabilities>;
    create: (options?: {
      monitor?: (monitor: DownloadMonitor) => void;
    }) => Promise<LanguageDetector>;
  };
  translator: {
    capabilities: () => Promise<TranslatorCapabilities>;
    create: (options: TranslatorOptions) => Promise<Translator>;
  };
  summarizer: {
    capabilities: () => Promise<SummarizerCapabilities>;
    create: (options?: Summarize) => Promise<Summarizer>;
  };
}

// Global Interfaces
interface Global extends Window {
  ai: ChromeAI;
}

declare global {
  interface Window {
    ai: ChromeAI;
  }
}

// Export Interfaces that will be used in the custom hook
export type {
  ChromeAI,
  LanguageDetector,
  Translator,
  Summarizer,
  LanguageDetectionResult,
  TranslatorOptions,
  Summarize,
  SummarizeOptions,
  DownloadProgressEvent,
  DownloadMonitor,
};
