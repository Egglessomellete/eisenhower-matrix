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
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default List;
