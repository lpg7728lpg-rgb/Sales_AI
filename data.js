const mockData = {
    dashboard: {
        metrics: [
            { id: 'm1', label: 'Total Revenue', value: '$2.4M', trend: '+12.5%', icon: 'ph-currency-dollar', positive: true },
            { id: 'm2', label: 'Win Rate', value: '48%', trend: '+4.2%', icon: 'ph-trophy', positive: true },
            { id: 'm3', label: 'Deals at Risk', value: '12', trend: '-2', icon: 'ph-warning-circle', positive: true }, // positive because less risk
            { id: 'm4', label: 'Meetings Booked', value: '84', trend: '+18.1%', icon: 'ph-calendar-check', positive: true }
        ],
        recentDeals: [
            { id: 'cd1', company: 'Acme Corp', value: '$45,000', stage: 'Negotiation', probability: 80 },
            { id: 'cd2', company: 'TechFlow', value: '$120,000', stage: 'Discovery', probability: 35 }
        ]
    },
    deals: [
        { 
            id: 'd1', company: 'Globex Inc', value: '$85,000', status: 'At Risk', 
            riskScore: 82, 
            lastContact: '14 days ago',
            aiAnalysis: 'Engagement dropped significantly after the pricing presentation. No replies to last 2 emails.',
            nextAction: 'Offer a strategic review call with VP of Engineering.'
        },
        { 
            id: 'd2', company: 'Stark Industries', value: '$250,000', status: 'Hot', 
            riskScore: 12, 
            lastContact: '2 hours ago',
            aiAnalysis: 'Decision maker frequently viewing the contract. Strong positive sentiment in latest call.',
            nextAction: 'Send over the finalized SLA document.'
        },
        { 
            id: 'd3', company: 'Initech', value: '$35,000', status: 'At Risk', 
            riskScore: 68, 
            lastContact: '8 days ago',
            aiAnalysis: 'Champion has been on vacation. Project timeline might be delayed.',
            nextAction: 'Wait 2 days, then send a light check-in sharing a relevant case study.'
        }
    ],
    recovery: [
        {
            id: 'r1', company: 'Soylent Corp', mrr: '$4,500', 
            signal: 'Client inactive for 10 days',
            metricDrop: 'Usage dropped by 45%',
            aiConfidence: 92,
            suggestion: 'Send automated check-in focusing on feature adoption.',
            reasoning: 'Past data shows 60% recovery rate when reaching out within 14 days of usage drop with a helpful onboarding tone.'
        },
        {
            id: 'r2', company: 'Umbrella Corp', mrr: '$12,000', 
            signal: 'Failed payment + Support tickets open',
            metricDrop: 'N/A',
            aiConfidence: 98,
            suggestion: 'Escalate to Customer Success Manager for immediate manual intervention.',
            reasoning: 'High-value account with compound risk factors requires human touch rather than automated emails.'
        }
    ]
};

// Simulate AI endpoints
const AIApi = {
    async generateProspect(companyName, industry) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    icp: `Mid-market to Enterprise ${industry} companies with 500+ employees seeking automation.`,
                    prospects: [
                        { name: 'Sarah Connor', title: 'VP of Technology', linkedin: 'linkedin.com/in/sarahc' },
                        { name: 'John Smith', title: 'Director of IT Ops', linkedin: 'linkedin.com/in/johns' }
                    ],
                    email: `Subject: Elevating ${companyName}'s Operations\n\nHi [Name],\n\nI noticed ${companyName} is expanding its ${industry} footprint. Many leaders in your space struggle with scaling operations efficiently.\n\nOur platform uses AI to streamline this exact workflow. Would you be open to a 10-minute chat next Tuesday to see if it makes sense for you?\n\nBest,\nAlex`,
                    confidenceScore: 88,
                    reasoning: `Based on your recent closed-won deals in ${industry}, targeting VP level yields a 3x higher response rate. Tone is kept concise as per top-performing templates.`
                });
            }, 1500);
        });
    },

    async getCompetitiveIntel(competitorName) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    keyDifferences: [
                        `We offer native AI integrations; ${competitorName} relies on third-party plugins.`,
                        `Our Time-to-Value is 14 days vs their 45 days.`,
                        `${competitorName} has rigid pricing; we offer usage-based tiers.`
                    ],
                    pitch: `When evaluating us against ${competitorName}, the easiest way to think about it is agility. While they offer a monolithic platform that takes months to deploy, we plug directly into your existing workflow in under two weeks—and with native AI, you start seeing value on day one.`,
                    confidenceScore: 94,
                    reasoning: `Extracted from 120 win-loss analysis calls where ${competitorName} was mentioned.`
                });
            }, 1200);
        });
    },

    async chatResponse(message) {
        return new Promise(resolve => {
            setTimeout(() => {
                let response = "I can help with that. Could you provide a bit more detail?";
                let reasoning = "Standard fallback response.";
                let action = null;
                
                const lowerMsg = message.toLowerCase();
                
                if (lowerMsg.includes("follow-up") || lowerMsg.includes("email")) {
                    response = "Here is a suggested follow-up email:\n\n\"Hi there,\nJust floating this to the top of your inbox. Let me know if you have any questions from our last call!\"";
                    reasoning = "Short, low-pressure follow-ups perform best after 3 days of silence.";
                    action = { label: "Draft in Email Client", icon: "ph-envelope" };
                } else if (lowerMsg.includes("close") && lowerMsg.includes("deal")) {
                    response = "To close this deal, I recommend offering a customized ROI assessment. Buyers currently hesitating at this stage usually need internal business case justification.";
                    reasoning = "Analyzed 50 similar deals in the 'Negotiation' stage that stalled. Providing an ROI assessment increased win probability by 22%.";
                    action = { label: "Generate ROI Tool", icon: "ph-calculator" };
                } else {
                    response = "Based on our current data, I'm analyzing the best approach for this. Did you mean to review prospects, or adjust a current deal strategy?";
                    reasoning = "Intent classification confidence was low (<40%). Prompting user for clarification.";
                }

                resolve({
                    text: response,
                    action: action,
                    reasoning: reasoning,
                    confidenceScore: lowerMsg.includes("email") ? 92 : (lowerMsg.includes("close") ? 87 : 45)
                });
            }, 1000);
        });
    }
};
