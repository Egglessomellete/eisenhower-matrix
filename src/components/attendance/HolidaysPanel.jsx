import { useState } from "react";
import { format, parseISO } from "date-fns";

const TYPES = ["Holiday", "College holiday", "Festival", "Exam break", "Vacation"];

function HolidaysPanel({ holidays, onAdd, onDelete }) {
  const [date, setDate] = useState("");
  const [label, setLabel] = useState("");
  const [type, setType] = useState(TYPES[0]);
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!date || !label.trim()) return setMessage("Enter a date and a name.");
    const error = await onAdd({ date, label: label.trim(), type });
    if (error) setMessage(error);
    else {
      setMessage("");
      setDate("");
      setLabel("");
    }
  }

  return (
    <>
      {holidays.length === 0 && <p className="muted">No holidays yet.</p>}
      {holidays.map((h) => (
        <div className="list-item" key={h.id}>
          <span>
            <b>{format(parseISO(h.date), "EEE d MMM yyyy")}</b>{" "}
            <span className="muted">{h.label} · {h.type}</span>
          </span>
          <button className="btn-ghost" onClick={() => onDelete(h.id)}>Remove</button>
        </div>
      ))}

      <form className="att-form" onSubmit={handleSubmit}>
        <div className="field-row">
          <label className="field">
            <span>Date</span>
            <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </label>
          <label className="field">
            <span>Name</span>
            <input className="input" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Diwali" />
          </label>
          <label className="field">
            <span>Type</span>
            <select className="input" value={type} onChange={(e) => setType(e.target.value)}>
              {TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
        </div>
        <button className="btn-primary">Add holiday</button>
        {message && <p className="form-msg">{message}</p>}
      </form>
    </>
  );
}

export default HolidaysPanel;
