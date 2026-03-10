export default function ErrorMessage({ message }) {
  if (!message) return null;
  return (
    <div className="alert alert-error fade-up">
      <span className="alert-icon">⚠</span>
      <span>{message}</span>
    </div>
  );
}