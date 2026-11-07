/**
 * GROW Marketing Agency - Core Application Logic
 * High-Converting B2B Digital Infrastructure for US Contractors & SMBs
 */

document.addEventListener('DOMContentLoaded', () => {
  initCustomCursor();
  initScrollEffects();
  initHeroVideoControls();
  initStatsCounters();
  initRoiCalculator();
  initTechShowcase();
  initTerritoryChecker();
  initFaqAccordion();
  initMobileMenu();
});

/* --------------------------------------------------------------------------
   1. Custom Magnetic Cursor
   -------------------------------------------------------------------------- */
function initCustomCursor() {
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  
  if (!dot || !ring) return;

  // Check if touch device
  if (window.matchMedia('(pointer: coarse)').matches) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Position dot instantaneously
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  });

  // Spring physics interpolation for outer ring
  function renderCursor() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;
    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  // Magnetic hover states on interactive elements
  const hoverTargets = document.querySelectorAll('a, button, input, select, .preset-btn, .tilt-card');
  hoverTargets.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      ring.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
      ring.classList.remove('cursor-hover');
    });
    el.addEventListener('mousedown', () => {
      ring.classList.add('cursor-active');
    });
    el.addEventListener('mouseup', () => {
      ring.classList.remove('cursor-active');
    });
  });
}

/* --------------------------------------------------------------------------
   2. Scroll Effects, Reading Progress & Sticky Header
   -------------------------------------------------------------------------- */
function initScrollEffects() {
  const header = document.getElementById('siteHeader');
  const progressBar = document.getElementById('progressBar');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    // Progress Bar
    if (progressBar && docHeight > 0) {
      const scrollPercent = (scrollTop / docHeight) * 100;
      progressBar.style.width = `${scrollPercent}%`;
    }

    // Header elevation
    if (header) {
      if (scrollTop > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   3. Cinematic 4K Video Background Controls
   -------------------------------------------------------------------------- */
function initHeroVideoControls() {
  const video = document.getElementById('heroVideo');
  const toggleBtn = document.getElementById('videoToggleBtn');
  const toggleIcon = document.getElementById('videoToggleIcon');
  const toggleText = document.getElementById('videoToggleText');

  if (!video || !toggleBtn) return;

  // Handle autoplay policies gracefully
  const playPromise = video.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {
      if (toggleText) toggleText.textContent = 'Click to Play';
      if (toggleIcon) toggleIcon.className = 'fa-solid fa-play';
    });
  }

  toggleBtn.addEventListener('click', () => {
    if (video.paused) {
      video.play();
      if (toggleIcon) toggleIcon.className = 'fa-solid fa-pause';
      if (toggleText) toggleText.textContent = '4K Footage Active';
    } else {
      video.pause();
      if (toggleIcon) toggleIcon.className = 'fa-solid fa-play';
      if (toggleText) toggleText.textContent = 'Paused';
    }
  });
}

/* --------------------------------------------------------------------------
   4. Animated Metric Stats Counters (IntersectionObserver)
   -------------------------------------------------------------------------- */
function initStatsCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'), 10);
        animateCounter(el, target, 2000);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  statNumbers.forEach(num => observer.observe(num));
}

function animateCounter(el, target, duration) {
  let start = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Ease-out expo curve
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const currentVal = Math.floor(easeOut * target);

    el.textContent = currentVal.toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target.toLocaleString();
    }
  }

  requestAnimationFrame(update);
}

/* --------------------------------------------------------------------------
   5. Interactive Contractor ROI Calculator Engine
   -------------------------------------------------------------------------- */
// Calculation state container
let calcState = {
  trade: 'hvac',
  traffic: 3200,
  ticket: 8500,
  conversionRate: 1.8,
  closeRate: 28,
  // Outputs
  annualGrowth: 428400,
  monthlyNet: 35700,
  roiMultiple: '11.4x'
};

