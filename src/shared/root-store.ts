import { Model, model, prop, registerRootStore } from "mobx-keystone";
import { TodosStore } from "../todo/todo-store";

@model('app/RootStore')
export class RootStore extends Model({
    todosStore: prop<TodosStore>(),
}) {}

export const createRootStore = (): RootStore => {
    const rootStore = new RootStore({
        todosStore: new TodosStore({}),
    });

    registerRootStore(rootStore);

    return rootStore;
};