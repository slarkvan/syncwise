export function oncePerHour<T extends (...args: any[]) => any>(fn: T, cacheKey: string): T {
    return async function (...args) {
        const today = new Date().toJSON().slice(0, 13) // 获取 YYYY-MM-DD 格式的日期

        const cachedData = localStorage.getItem(cacheKey)
        if (cachedData && JSON.parse(cachedData).date >= today) {
            return JSON.parse(cachedData).result
        }

        const result = await fn(...args)
        localStorage.setItem(cacheKey, JSON.stringify({ date: today, result }))
        return result
    } as T
}
