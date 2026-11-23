import { useEffect, useState } from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import Backlog from "../components/planner/Backlog";
import WeekGrid from "../components/planner/WeekGrid";
import { CATEGORY } from "../constants";
import { hasConflict } from "../utils/scheduling";
import {
  clampStart,
  minutesToTime,
  snapMinutes,
  topToMinutes,
} from "../utils/timeCalculations";
import "../components/planner/Planner.css";

const DEFAULT_DURATION = 60;

function PlannerPage({ tasks, scheduleTask, unscheduleTask }) {
  const [activeTask, setActiveTask] = useState(null);
  const [notice, setNotice] = useState("");

  // Hide the notice after 3 seconds. The cleanup cancels the timer if it changes first.
  useEffect(
    function () {
      if (!notice) return;
      const id = setTimeout(() => setNotice(""), 3000);
      return () => clearTimeout(id);
    },
    [notice],
  );

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } }),
    useSensor(KeyboardSensor),
  );

  function handleDragStart(event) {
    setActiveTask(tasks.find((t) => t.id === event.active.id) ?? null);
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;

    const task = tasks.find((t) => t.id === active.id);
    if (!task) return;

    if (over.id === "backlog") {
      if (task.scheduled_date) unscheduleTask(task.id);
      return;
    }

    const dayEl = document.getElementById(String(over.id));
    const dragged = active.rect.current.translated;
    if (!dayEl || !dragged) return;

    const dateStr = String(over.id).replace("day:", "");
    const relativeTop = dragged.top - dayEl.getBoundingClientRect().top;
    const duration = task.duration_mins ?? DEFAULT_DURATION;
    const start = clampStart(snapMinutes(topToMinutes(relativeTop)), duration);

    if (hasConflict(tasks, dateStr, start, duration, task.id)) {
      setNotice("That time slot is already taken.");
      return; // nothing is saved, so the block stays where it was
    }

    scheduleTask(task.id, {
      scheduled_date: dateStr,
      start_time: minutesToTime(start),
      duration_mins: duration,
    });
  }

  function handleResize(id, durationMins) {
    scheduleTask(id, { duration_mins: durationMins });
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveTask(null)}
    >
      <header>
        <h1>Planner</h1>
      </header>

      {notice && (
        <p className="planner-notice" role="status">
          {notice}
        </p>
      )}

      <div className="planner-layout">
        <Backlog tasks={tasks} />
        <WeekGrid tasks={tasks} onResize={handleResize} />
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className={`drag-preview tb-${CATEGORY[activeTask.type]}`}>
            <b>{activeTask.name}</b>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default PlannerPage;
