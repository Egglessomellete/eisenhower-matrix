import { useState } from "react";

const EMPTY = { name: "", code: "", target: "", color: "#3b82f6" };

function SubjectsPanel({ subjects, onAdd, onUpdate, onRemove }) {
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  function setField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function startEdit(subject) {
    setEditingId(subject.id);
    setForm({
      name: subject.name,
      code: subject.code ?? "",
      target: subject.target_percent ?? "",
      color: subject.color,
    });
  }

  function reset() {
    setEditingId(null);
    setForm(EMPTY);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) return;

    const values = {
      name: form.name.trim(),
      code: form.code.trim() || null,
      target_percent: form.target === "" ? null : Number(form.target),
      color: form.color,
    };
    const error = editingId ? await onUpdate(editingId, values) : await onAdd(values);
    if (error) setMessage(error);
    else {
      setMessage("");
      reset();
    }
  }

  async function handleRemove(subject) {
    if (!window.confirm(`Remove ${subject.name}? Its attendance history is kept.`)) return;
    const error = await onRemove(subject.id);
    if (error) setMessage(error);
  }

  return (
    <>
      {subjects.length === 0 && <p className="muted">No subjects yet.</p>}
      {subjects.map((s) => (
        <div className="list-item" key={s.id}>
          <span>
            <i className="swatch" style={{ background: s.color }} />
            <b>{s.name}</b> <span className="muted">{s.code} {s.target_percent ? `· target ${s.target_percent}%` : ""}</span>
          </span>
          <span className="list-actions">
            <button className="btn-ghost" onClick={() => startEdit(s)}>Edit</button>
            <button className="btn-ghost" onClick={() => handleRemove(s)}>Remove</button>
          </span>
        </div>
      ))}

      <form className="att-form" onSubmit={handleSubmit}>
        <div className="field-row">
          <label className="field">
            <span>Subject name</span>
            <input className="input" value={form.name} onChange={(e) => setField("name", e.target.value)} placeholder="DBMS" />
          </label>
          <label className="field">
            <span>Code (optional)</span>
            <input className="input" value={form.code} onChange={(e) => setField("code", e.target.value)} />
          </label>
        </div>
        <div className="field-row">
          <label className="field">
            <span>Target % (blank = semester default)</span>
            <input className="input" type="number" min="1" max="100" value={form.target} onChange={(e) => setField("target", e.target.value)} />
          </label>
          <label className="field">
            <span>Colour</span>
            <input className="input color-input" type="color" value={form.color} onChange={(e) => setField("color", e.target.value)} />
          </label>
        </div>
        <div className="field-row">
          <button className="btn-primary">{editingId ? "Save subject" : "Add subject"}</button>
          {editingId && (
            <button type="button" className="btn-ghost" onClick={reset}>Cancel</button>
          )}
        </div>
        {message && <p className="form-msg">{message}</p>}
      </form>
    </>
  );
}

export default SubjectsPanel;
