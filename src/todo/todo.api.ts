import { TodoEntity } from "./todo.entity";

interface TodoDto {
    userId: 1;
    id: 1;
    title: "delectus aut autem";
    completed: false;
}

class TodoApi {
    public async getTodos(): Promise<TodoEntity[]> {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos');
        const dtos = await response.json() as TodoDto[];

        return dtos.map(dto => new TodoEntity(dto));
    }
}


export default new TodoApi();