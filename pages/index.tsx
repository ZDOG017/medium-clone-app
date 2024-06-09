'use client'
import { useEffect, useState } from 'react';
import { useApi, Post } from '../app/api';
import Link from 'next/link';
import { useAuth } from '../app/context/AuthContext';
import ThemeToggle from '../app/components/ThemeToggle';
import withAuth from '../app/components/withAuth';
import Fab from '../app/components/Fab';
import Modal from '../app/components/Modal';

const MainPage: React.FC = () => {
  const { fetchPosts, addPost, updatePost, deletePost } = useApi();
  const { isAuthenticated } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPosts, setNewPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const data = await fetchPosts();
        const storedNewPosts = JSON.parse(localStorage.getItem('newPosts') || '[]');
        const storedEditedPosts = JSON.parse(localStorage.getItem('editedPosts') || '[]');
        const storedDeletedPosts = JSON.parse(localStorage.getItem('deletedPosts') || '[]');

        const finalPosts = data.map((post: Post) => {
          const editedPost = storedEditedPosts.find((p: Post) => p.id === post.id);
          return editedPost || post;
        }).filter((post: Post) => !storedDeletedPosts.some((p: Post) => p.id === post.id));

        setPosts(finalPosts);
        setNewPosts(storedNewPosts);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setLoading(false);
      }
    };

    getPosts();
  }, []);

  const handleAddPost = async () => {
    try {
      const newPost = await addPost({ title, body });
      const updatedNewPosts = [newPost, ...newPosts];
      setNewPosts(updatedNewPosts);
      localStorage.setItem('newPosts', JSON.stringify(updatedNewPosts));
      setTitle('');
      setBody('');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to add post:', error);
    }
  };

  const handleDeletePost = async (id: number) => {
    if (newPosts.some(post => post.id === id)) {
      // Handle deletion of manually added posts
      const updatedNewPosts = newPosts.filter(post => post.id !== id);
      setNewPosts(updatedNewPosts);
      localStorage.setItem('newPosts', JSON.stringify(updatedNewPosts));
    } else {
      // Handle deletion of posts fetched from the server
      try {
        await deletePost(id);
        const updatedPosts = posts.filter(post => post.id !== id);
        const storedDeletedPosts = JSON.parse(localStorage.getItem('deletedPosts') || '[]');
        const updatedDeletedPosts = [...storedDeletedPosts, { id }];
        setPosts(updatedPosts);
        localStorage.setItem('deletedPosts', JSON.stringify(updatedDeletedPosts));
      } catch (error) {
        console.error('Failed to delete post:', error);
      }
    }
  };

  const handleEditClick = (post: Post) => {
    setEditId(post.id);
    setTitle(post.title);
    setBody(post.body);
    setIsModalOpen(true);
  };

  const handleUpdatePost = async () => {
    if (editId !== null) {
      if (newPosts.some(post => post.id === editId)) {
        // Handle update of manually added posts
        const updatedPost = { id: editId, title, body };
        const updatedNewPosts = newPosts.map(post => (post.id === editId ? updatedPost : post));
        setNewPosts(updatedNewPosts);
        localStorage.setItem('newPosts', JSON.stringify(updatedNewPosts));
      } else {
        // Handle update of posts fetched from the server
        try {
          const updatedPost = await updatePost(editId, { title, body });
          const updatedPosts = posts.map(post => (post.id === editId ? updatedPost : post));
          const storedEditedPosts = JSON.parse(localStorage.getItem('editedPosts') || '[]');
          const updatedEditedPosts = [...storedEditedPosts.filter((post: Post) => post.id !== editId), updatedPost];
          setPosts(updatedPosts);
          localStorage.setItem('editedPosts', JSON.stringify(updatedEditedPosts));
        } catch (error) {
          console.error('Failed to update post:', error);
        }
      }
      setEditId(null);
      setTitle('');
      setBody('');
      setIsModalOpen(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div className="flex justify-center items-center min-h-screen">Not authenticated</div>;
  }

  const allPosts = [...newPosts, ...posts];

  return (
    <div className="container mx-auto px-4 py-8">
      <ThemeToggle />
      <h1 className="text-4xl font-bold mb-8">Blog Posts</h1>
      <div className="space-y-8">
        {allPosts.map((post) => (
          <div key={post.id} className="article-card prose lg:prose-xl p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-200">
          <h2 className="text-3xl font-semibold mb-2">{post.title}</h2>
          <p>{post.body}</p>
          <div className="mt-4 space-x-2">
            <Link href={`/${post.id}`} passHref>
              <button className="bg-blue-500 text-white px-4 py-2 rounded">View</button>
            </Link>
            <button onClick={() => handleEditClick(post)} className="bg-yellow-500 text-white px-4 py-2 rounded">
              Edit
            </button>
            <button onClick={() => handleDeletePost(post.id)} className="bg-red-500 text-white px-4 py-2 rounded">
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
    <Fab onClick={() => setIsModalOpen(true)} />
    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
      <div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border px-4 py-2 rounded w-full"
          />
        </div>
        <div className="mb-4">
          <textarea
            placeholder="Body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="border px-4 py-2 rounded w-full"
          />
        </div>
        <div className="mb-4">
          {editId ? (
            <button onClick={handleUpdatePost} className="bg-blue-500 text-white px-4 py-2 rounded">
              Update Post
            </button>
          ) : (
            <button onClick={handleAddPost} className="bg-blue-500 text-white px-4 py-2 rounded">
              Add Post
            </button>
          )}
        </div>
      </div>
    </Modal>
  </div>
);
};

export default withAuth(MainPage);
