import { Model, _async, _await, model, modelAction, modelFlow, prop, tProp, types } from "mobx-keystone";
import { TodoEntity } from "./todo.entity";
import TodoApi from "./todo.api";
import { AsyncData } from "../shared/async-data";
import { sleep } from "../sleep";
import { computed } from "mobx";

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
    get hasTodo(): boolean {
        return !!this.todos.data && this.todos.data.length > 1;
    }

    @computed
    get count(): number {
        return this.todos.data?.length || 0;
    }

    @computed
    get filteredTodos(): TodoEntity[] {
        switch(this.filter) {
            case 'all': {
                return this.todos.data || [];
            }
            case 'done': {
                return this.todos.data?.filter(t => t.completed) || [];
            }
            case 'todo': {
                return this.todos.data?.filter(t => !t.completed) || [];
            }
        }
    }

    @computed
    get filteredCount(): number {
        if (!this.hasTodo) {
            return 0;
        }

        return this.filteredTodos.length;
    }
}