const BASE = 'http://localhost:8080';

async function req(url, opts = {}) {
  try {
    const res = await fetch(`${BASE}${url}`, {
      headers: { 'Content-Type': 'application/json', ...opts.headers },
      ...opts,
    });
    if (!res.ok) throw new Error(`${res.status} - ${res.statusText}`);
    const text = await res.text();
    if (!text) return null;
    try { return JSON.parse(text); } catch { return text; }
  } catch (e) {
    throw new Error(e.message || 'Network error - is the backend running?');
  }
}

const api = {
  crawl:           (banks = []) => {
    if (!banks.length) return req('/api/crawl');
    const params = new URLSearchParams();
    banks.forEach((bank) => params.append('banks', bank));
    return req(`/api/crawl?${params.toString()}`);
  },
  cards:           ()         => req('/api/cards'),
  bankAnalytics:   ()         => req('/api/analytics/banks'),
  htmlParse:       (url)      => req(`/api/html/parse?url=${encodeURIComponent(url)}`),
  spellCheck:      (word)     => req(`/api/spell/check?word=${encodeURIComponent(word)}`),
  complete:        (prefix)   => req(`/api/complete?prefix=${encodeURIComponent(prefix)}`),
  frequency:       (word)     => req(`/api/frequency?word=${encodeURIComponent(word)}`),
  searchFrequency: ()         => req('/api/search-frequency'),
  rank:            (keyword)  => req(`/api/rank?keyword=${encodeURIComponent(keyword)}`),
  search:          (keyword)  => req(`/api/search?keyword=${encodeURIComponent(keyword)}`),
  regexValidate:   (body)     => req('/api/regex/validate', { method: 'POST', body: JSON.stringify(body) }),
  regexPattern:    (body)     => req('/api/regex/pattern',  { method: 'POST', body: JSON.stringify(body) }),
};

export default api;
