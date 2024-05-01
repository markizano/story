
import { authenticator } from '@otplib/preset-default';

export function checkOTP(otpCode: string, secret: string): boolean {
    const result = authenticator.check(otpCode, secret);
    console.log(`Checking OTP ${otpCode} with secret ${secret} = ${result}`);
    return result;
}
