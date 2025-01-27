import { addTask, getTasks, Task, toggleTaskCompletion } from "./api/api";
import TodoItem from "./components/general/TodoItem";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

function App() {
  const queryClient = useQueryClient();

  const [newTask, setNewTask] = useState('');

  const { data: tasks, error, isLoading } = useQuery({
    queryFn: getTasks,
    queryKey: ['tasks'],
  });

  const { mutate: toggleCheckbox } = useMutation({
    mutationFn: (id: number) => {
      return toggleTaskCompletion(id);
    },
    mutationKey: ['toggleTaskCompletion'],
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
    }
  })

  const { mutate: createTask } = useMutation({
    mutationFn: (title: string) => {
      return addTask(title);
    },
    mutationKey: ['createTask'],
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
    }
  });


  const handleCheckedChange = (task: Task) => {
    toggleCheckbox(task.id);
  };

  const handleCreateTask = (title: string) => {
    createTask(title);
    setNewTask('');
  }

  if(!tasks || isLoading){
    return (<>
      Loading....
    </>);
  }

  return (
      <div className="flex flex-col min-h-screen bg-background">
        <main className="flex-1 container max-w-3xl mx-auto px-4 py-6 flex items-center justify-center">
          <div className="flex flex-col h-full w-full bg-slate-300">
            
            <div className="flex flex-row justify-center py-4 border-b">
              <span className="text-xl font-bold text-blue-800">Todo List</span>
            </div>
            <div className="h-[600px] px-8 py-4 flex flex-col justify-between bg-blue-50">
              <ul>
                { 
                  tasks.map((task: Task) => {
                    return <TodoItem task={task} onCheckedChange={handleCheckedChange}/>
                  })
                }
              </ul>

              <div className="flex flex-row gap-x-2">
                <Input value={newTask} onChange={(e) => setNewTask(e.target.value)}/>
                <Button onClick={() => handleCreateTask(newTask)}>
                  Create
                </Button>
              </div>
              
            </div>
          </div>
          
        </main>
      </div>
  );
}

export default App
