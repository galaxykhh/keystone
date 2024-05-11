import { computed } from "mobx";
import { Model, model, modelAction, prop } from "mobx-keystone";

export type Status = 'pending' | 'success' | 'failure';

@model('QueryStatus')
export class QueryStatus extends Model({
    value: prop<Status>(),
}) {
    @modelAction
    public set(value: Status): void {
        this.value = value;
    }

    @computed
    public get isPending(): boolean {
        return this.value === 'pending';
    }

    @computed
    public get isFailure(): boolean {
        return this.value === 'failure';
    }

    @computed
    public get isSuccess(): boolean {
        return this.value === 'success';
    }
}