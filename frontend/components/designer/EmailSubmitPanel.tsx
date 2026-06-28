export function EmailSubmitPanel() {
  return (
    <div className="form-stack">
      <label className="form-label">
        <span className="muted-label">Email</span>
        <input
          className="form-input"
          placeholder="you@example.com"
          type="email"
        />
      </label>
      <button
        className="btn-primary w-full px-4"
        type="button"
      >
        Generate & Send Pass
      </button>
    </div>
  );
}
