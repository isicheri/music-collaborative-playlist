

declare namespace Express {
    export interface Request {
        user?: {
            isValidated: boolean,
            id: number,
            username: string
        }
    }
}