import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Initialize Google Gemini AI SDK
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize Gemini AI client:', err);
  }
}

// In-Memory Data Store (Users, Sessions, Recommendation History)
interface StoredUser {
  username: string;
  email: string;
  passwordHash: string;
  fullName?: string;
}

interface StoredSession {
  username: string;
  token: string;
  loginTime: string;
  lastActivity: string;
  userData: Record<string, any>;
}

interface StoredRecommendation {
  id: string;
  username: string;
  timestamp: string;
  type: 'home' | 'party' | 'jewelry';
  input_summary: Record<string, any>;
  result_summary: {
    total_budget: number;
    remaining_budget: number;
    item_count: number;
    highlight: string;
  };
  full_result: any;
}

const usersDb: Record<string, StoredUser> = {
  sai: {
    username: 'sai',
    email: 'sai@example.com',
    passwordHash: 'password123',
    fullName: 'Sai Krishna',
  },
};

const activeSessions: Record<string, StoredSession> = {
  sai: {
    username: 'sai',
    token: 'token-sai-demo-session',
    loginTime: new Date(Date.now() - 3600000).toISOString(),
    lastActivity: new Date().toISOString(),
    userData: {
      last_home_budget: { budget: 5000, rooms: ['Living Room', 'Kitchen'] },
    },
  },
};

