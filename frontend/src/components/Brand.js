export default function Brand({ light = false }) {
  return (
    <div className={`brand ${light ? 'brand-light' : ''}`}>
      <span className="brand-mark">360</span>
      <span>
        <strong>PeoplePulse</strong>
        <small>Performance platform</small>
      </span>
    </div>
  );
}
