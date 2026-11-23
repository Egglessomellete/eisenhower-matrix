import { useDraggable, useDroppable } from "@dnd-kit/core";
import { CATEGORY } from "../../constants";

function BacklogItem({ task }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: task.id,
    data: { task },
  });

  return (
    <div
      ref={setNodeRef}
      className={`backlog-item${isDragging ? " dragging" : ""}`}
      {...listeners}
      {...attributes}
    >
      {task.name}
    </div>
  );
}

function Backlog({ tasks }) {
  // The panel is also a drop target: dropping a block here unschedules it.
  const { setNodeRef, isOver } = useDroppable({ id: "backlog" });
  const unscheduled = tasks.filter((t) => !t.scheduled_date && !t.completed);

  return (
    <aside ref={setNodeRef} className={`backlog${isOver ? " over" : ""}`}>
      <h3>Unscheduled ({unscheduled.length})</h3>

      {Object.entries(CATEGORY).map(([name, color]) => {
        const group = unscheduled.filter((t) => t.type === name);
        if (group.length === 0) return null;
        return (
          <div key={name} className="backlog-group">
            <div className={`backlog-group-title bl-${color}`}>{name}</div>
            {group.map((task) => (
              <BacklogItem key={task.id} task={task} />
            ))}
          </div>
        );
      })}

      {unscheduled.length === 0 && (
        <p className="backlog-empty">Everything is scheduled.</p>
      )}
    </aside>
  );
}

export default Backlog;
