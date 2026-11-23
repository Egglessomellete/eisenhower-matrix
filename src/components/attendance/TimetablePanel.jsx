import { useState } from "react";

// index 0..6 matches day_of_week 1..7 (ISO: Monday = 1)
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function TimetablePanel({ subjects, rules, onAdd, onDelete }) {
  const [subjectId, setSubjectId] = useState("");
  const [day, setDay] = useState(1);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");

  const subjectById = Object.fromEntries(subjects.map((s) => [s.id, s]));
  const chosenSubject = subjectId || subjects[0]?.id;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!chosenSubject || !start || !end) return setMessage("Choose a subject, start time and end time.");
    if (end <= start) return setMessage("The end time must be after the start time.");

    const error = await onAdd({
      subject_id: chosenSubject,
      day_of_week: Number(day),
      start_time: start,
      end_time: end,
      room: room.trim() || null,
    });
    if (error) setMessage(error);
    else {
      setMessage("");
      setStart("");
      setEnd("");
      setRoom("");
    }
  }

  if (subjects.length === 0) return <p className="muted">Add a subject first.</p>;

  return (
    <>
      {rules.length === 0 && <p className="muted">No classes yet.</p>}
      {DAYS.map((dayName, i) => {
        const dayRules = rules.filter((r) => r.day_of_week === i + 1);
        if (dayRules.length === 0) return null;
        return (
          <div key={dayName} className="tt-day">
            <div className="tt-day-name">{dayName}</div>
            {dayRules.map((r) => {
              const s = subjectById[r.subject_id];
              return (
                <div className="list-item" key={r.id}>
                  <span>
                    <i className="swatch" style={{ background: s?.color }} />
                    <b>{s?.name}</b>{" "}
                    <span className="muted">
                      {r.start_time.slice(0, 5)} - {r.end_time.slice(0, 5)}
                      {r.room ? ` · ${r.room}` : ""}
                    </span>
                  </span>
                  <button className="btn-ghost" onClick={() => onDelete(r.id)}>Remove</button>
                </div>
              );
            })}
          </div>
        );
      })}

      <form className="att-form" onSubmit={handleSubmit}>
        <div className="field-row">
          <label className="field">
            <span>Subject</span>
            <select className="input" value={chosenSubject} onChange={(e) => setSubjectId(e.target.value)}>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Day</span>
            <select className="input" value={day} onChange={(e) => setDay(e.target.value)}>
              {DAYS.map((d, i) => (
                <option key={d} value={i + 1}>{d}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="field-row">
          <label className="field">
            <span>Start</span>
            <input className="input" type="time" value={start} onChange={(e) => setStart(e.target.value)} />
          </label>
          <label className="field">
            <span>End</span>
            <input className="input" type="time" value={end} onChange={(e) => setEnd(e.target.value)} />
          </label>
          <label className="field">
            <span>Room (optional)</span>
            <input className="input" value={room} onChange={(e) => setRoom(e.target.value)} />
          </label>
        </div>
        <button className="btn-primary">Add class</button>
        {message && <p className="form-msg">{message}</p>}
      </form>
    </>
  );
}

export default TimetablePanel;
