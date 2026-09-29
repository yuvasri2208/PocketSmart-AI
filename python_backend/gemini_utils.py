import os
import json
import re
import urllib.parse
from typing import Optional, Dict, Any, List
from PIL import Image

try:
    from google import genai
    from google.genai import types
except ImportError:
    import google.generativeai as genai  # type: ignore

from models import HomeBudgetInput, PartyBudgetInput, JewelryBudgetInput

# Initialize Gemini Client
API_KEY = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
client = None
if API_KEY:
    try:
        client = genai.Client(api_key=API_KEY)
    except Exception as e:
        print(f"Warning: Failed to initialize genai.Client: {e}")

def usd_to_inr(amount_usd: float, exchange_rate: float = 83.0) -> float:
    """Convert USD amount to INR using the specified exchange rate."""
    return amount_usd * exchange_rate

def extract_json_from_response(text: str) -> dict:
    """Extract and parse JSON safely from Gemini response text."""
    try:
        return json.loads(text.strip())
    except Exception:
        # Search for markdown ```json block
        match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", text)
        if match:
            try:
                return json.loads(match.group(1).strip())
            except Exception:
                pass
        
        # Search between first '{' and last '}'
        start = text.find("{")
        end = text.rfind("}")
        if start != -1 and end != -1 and end > start:
            try:
                return json.loads(text[start : end + 1])
            except Exception:
                pass
                
        raise ValueError(f"Unable to parse structured JSON from text: {text[:200]}...")

def get_home_recommendations(budget_input: HomeBudgetInput) -> dict:
    """Generate home interior recommendations within budget in INR for Indian market."""
    rooms = []
    if budget_input.has_living_room:
        rooms.append("Living Room")
    if budget_input.has_kitchen:
        rooms.append("Kitchen")
    if budget_input.has_bedroom:
        rooms.append("Bedroom")
    rooms_str = ", ".join(rooms) if rooms else "General Living Area"

    prompt = f"""
I need interior design product recommendations for a home in India with a total budget of ₹{budget_input.total_budget:.2f}.
Requirements:
- {budget_input.num_lights} lights/lighting fixtures
- {budget_input.num_fans} ceiling fans
- {budget_input.num_furniture} furniture pieces
- {budget_input.num_dining_tables} dining tables

Additional rooms to consider: {rooms_str}
Additional requirements: {budget_input.additional_requirements or "None"}

Please provide a detailed budget breakdown with product recommendations **available in India**.
Use **Indian brands and pricing**. Include **search terms** suitable for Indian shopping platforms.

Format your response as JSON with the following structure:
{{
  "total_budget": {budget_input.total_budget:.2f},
  "budget_breakdown": [
    {{
      "category": "Lighting",
      "allocation": 1500.0,
      "items": [
        {{
          "name": "LED Bulb (Warm White)",
          "description": "Energy-efficient LED bulbs for general lighting.",
          "estimated_price": 100.0,
          "quantity": 5,
          "search_terms": "warm white led bulb"
        }}
      ]
    }}
  ],
  "calculation_table": [
    {{
      "category": "Lighting",
      "items_count": 5,
      "total_cost": 500.0,
      "percentage_of_budget": 10.0
    }}
  ],
  "remaining_budget": 500.0,
  "additional_suggestions": [
    "Consider multi-packs for savings",
    "Look for sales on online marketplaces"
  ]
}}
Ensure total costs stay within budget. Return only JSON.
"""
    result = None
    if client:
        try:
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt
            )
            result = extract_json_from_response(response.text)
        except Exception as e:
            print(f"Gemini API warning: {e}")

    if not result:
        # Fallback deterministic response
        b = budget_input.total_budget
        result = {
            "total_budget": b,
            "budget_breakdown": [
                {
                    "category": "Lighting",
                    "allocation": b * 0.25,
                    "items": [
                        {
                            "name": "Philips LED Warm White Bulbs (Pack of 5)",
                            "description": "Energy saving 9W warm white bulbs",
                            "estimated_price": 100.0,
                            "quantity": budget_input.num_lights or 5,
                            "search_terms": "philips warm white led bulb 9w pack"
                        }
                    ]
                },
                {
                    "category": "Ceiling Fans",
                    "allocation": b * 0.35,
                    "items": [
                        {
                            "name": "Havells 1200mm Ceiling Fan",
                            "description": "High air-delivery 3-blade energy efficient fan",
                            "estimated_price": 500.0,
                            "quantity": budget_input.num_fans or 4,
                            "search_terms": "havells 1200mm ceiling fan"
                        }
                    ]
                },
                {
                    "category": "Furniture",
                    "allocation": b * 0.3,
                    "items": [
                        {
                            "name": "Ergonomic Chairs & Compact Wooden Table",
                            "description": f"Durable seating and dining setup for {rooms_str}",
                            "estimated_price": 400.0,
                            "quantity": (budget_input.num_furniture or 2) + (budget_input.num_dining_tables or 1),
                            "search_terms": "wooden dining chair table set"
                        }
                    ]
                }
            ],
            "calculation_table": [
                {"category": "Lighting", "items_count": budget_input.num_lights or 5, "total_cost": b * 0.25, "percentage_of_budget": 25.0},
                {"category": "Ceiling Fans", "items_count": budget_input.num_fans or 4, "total_cost": b * 0.35, "percentage_of_budget": 35.0},
                {"category": "Furniture", "items_count": (budget_input.num_furniture or 2) + (budget_input.num_dining_tables or 1), "total_cost": b * 0.3, "percentage_of_budget": 30.0}
            ],
            "remaining_budget": b * 0.1,
            "additional_suggestions": [
                "Consider purchasing used furniture for further cost savings.",
                "Look for sales and discounts on online marketplaces.",
                "Prioritize essential items and postpone non-essential purchases."
            ]
        }

    # Add shopping links for each item (Amazon, Flipkart, IKEA, Myntra, Ajio)
    for category in result.get("budget_breakdown", []):
        for item in category.get("items", []):
            st = item.get("search_terms", item.get("name", ""))
            encoded = urllib.parse.quote_plus(st)
            item["shopping_links"] = {
                "amazon": f"https://www.amazon.in/s?k={encoded}",
                "flipkart": f"https://www.flipkart.com/search?q={encoded}",
                "ikea": f"https://www.ikea.com/in/en/search/?q={encoded}",
                "myntra": f"https://www.myntra.com/search?q={encoded}",
                "ajio": f"https://www.ajio.com/search/?text={encoded}"
            }

    return result

