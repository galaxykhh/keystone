import { computed } from "mobx";
import { _async, _await, _Model, idProp, Model, model, modelAction, prop } from "mobx-keystone";

export type Status = 'pending' | 'success' | 'failure';
export type FetchStatus = 'idle' | 'fetching' | 'refetching';
export type AsyncEvent = 'fetch' | 'refetch' | 'failure' | 'success';

@model('AsyncStatus')
export class AsyncStatus extends Model({
    key: idProp,
    status: prop<Status>('pending'),
    fetchStatus: prop<FetchStatus>('fetching'),
}) {

    @modelAction
    event(event: AsyncEvent) {
        switch(event) {
            case 'fetch': {
                this.status = 'pending';
                this.fetchStatus = 'fetching';
                break;
            }
            case 'refetch': {
                this.fetchStatus = 'refetching';
                break;
            }
            case 'failure': {
                this.status = 'failure';
                this.fetchStatus = 'idle';
            }
            case 'success': {
                this.status = 'success';
                this.fetchStatus = 'idle';
            }
        }
    }

    @computed
    get isPending(): boolean {
        return this.status === 'pending';
    }

    @computed
    get isFetching(): boolean {
        return this.fetchStatus === 'fetching';
    }

    @computed
    get isRefetching(): boolean {
        return this.fetchStatus === 'refetching';
    }

    @computed
    get isLoading(): boolean {
        return this.isPending || this.isFetching || this.isRefetching;
    }

    @computed
    get isFailure(): boolean {
        return this.status === 'failure';
    }

    @computed
    get isSuccess(): boolean {
        return this.status === 'success';
    }
}
