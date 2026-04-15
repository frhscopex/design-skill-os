import colorsys

# ==============================================================================
# DESIGN SKILL OS - ACCESSIBILITY ENGINE
# ==============================================================================
# Implements WCAG 2.1 algorithms for contrast and legibility.
# ==============================================================================

class AccessibilityEngine:
    @staticmethod
    def hex_to_rgb(hex_color):
        hex_color = hex_color.lstrip('#')
        return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

    @staticmethod
    def get_luminance(rgb):
        """Calculates relative luminance for a color."""
        # Standard WCAG luminance formula
        res = []
        for v in rgb:
            v /= 255
            if v <= 0.03928:
                res.append(v / 12.92)
            else:
                res.append(((v + 0.055) / 1.055) ** 2.4)
        return 0.2126 * res[0] + 0.7152 * res[1] + 0.0722 * res[2]

    @staticmethod
    def get_contrast_ratio(hex1, hex2):
        """Calculates the contrast ratio between two hex colors."""
        lum1 = AccessibilityEngine.get_luminance(AccessibilityEngine.hex_to_rgb(hex1))
        lum2 = AccessibilityEngine.get_luminance(AccessibilityEngine.hex_to_rgb(hex2))
        
        brightest = max(lum1, lum2)
        darkest = min(lum1, lum2)
        
        return (brightest + 0.05) / (darkest + 0.05)

    @staticmethod
    def check_wcag(hex1, hex2):
        ratio = AccessibilityEngine.get_contrast_ratio(hex1, hex2)
        return {
            "ratio": round(ratio, 2),
            "AA": ratio >= 4.5,
            "AA_Large": ratio >= 3.0,
            "AAA": ratio >= 7.0
        }

if __name__ == "__main__":
    # Internal test
    engine = AccessibilityEngine()
    test = engine.check_wcag("#FFFFFF", "#000000") # Black on White
    print(f"Test Contrast Ratio (B&W): {test['ratio']}")
