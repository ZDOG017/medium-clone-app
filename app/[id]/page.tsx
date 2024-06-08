// app/[id]/page.tsx
'use client'
import { notFound } from 'next/navigation';
import { fetchPostById, Post } from '../api';

interface PostPageProps {
  params: {
    id: string;
  };
}

const PostPage: React.FC<PostPageProps> = async ({ params }) => {
  const { id } = params;

  let post: Post | null = null;
  try {
    post = await fetchPostById(Number(id));
  } catch (error) {
    console.error('Failed to fetch post:', error);
  }

  if (!post) {
    notFound();
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
