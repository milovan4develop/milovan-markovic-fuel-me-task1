import { fetchData } from "../services/fetchData";
import { User } from "../models/user";

;(async () => {
    try {
        const users = await fetchData<User[]>('https://jsonplaceholder.typicode.com/users');
        console.log('Fetched users: ', JSON.stringify(users, null, 4));
    } catch (e) {
        console.error('Fetch error: ', (e as Error).message);
        return null;
    }
})();