import React, { useState, useEffect } from 'react';
import { BookOpen, ChevronLeft, ArrowRight, Table, HelpCircle, Link as LinkIcon, Share2, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { kbService } from '../services/kbService';
import { KnowledgeBasePost, ServiceType } from '../types';
import { translations } from '../translations';

interface KBArticlePageProps {
  category: string;
  slug: string;
  language: string;
  onNavigate: (view: string, category?: string, slug?: string) => void;
}

const KBArticlePage: React.FC<KBArticlePageProps> = ({ category, slug, language, onNavigate }) => {
  const [post, setPost] = useState<KnowledgeBasePost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const posts = await kbService.getPosts();
        const found = posts.find(p => p.slug === slug && p.category === category);
        setPost(found || null);
      } catch (error) {
        console.error("Failed to fetch KB article:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
    window.scrollTo(0, 0);
  }, [category, slug]);

  useEffect(() => {
    if (post) {
      const originalTitle = document.title;
      document.title = `${post.title} | Cosmic Database | Atlantic Oracle™`;
      const metaDesc = document.querySelector('meta[name="description"]');
      const originalDesc = metaDesc?.getAttribute('content');
      
      if (metaDesc) {
        metaDesc.setAttribute('content', post.metaDescription || post.shortDefinition);
      }

      // Breadcrumb Schema
      const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Database",
            "item": "https://atlanticoracle.com/database"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": post.category,
            "item": `https://atlanticoracle.com/database/${post.category}`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": post.title,
            "item": `https://atlanticoracle.com/database/${post.category}/${post.slug}`
          }
        ]
      };

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = 'breadcrumb-schema';
      script.text = JSON.stringify(breadcrumbSchema);
      document.head.appendChild(script);

      return () => {
        document.title = originalTitle;
        if (metaDesc && originalDesc) metaDesc.setAttribute('content', originalDesc);
        const scriptTags = document.querySelectorAll('#breadcrumb-schema');
        scriptTags.forEach(tag => tag.remove());
      };
    }
  }, [post]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cosmic-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-cosmic-gold/20 border-t-cosmic-gold rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-cosmic-900 pt-32 px-6 text-center space-y-8">
        <h1 className="text-4xl font-cinzel text-white uppercase tracking-widest">Transmission Lost</h1>
        <p className="text-cosmic-silver italic">The requested wisdom could not be retrieved from the database.</p>
        <button 
          onClick={() => onNavigate('database')}
          className="px-8 py-3 bg-cosmic-gold text-cosmic-900 rounded-xl font-bold hover:scale-105 transition-transform"
        >
          Return to Database
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cosmic-900 pt-32 pb-32 px-6">
      <div className="max-w-4xl mx-auto space-y-16">
        {/* Navigation & Actions */}
        <div className="flex items-center justify-between">
          <button 
            onClick={() => onNavigate('database')}
            className="flex items-center gap-2 text-cosmic-gold/60 hover:text-cosmic-gold transition-colors uppercase tracking-widest text-[10px] font-bold group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Database
          </button>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleCopyLink}
              className="p-2 text-cosmic-gold/60 hover:text-cosmic-gold transition-colors rounded-full hover:bg-cosmic-gold/10"
              title="Copy Link"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
            <button className="p-2 text-cosmic-gold/60 hover:text-cosmic-gold transition-colors rounded-full hover:bg-cosmic-gold/10">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Article Header */}
        <header className="space-y-8 text-center">
          <div className="flex items-center justify-center gap-3 text-cosmic-gold/60 text-[10px] uppercase tracking-[0.3em]">
            <BookOpen className="w-3 h-3" />
            <span>{post.category.replace(/-/g, ' ')}</span>
            <span className="w-1 h-1 bg-cosmic-gold/30 rounded-full"></span>
            <time>Last Modified: {new Date(post.dateModified).toLocaleDateString()}</time>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-cinzel text-white uppercase tracking-widest leading-tight">
            {post.title}
          </h1>

          <div className="flex justify-center">
            <div className="w-32 h-px bg-cosmic-gold/30"></div>
          </div>

          <p className="definition text-2xl md:text-3xl font-serif italic text-cosmic-silver leading-relaxed max-w-3xl mx-auto">
            {post.shortDefinition}
          </p>
        </header>

        {/* Main Content */}
        <article className="prose prose-invert prose-cosmic max-w-none">
          <div className="markdown-body text-xl leading-relaxed font-serif text-cosmic-silver/90 space-y-8">
            <ReactMarkdown>{post.mainContent}</ReactMarkdown>
          </div>
        </article>

        {/* Data Table Section */}
        {post.dataTable && (
          <section className="space-y-6">
            <div className="flex items-center gap-3 text-cosmic-gold uppercase tracking-widest text-xs font-bold">
              <Table className="w-4 h-4" />
              <span>Technical Characteristics</span>
            </div>
            <div className="bg-cosmic-800/20 border border-cosmic-gold/10 rounded-3xl overflow-hidden p-8">
              <div 
                className="kb-data-table overflow-x-auto"
                dangerouslySetInnerHTML={{ __html: post.dataTable }}
              />
            </div>
          </section>
        )}

        {/* Synthesis Note */}
        {post.synthesisNote && (
          <section className="relative p-12 bg-cosmic-gold/5 border border-cosmic-gold/10 rounded-[3rem] overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <BookOpen className="w-32 h-32 text-cosmic-gold" />
            </div>
            <div className="relative space-y-6">
              <h4 className="text-sm font-cinzel text-cosmic-gold uppercase tracking-[0.3em]">Synthesis & Connection</h4>
              <blockquote className="text-2xl font-serif italic text-cosmic-silver leading-relaxed">
                "{post.synthesisNote}"
              </blockquote>
            </div>
          </section>
        )}

        {/* FAQ Block */}
        {post.faq && post.faq.length > 0 && (
          <section className="space-y-8">
            <div className="flex items-center gap-3 text-cosmic-gold uppercase tracking-widest text-xs font-bold">
              <HelpCircle className="w-4 h-4" />
              <span>Frequently Asked Questions</span>
            </div>
            <div className="space-y-4">
              {post.faq.map((item, idx) => (
                <div key={idx} className="bg-cosmic-800/20 border border-cosmic-gold/10 rounded-2xl p-8 space-y-4">
                  <h5 className="text-lg font-cinzel text-white uppercase tracking-widest">{item.question}</h5>
                  <p className="text-cosmic-silver/80 leading-relaxed italic">{item.answer}</p>
                </div>
              ))}
            </div>
            {/* JSON-LD for AI/SEO */}
            <script type="application/ld+json">
              {JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": post.faq.map(item => ({
                  "@type": "Question",
                  "name": item.question,
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": item.answer
                  }
                }))
              })}
            </script>
          </section>
        )}

        {/* Internal Linking / CTA */}
        {post.relatedProductId && (
          <section className="pt-20 border-t border-cosmic-gold/10">
            <div className="bg-cosmic-800/40 border border-cosmic-gold/20 rounded-[3rem] p-12 flex flex-col md:flex-row items-center justify-between gap-8 group hover:border-cosmic-gold/40 transition-all">
              <div className="space-y-4 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 text-cosmic-gold/60 uppercase tracking-widest text-[10px] font-bold">
                  <LinkIcon className="w-3 h-3" /> Related Transmission
                </div>
                <h3 className="text-3xl font-cinzel text-white uppercase tracking-widest">
                  Deepen Your Understanding
                </h3>
                <p className="text-cosmic-silver italic">
                  Explore how these cosmic principles manifest in your personal journey.
                </p>
              </div>
              <button 
                onClick={() => onNavigate('form', post.relatedProductId)}
                className="px-10 py-5 bg-cosmic-gold text-cosmic-900 rounded-2xl font-bold hover:scale-105 transition-all flex items-center gap-3 shadow-2xl shadow-cosmic-gold/20"
              >
                Get Personal Report <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default KBArticlePage;
