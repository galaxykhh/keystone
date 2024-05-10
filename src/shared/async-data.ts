import { override } from "mobx";
import { _async, _await, _Model, ExtendedModel, model, modelClass, modelFlow, prop } from "mobx-keystone";
import { AsyncStatus } from "./async-status";

type FetchFn<T> = (() => Promise<T>);

interface Register {}
type DefaultError = Register extends { defaultError: infer TError } ? TError : Error;

@model('AsyncData')
export class AsyncData<T = unknown, E = DefaultError> extends ExtendedModel(<T, E>() => ({
    baseModel: modelClass(AsyncStatus),
    props: {
        data: prop<T | undefined>(undefined),
        error: prop<E | undefined>(undefined),
    },
}))<T, E> {
    private fetchFn?: FetchFn<T>;

    @modelFlow
    public fetch = _async(function* (this: AsyncData<T, E>, fetchFn: FetchFn<T>) {
        if (this.fetchFn === undefined) {
            this.fetchFn = fetchFn;
        }

        try {
            this.event('fetch');

            const result = yield* _await(this.fetchFn());

            this.data = result;
            this.event('success');
        } catch(e) {
            this.error = e as E;
            this.event('failure');
        }
    });

    @modelFlow
    public refetch = _async(function* (this: AsyncData<T, E>) {
        if (this.fetchFn === undefined) {
            throw Error('refetch를 호출하기 위해 fetch가 먼저 호출된적이 있어야 합니다');
        }

        if (this.isLoading) {
            return;
        }

        try {
            this.event('refetch');

            const result = yield* _await(this.fetchFn());

            this.data = result;
            this.event('success');
        } catch(e) {
            this.error = e as E;
            this.event('failure');
        }
    });

    @override
    get isSuccess(): boolean {
        return super.isSuccess && this.data !== undefined;
    }
}