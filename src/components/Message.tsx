import { useState } from "react";
import useData from "../hooks/useData";
import { Message } from "../services/languageTypes";
import { Languages } from "../services/language";

interface Props {
  messages: Message[];
}

function MessageList ({ messages }: Props) {
  const [translationSelections, setTranslationSelections] = useState<{
    [key: number]: string;
  }>({});

  const translate = useData((state) => state.translate);
  const summarize = useData((state) => state.summarize);

  const addTranslatedText = useData((state) => state.addTranslatedText);
  const addSummarizedText = useData((state) => state.addSummarizedText);

  const errors = useData((state) => state.errors);
  const loadingStates = useData((state) => state.isLoading);
  const setError = useData((state) => state.setError);
  const downloadProgress = useData((state) => state.downloadProgress);

  const handleLanguageChange = (messageId: number, language: string) => {
    setTranslationSelections((prev) => ({ ...prev, [messageId]: language }));
  };

  const handleTranslate = async (id: number, text: string, source: string) => {
    try {
      const translatedText = await translate(
        id,
        text,
        source,
        translationSelections[id]
      );

      if (translatedText) {
        console.log(translatedText);
        addTranslatedText(id, translatedText);
      }
    } catch (error) {
      console.error(error);
      setError(id, error.message);
    }
  };

  const handleSummarize = async (id: number, longText: string) => {
    try {
      const summarizedText = await summarize(id, longText);
      addSummarizedText(id, summarizedText);
    } catch (error) {
      alert("Not enabled");
      console.error(error);
      setError(id, error.message);
    }
  };

  return (
    <div className="">
      <div className="message">
        {messages.length == 0 && (
          <div className="">
            <p className="">Welcome</p>
          </div>
        )}
        {messages?.map((message: Message) => (
          <div key={message.id}>
            <div className="message user">
              <div className="">
                <p className="">You</p>
              </div>
              <p> {message.text}</p>
            </div>

            {
              <div className="message ai">
                <div className="">
                  <p className="">AI</p>
                </div>

                {message.detectedLanguage && (
                  <div>
                    <p>
                      <span className="">Detected Language: </span>
                      {message.detectedLanguage.detectedLanguage}
                    </p>

                    <div className="">
                      <select
                        title="Select Language"
                        onChange={(e) =>
                          handleLanguageChange(message.id, e.target.value)
                        }
                        value={translationSelections[message.id] || ""}
                        className=""
                      >
                        <option value="">Select Language</option>
                        {Languages.map((lang) => (
                          <option key={lang.key}>{lang.name}</option>
                        ))}
                      </select>

                      <button
                        onClick={() =>
                          handleTranslate(
                            message.id,
                            message.text,
                            message?.detectedLanguage.detectedLanguage
                          )
                        }
                        disabled={!translationSelections[message.id]}
                        className=""
                      >
                        {loadingStates[message.id]
                          ? "Translating..."
                          : "Translate"}
                      </button>
                      {message.text.length > 150 &&
                        message.detectedLanguage.detectedLanguage == "en" && (
                          <button
                            className=""
                            onClick={() =>
                              handleSummarize(message.id, message.text)
                            }
                          >
                            Summarize
                          </button>
                        )}
                    </div>
                  </div>
                )}
                {downloadProgress && (
                  <p>
                    {downloadProgress.loaded}/{downloadProgress.total}
                  </p>
                )}
                {errors[message.id] && <p className="">{errors[message.id]}</p>}
                {loadingStates[message.id] && <p className="">Loading...</p>}
                {message.translatedText && (
                  <p className="">
                    <span className="">Translated Text: </span>
                    {message?.translatedText}
                  </p>
                )}
              </div>
            }
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessageList;