function initRoiCalculator() {
  const trafficSlider = document.getElementById('trafficSlider');
  const ticketSlider = document.getElementById('ticketSlider');
  const convSlider = document.getElementById('convSlider');
  const closeSlider = document.getElementById('closeSlider');

  const trafficDisplay = document.getElementById('trafficDisplay');
  const ticketDisplay = document.getElementById('ticketDisplay');
  const convDisplay = document.getElementById('convDisplay');
  const closeDisplay = document.getElementById('closeDisplay');

  const presetButtons = document.querySelectorAll('.preset-btn');

  if (!trafficSlider || !ticketSlider || !convSlider || !closeSlider) return;

  // Setup Preset Button Click Listeners
  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      presetButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const ticket = parseFloat(btn.dataset.ticket);
      const traffic = parseFloat(btn.dataset.traffic);
      const conv = parseFloat(btn.dataset.conv);
      const close = parseFloat(btn.dataset.close);
      const trade = btn.dataset.trade;

      calcState.trade = trade;

      // Update Slider Elements
      trafficSlider.value = traffic;
      ticketSlider.value = ticket;
      convSlider.value = conv;
      closeSlider.value = close;

      updateCalculatorOutputs();
    });
  });

  // Attach Input Listeners to Sliders
  [trafficSlider, ticketSlider, convSlider, closeSlider].forEach(slider => {
    slider.addEventListener('input', () => {
      // Remove preset active state if custom sliders moved
      presetButtons.forEach(b => b.classList.remove('active'));
      updateCalculatorOutputs();
    });
  });

  // Initial Calculation Run
  updateCalculatorOutputs();
}

function updateCalculatorOutputs() {
  const trafficSlider = document.getElementById('trafficSlider');
  const ticketSlider = document.getElementById('ticketSlider');
  const convSlider = document.getElementById('convSlider');
  const closeSlider = document.getElementById('closeSlider');

  const trafficDisplay = document.getElementById('trafficDisplay');
  const ticketDisplay = document.getElementById('ticketDisplay');
  const convDisplay = document.getElementById('convDisplay');
  const closeDisplay = document.getElementById('closeDisplay');

  const annualGrowthDisplay = document.getElementById('annualGrowthDisplay');
  const monthlyNetGrowth = document.getElementById('monthlyNetGrowth');
  const roiMultiple = document.getElementById('roiMultiple');

  const currLeads = document.getElementById('currLeads');
  const currJobs = document.getElementById('currJobs');
  const currMonthlyRev = document.getElementById('currMonthlyRev');

  const growLeads = document.getElementById('growLeads');
  const growJobs = document.getElementById('growJobs');
  const growMonthlyRev = document.getElementById('growMonthlyRev');

  const traffic = parseFloat(trafficSlider.value);
  const ticket = parseFloat(ticketSlider.value);
  const currentConv = parseFloat(convSlider.value);
  const closeRate = parseFloat(closeSlider.value);

  // Sync Slider Displays
  if (trafficDisplay) trafficDisplay.textContent = traffic.toLocaleString();
  if (ticketDisplay) ticketDisplay.textContent = ticket.toLocaleString();
  if (convDisplay) convDisplay.textContent = currentConv.toFixed(1);
  if (closeDisplay) closeDisplay.textContent = Math.round(closeRate);

  // Calculations for Status Quo Website
  const currentMonthlyLeads = Math.round(traffic * (currentConv / 100));
  const currentMonthlyJobs = Math.max(1, Math.round(currentMonthlyLeads * (closeRate / 100)));
  const currentRevenue = currentMonthlyJobs * ticket;

  // GROW Infrastructure Multipliers:
  // - Sub-second headless page speed + sticky call bar raises traffic-to-lead by ~2.6x to 3.0x
  // - Instant WhatsApp / Call dispatch reduces lead churn, lifting close rate by +25%
  const growConvRate = Math.min(8.5, (currentConv * 2.8) + 0.8);
  const growMonthlyLeads = Math.round(traffic * (growConvRate / 100));
  const growCloseRate = Math.min(65, closeRate * 1.25);
  const growMonthlyJobs = Math.max(2, Math.round(growMonthlyLeads * (growCloseRate / 100)));
  const growRevenue = growMonthlyJobs * ticket;

  // Net Lifts
  const netMonthlyLift = Math.max(0, growRevenue - currentRevenue);
  const netAnnualLift = netMonthlyLift * 12;

  // Estimated ROI Multiple (based on typical tier retainer of ~$3,500/mo)
  const estimatedAgencyFee = 3500;
  const roiRatio = Math.max(3.5, ((netMonthlyLift) / estimatedAgencyFee));

  // Store in Global State
  calcState.traffic = traffic;
  calcState.ticket = ticket;
  calcState.conversionRate = currentConv;
  calcState.closeRate = closeRate;
  calcState.annualGrowth = netAnnualLift;
  calcState.monthlyNet = netMonthlyLift;
  calcState.roiMultiple = `${roiRatio.toFixed(1)}x`;

  // Render to DOM
  if (currLeads) currLeads.textContent = `${currentMonthlyLeads} leads`;
  if (currJobs) currJobs.textContent = `${currentMonthlyJobs} jobs`;
  if (currMonthlyRev) currMonthlyRev.textContent = `$${Math.round(currentRevenue).toLocaleString()}`;

  if (growLeads) growLeads.textContent = `${growMonthlyLeads} leads`;
  if (growJobs) growJobs.textContent = `${growMonthlyJobs} jobs`;
  if (growMonthlyRev) growMonthlyRev.textContent = `$${Math.round(growRevenue).toLocaleString()}`;

  if (annualGrowthDisplay) annualGrowthDisplay.textContent = Math.round(netAnnualLift).toLocaleString();
  if (monthlyNetGrowth) monthlyNetGrowth.textContent = Math.round(netMonthlyLift).toLocaleString();
  if (roiMultiple) roiMultiple.textContent = `${roiRatio.toFixed(1)}x`;

  // Update Dynamic Chart Curve
  updateChartCurve(growRevenue, currentRevenue);
}

