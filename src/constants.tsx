
import React from 'react';
import { 
  Sparkles, Heart, Briefcase, Calendar, Hash, Globe, 
  History, Activity, MoonStar, Star, ShieldCheck, Zap, Gift, Compass, Fingerprint, TrendingUp, Coins, Battery, Baby, Moon, Trophy, Target, CloudSun
} from 'lucide-react';
import { ServiceType, Service, NewsPost, ReportLanguage } from './types';
import { translations } from './translations';

export const INITIAL_NEWS: NewsPost[] = [
  {
    id: 'init-1',
    slug: 'the-saturn-shift-navigating-the-great-restructuring',
    title: 'The Saturn Shift: Navigating the Great Restructuring',
    date: '2026-02-22',
    topic: 'astrology',
    format: 'forecast',
    text: 'As Saturn moves through the final degrees of its current transit, the collective consciousness is undergoing a profound restructuring. This period marks the end of old systems and the birth of new, more resilient structures. For individuals, this is a time to audit your foundations. What is built on sand will crumble; what is built on truth will endure. Pay close attention to your professional boundaries and long-term commitments during this celestial window.',
    imageUrl: 'https://picsum.photos/seed/saturn/1200/800'
  }
];

export const LIGHT_DROPS: Service[] = [
  {
    id: ServiceType.FORTUNE_MAP,
    slug: "fortune-map",
    title: "The Fortune Map (Weekly Forecast)",
    description: "Your personalized weekly luck index, power windows, and numerical vibrations for the next 7 days.",
    icon: "trending",
    price: 10,
    isFree: false,
    stripeUrls: {
      English: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04",
      Portuguese: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04"
    },
    stripeUrlsDiscounted: {
      English: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04", // Replace with 5 EUR link
      Portuguese: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04"
    }
  },
  {
    id: ServiceType.CAPITAL_ALIGNMENT,
    slug: "capital-alignment",
    title: "Capital Alignment",
    description: "Identify your leading income energy and financial resource leaks.",
    icon: "coins",
    price: 10,
    isFree: false,
    stripeUrls: {
      English: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04",
      Portuguese: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04"
    },
    stripeUrlsDiscounted: {
      English: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04",
      Portuguese: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04"
    }
  },
  {
    id: ServiceType.ENERGY_PULSE,
    slug: "energy-pulse",
    title: "The Energy Pulse",
    description: "Biological rhythm guide and a 1-minute mental reset technique.",
    icon: "battery",
    price: 10,
    isFree: false,
    stripeUrls: {
      English: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04",
      Portuguese: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04"
    },
    stripeUrlsDiscounted: {
      English: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04",
      Portuguese: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04"
    }
  },
  {
    id: ServiceType.FREE_DREAM_INTERPRETATION,
    slug: "dream-whisper",
    title: "The Dream Whisper",
    description: "A brief psychological insight into your dream. Soft advice from a wise sage to help you find clarity.",
    icon: "moonstar",
    price: 10,
    isFree: false,
    stripeUrls: {
      English: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04",
      Portuguese: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04"
    },
    stripeUrlsDiscounted: {
      English: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04",
      Portuguese: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04"
    }
  },
  {
    id: ServiceType.DAILY_VIBRATION,
    slug: "daily-vibration",
    title: "The Daily Vibration (Transit Key)",
    description: "Your personal \"Frequency of the Day\" and a specific action-mantra to align with today’s transits. Short calculation of how today's planetary positions resonate personally with your chart.",
    icon: "activity",
    price: 10,
    isFree: false,
    stripeUrls: {
      English: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04",
      Portuguese: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04"
    },
    stripeUrlsDiscounted: {
      English: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04",
      Portuguese: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04"
    }
  },
  {
    id: ServiceType.RELATIONSHIP_SPARK,
    slug: "relationship-spark",
    title: "The Relationship Spark (Compatibility Quick-Check)",
    description: "A 1-minute chemistry snapshot. Discover the primary \"lesson\" or \"vibe\" between you and another person. Express compatibility analysis based on two birth dates.",
    icon: "heart",
    price: 10,
    isFree: false,
    stripeUrls: {
      English: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04",
      Portuguese: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04"
    },
    stripeUrlsDiscounted: {
      English: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04",
      Portuguese: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04"
    }
  },
  {
    id: ServiceType.SPORTS_ORACLE,
    slug: "sports-oracle",
    title: "The Odds Oracle (Sports Prediction)",
    description: "A synthesis of hard sports data, bookmaker odds, and Horary Astrology to identify 'Cosmic Edges'. Discover discrepancies between market expectations and celestial reality.",
    icon: "trophy",
    price: 10,
    isFree: false,
    stripeUrls: {
      English: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04",
      Portuguese: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04",
      Russian: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04",
      Spanish: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04"
    },
    stripeUrlsDiscounted: {
      English: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04",
      Portuguese: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04",
      Russian: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04",
      Spanish: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04"
    }
  },
  {
    id: ServiceType.GOAL_10_DAYS,
    slug: "goal-10-days",
    title: "10-Day Goal Accelerator (Free)",
    description: "A quick energetic roadmap for your immediate goal. Includes psychological focus and cosmic timing for the next 10 days.",
    icon: "target",
    price: 0,
    isFree: true
  },
  {
    id: ServiceType.GOAL_30_DAYS,
    slug: "goal-30-days",
    title: "30-Day Achievement Plan",
    description: "A deep monthly strategy for your goal. Synthesis of astrology, numerology, and achievement psychology to maintain your momentum.",
    icon: "target",
    price: 10,
    isFree: false,
    stripeUrls: {
      English: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04",
      Portuguese: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04"
    }
  }
];

