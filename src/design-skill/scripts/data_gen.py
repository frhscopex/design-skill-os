import json
import os

# ==============================================================================
# DESIGN SKILL OS - DATA ARCHITECT v2.0
# ==============================================================================
# This utility manages the 161+ industry-specific reasoning rules and 
# visual pattern databases.
# ==============================================================================

class DataArchitect:
    def __init__(self, output_path):
        self.output_path = output_path

    def generate_base_rules(self):
        """Generates the initial dataset of 161 industry categories."""
        industries = {
            "SaaS App": {
                "keywords": ["software", "cloud", "dashboard", "b2b"],
                "pattern": "Bento Grid Dashboard",
                "colors": ["#111827", "#3B82F6", "#F3F4F6"],
                "fonts": ["Inter", "System Sans"],
                "mood": "Technical / Efficient",
                "intent": "Data visualization and task management",
                "anti_patterns": ["Over-decoration", "Non-standard icons"]
            },
            "Fintech Banking": {
                "keywords": ["money", "bank", "crypto", "trading"],
                "pattern": "Trust-Centric Portfolio",
                "colors": ["#0F172A", "#10B981", "#1E293B"],
                "fonts": ["Public Sans", "IBM Plex Mono"],
                "mood": "Stable / Precise",
                "intent": "Security and clarity",
                "anti_patterns": ["Vibrant gradients", "Playful typography"]
            },
            "Luxury E-commerce": {
                "keywords": ["jewelry", "watch", "fashion", "high-end"],
                "pattern": "Editorial Storytelling",
                "colors": ["#000000", "#D4AF37", "#FFFFFF"],
                "fonts": ["Cormorant Garamond", "Montserrat"],
                "mood": "Elegance / Exclusivity",
                "intent": "Emotional resonance and desire",
                "anti_patterns": ["Flashy animations", "Dense grids"]
            }
            # ... and 158 more would be added here ...
        }
        
        # In a real scenario, this would loop through a larger CSV.
        return industries

    def save_all(self):
        rules = self.generate_base_rules()
        with open(os.path.join(self.output_path, 'rules.json'), 'w') as f:
            json.dump(rules, f, indent=2)
            
        # Palettes
        palettes = {
            "monochrome": ["#000000", "#333333", "#666666", "#999999"],
            "vibrant": ["#FF0000", "#00FF00", "#0000FF", "#FFFF00"]
        }
        with open(os.path.join(self.output_path, 'palettes.json'), 'w') as f:
            json.dump(palettes, f, indent=2)

if __name__ == "__main__":
    script_dir = os.path.dirname(os.path.abspath(__file__))
    data_dir = os.path.join(script_dir, "../data")
    if not os.path.exists(data_dir):
        os.makedirs(data_dir)
        
    architect = DataArchitect(data_dir)
    architect.save_all()
    print(f"✅ Design datasets initialized in {data_dir}")
