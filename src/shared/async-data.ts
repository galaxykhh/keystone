import { computed, observable, override } from "mobx";
import { _async, _await, _Model, ExtendedModel, Model, model, modelAction, modelClass, modelFlow, prop, tProp, types } from "mobx-keystone";
import { AsyncStatus, FetchStatus } from "./async-status";

type FetchFn<T> = (() => Promise<T>);

type AsyncEvent = 'fetch' | 'refetch' | 'failure' | 'success';

@model('AsyncData')
export class AsyncData<T = unknown, E = Error> extends Model(<T, E>() => ({
    status: prop<AsyncStatus>(() => new AsyncStatus({ value: 'pending' })),
    fetchStatus: prop<FetchStatus>(() => new FetchStatus({ value: 'fetching' })),
    maybeData: prop<T | undefined>(undefined),
    maybeError: prop<E | undefined>(undefined),
}))<T, E> {
    private fetchFn?: FetchFn<T>;

    @modelAction
    private event(event: AsyncEvent) {
        switch(event) {
            case 'fetch': {
                this.status.set('pending');
                this.fetchStatus.set('fetching');
                break;
            }
            case 'refetch': {
                this.fetchStatus.set('refetching');
                break;
            }
            case 'failure': {
                this.status.set('failure');
                this.fetchStatus.set('idle');
            }
            case 'success': {
                this.status.set('success');
                this.fetchStatus.set('idle');
            }
        }
    }

    @modelFlow
    public fetch = _async(function* (this: AsyncData<T, E>, fetchFn: FetchFn<T>) {
        if (this.fetchFn === undefined) {
            this.fetchFn = fetchFn;
        }

        try {
            this.event('fetch');

            const result = yield* _await(this.fetchFn());

            this.maybeData = result;
            this.event('success');
        } catch (e) {
            this.maybeError = e as E;
            this.event('failure');
        }
    });

    @modelFlow
    public refetch = _async(function* (this: AsyncData<T, E>, fetchFn?: FetchFn<T>) {
        if (this.isLoading) {
            return;
        }

        if (fetchFn === undefined && !this.fetchFn === undefined) {
            throw Error('fetchFn not exists');
        }

        if (this.fetchFn === undefined) {
            this.fetchFn = fetchFn;
        }

        try {
            this.event('refetch');

            const result = yield* _await(this.fetchFn!());

            this.maybeData = result;
            this.event('success');
        } catch (e) {
            this.maybeError = e as E;
            this.event('failure');
        }
    });

    @modelAction
    public setData(data: T): void {
        this.maybeData = data;
    }

    @computed
    public get isPending(): boolean {
        return this.status.isPending;
    }

    @computed
    public get isFetching(): boolean {
        return this.fetchStatus.isFetching;
    }

    @computed
    public get isRefetching(): boolean {
        return this.fetchStatus.isRefetching;
    }

    @computed
    public get isLoading(): boolean {
        return this.isPending || this.isFetching || this.isRefetching;
    }

    @computed
    public get isFailure(): boolean {
        return this.status.isFailure;
    }

    @computed
    public get isSuccess(): boolean {
        return this.status.isSuccess;
    }

    @computed
    public get isError(): boolean {
        return this.maybeError !== undefined;
    }

    @computed
    public get data(): T {
        try {
            return this.maybeData as T;
        } catch(e) {
            throw Error(`has no data: ${(e as Error).stack}`);
        }
    }

    @computed
    public get error(): E {
        try {
            return this.maybeError as E;
        } catch(e) {
            throw Error(`has no error: ${(e as Error).stack}`);
        }
    }
}