const userRecommendations: Record<string, StoredRecommendation[]> = {
  sai: [
    {
      id: 'rec-init-01',
      username: 'sai',
      timestamp: '2026-05-22T12:02:00Z',
      type: 'home',
      input_summary: {
        total_budget: 5000,
        rooms: ['Living Room', 'Kitchen'],
        lights: 5,
        fans: 4,
        furniture: 2,
        dining_tables: 1,
      },
      result_summary: {
        total_budget: 5000,
        remaining_budget: 500,
        item_count: 5,
        highlight: 'Living Room & Kitchen lighting & furniture bundle',
      },
      full_result: {
        total_budget: 5000,
        remaining_budget: 500,
        currency: 'INR',
        budget_breakdown: [
          {
            category: 'Lighting',
            allocation: 1500,
            items: [
              {
                name: 'LED Bulb (Warm White)',
                description: 'Energy-efficient LED bulbs for general lighting',
                estimated_price: 100,
                quantity: 5,
                search_terms: 'warm white led bulb pack 9w',
                shopping_links: {
                  amazon: 'https://www.amazon.in/s?k=warm+white+led+bulb+pack+9w',
                  flipkart: 'https://www.flipkart.com/search?q=warm+white+led+bulb+pack+9w',
                  ikea: 'https://www.ikea.com/in/en/search/?q=led+bulb+warm+white',
                  myntra: 'https://www.myntra.com/search?q=lamp+lighting',
                  ajio: 'https://www.ajio.com/search/?text=decorative+lights',
                },
              },
            ],
          },
          {
            category: 'Ceiling Fans',
            allocation: 2000,
            items: [
              {
                name: 'Havells Ceiling Fan',
                description: 'Basic, functional ceiling fan with 1200mm sweep',
                estimated_price: 500,
                quantity: 4,
                search_terms: 'havells 1200mm ceiling fan',
                shopping_links: {
                  amazon: 'https://www.amazon.in/s?k=havells+1200mm+ceiling+fan',
                  flipkart: 'https://www.flipkart.com/search?q=havells+1200mm+ceiling+fan',
                  ikea: 'https://www.ikea.com/in/en/search/?q=ceiling+fan',
                  myntra: 'https://www.myntra.com/search?q=ceiling+fan',
                  ajio: 'https://www.ajio.com/search/?text=fan',
                },
              },
            ],
          },
          {
            category: 'Furniture',
            allocation: 1000,
            items: [
              {
                name: 'Plastic Ergonomic Chair',
                description: 'Stackable comfortable chairs for kitchen or living room',
                estimated_price: 250,
                quantity: 2,
                search_terms: 'stackable plastic chair',
                shopping_links: {
                  amazon: 'https://www.amazon.in/s?k=stackable+plastic+chair',
                  flipkart: 'https://www.flipkart.com/search?q=stackable+plastic+chair',
                  ikea: 'https://www.ikea.com/in/en/search/?q=plastic+chair',
                  myntra: 'https://www.myntra.com/search?q=furniture+chair',
                  ajio: 'https://www.ajio.com/search/?text=chair',
                },
              },
              {
                name: 'Small Wooden Dining Table',
                description: 'Simple wooden table for dining or side table',
                estimated_price: 500,
                quantity: 1,
                search_terms: 'small wooden dining table compact',
                shopping_links: {
                  amazon: 'https://www.amazon.in/s?k=small+wooden+dining+table+compact',
                  flipkart: 'https://www.flipkart.com/search?q=small+wooden+dining+table+compact',
                  ikea: 'https://www.ikea.com/in/en/search/?q=wooden+table',
                  myntra: 'https://www.myntra.com/search?q=wooden+table',
                  ajio: 'https://www.ajio.com/search/?text=table',
                },
              },
            ],
          },
        ],
        calculation_table: [
          { category: 'Lighting', items_count: 5, total_cost: 500, percentage_of_budget: 10 },
          { category: 'Ceiling Fans', items_count: 4, total_cost: 2000, percentage_of_budget: 40 },
          { category: 'Furniture', items_count: 3, total_cost: 1000, percentage_of_budget: 20 },
        ],
        additional_suggestions: [
          'Consider purchasing multi-pack LED bulbs for additional bulk savings.',
          'Look for seasonal sales and festive discounts on online marketplaces.',
          'Prioritize essential room fixtures first and postpone decorative elements.',
        ],
      },
    },
    {
      id: 'rec-init-02',
      username: 'sai',
      timestamp: '2026-05-22T12:05:00Z',
      type: 'party',
      input_summary: {
        total_budget: 5000,
        party_type: 'Wedding',
        num_guests: 3,
        venue_type: 'Home',
        needs: { catering: true, decoration: true, entertainment: true },
      },
      result_summary: {
        total_budget: 5000,
        remaining_budget: 0,
        item_count: 6,
        highlight: 'Intimate Home Wedding Reception for 3 Guests',
      },
      full_result: {
        total_budget: 5000,
        allocated_budget: 5000,
        remaining_budget: 0,
        currency: 'INR',
        venue_suggestions: [
          {
            name: 'Cozy Home Setup',
            type: 'Residential',
            capacity: 10,
            estimated_cost: 0,
            location: 'Home Venue',
            search_terms: 'home event setup ideas',
            shopping_links: {
              google: 'https://www.google.com/search?q=home+party+venue+setup',
              booking: 'https://www.booking.com/search.html?ss=home+stay',
              makemytrip: 'https://www.makemytrip.com/hotels/hotel-listing/?searchText=homestay',
              oyorooms: 'https://www.oyorooms.com/search/?location=homestay',
              nobroker: 'https://www.nobroker.in/property/search/searchterm=apartment',
            },
          },
        ],
        budget_breakdown: [
          {
            category: 'Catering',
            allocation: 2000,
            items: [
              {
                name: 'Deluxe Home-Cooked Feast Meal',
                description: 'Multi-course celebratory gourmet meal for 3 people',
                estimated_price: 2000,
                quantity: 1,
                search_terms: 'gourmet catering meal feast',
                shopping_links: {
                  swiggy: 'https://www.swiggy.com/search?query=party+catering',
                  zomato: 'https://www.zomato.com/search?q=party+catering',
                  bigbasket: 'https://www.bigbasket.com/ps/?q=party+food',
                  amazon: 'https://www.amazon.in/s?k=gourmet+snacks+gift+hamper',
                  flipkart: 'https://www.flipkart.com/search?q=sweets+gift+box',
                },
              },
            ],
          },
          {
            category: 'Entertainment',
            allocation: 2000,
            items: [
              {
                name: 'Streaming Service Subscription',
                description: 'One-time subscription for party music and entertainment streaming',
                estimated_price: 500,
                quantity: 1,
                search_terms: 'music streaming subscription gift',
                shopping_links: {
                  amazon: 'https://www.amazon.in/s?k=music+subscription+card',
                  bookmyshow: 'https://in.bookmyshow.com/search?q=events',
                  flipkart: 'https://www.flipkart.com/search?q=subscription+voucher',
                },
              },
              {
                name: 'Board Games / Card Games',
                description: 'Fun interactive games for guest entertainment',
                estimated_price: 500,
                quantity: 1,
                search_terms: 'party board games cards',
                shopping_links: {
                  amazon: 'https://www.amazon.in/s?k=party+board+games+cards',
                  flipkart: 'https://www.flipkart.com/search?q=party+board+games',
                  bookmyshow: 'https://in.bookmyshow.com/search?q=activities',
                },
              },
              {
                name: 'Small Commemorative Gift for Couple',
                description: 'Personalized keepsake gift token',
                estimated_price: 1000,
                quantity: 1,
                search_terms: 'couple wedding keepsake gift',
                shopping_links: {
                  amazon: 'https://www.amazon.in/s?k=wedding+gift+for+couple',
                  flipkart: 'https://www.flipkart.com/search?q=wedding+gift+couple',
                  myntra: 'https://www.myntra.com/search?q=gift+hamper',
                },
              },
            ],
          },
          {
            category: 'Contingency & Decor',
            allocation: 1000,
            items: [
              {
                name: 'Ambient Decor & Floral Lights',
                description: 'Fairy lights, scented candles, and fresh garland decor',
                estimated_price: 1000,
                quantity: 1,
                search_terms: 'wedding fairy lights and flower garland decor',
                shopping_links: {
                  amazon: 'https://www.amazon.in/s?k=wedding+fairy+lights+decor',
                  flipkart: 'https://www.flipkart.com/search?q=wedding+decor+lights',
                  meesho: 'https://www.meesho.com/search?q=flower+garland+decor',
                  myntra: 'https://www.myntra.com/search?q=home+decor+candles',
                },
              },
            ],
          },
        ],
        calculation_table_inr: [
          { category: 'Venue', items_count: 1, total_cost: 0, percentage_of_budget: 0 },
          { category: 'Catering', items_count: 1, total_cost: 2000, percentage_of_budget: 40 },
          { category: 'Entertainment', items_count: 3, total_cost: 2000, percentage_of_budget: 40 },
          { category: 'Contingency & Decor', items_count: 1, total_cost: 1000, percentage_of_budget: 20 },
        ],
        additional_suggestions: [
          'Create a shared Spotify collaborative playlist for guests ahead of the event.',
          'Consider homemade floral decorations to save on professional setup costs.',
          'Order food bundles or family platters via Swiggy/Zomato for group discounts.',
        ],
      },
    },
    {
      id: 'rec-init-03',
      username: 'sai',
      timestamp: '2026-05-22T12:06:00Z',
      type: 'jewelry',
      input_summary: {
        total_budget: 5000,
        occasion: 'Birthday',
        style_preferences: 'Casual minimalist with metal accents',
        has_outfit_image: true,
      },
      result_summary: {
        total_budget: 5000,
        remaining_budget: 800,
        item_count: 3,
        highlight: 'Curated 3-piece Birthday collection with outfit pairing',
      },
      full_result: {
        total_budget: 5000,
        remaining_budget: 800,
        currency: 'INR',
        outfit_analysis: {
          colors: ['Blue', 'White'],
          style: 'Casual Chic',
          formality: 'Informal / Smart Casual',
          summary: 'Cool-toned casual outfit harmonizes with silver, steel, and dark braided textures.',
        },
        jewelry_recommendations: [
          {
            item_type: 'Bracelet',
            description: 'Simple braided leather bracelet with brushed metal accents',
            style: 'Casual Modern',
            estimated_price: 500,
            search_terms: 'braided leather bracelet metal clasp',
            shopping_links: {
              amazon: 'https://www.amazon.in/s?k=braided+leather+bracelet+metal+clasp',
              flipkart: 'https://www.flipkart.com/search?q=braided+leather+bracelet',
              bluestone: 'https://www.bluestone.com/search.html?query=bracelet',
              tanishq: 'https://www.tanishq.co.in/search?q=bracelet',
              caratlane: 'https://www.caratlane.com/search?q=bracelet',
              melorra: 'https://www.melorra.com/search?q=bracelet',
              meesho: 'https://www.meesho.com/search?q=leather+bracelet',
            },
          },
          {
            item_type: 'Ring',
            description: 'Silver or dark grey metal band with a minimalist brushed finish',
            style: 'Minimalist Band',
            estimated_price: 700,
            search_terms: 'sterling silver minimalist band ring',
            shopping_links: {
              amazon: 'https://www.amazon.in/s?k=sterling+silver+minimalist+band+ring',
              flipkart: 'https://www.flipkart.com/search?q=silver+band+ring',
              bluestone: 'https://www.bluestone.com/search.html?query=silver+ring',
              tanishq: 'https://www.tanishq.co.in/search?q=silver+ring',
              caratlane: 'https://www.caratlane.com/search?q=band+ring',
              melorra: 'https://www.melorra.com/search?q=ring',
              meesho: 'https://www.meesho.com/search?q=silver+ring',
            },
          },
          {
            item_type: 'Watch',
            description: 'Classic slim analog watch with dark band matching shirt tones',
            style: 'Classic Casual',
            estimated_price: 3000,
            search_terms: 'slim minimalist analog watch leather strap',
            shopping_links: {
              amazon: 'https://www.amazon.in/s?k=slim+minimalist+analog+watch',
              flipkart: 'https://www.flipkart.com/search?q=minimalist+analog+watch',
              bluestone: 'https://www.bluestone.com/search.html?query=watch',
              tanishq: 'https://www.tanishq.co.in/search?q=titan+watch',
              caratlane: 'https://www.caratlane.com/search?q=watch',
              melorra: 'https://www.melorra.com/search?q=watch',
              meesho: 'https://www.meesho.com/search?q=analog+watch',
            },
          },
        ],
        styling_tips: [
          'Keep jewelry minimal to complement the effortless casual style of the outfit.',
          'Consider the watch as the anchor statement piece; select a metal tone that aligns with your ring.',
          'Ensure metal tones of ring and bracelet accents match for a cohesive aesthetic.',
        ],
      },
    },
  ],
};

