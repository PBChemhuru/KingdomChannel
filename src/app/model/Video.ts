export interface Video {
    videoId: number;  // Primary Key
    videoTitle: string;
    videoLink: string;
    videoDescription: string;
    thumbnail: string;
    userId: number;
    createdAt: Date;
    updatedAt:Date;

  }