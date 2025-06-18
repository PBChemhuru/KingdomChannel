export interface TopContentDto {
  contentId: number | null;
  contentType: string;
  count: number;
  title: string;
  url: string;
  thumbnail: string;
}

export interface ContentStatsDto {
  totalPosts: number;
  totalBooklets: number;
  totalVideos: number;
}

export interface EngagementStatsDto {
  totalLikes: number;
  totalComments: number;
  topLiked: TopContentDto[];
  topCommented: TopContentDto[];
}

export interface UserStatsDto {
  totalUsers: number;
  newUsersThisMonth: number;
}

export interface UserGrowthDto {
  year:string
  month: string;
  newUsers: number;
}

export interface AdminStatsDto {
  content: ContentStatsDto;
  engagement: EngagementStatsDto;
  users: UserStatsDto;
  topLiked: TopContentDto[];        // Optional if already in engagement
  topCommented: TopContentDto[];    // Optional if already in engagement
  userGrowth: UserGrowthDto[];
}