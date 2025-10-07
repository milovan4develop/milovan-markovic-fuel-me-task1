import { User } from "./user";
import { PostWithComments } from "./postWithComments";
import { AlbumWithPhotos } from "./albumWithPhotos";
import { Todo } from "./todo";

export interface UserWithPosts extends User {
    posts: PostWithComments[]
    albums: AlbumWithPhotos[]
    todos: Todo[]
}