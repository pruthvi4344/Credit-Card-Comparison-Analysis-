function SearchBox({
  label,
  value,
  onChange,
  placeholder,
  buttonText = "Submit",
  onSubmit
}) {
  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form className="search-box" onSubmit={handleSubmit}>
      <label>{label}</label>
      <div className="search-row">
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
        />
        <button type="submit">{buttonText}</button>
      </div>
    </form>
  );
}

export default SearchBox;
