export default function FeatureCard({ icon, name, desc, api: apiLabel, onClick }) {
  return (
    <div className="feat-card" onClick={onClick}>
      <div className="feat-card-icon">{icon}</div>
      <div>
        <div className="feat-card-name">{name}</div>
        <div className="feat-card-desc">{desc}</div>
      </div>
      {apiLabel && <span className="feat-card-api">{apiLabel}</span>}
    </div>
  );
}