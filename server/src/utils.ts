import crypto from 'crypto';

export declare type SaltedPassword = string;

/**
 * Return a salted hashed password.
 * @param password 
 */
export function hashPass(password: string, in_salt?: string): SaltedPassword {
    const salt = in_salt || crypto.randomBytes(16).toString('base64');
    const hashed = crypto.createHash('sha256').update(`${salt}:${password}`).digest('base64');
    return `${salt}:${hashed}`;
}

