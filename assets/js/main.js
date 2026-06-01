/* FZ Media - Home Page Controller Logic */

document.addEventListener("DOMContentLoaded", () => {
    
    // Load dynamic VSL variables on public homepage
    loadHeroVSLData();

    // 1. Dynamic Rendering of Services Teaser
    renderServicesTeaser();
    
    // 1.5. Dynamic Rendering of Portfolio Highlights
    setupHomePortfolio();
    
    // 2. Animated Counter Stats
    setupCounters();

    // 3. Dynamic Testimonials & Slider setup
    setupTestimonials();

    // 4. Video Cinema Modal controller
    setupCinemaModal();

    // 5. Custom Pricing Estimator widget logic
    setupPricingEstimator();

    // 6. Public Review Form setups
    setupStarRatingSelector();
    setupReviewFormToggle();

    // 7. Scroll Reveal Animation Engine
    setupScrollReveal();
});

// 1. Render Core Services cards dynamically
function renderServicesTeaser() {
    const srvGrid = document.getElementById("services-teaser-grid");
    if (!srvGrid) return;
    
    const db = getDB();
    const coreServices = db.services.slice(0, 4); // Display up to 4 core services

    srvGrid.innerHTML = coreServices.map(srv => {
        // Find starting price from packages
        const lowestPrice = Math.min(...srv.packages.map(p => p.price));
        
        return `
            <div class="glass-card teaser-service-card">
                <div>
                    <span class="section-badge" style="font-size: 0.72rem; padding: 4px 10px; margin-bottom: 12px;">Editing Suite</span>
                    <h3>${srv.name}</h3>
                    <p>${srv.subtitle}</p>
                </div>
                <div class="teaser-card-bottom">
                    <div class="teaser-starting-price">Packages from <br><span>$${lowestPrice}</span></div>
                    <a href="services.html" class="teaser-link">View Tiers &rarr;</a>
                </div>
            </div>
        `;
    }).join("");
}

// 2. IntersectionObserver dynamic counter animation
function setupCounters() {
    const statCards = document.querySelectorAll(".stat-card");
    if (statCards.length === 0) return;

    const observerOptions = {
        threshold: 0.35,
        rootMargin: "0px"
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const card = entry.target;
                const numberEl = card.querySelector(".stat-number");
                const target = parseInt(card.getAttribute("data-target"), 10);
                const suffix = card.getAttribute("data-suffix") || "";
                
                animateCount(numberEl, target, suffix);
                counterObserver.unobserve(card); // Animate only once
            }
        });
    }, observerOptions);

    statCards.forEach(card => counterObserver.observe(card));
}

function animateCount(element, target, suffix) {
    let current = 0;
    const duration = 1600; // ms
    const stepTime = Math.max(Math.floor(duration / target), 12);
    
    const timer = setInterval(() => {
        current += Math.ceil(target / 45); // increment step size relative to target speed
        if (current >= target) {
            element.textContent = target + suffix;
            clearInterval(timer);
        } else {
            element.textContent = current + suffix;
        }
    }, stepTime);
}

