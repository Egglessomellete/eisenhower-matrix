import { useEffect, useRef, useState } from "react";
import { CATEGORY } from "../../constants";

function Task({ onAdd }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("Habit");
  const inputEl = useRef();

  function handleSubmit(e) {
    e.preventDefault();
    if (!name) return;
    onAdd({ name, type }); // the database generates the id
    setName("");
    setType("Habit");
  }

  useEffect(function () {
    function callback(e) {
      if (e.code === "Escape") inputEl.current?.blur();
      if (document.activeElement === inputEl.current) return;
      if (e.code === "Enter") inputEl.current.focus();
    }
    document.addEventListener("keydown", callback);
    return () => document.removeEventListener("keydown", callback);
  }, []);

  return (
    <form className="task-form " onSubmit={handleSubmit}>
      <input
        value={name}
        type="text"
        placeholder="Enter a task"
        className="task-form input"
        onChange={(e) => setName(e.target.value)}
        ref={inputEl}
      />
      <select
        className="task-form select"
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        {Object.keys(CATEGORY).map((x) => (
          <option key={x}>{x}</option>
        ))}
      </select>
      <button className="add-btn">ADD TASK</button>
    </form>
  );
}

export default Task;
