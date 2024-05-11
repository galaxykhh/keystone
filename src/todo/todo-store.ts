import { Model, _async, _await, model, modelAction, prop } from "mobx-keystone";
import { TodoEntity } from "./todo.entity";
import TodoApi from "./todo.api";
import { computed, reaction } from "mobx";
import Query from "../shared/query";

type Filter = 'all' | 'done' | 'todo';

const Todos = Query.create(TodoApi.getTodos);

@model('todo/TodosRemoteStore')
export class TodosRemoteStore extends Model({
    todos: prop<InstanceType<typeof Todos>>(() => new Todos({})),
    filter: prop<Filter>('all'),
}) {
    protected async onInit(): Promise<void> {
        this.todos.fetch();
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