// 3. Dynamic Testimonials Slider Loading & Transition Logic
function setupTestimonials() {
    const slider = document.getElementById("testimonial-slider");
    if (!slider) return;

    const db = getDB();
    const testimonials = db.testimonials || [];

    if (testimonials.length === 0) {
        slider.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 40px 0; width: 100%;">No reviews added yet.</p>`;
        return;
    }

    slider.innerHTML = testimonials.map((t, idx) => {
        let stars = "";
        const rating = t.rating || 5;
        for (let i = 0; i < rating; i++) {
            stars += "★";
        }
        
        let audioMarkup = "";
        if (t.audioUrl) {
            audioMarkup = `
                <div class="audio-proof-wrapper" style="margin-top: 14px; background: rgba(255,255,255,0.01); border: 1px solid var(--border-color); padding: 10px 14px; border-radius: var(--radius-sm); display: flex; align-items: center; gap: 10px; max-width: 100%; overflow: hidden;">
                    <span style="font-size: 0.8rem; font-weight: 700; color: var(--accent-secondary); text-transform: uppercase;">🎵 Audio:</span>
                    <audio src="${t.audioUrl}" controls style="height: 26px; flex-grow: 1; min-width: 120px; outline: none;"></audio>
                </div>
            `;
        }
        
        let attachMarkup = "";
        if (t.attachUrl) {
            attachMarkup = `
                <div class="link-proof-wrapper" style="margin-top: 8px; text-align: left;">
                    <a href="${t.attachUrl}" target="_blank" class="text-gradient-cyan" style="font-size: 0.82rem; font-weight: 700; display: inline-flex; align-items: center; gap: 4px; text-decoration: underline;">
                        🔗 Attached Review Link / Asset
                    </a>
                </div>
            `;
        }

        return `
            <div class="testimonial-card-slide">
                <div class="testimonial-card-inner">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                        <div class="testimonial-quote-icon">“</div>
                        <div style="color: #fbbf24; font-size: 1.1rem; font-weight: 700; letter-spacing: 2px;">${stars}</div>
                    </div>
                    <p class="testimonial-text">"${t.text}"</p>
                    
                    ${audioMarkup}
                    ${attachMarkup}
                    
                    <div class="testimonial-author-box">
                        <img src="${t.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}" alt="${t.name}" class="author-avatar" onerror="this.src='https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'">
                        <div class="author-info">
                            <h4>${t.name}</h4>
                            <p>${t.role}</p>
                        </div>
                        ${t.videoUrl ? `
                        <button class="testimonial-video-preview-btn" style="margin-left: auto;" data-video="${t.videoUrl}">
                            Play Proof Clip 🎬
                        </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join("");

    // Slider transitions
    let activeIdx = 0;
    const slides = document.querySelectorAll(".testimonial-card-slide");
    const prevBtn = document.getElementById("slider-prev");
    const nextBtn = document.getElementById("slider-next");

    function updateSlider() {
        slider.style.transform = `translateX(-${activeIdx * 100}%)`;
    }

    if (nextBtn && prevBtn && slides.length > 0) {
        // Clear previous cloned listeners
        const nextClone = nextBtn.cloneNode(true);
        const prevClone = prevBtn.cloneNode(true);
        nextBtn.parentNode.replaceChild(nextClone, nextBtn);
        prevBtn.parentNode.replaceChild(prevClone, prevBtn);

        nextClone.addEventListener("click", () => {
            activeIdx = (activeIdx + 1) % slides.length;
            updateSlider();
        });

        prevClone.addEventListener("click", () => {
            activeIdx = (activeIdx - 1 + slides.length) % slides.length;
            updateSlider();
        });
        
        // Auto slide interval
        if (window.testimonialInterval) clearInterval(window.testimonialInterval);
        window.testimonialInterval = setInterval(() => {
            if (slides.length > 0) {
                activeIdx = (activeIdx + 1) % slides.length;
                updateSlider();
            }
        }, 8000);
    }
}

// 3.5. Interactive Star Rating Selector
function setupStarRatingSelector() {
    const starContainer = document.getElementById("star-rating-selector");
    const ratingInput = document.getElementById("rev-rating");
    if (!starContainer || !ratingInput) return;

    const stars = starContainer.querySelectorAll(".star-item");
    
    function highlightStars(val) {
        stars.forEach((star, idx) => {
            if (idx < val) {
                star.style.color = "#fbbf24";
            } else {
                star.style.color = "var(--text-muted)";
            }
        });
    }

    stars.forEach(star => {
        star.addEventListener("click", () => {
            const val = parseInt(star.getAttribute("data-val"), 10);
            ratingInput.value = val;
            highlightStars(val);
        });

        star.addEventListener("mouseover", () => {
            const val = parseInt(star.getAttribute("data-val"), 10);
            highlightStars(val);
        });

        star.addEventListener("mouseleave", () => {
            const currentVal = parseInt(ratingInput.value, 10);
            highlightStars(currentVal);
        });
    });

    highlightStars(5);
}

// 3.6. Dynamic Testimonial Review Form Submissions
function setupReviewFormToggle() {
    const btn = document.getElementById("toggle-review-form-btn");
    const card = document.getElementById("public-review-form-card");
    const cancelBtn = document.getElementById("rev-cancel-btn");
    const form = document.getElementById("public-review-form");
    
    if (!btn || !card) return;

    btn.addEventListener("click", () => {
        if (card.style.display === "none" || !card.style.display) {
            card.style.display = "block";
            btn.style.display = "none";
            card.scrollIntoView({ behavior: "smooth" });
        } else {
            card.style.display = "none";
        }
    });

    if (cancelBtn) {
        cancelBtn.addEventListener("click", () => {
            card.style.display = "none";
            btn.style.display = "inline-block";
            if (form) form.reset();
            const ratingInput = document.getElementById("rev-rating");
            if (ratingInput) ratingInput.value = "5";
            const stars = document.querySelectorAll("#star-rating-selector .star-item");
            stars.forEach(s => s.style.color = "#fbbf24");
        });
    }

    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const name = document.getElementById("rev-name").value.trim();
            const role = document.getElementById("rev-role").value.trim();
            const rating = parseInt(document.getElementById("rev-rating").value, 10);
            const text = document.getElementById("rev-text").value.trim();
            const audioUrl = document.getElementById("rev-audio").value.trim();
            const videoUrl = document.getElementById("rev-video").value.trim();
            const attachUrl = document.getElementById("rev-attach").value.trim();

            const db = getDB();
            db.testimonials = db.testimonials || [];
            
            const newTestimonial = {
                id: "test-" + Date.now(),
                name: name,
                role: role,
                rating: rating,
                text: text,
                avatar: "",
                audioUrl: audioUrl,
                videoUrl: videoUrl,
                attachUrl: attachUrl
            };

            db.testimonials.push(newTestimonial);
            saveDB(db);

            // Re-render testimonials slider
            setupTestimonials();
            
            alert(`Thank you, ${name}! Your review has been successfully published in the FZ Media slider!`);
            
            form.reset();
            card.style.display = "none";
            btn.style.display = "inline-block";
        });
    }
}

