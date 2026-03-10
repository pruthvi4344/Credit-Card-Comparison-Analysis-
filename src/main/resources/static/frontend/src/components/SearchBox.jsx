import { useRef } from 'react';

export default function SearchBox({ value, onChange, onSearch, placeholder = 'Enter keyword...', loading, btnLabel = 'Search' }) {
  const inputRef = useRef();

  return (
    <div className="input-row">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && !loading && onSearch()}
        placeholder={placeholder}
        autoComplete="off"
        spellCheck={false}
      />
      <button
        className="btn btn-primary"
        onClick={onSearch}
        disabled={loading || !value.trim()}
      >
        {loading
          ? <><span className="spinner-sm" /> Running</>
          : <>{btnLabel}</>}
      </button>
    </div>
  );
}