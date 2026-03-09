import { useState } from "react";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import SuggestionList from "../components/SuggestionList";
import { api } from "../services/api";

function RegexToolsPage() {
  const [validateValue, setValidateValue] = useState("");
  const [validatePattern, setValidatePattern] = useState("");
  const [validateResult, setValidateResult] = useState("");
  const [validateLoading, setValidateLoading] = useState(false);
  const [validateError, setValidateError] = useState("");

  const [patternType, setPatternType] = useState("email");
  const [patternText, setPatternText] = useState("");
  const [patternMatches, setPatternMatches] = useState([]);
  const [patternLoading, setPatternLoading] = useState(false);
  const [patternError, setPatternError] = useState("");

  const handleValidate = async (event) => {
    event.preventDefault();
    if (!validateValue.trim() || !validatePattern.trim()) return;

    setValidateLoading(true);
    setValidateError("");
    setValidateResult("");
    try {
      const response = await api.regexValidate(validateValue, validatePattern);
      if (typeof response === "string") {
        setValidateResult(response);
      } else {
        setValidateResult(
          response.message ??
            `Valid: ${response.valid ?? response.isValid ?? "unknown"}`
        );
      }
    } catch (err) {
      setValidateError(err.message || "Regex validation failed.");
    } finally {
      setValidateLoading(false);
    }
  };

  const handlePatternSearch = async (event) => {
    event.preventDefault();
    if (!patternText.trim()) return;

    setPatternLoading(true);
    setPatternError("");
    try {
      const response = await api.regexPatternFind(patternText, patternType);
      if (Array.isArray(response)) {
        setPatternMatches(response.map(String));
      } else if (Array.isArray(response?.matches)) {
        setPatternMatches(response.matches.map(String));
      } else if (typeof response === "string") {
        setPatternMatches([response]);
      } else {
        setPatternMatches(Object.values(response || {}).map(String));
      }
    } catch (err) {
      setPatternError(err.message || "Pattern finder failed.");
    } finally {
      setPatternLoading(false);
    }
  };

  return (
    <section className="page">
      <div className="page-header">
        <h2>Regex Tools</h2>
        <p>Validate input patterns and extract emails, phone numbers, and URLs.</p>
      </div>

      <div className="two-col">
        <article className="panel">
          <h3>Regex Validation</h3>
          <form className="stacked-form" onSubmit={handleValidate}>
            <label>Input value</label>
            <input
              type="text"
              value={validateValue}
              onChange={(event) => setValidateValue(event.target.value)}
              placeholder="Enter value"
            />
            <label>Regex pattern</label>
            <input
              type="text"
              value={validatePattern}
              onChange={(event) => setValidatePattern(event.target.value)}
              placeholder="e.g. ^[a-zA-Z]+$"
            />
            <button type="submit" className="primary-btn">
              Validate
            </button>
          </form>
          {validateLoading && <Loader text="Validating..." />}
          <ErrorMessage message={validateError} />
          {validateResult && <p className="result-text">{validateResult}</p>}
        </article>

        <article className="panel">
          <h3>Pattern Finder</h3>
          <form className="stacked-form" onSubmit={handlePatternSearch}>
            <label>Pattern type</label>
            <select
              value={patternType}
              onChange={(event) => setPatternType(event.target.value)}
            >
              <option value="email">Email</option>
              <option value="phone">Phone Number</option>
              <option value="url">URL</option>
            </select>
            <label>Input text</label>
            <textarea
              rows={5}
              value={patternText}
              onChange={(event) => setPatternText(event.target.value)}
              placeholder="Paste text to find matching patterns..."
            />
            <button type="submit" className="primary-btn">
              Find Pattern
            </button>
          </form>
          {patternLoading && <Loader text="Searching patterns..." />}
          <ErrorMessage message={patternError} />
          <SuggestionList
            items={patternMatches}
            emptyMessage="No pattern matches found."
          />
        </article>
      </div>
    </section>
  );
}

export default RegexToolsPage;
