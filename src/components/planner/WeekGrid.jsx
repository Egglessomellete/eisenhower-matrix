import { useState } from "react";
import { addWeeks, format, getDay, isToday } from "date-fns";
import { CATEGORY } from "../../constants";
import { getWeekDays, toDateString } from "../../utils/calendarHelpers";
import { useNow } from "../../hooks/useNow";
import {
  HOUR_HEIGHT,
  START_HOUR,
  durationToHeight,
  minutesToTop,
  timeToMinutes,
} from "../../utils/timeCalculations";
import "./WeekGrid.css";

const END_HOUR = 23;
const HOURS = Array.from(
  { length: END_HOUR - START_HOUR },
  (_, i) => START_HOUR + i,
);
const GRID_HEIGHT = HOURS.length * HOUR_HEIGHT;

// getDay: Sunday = 0 ... Saturday = 6. We want Monday = 0.
function todayIndex() {
  return (getDay(new Date()) + 6) % 7;
}

function formatHour(hour) {
  return format(new Date(2000, 0, 1, hour), "h a");
}

function TaskBlock({ task }) {
  const top = minutesToTop(timeToMinutes(task.start_time));
  const height = durationToHeight(task.duration_mins);
  const color = CATEGORY[task.type];

  return (
    <div
      className={`task-block tb-${color}${task.completed ? " tb-done" : ""}`}
      style={{ top, height }}
    >
      <b>{task.name}</b>
      <div className="tb-time">
        {task.start_time.slice(0, 5)} · {task.duration_mins} min
      </div>
    </div>
  );
}

function NowLine({ now }) {
  const minutes = now.getHours() * 60 + now.getMinutes();
  if (minutes < START_HOUR * 60 || minutes > END_HOUR * 60) return null;
  return <div className="now-line" style={{ top: minutesToTop(minutes) }} />;
}

function WeekGrid({ tasks }) {
  const [anchor, setAnchor] = useState(new Date()); // any date inside the shown week
  const [dayIndex, setDayIndex] = useState(todayIndex); // the day shown on phones
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

      {/* Phones show one day at a time; these tabs pick which one. */}
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
        {/* CSS variable fed from JS so the CSS lines and the maths always agree */}
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
                <div className="day-body" style={{ height: GRID_HEIGHT }}>
                  {dayTasks.map((task) => (
                    <TaskBlock key={task.id} task={task} />
                  ))}
                  {isToday(day) && <NowLine now={now} />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default WeekGrid;
