import { useState } from "react";
import useData from "../hooks/useData";
import { Message } from "../services/languageTypes";
import { Languages } from "../services/language";

interface Props {
  messages: Message[];
}

function MessageList({ messages }: Props) {
  const [translationSelections, setTranslationSelections] = useState<{
    [key: number]: string;
  }>({});

  const translate = useData((s) => s.translate);
  const summarize = useData((s) => s.summarize);
  const addTranslatedText = useData((s) => s.addTranslatedText);
  const addSummarizedText = useData((s) => s.addSummarizedText);
  const errors = useData((s) => s.errors);
  const loadingStates = useData((s) => s.isLoading);
  const setError = useData((s) => s.setError);
  const downloadProgress = useData((s) => s.downloadProgress);

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
    <div role="list">
      <div className="message">
        {messages.length === 0 && (
          <div>
            <p>Welcome</p>
          </div>
        )}
        {messages?.map((message: Message) => (
          <div key={message.id} role="listitem">
            <div className="message user">
              <div className="ai-text">
                <p>You</p>
              </div>
              <p>{message.text}</p>
            </div>

            <div className="message ai">
              <div className="ai-text">
                <p>AI</p>
              </div>

              {message.detectedLanguage && (
                <div>
                  <p className="detected-language">
                    Detected Language:
                    <span>{message.detectedLanguage.detectedLanguage}</span>
                  </p>

                  <div>
                    <select
                      title="Select Language"
                      onChange={(e) =>
                        handleLanguageChange(message.id, e.target.value)
                      }
                      value={translationSelections[message.id] || ""}
                      aria-label="Select Target Language"
                      className="select-btn"
                    >
                      <option value="">Select Language</option>
                      {Languages.map((lang) => (
                        <option key={lang.key} value={lang.key}>
                          {lang.name}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() =>
                        handleTranslate(
                          message.id,
                          message.text,
                          message.detectedLanguage.detectedLanguage
                        )
                      }
                      disabled={!translationSelections[message.id]}
                      aria-label="Translate Text"
                    >
                      {loadingStates[message.id] ? (
                        <i
                          className="bx bx-loader-circle bx-spin"
                          style={{ color: "#fff", fontSize: "24px" }}
                        ></i>
                      ) : (
                        "Translate"
                      )}
                    </button>
                    {message.text.length > 150 &&
                      message.detectedLanguage.detectedLanguage === "en" && (
                        <button
                          onClick={() =>
                            handleSummarize(message.id, message.text)
                          }
                          aria-label="Summarize Text"
                        >
                          Summarize
                        </button>
                      )}
                  </div>
                </div>
              )}
              {downloadProgress && (
                <p>
                  Downloading... {downloadProgress.loaded}/{downloadProgress.total}
                </p>
              )}
              {errors[message.id] && (
                <p className="error">{errors[message.id]}</p>
              )}
              {message.translatedText && (
                <p className="translated-text">
                  <b>Translated Text: </b>
                  {message.translatedText}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MessageList;
