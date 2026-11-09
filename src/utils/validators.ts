export function isValidEmail(email: string) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
}
