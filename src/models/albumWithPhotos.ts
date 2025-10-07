import { Album } from "./album";
import { Photo } from "./photo";

export interface AlbumWithPhotos extends Album {
    photos: Photo[]
}
