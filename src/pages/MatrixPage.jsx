import Header from "../components/matrix/Header";
import Task from "../components/matrix/Task";
import Matrix from "../components/matrix/Matrix";

function MatrixPage({ tasks, handleAdd, handleDeleteitem, handleToggleItem }) {
  return (
    <>
      <Header />
      <Task onAdd={handleAdd} />
      <Matrix
        tasks={tasks}
        handleDeleteitem={handleDeleteitem}
        handleToggleItem={handleToggleItem}
      />
    </>
  );
}

export default MatrixPage;
