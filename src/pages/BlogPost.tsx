import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { useBlogPost } from "@/hooks/use-cms";
import Navbar from "@/components/Navbar";
import CyberBackground3D from "@/components/CyberBackground3D";
import FooterSection from "@/components/FooterSection";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading } = useBlogPost(slug || "");

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <CyberBackground3D />
      <Navbar />

      <article className="relative pt-28 pb-20 px-4">
        <div className="relative z-10 max-w-3xl mx-auto">
          {isLoading ? (
            <div className="text-center py-20 font-mono-terminal text-primary animate-pulse">Loading...</div>
          ) : !post ? (
            <div className="text-center py-20">
              <h1 className="font-display text-3xl text-foreground mb-4">Post Not Found</h1>
              <Link to="/blog" className="font-mono-terminal text-primary hover:underline">← Back to Blog</Link>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Link to="/blog" className="font-mono-terminal text-xs text-primary hover:underline mb-6 inline-block">← Back to Blog</Link>

              {post.cover_image_url && (
                <div className="rounded-xl overflow-hidden mb-8 gradient-border">
                  <img src={post.cover_image_url} alt={post.title} className="w-full h-64 md:h-96 object-cover" />
                </div>
              )}

              <div className="flex flex-wrap gap-1.5 mb-4">
                {(post.tags || []).map((tag) => (
                  <span key={tag} className="text-[10px] font-mono-terminal px-2 py-0.5 rounded-full border border-neon-green/20 text-neon-green/70 bg-neon-green/5">{tag}</span>
                ))}
              </div>

              <h1 className="font-display text-4xl md:text-5xl text-foreground mb-4">{post.title}</h1>

              <div className="flex items-center gap-4 text-sm font-mono-terminal text-muted-foreground mb-8 pb-8 border-b border-border/50">
                <span>{post.author}</span>
                <span>•</span>
                <span>{post.published_at ? new Date(post.published_at).toLocaleDateString() : ""}</span>
              </div>

              <div className="prose prose-invert prose-lg max-w-none
                prose-headings:font-display prose-headings:text-foreground
                prose-p:text-foreground/85 prose-p:leading-relaxed
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-strong:text-foreground
                prose-code:text-primary prose-code:bg-secondary/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                prose-pre:bg-secondary/50 prose-pre:border prose-pre:border-border/50 prose-pre:rounded-xl
                prose-img:rounded-xl prose-img:border prose-img:border-border/30
                prose-blockquote:border-primary/50 prose-blockquote:bg-primary/5 prose-blockquote:rounded-r-lg prose-blockquote:py-1
              " dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, "<br/>") }} />
            </motion.div>
          )}
        </div>
      </article>

      <FooterSection />
    </div>
  );
};

export default BlogPost;
