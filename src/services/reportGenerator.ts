import { User } from "../models/user";
import { Post } from "../models/post";
import { UserWithPosts } from "../models/userWithPosts";
import { fetchData } from "./fetchData";
import { createLogger } from "./createLogger";

export class ReportGenerator {
    private logger = createLogger('### ReportGenerator ###');

    constructor(
        private readonly usersEP = 'https://jsonplaceholder.typicode.com/users',
        private readonly postsEP = 'https://jsonplaceholder.typicode.com/posts'
    ){}

    async generate(): Promise<UserWithPosts[]> {
        this.logger('#1 FETCHING USERS');
        const users = await fetchData<User[]>(this.usersEP);
        this.logger(`#2.1 USERS LENGTH: ${users.length}`);

        this.logger('#2 FETCHING POSTS');
        const posts = await fetchData<Post[]>(this.postsEP);
        this.logger(`#2.1 POSTS LENGTH: ${posts.length}`);   

        this.logger(`#3 GROUPING POSTS BY USER...`);   
        const postsByUser:Record<number, Post[]> = {};
        for(let i=0; i<posts.length; i++) {
            const post = posts[i];
            if(!postsByUser[post.userId]){
                postsByUser[post.userId] = [post];
            } else {
                postsByUser[post.userId].push(post);
            }
        }

        this.logger(`#4 COMBINING USERS WITH POSTS...`);   
        const result: UserWithPosts[] = users.map((user) => ({
            ...user,
            posts: postsByUser[user.id] ?? []
        }))
        this.logger(`#4.1 DONE TOTAL USERS WITH POSTS LENGTH: ${result.length}`);
        return result;
    }
}