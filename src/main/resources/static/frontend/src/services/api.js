const BASE_URL = "http://localhost:8080/api";

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json();
  }
  return response.text();
}

export const api = {
  crawl: () => request("/crawl"),
  spellCheck: (word) =>
    request(`/spellcheck?word=${encodeURIComponent(word.trim())}`),
  completeWord: (prefix) =>
    request(`/complete?prefix=${encodeURIComponent(prefix.trim())}`),
  frequencyCount: (word) =>
    request(`/frequency?word=${encodeURIComponent(word.trim())}`),
  searchFrequency: () => request("/search-frequency"),
  rankPages: (keyword) =>
    request(`/rank?keyword=${encodeURIComponent(keyword.trim())}`),
  searchIndex: (keyword) =>
    request(`/search?keyword=${encodeURIComponent(keyword.trim())}`),
  regexValidate: (value, pattern) =>
    request("/regex/validate", {
      method: "POST",
      body: JSON.stringify({ value, pattern })
    }),
  regexPatternFind: (text, type) =>
    request("/regex/pattern", {
      method: "POST",
      body: JSON.stringify({ text, type })
    })
};
