export interface FlaggedComment {
    flagId: number;  // Primary Key
    flagDescription: string;
    flagResolution: string;
    flagResolutionStatus: string;
    commentId: number;
    userId: number;
    createdAt: Date;
    updatedAt:Date;

  }
  