export interface Postcomments {
    postCommentId: number;  // Primary Key
    postId: number;
    postComment: string;
    userId: number;
    createdAt: Date;
  }
  