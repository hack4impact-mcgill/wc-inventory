import { Task } from "@/api/api";
import { Checkbox } from "../ui/checkbox";
import { cn } from "@/lib/utils";

type TodoItemProps = {
    task: Task;
    onCheckedChange: (task: Task) => void;
}

const TodoItem = ({task, onCheckedChange}: TodoItemProps) => {

    if(!task) {
        return null;
    }

    return (
        <div className={cn("flex flex-row items-center py-2 gap-x-4", task.completed ? "line-through text-gray-400" : "")}>
            <Checkbox checked={task.completed} onCheckedChange={() => {
                onCheckedChange(task);
            }}/>
            <span>{ task.title }</span>
        </div>
    );
}

export default TodoItem;