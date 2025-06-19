export interface PickOfTheMonth {
  id: number;
  title: string;
  imageUrl: string;
  type: 'Post' | 'Booklet';
  description: string;
  likeCount: number;
}
