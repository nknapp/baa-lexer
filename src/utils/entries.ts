export const entries = Object.entries as <K extends string, V>(
    object: Partial<Record<K, V>>
) => [K, V][];
