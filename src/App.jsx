import { useEffect, useRef, useState } from "react";

import "./App.css";

const App = () => {
  const category = {
    "Urgent and Important": "green",
    "Urgent not Important": "blue",
    "Important not Urgent": "orange",
    Habit: "pink",
  };

  function handleAdd(newtask) {
    setTasks((tasks) => [...tasks, newtask]);
  }
  function handleDeleteitem(id) {
    setTasks((tasks) => tasks.filter((task) => task.id !== id));
  }

  function handleToggleItem(id) {
    setTasks((tasks) =>
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  }
  const [tasks, setTasks] = useState(function () {
    const storedValue = localStorage.getItem("tasks");
    return storedValue ? JSON.parse(storedValue) : [];
  });
  useEffect(
    function () {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    },
    [tasks],
  );
  return (
    <div>
      <Header />
      <Task onAdd={handleAdd} category={category} />
      <Matrix
        tasks={tasks}
        category={category}
        handleDeleteitem={handleDeleteitem}
        handleToggleItem={handleToggleItem}
      />
    </div>
  );
};

function Header() {
  return (
    <header>
      <h1>Eisenhower Matrix</h1>
    </header>
  );
}
function Task({ onAdd, category }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("Habit");
  const inputEl = useRef();
  function handleSubmit(e) {
    e.preventDefault();
    if (!name) return;
    const newitem = { id: crypto.randomUUID(), name, type, completed: false };
    onAdd(newitem);

    setName("");
    setType("Habit");
  }
  useEffect(function () {
    function callback(e) {
      console.log("Key pressed:", e.code);
      if (e.code === "Escape") {
        inputEl.current?.blur();
      }
      if (document.activeElement === inputEl.current) return;
      if (e.code === "Enter") {
        inputEl.current.focus();
      }
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
      ></input>
      <select
        name=""
        id=""
        className="task-form select"
        value={type}
        onChange={(e) => {
          setType(e.target.value);
        }}
      >
        {Object.keys(category).map((x) => (
          <option key={x}>{x}</option>
        ))}
      </select>
      <button className="add-btn">ADD TASK</button>
    </form>
  );
}
function Matrix({ tasks, category, handleDeleteitem, handleToggleItem }) {
  return (
    <div className="matrix">
      {Object.entries(category).map(([name, color], i) => (
        <Card
          tasks={tasks}
          name={name}
          handleDeleteitem={handleDeleteitem}
          handleToggleItem={handleToggleItem}
          color={color}
          index={i + 1}
          key={i}
        />
      ))}
    </div>
  );
}
function Card({
  tasks,
  name,
  color,
  index,
  handleDeleteitem,
  handleToggleItem,
}) {
  const filteredArr = tasks.filter((task) => task.type === name);

  return (
    <div className={`card ${color}`}>
      <div className="card-header">
        <div className="card-title">
          <span className="number">{index}</span>
          <div>
            <h2>{name}</h2>
            {filteredArr.map((x) => (
              <List
                x={x}
                key={x.name}
                handleDeleteitem={handleDeleteitem}
                handleToggleItem={handleToggleItem}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function List({ x, handleDeleteitem, handleToggleItem }) {
  return (
    <div className="task-list">
      <div className="task">
        <div className="task-left">
          <input
            type="checkbox"
            checked={x.completed}
            onChange={() => handleToggleItem(x.id)}
          />

          <span style={x.completed ? { textDecoration: "line-through" } : {}}>
            {x.name}
          </span>
          <div className="actions">
            <button
              className="delete-btn"
              onClick={() => handleDeleteitem(x.id)}
            >
              🗑️
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
