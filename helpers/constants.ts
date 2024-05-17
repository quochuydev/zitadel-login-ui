// https://github.com/zitadel/zitadel/blob/585988bd83824663895c965966f7e72ca701dd5b/internal/command/policy_password_complexity_model.go
export const uppercasePattern = /[A-Z]+/;
export const lowercasePattern = /[a-z]+/;
export const numberPattern = /[0-9]/;
export const specialPattern = /[^A-Za-z0-9]/;
export const loginUsernamePattern = /^\S*$/;
export const registerUsernamePattern = /^[a-zA-Z0-9.\-_]+$/;
export const passwordMinLengthPattern = /.{8}$/;

export const passwordMinLength = 8;
export const maxByteSize = 72;
export const usernameMaxLength = 200;
export const verificationCodeLength = 6;
export const sessionCookieChunkSize = 2000;

export const sessionCookieName = 'sessions';
export const e2eUserPassword = `Qwerty@123`;
export const orgDisplayNameMetadataKey = 'display_name';
