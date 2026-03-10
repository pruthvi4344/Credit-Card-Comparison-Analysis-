export default function Loader({ text = 'Processing...' }) {
  return (
    <div className="loader fade-up">
      <div className="spinner-ring" />
      <span>{text}</span>
    </div>
  );
}