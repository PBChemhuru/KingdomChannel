export interface Post {
    postId: number;  // Primary Key
    postTitle: string;
    postContent: string;
    likeCount: number;
    userId: number;
    thumbnail: string;
    createdAt: Date;
    updatedAt:Date;
  }
  