export function isProduction() {
    return !import.meta.env.DEV
}
