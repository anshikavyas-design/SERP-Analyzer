# SERP Competitor Analysis Tool

A Python tool to analyze top competitors ranking on the first page of search engine results (SERP) for any keyword or topic.

## Features

- **Competitor Data Input**: Easily add competitor information from SERP results
- **Ranking Analysis**: Analyze position distribution, domain patterns, and competitive landscape
- **Content Analysis**: Examine title lengths, meta descriptions, and keyword usage patterns
- **Export Options**: Export results to JSON or CSV formats
- **Interactive Mode**: User-friendly command-line interface
- **Programmatic API**: Use as a Python library in your own scripts

## Quick Start

### Interactive Mode
```bash
python serp_analyzer.py
```

### Programmatic Usage
```python
from serp_analyzer import SERPAnalyzer

# Create analyzer
analyzer = SERPAnalyzer("your keyword here")

# Add competitors
analyzer.add_competitor(
    domain="example.com",
    url="https://example.com/page",
    position=1,
    title="Page Title",
    meta_description="Meta description",
    snippet="Search result snippet"
)

# Analyze and export
analyzer.print_summary()
analyzer.export_to_json()
analyzer.export_to_csv()
```

## Analysis Features

### Ranking Metrics
- Position distribution (top 3, positions 4-6, positions 7-10)
- Average ranking position
- Top 3 ranking domains

### Content Analysis
- Title length analysis (average, min, max)
- Meta description patterns
- Keyword presence in titles and descriptions
- Common words across competitor content

### Domain Analysis
- Subdomain usage patterns
- www prefix usage
- Unique domain count

## Output Formats

### JSON Export
Complete analysis data including:
- Competitor details
- Statistical analysis
- Content patterns
- Domain insights

### CSV Export
Tabular competitor data for spreadsheet analysis

### Console Summary
Formatted report with key insights and top competitors

## Example Output

```
SERP ANALYSIS REPORT
============================================================
Keyword: best laptops 2024
Analysis Date: 2024-08-04 10:30:15
Total Competitors: 5

TOP 3 RANKING DOMAINS:
  1. techradar.com
  2. pcmag.com
  3. laptopmag.com

POSITION DISTRIBUTION:
  Top 3 positions: 3
  Positions 4-6: 2
  Positions 7-10: 0

TITLE ANALYSIS:
  Average length: 45.2 characters
  Length range: 28-58
  Keyword in title: 5/5 (100.0%)
  Common words: best (5), laptops (5), 2024 (4)
```

## Requirements

- Python 3.6+
- No external dependencies (uses only standard library)

## Use Cases

- **SEO Research**: Analyze competitor strategies for target keywords
- **Content Planning**: Understand title and description patterns that rank well
- **Market Analysis**: Identify dominant players in your niche
- **SERP Monitoring**: Track changes in competitor rankings over time
- **Content Optimization**: Learn from successful competitor content patterns

## Files

- `serp_analyzer.py` - Main analysis tool
- `example_usage.py` - Programmatic usage examples
- `README_SERP_ANALYZER.md` - This documentation

Run the example to see the tool in action:
```bash
python example_usage.py
```