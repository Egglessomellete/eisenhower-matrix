import { useEffect, useRef, useState } from "react";
import { supabase } from "./supabaseClient";
import LoginScreen from "./LoginScreen";
import "./App.css";

const App = () => {
  const category = {
    "Urgent and Important": "green",
    "Urgent not Important": "blue",
    "Important not Urgent": "orange",
    Habit: "pink",
  };

  async function handleAdd(newtask) {
    const { data, error } = await supabase
      .from("tasks")
      .insert({
        name: newtask.name,
        type: newtask.type,
        completed: false,
        user_id: session.user.id,
      })
      .select();
    if (error) {
      console.error(error.message);
      return;
    } else {
      setTasks((tasks) => [...tasks, data[0]]);
    }
  }
  async function handleDeleteitem(id) {
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) {
      console.error(error.message);
      return;
    }
    setTasks((tasks) => tasks.filter((task) => task.id !== id));
  }

  async function handleToggleItem(id) {
    const task = tasks.find((t) => t.id === id);
    const { error } = await supabase
      .from("tasks")
      .update({ completed: !task.completed })
      .eq("id", id);
    if (error) {
      console.error(error.message);
      return;
    }
    setTasks((tasks) =>
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  }
  async function handleLogin(email) {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    });
    if (error) throw error;
  }
  const [session, setSession] = useState(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  useEffect(
    function () {
      if (!session) {
        setTasks([]);
        return;
      }

      async function loadTasks() {
        const { data, error } = await supabase
          .from("tasks")
          .select("*")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: true });
        if (error) {
          console.error(error.message);
        } else {
          setTasks(data);
        }
      }
      loadTasks();
    },
    [session],
  );
  useEffect(function () {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setSessionLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);
  if (sessionLoading) return <p>Loading...</p>;
  if (!session) return <LoginScreen onLogin={handleLogin} />;
  return (
    <div>
      <button onClick={() => supabase.auth.signOut()}>Log out</button>
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
                key={x.id}
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
