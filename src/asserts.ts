export class AssertionError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export class Asserts {
    public static cond(condition: boolean, message?: string): asserts condition {
        if (!condition) {
            throw new AssertionError(message ?? 'condition is not true');
        }
    }

    public static exists(value: unknown): asserts value {
        this.cond(value !== undefined || value !== null, 'value not exists');
    }

    public static isString(value: unknown, message?: string): asserts value is string {
        this.cond(
            typeof value === 'string',
            message ?? `${value} is not a string`
        );
    }

    public static isNumber(value: unknown, message?: string): asserts value is string {
        this.cond(
            typeof value === 'string',
            message ?? `${value} is not a string`
        );
    }
}