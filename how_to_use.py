#!/usr/bin/env python3
"""
How to Use the SERP Analyzer Tool
Step-by-step guide for analyzing your competitors
"""

from serp_analyzer import SERPAnalyzer

def demo_your_analysis():
    """
    Demo: How to analyze YOUR competitors
    
    STEP 1: Search for your target keyword on Google
    STEP 2: Copy the top 10 results from the first page
    STEP 3: Use this template to analyze them
    """
    
    # Replace with your actual keyword
    YOUR_KEYWORD = "digital marketing services"
    
    print(f"🎯 Analyzing competitors for: '{YOUR_KEYWORD}'")
    print("=" * 50)
    
    # Create your analyzer
    analyzer = SERPAnalyzer(YOUR_KEYWORD)
    
    # STEP 3: Add your actual competitors here
    # Template for each competitor:
    """
    analyzer.add_competitor(
        domain="competitor-domain.com",           # Just the domain name
        url="https://full-url-here.com/page",    # Complete URL
        position=1,                              # Their ranking position (1-10)
        title="Their Page Title Here",           # Copy from SERP
        meta_description="Their meta desc...",   # Copy from SERP  
        snippet="Search result snippet..."       # Copy from SERP
    )
    """
    
    # Example competitors (replace with your real data):
    sample_competitors = [
        {
            'domain': 'hubspot.com',
            'position': 1,
            'title': 'Digital Marketing Services | HubSpot',
            'meta_description': 'Grow your business with HubSpot\'s digital marketing services including SEO, content marketing, and social media management.',
            'url': 'https://www.hubspot.com/digital-marketing-services'
        },
        {
            'domain': 'webfx.com', 
            'position': 2,
            'title': 'Digital Marketing Services - WebFX',
            'meta_description': 'Drive more revenue with our award-winning digital marketing services. Get SEO, PPC, social media marketing & more.',
            'url': 'https://www.webfx.com/digital-marketing-services/'
        },
        {
            'domain': 'lyfemarketing.com',
            'position': 3, 
            'title': 'Digital Marketing Services | Social Media & PPC Management',
            'meta_description': 'Professional digital marketing services including social media marketing, PPC management, and SEO to grow your business online.',
            'url': 'https://www.lyfemarketing.com/digital-marketing-services/'
        }
    ]
    
    # Add competitors to analyzer
    for comp in sample_competitors:
        analyzer.add_competitor(
            comp['domain'],
            comp['url'],
            comp['position'], 
            comp['title'],
            comp['meta_description'],
            ""  # snippet optional
        )
    
    print("📊 ANALYSIS RESULTS:")
    print("=" * 50)
    
    # Get the analysis
    analyzer.print_summary()
    
    # Export for further analysis
    json_file = analyzer.export_to_json()
    csv_file = analyzer.export_to_csv()
    
    print(f"\n💾 Files exported:")
    print(f"   📄 {json_file}")  
    print(f"   📊 {csv_file}")
    
    print(f"\n💡 KEY INSIGHTS TO LOOK FOR:")
    print("   • What title patterns do top rankers use?")
    print("   • How long are their titles and meta descriptions?") 
    print("   • Which domains dominate your keyword?")
    print("   • Do they include your keyword in titles?")
    print("   • What common words appear across competitors?")
    
    return analyzer

def step_by_step_guide():
    """Print step-by-step usage instructions"""
    
    print("🚀 HOW TO USE THIS TOOL FOR YOUR KEYWORD ANALYSIS")
    print("=" * 60)
    print()
    print("STEP 1: Choose Your Target Keyword")
    print("   • Pick a keyword you want to rank for")
    print("   • Examples: 'best CRM software', 'digital marketing agency'")
    print()
    print("STEP 2: Search on Google") 
    print("   • Go to Google.com")
    print("   • Search for your target keyword")
    print("   • Look at the first page results (positions 1-10)")
    print()
    print("STEP 3: Collect Competitor Data")
    print("   • For each result, copy:")
    print("     - Domain name (e.g., hubspot.com)")
    print("     - Full URL")
    print("     - Position (1, 2, 3, etc.)")
    print("     - Page title (blue clickable text)")
    print("     - Meta description (gray text below title)")
    print()
    print("STEP 4: Use the Tool")
    print("   • Run: python serp_analyzer.py")
    print("   • OR modify how_to_use.py with your data")
    print("   • OR use example_usage.py as a template")
    print()
    print("STEP 5: Analyze Results")
    print("   • Review the summary report")
    print("   • Check title/meta patterns of top rankers")
    print("   • Identify content opportunities")
    print("   • Export data for further analysis")
    print()
    print("🎯 WHAT YOU'LL DISCOVER:")
    print("   ✅ Who your real competitors are")
    print("   ✅ What title strategies work")
    print("   ✅ Optimal title/meta description lengths")
    print("   ✅ Content patterns that rank well")
    print("   ✅ Market domination insights")

if __name__ == "__main__":
    step_by_step_guide()
    print("\n" + "=" * 60)
    print("RUNNING DEMO ANALYSIS...")
    print("=" * 60)
    demo_your_analysis()