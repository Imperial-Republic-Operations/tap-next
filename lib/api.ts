export function safeStringify(obj: any) {
    try {
        return JSON.stringify(obj);
    } catch (err) {
        console.error("❌ Failed to stringify object:", obj);
        console.error("🧵 Serialization Error:", err);
        throw err;
    }
}