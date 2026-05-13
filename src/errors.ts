
export class ConfigError extends Error {
    constructor(message: string){
        super(message);
        this.message = 'ConfigError';
    }
}

export class IoError extends Error {
    constructor(message: string){
        super(message);
        this.message = 'IoError';
    }
}

export class ValidationFailedError extends Error {
    constructor(message: string){
        super(message);
        this.message = 'ValidationFailedError'
    }
}

export function mapErrorToExitCode(err: unknown): number {
  if (err instanceof ValidationFailedError) return 1;
  if (err instanceof ConfigError) return 2;
  if (err instanceof IoError) return 3;
  return 1;
}