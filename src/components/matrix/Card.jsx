import List from "./List";

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
                key={x.id}
                x={x}
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

export default Card;
