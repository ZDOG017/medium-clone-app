'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Post, useApi } from '../../app/api';
import { useAuth } from '../../app/context/AuthContext';
import ThemeToggle from '../../app/components/ThemeToggle';
import withAuth from '../../app/components/withAuth';

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
          const fetchedPost = await fetchPostById(Number(id));
          const storedEditedPosts = JSON.parse(localStorage.getItem('editedPosts') || '[]');
          const editedPost = storedEditedPosts.find((post: Post) => post.id === Number(id));
          setPost(editedPost || fetchedPost);
        } catch (error) {
          console.error('Failed to fetch post:', error);
          const newPosts = JSON.parse(localStorage.getItem('newPosts') || '[]');
          const foundPost = newPosts.find((post: Post) => post.id === Number(id));
          if (foundPost) {
            setPost(foundPost);
          } else {
            setPost(null);
          }
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
      <ThemeToggle />
      <article className="article-card prose lg:prose-xl p-6 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <p>{post.body}</p>
      </article>
    </div>
  );
};

export default withAuth(PostPage);
