import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export function useTasks(session) {
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

        if (error) console.error(error.message);
        else setTasks(data);
      }
      loadTasks();
    },
    [session],
  );

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
    }
    setTasks((tasks) => [...tasks, data[0]]);
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
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
  }

  // Set date, start time and duration in ONE update (the database rule needs all three).
  async function scheduleTask(id, schedule) {
    const { error } = await supabase.from("tasks").update(schedule).eq("id", id);
    if (error) {
      console.error(error.message);
      return;
    }
    setTasks((tasks) =>
      tasks.map((t) => (t.id === id ? { ...t, ...schedule } : t)),
    );
  }

  function unscheduleTask(id) {
    return scheduleTask(id, {
      scheduled_date: null,
      start_time: null,
      duration_mins: null,
    });
  }

  return {
    tasks,
    handleAdd,
    handleDeleteitem,
    handleToggleItem,
    scheduleTask,
    unscheduleTask,
  };
}
