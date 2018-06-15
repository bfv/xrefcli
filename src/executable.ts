export interface Executable {
    execute(params: Object): void;
    validate(params: Object): void;
}