export const SERVICES: Service[] = [
  {
    id: ServiceType.NATAL_CHART,
    slug: "natal-chart",
    title: "The Natal Matrix (Natal Chart Report)",
    description: "Your cosmic blueprint. A deep psychological portrait based on planetary positions at birth. Discover your innate strengths, core weaknesses, and the unique architecture of your personality.",
    seoContent: "A Natal Matrix astrology report provides a comprehensive birth chart analysis, mapping the planetary positions at the exact moment of your arrival. This architectural blueprint of your soul reveals the cosmic signature you carry. By synthesizing celestial mechanics and numerical vibrations, our Natal Matrix deep-dive explores your Sun's core identity, your Moon's emotional architecture, and the rising sign's first impression. Understand your innate strengths and hidden challenges through a professional, 15-page synthesis of destiny.",
    icon: "sparkles",
    price: 30,
    stripeUrls: {
      English: "https://buy.stripe.com/3cI4gA3fTc1e7zycEeeEo05",
      Portuguese: "https://buy.stripe.com/3cI4gA3fTc1e7zycEeeEo05"
    },
    stripeUrlsDiscounted: {
      English: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04", // Replace with 15 EUR link
      Portuguese: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04" // Replace with 15 EUR link
    }
  },
  {
    id: ServiceType.LOVE_SYNASTRY,
    slug: "love-synastry",
    title: "Synastry & Love Compatibility",
    description: "Our most requested guide. Why are you drawn to each other? Explore relationship dynamics, domestic harmony, and sexual chemistry between two souls.",
    seoContent: "Discover the chemistry of two souls with our Love Synastry report. This detailed astrology report analyzes relationship dynamics, domestic harmony, and sexual chemistry. By comparing two birth charts, we reveal how your planets activate each other's sectors, showing where you find support and where you face karmic growth. Whether you are seeking clarity on a new connection or deep insights into a long-term partnership, our synastry report offers an architectural view of your union.",
    icon: "heart",
    price: 30,
    stripeUrls: {
      English: "https://buy.stripe.com/3cI4gA3fTc1e7zycEeeEo05",
      Portuguese: "https://buy.stripe.com/3cI4gA3fTc1e7zycEeeEo05"
    },
    stripeUrlsDiscounted: {
      English: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04",
      Portuguese: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04"
    }
  },
  {
    id: ServiceType.YEARLY_SOLAR,
    slug: "yearly-solar",
    title: "The 12-Month Solar Return (Yearly Forecast)",
    description: "\"Your Year Ahead.\" A comprehensive roadmap for the next 12 months. Identify key dates of fortune, periods of luck, and celestial warnings from birthday to birthday.",
    seoContent: "Navigate your 12-month solar return with our comprehensive yearly forecast. This birth chart analysis for your birthday year maps out the key transits and celestial windows of opportunity. From quarterly breakdowns to monthly focus points, the Solar Return report identifies lucky dates and warns of energetic friction. Align your actions with the universe's timing and make each year your most powerful one yet.",
    icon: "calendar",
    price: 30,
    stripeUrls: {
      English: "https://buy.stripe.com/3cI4gA3fTc1e7zycEeeEo05",
      Portuguese: "https://buy.stripe.com/3cI4gA3fTc1e7zycEeeEo05"
    },
    stripeUrlsDiscounted: {
      English: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04",
      Portuguese: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04"
    }
  },
  {
    id: ServiceType.KARMIC_DESTINY,
    slug: "karmic-destiny",
    title: "Karmic Destiny & Past Lives",
    description: "Identify the lessons you've brought from past incarnations. Understand your Nodes of Fate (North/South Node) and your soul's current mission in this life.",
    seoContent: "Explore your karmic destiny and the residues of past lives with a deep-dive soul report. We analyze your Nodes of Fate—the North and South Nodes—to understand the spiritual mandate you were born with. This astrology report identifies transformative blocks and karmic debts, providing a structured roadmap for your soul's current mission. Discover why you repeat certain patterns and how to finally break through into your highest potential.",
    icon: "history",
    price: 30,
    stripeUrls: {
      English: "https://buy.stripe.com/3cI4gA3fTc1e7zycEeeEo05",
      Portuguese: "https://buy.stripe.com/3cI4gA3fTc1e7zycEeeEo05"
    },
    stripeUrlsDiscounted: {
      English: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04",
      Portuguese: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04"
    }
  },
  {
    id: ServiceType.CAREER_WEALTH,
    slug: "career-wealth",
    title: "Career & Wealth Alignment",
    description: "A niche guide for professionals and seekers. Discover where your abundance lies, which sectors offer the highest returns, and the best timing for career shifts.",
    seoContent: "Align your professional trajectory with our Career & Wealth report. This detailed analysis uses your birth chart to find your sectors of highest return and identifies financial resource leaks. Discover your innate leadership style and the best timing for career shifts or investments. By understanding the vibrations of your 10th and 2nd houses, you can build a legacy that resonates with your architectural frequency.",
    icon: "briefcase",
    price: 30,
    stripeUrls: {
      English: "https://buy.stripe.com/3cI4gA3fTc1e7zycEeeEo05",
      Portuguese: "https://buy.stripe.com/3cI4gA3fTc1e7zycEeeEo05"
    },
    stripeUrlsDiscounted: {
      English: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04",
      Portuguese: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04"
    }
  },
  {
    id: ServiceType.PYTHAGOREAN_CODE,
    slug: "numerology",
    title: "The Pythagorean Code (Numerology)",
    description: "Mathematical precision for the modern mind. Calculation of your Life Path Number and core vibrations hidden within your birth date and name.",
    seoContent: "Decode the mathematical vibration of your life with our Pythagorean Code numerology report. This analysis goes beyond simple horoscopes to reveal the core vibrations hidden in your name and birth date. Calculate your Life Path Number and Expression Number with professional precision. Understand the rhythm of your personal year cycles and align your lifestyle with the structural numbers that define your psychological reality.",
    icon: "hash",
    price: 30,
    stripeUrls: {
      English: "https://buy.stripe.com/3cI4gA3fTc1e7zycEeeEo05",
      Portuguese: "https://buy.stripe.com/3cI4gA3fTc1e7zycEeeEo05"
    },
    stripeUrlsDiscounted: {
      English: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04",
      Portuguese: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04"
    }
  },
  {
    id: ServiceType.HUMAN_DESIGN,
    slug: "human-design",
    title: "Human Design: The Strategy of Life",
    description: "Identify your energetic type (Manifestor, Generator, etc.). Learn how to make decisions without resistance and align with your natural flow.",
    seoContent: "Discover your unique energetic signature with an in-depth Human Design strategy report. Unlike traditional birth chart analysis, Human Design provides a practical manual for decision-making without resistance. Identify your Type—Manifestor, Generator, Projector, or Reflector—and understand your Inner Authority. Learn where you are consistent and where you are conditioned by the world around you, allowing you to live in your natural state of flow.",
    icon: "fingerprint",
    price: 30,
    stripeUrls: {
      English: "https://buy.stripe.com/3cI4gA3fTc1e7zycEeeEo05",
      Portuguese: "https://buy.stripe.com/3cI4gA3fTc1e7zycEeeEo05"
    },
    stripeUrlsDiscounted: {
      English: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04",
      Portuguese: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04"
    }
  },
  {
    id: ServiceType.ASTRO_CARTOGRAPHY,
    slug: "astro-cartography",
    title: "Astro-Cartography (Relocation Map)",
    description: "\"Where is your city of power?\" Find specific coordinates on Earth where you'll encounter love, career breakthroughs, or spiritual peace.",
    seoContent: "Find your city of power with our Astro-Cartography relocation guide. This astrology report maps your planetary lines across the globe to identify specific coordinates for love, career, and spiritual peace. Whether you are planning a temporary move or a permanent relocation, understand how the Earth's geography interacts with your birth chart analysis. Discover where your Sun line shines for success or your Venus line glows for relationship breakthroughs.",
    icon: "globe",
    price: 30,
    stripeUrls: {
      English: "https://buy.stripe.com/3cI4gA3fTc1e7zycEeeEo05",
      Portuguese: "https://buy.stripe.com/3cI4gA3fTc1e7zycEeeEo05"
    },
    stripeUrlsDiscounted: {
      English: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04",
      Portuguese: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04"
    }
  },
  {
    id: ServiceType.SATURN_RETURN,
    slug: "saturn-return",
    title: "Saturn Return Survival Guide",
    description: "Navigate the critical crisis of age 29-30. Learn how to survive this cosmic 'coming of age' and emerge as a mature, victorious version of yourself.",
    seoContent: "Survive and thrive during your 29-30 year crisis with our Saturn Return survival guide. This astrology report provides a foundational birth chart analysis to help you navigate the major life transition of your late twenties. Understand your Saturn natal placement and the specific phases of the return transit. Learn to master lessons in career, relationships, and self-authority to build a rock-solid foundation for the next thirty years of your journey.",
    icon: "zap",
    price: 30,
    stripeUrls: {
      English: "https://buy.stripe.com/3cI4gA3fTc1e7zycEeeEo05",
      Portuguese: "https://buy.stripe.com/3cI4gA3fTc1e7zycEeeEo05"
    },
    stripeUrlsDiscounted: {
      English: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04",
      Portuguese: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04"
    }
  },
  {
    id: ServiceType.DREAM_INTERPRETATION,
    slug: "dream-interpretation",
    title: "The Sage's Dream Decree",
    description: "A comprehensive interpretation of your dream. Discover the psychological roots, symbolic meanings, and how it aligns with your cosmic path.",
    seoContent: "Unlock the secrets of your subconscious with The Sage's Dream Decree. This comprehensive dream interpretation uses archetypal analysis to explore the psychological roots and symbolic meanings behind your night visions. By aligning your dream symbols with your birth chart analysis, we provide a structured path forward. Discover why certain images recur and how your inner wisdom is guiding your architectural destiny through the language of dreams.",
    icon: "moonstar",
    price: 30,
    stripeUrls: {
      English: "https://buy.stripe.com/3cI4gA3fTc1e7zycEeeEo05",
      Portuguese: "https://buy.stripe.com/3cI4gA3fTc1e7zycEeeEo05"
    },
    stripeUrlsDiscounted: {
      English: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04",
      Portuguese: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04"
    }
  },
  {
    id: ServiceType.GOLDEN_SEED,
    slug: "golden-seed",
    title: "The Golden Seed (Child’s Cosmic Blueprint)",
    description: "\"The ultimate manual for conscious parents.\" Understand your child's energy from birth. This report is not about \"fate,\" but about potential: how they learn, how they express emotions, and in which activities they will flourish most brightly. Help the \"golden seed\" sprout without resistance.",
    seoContent: "Understand your child's innate potential with The Golden Seed cosmic blueprint. This specialized birth chart analysis serves as a manual for conscious parents, revealing how your child learns, expresses emotions, and interacts with the world. Instead of predicting a fixed fate, we identify their unique talents and energetic signature. Help your child flourish by aligning your parenting strategy with their architectural design and structural vibrations.",
    icon: "baby",
    price: 30,
    stripeUrls: {
      English: "https://buy.stripe.com/3cI4gA3fTc1e7zycEeeEo05",
      Portuguese: "https://buy.stripe.com/3cI4gA3fTc1e7zycEeeEo05"
    },
    stripeUrlsDiscounted: {
      English: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04",
      Portuguese: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04"
    }
  },
  {
    id: ServiceType.SHADOW_WORK,
    slug: "shadow-work",
    title: "The Shadow Work Ritual (Lilith & Pluto Deep Dive)",
    description: "\"Meet your dark side and turn it into your greatest ally.\" A deep analysis of Lilith, Pluto, and retrograde planets in your chart. Explore your repressed desires, fears, and irrational blocks. This report is for those ready for radical honesty and wanting to reclaim energy locked in the \"Shadow\" aspects of their personality.",
    seoContent: "Embrace radical honesty with our Shadow Work Ritual report. This deep-dive astrology report analyzes Lilith, Pluto, and retrograde planets in your birth chart analysis to identify repressed desires and irrational blocks. Reclaim the energy locked in your shadow aspects and turn your 'dark side' into your greatest ally. For those seeking true transformation, this architectural exploration offers a structured path to psychological integration and inner power.",
    icon: "moon",
    price: 30,
    stripeUrls: {
      English: "https://buy.stripe.com/3cI4gA3fTc1e7zycEeeEo05",
      Portuguese: "https://buy.stripe.com/3cI4gA3fTc1e7zycEeeEo05"
    },
    stripeUrlsDiscounted: {
      English: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04",
      Portuguese: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04"
    }
  },
  {
    id: ServiceType.GOAL_100_DAYS,
    slug: "goal-accelerator",
    title: "100-Day Master Decree",
    description: "The ultimate long-term roadmap for major life goals. A 100-day plan of energies, favorable moments, and psychological concentration techniques.",
    seoContent: "Achieve your most ambitious goals with the 100-Day Master Decree. This strategic roadmap integrates birth chart analysis, numerological vibrations, and the psychology of achievement. Receive a phase-by-phase plan of energies that identifies your 'Power Windows' for action and 'Silence Windows' for planning. Whether you are launching a business or seeking personal transformation, this 100-day accelerator provides the structural alignment needed for success.",
    icon: "target",
    price: 30,
    stripeUrls: {
      English: "https://buy.stripe.com/aFa6oI4jX2qE3jibAaeEo06",
      Portuguese: "https://buy.stripe.com/aFa6oI4jX2qE3jibAaeEo06",
      Russian: "https://buy.stripe.com/aFa6oI4jX2qE3jibAaeEo06",
      Spanish: "https://buy.stripe.com/aFa6oI4jX2qE3jibAaeEo06",
      French: "https://buy.stripe.com/aFa6oI4jX2qE3jibAaeEo06",
      German: "https://buy.stripe.com/aFa6oI4jX2qE3jibAaeEo06",
      Italian: "https://buy.stripe.com/aFa6oI4jX2qE3jibAaeEo06"
    }
  },
  {
    id: ServiceType.HOROSCOPE_TOMORROW,
    slug: "daily-horoscope",
    title: "Personal Daily Horoscope",
    description: "Your celestial forecast for today and tomorrow. Discover the current planetary transits affecting your zodiac sign.",
    seoContent: "Unlock your personal daily horoscope for today and tomorrow. Our detailed celestial forecast analyzes the structural vibrations of the current planetary transits and how they interact with each of the twelve zodiac signs. Whether you are a fiery Aries or a grounded Capricorn, understand the energetic weather for the next 48 hours. Use this birth chart analysis tool to align your daily actions with the cosmic cycles of growth, challenge, and opportunity.",
    icon: "sparkles",
    price: 0,
    isFree: true
  },
  {
    id: ServiceType.ASTRO_WEATHER,
    slug: "astro-weather",
    title: "Astrological Weather Forecast",
    description: "A professional synthesis of real-time meteorological data and celestial mechanics. Plan your days with cosmic and atmospheric precision.",
    seoContent: "Get your personalized astrological weather forecast. Our AI Oracle combines real-time weather data with professional astrology, analyzing how atmospheric conditions and planetary transits affect your zodiac sign. Plan for today, tomorrow, or up to 10 days ahead with a deep, 4-page synthesis of destiny and nature.",
    icon: "cloud-sun",
    price: 0,
    isFree: true
  }
];

