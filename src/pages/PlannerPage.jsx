import { useState } from "react";
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
import {
  clampStart,
  minutesToTime,
  snapMinutes,
  topToMinutes,
} from "../utils/timeCalculations";
import "../components/planner/Planner.css";

const DEFAULT_DURATION = 60; // minutes, for a task scheduled for the first time

function PlannerPage({ tasks, scheduleTask, unscheduleTask }) {
  const [activeTask, setActiveTask] = useState(null);

  // Sensors decide HOW a drag starts: mouse after 5px, touch after a 200ms hold
  // (so normal scrolling still works), and the keyboard for accessibility.
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
    if (!over) return; // dropped on nothing

    const task = tasks.find((t) => t.id === active.id);
    if (!task) return;

    // Dropped back on the Unscheduled panel
    if (over.id === "backlog") {
      if (task.scheduled_date) unscheduleTask(task.id);
      return;
    }

    // Dropped on a day: work out the start time from where the block's top edge landed.
    const dayEl = document.getElementById(String(over.id));
    const dragged = active.rect.current.translated;
    if (!dayEl || !dragged) return;

    const relativeTop = dragged.top - dayEl.getBoundingClientRect().top;
    const duration = task.duration_mins ?? DEFAULT_DURATION;
    const start = clampStart(snapMinutes(topToMinutes(relativeTop)), duration);

    scheduleTask(task.id, {
      scheduled_date: String(over.id).replace("day:", ""),
      start_time: minutesToTime(start),
      duration_mins: duration,
    });
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

      <div className="planner-layout">
        <Backlog tasks={tasks} />
        <WeekGrid tasks={tasks} />
      </div>

      {/* The floating copy that follows your finger or cursor */}
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
