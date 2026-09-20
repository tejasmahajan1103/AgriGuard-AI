// ============================================================
// AgriGuard AI — Mock AI/Chat Responses
// TODO: Replace with Amazon Bedrock integration
// ============================================================

const mockResponses: Record<string, string> = {
  'why are my tomato leaves turning yellow?': `Yellowing tomato leaves can be caused by several factors:

**1. Nitrogen Deficiency** — The most common cause. Lower leaves yellow first while upper leaves remain green. Apply a balanced fertilizer with higher nitrogen content.

**2. Overwatering** — Waterlogged soil prevents roots from absorbing nutrients. Ensure proper drainage and let soil dry slightly between waterings.

**3. Underwatering** — Drought stress can also cause yellowing. Maintain consistent watering schedule, especially during fruiting.

**4. Early Blight** — A fungal disease causing yellow spots with concentric rings. Remove affected leaves and apply fungicide.

**5. Magnesium Deficiency** — Yellowing between leaf veins on older leaves. Apply Epsom salt (magnesium sulfate) as a foliar spray.

**Recommendation:** Inspect the pattern of yellowing and check your watering schedule first. If the issue persists, I recommend scanning the affected leaves with our Crop Scan feature for a more detailed AI analysis.`,

  'how often should i irrigate my crop?': `Irrigation frequency depends on several factors:

**Crop Type:**
- **Rice** — Requires standing water; irrigate to maintain 2-5 cm water level
- **Wheat** — 4-6 irrigations during the growing season at critical stages
- **Tomato** — Deep watering 2-3 times per week
- **Cotton** — Every 7-10 days depending on growth stage

**Soil Type:**
- Sandy soil: More frequent, smaller amounts
- Clay soil: Less frequent, deeper watering
- Loamy soil: Moderate frequency

**General Tips:**
1. Water early morning to reduce evaporation
2. Use drip irrigation for 30-40% water savings
3. Check soil moisture at 6-inch depth before irrigating
4. Reduce frequency during rainy seasons
5. Increase frequency during flowering and fruiting stages

**Current Weather Note:** With the partly cloudy conditions and rain expected, you may want to delay your next irrigation cycle.`,

  'what are common tomato pests?': `Here are the most common tomato pests and how to manage them:

**1. Aphids** 🐛
- Tiny green or black insects on undersides of leaves
- Cause curling leaves and transmit viruses
- **Treatment:** Neem oil spray, introduce ladybugs

**2. Tomato Hornworm** 🐛
- Large green caterpillar with white stripes
- Can defoliate a plant quickly
- **Treatment:** Hand-pick, use Bt (Bacillus thuringiensis)

**3. Whiteflies** 🪰
- Small white flying insects under leaves
- Cause yellowing and sticky honeydew
- **Treatment:** Yellow sticky traps, insecticidal soap

**4. Spider Mites** 🕷️
- Tiny red/brown dots, fine webbing on leaves
- Thrive in hot, dry conditions
- **Treatment:** Increase humidity, miticide spray

**5. Fruit Worm** 🐛
- Bore into fruits causing rot
- **Treatment:** Bt spray, crop rotation

**Prevention Tips:**
- Rotate crops annually
- Remove plant debris after harvest
- Use companion planting (basil deters many pests)
- Monitor regularly using our Crop Scan feature`,

  'how can i improve soil health?': `Improving soil health is fundamental to better crop yields. Here's a comprehensive approach:

**1. Soil Testing** 🔬
- Test pH, nutrients, and organic matter annually
- Optimal pH for most crops: 6.0-7.0
- Identify specific deficiencies before amending

**2. Add Organic Matter** 🌱
- Compost: 2-4 inches annually
- Green manure: Plant cover crops (clover, vetch)
- Crop residues: Incorporate after harvest

**3. Practice Crop Rotation** 🔄
- Rotate between different crop families each season
- Include nitrogen-fixing legumes in rotation
- Prevents soil-borne disease buildup

**4. Minimize Tillage** 🚜
- Reduces soil structure damage
- Preserves beneficial microorganisms
- Consider no-till or reduced tillage methods

**5. Use Cover Crops** 🌿
- Prevent erosion during off-season
- Add nitrogen (legumes) or organic matter
- Improve water infiltration

**6. Mulching** 🍂
- Conserves moisture and regulates temperature
- Suppresses weeds naturally
- Adds organic matter as it decomposes

**Quick Win:** Start by getting a soil test done and adding 3 inches of quality compost. You'll see improvement within one growing season!`,
};

const defaultResponse = `That's a great question! Based on agricultural best practices, here are some general recommendations:

1. **Regular Monitoring** — Inspect your crops at least twice a week for any signs of stress, disease, or pest activity.

2. **Soil Health** — Maintain proper soil pH and nutrient levels through regular testing and balanced fertilization.

3. **Water Management** — Ensure consistent and appropriate irrigation based on your crop type and weather conditions.

4. **Integrated Pest Management** — Use a combination of cultural, biological, and chemical controls for pest management.

5. **Record Keeping** — Keep detailed records of all farming activities, observations, and interventions.

For more specific advice, try using our **Crop Scan** feature to get AI-powered analysis of your crops, or ask me a more specific question about your situation. I'm here to help! 🌾`;

/**
 * Get a mock AI response for a given user message.
 * TODO: Replace with Amazon Bedrock API call
 */
export function getMockAIResponse(userMessage: string): Promise<string> {
  return new Promise((resolve) => {
    // Simulate API latency
    const delay = 1000 + Math.random() * 2000;
    setTimeout(() => {
      const lowerMessage = userMessage.toLowerCase().trim();
      // Check for matching response
      for (const [key, response] of Object.entries(mockResponses)) {
        if (lowerMessage.includes(key) || key.includes(lowerMessage)) {
          resolve(response);
          return;
        }
      }
      // Check for partial keyword matches
      if (lowerMessage.includes('yellow') || lowerMessage.includes('leaf') || lowerMessage.includes('leaves')) {
        resolve(mockResponses['why are my tomato leaves turning yellow?']);
        return;
      }
      if (lowerMessage.includes('water') || lowerMessage.includes('irrigat')) {
        resolve(mockResponses['how often should i irrigate my crop?']);
        return;
      }
      if (lowerMessage.includes('pest') || lowerMessage.includes('insect') || lowerMessage.includes('bug')) {
        resolve(mockResponses['what are common tomato pests?']);
        return;
      }
      if (lowerMessage.includes('soil') || lowerMessage.includes('fertiliz') || lowerMessage.includes('compost')) {
        resolve(mockResponses['how can i improve soil health?']);
        return;
      }
      resolve(defaultResponse);
    }, delay);
  });
}

/**
 * Get mock scan analysis result
 * TODO: Replace with Amazon Bedrock + Rekognition API call
 */
export function getMockScanResult(): Promise<{
  disease: string;
  confidence: number;
  severity: 'Low' | 'Moderate' | 'High' | 'Severe';
  description: string;
  recommendations: string[];
  isHealthy: boolean;
}> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        disease: 'Early Blight',
        confidence: 87,
        severity: 'Moderate',
        description: 'Early blight is a common disease caused by the fungus Alternaria solani. It typically appears as dark, concentric rings on lower leaves and can spread to stems and fruit.',
        recommendations: [
          'Remove affected leaves immediately to prevent spread',
          'Apply copper-based fungicide as directed',
          'Ensure proper spacing between plants for airflow',
          'Avoid overhead watering — use drip irrigation',
          'Monitor adjacent crops for signs of spread',
          'Consider crop rotation for next season',
        ],
        isHealthy: false,
      });
    }, 2500);
  });
}
