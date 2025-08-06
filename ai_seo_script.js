// AI SEO Competitive Analyzer JavaScript
class AISEOAnalyzer {
    constructor() {
        this.keyword = 'web development team';
        this.competitors = [
            'https://eluminoustechnologies.com/blog/build-web-development-team-guide/',
            'https://www.uptech.team/blog/web-development-team',
            ''
        ];
        this.googleDocUrl = '';
        this.includeOwnContent = false;
        this.analyzing = false;
        this.currentStep = '';
        this.analysisResults = null;
        
        this.initializeEventListeners();
        this.initializeForm();
    }

    initializeEventListeners() {
        // Include own content checkbox
        const includeOwnCheckbox = document.getElementById('include-own-content');
        includeOwnCheckbox.addEventListener('change', (e) => {
            this.includeOwnContent = e.target.checked;
            const googleDocSection = document.getElementById('google-doc-section');
            if (this.includeOwnContent) {
                googleDocSection.classList.remove('hidden');
            } else {
                googleDocSection.classList.add('hidden');
            }
        });

        // Add competitor button
        const addCompetitorBtn = document.getElementById('add-competitor-btn');
        addCompetitorBtn.addEventListener('click', () => this.addCompetitor());

        // Analyze button
        const analyzeBtn = document.getElementById('analyze-btn');
        analyzeBtn.addEventListener('click', () => this.analyzeCompetitors());

        // Download report button
        const downloadBtn = document.getElementById('download-report-btn');
        downloadBtn.addEventListener('click', () => this.downloadReport());

        // Initial competitor input event listener
        this.attachCompetitorListeners();
    }

    initializeForm() {
        // Set initial keyword value
        document.getElementById('keyword-input').value = this.keyword;
        
        // Set up initial competitor inputs
        const container = document.getElementById('competitors-container');
        container.innerHTML = ''; // Clear existing
        
        this.competitors.forEach((url, index) => {
            const competitorDiv = document.createElement('div');
            competitorDiv.className = 'competitor-input-group flex gap-3';
            if (index > 0) {
                competitorDiv.style.marginTop = '12px';
            }
            
            competitorDiv.innerHTML = `
                <input
                    type="url"
                    placeholder="https://competitor-url.com"
                    value="${url}"
                    class="competitor-url flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                />
                <button
                    type="button"
                    class="remove-competitor w-10 h-10 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ${this.competitors.length <= 1 ? 'hidden' : ''}"
                >
                    <i class="fas fa-times text-sm"></i>
                </button>
            `;
            
            container.appendChild(competitorDiv);
        });
        
        this.attachCompetitorListeners();
    }

    attachCompetitorListeners() {
        const competitorInputs = document.querySelectorAll('.competitor-url');
        competitorInputs.forEach((input, index) => {
            // Remove existing listeners
            input.replaceWith(input.cloneNode(true));
        });
        
        // Re-get elements after cloning
        const newCompetitorInputs = document.querySelectorAll('.competitor-url');
        newCompetitorInputs.forEach((input, index) => {
            input.addEventListener('input', (e) => {
                this.competitors[index] = e.target.value;
            });
        });

        const removeButtons = document.querySelectorAll('.remove-competitor');
        removeButtons.forEach((btn) => {
            btn.replaceWith(btn.cloneNode(true));
        });
        
        // Re-get buttons after cloning
        const newRemoveButtons = document.querySelectorAll('.remove-competitor');
        newRemoveButtons.forEach((btn, index) => {
            btn.addEventListener('click', () => this.removeCompetitor(index));
        });
    }

    addCompetitor() {
        this.competitors.push('');
        const container = document.getElementById('competitors-container');
        const index = this.competitors.length - 1;
        
        const competitorDiv = document.createElement('div');
        competitorDiv.className = 'competitor-input-group flex gap-3';
        competitorDiv.innerHTML = `
            <input
                type="url"
                placeholder="https://competitor-url.com"
                class="competitor-url flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
            />
            <button
                type="button"
                class="remove-competitor w-10 h-10 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
                <i class="fas fa-times text-sm"></i>
            </button>
        `;
        
        container.appendChild(competitorDiv);
        this.updateRemoveButtons();
        this.attachCompetitorListeners();
    }

