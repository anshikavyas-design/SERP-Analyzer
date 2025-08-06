#!/usr/bin/env python3
"""
SERP Competitor Analysis Tool
Analyzes top competitors ranking on the first page of search results for a given keyword/topic.
"""

import json
import csv
from typing import List, Dict, Any
from datetime import datetime
import statistics


class SERPAnalyzer:
    def __init__(self, keyword: str):
        self.keyword = keyword
        self.competitors = []
        self.analysis_date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    def add_competitor(self, domain: str, url: str, position: int, title: str = "", 
                      meta_description: str = "", snippet: str = ""):
        """Add a competitor from SERP results"""
        competitor = {
            'domain': domain,
            'url': url,
            'position': position,
            'title': title,
            'meta_description': meta_description,
            'snippet': snippet,
            'title_length': len(title),
            'meta_length': len(meta_description),
            'snippet_length': len(snippet)
        }
        self.competitors.append(competitor)
    
    def analyze_rankings(self) -> Dict[str, Any]:
        """Analyze competitor rankings and return insights"""
        if not self.competitors:
            return {"error": "No competitors added"}
        
        analysis = {
            'keyword': self.keyword,
            'analysis_date': self.analysis_date,
            'total_competitors': len(self.competitors),
            'top_3_domains': [c['domain'] for c in sorted(self.competitors, key=lambda x: x['position'])[:3]],
            'average_position': statistics.mean([c['position'] for c in self.competitors]),
            'position_distribution': self._get_position_distribution(),
            'title_analysis': self._analyze_titles(),
            'meta_analysis': self._analyze_meta_descriptions(),
            'domain_analysis': self._analyze_domains(),
            'competitors': sorted(self.competitors, key=lambda x: x['position'])
        }
        
        return analysis
    
    def _get_position_distribution(self) -> Dict[str, int]:
        """Get distribution of positions (top 3, 4-6, 7-10)"""
        top_3 = sum(1 for c in self.competitors if c['position'] <= 3)
        middle = sum(1 for c in self.competitors if 4 <= c['position'] <= 6)
        bottom = sum(1 for c in self.competitors if 7 <= c['position'] <= 10)
        
        return {
            'top_3': top_3,
            'positions_4_6': middle,
            'positions_7_10': bottom
        }
    
    def _analyze_titles(self) -> Dict[str, Any]:
        """Analyze title patterns and characteristics"""
        titles = [c['title'] for c in self.competitors if c['title']]
        if not titles:
            return {"error": "No titles to analyze"}
        
        title_lengths = [len(t) for t in titles]
        keyword_in_title = sum(1 for t in titles if self.keyword.lower() in t.lower())
        
        return {
            'average_length': statistics.mean(title_lengths),
            'min_length': min(title_lengths),
            'max_length': max(title_lengths),
            'keyword_presence': f"{keyword_in_title}/{len(titles)} ({(keyword_in_title/len(titles)*100):.1f}%)",
            'common_words': self._get_common_words([t.lower() for t in titles])
        }
    
    def _analyze_meta_descriptions(self) -> Dict[str, Any]:
        """Analyze meta description patterns"""
        metas = [c['meta_description'] for c in self.competitors if c['meta_description']]
        if not metas:
            return {"error": "No meta descriptions to analyze"}
        
        meta_lengths = [len(m) for m in metas]
        keyword_in_meta = sum(1 for m in metas if self.keyword.lower() in m.lower())
        
        return {
            'average_length': statistics.mean(meta_lengths),
            'min_length': min(meta_lengths),
            'max_length': max(meta_lengths),
            'keyword_presence': f"{keyword_in_meta}/{len(metas)} ({(keyword_in_meta/len(metas)*100):.1f}%)"
        }
    
    def _analyze_domains(self) -> Dict[str, Any]:
        """Analyze domain characteristics"""
        domains = [c['domain'] for c in self.competitors]
        domain_types = {
            'subdomains': sum(1 for d in domains if d.count('.') > 1),
            'with_www': sum(1 for d in domains if d.startswith('www.')),
            'unique_domains': len(set(domains))
        }
        
        return domain_types
    
    def _get_common_words(self, texts: List[str], min_length: int = 3) -> List[str]:
        """Get most common words from text list"""
        from collections import Counter
        import re
        
        all_words = []
        for text in texts:
            words = re.findall(r'\b[a-zA-Z]{' + str(min_length) + ',}\b', text)
            all_words.extend([w.lower() for w in words])
        
        common = Counter(all_words).most_common(5)
        return [f"{word} ({count})" for word, count in common]
    
    def export_to_json(self, filename: str = None) -> str:
        """Export analysis to JSON file"""
        if not filename:
            filename = f"serp_analysis_{self.keyword.replace(' ', '_')}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        
        analysis = self.analyze_rankings()
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(analysis, f, indent=2, ensure_ascii=False)
        
        return filename
    
    def export_to_csv(self, filename: str = None) -> str:
        """Export competitor data to CSV file"""
        if not filename:
            filename = f"serp_competitors_{self.keyword.replace(' ', '_')}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
        
        with open(filename, 'w', newline='', encoding='utf-8') as f:
            if not self.competitors:
                return filename
            
            writer = csv.DictWriter(f, fieldnames=self.competitors[0].keys())
            writer.writeheader()
            writer.writerows(sorted(self.competitors, key=lambda x: x['position']))
        
        return filename
    
    def print_summary(self):
        """Print a formatted summary of the analysis"""
        analysis = self.analyze_rankings()
        
        print(f"\n{'='*60}")
        print(f"SERP ANALYSIS REPORT")
        print(f"{'='*60}")
        print(f"Keyword: {analysis['keyword']}")
        print(f"Analysis Date: {analysis['analysis_date']}")
        print(f"Total Competitors: {analysis['total_competitors']}")
        
        print(f"\nTOP 3 RANKING DOMAINS:")
        for i, domain in enumerate(analysis['top_3_domains'], 1):
            print(f"  {i}. {domain}")
        
        print(f"\nPOSITION DISTRIBUTION:")
        dist = analysis['position_distribution']
        print(f"  Top 3 positions: {dist['top_3']}")
        print(f"  Positions 4-6: {dist['positions_4_6']}")
        print(f"  Positions 7-10: {dist['positions_7_10']}")
        
        if 'error' not in analysis['title_analysis']:
            title_analysis = analysis['title_analysis']
            print(f"\nTITLE ANALYSIS:")
            print(f"  Average length: {title_analysis['average_length']:.1f} characters")
            print(f"  Length range: {title_analysis['min_length']}-{title_analysis['max_length']}")
            print(f"  Keyword in title: {title_analysis['keyword_presence']}")
            print(f"  Common words: {', '.join(title_analysis['common_words'][:3])}")
        
        print(f"\nCOMPETITOR DETAILS:")
        for comp in analysis['competitors'][:10]:
            print(f"  {comp['position']}. {comp['domain']}")
            if comp['title']:
                print(f"     Title: {comp['title'][:80]}{'...' if len(comp['title']) > 80 else ''}")
            print()