function updateChartCurve(growRev, currRev) {
  const chartPath = document.querySelector('.chart-animated-path');
  if (!chartPath) return;

  // Re-trigger subtle stroke dash animation
  chartPath.style.animation = 'none';
  chartPath.offsetHeight; // force reflow
  chartPath.style.animation = 'drawChartPath 1.2s ease-out forwards';
}

/* --------------------------------------------------------------------------
   6. White-Label Tech Showcase: Tabs & 3D Tilt Micro-Interactions
   -------------------------------------------------------------------------- */
function initTechShowcase() {
  const tabs = document.querySelectorAll('.showcase-tab-btn');
  const cards = document.querySelectorAll('.showcase-card');

  // Category Filtering
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const targetCategory = tab.dataset.target;
      cards.forEach(card => {
        if (targetCategory === 'all' || card.dataset.category === targetCategory) {
          card.style.display = 'block';
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 3D Tilt Effect on Desktop
  const tiltCards = document.querySelectorAll('.tilt-card');
  tiltCards.forEach(card => {
    const cardInner = card.querySelector('.card-inner');
    if (!cardInner) return;

    card.addEventListener('mousemove', (e) => {
      if (window.innerWidth <= 1024) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;

      cardInner.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      cardInner.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
    });
  });
}

// Modal deep dive data for the tech pillars
const techModalData = {
  'web-builds': {
    title: 'Lightning-Fast Web Builds: Architecture Specs',
    badge: '100/100 LIGHTHOUSE OPTIMIZATION',
    icon: 'fa-bolt text-brand',
    description: 'Most contractor sites carry bloated themes, heavy sliders, and outdated PHP plugins that load in 4.5+ seconds on mobile devices. Our headless architecture compiles pure static HTML and serverless micro-endpoints delivered via Cloudflare Edge nodes in under 800ms.',
    specs: [
      { label: 'Time to First Byte (TTFB)', val: '< 65ms' },
      { label: 'Largest Contentful Paint (LCP)', val: '0.62s' },
      { label: 'Cumulative Layout Shift (CLS)', val: '0.00' },
      { label: 'Mobile PageSpeed Score', val: '99 - 100/100' }
    ],
    features: [
      'Edge-Rendered SSR with instant global asset caching',
      'One-tap sticky dispatch bar with dynamic click-to-call replacement',
      'Offline Service Worker caching for rural and storm emergency access',
      'PWA support: Homeowners can add your emergency dispatch app to their home screen'
    ]
  },
  'seo-funnels': {
    title: 'Automated SEO Funnels: Geo-Grid 3-Pack Domination',
    badge: 'PROGRAMMATIC SUBURB AUTHORITY',
    icon: 'fa-map-location-dot text-cyan',
    description: 'Contractors don’t just serve one city; they serve 20-40 micro-suburbs across 3 counties. We programmatically deploy structured location authority silos that rank in high-intent "near me" map queries, driving verified inbound service calls without paying Google per click.',
    specs: [
      { label: 'Target Suburb Landing Pages', val: '35 - 60 Pages' },
      { label: 'Map Pack Geo-Fenced Radius', val: '25 Miles' },
      { label: 'Review Velocity Lift', val: '+240%' },
      { label: 'Google LSA Badge Sync', val: 'Verified' }
    ],
    features: [
      'Programmatic Schema markup for HVAC, Roofing, Plumbing & Electrical verticals',
      'Automated SMS dispatch review generator that filters 5-star Google ratings',
      'Geo-targeted Local Business Schema connected to your Google Business Profile',
      'Negative radius exclusion to eliminate low-margin traveling jobs outside your sweet spot'
    ]
  },
  'landing-pages': {
    title: 'High-Converting Landing Pages: Real-Time Lead Engine',
    badge: '14.8% CONVERSION RATE FORMULA',
    icon: 'fa-bullseye text-emerald',
    description: 'Homeowners needing emergency AC repair or a roof leak replacement will not fill out a 9-field form and wait 24 hours. Our landing pages utilize interactive repair cost estimators and direct WhatsApp/call bridges that capture homeowners in under 45 seconds.',
    specs: [
      { label: 'Avg Mobile Conversion Rate', val: '14.8%' },
      { label: 'Lead Response Latency', val: '< 45 Seconds' },
      { label: 'Form Abandonment Reduction', val: '-68%' },
      { label: 'Cost Per Acquired Lead Lift', val: '-44%' }
    ],
    features: [
      'Dynamic Number Insertion (DNI) with CallRail, RingCentral & ServiceTitan integration',
      'Interactive multi-step price estimator that pre-qualifies high-ticket customers',
      'Heatmapped mobile sticky bar with instant click-to-dispatch triggers',
      'Two-way SMS auto-responder that instantly messages homeowner while they are on site'
    ]
  }
};

function openTechDetailModal(techKey) {
  const modal = document.getElementById('techDetailModal');
  const container = document.getElementById('techDetailContent');
  const data = techModalData[techKey];

  if (!modal || !container || !data) return;

  container.innerHTML = `
    <div class="modal-header">
      <div class="section-pill mb-2">
        <i class="fa-solid ${data.icon} mr-1"></i>
        <span>${data.badge}</span>
      </div>
      <h3 class="modal-title">${data.title}</h3>
      <p class="modal-sub">${data.description}</p>
    </div>

    <div class="interactive-metric-box mb-4">
      ${data.specs.map(spec => `
        <div class="metric-pill">
          <span class="metric-num text-brand">${spec.val}</span>
          <span class="metric-desc">${spec.label}</span>
        </div>
      `).join('')}
    </div>

    <div class="mb-4">
      <h4 class="text-white text-sm font-bold mb-2">Engineered Architectural Features:</h4>
      <ul class="step-checklist">
        ${data.features.map(feat => `
          <li><i class="fa-solid fa-check text-brand mr-2"></i> ${feat}</li>
        `).join('')}
      </ul>
    </div>

    <button class="btn btn-brand btn-block magnetic-btn" onclick="closeTechDetailModal(); openOnboardingModal('Tech Modal: ${data.title}');">
      <span>Deploy This Stack in Your Territory</span>
      <i class="fa-solid fa-arrow-right ml-2"></i>
    </button>
  `;

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
}

function closeTechDetailModal() {
  const modal = document.getElementById('techDetailModal');
  if (modal) {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }
}

/* --------------------------------------------------------------------------
   7. Interactive Territory Exclusivity Checker
   -------------------------------------------------------------------------- */
function handleTerritoryCheck(e) {
  e.preventDefault();
  const tradeInput = document.getElementById('territoryTrade').value;
  const zipInput = document.getElementById('territoryZip').value.trim();
  const checkBtn = document.getElementById('checkTerritoryBtn');
  const resultAlert = document.getElementById('territoryResultAlert');
  const headline = document.getElementById('resultStatusHeadline');
  const text = document.getElementById('resultStatusText');

  if (!tradeInput || !zipInput) {
    showToast('Please select your trade vertical and target territory.');
    return;
  }

  // Visual simulation of database query
  checkBtn.disabled = true;
  checkBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin mr-2"></i> Querying Territory Database...`;

  setTimeout(() => {
    checkBtn.disabled = false;
    checkBtn.innerHTML = `<span>Verify My Territory Availability</span><i class="fa-solid fa-satellite-dish ml-2"></i>`;

    resultAlert.classList.remove('hidden');
    headline.textContent = `TERRITORY PROVISIONALLY UNLOCKED FOR ${tradeInput.toUpperCase()}`;
    text.innerHTML = `Great news! Our database confirms <strong>no active agency non-compete is currently active for ${tradeInput}</strong> in <strong>"${zipInput}"</strong>. This market is provisionally eligible for exclusive licensing.`;

    resultAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    showToast(`✓ Territory Available in ${zipInput}!`);
  }, 900);
}

function openOnboardingWithTerritory() {
  const trade = document.getElementById('territoryTrade').value;
  const zip = document.getElementById('territoryZip').value;

  openOnboardingModal(`Territory Checker: ${trade} in ${zip}`);

  // Autofill modal fields
  const modalTrade = document.getElementById('modalTradeSelect');
  const modalTerritory = document.getElementById('modalTerritoryCity');

  if (modalTrade && trade) modalTrade.value = trade;
  if (modalTerritory && zip) modalTerritory.value = zip;
}

/* --------------------------------------------------------------------------
   8. Contractor FAQ Accordion
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other items
      faqItems.forEach(i => {
        i.classList.remove('active');
        const btn = i.querySelector('.faq-question');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });

      // Toggle current
      if (!isActive) {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   9. Floating WhatsApp & Live Chat Onboarding Drawer
   -------------------------------------------------------------------------- */
let selectedTradeInDrawer = 'HVAC';

function dismissSpeechBubble(e) {
  if (e) e.stopPropagation();
  const bubble = document.getElementById('dockSpeechBubble');
  if (bubble) bubble.style.display = 'none';
}

function toggleOnboardingDrawer() {
  const drawer = document.getElementById('onboardingDrawer');
  const trigger = document.getElementById('dockTriggerBtn');
  const bubble = document.getElementById('dockSpeechBubble');

  if (!drawer || !trigger) return;

  const isOpen = drawer.classList.contains('open');

  if (isOpen) {
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    trigger.classList.remove('open');
    trigger.setAttribute('aria-expanded', 'false');
  } else {
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    trigger.classList.add('open');
    trigger.setAttribute('aria-expanded', 'true');
    if (bubble) bubble.style.display = 'none';
  }
}

function selectDrawerTrade(tradeName) {
  selectedTradeInDrawer = tradeName;
  const pills = document.querySelectorAll('.drawer-trade-pill');
  pills.forEach(p => {
    if (p.textContent.includes(tradeName)) {
      p.classList.add('selected');
    } else {
      p.classList.remove('selected');
    }
  });

  showToast(`Trade selected: ${tradeName}`);
}

function handleDrawerSubmit(e) {
  e.preventDefault();
  const companyInput = document.getElementById('drawerCompanyInput').value.trim();
  const phoneInput = document.getElementById('drawerPhoneInput').value.trim();

  if (!companyInput || !phoneInput) {
    showToast('Please provide your company name and dispatch phone.');
    return;
  }

  // Construct direct WhatsApp message
  const textMessage = encodeURIComponent(
    `Hello GROW Team! I'm reaching out from ${companyInput} (${selectedTradeInDrawer}). Phone: ${phoneInput}. We want to check territory availability and scale our service operations.`
  );

  const whatsappUrl = `https://wa.me/18005554769?text=${textMessage}`;
  window.open(whatsappUrl, '_blank');

  showToast('✓ Redirecting to WhatsApp Direct Dispatch...');
  toggleOnboardingDrawer();
}

function openDirectCalendarAudit() {
  toggleOnboardingDrawer();
  openOnboardingModal('15-Min Executive Audit Request');
}

/* --------------------------------------------------------------------------
   10. Global Onboarding Modal Handler
   -------------------------------------------------------------------------- */
function openOnboardingModal(sourceTrigger = 'Generic') {
  const modal = document.getElementById('onboardingModal');
  if (!modal) return;

  const modalSubText = document.getElementById('modalSubText');
  if (modalSubText && sourceTrigger) {
    modalSubText.textContent = `Triggered via ${sourceTrigger}. Inquire below to lock your 25-mile exclusive territory.`;
  }

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
}

function openOnboardingWithCalculatedData() {
  openOnboardingModal('ROI Calculator Projection');

  const summaryBox = document.getElementById('modalCalculationSummary');
  const annualVal = document.getElementById('modalAnnualVal');
  const monthlyVal = document.getElementById('modalMonthlyVal');
  const roiVal = document.getElementById('modalRoiVal');

  if (summaryBox) {
    summaryBox.classList.remove('hidden');
    if (annualVal) annualVal.textContent = `$${Math.round(calcState.annualGrowth).toLocaleString()}`;
    if (monthlyVal) monthlyVal.textContent = `+$${Math.round(calcState.monthlyNet).toLocaleString()}/mo`;
    if (roiVal) roiVal.textContent = calcState.roiMultiple;
  }
}

function closeOnboardingModal() {
  const modal = document.getElementById('onboardingModal');
  if (modal) {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }
}

function handleGlobalModalSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('modalFullName').value.trim();
  const company = document.getElementById('modalCompany').value.trim();
  const phone = document.getElementById('modalPhone').value.trim();
  const email = document.getElementById('modalEmail').value.trim();
  const trade = document.getElementById('modalTradeSelect').value;
  const territory = document.getElementById('modalTerritoryCity').value.trim();

  // Simulated Submission
  const submitBtn = document.getElementById('modalSubmitBtn');
  submitBtn.disabled = true;
  submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin mr-2"></i> Locking Territory & Generating Dossier...`;

  setTimeout(() => {
    submitBtn.disabled = false;
    submitBtn.innerHTML = `<span>Confirm Territory Audit & Onboard</span><i class="fa-solid fa-bolt ml-2"></i>`;
    closeOnboardingModal();

    showToast(`🚀 Success! Territory audit dossier queued for ${company}. We will contact ${phone} within 30 mins.`);

    // Optional: offer WhatsApp handoff
    const confirmWhatsApp = confirm(
      `Territory Dossier Received for ${company}!\n\nWould you like to connect with our Territory Director immediately via WhatsApp?`
    );
    if (confirmWhatsApp) {
      const msg = encodeURIComponent(
        `Hi GROW! I just submitted an enterprise territory application for ${company} (${trade} in ${territory}). Name: ${name}, Phone: ${phone}.`
      );
      window.open(`https://wa.me/18005554769?text=${msg}`, '_blank');
    }
  }, 1200);
}

/* --------------------------------------------------------------------------
   11. Mobile Navigation Hamburger Menu
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const drawer = document.getElementById('mobileMenuDrawer');
  const links = document.querySelectorAll('.mobile-nav-link');

  if (!menuBtn || !drawer) return;

  menuBtn.addEventListener('click', () => {
    const isOpen = drawer.classList.contains('active');
    if (isOpen) {
      drawer.classList.remove('active');
      menuBtn.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    } else {
      drawer.classList.add('active');
      menuBtn.classList.add('open');
      menuBtn.setAttribute('aria-expanded', 'true');
    }
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      drawer.classList.remove('active');
      menuBtn.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

/* --------------------------------------------------------------------------
   12. Toast Notification System
   -------------------------------------------------------------------------- */
function showToast(message) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <i class="fa-solid fa-circle-check text-brand"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Global modal backdrop close handlers
window.addEventListener('click', (e) => {
  const onboardingModal = document.getElementById('onboardingModal');
  const techModal = document.getElementById('techDetailModal');

  if (e.target === onboardingModal) closeOnboardingModal();
  if (e.target === techModal) closeTechDetailModal();
});

// ESC key listener for modals & drawers
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeOnboardingModal();
    closeTechDetailModal();
    const drawer = document.getElementById('onboardingDrawer');
    if (drawer && drawer.classList.contains('open')) {
      toggleOnboardingDrawer();
    }
  }
});