    removeCompetitor(index) {
        if (this.competitors.length <= 1) return;
        
        this.competitors.splice(index, 1);
        const container = document.getElementById('competitors-container');
        const competitorGroups = container.querySelectorAll('.competitor-input-group');
        
        if (competitorGroups[index]) {
            competitorGroups[index].remove();
        }
        
        // Rebuild the competitor inputs to maintain proper indexing
        this.rebuildCompetitorInputs();
    }
    
    rebuildCompetitorInputs() {
        const container = document.getElementById('competitors-container');
        container.innerHTML = '';
        
        this.competitors.forEach((url, index) => {
            const competitorDiv = document.createElement('div');
            competitorDiv.className = 'competitor-input-group flex gap-3';
            if (index > 0) {
                competitorDiv.style.marginTop = '12px';
            }
            
            competitorDiv.innerHTML = `
                <input
                    type="url"
                    placeholder="https://competitor-url.com"
                    value="${url}"
                    class="competitor-url flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                />
                <button
                    type="button"
                    class="remove-competitor w-10 h-10 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ${this.competitors.length <= 1 ? 'hidden' : ''}"
                >
                    <i class="fas fa-times text-sm"></i>
                </button>
            `;
            
            container.appendChild(competitorDiv);
        });
        
        this.attachCompetitorListeners();
    }

    updateRemoveButtons() {
        const removeButtons = document.querySelectorAll('.remove-competitor');
        const container = document.getElementById('competitors-container');
        const inputGroups = container.querySelectorAll('.competitor-input-group');
        
        // Add spacing between input groups
        inputGroups.forEach((group, index) => {
            if (index > 0) {
                group.style.marginTop = '12px';
            }
        });
        
        removeButtons.forEach(btn => {
            if (this.competitors.length > 1) {
                btn.classList.remove('hidden');
            } else {
                btn.classList.add('hidden');
            }
        });
    }

    showError(message) {
        const errorDiv = document.getElementById('error-message');
        const errorText = document.getElementById('error-text');
        errorText.textContent = message;
        errorDiv.classList.remove('hidden');
        errorDiv.classList.add('flex');
    }

    hideError() {
        const errorDiv = document.getElementById('error-message');
        errorDiv.classList.add('hidden');
        errorDiv.classList.remove('flex');
    }

    updateProgress(step, percentage = 0) {
        const progressSection = document.getElementById('progress-section');
        const progressText = document.getElementById('progress-text');
        const progressBar = document.getElementById('progress-bar');
        
        if (this.analyzing) {
            progressSection.classList.remove('hidden');
            progressText.textContent = step;
            progressBar.style.width = `${percentage}%`;
        } else {
            progressSection.classList.add('hidden');
        }
    }

    showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toast-container');
        const toast = document.createElement('div');
        
        const bgColor = type === 'success' ? 'bg-green-500' : 
                       type === 'error' ? 'bg-red-500' : 'bg-blue-500';
        
