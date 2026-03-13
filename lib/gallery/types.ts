export interface AppAlbum {
  _id: string;
  title: string;
  description?: string;
  coverImageId?: string; // file _id reference
  coverUrl?: string; // resolved S3 URL (populated at query time)
  coverBlurhash?: string;
  imageIds: string[]; // ordered file _id references
  isVisible: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface AppAlbumInput {
  title: string;
  description?: string;
  coverImageId?: string;
  coverBlurhash?: string;
  imageIds: string[];
  isVisible: boolean;
  order: number;
}
