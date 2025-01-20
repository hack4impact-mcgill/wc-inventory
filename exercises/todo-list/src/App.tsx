// App.tsx is the main component where we define UI
import { useState, useEffect } from "react";
import { getTasks, Task, toggleTaskCompletion, addTask } from "./api/api.ts";
import { Checkbox } from "./components/ui/checkbox";

function App() {

    /* 
  - useState is a hook that allows you to add state (data) to a component
  - Initialize and return 'tasks', state value of empty array of tasks
  - Also returns setTasks, function to update 'tasks' state
  - useEffect is called after every render
  */


  const [tasks, setTasks] = useState<Task[]>([]); 
  const [newTaskTitle, setNewTaskTitle] = useState<string>("");


  useEffect(() => {
    getTasks().then((fetchedTasks) => {
        setTasks(fetchedTasks); // Update 'task' state with tasks fetched from mock API
      })
  }, []); // Empty bracket means effect runs only once


  // Update useState to hold user text input
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTaskTitle(event.target.value); // event.target is element that triggered event, update newTaskTitle state with value
  };


  // Adds new task submitted and triggers re-render
  const addNewTask = async () => {
    if (newTaskTitle.trim() === "") {return};
    const newTask = await addTask(newTaskTitle); // Add new task to mock API's list
    setTasks((prevTasks) => [...prevTasks, newTask]); // Add new task to 'tasks' state. Triggers rerender with new task
    setNewTaskTitle(""); // Reset 'newTaskTitle' for new input
    // TODO: For some reason the first new task added gets added twice
  };


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-6 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-bold">TODO LIST </h1>
          <div className="flex-row content-between p-5 bg-stone-100 rounded-lg">
            <ol className="flex-row p-5">
            {tasks.map((task) => ( // For each task in 'tasks' state
                <li key={task.id} className="flex items-center">
                  <Checkbox 
                    className="mr-5"
                    checked={task.completed} 
                    onCheckedChange={() => toggleTaskCompletion(task.id)}
                  />
                  <span className="py-2 flex-1">{task.title}</span>
                </li>
              ))}
            </ol>
            <div className=" flex flex-row bg-stone-100 justify-between">
              <input 
                type="text"
                value={newTaskTitle}
                onChange={handleInputChange} 
                className="bg-stone-400 text-stone-100 w-[75%] px-4 py-2 rounded-full"
              />
              <button 
                className="bg-stone-400 w-15 px-3 rounded-full"
                onClick={addNewTask} 
              >Add</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App
