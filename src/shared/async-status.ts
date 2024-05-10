import { computed } from "mobx";
import { Model, model, modelAction, prop } from "mobx-keystone";

export type TAsyncStatus = 'pending' | 'success' | 'failure';
export type TFetchStatus = 'idle' | 'fetching' | 'refetching';
export type AsyncEvent = 'fetch' | 'refetch' | 'failure' | 'success';

@model('AsyncStatus')
export class AsyncStatus extends Model({
    value: prop<TAsyncStatus>(),
}) {
    @modelAction
    public set(value: TAsyncStatus): void {
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

@model('FetchStatus')
export class FetchStatus extends Model({
    value: prop<TFetchStatus>()
}) {
    @modelAction
    public set(value: TFetchStatus): void {
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
