import React, { useState, useEffect } from 'react';
import { BookOpen, ChevronRight, Hash, Search, ArrowRight } from 'lucide-react';
import { kbService } from '../services/kbService';
import { KnowledgeBasePost, KBCategory } from '../types';
import { translations } from '../translations';

interface KnowledgeBasePageProps {
  language: string;
  onNavigate: (view: string, category?: string, slug?: string) => void;
}

const CATEGORIES: { id: KBCategory; label: { [key: string]: string }; description: { [key: string]: string } }[] = [
  { 
    id: 'astrological-entities', 
    label: {
      English: 'Astrological Entities',
      Spanish: 'Entidades Astrológicas',
      Portuguese: 'Entidades Astrológicas'
    }, 
    description: {
      English: 'Planets, Houses, and Aspects',
      Spanish: 'Planetas, Casas y Aspectos',
      Portuguese: 'Planetas, Casas e Aspetos'
    } 
  },
  { 
    id: 'numerical-vibrations', 
    label: {
      English: 'Numerical Vibrations',
      Spanish: 'Vibraciones Numéricas',
      Portuguese: 'Vibrações Numéricas'
    }, 
    description: {
      English: 'Numbers and Pythagorean Calculations',
      Spanish: 'Números y Cálculos Pitagóricos',
      Portuguese: 'Números e Cálculos Pitagóricos'
    } 
  },
  { 
    id: 'synthesis-methodology', 
    label: {
      English: 'Synthesis & Methodology',
      Spanish: 'Síntesis y Metodología',
      Portuguese: 'Síntese e Metodologia'
    }, 
    description: {
      English: 'How systems work together',
      Spanish: 'Cómo los sistemas trabajan juntos',
      Portuguese: 'Como os sistemas funcionam juntos'
    } 
  },
  { 
    id: 'human-design-basics', 
    label: {
      English: 'Human Design Basics',
      Spanish: 'Conceptos Básicos de Diseño Humano',
      Portuguese: 'Básicos do Design Humano'
    }, 
    description: {
      English: 'Types, Authorities, and Centers',
      Spanish: 'Tipos, Autoridades y Centros',
      Portuguese: 'Tipos, Autoridades e Centros'
    } 
  }
];

const KnowledgeBasePage: React.FC<KnowledgeBasePageProps> = ({ language, onNavigate }) => {
  const [posts, setPosts] = useState<KnowledgeBasePost[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const lang = (language as ReportLanguage) || 'English';

  useEffect(() => {
    const originalTitle = document.title;
    document.title = (translations[lang] as any).kb_title || `Cosmic Database | Atlantic Oracle™ Knowledge Base`;
    const metaDesc = document.querySelector('meta[name="description"]');
    const originalDesc = metaDesc?.getAttribute('content');
    
    if (metaDesc) {
      metaDesc.setAttribute('content', (translations[lang] as any).kb_meta_desc || 'Explore the Atlantic Oracle™ Knowledge Base. In-depth definitions of astrological entities, numerical vibrations, and Human Design strategy.');
    }

    return () => {
      document.title = originalTitle;
      if (metaDesc && originalDesc) metaDesc.setAttribute('content', originalDesc);
    };
  }, [lang]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const fetched = await kbService.getPosts();
        setPosts(fetched);
      } catch (error) {
        console.error("Failed to fetch KB posts:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const getLocalizedValue = (value: string | { [key: string]: any } | undefined, lang: string) => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    return value[lang] || value['English'] || '';
  };

  const filteredPosts = posts.filter(post => {
    const title = getLocalizedValue(post.title, lang).toLowerCase();
    const shortDef = getLocalizedValue(post.shortDefinition, lang).toLowerCase();
    const query = searchQuery.toLowerCase();
    return title.includes(query) || shortDef.includes(query);
  });

  const getPostsByCategory = (categoryId: KBCategory) => {
    return filteredPosts.filter(post => post.category === categoryId);
  };

  return (
    <div className="min-h-screen bg-cosmic-900 pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto space-y-20">
        {/* Header */}
        <header className="text-center space-y-8 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-4 text-cosmic-gold/60 uppercase tracking-[0.4em] text-xs">
            <BookOpen className="w-4 h-4" />
            <span>{(translations[lang] as any).kb_tag || 'Sacred Database'}</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-cinzel text-white uppercase tracking-widest leading-tight">
            {(translations[lang] as any).kb_header || 'Knowledge Base'}
          </h1>
          <p className="text-cosmic-silver text-xl font-serif italic leading-relaxed">
            {(translations[lang] as any).kb_subheader || 'A structured repository of cosmic wisdom, synthesized for the modern seeker and AI-assisted exploration.'}
          </p>

          {/* Search */}
          <div className="relative max-w-xl mx-auto pt-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cosmic-gold/40" />
            <input 
              type="text"
              placeholder={(translations[lang] as any).kb_search || "Search the database..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-cosmic-800/40 border border-cosmic-gold/20 rounded-2xl py-4 pl-12 pr-6 text-white outline-none focus:border-cosmic-gold/40 transition-all placeholder:text-cosmic-silver/30"
            />
          </div>
        </header>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {CATEGORIES.map(category => {
            const categoryPosts = getPostsByCategory(category.id);
            if (searchQuery && categoryPosts.length === 0) return null;

            return (
              <section key={category.id} className="bg-cosmic-800/20 border border-cosmic-gold/10 rounded-[3rem] p-10 space-y-8 hover:border-cosmic-gold/30 transition-all group">
                <div className="space-y-2">
                  <h2 className="text-2xl font-cinzel text-white uppercase tracking-widest group-hover:text-cosmic-gold transition-colors">
                    {category.label[lang] || category.label['English']}
                  </h2>
                  <p className="text-cosmic-silver/60 text-sm italic">{category.description[lang] || category.description['English']}</p>
                </div>

                <div className="space-y-4">
                  {categoryPosts.length > 0 ? (
                    categoryPosts.map(post => (
                      <button 
                        key={post.id}
                        onClick={() => onNavigate('kb-article', category.id, post.slug)}
                        className="w-full flex items-center justify-between p-4 rounded-2xl bg-cosmic-900/40 border border-transparent hover:border-cosmic-gold/20 hover:bg-cosmic-800/40 transition-all text-left group/item"
                      >
                        <div className="flex items-center gap-4">
                          <Hash className="w-4 h-4 text-cosmic-gold/40 group-hover/item:text-cosmic-gold transition-colors" />
                          <span className="text-cosmic-silver group-hover/item:text-white transition-colors font-medium">
                            {getLocalizedValue(post.title, lang)}
                          </span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-cosmic-gold/20 group-hover/item:text-cosmic-gold transition-all group-hover/item:translate-x-1" />
                      </button>
                    ))
                  ) : (
                    <p className="text-cosmic-silver/20 text-xs italic uppercase tracking-widest py-4">
                      {isLoading ? ((translations[lang] as any).kb_loading || 'Loading transmissions...') : ((translations[lang] as any).kb_empty || 'No articles in this frequency yet.')}
                    </p>
                  )}
                </div>
              </section>
            );
          })}
        </div>

        {/* Footer Note */}
        <footer className="text-center pt-20 border-t border-cosmic-gold/10">
          <div className="max-w-2xl mx-auto space-y-6">
            <p className="text-cosmic-silver/40 text-sm leading-relaxed italic">
              {(translations[lang] as any).kb_footer || 'This database is continuously updated with new findings and cross-system syntheses. All content is structured for optimal indexing by search engines and AI agents.'}
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default KnowledgeBasePage;
