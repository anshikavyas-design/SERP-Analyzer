// SERP Analyzer JavaScript
class SERPAnalyzer {
    constructor() {
        this.keyword = '';
        this.competitors = [];
        this.currentPosition = 1;
        this.analysisResults = null;
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Keyword form submission
        const keywordInput = document.getElementById('keyword-input');
        keywordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.setKeyword();
            }
        });

        // Competitor form submission
        const competitorForm = document.getElementById('competitor-form');
        competitorForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addCompetitor();
        });

        // Auto-focus on domain input when section becomes visible
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const competitorsSection = document.getElementById('competitors-section');
                    if (!competitorsSection.classList.contains('hidden')) {
                        setTimeout(() => {
                            document.getElementById('domain').focus();
                        }, 100);
                    }
                }
            });
        });
        
        observer.observe(document.getElementById('competitors-section'), {
            attributes: true,
            attributeFilter: ['class']
        });
    }

    setKeyword() {
        const keywordInput = document.getElementById('keyword-input');
        const keyword = keywordInput.value.trim();
        
        if (!keyword) {
            this.showAlert('Please enter a keyword', 'error');
            return;
        }

        this.keyword = keyword;
        
        // Show competitors section
        document.getElementById('keyword-section').style.opacity = '0.7';
        document.getElementById('competitors-section').classList.remove('hidden');
        
        // Smooth scroll to competitors section
        document.getElementById('competitors-section').scrollIntoView({ 
            behavior: 'smooth' 
        });
    }

    addCompetitor() {
        const domain = document.getElementById('domain').value.trim();
        const url = document.getElementById('url').value.trim();
        const title = document.getElementById('title').value.trim();
        const metaDescription = document.getElementById('meta-description').value.trim();

        if (!domain) {
            this.showAlert('Domain is required', 'error');
            return;
        }

        if (!url) {
            this.showAlert('URL is required', 'error');
            return;
        }

        // Validate URL format
        try {
            new URL(url);
        } catch {
            this.showAlert('Please enter a valid URL', 'error');
            return;
        }

        const competitor = {
            domain: domain,
            url: url,
            position: this.currentPosition,
            title: title,
            meta_description: metaDescription,
            title_length: title.length,
            meta_length: metaDescription.length
        };

        this.competitors.push(competitor);
        this.currentPosition++;

        // Update UI
        this.renderCompetitorsList();
        this.clearForm();
        this.updatePositionInput();
        
        // Show skip button and analysis actions after first competitor
        if (this.competitors.length >= 1) {
            document.getElementById('skip-btn').style.display = 'inline-flex';
            document.getElementById('analysis-actions').classList.remove('hidden');
        }

        // Auto-focus domain field for next entry
        document.getElementById('domain').focus();
        
        this.showAlert(`Competitor #${competitor.position} added successfully!`, 'success');
    }

    removeCompetitor(index) {
        this.competitors.splice(index, 1);
        
        // Recalculate positions
        this.competitors.forEach((comp, i) => {
            comp.position = i + 1;
        });
        
        this.currentPosition = this.competitors.length + 1;
        this.updatePositionInput();
        this.renderCompetitorsList();
        
        if (this.competitors.length === 0) {
            document.getElementById('skip-btn').style.display = 'none';
            document.getElementById('analysis-actions').classList.add('hidden');
        }
    }

    clearForm() {
        document.getElementById('domain').value = '';
        document.getElementById('url').value = '';
        document.getElementById('title').value = '';
        document.getElementById('meta-description').value = '';
    }

    updatePositionInput() {
        document.getElementById('position').value = this.currentPosition;
    }

    renderCompetitorsList() {
        const listContainer = document.getElementById('competitors-list');
        
        if (this.competitors.length === 0) {
            listContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-users"></i>
                    <p>No competitors added yet</p>
                </div>
            `;
            return;
        }

        listContainer.innerHTML = this.competitors.map((competitor, index) => `
            <div class="competitor-item">
                <div class="competitor-header">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <span class="position-badge">${competitor.position}</span>
                        <span class="competitor-domain">${competitor.domain}</span>
                    </div>
                    <button class="remove-btn" onclick="analyzer.removeCompetitor(${index})" title="Remove">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                ${competitor.title ? `<div class="competitor-title">${competitor.title}</div>` : ''}
                <a href="${competitor.url}" target="_blank" class="competitor-url">${competitor.url}</a>
            </div>
        `).join('');
    }

    skipToAnalysis() {
        if (this.competitors.length === 0) {
            this.showAlert('Please add at least one competitor first', 'error');
            return;
        }
        this.runAnalysis();
    }

    runAnalysis() {
        if (this.competitors.length === 0) {
            this.showAlert('Please add at least one competitor first', 'error');
            return;
        }

        // Show loading
        document.getElementById('loading-overlay').classList.remove('hidden');

        // Simulate analysis delay for better UX
        setTimeout(() => {
            this.performAnalysis();
            this.renderResults();
            
            // Hide loading and show results
            document.getElementById('loading-overlay').classList.add('hidden');
            document.getElementById('results-section').classList.remove('hidden');
            
            // Scroll to results
            document.getElementById('results-section').scrollIntoView({ 
                behavior: 'smooth' 
            });
        }, 1500);
    }

    performAnalysis() {
        const totalCompetitors = this.competitors.length;
        const positions = this.competitors.map(c => c.position);
        const titles = this.competitors.filter(c => c.title).map(c => c.title);
        const metaDescriptions = this.competitors.filter(c => c.meta_description).map(c => c.meta_description);
        
        // Calculate statistics
        const averagePosition = positions.reduce((a, b) => a + b, 0) / positions.length;
        const topPerformer = this.competitors.find(c => c.position === Math.min(...positions));
        
        const top3 = this.competitors.filter(c => c.position <= 3).length;
        const middle = this.competitors.filter(c => c.position >= 4 && c.position <= 6).length;
        const bottom = this.competitors.filter(c => c.position >= 7 && c.position <= 10).length;
        
        // Title analysis
        const titleLengths = titles.map(t => t.length);
        const avgTitleLength = titleLengths.length > 0 ? 
            titleLengths.reduce((a, b) => a + b, 0) / titleLengths.length : 0;
        const minTitleLength = titleLengths.length > 0 ? Math.min(...titleLengths) : 0;
        const maxTitleLength = titleLengths.length > 0 ? Math.max(...titleLengths) : 0;
        
        const keywordInTitles = titles.filter(t => 
            t.toLowerCase().includes(this.keyword.toLowerCase())
        ).length;
        
        // Meta description analysis
        const metaLengths = metaDescriptions.map(m => m.length);
        const avgMetaLength = metaLengths.length > 0 ? 
            metaLengths.reduce((a, b) => a + b, 0) / metaLengths.length : 0;
        const minMetaLength = metaLengths.length > 0 ? Math.min(...metaLengths) : 0;
        const maxMetaLength = metaLengths.length > 0 ? Math.max(...metaLengths) : 0;
        
        const keywordInMetas = metaDescriptions.filter(m => 
            m.toLowerCase().includes(this.keyword.toLowerCase())
        ).length;

        // Enhanced domain analysis with categorization
        const domains = this.competitors.map(c => c.domain);
        const uniqueDomains = [...new Set(domains)].length;
        const subdomains = domains.filter(d => d.split('.').length > 2).length;
        const wwwDomains = domains.filter(d => d.startsWith('www.')).length;
        const domainTypes = this.categorizeDomains(domains);
        
        // Gap analysis
        const rankingGaps = this.findRankingGaps(positions);
        const quickWins = this.identifyQuickWins();
        
        // Content patterns
        const titlePatterns = this.analyzeTitlePatterns(titles);
        const contentInsights = this.getContentInsights(titles, metaDescriptions);

        // Common words analysis
        const commonWords = this.getCommonWords(titles);

        this.analysisResults = {
            keyword: this.keyword,
            analysis_date: new Date().toLocaleString(),
            total_competitors: totalCompetitors,
            top_performer: topPerformer,
            top_3_domains: this.competitors
                .filter(c => c.position <= 3)
                .map(c => c.domain),
            average_position: averagePosition,
            position_distribution: {
                top_3: top3,
                positions_4_6: middle,
                positions_7_10: bottom
            },
            title_analysis: {
                average_length: avgTitleLength,
                min_length: minTitleLength,
                max_length: maxTitleLength,
                keyword_presence: `${keywordInTitles}/${titles.length} (${titles.length > 0 ? (keywordInTitles/titles.length*100).toFixed(1) : 0}%)`,
                common_words: commonWords,
                patterns: titlePatterns
            },
            meta_analysis: {
                average_length: avgMetaLength,
                min_length: minMetaLength,
                max_length: maxMetaLength,
                keyword_presence: `${keywordInMetas}/${metaDescriptions.length} (${metaDescriptions.length > 0 ? (keywordInMetas/metaDescriptions.length*100).toFixed(1) : 0}%)`
            },
            domain_analysis: {
                unique_domains: uniqueDomains,
                subdomains: subdomains,
                with_www: wwwDomains,
                types: domainTypes
            },
            gap_analysis: {
                ranking_gaps: rankingGaps,
                quick_wins: quickWins
            },
            content_insights: contentInsights,
            optimization_recommendations: this.generateRecommendations({
                titleAnalysis: { average_length: avgTitleLength, keyword_presence: keywordInTitles/titles.length },
                metaAnalysis: { average_length: avgMetaLength },
                positions: positions,
                titlePatterns: titlePatterns
            }),
            competitors: this.competitors.sort((a, b) => a.position - b.position)
        };
    }

    categorizeDomains(domains) {
        const types = {
            '.com': 0, '.org': 0, '.edu': 0, '.gov': 0, '.net': 0,
            '.co.uk': 0, '.io': 0, '.ai': 0, 'other': 0
        };
        
        domains.forEach(domain => {
            const cleanDomain = domain.replace('www.', '').toLowerCase();
            let categorized = false;
            
            Object.keys(types).forEach(tld => {
                if (tld !== 'other' && cleanDomain.endsWith(tld)) {
                    types[tld]++;
                    categorized = true;
                }
            });
            
            if (!categorized) {
                types['other']++;
            }
        });
        
        return Object.entries(types)
            .filter(([, count]) => count > 0)
            .sort(([, a], [, b]) => b - a);
    }
    
    findRankingGaps(positions) {
        const gaps = [];
        const sortedPositions = [...positions].sort((a, b) => a - b);
        
        for (let i = 0; i < sortedPositions.length - 1; i++) {
            const gap = sortedPositions[i + 1] - sortedPositions[i];
            if (gap > 1) {
                gaps.push({
                    start: sortedPositions[i],
                    end: sortedPositions[i + 1],
                    size: gap - 1,
                    opportunity: gap > 2 ? 'High' : 'Medium'
                });
            }
        }
        
        return gaps;
    }
    
    identifyQuickWins() {
        const wins = [];
        const sortedCompetitors = [...this.competitors].sort((a, b) => a.position - b.position);
        
        // Find competitors with weak titles (no keyword, too short/long)
        sortedCompetitors.forEach(comp => {
            const issues = [];
            
            if (comp.title && !comp.title.toLowerCase().includes(this.keyword.toLowerCase())) {
                issues.push('Missing target keyword in title');
            }
            
            if (comp.title && (comp.title.length < 30 || comp.title.length > 65)) {
                issues.push(`Title length (${comp.title.length}) not optimized`);
            }
            
            if (comp.meta_description && comp.meta_description.length < 120) {
                issues.push('Meta description too short');
            }
            
            if (issues.length > 0) {
                wins.push({
                    position: comp.position,
                    domain: comp.domain,
                    issues: issues,
                    opportunity: comp.position <= 5 ? 'High' : comp.position <= 8 ? 'Medium' : 'Low'
                });
            }
        });
        
        return wins.slice(0, 5); // Top 5 opportunities
    }
    
    analyzeTitlePatterns(titles) {
        if (titles.length === 0) return {};
        
        const patterns = {
            with_numbers: titles.filter(t => /\d/.test(t)).length,
            with_brackets: titles.filter(t => /[\[\(]/.test(t)).length,
            with_pipes: titles.filter(t => /\|/.test(t)).length,
            with_colons: titles.filter(t => /:/.test(t)).length,
            question_format: titles.filter(t => /\?/.test(t)).length,
            with_brand: titles.filter(t => /\|/.test(t) || /\-/.test(t)).length
        };
        
        return Object.entries(patterns)
            .filter(([, count]) => count > 0)
            .map(([pattern, count]) => ({ 
                pattern: pattern.replace(/_/g, ' '), 
                count, 
                percentage: ((count / titles.length) * 100).toFixed(1) 
            }));
    }
    
    getContentInsights(titles, metas) {
        const insights = [];
        
        // Keyword density in titles
        const keywordDensity = titles.length > 0 ? 
            (titles.filter(t => t.toLowerCase().includes(this.keyword.toLowerCase())).length / titles.length * 100).toFixed(1) : 0;
        
        insights.push({
            type: 'keyword_usage',
            title: 'Keyword Usage in Titles',
            value: `${keywordDensity}% of competitors use target keyword`,
            recommendation: keywordDensity < 70 ? 'Include target keyword in title for better relevance' : 'Good keyword usage among competitors'
        });
        
        // Title length insights
        if (titles.length > 0) {
            const avgLength = titles.reduce((sum, t) => sum + t.length, 0) / titles.length;
            insights.push({
                type: 'title_length',
                title: 'Title Length Optimization',
                value: `Average: ${avgLength.toFixed(0)} characters`,
                recommendation: avgLength < 50 ? 'Consider longer, more descriptive titles' : avgLength > 65 ? 'Shorter titles may improve CTR' : 'Title lengths are well optimized'
            });
        }
        
        return insights;
    }
    
    generateRecommendations(analysis) {
        const recommendations = [];
        
        // Title recommendations
        if (analysis.titleAnalysis.keyword_presence < 0.7) {
            recommendations.push({
                category: 'Title Optimization',
                priority: 'High',
                recommendation: 'Include your target keyword in the title - only ' + (analysis.titleAnalysis.keyword_presence * 100).toFixed(1) + '% of competitors do this',
                impact: 'High - Better relevance and click-through rates'
            });
        }
        
        if (analysis.titleAnalysis.average_length < 45) {
            recommendations.push({
                category: 'Title Length',
                priority: 'Medium',
                recommendation: 'Consider longer titles (50-60 characters) to include more descriptive keywords',
                impact: 'Medium - Better keyword coverage and user clarity'
            });
        } else if (analysis.titleAnalysis.average_length > 65) {
            recommendations.push({
                category: 'Title Length',
                priority: 'Medium', 
                recommendation: 'Shorten titles to under 60 characters to avoid truncation in search results',
                impact: 'Medium - Improved visibility and click-through rates'
            });
        }
        
        // Meta description recommendations
        if (analysis.metaAnalysis.average_length < 140) {
            recommendations.push({
                category: 'Meta Description',
                priority: 'Medium',
                recommendation: 'Write longer meta descriptions (150-160 characters) to maximize SERP real estate',
                impact: 'Medium - Better CTR through more compelling descriptions'
            });
        }
        
        // Position-based recommendations
        const gaps = this.analysisResults?.gap_analysis?.ranking_gaps || [];
        if (gaps.length > 0) {
            recommendations.push({
                category: 'Ranking Opportunities',
                priority: 'High',
                recommendation: `Target positions ${gaps[0].start + 1}-${gaps[0].end - 1} - weak competition detected`,
                impact: 'High - Quick ranking improvements possible'
            });
        }
        
        // Content pattern recommendations
        if (analysis.titlePatterns && analysis.titlePatterns.length > 0) {
            const topPattern = analysis.titlePatterns[0];
            if (topPattern.percentage > 40) {
                recommendations.push({
                    category: 'Content Pattern',
                    priority: 'Low',
                    recommendation: `Consider using ${topPattern.pattern} in titles - ${topPattern.percentage}% of competitors use this pattern`,
                    impact: 'Low - Alignment with successful competitor strategies'
                });
            }
        }
        
        return recommendations.slice(0, 6); // Top 6 recommendations
    }

    getCommonWords(texts, minLength = 3) {
        if (texts.length === 0) return [];
        
        const wordCount = {};
        const stopWords = new Set(['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'man', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'its', 'let', 'put', 'say', 'she', 'too', 'use']);
        
        texts.forEach(text => {
            const words = text.toLowerCase()
                .replace(/[^\w\s]/g, ' ')
                .split(/\s+/)
                .filter(word => word.length >= minLength && !stopWords.has(word));
            
            words.forEach(word => {
                wordCount[word] = (wordCount[word] || 0) + 1;
            });
        });
        
        return Object.entries(wordCount)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([word, count]) => `${word} (${count})`);
    }

    renderResults() {
        const container = document.getElementById('results-container');
        const results = this.analysisResults;
        
        container.innerHTML = `
            <!-- Overview Card -->
            <div class="result-card">
                <h3><i class="fas fa-chart-line"></i> Analysis Overview</h3>
                <div class="stats-grid">
                    <div class="stat-item">
                        <span class="stat-value">${results.total_competitors}</span>
                        <div class="stat-label">Total Competitors</div>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${results.top_performer ? results.top_performer.domain : 'N/A'}</span>
                        <div class="stat-label">Top Performer</div>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${results.average_position.toFixed(1)}</span>
                        <div class="stat-label">Average Position</div>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${results.domain_analysis.unique_domains}</span>
                        <div class="stat-label">Unique Domains</div>
                    </div>
                </div>
            </div>

            <!-- Top Domains -->
            <div class="result-card">
                <h3><i class="fas fa-crown"></i> Top 3 Ranking Domains</h3>
                <div class="top-domains">
                    ${results.top_3_domains.map((domain, index) => 
                        `<span class="domain-badge">#${index + 1} ${domain}</span>`
                    ).join('')}
                </div>
            </div>

            <!-- Position Distribution -->
            <div class="result-card">
                <h3><i class="fas fa-chart-pie"></i> Position Distribution</h3>
                <div class="stats-grid">
                    <div class="stat-item">
                        <span class="stat-value">${results.position_distribution.top_3}</span>
                        <div class="stat-label">Top 3 Positions</div>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${results.position_distribution.positions_4_6}</span>
                        <div class="stat-label">Positions 4-6</div>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${results.position_distribution.positions_7_10}</span>
                        <div class="stat-label">Positions 7-10</div>
                    </div>
                </div>
            </div>

            <!-- Domain Types Analysis -->
            <div class="result-card">
                <h3><i class="fas fa-globe"></i> Domain Analysis</h3>
                <div class="domain-types">
                    ${results.domain_analysis.types.map(([type, count]) => 
                        `<div class="domain-type-item">
                            <span class="domain-type">${type}</span>
                            <span class="domain-count">${count} domain${count > 1 ? 's' : ''}</span>
                        </div>`
                    ).join('')}
                </div>
                ${results.domain_analysis.subdomains > 0 ? 
                    `<p class="domain-insight"><i class="fas fa-info-circle"></i> ${results.domain_analysis.subdomains} competitors use subdomains</p>` : ''}
            </div>

            <!-- Title Analysis -->
            ${results.title_analysis.average_length > 0 ? `
            <div class="result-card">
                <h3><i class="fas fa-heading"></i> Title Analysis</h3>
                <div class="stats-grid">
                    <div class="stat-item">
                        <span class="stat-value">${results.title_analysis.average_length.toFixed(1)}</span>
                        <div class="stat-label">Average Length</div>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${results.title_analysis.min_length}-${results.title_analysis.max_length}</span>
                        <div class="stat-label">Length Range</div>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${results.title_analysis.keyword_presence}</span>
                        <div class="stat-label">Keyword in Title</div>
                    </div>
                </div>
                ${results.title_analysis.common_words.length > 0 ? `
                    <p><strong>Common Words:</strong> ${results.title_analysis.common_words.join(', ')}</p>
                ` : ''}
            </div>
            ` : ''}

            <!-- Meta Analysis -->
            ${results.meta_analysis.average_length > 0 ? `
            <div class="result-card">
                <h3><i class="fas fa-align-left"></i> Meta Description Analysis</h3>
                <div class="stats-grid">
                    <div class="stat-item">
                        <span class="stat-value">${results.meta_analysis.average_length.toFixed(1)}</span>
                        <div class="stat-label">Average Length</div>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${results.meta_analysis.keyword_presence}</span>
                        <div class="stat-label">Keyword in Meta</div>
                    </div>
                </div>
            </div>
            ` : ''}

            <!-- Gap Analysis & Quick Wins -->
            ${results.gap_analysis.ranking_gaps.length > 0 || results.gap_analysis.quick_wins.length > 0 ? `
            <div class="result-card">
                <h3><i class="fas fa-target"></i> Gap Analysis & Quick Wins</h3>
                
                ${results.gap_analysis.ranking_gaps.length > 0 ? `
                <div class="gaps-section">
                    <h4><i class="fas fa-chart-line"></i> Ranking Opportunities</h4>
                    ${results.gap_analysis.ranking_gaps.map(gap => 
                        `<div class="gap-item ${gap.opportunity.toLowerCase()}">
                            <span class="gap-positions">Positions ${gap.start + 1}-${gap.end - 1}</span>
                            <span class="gap-size">${gap.size} open position${gap.size > 1 ? 's' : ''}</span>
                            <span class="gap-opportunity">${gap.opportunity} Opportunity</span>
                        </div>`
                    ).join('')}
                </div>
                ` : ''}
                
                ${results.gap_analysis.quick_wins.length > 0 ? `
                <div class="quick-wins-section">
                    <h4><i class="fas fa-bolt"></i> Quick Win Opportunities</h4>
                    ${results.gap_analysis.quick_wins.slice(0, 3).map(win => 
                        `<div class="quick-win-item">
                            <div class="win-header">
                                <span class="win-position">#${win.position}</span>
                                <span class="win-domain">${win.domain}</span>
                                <span class="win-opportunity ${win.opportunity.toLowerCase()}">${win.opportunity}</span>
                            </div>
                            <ul class="win-issues">
                                ${win.issues.map(issue => `<li>${issue}</li>`).join('')}
                            </ul>
                        </div>`
                    ).join('')}
                </div>
                ` : ''}
            </div>
            ` : ''}

            <!-- Optimization Recommendations -->
            ${results.optimization_recommendations.length > 0 ? `
            <div class="result-card recommendations-card">
                <h3><i class="fas fa-lightbulb"></i> Optimization Recommendations</h3>
                <div class="recommendations-list">
                    ${results.optimization_recommendations.map(rec => 
                        `<div class="recommendation-item ${rec.priority.toLowerCase()}">
                            <div class="rec-header">
                                <span class="rec-category">${rec.category}</span>
                                <span class="rec-priority priority-${rec.priority.toLowerCase()}">${rec.priority} Priority</span>
                            </div>
                            <p class="rec-text">${rec.recommendation}</p>
                            <p class="rec-impact"><strong>Impact:</strong> ${rec.impact}</p>
                        </div>`
                    ).join('')}
                </div>
            </div>
            ` : ''}

            <!-- Content Insights -->
            ${results.content_insights.length > 0 ? `
            <div class="result-card">
                <h3><i class="fas fa-eye"></i> Content Insights</h3>
                <div class="insights-list">
                    ${results.content_insights.map(insight => 
                        `<div class="insight-item">
                            <h4>${insight.title}</h4>
                            <p class="insight-value">${insight.value}</p>
                            <p class="insight-rec">${insight.recommendation}</p>
                        </div>`
                    ).join('')}
                </div>
            </div>
            ` : ''}

            <!-- Title Patterns -->
            ${results.title_analysis.patterns && results.title_analysis.patterns.length > 0 ? `
            <div class="result-card">
                <h3><i class="fas fa-pattern"></i> Title Patterns</h3>
                <div class="patterns-grid">
                    ${results.title_analysis.patterns.map(pattern => 
                        `<div class="pattern-item">
                            <span class="pattern-name">${pattern.pattern}</span>
                            <span class="pattern-usage">${pattern.count}/${results.total_competitors} (${pattern.percentage}%)</span>
                        </div>`
                    ).join('')}
                </div>
            </div>
            ` : ''}

            <!-- Competitors Table -->
            <div class="result-card">
                <h3><i class="fas fa-table"></i> Competitor Details</h3>
                <table class="competitors-table">
                    <thead>
                        <tr>
                            <th>Pos</th>
                            <th>Domain</th>
                            <th>Title</th>
                            <th>Title Length</th>
                            <th>Meta Length</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${results.competitors.map(comp => `
                            <tr>
                                <td class="position-cell">${comp.position}</td>
                                <td><strong>${comp.domain}</strong></td>
                                <td>${comp.title || '<em>No title provided</em>'}</td>
                                <td>${comp.title_length}</td>
                                <td>${comp.meta_length}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    exportToJSON() {
        if (!this.analysisResults) {
            this.showAlert('Please run analysis first', 'error');
            return;
        }

        const dataStr = JSON.stringify(this.analysisResults, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `serp_analysis_${this.keyword.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        this.showAlert('JSON file downloaded successfully!', 'success');
    }

    exportToCSV() {
        if (!this.analysisResults) {
            this.showAlert('Please run analysis first', 'error');
            return;
        }

        const headers = ['Position', 'Domain', 'URL', 'Title', 'Meta Description', 'Title Length', 'Meta Length'];
        const csvData = [
            headers.join(','),
            ...this.analysisResults.competitors.map(comp => [
                comp.position,
                `"${comp.domain}"`,
                `"${comp.url}"`,
                `"${(comp.title || '').replace(/"/g, '""')}"`,
                `"${(comp.meta_description || '').replace(/"/g, '""')}"`,
                comp.title_length,
                comp.meta_length
            ].join(','))
        ].join('\n');

        const dataBlob = new Blob([csvData], {type: 'text/csv'});
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `serp_competitors_${this.keyword.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        
        URL.revokeObjectURL(url);
        this.showAlert('CSV file downloaded successfully!', 'success');
    }

    showAlert(message, type = 'info') {
        // Create alert element
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 1001;
            max-width: 300px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        // Set background color based on type
        const colors = {
            success: '#48bb78',
            error: '#f56565',
            info: '#4299e1'
        };
        alert.style.backgroundColor = colors[type] || colors.info;

        alert.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(alert);

        // Animate in
        setTimeout(() => {
            alert.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 4 seconds
        setTimeout(() => {
            alert.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(alert);
            }, 300);
        }, 4000);
    }
}

// Global functions for HTML onclick handlers
function setKeyword() {
    analyzer.setKeyword();
}

function skipToAnalysis() {
    analyzer.skipToAnalysis();
}

function runAnalysis() {
    analyzer.runAnalysis();
}

function exportToJSON() {
    analyzer.exportToJSON();
}

function exportToCSV() {
    analyzer.exportToCSV();
}

// Initialize the analyzer when the page loads
let analyzer;
document.addEventListener('DOMContentLoaded', () => {
    analyzer = new SERPAnalyzer();
});