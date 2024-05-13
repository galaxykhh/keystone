import { Model, _async, _await, model, modelAction, modelFlow, prop } from "mobx-keystone";
import { MutationStatus } from "./mutation-status";
import { computed } from "mobx";

export type MutateFunction<T = unknown, V = void> = (variables: V) => Promise<T>;
type MutationEvent = 'mutate' | 'failure' | 'success';

export default class Mutation {
    private constructor() {}

    public static create<T = unknown, V = void, E = Error>(mutateFn: MutateFunction<T, V>) {
        const MutationResultProps = Model(<T, E>() => ({
            status: prop<MutationStatus>(() => new MutationStatus({ value: 'idle' })),
            maybeData: prop<T | undefined>(undefined),
            maybeError: prop<E | undefined>(undefined),
        }));

        @model('MutationResult')
        class MutationResult extends MutationResultProps<T, E> {
            @modelAction
            private setData(data: T | undefined): void {
                this.maybeData = data;
            }

            @modelAction
            private setError(error: E | undefined): void {
                this.maybeError = error;
            }

            @modelAction
            private event(event: MutationEvent) {
                switch (event) {
                    case 'mutate': {
                        this.status.set('pending');
                        break;
                    }
                    case 'failure': {
                        this.status.set('failure');
                        break;
                    }
                    case 'success': {
                        this.status.set('success');
                    }
                }
            }

            @modelFlow
            public mutate = _async(function* (this: MutationResult, variables: V) {
                if (this.isPending) {
                    return;
                }

                try {
                    this.event('mutate');

                    const result = yield* _await(mutateFn(variables));

                    this.setData(result);
                    this.event('success');
                } catch (e) {
                    this.setError(e as E);
                    this.event('failure');
                }
            });

            @computed
            public get isPending(): boolean {
                return this.status.isPending;
            }

            @computed
            public get isFailure(): boolean {
                return this.status.isFailure;
            }

            @computed
            public get isSuccess(): boolean {
                return this.status.isSuccess;
            }
        }

        return new MutationResult({});
    }
}