export const ZODIAC_SIGNS = [
  { id: 'aries', name: { English: 'Aries', Portuguese: 'Áries' }, symbol: '♈', dates: 'Mar 21 - Apr 19' },
  { id: 'taurus', name: { English: 'Taurus', Portuguese: 'Touro' }, symbol: '♉', dates: 'Apr 20 - May 20' },
  { id: 'gemini', name: { English: 'Gemini', Portuguese: 'Gêmeos' }, symbol: '♊', dates: 'May 21 - Jun 20' },
  { id: 'cancer', name: { English: 'Cancer', Portuguese: 'Câncer' }, symbol: '♋', dates: 'Jun 21 - Jul 22' },
  { id: 'leo', name: { English: 'Leo', Portuguese: 'Leão' }, symbol: '♌', dates: 'Jul 23 - Aug 22' },
  { id: 'virgo', name: { English: 'Virgo', Portuguese: 'Virgem' }, symbol: '♍', dates: 'Aug 23 - Sep 22' },
  { id: 'libra', name: { English: 'Libra', Portuguese: 'Libra' }, symbol: '♎', dates: 'Sep 23 - Oct 22' },
  { id: 'scorpio', name: { English: 'Scorpio', Portuguese: 'Escorpião' }, symbol: '♏', dates: 'Oct 23 - Nov 21' },
  { id: 'sagittarius', name: { English: 'Sagittarius', Portuguese: 'Sagitário' }, symbol: '♐', dates: 'Nov 22 - Dec 21' },
  { id: 'capricorn', name: { English: 'Capricorn', Portuguese: 'Capricórnio' }, symbol: '♑', dates: 'Dec 22 - Jan 19' },
  { id: 'aquarius', name: { English: 'Aquarius', Portuguese: 'Aquário' }, symbol: '♒', dates: 'Jan 20 - Feb 18' },
  { id: 'pisces', name: { English: 'Pisces', Portuguese: 'Peixes' }, symbol: '♓', dates: 'Feb 19 - Mar 20' }
];

