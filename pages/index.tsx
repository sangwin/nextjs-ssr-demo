import React, { useState, useEffect } from "react";
import Head from "next/head";

type Post = {
  id: number;
  title: string;
  body: string;
};

type HomePageProps = {
  posts?: Post[];
  error?: string;
};

const HomePage: React.FC<HomePageProps> = ({ posts = [], error }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleStop = () => setLoading(false);
    window.addEventListener("beforeunload", handleStart);
    window.addEventListener("load", handleStop);
    return () => {
      window.removeEventListener("beforeunload", handleStart);
      window.removeEventListener("load", handleStop);
    };
  }, []);

  return (
    <>
      <Head>
        <title>Next.js SSR Demo</title>
      </Head>

      <div className="min-h-screen p-6">
        <h1 className="text-3xl font-bold mb-2 text-blue-600">🌍 Next.js SSR Demo</h1>
        <p className="mb-6 text-gray-700">
          This page is rendered on the <strong>server</strong> with an API call.
        </p>

        {loading && (
          <div className="text-center text-blue-500 font-semibold mb-6">
            Loading...
          </div>
        )}

        {error ? (
          <div className="text-red-600 font-semibold">
            ❌ Failed to load posts: {error}
          </div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.slice(0, 9).map((post) => (
              <li key={post.id} className="bg-white rounded-2xl shadow p-4 hover:shadow-lg transition-shadow">
                <h3 className="font-bold text-lg mb-2 text-blue-800">{post.title}</h3>
                <p className="text-gray-700 text-sm">{post.body}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export async function getServerSideProps() {
  try {
    const res = await fetch("http://localhost:3000/api/posts");
    if (!res.ok) throw new Error("Failed to fetch API");
    const posts = await res.json();
    return { props: { posts } };
  } catch (error: any) {
    return { props: { error: error.message } };
  }
}

export default HomePage;
