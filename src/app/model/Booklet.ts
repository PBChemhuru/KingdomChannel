export interface Booklet {
    bookletId: number;  // Primary Key
    bookletTitle: string;
    bookletLink: string;
    bookletDescription: string;
    thumbnail: string;
    userId: number;
    createdAt: Date;
  }
  