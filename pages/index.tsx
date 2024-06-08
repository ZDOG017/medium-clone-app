'use client'
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useApi, Post } from '../app/api';
import { useAuth } from '../app/context/AuthContext';

const MainPage: React.FC = () => {
  const { fetchPosts } = useApi();
  const { isAuthenticated } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const data = await fetchPosts();
        setPosts(data);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setLoading(false);
      }
    };

    getPosts();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div className="flex justify-center items-center min-h-screen">Not authenticated</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Blog Posts</h1>
      <div className="space-y-8">
        {posts.map((post) => (
          <Link key={post.id} href={`/${post.id}`} passHref>
            <article className="prose lg:prose-xl bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-200">
              <h2 className="text-3xl font-semibold mb-2">{post.title}</h2>
              <p>{post.body}</p>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MainPage;
