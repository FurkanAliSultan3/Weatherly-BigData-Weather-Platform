import random
from datetime import datetime, timedelta
from typing import List, Dict

# Simulated Authoritative Data (IMD/Satellite)
# In a real app, this would be an API call to IMD or a Satellite Data Provider
SIMULATED_IMD_DATA = [
    {"city": "Mumbai", "lat": 19.076, "lng": 72.877, "condition": "Rain", "severity": "High"},
    {"city": "Delhi", "lat": 28.613, "lng": 77.209, "condition": "Heatwave", "severity": "Medium"},
    {"city": "Chennai", "lat": 13.082, "lng": 80.270, "condition": "Storm", "severity": "High"},
    {"city": "Kolkata", "lat": 22.572, "lng": 88.363, "condition": "Rain", "severity": "Low"},
]

def calculate_trust_score(report_type: str, lat: float, lng: float, user_trust_level: float = 0.5) -> float:
    """
    The Trust Brain: Calculates a score from 0.0 to 1.0
    Logic:
    1. Cross-reference with IMD data (Location + Condition)
    2. Factor in User Trust Level
    3. Time decay (though simplified here)
    """
    score = 0.0

    # 1. Check proximity to authoritative data
    # We check if any IMD report is within ~100km of the user report
    for imd in SIMULATED_IMD_DATA:
        distance = ((lat - imd["lat"])**2 + (lng - imd["lng"])**2)**0.5
        # Rough distance check: 1 degree is approx 111km
        if distance < 1.0:
            if report_type.lower() == imd["condition"].lower():
                score += 0.6  # High match
            else:
                score -= 0.2  # Contradictory data

    # 2. Factor in user trust (simulation)
    score += (user_trust_level * 0.4)

    return max(0.0, min(1.0, score))

def get_status_from_score(score: float) -> str:
    if score >= 0.8: return "verified"
    if score >= 0.5: return "likely_genuine"
    if score >= 0.3: return "unverified"
    return "flagged"