        toast.className = `${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 max-w-sm`;
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        toastContainer.appendChild(toast);
        
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toastContainer.removeChild(toast), 300);
        }, 4000);
    }

    // Simulated AI Analysis Functions (In a real implementation, these would call actual AI APIs)
    async simulateGoogleDocAnalysis(docUrl) {
        // Simulate Google Doc content analysis
        return {
            documentUrl: docUrl,
            contentAnalysis: {
                wordCount: Math.floor(Math.random() * 3000) + 1000,
                mainTopics: ["project management", "team collaboration", "productivity tools"],
                contentStructure: "Well-organized with clear headings and subheadings",
                headingStructure: "H1 (1), H2 (5), H3 (12)"
            },
            seoAnalysis: {
                keywordDensity: "Target keyword appears 2.3% of the time",
                semanticTerms: ["workflow optimization", "task management", "team efficiency"],
                contentDepth: "comprehensive",
                intentAlignment: "Strong alignment with informational search intent"
            },
            contentQuality: {
                readability: "Grade 8 reading level - excellent for web content",
                comprehensiveness: "Covers topic thoroughly with practical examples",
                uniqueValue: "Provides actionable tips and real-world case studies"
            },
            strengths: [
                "Clear structure and organization",
                "Practical examples and case studies",
                "Good use of headings and formatting"
            ],
            improvementAreas: [
                "Could benefit from more internal linking",
                "Add more visual elements",
                "Include FAQ section for common questions"
            ]
        };
    }

    async simulateCompetitorAnalysis(url, keyword, index, total) {
        // Simulate competitor URL analysis
        this.updateProgress(`Analyzing competitor ${index + 1} of ${total}: ${url}`, (index / total) * 80);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
        
        return {
            url: url,
            contentAnalysis: {
                wordCount: Math.floor(Math.random() * 4000) + 1500,
                topics: ["software reviews", "feature comparisons", "pricing analysis"],
                contentDepth: Math.random() > 0.5 ? "comprehensive" : "moderate",
                structure: {
                    headingStructure: `H1 (1), H2 (${Math.floor(Math.random() * 8) + 3}), H3 (${Math.floor(Math.random() * 15) + 8})`,
                    contentOrganization: "Logical flow from introduction to detailed analysis"
                }
            },
            semanticAnalysis: {
                primaryKeywordUsage: "Keyword used naturally throughout content",
                semanticTerms: ["software solution", "business tool", "team management"],
                nlpKeywords: ["efficiency", "automation", "integration", "scalability"],
                keywordContext: "Keywords used in context of problem-solving"
            },
            intentAlignment: {
                searchIntentMatch: Math.random() > 0.5 ? "excellent" : "good",
                painPointsAddressed: ["time management", "team communication", "project tracking"],
                userValueProposition: "Helps users choose the right tool for their needs"
            },
            technicalFactors: {
                readability: `Grade ${Math.floor(Math.random() * 4) + 6} reading level`,
                contentFreshness: Math.random() > 0.5 ? "recently updated" : "6+ months old",
                multimediaUsage: "Screenshots, comparison tables, video demos"
            },
            strengths: [
                "Comprehensive feature comparison",
                "Clear pricing information",
                "Real user testimonials"
            ],
            weaknesses: [
                "Could improve loading speed",
                "Missing FAQ section",
                "Limited mobile optimization"
            ]
        };
    }

    async simulateComprehensiveAnalysis(keyword, competitorData, ownContentData = null) {
        this.updateProgress('Generating competitive insights and recommendations...', 90);
        
        // Simulate final analysis generation
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const analysis = {
            executiveSummary: `The competitive landscape for "${keyword}" shows moderate to high competition with ${competitorData.length} analyzed competitors. ${ownContentData ? 'Your content shows strong potential but requires optimization in key areas.' : 'Most competitors focus on feature comparisons and pricing, with opportunities for deeper technical analysis and user experience insights.'}`,
            
            competitorComparison: {
                contentLengthAnalysis: `Competitor content ranges from 1,500 to 4,500 words, with an average of ${Math.floor(competitorData.reduce((sum, comp) => sum + comp.contentAnalysis.wordCount, 0) / competitorData.length)} words. Longer content tends to rank higher.`,
                topicCoverageComparison: "Most competitors cover basic features and pricing, but few dive deep into implementation strategies and long-term ROI analysis.",
                semanticOptimizationLevels: "Competitors show varying levels of semantic SEO, with opportunities to better target related keywords and user intent variations."
            },
            
            contentGaps: [
                {
                    gapType: "Implementation Guidance",
                    description: "Most competitors focus on features but lack detailed implementation guides",
                    opportunity: "Create comprehensive setup and onboarding content",
                    priority: "high"
                },
                {
                    gapType: "ROI Analysis",
                    description: "Limited content about measuring return on investment",
                    opportunity: "Develop calculators and ROI measurement guides",
                    priority: "medium"
                },
                {
                    gapType: "Industry-Specific Use Cases",
                    description: "Generic advice without industry-specific applications",
                    opportunity: "Create targeted content for specific industries",
                    priority: "high"
                }
            ],
            
            semanticOpportunities: [
                {
                    opportunity: "Target long-tail variations of main keyword",
                    implementation: "Create content around 'best [keyword] for small business', 'enterprise [keyword] solutions'",
                    impact: "Capture more specific search intents with less competition"
                },
                {
                    opportunity: "Optimize for voice search queries",
                    implementation: "Include natural language questions and conversational content",
                    impact: "Better positioning for voice search and featured snippets"
                }
            ],
            
            intentOptimization: {
                currentIntentAlignment: "Competitors adequately serve comparison intent but miss deeper informational needs",
                improvementAreas: [
                    "Add how-to guides and tutorials",
                    "Include troubleshooting sections",
                    "Provide implementation checklists"
                ],
                userExperienceGaps: [
                    "Better mobile navigation",
                    "Faster loading times",
                    "More interactive elements"
                ]
            },
            
            outRankingStrategy: {
                contentRecommendations: [
                    {
                        strategy: "Create comprehensive buyer's guide with decision framework",
                        rationale: "Users need structured approach to evaluation, competitors lack this",
                        implementation: "Develop step-by-step evaluation criteria with scoring system"
                    },
                    {
                        strategy: "Add interactive comparison tools",
                        rationale: "Static comparisons dominate; interactive tools provide better UX",
                        implementation: "Build feature comparison calculator with filtering options"
                    }
                ],
                technicalRecommendations: [
                    "Optimize for Core Web Vitals",
                    "Implement schema markup for comparisons",
                    "Add internal linking structure"
                ],
                aeoOptimization: [
                    "Structure content to answer specific questions",
                    "Use clear headings that match search queries",
                    "Include step-by-step processes with numbered lists"
                ],
                llmOptimization: [
                    "Write in clear, declarative sentences",
                    "Include context and definitions for technical terms",
                    "Structure information hierarchically"
                ]
            },
            
            prioritizedActionPlan: [
                {
                    action: "Create comprehensive buyer's guide with evaluation framework",
                    priority: "high",
                    effort: "high",
                    expectedImpact: "Significant improvement in rankings for comparison keywords",
                    appliesToYourContent: ownContentData ? "Yes - enhance your current content structure" : undefined
                },
                {
                    action: "Optimize existing content for target keyword density (2-3%)",
                    priority: "high",
                    effort: "low",
                    expectedImpact: "Quick wins for keyword relevance",
                    appliesToYourContent: ownContentData ? "Yes - current density needs improvement" : undefined
                },
                {
                    action: "Add FAQ section addressing common user questions",
                    priority: "medium",
                    effort: "medium",
                    expectedImpact: "Better featured snippet opportunities",
                    appliesToYourContent: ownContentData ? "Yes - missing from current content" : undefined
                },
                {
                    action: "Implement schema markup for software/product comparisons",
                    priority: "medium",
                    effort: "medium",
                    expectedImpact: "Enhanced SERP appearance and click-through rates"
                }
            ]
        };

        // Add Google Doc specific recommendations if own content is included
        if (ownContentData) {
            analysis.yourContentAnalysis = {
                currentPosition: "Your content provides good foundational information but needs strategic optimization to compete with established players",
                contentStrengths: ownContentData.strengths,
                immediateImprovements: [
                    "Increase keyword density to 2-3%",
                    "Add more semantic keywords throughout",
                    "Improve heading structure for better scannability"
                ],
                contentOpportunities: [
                    "Expand on implementation details",
                    "Add real-world case studies",
                    "Include interactive elements or tools"
                ]
            };

            analysis.googleDocRecommendations = {
                immediateChanges: [
                    "Add target keyword to main heading and 2-3 subheadings",
                    "Include keyword variations in first and last paragraphs",
                    "Add internal links to related sections"
                ],
                contentAdditions: [
                    "FAQ section with 8-10 common questions",
                    "Step-by-step implementation guide",
                    "Comparison table with top 3-5 alternatives"
                ],
                structuralImprovements: [
                    "Break up long paragraphs (max 3-4 sentences)",
                    "Add more H2 and H3 subheadings",
                    "Include bullet points and numbered lists"
                ],
                seoOptimizations: [
                    "Optimize meta description with target keyword",
                    "Add alt text to any images",
                    "Include schema markup for articles"
                ]
            };
        }

        return analysis;
    }

    async analyzeCompetitors() {
        // Get form values
        this.keyword = document.getElementById('keyword-input').value.trim();
        this.googleDocUrl = document.getElementById('google-doc-url').value.trim();
        
        // Get competitor URLs
        const competitorInputs = document.querySelectorAll('.competitor-url');
        this.competitors = Array.from(competitorInputs).map(input => input.value.trim()).filter(url => url);

        // Validation
        if (!this.keyword) {
            this.showError('Please enter a primary keyword or topic');
            return;
        }

        if (this.competitors.length === 0 && !this.includeOwnContent) {
            this.showError('Please add at least one competitor URL or include your own content for analysis');
            return;
        }

        if (this.includeOwnContent && !this.googleDocUrl) {
            this.showError('Please provide your Google Doc URL for content analysis');
            return;
        }

        this.hideError();
        this.analyzing = true;
        
        // Update UI
        const analyzeBtn = document.getElementById('analyze-btn');
        const analyzeText = document.getElementById('analyze-text');
        analyzeBtn.disabled = true;
        analyzeText.textContent = 'Analyzing...';
        
        try {
            // Step 0: Analyze own content if provided
            let ownContentAnalysis = null;
            if (this.includeOwnContent && this.googleDocUrl) {
                this.updateProgress('Analyzing your Google Doc content...', 10);
                ownContentAnalysis = await this.simulateGoogleDocAnalysis(this.googleDocUrl);
            }

            // Step 1: Analyze competitors
            const competitorData = [];
            for (let i = 0; i < this.competitors.length; i++) {
                const competitorAnalysis = await this.simulateCompetitorAnalysis(
                    this.competitors[i], 
                    this.keyword, 
                    i, 
                    this.competitors.length
                );
                competitorData.push(competitorAnalysis);
            }

            // Step 2: Generate comprehensive analysis
            const finalAnalysis = await this.simulateComprehensiveAnalysis(
                this.keyword, 
                competitorData, 
                ownContentAnalysis
            );

            // Store results
            this.analysisResults = {
                ...finalAnalysis,
                competitorData: competitorData,
                ownContentData: ownContentAnalysis,
                keyword: this.keyword,
                analysisDate: new Date().toISOString()
            };

            this.updateProgress('Analysis complete!', 100);
            this.renderResults();
            this.showToast('Analysis completed successfully!', 'success');

        } catch (error) {
            console.error('Analysis error:', error);
            this.showError('Analysis failed. Please check your inputs and try again.');
            this.showToast('Analysis failed. Please try again.', 'error');
        } finally {
            this.analyzing = false;
            analyzeBtn.disabled = false;
            analyzeText.textContent = 'Analyze Competitors';
            this.updateProgress('', 0);
        }
    }

    renderResults() {
        if (!this.analysisResults) return;

        const results = this.analysisResults;
        
        // Show results section
        document.getElementById('results-section').classList.remove('hidden');
        document.getElementById('results-keyword').textContent = this.keyword;

        // Render your content analysis if available
        if (results.yourContentAnalysis) {
            const yourContentSection = document.getElementById('your-content-analysis');
            const yourContentDetails = document.getElementById('your-content-details');
            
            yourContentDetails.innerHTML = `
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="p-4 bg-blue-50 rounded-lg">
                        <h4 class="font-semibold text-blue-800 mb-2">Current Position</h4>
                        <p class="text-sm text-blue-700">${results.yourContentAnalysis.currentPosition}</p>
                    </div>
                    <div class="p-4 bg-green-50 rounded-lg">
                        <h4 class="font-semibold text-green-800 mb-2">Content Strengths</h4>
                        <ul class="text-sm text-green-700">
                            ${results.yourContentAnalysis.contentStrengths?.map(strength => 
                                `<li class="flex items-start gap-1">
                                    <i class="fas fa-check-circle w-3 h-3 mt-1 flex-shrink-0"></i>
                                    ${strength}
                                </li>`
                            ).join('')}
                        </ul>
                    </div>
                </div>
                <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="p-4 bg-orange-50 rounded-lg">
                        <h4 class="font-semibold text-orange-800 mb-2">Immediate Improvements</h4>
                        <ul class="text-sm text-orange-700">
                            ${results.yourContentAnalysis.immediateImprovements?.map(improvement => 
                                `<li class="flex items-start gap-1">
                                    <i class="fas fa-bullseye w-3 h-3 mt-1 flex-shrink-0"></i>
                                    ${improvement}
                                </li>`
                            ).join('')}
                        </ul>
                    </div>
                    <div class="p-4 bg-purple-50 rounded-lg">
                        <h4 class="font-semibold text-purple-800 mb-2">Content Opportunities</h4>
                        <ul class="text-sm text-purple-700">
                            ${results.yourContentAnalysis.contentOpportunities?.map(opportunity => 
                                `<li class="flex items-start gap-1">
                                    <i class="fas fa-bolt w-3 h-3 mt-1 flex-shrink-0"></i>
                                    ${opportunity}
                                </li>`
                            ).join('')}
                        </ul>
                    </div>
                </div>
            `;
            
            yourContentSection.classList.remove('hidden');
        }

        // Render executive summary
        document.getElementById('executive-summary-text').textContent = results.executiveSummary;

        // Render competitor comparison
        const comparisonGrid = document.getElementById('comparison-grid');
        comparisonGrid.innerHTML = `
            <div class="p-4 bg-blue-50 rounded-lg">
                <h4 class="font-semibold text-blue-800 mb-2">Content Length</h4>
                <p class="text-sm text-blue-700">${results.competitorComparison?.contentLengthAnalysis}</p>
            </div>
            <div class="p-4 bg-purple-50 rounded-lg">
                <h4 class="font-semibold text-purple-800 mb-2">Topic Coverage</h4>
                <p class="text-sm text-purple-700">${results.competitorComparison?.topicCoverageComparison}</p>
            </div>
            <div class="p-4 bg-green-50 rounded-lg">
                <h4 class="font-semibold text-green-800 mb-2">Semantic SEO</h4>
                <p class="text-sm text-green-700">${results.competitorComparison?.semanticOptimizationLevels}</p>
            </div>
        `;

        // Render content gaps
        const contentGapsList = document.getElementById('content-gaps-list');
        contentGapsList.innerHTML = results.contentGaps?.map(gap => `
            <div class="border-l-4 border-orange-400 pl-4 py-2">
                <div class="flex items-center gap-2 mb-1">
                    <h4 class="font-semibold text-gray-800">${gap.gapType}</h4>
                    <span class="px-2 py-1 text-xs rounded-full ${
                        gap.priority === 'high' ? 'bg-red-100 text-red-800' :
                        gap.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                    }">
                        ${gap.priority} priority
                    </span>
                </div>
                <p class="text-gray-600 text-sm mb-2">${gap.description}</p>
                <p class="text-blue-700 text-sm font-medium">${gap.opportunity}</p>
            </div>
        `).join('');

        // Render semantic opportunities
        const semanticOpportunitiesList = document.getElementById('semantic-opportunities-list');
        semanticOpportunitiesList.innerHTML = results.semanticOpportunities?.map(opportunity => `
            <div class="p-3 bg-purple-50 rounded-lg">
                <h4 class="font-medium text-purple-800">${opportunity.opportunity}</h4>
                <p class="text-sm text-purple-600 mt-1">${opportunity.implementation}</p>
                <p class="text-sm text-gray-700 mt-2"><strong>Impact:</strong> ${opportunity.impact}</p>
            </div>
        `).join('');

        // Render content recommendations
        const contentRecommendations = document.getElementById('content-recommendations');
        contentRecommendations.innerHTML = results.outRankingStrategy?.contentRecommendations?.map(rec => `
            <div class="p-3 bg-blue-50 rounded-lg">
                <h5 class="font-medium text-blue-800">${rec.strategy}</h5>
                <p class="text-sm text-blue-600 mt-1">${rec.rationale}</p>
                <p class="text-sm text-gray-700 mt-2">${rec.implementation}</p>
            </div>
        `).join('');

        // Render AEO and LLM optimization
        const aeoOptimization = document.getElementById('aeo-optimization');
        aeoOptimization.innerHTML = results.outRankingStrategy?.aeoOptimization?.map(tip => `
            <li class="flex items-start gap-1">
                <i class="fas fa-check-circle w-3 h-3 mt-1 flex-shrink-0"></i>
                ${tip}
            </li>
        `).join('');

        const llmOptimization = document.getElementById('llm-optimization');
        llmOptimization.innerHTML = results.outRankingStrategy?.llmOptimization?.map(tip => `
            <li class="flex items-start gap-1">
                <i class="fas fa-check-circle w-3 h-3 mt-1 flex-shrink-0"></i>
                ${tip}
            </li>
        `).join('');

        // Render action plan
        const actionPlanList = document.getElementById('action-plan-list');
        actionPlanList.innerHTML = results.prioritizedActionPlan?.map(action => `
            <div class="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div class="flex-1">
                    <h4 class="font-medium text-gray-800">${action.action}</h4>
                    <p class="text-sm text-gray-600 mt-1">${action.expectedImpact}</p>
                    ${action.appliesToYourContent ? `<p class="text-xs text-blue-600 mt-1"><i class="fas fa-info-circle"></i> ${action.appliesToYourContent}</p>` : ''}
                </div>
                <div class="flex gap-2">
                    <span class="px-2 py-1 text-xs rounded-full ${
                        action.priority === 'high' ? 'bg-red-100 text-red-800' :
                        action.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                    }">
                        ${action.priority}
                    </span>
                    <span class="px-2 py-1 text-xs rounded-full ${
                        action.effort === 'high' ? 'bg-red-100 text-red-800' :
                        action.effort === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                    }">
                        ${action.effort} effort
                    </span>
                </div>
            </div>
        `).join('');

        // Render Google Doc recommendations if available
        if (results.googleDocRecommendations) {
            const googleDocSection = document.getElementById('google-doc-recommendations');
            const googleDocContent = document.getElementById('google-doc-recommendations-content');
            
            googleDocContent.innerHTML = `
                <div>
                    <h4 class="font-semibold text-gray-800 mb-3">Immediate Changes</h4>
                    <div class="space-y-2">
                        ${results.googleDocRecommendations.immediateChanges?.map(change => `
                            <div class="flex items-start gap-2 p-3 bg-red-50 rounded-lg">
                                <i class="fas fa-exclamation-circle w-4 h-4 text-red-600 mt-0.5 flex-shrink-0"></i>
                                <span class="text-sm text-red-800">${change}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div>
                    <h4 class="font-semibold text-gray-800 mb-3">Content Additions</h4>
                    <div class="space-y-2">
                        ${results.googleDocRecommendations.contentAdditions?.map(addition => `
                            <div class="flex items-start gap-2 p-3 bg-green-50 rounded-lg">
                                <i class="fas fa-check-circle w-4 h-4 text-green-600 mt-0.5 flex-shrink-0"></i>
                                <span class="text-sm text-green-800">${addition}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="lg:col-span-2">
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                            <h4 class="font-semibold text-gray-800 mb-3">Structural Improvements</h4>
                            <div class="space-y-2">
                                ${results.googleDocRecommendations.structuralImprovements?.map(improvement => `
                                    <div class="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                                        <i class="fas fa-file-alt w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0"></i>
                                        <span class="text-sm text-blue-800">${improvement}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        <div>
                            <h4 class="font-semibold text-gray-800 mb-3">SEO Optimizations</h4>
                            <div class="space-y-2">
                                ${results.googleDocRecommendations.seoOptimizations?.map(optimization => `
                                    <div class="flex items-start gap-2 p-3 bg-purple-50 rounded-lg">
                                        <i class="fas fa-search w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0"></i>
                                        <span class="text-sm text-purple-800">${optimization}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            googleDocSection.classList.remove('hidden');
        }

        // Render competitor details
        const competitorDetailsList = document.getElementById('competitor-details-list');
        competitorDetailsList.innerHTML = results.competitorData?.map((comp, index) => `
            <div class="border border-gray-200 rounded-lg p-4">
                <div class="flex items-center justify-between mb-3">
                    <h4 class="font-semibold text-gray-800">Competitor ${index + 1}</h4>
                    <span class="text-sm text-blue-600">${comp.url}</span>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div class="p-3 bg-gray-50 rounded-lg">
                        <h5 class="font-medium text-gray-700 mb-1">Content</h5>
                        <p class="text-sm text-gray-600">${comp.contentAnalysis.wordCount} words</p>
                        <p class="text-sm text-gray-600">${comp.contentAnalysis.contentDepth} depth</p>
                    </div>
                    <div class="p-3 bg-gray-50 rounded-lg">
                        <h5 class="font-medium text-gray-700 mb-1">Intent Match</h5>
                        <p class="text-sm text-gray-600">${comp.intentAlignment.searchIntentMatch}</p>
                    </div>
                    <div class="p-3 bg-gray-50 rounded-lg">
                        <h5 class="font-medium text-gray-700 mb-1">Readability</h5>
                        <p class="text-sm text-gray-600">${comp.technicalFactors.readability}</p>
                    </div>
                </div>
                <div class="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h5 class="font-medium text-green-700 mb-1">Strengths</h5>
                        <ul class="text-sm text-green-600">
                            ${comp.strengths.map(strength => `<li>• ${strength}</li>`).join('')}
                        </ul>
                    </div>
                    <div>
                        <h5 class="font-medium text-red-700 mb-1">Weaknesses</h5>
                        <ul class="text-sm text-red-600">
                            ${comp.weaknesses.map(weakness => `<li>• ${weakness}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        `).join('');

        // Scroll to results
        document.getElementById('results-section').scrollIntoView({ behavior: 'smooth' });
    }

    downloadReport() {
        if (!this.analysisResults) return;
        
        const reportData = {
            ...this.analysisResults,
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ai-seo-analysis-${this.keyword.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showToast('Report downloaded successfully!', 'success');
    }
}

// Initialize the analyzer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new AISEOAnalyzer();
});