// Shopping Links Builders
function buildHomeShoppingLinks(query: string): Record<string, string> {
  const q = encodeURIComponent(query.trim());
  return {
    amazon: `https://www.amazon.in/s?k=${q}`,
    flipkart: `https://www.flipkart.com/search?q=${q}`,
    ikea: `https://www.ikea.com/in/en/search/?q=${q}`,
    myntra: `https://www.myntra.com/search?q=${q}`,
    ajio: `https://www.ajio.com/search/?text=${q}`,
  };
}

function buildPartyShoppingLinks(category: string, query: string): Record<string, string> {
  const q = encodeURIComponent(query.trim());
  const cat = category.toLowerCase();

  if (cat.includes('venue') || cat.includes('hotel') || cat.includes('resort')) {
    return {
      google: `https://www.google.com/search?q=${q}`,
      booking: `https://www.booking.com/search.html?ss=${q}`,
      makemytrip: `https://www.makemytrip.com/hotels/hotel-listing/?searchText=${q}`,
      oyorooms: `https://www.oyorooms.com/search/?location=${q}`,
      nobroker: `https://www.nobroker.in/property/search/searchterm=${q}`,
    };
  }

  if (cat.includes('cater') || cat.includes('food') || cat.includes('drink')) {
    return {
      swiggy: `https://www.swiggy.com/search?query=${q}`,
      zomato: `https://www.zomato.com/search?q=${q}`,
      bigbasket: `https://www.bigbasket.com/ps/?q=${q}`,
      amazon: `https://www.amazon.in/s?k=${q}`,
      flipkart: `https://www.flipkart.com/search?q=${q}`,
    };
  }

  if (cat.includes('entertain') || cat.includes('music') || cat.includes('game')) {
    return {
      bookmyshow: `https://in.bookmyshow.com/search?q=${q}`,
      amazon: `https://www.amazon.in/s?k=${q}`,
      flipkart: `https://www.flipkart.com/search?q=${q}`,
      spotify: `https://open.spotify.com/search/${q}`,
    };
  }

  if (cat.includes('decor')) {
    return {
      amazon: `https://www.amazon.in/s?k=${q}`,
      flipkart: `https://www.flipkart.com/search?q=${q}`,
      meesho: `https://www.meesho.com/search?q=${q}`,
      myntra: `https://www.myntra.com/search?q=${q}`,
    };
  }

  return {
    amazon: `https://www.amazon.in/s?k=${q}`,
    flipkart: `https://www.flipkart.com/search?q=${q}`,
    google: `https://www.google.com/search?q=${q}`,
  };
}

function buildJewelryShoppingLinks(query: string): Record<string, string> {
  const q = encodeURIComponent(query.trim());
  return {
    amazon: `https://www.amazon.in/s?k=${q}`,
    flipkart: `https://www.flipkart.com/search?q=${q}`,
    bluestone: `https://www.bluestone.com/search.html?query=${q}`,
    tanishq: `https://www.tanishq.co.in/search?q=${q}`,
    caratlane: `https://www.caratlane.com/search?q=${q}`,
    melorra: `https://www.melorra.com/search?q=${q}`,
    meesho: `https://www.meesho.com/search?q=${q}`,
  };
}

// JSON Extractor helper
function extractJsonFromText(text: string): any {
  try {
    return JSON.parse(text);
  } catch {
    // Look for markdown json block
    const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (match && match[1]) {
      try {
        return JSON.parse(match[1]);
      } catch {}
    }

    // Try finding the first '{' and last '}'
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start !== -1 && end !== -1 && end > start) {
      try {
        return JSON.parse(text.substring(start, end + 1));
      } catch {}
    }

    throw new Error('Failed to parse JSON response from AI model');
  }
}

// ==========================================
// Authentication & Session Routes
// ==========================================

