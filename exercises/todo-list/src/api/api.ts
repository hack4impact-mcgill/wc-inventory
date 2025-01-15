export type Task = {
  id: number;
  title: string;
  completed: boolean;
};
  
const mockTasks: Task[] = [
  { id: 2, title: "Pair program with a teammate", completed: false },
];

let idCounter = mockTasks.length + 1;

export const getTasks = (): Promise<Task[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockTasks), 500);
  });
};

export const addTask = (title: string): Promise<Task> => {
  return new Promise((resolve) => {
    const newTask = { id: idCounter++, title, completed: false };
    mockTasks.push(newTask);
    setTimeout(() => resolve(newTask), 500);
  });
};

export const toggleTaskCompletion = (id: number): Promise<Task> => {
  return new Promise((resolve, reject) => {
    const task = mockTasks.find((task) => task.id === id);
    if (!task) return reject(new Error("Task not found"));
    task.completed = !task.completed;
    setTimeout(() => resolve(task), 500);
  });
};