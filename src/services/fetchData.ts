import fetch from "node-fetch"

export async function fetchData<T>(url:String): Promise<T> {
    const res = await fetch(url.toString());
    if(!res.ok) {
        throw new Error(`Failed to fetch ${url}`);
    }
    return res.json() as Promise<T>;
}