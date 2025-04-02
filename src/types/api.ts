/**
 * Post response from the API
 */
export interface Post {
  id: string;
  content: string;
  imageUrl: string | null;
  userId: string;
  parentId: string | null;
  createdAt: string;
}

/**
 * Input for creating a new post
 */
export interface PostInput {
  content: string;
  imageUrl?: string;
}

/**
 * Input for creating a reply
 */
export interface ReplyInput {
  content: string;
  parentId: string;
  imageUrl?: string;
}

/**
 * Input for liking a post
 */
export interface LikeInput {
  postId: string;
}

/**
 * Response from liking/unliking a post
 */
export interface LikeResponse {
  liked: boolean;
}

/**
 * User/author information
 */
export interface Author {
  id: string;
  name: string;
  image: string | null;
}

/**
 * Feed post with additional metadata
 */
export interface FeedPost {
  id: string;
  content: string;
  imageUrl: string | null;
  createdAt: string;
  author: Author;
  likeCount: number;
  isLiked: boolean;
  isReply: boolean;
  parentId: string | null;
}

/**
 * Error response
 */
export interface ErrorResponse {
  error: string;
}
