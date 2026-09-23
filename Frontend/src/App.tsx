import "./App.css";
import { useProblems } from "./hooks/useProblem";

function App() {
  const { data: problems = [], isLoading, isError } = useProblems();
  console.log("Dashboard rendered", problems);

  if (isLoading) {
    return <div>Loading problems...</div>;
  }

  if (isError) {
    return <div>Failed to load problems.</div>;
  }

  return (
    <div>
      {problems.map((problem) => (
        <div key={problem.id}>{problem.title}</div>
      ))}
    </div>
  );
}

export default App;
