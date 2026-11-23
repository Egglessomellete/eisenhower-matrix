import { useState } from "react";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { addWeeks, format, getDay, isToday } from "date-fns";
import { CATEGORY } from "../../constants";
import { getWeekDays, toDateString } from "../../utils/calendarHelpers";
import { useNow } from "../../hooks/useNow";
import {
  END_HOUR,
  HOUR_HEIGHT,
  START_HOUR,
  durationToHeight,
  minutesToTop,
  timeToMinutes,
} from "../../utils/timeCalculations";
import "./WeekGrid.css";

const HOURS = Array.from(
  { length: END_HOUR - START_HOUR },
  (_, i) => START_HOUR + i,
);
const GRID_HEIGHT = HOURS.length * HOUR_HEIGHT;

function todayIndex() {
  return (getDay(new Date()) + 6) % 7;
}

function formatHour(hour) {
  return format(new Date(2000, 0, 1, hour), "h a");
}

function TaskBlock({ task }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: task.id,
    data: { task },
  });

  const top = minutesToTop(timeToMinutes(task.start_time));
  const height = durationToHeight(task.duration_mins);
  const color = CATEGORY[task.type];

  return (
    <div
      ref={setNodeRef}
      className={`task-block tb-${color}${task.completed ? " tb-done" : ""}${isDragging ? " tb-dragging" : ""}`}
      style={{ top, height }}
      {...listeners}
      {...attributes}
    >
      <b>{task.name}</b>
      <div className="tb-time">
        {task.start_time.slice(0, 5)} · {task.duration_mins} min
      </div>
    </div>
  );
}

// One day's drop zone. The id is both the dnd-kit id and the DOM id, so the
// drop handler can measure the element when the drag ends.
function DayBody({ dateStr, children }) {
  const dropId = `day:${dateStr}`;
  const { setNodeRef, isOver } = useDroppable({ id: dropId });

  return (
    <div
      id={dropId}
      ref={setNodeRef}
      className={`day-body${isOver ? " over" : ""}`}
      style={{ height: GRID_HEIGHT }}
    >
      {children}
    </div>
  );
}

function NowLine({ now }) {
  const minutes = now.getHours() * 60 + now.getMinutes();
  if (minutes < START_HOUR * 60 || minutes > END_HOUR * 60) return null;
  return <div className="now-line" style={{ top: minutesToTop(minutes) }} />;
}

function WeekGrid({ tasks }) {
  const [anchor, setAnchor] = useState(new Date());
  const [dayIndex, setDayIndex] = useState(todayIndex);
  const now = useNow();

  const days = getWeekDays(anchor);
  const scheduled = tasks.filter((t) => t.scheduled_date);

  function goToday() {
    setAnchor(new Date());
    setDayIndex(todayIndex());
  }

  return (
    <section className="week">
      <div className="week-toolbar">
        <h2>
          {format(days[0], "d MMM")} - {format(days[6], "d MMM yyyy")}
        </h2>
        <div className="week-nav">
          <button className="week-btn" onClick={() => setAnchor(addWeeks(anchor, -1))}>
            Previous
          </button>
          <button className="week-btn" onClick={goToday}>
            Today
          </button>
          <button className="week-btn" onClick={() => setAnchor(addWeeks(anchor, 1))}>
            Next
          </button>
        </div>
      </div>

      <div className="day-tabs">
        {days.map((day, i) => (
          <button
            key={toDateString(day)}
            className={`day-tab${i === dayIndex ? " active" : ""}`}
            aria-pressed={i === dayIndex}
            onClick={() => setDayIndex(i)}
          >
            <span>{format(day, "EEE")}</span>
            <b>{format(day, "d")}</b>
          </button>
        ))}
      </div>

      <div className="week-scroll">
        <div className="week-grid" style={{ "--hour-h": `${HOUR_HEIGHT}px` }}>
          <div className="time-col">
            <div className="time-head" />
            {HOURS.map((h) => (
              <div key={h} className="time-label">
                {formatHour(h)}
              </div>
            ))}
          </div>

          {days.map((day, i) => {
            const dateStr = toDateString(day);
            const dayTasks = scheduled.filter((t) => t.scheduled_date === dateStr);
            return (
              <div
                key={dateStr}
                className={`day-col${i === dayIndex ? " selected" : ""}`}
              >
                <div className={`day-head${isToday(day) ? " today" : ""}`}>
                  <span>{format(day, "EEE")}</span>
                  <b>{format(day, "d")}</b>
                </div>
                <DayBody dateStr={dateStr}>
                  {dayTasks.map((task) => (
                    <TaskBlock key={task.id} task={task} />
                  ))}
                  {isToday(day) && <NowLine now={now} />}
                </DayBody>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default WeekGrid;
