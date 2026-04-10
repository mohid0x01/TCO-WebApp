import { motion } from "framer-motion";
import { useBlogPosts } from "@/hooks/use-cms";
import { Link } from "react-router-dom";

const BlogSection = () => {
  const { data: posts } = useBlogPosts();
  const latest = (posts || []).slice(0, 3);

  if (latest.length === 0) return null;

  return (
    <section id="blog" className="relative py-28 px-4">
      <div className="absolute inset-0 grid-bg opacity-10" />
      <div className="relative max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="font-mono-terminal text-sm text-neon-green tracking-widest uppercase">// Latest Intel</span>
          <h2 className="font-display text-4xl md:text-6xl text-foreground mt-2">Blog</h2>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-neon-green to-transparent mx-auto mt-6" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latest.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link to={`/blog/${post.slug}`} className="block glass-card rounded-xl overflow-hidden gradient-border glass-card-hover group transition-all duration-300 hover:box-glow-blue">
                {post.cover_image_url && (
                  <div className="h-48 overflow-hidden">
                    <img src={post.cover_image_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {(post.tags || []).slice(0, 3).map((tag) => (
                      <span key={tag} className="text-[10px] font-mono-terminal px-2 py-0.5 rounded-full border border-neon-green/20 text-neon-green/70 bg-neon-green/5">{tag}</span>
                    ))}
                  </div>
                  <h3 className="font-display text-xl text-foreground group-hover:text-primary transition-colors mb-2">{post.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-xs font-mono-terminal text-muted-foreground">
                    <span>{post.author}</span>
                    <span>{post.published_at ? new Date(post.published_at).toLocaleDateString() : ""}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {(posts || []).length > 3 && (
          <div className="text-center mt-10">
            <Link to="/blog" className="font-display text-sm tracking-wider uppercase px-8 py-3 bg-primary/10 border border-primary/40 text-primary hover:bg-primary/20 transition-all rounded-lg inline-block">
              View All Posts →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogSection;
