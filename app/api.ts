import axios from 'axios';
import { useAuth } from './context/AuthContext';

const useAxios = () => {
  const { token } = useAuth();

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

  return instance;
};

export const useApi = () => {
  const axiosInstance = useAxios();

  const fetchPosts = async () => {
    try {
      const response = await axiosInstance.get('/auth/posts');
      return Array.isArray(response.data.posts) ? response.data.posts : [];
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  };

  const fetchPostById = async (id: number) => {
    try {
      const response = await axiosInstance.get(`/auth/posts/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching post:', error);
      throw error;
    }
  };

  return { fetchPosts, fetchPostById };
};

export type Post = {
  id: number;
  title: string;
  body: string;
};
