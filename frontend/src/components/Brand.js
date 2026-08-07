export default function Brand({ light = false }) {
  return (
    <div className={`brand ${light ? 'brand-light' : ''}`}>
      <span className="brand-mark">360</span>
      <span>
        <strong>Performance360</strong>
        <small>Performance platform</small>
      </span>
    </div>
  );
}