app.post('/api/register', (req: Request, res: Response) => {
  const { username, email, password, full_name } = req.body;
  if (!username || !password) {
    return res.status(400).json({ detail: 'Username and password are required' });
  }
  if (usersDb[username]) {
    return res.status(400).json({ detail: 'Username already registered' });
  }

  usersDb[username] = {
    username,
    email: email || `${username}@example.com`,
    passwordHash: password,
    fullName: full_name || username,
  };

  const token = `token-${username}-${Date.now()}`;
  activeSessions[username] = {
    username,
    token,
    loginTime: new Date().toISOString(),
    lastActivity: new Date().toISOString(),
    userData: {},
  };

  return res.json({
    message: 'User registered successfully',
    access_token: token,
    token_type: 'bearer',
    user: {
      username,
      email: usersDb[username].email,
      full_name: usersDb[username].fullName,
    },
  });
});

app.post(['/api/login', '/api/token', '/token'], (req: Request, res: Response) => {
  // Support JSON or x-www-form-urlencoded
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ detail: 'Username and password are required' });
  }

  const user = usersDb[username];
  if (!user || user.passwordHash !== password) {
    // For convenience in testing/demo, create user if not exists or allow default
    if (!user) {
      usersDb[username] = {
        username,
        email: `${username}@example.com`,
        passwordHash: password,
        fullName: username,
      };
    } else {
      return res.status(401).json({ detail: 'Incorrect username or password' });
    }
  }

  const token = `token-${username}-${Date.now()}`;
  activeSessions[username] = {
    username,
    token,
    loginTime: new Date().toISOString(),
    lastActivity: new Date().toISOString(),
    userData: activeSessions[username]?.userData || {},
  };

  return res.json({
    access_token: token,
    token_type: 'bearer',
    user: {
      username,
      email: usersDb[username].email,
      full_name: usersDb[username].fullName,
    },
  });
});

app.post('/api/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  let username = 'sai';
  if (authHeader && authHeader.startsWith('Bearer token-')) {
    const parts = authHeader.replace('Bearer token-', '').split('-');
    if (parts[0]) username = parts[0];
  }
  if (activeSessions[username]) {
    delete activeSessions[username];
  }
  return res.json({ message: 'Successfully logged out' });
});

app.get('/api/session-info', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  let username = 'sai';
  if (authHeader && authHeader.startsWith('Bearer token-')) {
    const parts = authHeader.replace('Bearer token-', '').split('-');
    if (parts[0] && usersDb[parts[0]]) {
      username = parts[0];
    }
  }

  const session = activeSessions[username];
  if (session) {
    const loginDate = new Date(session.loginTime);
    const durationMinutes = Math.floor((Date.now() - loginDate.getTime()) / 60000);
    return res.json({
      username: session.username,
      login_time: session.loginTime,
      last_activity: session.lastActivity,
      session_duration: durationMinutes,
      user_data: session.userData,
      user: {
        username: session.username,
        email: usersDb[session.username]?.email || `${session.username}@example.com`,
        full_name: usersDb[session.username]?.fullName || session.username,
      },
    });
  }

  return res.json({
    username: 'sai',
    login_time: new Date().toISOString(),
    last_activity: new Date().toISOString(),
    session_duration: 5,
    user_data: {},
    user: {
      username: 'sai',
      email: 'sai@example.com',
      full_name: 'Sai Krishna',
    },
  });
});

app.post('/api/session-data', (req: Request, res: Response) => {
  const { username = 'sai', data } = req.body;
  if (!activeSessions[username]) {
    activeSessions[username] = {
      username,
      token: `token-${username}-auto`,
      loginTime: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      userData: {},
    };
  }
  activeSessions[username].userData = {
    ...activeSessions[username].userData,
    ...(data || {}),
  };
  activeSessions[username].lastActivity = new Date().toISOString();
  return res.json({
    message: 'Session data updated',
    data: activeSessions[username].userData,
  });
});

// ==========================================
// Recommendation History Routes
// ==========================================

app.get(['/api/recommendation-history', '/recommendation-history'], (req: Request, res: Response) => {
  const username = (req.query.username as string) || 'sai';
  const history = userRecommendations[username] || [];
  // Sort descending by timestamp
  const sorted = [...history].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  return res.json({ history: sorted });
});

app.get(['/api/recommendation-details/:id', '/recommendation-details/:id'], (req: Request, res: Response) => {
  const { id } = req.params;
  for (const user of Object.keys(userRecommendations)) {
    const item = userRecommendations[user].find((r) => r.id === id);
    if (item) {
      return res.json(item);
    }
  }
  return res.status(404).json({ detail: 'Recommendation not found' });
});

app.delete('/api/recommendation-history/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const username = (req.query.username as string) || 'sai';
  if (userRecommendations[username]) {
    userRecommendations[username] = userRecommendations[username].filter((r) => r.id !== id);
  }
  return res.json({ success: true, message: 'Deleted successfully' });
});

// ==========================================
// SCENARIO 1: HOME INTERIOR PLANNER
// ==========================================

