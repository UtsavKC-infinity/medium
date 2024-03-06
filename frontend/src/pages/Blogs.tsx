import { Appbar } from "../components/Appbar";
import { BlogCard } from "../components/BlogCard";
import { useBlog } from "../hooks";

export const Blogs = () => {
  const { loading, blogs } = useBlog();
  if (loading) {
    return <div>loading...</div>;
  }
  return (
    <div>
      <Appbar />
      <div className="flex justify-center">
        <div className="max-w-xl">
          {blogs.map((blog) => (
            <BlogCard
              authorName={"utsav kc"}
              title={
                "What TF Did I Watch?: On Zola, Reesa Teesa, and Black Digital Storytelling"
              }
              content={
                "Digital Griots, Listening Publics, and the Ways Twitter and TikTok Influence Communication Practice"
              }
              publishedDate={"2nd feb 2024"}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