export const getServiceIcon = (iconName: string) => {
  const props = { className: "w-8 h-8" };
  switch (iconName) {
    case 'sparkles': return <Sparkles {...props} className="text-yellow-400" />;
    case 'heart': return <Heart {...props} className="text-red-400" />;
    case 'briefcase': return <Briefcase {...props} className="text-blue-400" />;
    case 'calendar': return <Calendar {...props} className="text-green-400" />;
    case 'hash': return <Hash {...props} className="text-purple-400" />;
    case 'globe': return <Globe {...props} className="text-indigo-400" />;
    case 'history': return <History {...props} className="text-amber-600" />;
    case 'activity': return <Activity {...props} className="text-emerald-400" />;
    case 'moonstar': return <MoonStar {...props} className="text-sky-300" />;
    case 'zap': return <Zap {...props} className="text-orange-400" />;
    case 'star': return <Star {...props} className="text-cosmic-gold" />;
    case 'gift': return <Gift {...props} className="text-cosmic-gold" />;
    case 'fingerprint': return <Fingerprint {...props} className="text-cosmic-purple" />;
    case 'trending': return <TrendingUp {...props} className="text-cosmic-gold" />;
    case 'coins': return <Coins {...props} className="text-cosmic-gold" />;
    case 'battery': return <Battery {...props} className="text-cosmic-gold" />;
    case 'baby': return <Baby {...props} className="text-cosmic-gold" />;
    case 'moon': return <Moon {...props} className="text-cosmic-purple" />;
    case 'trophy': return <Trophy {...props} className="text-cosmic-gold" />;
    case 'target': return <Target {...props} className="text-red-500" />;
    case 'cloud-sun': return <CloudSun {...props} className="text-sky-400" />;
    default: return <Sparkles {...props} />;
  }
};

