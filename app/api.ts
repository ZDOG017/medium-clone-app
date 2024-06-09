import axios from 'axios';
import { useAuth } from './context/AuthContext';

const useAxios = () => {
  const { token, logout } = useAuth();

  const instance = axios.create({
    baseURL: 'https://dummyjson.com',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  instance.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response) {
        if (error.response.status === 401) {
          logout();
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

export const useApi = () => {
  const axiosInstance = useAxios();

  const fetchPosts = async () => {
    try {
      const response = await axiosInstance.get('/posts');
      return Array.isArray(response.data.posts) ? response.data.posts : [];
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  };

  const fetchPostById = async (id: number) => {
    try {
      const response = await axiosInstance.get(`/posts/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching post:', error);
      throw error;
    }
  };

  const addPost = async (post: Omit<Post, 'id'>) => {
    try {
      const response = await axiosInstance.post('/posts/add', {
        ...post,
        userId: 5
      });
      return response.data;
    } catch (error) {
      console.error('Error adding post:', error);
      throw error;
    }
  };

  const updatePost = async (id: number, post: Partial<Post>) => {
    try {
      const response = await axiosInstance.put(`/posts/${id}`, post);
      return response.data;
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  };

  const deletePost = async (id: number) => {
    try {
      const response = await axiosInstance.delete(`/posts/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  };

  return { fetchPosts, fetchPostById, addPost, updatePost, deletePost };
};

export type Post = {
  id: number;
  title: string;
  body: string;
};
