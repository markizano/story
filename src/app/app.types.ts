
export type AuthStatus = {
    auth: {
        valid: boolean,
        token: string,
        expires: string | Date,
    },
    user?: {
        id: number,
        username: string,
        email: string,
        firstName: string,
        lastName: string
    }
}

export type Story = {
    id: number,
    title: string,
    byline: string,
    content?: string,
};

export const NullStory: Story = { id: -1, title: '', byline: '', content: '' };

