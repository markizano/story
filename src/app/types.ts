
export type AuthStatus = {
    auth: {
        valid: boolean,
        token: string,
        expires: string|Date,
    },
    user?: {
        id: number,
        username: string,
        email: string,
        firstName: string,
        lastName: string
    }
}
