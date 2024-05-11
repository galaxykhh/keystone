import { computed } from "mobx";
import { Model, model, modelAction, prop } from "mobx-keystone";

export type Status = 'idle' | 'fetching' | 'refetching';

@model('FetchStatus')
export class FetchStatus extends Model({
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
    public get isFetching(): boolean {
        return this.value === 'fetching';
    }

    @computed
    public get isRefetching(): boolean {
        return this.value === 'refetching';
    }
}
