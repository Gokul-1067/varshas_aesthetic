/**
 * DR. VARSHA'S AYURVEDIC TREATMENT CENTER
 * Main Controller: Navigation, Scroll Reveals, Cards Rendering & Filters
 */

document.addEventListener("DOMContentLoaded", () => {
  initStickyHeader();
  initMobileNav();
  initScrollReveals();
  highlightActiveNav();
  initModalTriggers();
  initTreatmentsPage();
  initHomeTreatmentsPreview();
});

/**
 * Sticky Header on Scroll
 */
function initStickyHeader() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 25) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();
}

/**
 * Mobile Navigation Drawer
 */
function initMobileNav() {
  const toggleBtn = document.querySelector(".mobile-nav-toggle");
  const drawer = document.querySelector(".mobile-nav-drawer");
  if (!toggleBtn || !drawer) return;

  const toggle = () => {
    const isOpen = drawer.classList.contains("is-open");
    if (isOpen) {
      drawer.classList.remove("is-open");
      toggleBtn.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    } else {
      drawer.classList.add("is-open");
      toggleBtn.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    }
  };

  toggleBtn.addEventListener("click", toggle);

  // Close when clicking any mobile link
  const links = drawer.querySelectorAll("a");
  links.forEach(link => {
    link.addEventListener("click", () => {
      drawer.classList.remove("is-open");
      toggleBtn.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    });
  });
}

/**
 * Staggered Scroll Reveals using IntersectionObserver
 */
function initScrollReveals() {
  const elements = document.querySelectorAll(".reveal-on-scroll");
  if (!elements.length) return;

  // Immediately mark any element already in or near viewport as revealed
  elements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 120) {
      el.classList.add("is-revealed");
    }
  });

  if (!("IntersectionObserver" in window)) {
    elements.forEach(el => el.classList.add("is-revealed"));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-revealed");
        obs.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: "0px 0px 80px 0px",
    threshold: 0.05
  });

  elements.forEach(el => {
    if (!el.classList.contains("is-revealed")) {
      observer.observe(el);
    }
  });
}

/**
 * Highlight Current Nav Item
 */
function highlightActiveNav() {
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".nav-link, .mobile-nav-link");

  navLinks.forEach(link => {
    const href = link.getAttribute("href");
    if (!href) return;
    const linkPath = href.split("/").pop();

    if (linkPath === currentPath || (currentPath === "" && linkPath === "index.html")) {
      link.classList.add("is-active");
    } else {
      link.classList.remove("is-active");
    }
  });
}

/**
 * Connect all elements with data-action="open-modal"
 */
function initModalTriggers() {
  document.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-action='open-modal']");
    if (!trigger) return;

    e.preventDefault();
    const treatment = trigger.getAttribute("data-treatment");
    const branch = trigger.getAttribute("data-branch");
    const mode = trigger.getAttribute("data-mode");

    openBookingModal({ treatment, branch, mode });
  });
}

/**
 * Render Treatment Card HTML
 */
function createTreatmentCardHTML(t) {
  const benefitsHTML = t.benefits.map(b => `
    <li class="treatment-benefit-item">
      <svg viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
      </svg>
      <span>${b}</span>
    </li>
  `).join("");

  const accommodationBadge = t.hasAccommodation ? `
    <span class="badge-accommodation">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M3 7v11m0-4h18m0-7v11M7 10h10M7 7a2 2 0 012-2h6a2 2 0 012 2v3H7V7z"/>
      </svg>
      Thodiyoor Stay Available
    </span>
  ` : `
    <span class="badge-branch-thodiyoor">Thodiyoor & Mynagappally</span>
  `;

  return `
    <article class="treatment-card reveal-on-scroll" data-category="${t.category}">
      <div class="treatment-card-media">
        <img src="${t.image}" alt="${t.title}" loading="lazy" />
        <div class="treatment-badges">
          <span class="eyebrow" style="margin:0; background:rgba(250,248,242,0.95);">${t.categoryLabel}</span>
          ${accommodationBadge}
        </div>
      </div>
      <div class="treatment-card-body">
        <div class="treatment-card-meta">
          <span class="treatment-meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            ${t.duration}
          </span>
          <span class="badge-placeholder">Client Demo Guide</span>
        </div>

        <h3 class="treatment-card-title">${t.title}</h3>
        <p class="treatment-card-description">${t.description}</p>

        <ul class="treatment-benefits-list">
          ${benefitsHTML}
        </ul>

        <div class="treatment-card-footer">
          <div class="treatment-price-box">
            <span class="treatment-price-label">Fee Structure</span>
            <span class="treatment-price-value">${t.pricePlaceholder}</span>
          </div>
          <button type="button" class="btn btn-whatsapp btn-sm" onclick="enquireTreatmentWhatsApp('${t.title.replace(/'/g, "\\'")}', '${t.accommodationNote}')">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.299.144.347.491 1.199.534 1.286.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.302c-.087.087-.179.182-.077.357.101.174.45 0.742.966 1.201.666.592 1.228.776 1.401.863.173.087.275.072.376-.043.101-.116.433-.506.549-.679.116-.173.231-.144.39-.087s1.011.477 1.184.564c.173.087.289.13.332.202.043.073.043.419-.101.824z"/>
            </svg>
            Enquire
          </button>
        </div>
      </div>
    </article>
  `;
}

/**
 * Render Full Treatment Plans Page with Category Filters
 */
function initTreatmentsPage() {
  const container = document.getElementById("allTreatmentsGrid");
  if (!container || typeof TREATMENTS_DATA === "undefined") return;

  const render = (category = "all") => {
    const filtered = category === "all" 
      ? TREATMENTS_DATA 
      : TREATMENTS_DATA.filter(t => t.category === category);

    container.innerHTML = filtered.map(t => createTreatmentCardHTML(t)).join("");
    initScrollReveals();
  };

  render("all");

  // Filter Buttons
  const filterBtns = document.querySelectorAll(".treatment-filter-btn");
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      const cat = btn.getAttribute("data-filter");
      render(cat);
    });
  });
}

/**
 * Render Popular Treatments on Homepage (Top 3)
 */
function initHomeTreatmentsPreview() {
  const container = document.getElementById("homeTreatmentsPreview");
  if (!container || typeof TREATMENTS_DATA === "undefined") return;

  const previewList = TREATMENTS_DATA.slice(0, 3);
  container.innerHTML = previewList.map(t => createTreatmentCardHTML(t)).join("");
  initScrollReveals();
}
