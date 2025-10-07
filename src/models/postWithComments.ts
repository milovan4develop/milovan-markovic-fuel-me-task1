import { Post } from "./post";
import { Comment } from "./comment";

export interface PostWithComments extends Post {
    comments: Comment[]
}
