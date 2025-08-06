#!/usr/bin/env python3
"""
Example usage of the SERP Analyzer tool
This demonstrates how to use the tool programmatically
"""

from serp_analyzer import SERPAnalyzer

def example_analysis():
    """Example analysis with sample SERP data"""
    
    # Create analyzer for a sample keyword
    analyzer = SERPAnalyzer("best laptops 2024")
    
    # Add sample competitors (as if scraped from Google's first page)
    sample_competitors = [
        {
            'domain': 'techradar.com',
            'url': 'https://www.techradar.com/best/laptops',
            'position': 1,
            'title': 'Best laptops 2024: Top picks for every need and budget',
            'meta_description': 'Our experts have tested hundreds of laptops to find the best options for work, gaming, and creative tasks in 2024.',
            'snippet': 'Find the perfect laptop with our comprehensive guide to the best laptops of 2024...'
        },
        {
            'domain': 'pcmag.com',
            'url': 'https://www.pcmag.com/picks/the-best-laptops',
            'position': 2,
            'title': 'The Best Laptops for 2024 | PCMag',
            'meta_description': 'Shopping for a laptop? We test and review hundreds of laptops each year to help you find the best laptop for your needs.',
            'snippet': 'Whether you need a laptop for work, school, or gaming, we have recommendations...'
        },
        {
            'domain': 'laptopmag.com',
            'url': 'https://www.laptopmag.com/articles/best-laptops',
            'position': 3,
            'title': 'Best Laptops 2024: Top Rated Laptops | Laptop Mag',
            'meta_description': 'Looking for the best laptop? Our laptop buying guide features the top laptops we\'ve tested, from budget to premium.',
            'snippet': 'Our laptop experts have tested and reviewed the latest laptops to help you choose...'
        },
        {
            'domain': 'tomsguide.com',
            'url': 'https://www.tomsguide.com/best-picks/best-laptops',
            'position': 4,
            'title': 'Best laptops in 2024: tested and reviewed | Tom\'s Guide',
            'meta_description': 'We\'ve tested the best laptops of 2024 to help you find the perfect portable computer for work, play and everything in between.',
            'snippet': 'The best laptops combine performance, portability, and value...'
        },
        {
            'domain': 'cnet.com',
            'url': 'https://www.cnet.com/tech/computing/best-laptop/',
            'position': 5,
            'title': 'Best Laptop of 2024 - CNET',
            'meta_description': 'Find the best laptop for your needs with CNET\'s expert reviews and recommendations for 2024.',
            'snippet': 'CNET\'s laptop experts have tested and reviewed the latest models...'
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
            comp['snippet']
        )
    
    # Run analysis and display results
    print("Running example SERP analysis...")
    analyzer.print_summary()
    
    # Export results
    json_file = analyzer.export_to_json("example_analysis.json")
    csv_file = analyzer.export_to_csv("example_competitors.csv")
    
    print(f"\nFiles exported:")
    print(f"- {json_file}")
    print(f"- {csv_file}")
    
    return analyzer

if __name__ == "__main__":
    example_analysis()