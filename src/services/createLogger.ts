export function createLogger(context: string) {
    return (message: string) => {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] [${context}] ${message}`);
    }
}