app.post(['/api/generate-home', '/generate-home', '/home-budget'], async (req: Request, res: Response) => {
  try {
    const {
      total_budget = 5000,
      num_lights = 5,
      num_fans = 4,
      num_furniture = 2,
      num_dining_tables = 1,
      has_living_room = true,
      has_kitchen = true,
      has_bedroom = false,
      additional_requirements = '',
      currency = 'INR',
      username = 'sai',
    } = req.body;

    const budgetNum = parseFloat(total_budget) || 5000;
    const lightsNum = parseInt(num_lights, 10) || 0;
    const fansNum = parseInt(num_fans, 10) || 0;
    const furnitureNum = parseInt(num_furniture, 10) || 0;
    const diningNum = parseInt(num_dining_tables, 10) || 0;

    const rooms = [];
    if (has_living_room) rooms.push('Living Room');
    if (has_kitchen) rooms.push('Kitchen');
    if (has_bedroom) rooms.push('Bedroom');
    const roomsStr = rooms.join(', ') || 'General Living Area';

    let result: any = null;

    if (ai) {
      const prompt = `
I need interior design product recommendations for a home in India with a total budget of ₹${budgetNum.toFixed(2)}.
Requirements:
- ${lightsNum} lights/lighting fixtures
- ${fansNum} ceiling fans
- ${furnitureNum} furniture pieces
- ${diningNum} dining tables

Rooms to consider: ${roomsStr}
Additional requirements: ${additional_requirements || 'Cost-effective, durable, and stylish modern aesthetics'}

Please provide a detailed budget breakdown with product recommendations available in India.
Use Indian brands and pricing (INR). Include realistic item prices and search terms suitable for Indian shopping platforms like Flipkart, Amazon India, and IKEA.

Format your response strictly as JSON with this exact structure:
{
  "total_budget": ${budgetNum.toFixed(2)},
  "budget_breakdown": [
    {
      "category": "Lighting",
      "allocation": 1500.0,
      "items": [
        {
          "name": "LED Bulb (Warm White)",
          "description": "Energy-efficient LED bulbs for general lighting",
          "estimated_price": 100.0,
          "quantity": ${lightsNum || 1},
          "search_terms": "warm white led bulb pack"
        }
      ]
    }
  ],
  "calculation_table": [
    {
      "category": "Lighting",
      "items_count": ${lightsNum || 1},
      "total_cost": 500.0,
      "percentage_of_budget": 10.0
    }
  ],
  "remaining_budget": 500.0,
  "additional_suggestions": [
    "Consider multi-packs for savings",
    "Look for sales on online marketplaces"
  ]
}

Ensure all costs stay within or equal to the budget. Return ONLY valid JSON, no markdown backticks.`;

      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
        });

        const rawText = response.text || '';
        result = extractJsonFromText(rawText);
      } catch (geminiErr) {
        console.warn('Gemini Home generation warning, using fallback logic:', geminiErr);
      }
    }

    // High quality deterministic fallback if AI is unavailable
    if (!result || !result.budget_breakdown) {
      const lightingAlloc = Math.round(budgetNum * 0.25);
      const fanAlloc = Math.round(budgetNum * 0.35);
      const furnAlloc = Math.round(budgetNum * 0.3);
      const remaining = Math.max(0, budgetNum - (lightingAlloc + fanAlloc + furnAlloc));

      const perLight = lightsNum > 0 ? Math.round(lightingAlloc / lightsNum) : 150;
      const perFan = fansNum > 0 ? Math.round(fanAlloc / fansNum) : 600;
      const perFurn = furnitureNum > 0 ? Math.round((furnAlloc * 0.6) / furnitureNum) : 400;
      const perDining = diningNum > 0 ? Math.round((furnAlloc * 0.4) / diningNum) : 800;

      result = {
        total_budget: budgetNum,
        remaining_budget: remaining,
        currency,
        budget_breakdown: [
          {
            category: 'Lighting',
            allocation: lightingAlloc,
            items: [
              {
                name: 'LED Bulb & Panel Lights (Warm White)',
                description: `Energy-efficient LED fixtures tailored for ${roomsStr}`,
                estimated_price: perLight,
                quantity: lightsNum || 2,
                search_terms: 'warm white led bulb pack',
              },
            ],
          },
          {
            category: 'Ceiling Fans',
            allocation: fanAlloc,
            items: [
              {
                name: 'Havells / Crompton High Speed Ceiling Fan',
                description: 'Energy-saving 1200mm ceiling fans with quiet copper motor',
                estimated_price: perFan,
                quantity: fansNum || 1,
                search_terms: 'crompton havells 1200mm ceiling fan',
              },
            ],
          },
          {
            category: 'Furniture & Dining',
            allocation: furnAlloc,
            items: [
              {
                name: 'Ergonomic Wooden & Metal Chairs',
                description: 'Stackable modern chairs with comfortable seating contour',
                estimated_price: perFurn,
                quantity: furnitureNum || 2,
                search_terms: 'wooden ergonomic chair compact',
              },
              {
                name: 'Compact Wooden Dining / Work Table',
                description: `Sleek dining table suitable for ${rooms[0] || 'living space'}`,
                estimated_price: perDining,
                quantity: diningNum || 1,
                search_terms: 'compact solid wood dining table',
              },
            ],
          },
        ],
        calculation_table: [
          { category: 'Lighting', items_count: lightsNum || 2, total_cost: perLight * (lightsNum || 2), percentage_of_budget: Math.round(((perLight * (lightsNum || 2)) / budgetNum) * 100) },
          { category: 'Ceiling Fans', items_count: fansNum || 1, total_cost: perFan * (fansNum || 1), percentage_of_budget: Math.round(((perFan * (fansNum || 1)) / budgetNum) * 100) },
          { category: 'Furniture & Dining', items_count: (furnitureNum || 2) + (diningNum || 1), total_cost: furnAlloc, percentage_of_budget: Math.round((furnAlloc / budgetNum) * 100) },
        ],
        additional_suggestions: [
          'Consider purchasing multi-pack bundle sets on Amazon and Flipkart for bulk discount.',
          'Check IKEA India for modular flat-pack furniture that saves on delivery and assembly.',
          'Prioritize core fixtures (lighting and fans) before accent decorative units.',
          `Tailor finish tones to match ${roomsStr} natural lighting conditions.`,
        ],
      };
    }

    // Enrich items with shopping links
    result.total_budget = budgetNum;
    result.currency = currency;
    let computedTotal = 0;

    for (const cat of result.budget_breakdown || []) {
      for (const item of cat.items || []) {
        const query = item.search_terms || item.name;
        item.shopping_links = buildHomeShoppingLinks(query);
        computedTotal += (item.estimated_price || 0) * (item.quantity || 1);
      }
    }

    if (result.remaining_budget === undefined) {
      result.remaining_budget = Math.max(0, budgetNum - computedTotal);
    }

    // Save to user recommendation history
    const historyItem: StoredRecommendation = {
      id: `rec-home-${Date.now()}`,
      username,
      timestamp: new Date().toISOString(),
      type: 'home',
      input_summary: {
        total_budget: budgetNum,
        rooms,
        lights: lightsNum,
        fans: fansNum,
        furniture: furnitureNum,
        dining_tables: diningNum,
        additional_requirements,
      },
      result_summary: {
        total_budget: budgetNum,
        remaining_budget: result.remaining_budget,
        item_count: (result.budget_breakdown || []).reduce((acc: number, c: any) => acc + (c.items?.length || 0), 0),
        highlight: `${roomsStr} (${lightsNum} lights, ${fansNum} fans, ${furnitureNum} furniture)`,
      },
      full_result: result,
    };

    if (!userRecommendations[username]) {
      userRecommendations[username] = [];
    }
    userRecommendations[username].unshift(historyItem);

    // Update active session data
    if (activeSessions[username]) {
      activeSessions[username].userData.last_home_budget = historyItem.input_summary;
      activeSessions[username].lastActivity = new Date().toISOString();
    }

    return res.json(result);
  } catch (err: any) {
    console.error('Error generating home recommendations:', err);
    return res.status(500).json({ detail: `Error generating recommendations: ${err.message}` });
  }
});

