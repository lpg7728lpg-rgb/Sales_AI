document.addEventListener('DOMContentLoaded', () => {
    // --- State and DOM Elements ---
    const viewContainer = document.getElementById('view-container');
    const pageTitle = document.getElementById('page-title');
    const pageSubtitle = document.getElementById('page-subtitle');
    const navItems = document.querySelectorAll('.nav-item');
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    
    // --- Theme Management ---
    const toggleTheme = () => {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', newTheme);
        themeIcon.className = newTheme === 'dark' ? 'ph ph-sun' : 'ph ph-moon';
    };
    
    themeToggleBtn.addEventListener('click', toggleTheme);

    // --- Navigation ---
    navItems.forEach(item => {
        if (!item.hasAttribute('data-view')) return;
        item.addEventListener('click', (e) => {
            // Remove active classes
            navItems.forEach(n => n.classList.remove('active'));
            // Add active to clicked
            item.classList.add('active');
            // Load View
            const viewName = item.getAttribute('data-view');
            loadView(viewName);
        });
    });

    // --- View Renderer ---
    const loadView = (viewName) => {
        viewContainer.innerHTML = '<div class="loader-container"><div class="spinner"></div></div>';
        
        setTimeout(() => {
            let html = '';
            
            switch(viewName) {
                case 'dashboard':
                    pageTitle.innerText = 'Dashboard';
                    pageSubtitle.innerText = "Welcome back, Alex. Here's what's happening today.";
                    html = renderDashboard();
                    break;
                case 'prospects':
                    pageTitle.innerText = 'AI Prospecting Agent';
                    pageSubtitle.innerText = "Let the AI find and engage your ideal customers.";
                    html = renderProspects();
                    break;
                case 'deals':
                    pageTitle.innerText = 'Deal Intelligence Panel';
                    pageSubtitle.innerText = "AI-analyzed deal health and next best actions.";
                    html = renderDeals();
                    break;
                case 'recovery':
                    pageTitle.innerText = 'Revenue Recovery Agent';
                    pageSubtitle.innerText = "Proactively identify and prevent churn.";
                    html = renderRecovery();
                    break;
                case 'insights':
                    pageTitle.innerText = 'Competitive Intelligence';
                    pageSubtitle.innerText = "Real-time battlecards against your competitors.";
                    html = renderInsights();
                    break;
                case 'assistant':
                    pageTitle.innerText = 'AI Sales Assistant';
                    pageSubtitle.innerText = "Chat with Nexus AI to strategize your next move.";
                    html = renderAssistant();
                    break;
                default:
                    pageTitle.innerText = 'Not Found';
                    pageSubtitle.innerText = "";
                    html = '<div class="card"><p>View not implemented.</p></div>';
            }
            
            viewContainer.innerHTML = html;
            
            // Re-bind view specific events
            if(viewName === 'prospects') bindProspectEvents();
            if(viewName === 'insights') bindInsightsEvents();
            if(viewName === 'assistant') bindAssistantEvents();

        }, 400); // Simulate network load
    };

    // --- View Components ---
    
    const uiComponents = {
        confidenceScore: (score) => `
            <div class="ai-badge-inline" title="AI Confidence Score">
                <i class="ph-fill ph-check-circle"></i> ${score}% Confidence
            </div>
        `,
        aiReasoning: (text) => `
            <div class="ai-reasoning fade-in">
                <i class="ph-fill ph-brain"></i>
                <div>
                    <strong>Why AI suggested this:</strong>
                    <p style="margin-top:4px;">${text}</p>
                </div>
            </div>
        `
    };

    const renderDashboard = () => {
        const metricsHTML = mockData.dashboard.metrics.map(m => `
            <div class="card fade-in">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="color:var(--text-muted); font-size:0.9rem;">${m.label}</span>
                    <div style="background:var(--bg-surface-hover); padding:8px; border-radius:50%; color:var(--text-main);">
                        <i class="ph ${m.icon}" style="font-size:1.2rem;"></i>
                    </div>
                </div>
                <div style="margin-top:16px;">
                    <h3 style="font-size:1.8rem; font-weight:700;">${m.value}</h3>
                    <span style="font-size:0.875rem; font-weight:500; color: ${m.positive ? 'var(--success)' : 'var(--error)'};">
                        ${m.trend} from last month
                    </span>
                </div>
            </div>
        `).join('');

        const dealsHTML = mockData.dashboard.recentDeals.map(d => `
            <div style="display:flex; justify-content:space-between; padding:16px 0; border-bottom:1px solid var(--border-color);">
                <div>
                    <h4 style="font-weight:600;">${d.company}</h4>
                    <span style="font-size:0.85rem; color:var(--text-muted);">${d.stage}</span>
                </div>
                <div style="text-align:right;">
                    <div style="font-weight:600;">${d.value}</div>
                    <span style="font-size:0.85rem; color:var(--text-muted);">${d.probability}% Prob.</span>
                </div>
            </div>
        `).join('');

        return `
            <div class="grid grid-cols-4" style="margin-bottom:32px;">
                ${metricsHTML}
            </div>
            <div class="grid grid-cols-2">
                <div class="card fade-in" style="animation-delay: 0.1s;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px;">
                        <h3 style="font-size:1.1rem; font-weight:600;">Pipeline Overview</h3>
                        <button class="btn btn-secondary">View All <i class="ph ph-arrow-right"></i></button>
                    </div>
                    <!-- Placeholder Chart -->
                    <div style="height:200px; background:var(--bg-surface-hover); border-radius:var(--radius-md); display:flex; align-items:center; justify-content:center; color:var(--text-muted);">
                        <i class="ph-fill ph-chart-bar" style="font-size:48px; opacity:0.2;"></i>
                    </div>
                </div>
                <div class="card fade-in" style="animation-delay: 0.2s;">
                    <h3 style="font-size:1.1rem; font-weight:600; margin-bottom:16px;">Active Deals</h3>
                    <div>${dealsHTML}</div>
                </div>
            </div>
        `;
    };

    const renderDeals = () => {
        const dealsHTML = mockData.deals.map((d, i) => `
            <div class="card fade-in" style="animation-delay: ${i * 0.1}s; margin-bottom: 24px;">
                <div style="display:flex; justify-content:space-between; border-bottom:1px solid var(--border-color); padding-bottom:16px; margin-bottom:16px;">
                    <div>
                        <div style="display:flex; align-items:center; gap:12px;">
                            <h3 style="font-size:1.2rem; font-weight:600;">${d.company}</h3>
                            <span class="badge ${d.status === 'At Risk' ? 'badge-error' : 'badge-success'}">${d.status}</span>
                        </div>
                        <div style="font-size:0.9rem; color:var(--text-muted); margin-top:4px;">
                            Value: <strong style="color:var(--text-main);">${d.value}</strong> • Last Contact: ${d.lastContact}
                        </div>
                    </div>
                    <div style="text-align:right;">
                        <strong style="font-size:1.5rem; color:${d.riskScore > 50 ? 'var(--error)' : 'var(--success)'};">${d.riskScore}</strong>
                        <div style="font-size:0.8rem; color:var(--text-muted);">Risk Score (0-100)</div>
                    </div>
                </div>
                
                <div style="background-color: var(--primary-light); padding:16px; border-radius: var(--radius-md); border-left: 4px solid var(--primary); margin-bottom: 16px;">
                    <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
                        <i class="ph-fill ph-sparkle" style="color:var(--primary); font-size:1.2rem;"></i>
                        <h4 style="font-weight:600; color:var(--primary-text);">AI Deal Analysis</h4>
                    </div>
                    <p style="color:var(--text-main); font-size:0.95rem;">${d.aiAnalysis}</p>
                </div>
                
                <div>
                    <h4 style="font-size:0.9rem; font-weight:600; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:8px;">Next Best Action</h4>
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <p style="font-size:1rem; font-weight:500;">${d.nextAction}</p>
                        <button class="btn btn-primary"><i class="ph ph-lightning"></i> Execute Action</button>
                    </div>
                </div>
            </div>
        `).join('');

        return `
            <div style="max-width: 900px; margin:0 auto;">
                ${dealsHTML}
            </div>
        `;
    };

    const renderRecovery = () => {
        const rows = mockData.recovery.map(r => `
            <div class="card fade-in" style="margin-bottom:24px;">
                <div style="display:flex; gap:24px;">
                    <div style="flex:1;">
                        <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
                            <h3 style="font-size:1.2rem; font-weight:600;">${r.company}</h3>
                            <span class="badge badge-warning">At Risk</span>
                            ${uiComponents.confidenceScore(r.aiConfidence)}
                        </div>
                        <div style="font-size:0.9rem; color:var(--text-muted); margin-bottom:8px;">MRR: <strong style="color:var(--text-main);">${r.mrr}</strong></div>
                        <div style="background:var(--error-bg); color:var(--error-text); padding:8px 12px; border-radius: var(--radius-md); font-size:0.9rem; display:inline-flex; align-items:center; gap:8px; margin-bottom:16px;">
                            <i class="ph-fill ph-warning-circle"></i> ${r.signal} (${r.metricDrop})
                        </div>
                        
                        <div style="margin-bottom:16px;">
                            <div style="font-weight:600; margin-bottom:4px;">AI Suggested Action:</div>
                            <p>${r.suggestion}</p>
                        </div>
                        
                        <div style="display:flex; gap:12px;">
                            <button class="btn btn-primary"><i class="ph ph-paper-plane-tilt"></i> Send Follow-up</button>
                            <button class="btn btn-secondary"><i class="ph ph-receipt"></i> Offer Discount</button>
                            <button class="btn btn-secondary"><i class="ph ph-arrow-fat-up"></i> Escalate</button>
                        </div>
                    </div>
                </div>
                ${uiComponents.aiReasoning(r.reasoning)}
            </div>
        `).join('');

        return `<div style="max-width:900px; margin:0 auto;">${rows}</div>`;
    };

    // --- Dynamic Views needing binding ---
    const renderProspects = () => `
        <div style="max-width:800px; margin:0 auto;">
            <div class="card fade-in" style="margin-bottom:24px;">
                <h3 style="font-weight:600; margin-bottom:16px;">Define Target</h3>
                <div style="display:flex; gap:16px;">
                    <input type="text" id="p-company" placeholder="E.g. Target Company Name" class="search-box" style="flex:1; border-radius:var(--radius-md); padding:10px; border:1px solid var(--border-color); background:var(--bg-base); color:var(--text-main);">
                    <input type="text" id="p-industry" placeholder="Industry (E.g. FinTech)" class="search-box" style="flex:1; border-radius:var(--radius-md); padding:10px; border:1px solid var(--border-color); background:var(--bg-base); color:var(--text-main);">
                    <button class="btn btn-ai" id="btn-generate-prospect"><i class="ph ph-sparkle"></i> Generate</button>
                </div>
            </div>
            <!-- Results Container -->
            <div id="prospect-results"></div>
        </div>
    `;

    const bindProspectEvents = () => {
        const btn = document.getElementById('btn-generate-prospect');
        if(!btn) return;
        btn.addEventListener('click', async () => {
            const company = document.getElementById('p-company').value || 'Acme';
            const industry = document.getElementById('p-industry').value || 'Software';
            const resContainer = document.getElementById('prospect-results');
            
            resContainer.innerHTML = '<div class="loader-container"><div class="spinner"></div></div>';
            
            const data = await AIApi.generateProspect(company, industry);
            
            resContainer.innerHTML = `
                <div class="card fade-in" style="margin-bottom:24px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                        <h3 style="font-size:1.1rem; font-weight:600; display:flex; align-items:center; gap:8px;">
                            <i class="ph-fill ph-target" style="color:var(--ai-color)"></i> Generated ICP
                        </h3>
                        ${uiComponents.confidenceScore(data.confidenceScore)}
                    </div>
                    <p style="color:var(--text-muted);">${data.icp}</p>
                    ${uiComponents.aiReasoning(data.reasoning)}
                </div>
                
                <div class="card fade-in" style="margin-bottom:24px; animation-delay:0.1s;">
                    <h3 style="font-size:1.1rem; font-weight:600; margin-bottom:16px;">Ideal Prospects Found</h3>
                    <div class="grid grid-cols-2">
                        ${data.prospects.map(p => `
                            <div style="padding:16px; border:1px solid var(--border-color); border-radius:var(--radius-md); display:flex; gap:12px; align-items:center;">
                                <div style="width:40px; height:40px; border-radius:50%; background:var(--bg-surface-hover); display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                                    <i class="ph ph-user" style="font-size:20px; color:var(--text-muted);"></i>
                                </div>
                                <div>
                                    <div style="font-weight:600;">${p.name}</div>
                                    <div style="font-size:0.8rem; color:var(--text-muted);">${p.title}</div>
                                </div>
                                <button class="btn btn-icon" style="margin-left:auto;"><i class="ph ph-linkedin-logo"></i></button>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="card fade-in" style="animation-delay:0.2s;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
                        <h3 style="font-size:1.1rem; font-weight:600; display:flex; align-items:center; gap:8px;">
                            <i class="ph ph-envelope-simple-open"></i> AI Drafted Outreach
                        </h3>
                        <div>
                            <button class="btn btn-secondary btn-small" id="btn-improve-tone"><i class="ph ph-pen-nib"></i> Improve Tone</button>
                            <button class="btn btn-secondary btn-small" id="btn-regenerate"><i class="ph ph-arrows-clockwise"></i> Regenerate</button>
                        </div>
                    </div>
                    <div style="background:var(--bg-base); padding:16px; border-radius:var(--radius-md); border:1px solid var(--border-color); font-family:monospace; font-size:0.9rem; white-space:pre-wrap; line-height:1.6;">${data.email}</div>
                    <div style="margin-top:16px; display:flex; justify-content:flex-end;">
                        <button class="btn btn-primary"><i class="ph ph-paper-plane-right"></i> Send to Selected</button>
                    </div>
                </div>
            `;
        });
    };

    const renderInsights = () => `
        <div style="max-width:800px; margin:0 auto;">
            <div class="card fade-in" style="margin-bottom:24px;">
                <h3 style="font-weight:600; margin-bottom:16px;">Generate Competitor Battlecard</h3>
                <div style="display:flex; gap:16px;">
                    <input type="text" id="i-competitor" placeholder="Competitor Name (E.g. Salesforce)" class="search-box" style="flex:1; border-radius:var(--radius-md); padding:10px; border:1px solid var(--border-color); background:var(--bg-base); color:var(--text-main);">
                    <button class="btn btn-ai" id="btn-generate-intel"><i class="ph ph-strategy"></i> Generate Intel</button>
                </div>
            </div>
            <div id="intel-results"></div>
        </div>
    `;

    const bindInsightsEvents = () => {
        const btn = document.getElementById('btn-generate-intel');
        if(!btn) return;
        btn.addEventListener('click', async () => {
            const competitor = document.getElementById('i-competitor').value || 'Competitor';
            const resContainer = document.getElementById('intel-results');
            
            resContainer.innerHTML = '<div class="loader-container"><div class="spinner"></div></div>';
            const data = await AIApi.getCompetitiveIntel(competitor);
            
            resContainer.innerHTML = `
                <div class="card fade-in" style="border-top:4px solid var(--primary);">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px;">
                        <h2 style="font-size:1.5rem; font-weight:700;">Nexus AI vs ${competitor}</h2>
                        ${uiComponents.confidenceScore(data.confidenceScore)}
                    </div>
                    
                    <div class="grid grid-cols-2">
                        <div>
                            <h3 style="font-size:1.1rem; font-weight:600; margin-bottom:12px; color:var(--success);">Nexus AI Advantages</h3>
                            <ul style="padding-left:20px; color:var(--text-main); line-height:1.8;">
                                ${data.keyDifferences.map(d => `<li style="margin-bottom:8px;">${d}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                    
                    <div style="margin-top:24px; padding-top:24px; border-top:1px solid var(--border-color);">
                        <h3 style="font-size:1.1rem; font-weight:600; margin-bottom:12px;">Suggested Pitch</h3>
                        <div style="background:var(--primary-light); padding:16px; border-radius:var(--radius-md); font-size:1.05rem; font-style:italic; color:var(--primary-text);">
                            "${data.pitch}"
                        </div>
                    </div>
                    
                    ${uiComponents.aiReasoning(data.reasoning)}
                </div>
            `;
        });
    };

    const renderAssistant = () => `
        <div style="max-width:800px; margin:0 auto; height:calc(100vh - 160px); display:flex; flex-direction:column; border:1px solid var(--border-color); border-radius:var(--radius-lg); overflow:hidden; background:var(--bg-surface);">
            <div style="padding:16px 24px; border-bottom:1px solid var(--border-color); display:flex; align-items:center; gap:12px; background:var(--bg-surface-hover);">
                <div style="width:36px; height:36px; background:linear-gradient(135deg, var(--ai-color), var(--primary)); border-radius:50%; display:flex; align-items:center; justify-content:center; color:white;">
                    <i class="ph-fill ph-sparkle"></i>
                </div>
                <div>
                    <h3 style="font-weight:600; font-size:1rem;">Nexus AI Assistant</h3>
                    <div style="font-size:0.8rem; color:var(--success); display:flex; align-items:center; gap:4px;">
                        <div style="width:8px; height:8px; background:var(--success); border-radius:50%;"></div> Online
                    </div>
                </div>
            </div>
            
            <div id="chat-messages" style="flex:1; overflow-y:auto; padding:24px; display:flex; flex-direction:column; gap:24px; background:var(--bg-base);">
                <div class="chat-message ai fade-in">
                    <div style="max-width:80%; background:var(--bg-surface-elevated); border:1px solid var(--border-color); padding:16px; border-radius:0 var(--radius-lg) var(--radius-lg) var(--radius-lg); box-shadow:var(--shadow-sm);">
                        Hello Alex. I've analyzed your pipeline for today. You have 2 deals at risk. How can I assist you?
                    </div>
                </div>
            </div>
            
            <div style="padding:16px 24px; border-top:1px solid var(--border-color); background:var(--bg-surface);">
                <div style="display:flex; gap:12px; margin-bottom:12px;">
                    <button class="btn btn-secondary btn-small chat-preset" style="font-size:0.8rem;">Write follow-up email</button>
                    <button class="btn btn-secondary btn-small chat-preset" style="font-size:0.8rem;">How to close this deal?</button>
                </div>
                <div style="display:flex; gap:12px;">
                    <input type="text" id="chat-input" placeholder="Ask AI about deals, prospects, or emails..." style="flex:1; border-radius:var(--radius-md); padding:12px 16px; border:1px solid var(--border-color); background:var(--bg-base); color:var(--text-main); font-size:1rem; outline:none; transition:var(--transition);">
                    <button class="btn btn-ai" id="btn-send-chat" style="padding:0 24px;"><i class="ph-bold ph-paper-plane-right"></i></button>
                </div>
            </div>
        </div>
    `;

    const bindAssistantEvents = () => {
        const input = document.getElementById('chat-input');
        const btn = document.getElementById('btn-send-chat');
        const messagesContainer = document.getElementById('chat-messages');
        const presets = document.querySelectorAll('.chat-preset');

        const appendUserMessage = (text) => {
            const html = `
                <div class="chat-message user fade-in" style="align-self:flex-end; max-width:80%;">
                    <div style="background:var(--primary); color:white; padding:16px; border-radius:var(--radius-lg) 0 var(--radius-lg) var(--radius-lg); box-shadow:var(--shadow-sm);">
                        ${text}
                    </div>
                </div>
            `;
            messagesContainer.insertAdjacentHTML('beforeend', html);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        };

        const appendAIMessage = async (text) => {
            // Add typing indicator
            const typingId = 'typing-' + Date.now();
            const typingHtml = `
                <div id="${typingId}" class="chat-message ai fade-in">
                    <div style="max-width:80%; background:var(--bg-surface-elevated); border:1px solid var(--border-color); padding:16px; border-radius:0 var(--radius-lg) var(--radius-lg) var(--radius-lg); color:var(--text-muted); display:flex; gap:4px; align-items:center;">
                        <i class="ph ph-circle-notch spinner"></i> Nexus AI is thinking...
                    </div>
                </div>
            `;
            messagesContainer.insertAdjacentHTML('beforeend', typingHtml);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;

            const aiRes = await AIApi.chatResponse(text);
            
            // Remove typing indicator
            document.getElementById(typingId).remove();

            // Format response
            const actionHtml = aiRes.action ? `
                <div style="margin-top:16px; border-top:1px solid var(--border-color); padding-top:16px;">
                    <button class="btn btn-primary"><i class="ph ${aiRes.action.icon}"></i> ${aiRes.action.label}</button>
                </div>
            ` : '';

            const resHtml = `
                <div class="chat-message ai fade-in">
                    <div style="max-width:80%; background:var(--bg-surface-elevated); border:1px solid var(--border-color); padding:16px; border-radius:0 var(--radius-lg) var(--radius-lg) var(--radius-lg); box-shadow:var(--shadow-sm);">
                        <div style="margin-bottom:8px; display:flex; justify-content:space-between; align-items:center;">
                            <span style="font-weight:600; color:var(--ai-color); display:flex; align-items:center; gap:6px;">
                                <i class="ph-fill ph-sparkle"></i> Nexus AI
                            </span>
                            ${uiComponents.confidenceScore(aiRes.confidenceScore)}
                        </div>
                        <div style="line-height:1.6; white-space:pre-wrap;">${aiRes.text}</div>
                        ${actionHtml}
                        <div style="margin-top:12px;"></div>
                        ${uiComponents.aiReasoning(aiRes.reasoning)}
                    </div>
                </div>
            `;
            messagesContainer.insertAdjacentHTML('beforeend', resHtml);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        };

        const handleSend = () => {
            const text = input.value.trim();
            if(!text) return;
            input.value = '';
            appendUserMessage(text);
            appendAIMessage(text);
        };

        btn.addEventListener('click', handleSend);
        input.addEventListener('keypress', (e) => {
            if(e.key === 'Enter') handleSend();
        });

        presets.forEach(p => {
            p.addEventListener('click', (e) => {
                input.value = e.target.innerText;
                handleSend();
            });
        });
    };

    // --- Init ---
    loadView('dashboard');
});
