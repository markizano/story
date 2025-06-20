export const PLACEHOLDER_IMG: string = '/images/placeholder.png';

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

export type Pronouns = "he/him/his" | "she/her/hers" | "they/them/theirs" | "it/its";

export type Character = {
    name: {
        prefix?: string,
        given: string,
        family: string,
        secondary?: string,
        suffix?: string,
        pronouns?: Pronouns,
        phonetics?: string
    },
    origin: {
        city?: string,
        state?: string,
        country?: string,
        planet?: string,
        galaxy?: string
    },
    born: Date|null,
    height: number, // in cm
    weight: number, // in kg
    bio: string,
    photo: string, // url pointing to image.
    features: [
        {
            type: string,
            description: string,
        }
    ],
    accomplishments: [
        {
            when: Date,
            title: string,
            description: string,
            impact: string,
        }
    ],
    personality: [
        {
            trait: string,
            summary?: string,
            trauma?: string,
            response?: string,
        }
    ]
};

export const NullCharacter: Character = {
    name: {
        given: '',
        family: ''
    },
    origin: {},
    born: null,
    height: 0,
    weight: 0,
    bio: '',
    photo: '',
    features: [
        {
            type: '',
            description: ''
        }
    ],
    accomplishments: [
        {
            when: new Date(0),
            title: '',
            description: '',
            impact: ''
        }
    ],
    personality: [
        {
            trait: ''
        }
    ]
};
