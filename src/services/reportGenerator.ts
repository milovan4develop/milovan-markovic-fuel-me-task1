import { User } from "../models/user";
import { Post } from "../models/post";
import { Comment } from "../models/comment";
import { Photo } from "../models/photo";
import { Album } from "../models/album";
import { Todo } from "../models/todo";
import { PostWithComments } from "../models/postWithComments";
import { AlbumWithPhotos } from "../models/albumWithPhotos";
import { UserWithPosts } from "../models/userWithPosts";
import { fetchData } from "./fetchData";
import { createLogger } from "./createLogger";

export class ReportGenerator {
    private logger = createLogger('### ReportGenerator ###');

    constructor(
        private readonly usersEP = 'https://jsonplaceholder.typicode.com/users',
        private readonly postsEP = 'https://jsonplaceholder.typicode.com/posts',
        private readonly commentsEP = 'https://jsonplaceholder.typicode.com/comments',
        private readonly photosEP = 'https://jsonplaceholder.typicode.com/photos',
        private readonly albumsEP = 'https://jsonplaceholder.typicode.com/albums',
        private readonly todosEP = 'https://jsonplaceholder.typicode.com/todos'
    ){}

    async generate(): Promise<UserWithPosts[]> {
        this.logger('#1 FETCHING ALL DATA');
        const [users, posts, comments, photos, albums, todos] = await Promise.all([
            fetchData<User[]>(this.usersEP),
            fetchData<Post[]>(this.postsEP),
            fetchData<Comment[]>(this.commentsEP),
            fetchData<Photo[]>(this.photosEP),
            fetchData<Album[]>(this.albumsEP),
            fetchData<Todo[]>(this.todosEP)
        ]);

        this.logger('#2 LENGTH');
        this.logger(`#2.1 USERS: ${users.length}`);
        this.logger(`#2.2 POSTS: ${posts.length}`);
        this.logger(`#2.3 COMMENTS: ${comments.length}`);
        this.logger(`#2.4 PHOTOS: ${photos.length}`);
        this.logger(`#2.5 ALBUMS: ${albums.length}`);
        this.logger(`#2.6 TODOS: ${todos.length}`);   

        this.logger(`#3 GROUPING COMMENTS BY POST...`);   
        const commentsByPost: Record<number, Comment[]> = {};
        for(let i=0; i<comments.length; i++) {
            const comment = comments[i];
            if(!commentsByPost[comment.postId]){
                commentsByPost[comment.postId] = [comment];
            } else {
                commentsByPost[comment.postId].push(comment);
            }
        }

        this.logger(`#4 GROUPING PHOTOS BY ALBUM...`);   
        const photosByAlbum: Record<number, Photo[]> = {};
        for(let i=0; i<photos.length; i++) {
            const photo = photos[i];
            if(!photosByAlbum[photo.albumId]){
                photosByAlbum[photo.albumId] = [photo];
            } else {
                photosByAlbum[photo.albumId].push(photo);
            }
        }

        this.logger(`#5 COMBINING POSTS WITH COMMENTS...`);   
        const postsWithComments: PostWithComments[] = posts.map((post) => ({
            ...post,
            comments: commentsByPost[post.id] ?? []
        }));

        this.logger(`#6 COMBINING ALBUMS WITH PHOTOS...`);   
        const albumsWithPhotos: AlbumWithPhotos[] = albums.map((album) => ({
            ...album,
            photos: photosByAlbum[album.id] ?? []
        }));

        this.logger(`#7 GROUPING POSTS BY USER...`);   
        const postsByUser: Record<number, PostWithComments[]> = {};
        for(let i=0; i<postsWithComments.length; i++) {
            const post = postsWithComments[i];
            if(!postsByUser[post.userId]){
                postsByUser[post.userId] = [post];
            } else {
                postsByUser[post.userId].push(post);
            }
        }

        this.logger(`#8 GROUPING ALBUMS BY USER...`);   
        const albumsByUser: Record<number, AlbumWithPhotos[]> = {};
        for(let i=0; i<albumsWithPhotos.length; i++) {
            const album = albumsWithPhotos[i];
            if(!albumsByUser[album.userId]){
                albumsByUser[album.userId] = [album];
            } else {
                albumsByUser[album.userId].push(album);
            }
        }

        this.logger(`#9 GROUPING TODOS BY USER...`);   
        const todosByUser: Record<number, Todo[]> = {};
        for(let i=0; i<todos.length; i++) {
            const todo = todos[i];
            if(!todosByUser[todo.userId]){
                todosByUser[todo.userId] = [todo];
            } else {
                todosByUser[todo.userId].push(todo);
            }
        }

        this.logger(`#10 COMBINING USERS WITH ALL DATA...`);   
        const result: UserWithPosts[] = users.map((user) => ({
            ...user,
            posts: postsByUser[user.id] ?? [],
            albums: albumsByUser[user.id] ?? [],
            todos: todosByUser[user.id] ?? []
        }))
        this.logger(`#10.1 DONE TOTAL USERS WITH ALL DATA LENGTH: ${result.length}`);
        return result;
    }
}