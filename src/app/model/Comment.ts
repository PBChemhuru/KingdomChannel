export interface Comment {
    commentId: number;  // Primary Key
    postId?: number;
    videoId?: number;
    bookletId?: number;
    comment: string;
    userId: number;
    username:string;
    createdAt: Date;
  }
  