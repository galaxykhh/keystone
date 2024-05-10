import { Model, model, prop, registerRootStore } from "mobx-keystone";
import { TodosRemoteStore } from "../todo/todo-store";

@model('app/RootStore')
export class RootStore extends Model({
    todosStore: prop<TodosRemoteStore>(),
}) {
    protected onAttachedToRootStore(rootStore: RootStore): void | (() => void) {
        console.log('LOAD!');
    }
}

export const createRootStore = (): RootStore => {
    const rootStore = new RootStore({
        todosStore: new TodosRemoteStore({}),
    });

    registerRootStore(rootStore);

    return rootStore;
};