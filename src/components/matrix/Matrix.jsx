import { CATEGORY } from "../../constants";
import Card from "./Card";

function Matrix({ tasks, handleDeleteitem, handleToggleItem }) {
  return (
    <div className="matrix">
      {Object.entries(CATEGORY).map(([name, color], i) => (
        <Card
          key={name}
          tasks={tasks}
          name={name}
          color={color}
          index={i + 1}
          handleDeleteitem={handleDeleteitem}
          handleToggleItem={handleToggleItem}
        />
      ))}
    </div>
  );
}

export default Matrix;
