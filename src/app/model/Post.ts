export interface Post {
    postId: number;  // Primary Key
    postTitle: string;
    postContent: string;
    likeCount: number;
    userId: number;
   
    // Timestamps
    createdAt: Date;
    updatedAt: Date;
  }
  