def get_party_recommendations(budget_input: PartyBudgetInput) -> dict:
    """Generate party planning recommendations within budget in INR for Indian market."""
    prompt = f"""
I need party planning recommendations for India with a total budget of ₹{budget_input.total_budget:.2f}.
Party details:
- Type: {budget_input.party_type}
- Number of guests: {budget_input.num_guests}
- Venue type: {budget_input.venue_type or "Not specified"}
- Catering needed: {"Yes" if budget_input.needs_catering else "No"}
- Decoration needed: {"Yes" if budget_input.needs_decoration else "No"}
- Entertainment needed: {"Yes" if budget_input.needs_entertainment else "No"}
Additional requirements: {budget_input.additional_requirements or "None"}

Please provide a detailed budget breakdown with specific recommendations available in India using INR prices.
Format your response as JSON:
{{
  "total_budget": {budget_input.total_budget:.2f},
  "allocated_budget": {budget_input.total_budget:.2f},
  "remaining_budget": 0.0,
  "venue_suggestions": [
    {{
      "name": "{budget_input.venue_type} Venue Setup",
      "type": "{budget_input.venue_type}",
      "capacity": {budget_input.num_guests * 2},
      "estimated_cost": 0.0,
      "search_terms": "{budget_input.party_type} venue"
    }}
  ],
  "budget_breakdown": [
    {{
      "category": "Catering",
      "allocation": 2000.0,
      "items": [
        {{
          "name": "Home-cooked / Party Meal",
          "description": "Buffet meal for {budget_input.num_guests} guests",
          "estimated_price": 2000.0,
          "quantity": 1,
          "search_terms": "party catering meal platter"
        }}
      ]
    }}
  ],
  "additional_suggestions": [
    "Consider making a potluck style or buffet to reduce costs",
    "Look for discounts on streaming services or board games"
  ]
}}
"""
    result = None
    if client:
        try:
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt
            )
            result = extract_json_from_response(response.text)
        except Exception as e:
            print(f"Gemini Party warning: {e}")

    if not result:
        b = budget_input.total_budget
        is_home = (budget_input.venue_type or "").lower() == "home"
        venue_cost = 0.0 if is_home else b * 0.25
        cater_cost = b * 0.4 if budget_input.needs_catering else 0.0
        ent_cost = b * 0.35 if budget_input.needs_entertainment else 0.0
        rem = max(0.0, b - (venue_cost + cater_cost + ent_cost))

        result = {
            "total_budget": b,
            "allocated_budget": b - rem,
            "remaining_budget": rem,
            "venue_suggestions": [
                {
                    "name": "Home Venue" if is_home else f"{budget_input.venue_type} Banquet",
                    "type": budget_input.venue_type,
                    "capacity": max(10, budget_input.num_guests * 2),
                    "estimated_cost": venue_cost,
                    "search_terms": f"{budget_input.party_type} venue {budget_input.venue_type}"
                }
            ],
            "budget_breakdown": [
                {
                    "category": "Catering",
                    "allocation": cater_cost,
                    "items": [
                        {
                            "name": f"Gourmet Celebration Meal for {budget_input.num_guests} Guests",
                            "description": f"Curated catering platter for {budget_input.party_type}",
                            "estimated_price": cater_cost,
                            "quantity": 1,
                            "search_terms": "party catering feast platter"
                        }
                    ]
                },
                {
                    "category": "Entertainment",
                    "allocation": ent_cost,
                    "items": [
                        {
                            "name": "Music Streaming & Party Board Games",
                            "description": "Party ambience sound and social card games",
                            "estimated_price": ent_cost,
                            "quantity": 1,
                            "search_terms": "party board games music"
                        }
                    ]
                }
            ],
            "additional_suggestions": [
                "Consider ordering family meal combos via Swiggy or Zomato for discounts.",
                "Homemade decorations can be a cost-effective alternative.",
                "Look for party games and balloon decor on Amazon and Flipkart."
            ]
        }

    # Add venue shopping / booking links
    for venue in result.get("venue_suggestions", []):
        encoded = urllib.parse.quote_plus(venue.get("search_terms", venue.get("name", "")))
        venue["shopping_links"] = {
            "google": f"https://www.google.com/search?q={encoded}",
            "booking": f"https://www.booking.com/search.html?ss={encoded}",
            "makemytrip": f"https://www.makemytrip.com/hotels/hotel-listing/?searchText={encoded}",
            "oyorooms": f"https://www.oyorooms.com/search/?location={encoded}",
            "nobroker": f"https://www.nobroker.in/property/search/searchterm={encoded}"
        }

    # Add category shopping links
    for category in result.get("budget_breakdown", []):
        cat_name = category.get("category", "").lower()
        for item in category.get("items", []):
            st = item.get("search_terms", item.get("name", ""))
            encoded = urllib.parse.quote_plus(st)
            if "cater" in cat_name or "food" in cat_name:
                item["shopping_links"] = {
                    "swiggy": f"https://www.swiggy.com/search?query={encoded}",
                    "zomato": f"https://www.zomato.com/search?q={encoded}",
                    "bigbasket": f"https://www.bigbasket.com/ps/?q={encoded}",
                    "amazon": f"https://www.amazon.in/s?k={encoded}",
                    "flipkart": f"https://www.flipkart.com/search?q={encoded}"
                }
            elif "entertain" in cat_name or "music" in cat_name:
                item["shopping_links"] = {
                    "bookmyshow": f"https://in.bookmyshow.com/search?q={encoded}",
                    "amazon": f"https://www.amazon.in/s?k={encoded}",
                    "flipkart": f"https://www.flipkart.com/search?q={encoded}"
                }
            else:
                item["shopping_links"] = {
                    "amazon": f"https://www.amazon.in/s?k={encoded}",
                    "flipkart": f"https://www.flipkart.com/search?q={encoded}",
                    "meesho": f"https://www.meesho.com/search?q={encoded}"
                }

    return result

