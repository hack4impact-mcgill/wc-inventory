import { useState } from "react";

export type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

let todoIdCounter = 1;

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);

  // Function to get all todos
  const getTodos = (): Todo[] => {
    return todos;
  };

  // Function to create a new todo
  const createTodo = (title: string): void => {
    const newTodo: Todo = {
      id: todoIdCounter++,
      title,
      completed: false,
    };
    setTodos((prevTodos) => [...prevTodos, newTodo]);
  };

  // Function to toggle a todo's completion status
  const toggleTodoCompletion = (id: number): void => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  return {
    todos,
    getTodos,
    createTodo,
    toggleTodoCompletion,
  };
}