// ==========================================
// SCENARIO 2: PARTY BUDGET PLANNER
// ==========================================

app.post(['/api/generate-party', '/generate-party', '/party-budget'], async (req: Request, res: Response) => {
  try {
    const {
      total_budget = 5000,
      num_guests = 3,
      party_type = 'Wedding',
      venue_type = 'Home',
      needs_catering = true,
      needs_decoration = true,
      needs_entertainment = true,
      additional_requirements = '',
      currency = 'INR',
      username = 'sai',
    } = req.body;

    const budgetNum = parseFloat(total_budget) || 5000;
    const guestsNum = parseInt(num_guests, 10) || 3;

    let result: any = null;

    if (ai) {
      const prompt = `
I need party planning recommendations for India with a total budget of ₹${budgetNum.toFixed(2)}.

Party details:
- Type: ${party_type}
- Number of guests: ${guestsNum}
- Venue type: ${venue_type || 'Not specified'}
- Catering needed: ${needs_catering ? 'Yes' : 'No'}
- Decoration needed: ${needs_decoration ? 'Yes' : 'No'}
- Entertainment needed: ${needs_entertainment ? 'Yes' : 'No'}
Additional requirements: ${additional_requirements || 'None'}

Please provide a detailed budget breakdown with specific recommendations available in India using INR prices.
Use Indian brands, services, and typical cost expectations.

Format your response strictly as JSON with the following structure:
{
  "total_budget": ${budgetNum.toFixed(2)},
  "allocated_budget": ${budgetNum.toFixed(2)},
  "remaining_budget": 0.0,
  "venue_suggestions": [
    {
      "name": "Cozy Venue Option",
      "type": "${venue_type}",
      "capacity": ${guestsNum * 2},
      "estimated_cost": ${(venue_type === 'Home' ? 0 : budgetNum * 0.25).toFixed(2)},
      "search_terms": "${party_type} venue ${venue_type}"
    }
  ],
  "budget_breakdown": [
    {
      "category": "Catering",
      "allocation": ${(budgetNum * 0.4).toFixed(2)},
      "items": [
        {
          "name": "Party Meal Package",
          "description": "Multi-course feast suitable for ${guestsNum} guests",
          "estimated_price": ${(budgetNum * 0.4).toFixed(2)},
          "quantity": 1,
          "search_terms": "party catering food platter"
        }
      ]
    },
    {
      "category": "Entertainment",
      "allocation": ${(budgetNum * 0.35).toFixed(2)},
      "items": [
        {
          "name": "Music & Games",
          "description": "Streaming audio playlist & party games",
          "estimated_price": ${(budgetNum * 0.35).toFixed(2)},
          "quantity": 1,
          "search_terms": "party games streaming playlist"
        }
      ]
    }
  ],
  "calculation_table_inr": [
    {
      "category": "Catering",
      "items_count": 1,
      "total_cost": ${(budgetNum * 0.4).toFixed(2)},
      "percentage_of_budget": 40.0
    }
  ],
  "additional_suggestions": [
    "Consider making a potluck or buffet style catering",
    "Look for discounts on streaming services or board games"
  ]
}

Ensure all costs are in INR and total does not exceed the given budget. Return ONLY valid JSON, no markdown backticks.`;

      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
        });

        const rawText = response.text || '';
        result = extractJsonFromText(rawText);
      } catch (geminiErr) {
        console.warn('Gemini Party generation warning, using fallback logic:', geminiErr);
      }
    }

    // High quality deterministic fallback
    if (!result || !result.budget_breakdown) {
      const isHome = venue_type.toLowerCase() === 'home';
      const venueCost = isHome ? 0 : Math.round(budgetNum * 0.25);
      const availForOther = budgetNum - venueCost;

      const cateringCost = needs_catering ? Math.round(availForOther * 0.45) : 0;
      const entertainCost = needs_entertainment ? Math.round(availForOther * 0.3) : 0;
      const decorCost = needs_decoration ? Math.round(availForOther * 0.2) : 0;
      const contingencyCost = Math.max(0, budgetNum - (venueCost + cateringCost + entertainCost + decorCost));

      result = {
        total_budget: budgetNum,
        allocated_budget: budgetNum - contingencyCost,
        remaining_budget: contingencyCost,
        currency,
        venue_suggestions: [
          {
            name: isHome ? 'Home Residence Setup' : `${venue_type} Banquet & Hall Space`,
            type: venue_type,
            capacity: Math.max(10, guestsNum * 2),
            estimated_cost: venueCost,
            location: isHome ? 'Residential / Private Space' : 'Local City Center / Suburb',
            search_terms: isHome ? 'home event setup ideas' : `${party_type} banquet hall booking`,
          },
        ],
        budget_breakdown: [
          ...(needs_catering
            ? [
                {
                  category: 'Catering',
                  allocation: cateringCost,
                  items: [
                    {
                      name: `Celebration Feast for ${guestsNum} Guests`,
                      description: `Curated hot multi-course buffet tailored for ${party_type}`,
                      estimated_price: cateringCost,
                      quantity: 1,
                      search_terms: `${party_type} food catering platter feast`,
                    },
                  ],
                },
              ]
            : []),
          ...(needs_entertainment
            ? [
                {
                  category: 'Entertainment',
                  allocation: entertainCost,
                  items: [
                    {
                      name: 'Audio Streaming & Party Playlist',
                      description: 'High-fidelity music streaming for party ambience',
                      estimated_price: Math.round(entertainCost * 0.35),
                      quantity: 1,
                      search_terms: 'music streaming playlist party speaker',
                    },
                    {
                      name: 'Interactive Party Games / Trivia Cards',
                      description: 'Fun social games and trivia for guest engagement',
                      estimated_price: Math.round(entertainCost * 0.35),
                      quantity: 1,
                      search_terms: 'group party card board games',
                    },
                    {
                      name: 'Keepsake Favor / Small Gift',
                      description: 'Appreciation token and celebratory gift',
                      estimated_price: Math.round(entertainCost * 0.3),
                      quantity: 1,
                      search_terms: `${party_type} celebration gift favor`,
                    },
                  ],
                },
              ]
            : []),
          ...(needs_decoration
            ? [
                {
                  category: 'Decoration & Contingency',
                  allocation: decorCost,
                  items: [
                    {
                      name: 'Themed Balloon Arch & Fairy Garland Lights',
                      description: `Vibrant festive decor styling suited for a ${party_type}`,
                      estimated_price: decorCost,
                      quantity: 1,
                      search_terms: `${party_type} fairy lights balloon arch decor`,
                    },
                  ],
                },
              ]
            : []),
        ],
        calculation_table_inr: [
          { category: 'Venue', items_count: 1, total_cost: venueCost, percentage_of_budget: Math.round((venueCost / budgetNum) * 100) },
          { category: 'Catering', items_count: 1, total_cost: cateringCost, percentage_of_budget: Math.round((cateringCost / budgetNum) * 100) },
          { category: 'Entertainment', items_count: needs_entertainment ? 3 : 0, total_cost: entertainCost, percentage_of_budget: Math.round((entertainCost / budgetNum) * 100) },
          { category: 'Decoration', items_count: needs_decoration ? 1 : 0, total_cost: decorCost, percentage_of_budget: Math.round((decorCost / budgetNum) * 100) },
        ],
        additional_suggestions: [
          'Order food bundles via Swiggy or Zomato for group platters with instant delivery.',
          'Consider making a potluck style or mocktail station to save catering expenses.',
          'Look for party supplies and reusable fairy lights on Amazon, Flipkart, or Meesho.',
          'Create a collaborative Spotify queue so all attendees can add their favorite songs.',
        ],
      };
    }

    // Enrich venue shopping links
    for (const venue of result.venue_suggestions || []) {
      const q = venue.search_terms || venue.name;
      venue.shopping_links = buildPartyShoppingLinks('venue', q);
    }

    // Enrich breakdown shopping links
    for (const cat of result.budget_breakdown || []) {
      for (const item of cat.items || []) {
        const q = item.search_terms || item.name;
        item.shopping_links = buildPartyShoppingLinks(cat.category, q);
      }
    }

    result.total_budget = budgetNum;
    result.currency = currency;

    // Save to user recommendation history
    const historyItem: StoredRecommendation = {
      id: `rec-party-${Date.now()}`,
      username,
      timestamp: new Date().toISOString(),
      type: 'party',
      input_summary: {
        total_budget: budgetNum,
        party_type,
        num_guests: guestsNum,
        venue_type,
        needs: { catering: needs_catering, decoration: needs_decoration, entertainment: needs_entertainment },
        additional_requirements,
      },
      result_summary: {
        total_budget: budgetNum,
        remaining_budget: result.remaining_budget ?? 0,
        item_count: (result.budget_breakdown || []).reduce((acc: number, c: any) => acc + (c.items?.length || 0), 0) + (result.venue_suggestions?.length || 0),
        highlight: `${party_type} for ${guestsNum} guests at ${venue_type}`,
      },
      full_result: result,
    };

    if (!userRecommendations[username]) {
      userRecommendations[username] = [];
    }
    userRecommendations[username].unshift(historyItem);

    if (activeSessions[username]) {
      activeSessions[username].userData.last_party_budget = historyItem.input_summary;
      activeSessions[username].lastActivity = new Date().toISOString();
    }

    return res.json(result);
  } catch (err: any) {
    console.error('Error generating party recommendations:', err);
    return res.status(500).json({ detail: `Error generating recommendations: ${err.message}` });
  }
});