def get_jewelry_recommendations(budget_input: JewelryBudgetInput, image_path: Optional[str] = None) -> dict:
    """Generate jewelry recommendations with optional multimodal outfit image analysis."""
    base_prompt = f"""
I need jewelry recommendations for India with a total budget of ₹{budget_input.total_budget:.2f}.
Occasion: {budget_input.occasion}
Preferences: {budget_input.preferences or "Not specified"}
Provide only India-relevant styles, availability, and price ranges in INR.
"""

    format_instruction = f"""
Format the output as JSON:
{{
  "total_budget": {budget_input.total_budget:.2f},
  "remaining_budget": 800.0,
  "outfit_analysis": {{
    "colors": ["Blue", "White"],
    "style": "Casual Chic",
    "formality": "Informal"
  }},
  "jewelry_recommendations": [
    {{
      "item_type": "Bracelet",
      "description": "Simple braided leather bracelet with metal accents",
      "style": "Casual modern",
      "estimated_price": 500.0,
      "search_terms": "braided leather bracelet metal"
    }},
    {{
      "item_type": "Ring",
      "description": "Silver or dark grey metal band with minimalist design",
      "style": "Minimalist",
      "estimated_price": 700.0,
      "search_terms": "sterling silver minimalist ring"
    }},
    {{
      "item_type": "Watch",
      "description": "Classic simple analog dial watch with dark strap",
      "style": "Classic",
      "estimated_price": 3000.0,
      "search_terms": "classic minimalist watch"
    }}
  ],
  "styling_tips": [
    "Keep jewelry minimal to match the casual style of the outfit.",
    "Consider the watch as a statement piece.",
    "Ensure metal tones of ring and bracelet complement each other."
  ]
}}
"""

    result = None
    if client:
        try:
            if image_path and os.path.exists(image_path):
                img = Image.open(image_path)
                full_prompt = base_prompt + "\nAn image of the outfit is uploaded. Suggest jewelry that complements it considering color, design, and occasion appropriateness.\n" + format_instruction
                response = client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=[full_prompt, img]
                )
            else:
                response = client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=base_prompt + "\n" + format_instruction
                )
            result = extract_json_from_response(response.text)
        except Exception as e:
            print(f"Gemini Jewelry warning: {e}")

    if not result:
        b = budget_input.total_budget
        result = {
            "total_budget": b,
            "remaining_budget": b * 0.16,
            "outfit_analysis": {
                "colors": ["Blue", "White"] if image_path else ["Navy Blue", "Metallic Silver"],
                "style": "Modern Sophisticated",
                "formality": "Semi-Formal"
            },
            "jewelry_recommendations": [
                {
                    "item_type": "Bracelet",
                    "description": f"Braided leather or metal link bracelet tailored for {budget_input.occasion}",
                    "style": "Contemporary",
                    "estimated_price": b * 0.1,
                    "search_terms": "braided leather bracelet metal clasp"
                },
                {
                    "item_type": "Ring",
                    "description": "Polished sterling silver band with subtle brushed finish",
                    "style": "Minimalist Band",
                    "estimated_price": b * 0.14,
                    "search_terms": "sterling silver minimalist ring"
                },
                {
                    "item_type": "Watch / Necklace",
                    "description": "Classic slim dial analog watch with textured leather band",
                    "style": "Timeless",
                    "estimated_price": b * 0.6,
                    "search_terms": "slim analog watch genuine leather"
                }
            ],
            "styling_tips": [
                "Keep jewelry minimal to match the outfit silhouette without cluttering.",
                "Ensure metal finishes across ring and bracelet accents coordinate.",
                "Consider certified hallmarked pieces from trusted jewelers like Tanishq or CaratLane."
            ]
        }

    # Add jewelry shopping links
    for item in result.get("jewelry_recommendations", []):
        st = item.get("search_terms", item.get("item_type", ""))
        encoded = urllib.parse.quote_plus(st)
        item["shopping_links"] = {
            "amazon": f"https://www.amazon.in/s?k={encoded}",
            "flipkart": f"https://www.flipkart.com/search?q={encoded}",
            "bluestone": f"https://www.bluestone.com/search.html?query={encoded}",
            "tanishq": f"https://www.tanishq.co.in/search?q={encoded}",
            "caratlane": f"https://www.caratlane.com/search?q={encoded}",
            "melorra": f"https://www.melorra.com/search?q={encoded}",
            "meesho": f"https://www.meesho.com/search?q={encoded}"
        }

    return result
