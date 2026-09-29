"""
Automated Test Script for PocketSmart AI Backend
Run: python test_api.py
"""

import sys
import os

# Add local path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from models import HomeBudgetInput, PartyBudgetInput, JewelryBudgetInput
from gemini_utils import (
    get_home_recommendations,
    get_party_recommendations,
    get_jewelry_recommendations,
    usd_to_inr
)

def test_currency_conversion():
    print("Testing USD to INR conversion...")
    inr = usd_to_inr(100.0, 83.0)
    assert inr == 8300.0, f"Expected 8300.0, got {inr}"
    print("✓ Currency conversion test passed: $100 -> ₹8,300")

def test_home_planner():
    print("\nTesting Scenario 1: Home Interior Planner...")
    home_input = HomeBudgetInput(
        total_budget=5000.0,
        num_lights=5,
        num_fans=4,
        num_furniture=2,
        num_dining_tables=1,
        has_living_room=True,
        has_kitchen=True,
        has_bedroom=False
    )
    result = get_home_recommendations(home_input)
    assert "budget_breakdown" in result, "Missing budget_breakdown in result"
    assert "remaining_budget" in result, "Missing remaining_budget"
    assert len(result["budget_breakdown"]) > 0, "Empty budget breakdown"
    first_item = result["budget_breakdown"][0]["items"][0]
    assert "shopping_links" in first_item, "Missing shopping_links"
    assert "amazon" in first_item["shopping_links"], "Missing amazon link"
    print(f"✓ Home Planner test passed! Generated {len(result['budget_breakdown'])} categories with shopping links.")

def test_party_planner():
    print("\nTesting Scenario 2: Party Budget Planner...")
    party_input = PartyBudgetInput(
        total_budget=5000.0,
        num_guests=3,
        party_type="Wedding",
        venue_type="Home",
        needs_catering=True,
        needs_decoration=True,
        needs_entertainment=True
    )
    result = get_party_recommendations(party_input)
    assert "venue_suggestions" in result or "budget_breakdown" in result
    print(f"✓ Party Planner test passed! Total budget ₹{result.get('total_budget')}, remaining ₹{result.get('remaining_budget')}.")

def test_jewelry_planner():
    print("\nTesting Scenario 3: Jewelry Budget Planner...")
    jewelry_input = JewelryBudgetInput(
        total_budget=5000.0,
        occasion="Birthday",
        preferences="Casual minimalist with metal accents"
    )
    result = get_jewelry_recommendations(jewelry_input)
    assert "jewelry_recommendations" in result, "Missing jewelry_recommendations"
    assert len(result["jewelry_recommendations"]) > 0, "No jewelry pieces recommended"
    first_jewelry = result["jewelry_recommendations"][0]
    assert "shopping_links" in first_jewelry, "Missing shopping_links"
    assert "tanishq" in first_jewelry["shopping_links"] or "amazon" in first_jewelry["shopping_links"]
    print(f"✓ Jewelry Planner test passed! Recommended: {[j['item_type'] for j in result['jewelry_recommendations']]}")

if __name__ == "__main__":
    print("========================================")
    print("PocketSmart AI: Test Suite Execution")
    print("========================================")
    try:
        test_currency_conversion()
        test_home_planner()
        test_party_planner()
        test_jewelry_planner()
        print("\n========================================")
        print("ALL TESTS PASSED SUCCESSFULLY! (4/4)")
        print("========================================")
    except Exception as e:
        print(f"\n❌ Test failed with error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
