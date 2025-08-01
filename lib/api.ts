export function safeStringify(obj: any) {
    try {
        return JSON.stringify(obj, (key, value) =>
            typeof value === 'bigint' ? value.toString() : value
        );
    } catch (err) {
        console.error("❌ Failed to stringify object:", obj);
        console.error("🧵 Serialization Error:", err);
        throw err;
    }
}