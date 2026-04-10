import { motion } from "framer-motion";
import { useBlogPosts } from "@/hooks/use-cms";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import CyberBackground3D from "@/components/CyberBackground3D";
import FooterSection from "@/components/FooterSection";

const Blog = () => {
  const { data: posts, isLoading } = useBlogPosts();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <CyberBackground3D />
      <Navbar />

      <section className="relative pt-28 pb-20 px-4">
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <span className="font-mono-terminal text-sm text-neon-green tracking-widest uppercase">// Intel Feed</span>
            <h1 className="font-display text-5xl md:text-7xl text-foreground mt-2">Blog</h1>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">Daily cybersecurity insights, tools breakdowns, and operations reports.</p>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-neon-green to-transparent mx-auto mt-6" />
          </motion.div>

          {isLoading ? (
            <div className="text-center py-20 font-mono-terminal text-primary animate-pulse">Loading posts...</div>
          ) : (
            <div className="space-y-6">
              {(posts || []).map((post, i) => (
                <motion.div key={post.id} initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                  <Link to={`/blog/${post.slug}`} className="block glass-card rounded-xl overflow-hidden gradient-border glass-card-hover group transition-all duration-300 hover:box-glow-blue">
                    <div className="flex flex-col sm:flex-row">
                      {post.cover_image_url && (
                        <div className="sm:w-64 h-48 sm:h-auto flex-shrink-0 overflow-hidden">
                          <img src={post.cover_image_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                        </div>
                      )}
                      <div className="p-6 flex-1">
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {(post.tags || []).slice(0, 4).map((tag) => (
                            <span key={tag} className="text-[10px] font-mono-terminal px-2 py-0.5 rounded-full border border-neon-green/20 text-neon-green/70 bg-neon-green/5">{tag}</span>
                          ))}
                        </div>
                        <h2 className="font-display text-2xl text-foreground group-hover:text-primary transition-colors mb-2">{post.title}</h2>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{post.excerpt}</p>
                        <div className="flex items-center justify-between text-xs font-mono-terminal text-muted-foreground">
                          <span>{post.author}</span>
                          <span>{post.published_at ? new Date(post.published_at).toLocaleDateString() : ""}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
              {(posts || []).length === 0 && (
                <div className="text-center py-20 glass-card rounded-xl gradient-border">
                  <p className="font-mono-terminal text-muted-foreground">No posts yet. Check back soon!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <FooterSection />
    </div>
  );
};

export default Blog;