const BASE_RULES = (lang: string) => {
  const langRules: Record<string, string> = {
    'English': 'REPLY ONLY IN AMERICAN ENGLISH (EN-US).',
    'Portuguese': 'REPLY ONLY IN BRAZILIAN PORTUGUESE (PT-BR).',
    'Spanish': 'REPLY ONLY IN SPANISH (ES).',
    'Russian': 'REPLY ONLY IN RUSSIAN (RU).',
    'French': 'REPLY ONLY IN FRENCH (FR).',
    'German': 'REPLY ONLY IN GERMAN (DE).',
    'Italian': 'REPLY ONLY IN ITALIAN (IT).'
  };
  
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  }).toUpperCase();

  return `
    ${langRules[lang] || `Reply strictly in ${lang}.`}
    IDENTITY: ATLANTIC ORACLE. Authority in Astrology, Numerology, and Human Design.
    CURRENT DATE: ${dateStr}.
    FORMAT: No stars (*). Use headers # and ##.
    STRICTION: DO NOT use Markdown tables. Use plain text or sequential lists.
    STRICTION: NEVER generate URLs, links, or calls to action with fake links.
  `;
};

const PROMPT_CORE = (lang: string) => `
  ${BASE_RULES(lang)}
  DEPTH: Professional, analytical.
  LENGTH: As specified in the service task below.
  STRUCTURE: Use a structured approach with clear chapters or sections where appropriate.
  ENVIRONMENTAL INFLUENCE: Include a few interesting sentences about the subject's birth place (city/country/region). Explain how the specific environment and culture of their origin have helped shape their unique personality and energetic signature.
`;

