import { useState } from "react";

function SemesterForm({ semester, onSave }) {
  const [name, setName] = useState(semester?.name ?? "");
  const [start, setStart] = useState(semester?.start_date ?? "");
  const [end, setEnd] = useState(semester?.end_date ?? "");
  const [target, setTarget] = useState(semester?.default_target_percent ?? 75);
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !start || !end) return setMessage("Fill in every field.");
    if (end <= start) return setMessage("The end date must be after the start date.");

    const error = await onSave({
      name: name.trim(),
      start_date: start,
      end_date: end,
      default_target_percent: Number(target),
    });
    setMessage(error ?? "Saved.");
  }

  return (
    <form className="att-form" onSubmit={handleSubmit}>
      <label className="field">
        <span>Name</span>
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Semester 5" />
      </label>
      <div className="field-row">
        <label className="field">
          <span>Start date</span>
          <input className="input" type="date" value={start} onChange={(e) => setStart(e.target.value)} />
        </label>
        <label className="field">
          <span>End date</span>
          <input className="input" type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
        </label>
      </div>
      <label className="field">
        <span>Default target attendance (%)</span>
        <input className="input" type="number" min="1" max="100" value={target} onChange={(e) => setTarget(e.target.value)} />
      </label>
      <button className="btn-primary">{semester ? "Save changes" : "Create semester"}</button>
      {message && <p className="form-msg">{message}</p>}
    </form>
  );
}

export default SemesterForm;
