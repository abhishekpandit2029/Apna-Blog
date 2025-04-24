import { useCallback, useState } from "react";
import { useBlog } from "../../context/BlogContext";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import BlogCard from "./BlogCard";
import { Loader } from "lucide-react";

export default function BlogList() {
  const { state, loadMore, setActiveBlog } = useBlog();
  const { displayedBlogs, hasMore } = state;
  const [isLoading, setIsLoading] = useState(false);

  console.log("state", state);
  const handleIntersect = useCallback(async () => {
    if (hasMore && !isLoading) {
      setIsLoading(true);
      try {
        await loadMore();
      } finally {
        setIsLoading(false);
      }
    }
  }, [hasMore, loadMore, isLoading]);

  const loaderRef = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.1,
    rootMargin: "100px",
    onIntersect: handleIntersect,
    enabled: hasMore && !isLoading,
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Latest Blog Posts
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedBlogs.map((blog) => (
          <BlogCard
            key={blog.id}
            blog={blog}
            onClick={() => setActiveBlog(blog.id)}
          />
        ))}
      </div>

      {(hasMore || isLoading) && (
        <div ref={loaderRef} className="flex justify-center mt-8 py-4">
          <Loader />
        </div>
      )}
    </div>
  );
}
