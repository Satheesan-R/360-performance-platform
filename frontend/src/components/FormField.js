export default function FormField({ label, error, hint, ...props }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input className={error ? 'input-error' : ''} {...props} />
      {error ? <small className="field-error">{error}</small> : hint ? <small>{hint}</small> : null}
    </label>
  );
}
