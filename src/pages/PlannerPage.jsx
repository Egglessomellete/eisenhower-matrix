import WeekGrid from "../components/planner/WeekGrid";

function PlannerPage({ tasks }) {
  return (
    <>
      <header>
        <h1>Planner</h1>
      </header>
      <WeekGrid tasks={tasks} />
    </>
  );
}

export default PlannerPage;
