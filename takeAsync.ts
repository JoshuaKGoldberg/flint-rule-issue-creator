export async function takeAsync<T>(
    iter: AsyncIterable<T>,
    count: number): Promise<T[]> {
    const result: T[] = [];
    for await (const item of iter) {
        result.push(item);
        if (result.length >= count) {
            break;
        }
    }
    return result;
}
