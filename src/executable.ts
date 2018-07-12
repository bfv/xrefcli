export interface Executable {
    execute(params: Object): Promise<void>;
    validate(params: Object): void;
}
