// app/api.ts
import axios from 'axios';

const API_URL = 'https://dummyjson.com/posts';

export interface Post {
  id: number;
  title: string;
  body: string;
}

export const fetchPosts = async (): Promise<Post[]> => {
  try {
    const response = await axios.get<{ posts: Post[] }>(API_URL);
    return response.data.posts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

export const fetchPostById = async (id: number): Promise<Post> => {
  try {
    const response = await axios.get<Post>(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching post:', error);
    throw error;
  }
};
