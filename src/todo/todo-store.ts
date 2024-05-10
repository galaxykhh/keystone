import { Model, _async, _await, model, modelAction, prop } from "mobx-keystone";
import { TodoEntity } from "./todo.entity";
import TodoApi from "./todo.api";
import { AsyncData } from "../shared/async-data";
import { computed } from "mobx";
import { Asserts } from "../asserts";

type Filter = 'all' | 'done' | 'todo';

@model('todo/TodosRemoteStore')
export class TodosRemoteStore extends Model({
    todos: prop<AsyncData<TodoEntity[]>>(() => new AsyncData({})),
    filter: prop<Filter>('done'),
}) {
    protected async onInit(): Promise<void> {
        await this.todos.fetch(TodoApi.getTodos);
    }

    @modelAction
    public setFilter(filter: Filter) {
        this.filter = filter;
    }

    @computed
    public get filteredTodos(): TodoEntity[] {
        if (!this.todos.isSuccess) {
            return [];
        }

        switch (this.filter) {
            case 'all': {
                return this.todos.data;
            }
            case 'done': {
                return this.todos.data.filter(t => t.completed);
            }
            case 'todo': {
                return this.todos.data.filter(t => !t.completed);
            }
        }
    }

    @computed
    get filteredCount(): number {
        if (!this.todos.isSuccess) {
            return 0;
        }

        return this.filteredTodos.length;
    }
}