export const COSMIC_PROMPTS = {
  [ServiceType.NATAL_CHART]: (name: string, date: string, time: string, place: string, lang: string) => `
    ${PROMPT_CORE(lang)}
    Service: Natal Chart Report (Cosmic Blueprint). Subject: ${name}, born ${date} at ${time} in ${place}.
    Generate an extremely deep, professional psychological and astrological portrait. 
    This is a premium 15-page report. Structure it into detailed chapters:
    1. The Ascendant & First Impression.
    2. The Sun: Core Identity & Purpose.
    3. The Moon: Emotional Architecture & Subconscious.
    4. Planetary Clusters & Major Aspects.
    5. Internal Architecture: Strengths, Challenges, and Shadow Aspects.
    6. Life Path & Evolutionary Mandate.
    Provide professional, nuanced analysis for each section.
  `,
  [ServiceType.LOVE_SYNASTRY]: (n1: string, d1: string, t1: string, n2: string, d2: string, t2: string, lang: string) => `
    ${PROMPT_CORE(lang)}
    Service: Synastry & Love Compatibility (Relationship Analysis). Partners: ${n1} (${d1} ${t1}) and ${n2} (${d2} ${t2}).
    Generate a comprehensive, professional 15-page relationship analysis.
    Analyze the complex energetic pull between them using multi-layered astrological techniques:
    1. Individual Relationship Needs (Venus/Mars/7th House).
    2. Synastry Overlays: How planets activate each other's houses.
    3. Major Aspects: Harmony vs. Friction.
    4. Composite Energy: The 'Third Entity' of the relationship.
    5. Long-term Compatibility: Domestic life, emotional support, and intimacy.
    6. Karmic Lessons & Growth Potential.
  `,
  [ServiceType.YEARLY_SOLAR]: (name: string, date: string, time: string, place: string, lang: string) => `
    ${PROMPT_CORE(lang)}
    Service: 12-Month Solar Return (Yearly Forecast). Subject: ${name}, born ${date} at ${time} in ${place}.
    Generate a professional, highly detailed 15-page yearly forecast.
    Map out the year ahead with precision:
    1. The Solar Return Chart: The theme of the year.
    2. Quarterly Breakdowns: Detailed analysis of each 3-month period.
    3. Major Transits: Lucky windows, critical action points, and warnings.
    4. Monthly Focus: Specific celestial guidance for each month.
    5. Key Life Areas: Career, Love, Health, and Personal Growth.
  `,
  [ServiceType.KARMIC_DESTINY]: (name: string, date: string, time: string, place: string, lang: string) => `
    ${PROMPT_CORE(lang)}
    Service: Karmic Destiny & Past Lives. Subject: ${name}, born ${date} at ${time} in ${place}.
    Generate a profound, professional 15-page karmic analysis.
    Explore the soul's journey:
    1. The South Node: Past life residues and comfort zones.
    2. The North Node: The current life's spiritual mandate and growth direction.
    3. Saturn & Pluto: Karmic debts and transformative blocks.
    4. Retrograde Planets: Internalized lessons from the past.
    5. The Evolutionary Path: How to align with the soul's purpose.
  `,
  [ServiceType.CAREER_WEALTH]: (name: string, date: string, time: string, place: string, lang: string) => `
    ${PROMPT_CORE(lang)}
    Service: Career & Wealth Alignment. Subject: ${name}, born ${date} at ${time} in ${place}.
    Generate a professional, strategic 15-page financial and career guide.
    Focus on abundance and professional trajectory:
    1. The 2nd House: Personal resources and value systems.
    2. The 6th House: Daily work, service, and environment.
    3. The 10th House: Public status, career, and legacy.
    4. Midheaven (MC): The professional peak and sectors of highest return.
    5. Financial Timing: Best windows for shifts, investments, and expansion.
    6. Overcoming Hurdles: Identifying and clearing wealth blocks.
  `,
  [ServiceType.PYTHAGOREAN_CODE]: (name: string, date: string, lang: string) => `
    ${PROMPT_CORE(lang)}
    Service: The Pythagorean Code (Numerology). Subject: ${name}, born ${date}.
    Generate a mathematically precise, professional 15-page numerological report.
    1. The Life Path Number: The destined trajectory.
    2. Expression & Soul Urge Numbers: Hidden desires and talents.
    3. Birthday Number: Specific tools for the journey.
    4. Personal Year Cycle: Current vibrations and timing.
    5. The Core Matrix: How numbers interact to form the personality.
  `,
  [ServiceType.HUMAN_DESIGN]: (name: string, date: string, time: string, place: string, lang: string) => `
    ${PROMPT_CORE(lang)}
    Service: Human Design Strategy. Subject: ${name}, born ${date} at ${time} in ${place}.
    Generate an in-depth, professional 15-page Human Design manual.
    1. Type & Strategy: How to move through the world without resistance.
    2. Inner Authority: The correct way to make decisions.
    3. Profile: The costume of your purpose.
    4. Defined vs. Undefined Centers: Where you are consistent vs. where you are conditioned.
    5. Channels & Gates: Specific energetic strengths.
    6. Living Your Design: Practical integration for daily life.
  `,
  [ServiceType.ASTRO_CARTOGRAPHY]: (name: string, date: string, time: string, place: string, lang: string) => `
    ${PROMPT_CORE(lang)}
    Service: Astro-Cartography (Power Locations). Subject: ${name}, born ${date} at ${time} in ${place}.
    Generate a professional, comprehensive 15-page global relocation guide.
    1. Planetary Lines: Detailed analysis of Sun, Moon, Venus, Jupiter, and Mars lines.
    2. City of Power: Identifying coordinates for career breakthroughs.
    3. Love & Sanctuary: Best locations for relationships and peace.
    4. Local Space Astrology: How specific directions impact the subject.
    5. Timing for Travel/Relocation: When to move for maximum benefit.
  `,
  [ServiceType.SATURN_RETURN]: (name: string, date: string, time: string, place: string, lang: string) => `
    ${PROMPT_CORE(lang)}
    Service: Saturn Return Survival Guide (Age 29-30 Crisis). Subject: ${name}, born ${date} at ${time} in ${place}.
    Generate a professional, transformative 15-page guide for this critical life stage.
    1. Saturn's Natal Placement: The foundation of your responsibility.
    2. The 29.5-Year Cycle: Understanding the 'Cosmic Coming of Age'.
    3. The Return Transit: Specific phases and challenges of the return.
    4. Mastering Lessons: Career, relationships, and self-authority.
    5. Emerging Victorious: How to build a solid foundation for the next 30 years.
  `,
  // FREE SERVICES PROMPTS
  [ServiceType.FORTUNE_MAP]: (name: string, date: string, lang: string) => `
    ${PROMPT_CORE(lang)}
    SERVICE: THE FORTUNE MAP. Subject: ${name}, born ${date}.
    Generate a professional, highly detailed 4-page weekly forecast.
    1. Weekly Chart: List 7 days sequentially. Format: "Day 1 - [Details], Day 2 - [Details]...". Include Luck Index (1-10), Power Window, and Risk Level for each day. DO NOT USE TABLES.
    2. Numerology: Calculate 3 'Golden Numbers' for the subject this week.
    3. Strategic Advice: Define the emotional state in which they MUST NOT make risky decisions.
    4. Detailed Daily Breakdown: Provide a paragraph of analysis for each day of the week to ensure the report reaches at least 4 pages of depth.
  `,
  [ServiceType.CAPITAL_ALIGNMENT]: (name: string, date: string, lang: string) => `
    ${PROMPT_CORE(lang)}
    SERVICE: CAPITAL ALIGNMENT. Subject: ${name}, born ${date}.
    Generate a professional, comprehensive 4-page financial energy analysis.
    1. Capital Analysis: Define leading income energy (structure, charisma, or intuition).
    2. Loss Zone: Where are they leaking resources internally?
    3. Investment in SELF: Professional advice on why knowing their mechanics provides the highest ROI.
    4. Weekly Plan: List 3 specific financial actions sequentially (Action 1, Action 2, Action 3). DO NOT USE TABLES.
    5. Deep Financial Strategy: Expand on each point with professional depth to ensure a 4-page comprehensive report.
  `,
  [ServiceType.ENERGY_PULSE]: (name: string, date: string, lang: string) => `
    ${PROMPT_CORE(lang)}
    SERVICE: THE ENERGY PULSE. Subject: ${name}, born ${date}.
    Generate a professional, detailed 4-page energetic rhythm guide.
    1. Force Dynamics: List weekly energy peak and silence days sequentially. DO NOT USE TABLES.
    2. Bio-rhythms: Professional sleep/activity advice based on birth date.
    3. Reset Technique: One 1-minute mental reset practice (breathing/visualization).
    4. Focus Mode: Strategic direction for energy (Health, Relations, Career).
    5. Extended Energetic Analysis: Provide deep insights into the subject's biological rhythms to ensure the report reaches at least 4 pages.
  `,
  [ServiceType.FREE_DREAM_INTERPRETATION]: (name: string, bDate: string, bTime: string, bPlace: string, description: string, keywords: string, dDate: string, dTime: string, lang: string) => `
    ${PROMPT_CORE(lang)}
    SERVICE: THE DREAM WHISPER. Subject: ${name}. 
    DREAM DATE/TIME: ${dDate} ${dTime}.
    DREAM DESCRIPTION: ${description}
    KEYWORDS: ${keywords}
    
    TASK: Provide a professional, deep psychological interpretation (~4 pages). 
    STYLE: Professional, analytical yet empathetic, soft advice from a "wise sage". 
    Focus on clarity and a strategic path forward. Expand on the symbols and archetypes to provide a comprehensive 4-page decree.
  `,
  [ServiceType.DREAM_INTERPRETATION]: (name: string, bDate: string, bTime: string, bPlace: string, description: string, keywords: string, dDate: string, dTime: string, lang: string) => `
    ${PROMPT_CORE(lang)}
    SERVICE: THE SAGE'S DREAM DECREE. Subject: ${name}, born ${bDate} at ${bTime} in ${bPlace}.
    DREAM DATE/TIME: ${dDate} ${dTime}.
    DREAM DESCRIPTION: ${description}
    KEYWORDS: ${keywords}
    
    TASK: Provide a professional, comprehensive 15-page dream analysis.
    1. Symbolic & Archetypal Analysis: Deep psychological dive.
    2. The "Why": Detailed logic behind symbols based on collective unconscious.
    3. Cosmic Alignment: How this dream interacts with the subject's natal chart and current transits.
    4. The Sage's Path: Professional advice and a gentle, wise path forward.
    
    STYLE: Simple, understandable language of a "wise sage". Trusting and positive.
  `,
  [ServiceType.DAILY_VIBRATION]: (name: string, date: string, time: string, place: string, lang: string) => `
    ${PROMPT_CORE(lang)}
    SERVICE: THE DAILY VIBRATION (Transit Key). Subject: ${name}, born ${date} at ${time} in ${place}.
    Generate a personal "Frequency of the Day" and a specific action-mantra to align with today’s transits. 
    Provide a short calculation of how today's planetary positions resonate personally with the subject's chart. 
    Include one key recommendation: what to initiate today and what to refrain from, plus a personal affirmation.
    LENGTH: ~4 pages of deep insight.
  `,
  [ServiceType.RELATIONSHIP_SPARK]: (n1: string, d1: string, t1: string, n2: string, d2: string, t2: string, lang: string) => `
    ${PROMPT_CORE(lang)}
    SERVICE: THE RELATIONSHIP SPARK (Compatibility Quick-Check). Partners: ${n1} (${d1} ${t1}) and ${n2} (${d2} ${t2}).
    Generate a 1-minute chemistry snapshot. Discover the primary "lesson" or "vibe" between the partners. 
    Express compatibility analysis based on two birth dates. 
    Define the connection type: "Karmic Teacher", "Mirror", "Energy Donor", or "Creative Union".
    LENGTH: ~4 pages of deep insight.
  `,
  [ServiceType.GOLDEN_SEED]: (name: string, date: string, time: string, place: string, lang: string) => `
    ${PROMPT_CORE(lang)}
    Service: The Golden Seed (Child’s Cosmic Blueprint). Subject: ${name}, born ${date} at ${time} in ${place}.
    Generate a professional, highly detailed 15-page child's cosmic manual.
    1. Energetic Potential: The core essence of the child.
    2. Learning & Cognitive Style: How they process information.
    3. Emotional Expression: Understanding their internal world.
    4. Talents & Flourishing: Activities that align with their nature.
    5. Conscious Parenting: Practical advice for supporting their unique path.
  `,
  [ServiceType.SHADOW_WORK]: (name: string, date: string, time: string, place: string, lang: string) => `
    ${PROMPT_CORE(lang)}
    Service: The Shadow Work Ritual (Lilith & Pluto Deep Dive). Subject: ${name}, born ${date} at ${time} in ${place}.
    Generate a profound, professional 15-page shadow analysis.
    1. Lilith & Pluto: The primary shadow archetypes in the chart.
    2. Retrograde Planets: Internalized karmic blocks.
    3. Repressed Desires & Fears: Identifying the hidden self.
    4. The Reclaiming Ritual: A professional therapeutic/ritualistic approach to integration.
    5. Transformative Integration: Turning shadow into power.
    5. Transformative Integration: Turning shadow into power.
  `,
  [ServiceType.HOROSCOPE_TOMORROW]: (sign: string, lang: ReportLanguage, day: 'today' | 'tomorrow' = 'tomorrow') => {
    const targetDate = new Date();
    if (day === 'tomorrow') targetDate.setDate(targetDate.getDate() + 1);
    const dateStr = targetDate.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    }).toUpperCase();

    return `
      ${BASE_RULES(lang)}
      SERVICE: PERSONAL HOROSCOPE FOR ${day.toUpperCase()}. 
      ZODIAC SIGN: ${sign}.
      TARGET DATE: ${dateStr}.
      
      TASK: Provide a structured, advising astrological forecast for ${sign} for ${day}.
      STYLE: Simple, clear, friendly, and encouraging.
      FORMAT: Markdown. No stars (*). 
      STRUCTURE:
      Use exactly these categories with emojis:
      ## ${translations[lang].h_career}
      [Bullet points about career/money]
      
      ## ${translations[lang].h_love}
      [Bullet points about relationships/social]
      
      ## ${translations[lang].h_health}
      [Bullet points about well-being]
      
      ## ${translations[lang].h_advice}
      [A conclusion or a focus mantra for the day]
      
      STRICTION: DO NOT use hashtags like #Aries. Start directly with the first category.
      STRICTION: Keep it concise but insightful.
      STRICTION: DO NOT mention birth place, birth time, or any personal details. This is a general forecast.
    `;
  },
  // MASTER PROMPT: This prompt is synchronized with GEMINI.md. 
  // DO NOT MODIFY without checking the master reference.
  [ServiceType.SPORTS_ORACLE]: (side1: string, side2: string, venue: string, date: string, lang: string) => `
    ${BASE_RULES(lang)}
    ROLE: You are the "Odds Oracle" for AtlanticOracle.com. Your mission is to synthesize hard sports data, bookmaker odds, and Horary Astrology to identify "Cosmic Edges" (discrepancies between market expectations and celestial reality).

    INPUT:
    - Side 1 (Home/First Athlete): ${side1}
    - Side 2 (Away/Second Athlete): ${side2}
    - Venue: ${venue}
    - Date: ${date}

    YOUR TASK:
    1. USE GOOGLE SEARCH to find the latest information about this event:
       - Current bookmaker odds (Market Sentiment).
       - Team/Athlete form, injuries, and recent context.
       - Any other relevant "Earthly" data.
    
    2. CELESTIAL ANALYSIS:
       - Calculate the Horary Chart for the event's date and venue.
       - Assign the 1st House (Ascendant) and its ruler to Side 1.
       - Assign the 7th House (Descendant) and its ruler to Side 2.
       - Evaluate the dignity of their Rulers.
       - Check the Moon's aspects.

    3. THE SYNTHESIS:
       - Compare the "Earthly" Market Sentiment with the "Heavenly" Celestial Integrity.
       - Identify the "Cosmic Edge" or discrepancies.

    TONE & STYLE:
    - Maintain the Atlantic Oracle brand voice: Sophisticated, analytical, mysterious, yet grounded.
    - ADD A TOUCH OF LIGHT HUMOR (e.g., about the stars' opinion on a player's haircut or the referee's cosmic alignment).
    - Be detailed and accurate. We answer the question, the user doesn't have to provide everything.
    - Use Markdown. Use "Vibe Index" (0-100%) for confidence.

    IMPORTANT: Justify your prediction based on the synthesis of data and stars.
    
    CONSTRAINT: Never give direct betting advice. Use phrases like "The cosmic energy favors..." or "There is a significant tension in the favorite's sector." 
    
    MANDATORY DISCLAIMER: At the very end, add a clear section about non-responsibility for the result. State that this is an entertainment service and users are responsible for their own decisions.
  `,
  [ServiceType.ASTRO_WEATHER]: (city: string, sign: string, duration: string, lang: string) => `
    ${BASE_RULES(lang)}
    ROLE: You are the "Celestial Meteorologist" for AtlanticOracle.com. Your mission is to synthesize real-time weather data and professional astrology to provide a unique "Astro-Weather" forecast.

    INPUT:
    - City: ${city}
    - Zodiac Sign: ${sign}
    - Duration: ${duration}

    YOUR TASK:
    1. USE GOOGLE SEARCH to find the real-time weather forecast for ${city} for the next ${duration}.
       - Temperature, conditions (sky, rain, wind), and any notable atmospheric shifts.
    2. CELESTIAL ANALYSIS:
       - Identify the current planetary transits (Sun, Moon, Mercury, etc.) for this period.
       - Analyze how these transits specifically affect someone born under the sign of ${sign}.
    3. THE SYNTHESIS:
       - Combine the meteorological and astrological data into a detailed report (~4 A4 pages).
       - Explain how the "external" weather (nature) resonates with the "internal" weather (destiny).

    STRUCTURE:
    - THE COSMIC SKY: An evocative overview of the coming days.
    - DAY-BY-DAY JOURNEY: A detailed breakdown (for ${duration}) linking specific weather events to astrological opportunities.
    - POWER WINDOWS: Identify moments of high energy or periods for rest based on both storm/sun and planetary aspects.
    - WHISPER FOR THE SOUL: A concluding poetic and practical advice.

    TONE & STYLE:
    - Sophisticated, analytical, mysterious, yet grounded.
    - Detailed, accurate, and poetic.
    - Use Markdown.
  `,
  GOAL_ACHIEVEMENT: (name: string, date: string, time: string, place: string, goal: string, days: number, lang: string) => `
    ${PROMPT_CORE(lang)}
    SERVICE: GOAL ACHIEVEMENT ACCELERATOR (${days} DAYS).
    SUBJECT: ${name}, born ${date} at ${time} in ${place}.
    THE GOAL: "${goal}"

    TASK: Generate a professional, highly strategic ${days === 100 ? '15-page' : '4-page'} achievement roadmap.
    
    METHODOLOGY:
    1. ASTROLOGY: Analyze current and upcoming transits (Mars for drive, Saturn for discipline, Jupiter for expansion) relative to the subject's chart for the next ${days} days.
    2. NUMEROLOGY: Calculate the vibrational compatibility of the goal with the subject's Life Path and current Personal Year.
    3. PSYCHOLOGY OF ACHIEVEMENT: Integrate "Achiever Mode" principles—concentration techniques, momentum maintenance, and overcoming resistance.

    STRUCTURE:
    - THE VISION: A sage's perspective on the goal's energetic alignment.
    - ENERGETIC CALENDAR: A day-by-day (for 10 days) or phase-by-phase (for 30/100 days) plan of energies and favorable moments. Identify "Power Windows" for action and "Silence Windows" for planning.
    - CONCENTRATION DECREE: Specific psychological techniques to maintain focus on this specific goal.
    - MOMENTUM STRATEGY: How to maintain pace and what to do when energy dips.
    - THE STARTING SPARK: Practical advice on how to take the first step TODAY.
    - FINAL SAGE ADVICE: How to set goals that resonate with the soul.

    TONE: Wise, encouraging, strategic, and direct. Focus on "Plan of Energies" rather than just a to-do list.
  `,
  GIFT_MONTHLY_HOROSCOPE: (name: string, date: string, lang: string) => `
    ${PROMPT_CORE(lang)}
    SPECIAL GIFT: Personal Monthly Forecast. Subject: ${name}, born ${date}.
    Provide a detailed 30-day forecast. Highlight major transits, weekly focus points, and high-vibration spiritual advice.
  `,
  AI_ASSISTANT: (lang: string) => `
    ${BASE_RULES(lang)}
    ROLE: You are the "Cosmic Guide" of AtlanticOracle.com. 
    Your mission is to guide seekers to the correct service and answer general questions with expert precision.

    TONE: 
    - EXTREMELY LACONIC. One or two sentences maximum.
    - No "water", no long greetings, no filler.
    - Expert, wise, and direct.

    KNOWLEDGE BASE:
    - NATAL MATRIX: Deep self-discovery and psychological portrait. Synthesis of planetary positions at birth and Pythagorean numerology. 3-5 page report (800-1500 words).
    - LOVE SYNASTRY: Relationship dynamics and chemistry between two people. Analyzes compatibility, lessons, and the "vibe" of the connection.
    - SOLAR RETURN: Yearly forecast and roadmap for the next 12 months. Calculated based on the Sun's return to its birth position.
    - KARMIC DESTINY: Exploration of past lives, soul mission, and karmic lessons.
    - CAREER & WEALTH: Financial alignment, professional trajectory, and finding one's "vocation."
    - PYTHAGOREAN CODE: Mathematical precision in numerology, decoding the structural vibration of name and birth date.
    - HUMAN DESIGN: Energetic strategy and decision-making based on the Human Design system (Type, Authority, Profile).
    - ASTRO-CARTOGRAPHY: Finding "Power Cities" and relocation analysis to see how different locations affect your energy.
    - SATURN RETURN: Navigating the major life transition and crisis that occurs around age 28-30.
    - DREAM DECREE: Deep symbolic interpretation of dreams using celestial and numerical archetypes.
    - GOLDEN SEED: Understanding a child's unique energy, talents, and developmental needs.
    - SHADOW WORK: Deep dive into the "darker" or repressed aspects of the psyche (Lilith, Pluto, 8th House).
    - LIGHT DROPS (10 EUR): Quick, concentrated AI insights for instant clarity. Includes:
        - Daily Vibration: Personal "Frequency of the Day" and action-mantra.
        - Relationship Spark: 1-minute chemistry snapshot (Karmic Teacher, Mirror, etc.).
        - Energy Pulse: Current energetic state.
        - Fortune Map: Quick luck/opportunity check.
    - DECREES (30 EUR): Professional, comprehensive 15-page deep-dive reports.
    - FREE SERVICES:
        - Daily Horoscope: Available in the "Cosmic News" section. General forecasts for all signs.
        - Promo Discount: Users can unlock a 25% discount (code SPACE) by sharing the site via the "Unlock Discount" section on the home page.

    STRATEGY:
    - Understand the user's intent from the context of their question and map it to the most relevant service.
    - If a user asks for a reading (e.g., "Yearly horoscope"), immediately point them to the specific ritual (e.g., "For a yearly roadmap, use the SOLAR RETURN ritual in the Decrees section.").
    - If a user asks for free services, point them to the Daily Horoscope in Cosmic News or the Promo Discount section.
    - Maintain continuity. If the user asks a follow-up question, use the CHAT HISTORY to provide a contextually aware response.
    - Use the promo code "SPACE" (25% off) only if they seem to need a final nudge.
    - If a question is off-topic, politely decline: "My wisdom is reserved for the stars and numbers of this portal."
    - Use Google Search if you need current celestial data or general knowledge to support your expert status.

    CONSTRAINTS:
    - NO personal readings in chat.
    - NO long explanations. Be a sage of few words.
  `
};