def main():
    """Interactive mode for SERP analysis"""
    print("SERP Competitor Analysis Tool")
    print("=" * 40)
    
    keyword = input("Enter your target keyword/topic: ").strip()
    if not keyword:
        print("Keyword is required!")
        return
    
    analyzer = SERPAnalyzer(keyword)
    
    print(f"\nAnalyzing competitors for: '{keyword}'")
    print("Enter competitor data (press Enter with empty domain to finish):")
    
    position = 1
    while True:
        print(f"\nCompetitor #{position}:")
        domain = input("Domain (e.g., example.com): ").strip()
        if not domain:
            break
        
        url = input("Full URL: ").strip()
        title = input("Title (optional): ").strip()
        meta_desc = input("Meta description (optional): ").strip()
        snippet = input("Snippet (optional): ").strip()
        
        analyzer.add_competitor(domain, url, position, title, meta_desc, snippet)
        position += 1
    
    if not analyzer.competitors:
        print("No competitors added. Exiting.")
        return
    
    # Show analysis
    analyzer.print_summary()
    
    # Ask for export
    export_choice = input("\nExport results? (j)son, (c)sv, (b)oth, (n)o: ").lower()
    if export_choice in ['j', 'json', 'b', 'both']:
        json_file = analyzer.export_to_json()
        print(f"JSON exported to: {json_file}")
    
    if export_choice in ['c', 'csv', 'b', 'both']:
        csv_file = analyzer.export_to_csv()
        print(f"CSV exported to: {csv_file}")


if __name__ == "__main__":
    main()