import { create } from "zustand";
import {
  LanguageAction,
  LanguageState,
  Message,
} from "../services/languageTypes";
import { Summarize } from "../services/ai";

const useData = create<LanguageAction & LanguageState>()((set, get) => ({
  outputText: "",
  detectedLanguage: null,
  isLoading: {},
  errors: {},
  downloadProgress: null,
  messages: [],

  clearError: () => set({ errors: null }),
  setError: (id, error) =>
    set((state) => ({
      errors: { ...state.errors, [id]: error },
    })),
  setDownloadProgress: (progress) => set({ downloadProgress: progress }),

  addMessage: (id, text, detectedLanguage) => {
    set((state) => ({
      messages: [
        ...state.messages,
        { id, text, detectedLanguage, translatedText: "", summary: "" },
      ],
    }));
  },
  addTranslatedText: (id, translatedText) => {
    return set((state) => ({
      messages: state?.messages?.map((msg: Message) =>
        msg.id == id ? { ...msg, translatedText } : msg
      ),
    }));
  },
  addSummarizedText: (id, summary) => {
    set((state) => ({
      messages: state.messages.map((msg: Message) =>
        msg.id == id ? { ...msg, summary } : msg
      ),
    }));
  },

  detectLanguage: async (id, text) => {
    set((state) => ({
      isLoading: { ...state.isLoading, [id]: true },
      errors: { ...state.errors, [id]: null },
    }));
    try {
      if (!("ai" in self && "languageDetector" in self.ai)) {
        throw new Error("Language detection API not available");
      }
      const capabilities = await self.ai.languageDetector.capabilities();

      if (capabilities.available == "no") {
        throw new Error("The language detector isn't usable");
      }
      if (capabilities.available == "readily") {
        console.log("Language detector is active");
      }
      const detector = await self.ai.languageDetector.create(
        capabilities.available === "after-download"
          ? {
              monitor(m) {
                m.addEventListener("downloadprogress", (e) => {
                  set({
                    downloadProgress: {
                      loaded: e.loaded,
                      total: e.total,
                    },
                  });
                });
              },
            }
          : undefined
      );

      await detector.ready;
      const results = await detector.detect(text);

      if (results.length > 0) {
        return results[0];
        const timeout = setTimeout(() => {}, 1000);

        clearTimeout(timeout);
      }
    } catch (error) {
      set((state) => ({
        errors: {
          ...state.errors,
          [id]: error instanceof Error ? error.message : "An error occurred",
        },
      }));
    } finally {
      set((state) => ({
        isLoading: {
          ...state.isLoading,
          [id]: false,
        },
      }));
    }
  },
  translate: async (id, text, source, target) => {
    set((state) => ({
      isLoading: { ...state.isLoading, [id]: true },
      errors: { ...state.errors, [id]: null },
    }));
    try {
      let translator;
      console.log("ai" in self && "translator" in self.ai);

      if (!("ai" in self && "translator" in self.ai)) {
        throw new Error("The translator API isn't available");
      }

      const translatorCapabilities = await self.ai.translator.capabilities();
      console.log(translatorCapabilities.languagePairAvailable(source, target));

      if (translatorCapabilities.available == "no") {
        throw new Error("You need to enable the translator API");
      }

      if (!translatorCapabilities.languagePairAvailable(source, target)) {
        throw new Error("Language pair can't be translated");
      }
      if (translatorCapabilities.available == "readily") {
        translator = await self.ai.translator.create({
          sourceLanguage: source,
          targetLanguage: target,
        });
        console.log(translator);
      } else if (translatorCapabilities.available == "after-download") {
        translator = await self.ai.languageDetector.create({
          monitor(m) {
            m.addEventListener("downloadprogress", (e) => {
              set({
                downloadProgress: {
                  loaded: e.loaded,
                  total: e.total,
                },
              });
              console.log(get().downloadProgress);
            });
          },
        });
      }
      await translator?.ready;
      const result = await translator?.translate(text);

      return result;
    } catch (error) {
      set((state) => ({
        errors: {
          ...state.errors,
          [id]:
            error instanceof Error
              ? error.message
              : "An error occurred while translating",
        },
      }));
    } finally {
      set((state) => ({
        isLoading: { ...state.isLoading, [id]: false },
      }));
    }
  },

  summarize: async (id, longText) => {
    set((state) => ({
      isLoading: { ...state.isLoading, [id]: true },
      errors: { ...state.errors, [id]: null },
    }));
    try {
      let summarizer;

      if (!("ai" in self && "summarizer" in self.ai)) {
        throw new Error("Not supported");
      }

      const settings: Summarize = {
        sharedContext: "This is a website documentation",
        type: "headline",
        format: "plain-text",
        length: "medium",
      };

      const capabilities = await self.ai.summarizer.capabilities();

      if (capabilities.available == "no") {
        throw new Error("The Summarizer API isn't usable.");
      }
      if (capabilities.available == "readily") {
        summarizer = await self.ai.summarizer.create(settings);
      } else {
        summarizer = await self.ai.summarizer.create(settings);
        summarizer.addEventListener("downloadprogress", (e) => {
          console.log(e.loaded, e.total);
        });
        await summarizer.ready;
      }
      const summary = await summarizer.summarize(longText, {
        context: "Make it self-explanatory",
      });

      return summary;
    } catch (error) {
      set((state) => ({
        errors: {
          ...state.errors,
          [id]: error instanceof Error ? error.message : "An error occurred",
        },
      }));
    } finally {
      set((state) => ({
        isLoading: { ...state.isLoading, [id]: false },
      }));
    }
  },
}));

export default useData;
