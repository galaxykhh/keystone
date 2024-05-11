import { computed, reaction } from "mobx";
import { Model, _async, _await, fromSnapshot, getSnapshot, model, modelAction, prop } from "mobx-keystone";

@model('todo/TodoEntity')
export class TodoEntity extends Model({
    id: prop<number>(),
    userId: prop<number>(),
    title: prop<string>(),
    completed: prop<boolean>(false),
}) {
    @modelAction
    public toggle() {
        this.completed = !this.completed;
    }

    @computed
    public get completedDisplayName(): string {
        return this.completed ? 'DONE' : 'TODO';
    }
}