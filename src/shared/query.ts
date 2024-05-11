import { computed } from "mobx";
import { _async, _await, _Model, Model, model, modelAction, modelFlow, prop } from "mobx-keystone";
import { QueryStatus } from "./query-status";
import { FetchStatus } from "./fetch-status";

type QueryFn<T> = (() => Promise<T>);
type QueryEvent = 'fetch' | 'refetch' | 'failure' | 'success';

export default class Query {
    static create<T = unknown, E = Error>(queryFn: QueryFn<T>) {
        const QueryResultProps = Model(<T, E>() => ({
            status: prop<QueryStatus>(() => new QueryStatus({ value: 'pending' })),
            fetchStatus: prop<FetchStatus>(() => new FetchStatus({ value: 'fetching' })),
            maybeData: prop<T | undefined>(undefined),
            maybeError: prop<E | undefined>(undefined),
        }));
        
        @model('QueryResult')
        class QueryResult extends QueryResultProps<T, E> {
            @modelAction
            private event(event: QueryEvent) {
                switch (event) {
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
            public fetch = _async(function* (this: QueryResult) {
                try {
                    this.event('fetch');
    
                    const result = yield* _await(queryFn());
    
                    this.maybeData = result;
                    this.event('success');
                } catch (e) {
                    this.maybeError = e as E;
                    this.event('failure');
                }
            });
    
            @modelFlow
            public refetch = _async(function* (this: QueryResult) {
                if (this.isLoading) {
                    return;
                }
    
                try {
                    this.event('refetch');
    
                    const result = yield* _await(queryFn());
    
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
                } catch (e) {
                    throw Error(`has no data: ${(e as Error).stack}`);
                }
            }
    
            @computed
            public get error(): E {
                try {
                    return this.maybeError as E;
                } catch (e) {
                    throw Error(`has no error: ${(e as Error).stack}`);
                }
            }
        }

        return QueryResult;
    }
}