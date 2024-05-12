import { computed } from "mobx";
import { Model, _async, _await, model, modelAction, prop } from "mobx-keystone";
import { TodoEntity } from "./todo.entity";
import TodoApi from "./todo.api";
import Query, { QueryResult } from "../shared/query";

type Filter = 'all' | 'done' | 'todo';



@model('todo/TodosRemoteStore')
export class TodosStore extends Model({
    todos: prop<QueryResult<TodoEntity[]>>(() => Query.create(TodoApi.getTodos)),
    filter: prop<Filter>('all'),
}) {
    protected onAttachedToRootStore() {
        this.todos.fetch();
    }

    @modelAction
    public setFilter(filter: Filter) {
        this.filter = filter;
    }

    @computed
    public get pending(): TodoEntity[] {
        return this.todos.isSuccess
            ? this.todos.data.filter(t => !t.completed)
            : [];
    }

    @computed
    public get done(): TodoEntity[] {
        return this.todos.isSuccess
            ? this.todos.data.filter(t => t.completed)
            : [];
    }
}