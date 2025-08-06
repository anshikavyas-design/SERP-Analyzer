#!/usr/bin/env python3
"""
Simple Demo: How to Use the SERP Analyzer Tool
"""

from serp_analyzer import SERPAnalyzer

def main():
    print("HOW TO USE THIS TOOL FOR YOUR KEYWORD ANALYSIS")
    print("=" * 55)
    print()
    print("STEP 1: Choose Your Target Keyword")
    print("   Example: 'best CRM software', 'digital marketing agency'")
    print()
    print("STEP 2: Search on Google and collect top 10 results")
    print("   - Domain name, URL, position, title, meta description")
    print()
    print("STEP 3: Use this tool to analyze patterns")
    print()
    print("DEMO ANALYSIS:")
    print("=" * 30)
    
    # Demo with sample data
    analyzer = SERPAnalyzer("digital marketing services")
    
    # Add sample competitors
    analyzer.add_competitor(
        domain="hubspot.com",
        url="https://www.hubspot.com/digital-marketing-services", 
        position=1,
        title="Digital Marketing Services | HubSpot",
        meta_description="Grow your business with HubSpot's digital marketing services including SEO, content marketing, and social media management."
    )
    
    analyzer.add_competitor(
        domain="webfx.com",
        url="https://www.webfx.com/digital-marketing-services/",
        position=2, 
        title="Digital Marketing Services - WebFX",
        meta_description="Drive more revenue with our award-winning digital marketing services. Get SEO, PPC, social media marketing & more."
    )
    
    analyzer.add_competitor(
        domain="lyfemarketing.com",
        url="https://www.lyfemarketing.com/digital-marketing-services/",
        position=3,
        title="Digital Marketing Services | Social Media & PPC Management", 
        meta_description="Professional digital marketing services including social media marketing, PPC management, and SEO to grow your business online."
    )
    
    # Show analysis
    analyzer.print_summary()
    
    # Export files
    json_file = analyzer.export_to_json()
    csv_file = analyzer.export_to_csv()
    
    print(f"\nFiles exported:")
    print(f"- {json_file}")
    print(f"- {csv_file}")
    
    print("\nKEY INSIGHTS TO LOOK FOR:")
    print("- What title patterns do top rankers use?")
    print("- How long are their titles and meta descriptions?")
    print("- Which domains dominate your keyword?") 
    print("- Do they include your keyword in titles?")
    print("- What common words appear across competitors?")
    
    print("\nNEXT STEPS:")
    print("1. Replace the sample data above with YOUR competitors")
    print("2. Run the analysis on your target keyword")
    print("3. Use insights to optimize your own content")

if __name__ == "__main__":
    main()