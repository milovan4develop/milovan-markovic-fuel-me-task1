import { User } from "./user"
import { Post } from "./post"

export interface UserWithPosts extends User {
    posts: Post[]
}