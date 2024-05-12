import { computed } from "mobx";
import { Model, model, modelAction, prop } from "mobx-keystone";

export type Status = 'idle' | 'pending' | 'failure' | 'success';

@model('MutationStatus')
export class MutationStatus extends Model({
    value: prop<Status>()
}) {
    @modelAction
    public set(value: Status): void {
        this.value = value;
    }

    @computed
    public get isIdle(): boolean {
        return this.value === 'idle';
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
