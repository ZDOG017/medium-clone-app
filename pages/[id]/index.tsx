'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Post, useApi } from '../../app/api';
import { useAuth } from '../../app/context/AuthContext';

const PostPage: React.FC = () => {
  const { fetchPostById } = useApi();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (id) {
      const getPost = async () => {
        try {
          const data = await fetchPostById(Number(id));
          setPost(data);
        } catch (error) {
          console.error('Failed to fetch post:', error);
        } finally {
          setLoading(false);
        }
      };

      getPost();
    }
  }, [id]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div className="flex justify-center items-center min-h-screen">Not authenticated</div>;
  }

  if (!post) {
    return <div className="flex justify-center items-center min-h-screen">Post not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <article className="prose lg:prose-xl bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <p>{post.body}</p>
      </article>
    </div>
  );
};

export default PostPage;
