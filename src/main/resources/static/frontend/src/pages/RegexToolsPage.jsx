import { useState } from 'react';
import api from '../services/api.js';
import ErrorMessage from '../components/ErrorMessage.jsx';
import Loader from '../components/Loader.jsx';

const VALIDATION_TYPES = [
  {
    id: 'email',
    label: 'Email',
    placeholder: 'e.g. user@example.com',
    patternHint: 'Uses built-in email regex validation.',
  },
  {
    id: 'phone',
    label: 'Phone',
    placeholder: 'e.g. (987) 654-3210 or +1-987-654-3210',
    patternHint: 'Uses built-in phone number regex validation.',
  },
];

const PATTERN_TYPES = [
  { id: 'email', label: 'Email', placeholder: 'Paste text containing emails...' },
  { id: 'phone', label: 'Phone', placeholder: 'Paste text containing phone numbers...' },
  { id: 'url', label: 'URL', placeholder: 'Paste text containing URLs...' },
];

export default function RegexToolsPage() {
  const [tab, setTab] = useState('validate');

  const [vInput, setVInput] = useState('');
  const [vPattern, setVPattern] = useState('');
  const [vType, setVType] = useState('email');
  const [vResult, setVResult] = useState(null);
  const [vLoading, setVLoading] = useState(false);
  const [vErr, setVErr] = useState('');

  const [pText, setPText] = useState('');
  const [pType, setPType] = useState('email');
  const [pResult, setPResult] = useState(null);
  const [pLoading, setPLoading] = useState(false);
  const [pErr, setPErr] = useState('');

  const validate = async () => {
    if (!vInput.trim()) return;
    setVLoading(true);
    setVErr('');
    setVResult(null);
    try {
      const data = await api.regexValidate({ input: vInput, pattern: vPattern || undefined, type: vType });
      setVResult(data);
    } catch (e) {
      setVErr(e.message);
    } finally {
      setVLoading(false);
    }
  };

  const findPattern = async () => {
    if (!pText.trim()) return;
    setPLoading(true);
    setPErr('');
    setPResult(null);
    try {
      const data = await api.regexPattern({ text: pText, type: pType });
      setPResult(data);
    } catch (e) {
      setPErr(e.message);
    } finally {
      setPLoading(false);
    }
  };

  const isValid = vResult?.valid ?? vResult?.isValid ?? (typeof vResult === 'boolean' ? vResult : null);
  const matches = Array.isArray(pResult)
    ? pResult
    : pResult?.matches || pResult?.results || pResult?.found || [];

  const curPlaceholder = PATTERN_TYPES.find((p) => p.id === pType)?.placeholder || '';
  const currentValidation = VALIDATION_TYPES.find((item) => item.id === vType) || VALIDATION_TYPES[0];

  return (
    <div>
      <div className="page-header fade-up">
        <div className="page-eyebrow">Validation</div>
        <div className="page-title">Regex Tools</div>
        <div className="page-sub">Validate input patterns and extract structured data from text</div>
      </div>

      <div className="tabs fade-up fade-up-1">
        {[
          { id: 'validate', label: 'Validator' },
          { id: 'pattern', label: 'Pattern Finder' },
        ].map((t) => (
          <button
            key={t.id}
            className={`tab ${tab === t.id ? 'active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'validate' && (
        <div className="fade-up">
          <div className="card mb-4">
            <div className="card-label">POST /api/regex/validate</div>
            <div className="card-title">Input Validator</div>
            <div className="card-desc">Choose a validation type and test whether the input matches the backend regex.</div>

            <div className="field">
              <label>Validation Type</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {VALIDATION_TYPES.map((item) => (
                  <button
                    key={item.id}
                    className={`btn ${vType === item.id ? 'btn-cyan' : 'btn-secondary'} btn-sm`}
                    onClick={() => setVType(item.id)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="field">
              <label>Input Text</label>
              <input
                type="text"
                value={vInput}
                onChange={(e) => setVInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && validate()}
                placeholder={currentValidation.placeholder}
                autoFocus
              />
            </div>

            <div className="field">
              <label>Custom Pattern (optional - overrides built-in {currentValidation.label.toLowerCase()} regex)</label>
              <input
                type="text"
                value={vPattern}
                onChange={(e) => setVPattern(e.target.value)}
                placeholder="Leave blank to use the built-in regex pattern"
                style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}
              />
              <div className="muted-mini">{currentValidation.patternHint}</div>
            </div>

            <button className="btn btn-primary" onClick={validate} disabled={vLoading || !vInput.trim()}>
              {vLoading ? <><span className="spinner-sm" /> Validating</> : 'Validate'}
            </button>
            <ErrorMessage message={vErr} />
          </div>

          {vLoading && <Loader text="Running validation..." />}

          {!vLoading && vResult !== null && (
            <div className="card fade-up">
              <div className="card-label">Result</div>
              {isValid !== null ? (
                <div className={`val-result ${isValid ? 'val-valid' : 'val-invalid'}`}>
                  <div className="val-icon">{isValid ? 'OK' : 'X'}</div>
                  <div>
                    <div className="val-status">{isValid ? 'VALID' : 'INVALID'}</div>
                    <div className="val-detail">
                      Type: <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-200)' }}>{vResult?.type || vType}</code>
                    </div>
                    <div className="val-detail">
                      Input: <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-200)' }}>{vInput}</code>
                    </div>
                    {vResult?.pattern && (
                      <div className="val-detail">
                        Pattern: <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-200)' }}>{vResult.pattern}</code>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <div className="card-title" style={{ marginBottom: 10 }}>Raw Response</div>
                  <div className="code">{JSON.stringify(vResult, null, 2)}</div>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {tab === 'pattern' && (
        <div className="fade-up">
          <div className="card mb-4">
            <div className="card-label">POST /api/regex/pattern</div>
            <div className="card-title">Pattern Extractor</div>
            <div className="card-desc">Extract emails, phone numbers, or URLs from any block of text</div>

            <div className="field">
              <label>Pattern Type</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {PATTERN_TYPES.map((p) => (
                  <button
                    key={p.id}
                    className={`btn ${pType === p.id ? 'btn-cyan' : 'btn-secondary'} btn-sm`}
                    onClick={() => setPType(p.id)}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="field">
              <label>Input Text</label>
              <textarea
                value={pText}
                onChange={(e) => setPText(e.target.value)}
                placeholder={curPlaceholder}
              />
            </div>

            <button className="btn btn-cyan" onClick={findPattern} disabled={pLoading || !pText.trim()}>
              {pLoading ? <><span className="spinner-sm" /> Extracting</> : `Find ${pType.charAt(0).toUpperCase() + pType.slice(1)}s`}
            </button>
            <ErrorMessage message={pErr} />
          </div>

          {pLoading && <Loader text="Extracting patterns..." />}

          {!pLoading && pResult !== null && (
            <div className="card fade-up">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div>
                  <div className="card-label">Extracted</div>
                  <div className="card-title" style={{ marginBottom: 0 }}>
                    {pType.charAt(0).toUpperCase() + pType.slice(1)}s Found
                  </div>
                </div>
                <span className="badge badge-cyan">{matches.length} results</span>
              </div>

              {matches.length === 0 ? (
                <div className="empty" style={{ padding: '30px 0' }}>
                  <div className="empty-icon">*</div>
                  <div className="empty-title">No {pType}s found in the provided text</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {matches.map((m, i) => (
                    <div key={i} className="code" style={{ padding: '8px 14px' }}>
                      <span style={{ color: 'var(--text-400)', marginRight: 12, fontSize: 10 }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {typeof m === 'string' ? m : JSON.stringify(m)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