// ==========================================
// SCENARIO 3: JEWELRY BUDGET PLANNER
// ==========================================

app.post(['/api/generate-jewelry', '/generate-jewelry', '/jewelry-budget'], async (req: Request, res: Response) => {
  try {
    const {
      total_budget = 5000,
      occasion = 'Birthday',
      preferences = 'Casual minimalist with metal accents',
      image_data = null, // base64 string or data url
      image_mime_type = 'image/jpeg',
      currency = 'INR',
      username = 'sai',
    } = req.body;

    const budgetNum = parseFloat(total_budget) || 5000;
    const hasImage = Boolean(image_data);

    let result: any = null;

    if (ai) {
      const basePrompt = `
I need jewelry recommendations for India with a total budget of ₹${budgetNum.toFixed(2)}.

Occasion: ${occasion}
Preferences: ${preferences || 'Not specified'}
Provide only India-relevant styles, availability, and price ranges in INR.
`;

      const instruction = `
Format the output strictly as JSON with this exact structure:
{
  "total_budget": ${budgetNum.toFixed(2)},
  "remaining_budget": ${(budgetNum * 0.16).toFixed(2)},
  ${
    hasImage
      ? `"outfit_analysis": {
    "colors": ["Detected Color 1", "Detected Color 2"],
    "style": "Casual / Elegant / Traditional",
    "formality": "Informal / Semi-Formal / Formal",
    "summary": "Short analysis of how jewelry complements the outfit colors and neckline."
  },`
      : ''
  }
  "jewelry_recommendations": [
    {
      "item_type": "Bracelet",
      "description": "Simple braided leather bracelet with metal accents",
      "style": "Casual modern",
      "estimated_price": ${(budgetNum * 0.1).toFixed(2)},
      "search_terms": "braided leather bracelet metal"
    },
    {
      "item_type": "Ring",
      "description": "Silver or dark grey metal ring with minimalist design",
      "style": "Minimalist",
      "estimated_price": ${(budgetNum * 0.14).toFixed(2)},
      "search_terms": "sterling silver minimalist ring"
    },
    {
      "item_type": "Watch",
      "description": "Classic simple watch with leather or metal band",
      "style": "Classic",
      "estimated_price": ${(budgetNum * 0.6).toFixed(2)},
      "search_terms": "classic minimalist watch"
    }
  ],
  "styling_tips": [
    "Keep jewelry minimal to match the casual style of the outfit.",
    "Consider the watch as a statement piece.",
    "Ensure metal tones of ring and bracelet complement each other."
  ]
}

Keep prices in INR and relevant to Indian brands like Bluestone, Tanishq, CaratLane, and Amazon India. Return ONLY valid JSON, no markdown backticks.`;

      try {
        if (hasImage && typeof image_data === 'string') {
          // Clean base64 data if data:image/... prefix exists
          const base64Clean = image_data.replace(/^data:image\/[a-z]+;base64,/, '');
          const mimeMatch = image_data.match(/^data:(image\/[a-z]+);base64,/);
          const mimeType = mimeMatch ? mimeMatch[1] : (image_mime_type || 'image/jpeg');

          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: {
              parts: [
                {
                  inlineData: {
                    mimeType,
                    data: base64Clean,
                  },
                },
                {
                  text: `${basePrompt}\nAn image of the outfit is uploaded. Carefully analyze the outfit colors, pattern, neckline, and aesthetic formality to suggest complementary jewelry.\n${instruction}`,
                },
              ],
            },
          });

          const rawText = response.text || '';
          result = extractJsonFromText(rawText);
        } else {
          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: `${basePrompt}\n${instruction}`,
          });

          const rawText = response.text || '';
          result = extractJsonFromText(rawText);
        }
      } catch (geminiErr) {
        console.warn('Gemini Jewelry generation warning, using fallback logic:', geminiErr);
      }
    }

    // High quality deterministic fallback
    if (!result || !result.jewelry_recommendations) {
      const braceletCost = Math.round(budgetNum * 0.1);
      const ringCost = Math.round(budgetNum * 0.14);
      const watchOrNecklaceCost = Math.round(budgetNum * 0.6);
      const remaining = Math.max(0, budgetNum - (braceletCost + ringCost + watchOrNecklaceCost));

      result = {
        total_budget: budgetNum,
        remaining_budget: remaining,
        currency,
        outfit_analysis: hasImage
          ? {
              colors: ['Navy Blue', 'Silver / White'],
              style: 'Smart Contemporary',
              formality: occasion.toLowerCase().includes('wedding') ? 'Festive Formal' : 'Smart Casual',
              summary: 'Harmonious cool tones paired with silver or polished platinum accents for an understated, balanced look.',
            }
          : undefined,
        jewelry_recommendations: [
          {
            item_type: 'Bracelet',
            description: `Braided leather bracelet with brushed metallic clasp designed for ${occasion}`,
            style: 'Modern Casual',
            estimated_price: braceletCost,
            search_terms: 'braided leather bracelet metal clasp',
          },
          {
            item_type: 'Ring',
            description: 'Sterling silver band ring with subtle laser-etched brushed finish',
            style: 'Minimalist Band',
            estimated_price: ringCost,
            search_terms: 'sterling silver band ring',
          },
          {
            item_type: occasion.toLowerCase().includes('wedding') ? 'Necklace & Pendant' : 'Watch',
            description: occasion.toLowerCase().includes('wedding')
              ? 'Delicate gold-plated chain with subtle zircon drop pendant'
              : 'Classic slim analog dial watch with genuine leather strap',
            style: 'Timeless Classic',
            estimated_price: watchOrNecklaceCost,
            search_terms: occasion.toLowerCase().includes('wedding')
              ? 'gold plated pendant necklace women'
              : 'slim analog watch leather strap',
          },
        ],
        styling_tips: [
          `Keep jewelry pieces balanced to highlight your ${occasion} attire without overwhelming it.`,
          'Match metal finishes across bracelet, rings, and timepiece for a unified appearance.',
          'Choose hypoallergenic sterling silver or stainless steel for comfortable long-duration wear.',
          'Consider shopping on Tanishq, CaratLane, or BlueStone for certified hallmark authenticity.',
        ],
      };
    }

    // Enrich shopping links
    for (const item of result.jewelry_recommendations || []) {
      const q = item.search_terms || `${item.item_type} ${item.style}`;
      item.shopping_links = buildJewelryShoppingLinks(q);
    }

    result.total_budget = budgetNum;
    result.currency = currency;

    // Save to user recommendation history
    const historyItem: StoredRecommendation = {
      id: `rec-jewelry-${Date.now()}`,
      username,
      timestamp: new Date().toISOString(),
      type: 'jewelry',
      input_summary: {
        total_budget: budgetNum,
        occasion,
        style_preferences: preferences,
        has_outfit_image: hasImage,
      },
      result_summary: {
        total_budget: budgetNum,
        remaining_budget: result.remaining_budget ?? 0,
        item_count: (result.jewelry_recommendations || []).length,
        highlight: `${occasion} Jewelry (${(result.jewelry_recommendations || []).map((j: any) => j.item_type).join(', ')})`,
      },
      full_result: result,
    };

    if (!userRecommendations[username]) {
      userRecommendations[username] = [];
    }
    userRecommendations[username].unshift(historyItem);

    if (activeSessions[username]) {
      activeSessions[username].userData.last_jewelry_budget = historyItem.input_summary;
      activeSessions[username].lastActivity = new Date().toISOString();
    }

    return res.json(result);
  } catch (err: any) {
    console.error('Error generating jewelry recommendations:', err);
    return res.status(500).json({ detail: `Error generating recommendations: ${err.message}` });
  }
});

// ==========================================
// Vite / Static Serving Configuration
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    // In dev mode, attach Vite middleware
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PocketSmart AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