// 4. Cinema player Overlay logic
function setupCinemaModal() {
    const modal = document.getElementById("video-modal");
    const modalPlayer = document.getElementById("video-modal-player");
    const closeBtn = document.getElementById("video-modal-close");
    
    if (!modal || !modalPlayer || !closeBtn) return;

    // Helper to get robust Embed URL (YouTube with Shorts, or Vimeo)
    function getEmbedUrl(url) {
        if (!url) return null;
        url = url.trim();
        
        // 1. YouTube Parsing (Standard, Embed, Mobile, or Shorts)
        let ytId = null;
        if (url.includes("/shorts/")) {
            const parts = url.split("/shorts/");
            if (parts[1]) {
                ytId = parts[1].split(/[?#&]/)[0];
            }
        } else {
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
            const match = url.match(regExp);
            if (match && match[2].length === 11) {
                ytId = match[2];
            }
        }
        if (!ytId && (url.includes("youtube.com") || url.includes("youtu.be"))) {
            try {
                const urlObj = new URL(url);
                if (urlObj.searchParams.has("v")) {
                    ytId = urlObj.searchParams.get("v");
                } else {
                    const pathname = urlObj.pathname;
                    const pathParts = pathname.split("/");
                    const lastPart = pathParts[pathParts.length - 1];
                    if (lastPart && lastPart.length === 11) {
                        ytId = lastPart;
                    }
                }
            } catch (e) {
                console.log("Error parsing URL parameters:", e);
            }
        }
        if (ytId && ytId.length === 11) {
            return `https://www.youtube.com/embed/${ytId}?autoplay=1&enablejsapi=1&origin=${window.location.origin}&rel=0`;
        }
        
        // 2. Vimeo Parsing
        const vimeoRegExp = /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/;
        const vimeoMatch = url.match(vimeoRegExp);
        if (vimeoMatch && vimeoMatch[3]) {
            return `https://player.vimeo.com/video/${vimeoMatch[3]}?autoplay=1`;
        }
        
        return null;
    }

    // Open function
    function openVideo(src) {
        const embedUrl = getEmbedUrl(src);
        let iframe = document.getElementById("video-modal-iframe");
        
        modal.classList.add("open");
        
        if (embedUrl) {
            // Hide local HTML5 video element
            modalPlayer.style.display = "none";
            modalPlayer.pause();
            modalPlayer.src = "";
            
            // Create or show iframe element
            if (!iframe) {
                iframe = document.createElement("iframe");
                iframe.id = "video-modal-iframe";
                iframe.className = "video-modal-player";
                iframe.style.width = "100%";
                iframe.style.height = "100%";
                iframe.style.border = "none";
                iframe.style.aspectRatio = "16/9";
                iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
                iframe.allowFullscreen = true;
                modalPlayer.parentElement.appendChild(iframe);
            }
            iframe.src = embedUrl;
            iframe.style.display = "block";
        } else {
            // Hide iframe if it exists
            if (iframe) {
                iframe.src = "";
                iframe.style.display = "none";
            }
            
            // Show and play local HTML5 video
            modalPlayer.style.display = "block";
            modalPlayer.src = src;
            modalPlayer.load();
            modalPlayer.play().catch(e => console.log("Video autoplay blocked by browser, click play manually."));
        }
    }

    // Close function
    function closeVideo() {
        modal.classList.remove("open");
        modalPlayer.pause();
        modalPlayer.src = "";
        const iframe = document.getElementById("video-modal-iframe");
        if (iframe) {
            iframe.src = "";
            iframe.style.display = "none";
        }
    }

    // Event listener for main VSL card play button
    const vslTrigger = document.getElementById("vsl-video-trigger");
    if (vslTrigger) {
        vslTrigger.addEventListener("click", () => {
            // Main VSL uses the dynamic video showreel file from DB settings
            const db = getDB();
            const videoSrc = (db.settings.heroVideo && db.settings.heroVideo.videoUrl) ? db.settings.heroVideo.videoUrl : "assets/videos/solo showreel.mp4";
            openVideo(videoSrc);
        });
    }

    // Event listeners for video review buttons and homepage portfolio cards
    document.addEventListener("click", (e) => {
        // Testimonials dynamic triggers
        const videoBtn = e.target.closest(".testimonial-video-preview-btn");
        if (videoBtn) {
            const videoSrc = videoBtn.getAttribute("data-video");
            if (videoSrc) openVideo(videoSrc);
            return;
        }

        // Portfolio cards dynamic triggers
        if (e.target.closest(".portfolio-like-btn")) {
            return; // let like handler process this
        }
        const card = e.target.closest(".portfolio-card");
        if (card) {
            const videoSrc = card.getAttribute("data-video");
            if (videoSrc) openVideo(videoSrc);
        }
    });

    // Close on click close button or overlay
    closeBtn.addEventListener("click", closeVideo);
    modal.addEventListener("click", (e) => {
        if (e.target === modal) closeVideo();
    });
}

// 5. Pricing Estimator Logic
function setupPricingEstimator() {
    const timeSlider = document.getElementById("est-time-slider");
    const timeVal = document.getElementById("est-time-val");
    const totalPriceEl = document.getElementById("est-total-price");
    const checkoutLink = document.getElementById("est-checkout-link");
    const complexityRadios = document.getElementsByName("complexity");

    if (!timeSlider || !timeVal || !totalPriceEl || !checkoutLink) return;

    // Load complexity labels dynamically from database
    const db = getDB();
    const calc = db.settings.calculator || {
        basePricePerMinute: 10,
        basicLabel: "Basic cuts & music",
        standardLabel: "Standard text & SFX",
        standardMultiplier: 20,
        premiumLabel: "Premium AE & Grading",
        premiumMultiplier: 50
    };

    // Mount labels onto index.html
    const basicLabelEl = document.getElementById("est-label-basic");
    const standardLabelEl = document.getElementById("est-label-standard");
    const premiumLabelEl = document.getElementById("est-label-premium");

    if (basicLabelEl) basicLabelEl.textContent = calc.basicLabel;
    if (standardLabelEl) standardLabelEl.textContent = calc.standardLabel;
    if (premiumLabelEl) premiumLabelEl.textContent = calc.premiumLabel;

    function calculatePrice() {
        const duration = parseInt(timeSlider.value, 10);
        timeVal.textContent = duration === 1 ? "1 minute" : `${duration} minutes`;

        let complexity = "basic";
        let multiplier = 0;
        
        for (const radio of complexityRadios) {
            if (radio.checked) {
                complexity = radio.value;
                break;
            }
        }

        if (complexity === "standard") {
            multiplier = parseInt(calc.standardMultiplier, 10);
        } else if (complexity === "premium") {
            multiplier = parseInt(calc.premiumMultiplier, 10);
        }

        const totalPrice = (duration * parseInt(calc.basePricePerMinute, 10)) + multiplier;
        totalPriceEl.textContent = `$${totalPrice}`;

        // Format parameters nicely for checkout
        const serviceParam = encodeURIComponent("Custom Video Production");
        const packageParam = encodeURIComponent(`Custom (${duration}m, ${complexity.charAt(0).toUpperCase() + complexity.slice(1)})`);
        checkoutLink.href = `checkout.html?service=${serviceParam}&package=${packageParam}&price=${totalPrice}`;
    }

    // Attach event listeners
    timeSlider.addEventListener("input", calculatePrice);
    
    complexityRadios.forEach(radio => {
        radio.addEventListener("change", calculatePrice);
    });

    // Run initial calculation on load
    calculatePrice();
}

// 6. Premium Scroll Reveal Animation Engine
function setupScrollReveal() {
    const revealElements = document.querySelectorAll(".reveal-on-scroll");
    if (revealElements.length === 0) return;

    const observerOptions = {
        threshold: 0.05,
        rootMargin: "0px 0px -60px 0px" // triggers slightly before entering the viewport for perfect pacing
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("revealed");
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));

    // Force trigger hero elements immediately on load for instant visual appeal
    setTimeout(() => {
        const heroReveals = document.querySelectorAll(".hero-section .reveal-on-scroll");
        heroReveals.forEach(el => el.classList.add("revealed"));
    }, 100);
}

// 7. Load custom VSL hero video parameters dynamically from local database
function loadHeroVSLData() {
    const db = getDB();
    const s = db.settings;
    if (!s || !s.heroVideo) return;

    const vslTitle = document.getElementById("vsl-video-title");
    const vslThumbnail = document.getElementById("vsl-video-thumbnail");
    const vslDesc = document.getElementById("vsl-video-desc");

    if (vslTitle && s.heroVideo.title) {
        vslTitle.textContent = s.heroVideo.title;
    }
    if (vslThumbnail) {
        if (s.heroVideo.thumbnailUrl) {
            vslThumbnail.src = s.heroVideo.thumbnailUrl;
            vslThumbnail.style.display = "block";
        } else {
            vslThumbnail.src = "";
            vslThumbnail.style.display = "none";
        }
    }
    if (vslDesc && s.heroVideo.description) {
        vslDesc.textContent = s.heroVideo.description;
    }
}

// 8. Render Portfolio highlights dynamically on homepage
function setupHomePortfolio() {
    const grid = document.getElementById("home-portfolio-grid");
    if (!grid) return;

    const db = getDB();
    
    // Display the top 3 liked/featured portfolio items (first 3 items)
    const featuredItems = db.portfolio.slice(0, 3);

    grid.innerHTML = featuredItems.map(item => `
        <div class="glass-card portfolio-card" data-video="${item.videoUrl}">
            <div class="portfolio-thumbnail-wrapper">
                <img src="${encodeURI(item.thumbnail)}" alt="${item.title}" class="portfolio-img">
                <button class="portfolio-play-btn" aria-label="Play Portfolio Video">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                </button>
            </div>
            <div class="portfolio-card-info" style="display: flex; flex-direction: column; justify-content: space-between; min-height: 100px;">
                <div>
                    <span class="portfolio-card-category">${item.category}</span>
                    <h3 style="margin-top: 4px; font-size: 1.05rem; line-height: 1.45;">${item.title}</h3>
                </div>
                <div style="display: flex; justify-content: flex-end; align-items: center; margin-top: 10px; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 8px;">
                    <button class="portfolio-like-btn" data-id="${item.id}" style="background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border-color); color: var(--text-secondary); cursor: pointer; display: flex; align-items: center; gap: 6px; font-size: 0.82rem; padding: 5px 10px; border-radius: var(--radius-sm); transition: var(--transition-snappy);" aria-label="Like project">
                        <span class="heart-icon" style="color: #ef4444; font-size: 0.9rem; transition: transform 0.2s ease; display: inline-block;">❤️</span> 
                        <span class="likes-count" style="font-weight: 700; color: var(--text-secondary);">${item.likes || 0}</span>
                    </button>
                </div>
            </div>
        </div>
    `).join("");

    // Hook up home portfolio like trigger
    grid.addEventListener("click", (e) => {
        const likeBtn = e.target.closest(".portfolio-like-btn");
        if (likeBtn) {
            e.stopPropagation();
            const itemId = likeBtn.getAttribute("data-id");
            if (itemId) {
                const db = getDB();
                const item = db.portfolio.find(p => p.id === itemId);
                if (item) {
                    if (typeof item.likes === 'undefined') item.likes = 0;
                    item.likes += 1;
                    saveDB(db);
                    
                    // Update likes count in DOM immediately
                    const countEl = likeBtn.querySelector(".likes-count");
                    if (countEl) {
                        countEl.textContent = item.likes;
                    }
                    
                    // Trigger a bounce micro-animation on heart
                    const heart = likeBtn.querySelector(".heart-icon");
                    if (heart) {
                        heart.style.transform = "scale(1.4) rotate(-15deg)";
                        setTimeout(() => {
                            heart.style.transform = "scale(1) rotate(0deg)";
                        }, 200);
                    }
                }
            }
        }
    });
}

