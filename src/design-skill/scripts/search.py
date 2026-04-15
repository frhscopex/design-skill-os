import argparse
import json
import os
import sys
import re
from collections import Counter
import math

# ==============================================================================
# DESIGN SKILL OS - ADVANCED REASONING ENGINE v2.0
# ==============================================================================
# This engine handles the "Cognitive Brain" logic, applying principles from 
# 10+ Design Bibles to generate industry-specific design systems.
# ==============================================================================

class DesignScorer:
    """Implements a simplified BM25-style ranking for matching products to industries."""
    @staticmethod
    def score(query, doc):
        query_terms = set(re.findall(r'\w+', query.lower()))
        doc_terms = re.findall(r'\w+', doc.lower())
        term_counts = Counter(doc_terms)
        
        score = 0
        for term in query_terms:
            if term in term_counts:
                # Basic frequency scoring with saturation
                score += (term_counts[term] * 1.5) / (term_counts[term] + 1.0)
        return score

class DesignLogicEngine:
    def __init__(self, data_path):
        self.data_path = data_path
        self.rules = self._load_rules()
        self.palettes = self._load_json('palettes.json')
        self.typography = self._load_json('typography.json')

    def _load_json(self, filename):
        path = os.path.join(self.data_path, filename)
        if os.path.exists(path):
            with open(path, 'r') as f:
                return json.load(f)
        return {}

    def _load_rules(self):
        return self._load_json('rules.json')

    def find_best_industry(self, query):
        """Matches a user query to one of the 161 industry categories."""
        best_match = None
        max_score = -1
        
        for industry, data in self.rules.items():
            content = f"{industry} {' '.join(data.get('keywords', []))} {data.get('description', '')}"
            score = DesignScorer.score(query, content)
            if score > max_score:
                max_score = score
                best_match = industry
        
        return best_match if max_score > 0 else "General SaaS"

    def apply_red_team_filters(self, context, recommendation):
        """Applies Section 23 adversarial checks to the recommendation."""
        filters = []
        
        # Anti-Schtick: Identify trends to avoid
        if "banking" in context or "finance" in context:
            filters.append("⚠️ RED TEAM: Avoid AI-Native Purple/Pink gradients. Priority: Trust/Stability.")
            recommendation['colors'] = ["#0F172A", "#334155", "#38BDF8"] # Deep Slate / Steel Blue
        
        if "healthcare" in context:
            filters.append("⚠️ RED TEAM: Extreme contrast check required for accessibility (WCAG AAA).")
            recommendation['typography_notes'] = "High-legibility sans-serif only. Modular scale 1.25."

        recommendation['audit_logs'] = filters
        return recommendation

    def generate_system(self, query):
        """Generates a comprehensive design system recommendation."""
        industry_key = self.find_best_industry(query)
        industry_data = self.rules.get(industry_key, self.rules.get("General SaaS", {}))
        
        recommendation = {
            "meta": {
                "industry": industry_key,
                "confidence_score": "High",
                "derived_from": "Design Skill OS v2.0"
            },
            "visual_hierarchy": {
                "pattern": industry_data.get("pattern", "Hero-Centric"),
                "principles": ["Gestalt Proximity", "F-Pattern Scanning"]
            },
            "branding": {
                "colors": industry_data.get("colors", ["#000000", "#FFFFFF"]),
                "typography": industry_data.get("fonts", ["Inter", "System Sans"]),
                "mood": industry_data.get("mood", "Professional / Modern")
            },
            "strategic_intent": industry_data.get("intent", "Conversion via clarity"),
            "anti_patterns": industry_data.get("anti_patterns", ["Browser defaults", "Lazy alignment"])
        }
        
        # Apply adversarial logic
        return self.apply_red_team_filters(query.lower(), recommendation)

def main():
    parser = argparse.ArgumentParser(description="Design Skill OS - Logic & Reasoning Engine")
    parser.add_argument("query", help="What are you building?")
    parser.add_argument("--json", action="store_true", help="Output raw JSON")
    parser.add_argument("--persist", action="store_true", help="Save to design-system/MASTER.md")
    
    args = parser.parse_args()
    
    script_dir = os.path.dirname(os.path.abspath(__file__))
    data_dir = os.path.join(script_dir, "../data")
    
    engine = DesignLogicEngine(data_dir)
    sys_rec = engine.generate_system(args.query)
    
    if args.json:
        print(json.dumps(sys_rec, indent=2))
    else:
        # High-fidelity ASCII formatting
        print("\n" + "="*80)
        print(f" DESIGN SYSTEM REASONING: {args.query.upper()}")
        print("="*80)
        print(f" MATCHED INDUSTRY : {sys_rec['meta']['industry']}")
        print(f" STRATEGIC INTENT  : {sys_rec['strategic_intent']}")
        print("-" * 80)
        print(f" PITCH | MOOD      : {sys_rec['branding']['mood']}")
        print(f" COLORS            : {' | '.join(sys_rec['branding']['colors'])}")
        print(f" TYPOGRAPHY        : {' / '.join(sys_rec['branding']['typography'])}")
        print(f" PATTERN           : {sys_rec['visual_hierarchy']['pattern']}")
        print("-" * 80)
        print(" RED TEAM AUDIT LOG:")
        for log in sys_rec['audit_logs']:
            print(f"  {log}")
        print("="*80 + "\n")

if __name__ == "__main__":
    main()
