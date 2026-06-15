/* FZ Media - Global State Engine & Persistent Database */

// 1. Initial Seeding Setup
const DEFAULT_BRAND_DATA = {
    settings: {
        agencyName: "FZ Media",
        agencyFullName: "Frame Zone Media",
        logoPath: "assets/img/logo/FZ logo.png",
        logoIconPath: "assets/img/logo/FZ logo.ico",
        primaryColorH: 267,
        primaryColorS: 90,
        primaryColorL: 61,
        secondaryColorH: 185,
        secondaryColorS: 90,
        secondaryColorL: 50,
        ctaLink: "contact.html",
        theme: "default",
        themePreset: "midnight",
        glowIntensity: 1.0,
        glowAnimationSpeed: 3.0,
        cardBorderRadius: 12,
        cardBorderThickness: 1,
        cardGlassBlur: 16,
        fontPreset: "minimal-slate",
        layoutGaps: 30,
        sectionPadding: 80,
        headerStyle: "floating-glass",
        // Fine-tuned background & card variables
        customBgH: 240,
        customBgS: 10,
        customBgL: 3,
        customCardL: 5,
        customCardA: 0.4,
        customBorderH: 240,
        customBorderA: 0.08,
        customGlowH: 267,
        customGlowS: 90,
        textColorPrimary: "#f8fafc",
        textColorSecondary: "#94a3b8",
        textColorMuted: "#64748b",

        adminCredentials: {
            email: "admin",
            passwordHash: "YWRtaW4=" // Base64 for admin
        },
        socialLinks: {
            facebook: "https://www.facebook.com/FZoneM",
            instagram: "https://www.instagram.com/frame.zone.media/",
            linkedin: "https://www.linkedin.com/in/fz-media/",
            fiverr: "https://www.fiverr.com/fz_media",
            upwork: "https://www.upwork.com/freelancers/~0142030ef402084057?mp_source=share",
            whatsapp: "https://wa.me/8801635333356"
        },
        heroVideo: {
            title: "Watch FZ Showreel",
            description: "Targeted VSL templates, product focus, and Call to Actions",
            videoUrl: "assets/videos/solo showreel.mp4",
            thumbnailUrl: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&w=1000&q=80"
        },
        calculator: {
            basePricePerMinute: 10,
            basicLabel: "Basic cuts & music",
            standardLabel: "Standard text & SFX",
            standardMultiplier: 20,
            premiumLabel: "Premium AE & Grading",
            premiumMultiplier: 50
        },
        bgType: "preset",
        bgImageUrl: "",
        bgEffect: "kinetic-orbs",
        characterEnabled: true,
        characterAvatar: "rifat-cinematic",
        characterPos: "right-bottom"
    },
    navLinks: [
        { text: "Home", url: "index.html" },
        { text: "About", url: "about.html" },
        { text: "Services", url: "services.html" },
        { text: "Portfolio", url: "work.html" },
        { text: "Contact", url: "contact.html" }
    ],
    team: [
        {
            id: "team-1",
            name: "Protik Hasan",
            role: "Founder",
            title: "Motion & SaaS Expert",
            experience: "5+ Years",
            image: "assets/img/team/Protik.png",
            skills: "Adobe After Effects, Cinema 4D, 2D/3D Animation, SaaS Promo Videos, Explainer Visuals"
        },
        {
            id: "team-2",
            name: "Rifat Khan",
            role: "Manager",
            title: "Professional Video Editor",
            experience: "5+ Years",
            image: "assets/img/team/Protik 2.png",
            skills: "Adobe Premiere Pro, Cinematic Cuts, Sound Design, Color Grading, Client Coordination"
        },
        {
            id: "team-3",
            name: "Toimur Khan",
            role: "Member",
            title: "Graphics Designer Expert",
            experience: "3+ Years",
            image: "",
            skills: "Photoshop, Illustrator, Vector Art, Brand Identity, Title Typography Design"
        },
        {
            id: "team-4",
            name: "Rajib Islam",
            role: "Member",
            title: "Cinematographer",
            experience: "4+ Years",
            image: "",
            skills: "Drone Piloting, Camera Movements, Stabilizing, Lighting, Action Sequence Shooting"
        }
    ],
    services: [
        {
            id: "srv-1",
            name: "Podcast Editing",
            subtitle: "Turn your podcast into polished ready-to-stream visual content for maximum listener retention.",
            packages: [
                {
                    name: "Basic",
                    price: 40,
                    delivery: "2-Day Delivery",
                    revisions: "1 Revision",
                    features: ["Edit up to 60 min episode", "Clean intro/outro assembly", "Noise, hum & pop removal", "Speakers volume leveling", "Ready-to-upload master file"]
                },
                {
                    name: "Advanced",
                    price: 65,
                    delivery: "2-Day Delivery",
                    revisions: "2 Revisions",
                    features: ["All Basic features included", "Filler word removal (ums, ahs, pauses)", "Tighter pacing & pacing cleanup", "Awkward silence trimming", "High retention audio mastering"]
                },
                {
                    name: "Premium Growth",
                    price: 100,
                    delivery: "3-Day Delivery",
                    revisions: "3 Revisions",
                    features: ["All Advanced features included", "4 short social media clips (Shorts/TikTok)", "1 branded audiogram video file", "Interactive captioning & subtitles", "Animated waveform for visual punch"]
                }
            ]
        },
        {
            id: "srv-2",
            name: "Cinematic Video Editing",
            subtitle: "Corporate promos, social media hooks, event highlights, and highly engaging YouTube contents.",
            packages: [
                {
                    name: "Basic",
                    price: 25,
                    delivery: "3-Day Delivery",
                    revisions: "2 Revisions",
                    features: ["Up to 15 mins raw footage", "2 min final runtime edit", "Simple music & transition syncing", "Title card templates", "Standard HD rendering"]
                },
                {
                    name: "Standard+",
                    price: 70,
                    delivery: "4-Day Delivery",
                    revisions: "3 Revisions",
                    features: ["Up to 15 mins raw footage", "5 min final runtime edit", "Motion graphics integration", "Custom sound effects design", "Sleek animated text layers"]
                },
                {
                    name: "Premium",
                    price: 150,
                    delivery: "4-Day Delivery",
                    revisions: "3 Revisions",
                    features: ["Up to 15 mins raw footage", "10 min final runtime edit", "Full color correction & cinematic grading", "Accurate manual subtitles (.SRT)", "Premium visual effects overlays", "Full 4K Ultra HD render"]
                }
            ]
        },
        {
            id: "srv-3",
            name: "Motion Graphics (AE)",
            subtitle: "Custom-crafted visual animations designed and stylized directly in Adobe After Effects.",
            packages: [
                {
                    name: "Short Video",
                    price: 30,
                    delivery: "2-Day Delivery",
                    revisions: "1 Revision",
                    features: ["Up to 15 seconds runtime", "High impact vector animation", "Modern sound effects design", "Custom brand color matching", "100% Satisfaction guarantee"]
                },
                {
                    name: "Medium Length",
                    price: 50,
                    delivery: "2-Day Delivery",
                    revisions: "2 Revisions",
                    features: ["Up to 30 seconds runtime", "Smooth keyframe kinetic transitions", "Intros/Outros logo animations", "Interactive UI/Website mockups", "Professional audio mix integration"]
                },
                {
                    name: "Long Video",
                    price: 90,
                    delivery: "4-Day Delivery",
                    revisions: "3 Revisions",
                    features: ["Up to 60 seconds full animation", "Premium detailed character/SaaS overlays", "Custom kinetic typography design", "After Effects master files delivered", "VIP direct support feedback"]
                }
            ]
        },
        {
            id: "srv-4",
            name: "Real Estate Drone Editing",
            subtitle: "High-end real estate drone footage stabilizing, location tracking, and property boundaries marking.",
            packages: [
                {
                    name: "Basic",
                    price: 35,
                    delivery: "2-Day Delivery",
                    revisions: "1 Revision",
                    features: ["30-sec HD promo video editing", "Pro drone footage stabilization", "Color correction filter (LUTS)", "Cinematic license-free music", "Basic text slide overlays"]
                },
                {
                    name: "Standard",
                    price: 55,
                    delivery: "3-Day Delivery",
                    revisions: "2 Revisions",
                    features: ["60-sec HD promo video editing", "Interactive 3D location tracking pins", "Animated site boundary markings", "Professional sound design & master", "Sleek contact call-to-action slides"]
                },
                {
                    name: "Premium",
                    price: 120,
                    delivery: "4-Day Delivery",
                    revisions: "3 Revisions",
                    features: ["60-sec 4K UHD premium rendering", "Google Earth customized flyover map", "Detailed surrounding points of interest highlights", "Premium cinematic color grading", "Free matching thumbnail layout"]
                }
            ]
        }
    ],
    portfolioTabs: ["All", "YouTube Videos", "Shorts & Reels", "SaaS Videos", "Ad Creatives & VSL"],
    portfolio: [
        {
            id: "port-1",
            title: "The Solo Content Creator Showreel",
            category: "YouTube Videos",
            videoUrl: "assets/videos/solo showreel.mp4",
            thumbnail: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=600&q=80",
            likes: 124
        },
        {
            id: "port-2",
            title: "Kinetic Typography Logo Reveal V4",
            category: "Ad Creatives & VSL",
            videoUrl: "assets/videos/logo animation.mp4",
            thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
            likes: 98
        },
        {
            id: "port-3",
            title: "Real Estate Property Drone Highlighting",
            category: "Shorts & Reels",
            videoUrl: "assets/videos/Social Proof.mp4", // fallback local file
            thumbnail: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&q=80",
            likes: 156
        },
        {
            id: "port-4",
            title: "Corporate SaaS Promotion & Ad Edit",
            category: "SaaS Videos",
            videoUrl: "assets/videos/VID 1.mp4",
            thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
            likes: 210
        },
        {
            id: "port-5",
            title: "Cinematic Typographic Storytelling V2",
            category: "YouTube Videos",
            videoUrl: "assets/videos/Typo Graphy 1.mp4",
            thumbnail: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80",
            likes: 85
        },
        {
            id: "port-6",
            title: "Client Testimonial Speech Integration",
            category: "Ad Creatives & VSL",
            videoUrl: "assets/videos/Social Proof.mp4",
            thumbnail: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80",
            likes: 142
        }
    ],
    clients: [
        {
            email: "client@gmail.com",
            password: "client123",
            name: "John Doe",
            company: "Apex Tech Inc.",
            activeSub: "Premium Growth Podcast Editing",
            packageLimits: "2 of 4 Video Drafts remaining this month",
            projects: [
                {
                    id: "cp-1",
                    title: "Apex Podcast Episode 12 - Marketing Hacks",
                    status: "First Cut Editing",
                    progress: 60,
                    deliveryDate: "May 27, 2026",
                    videoUrl: "assets/videos/VID 1.mp4",
                    revisions: [
                        { time: "00:15", text: "Please fade the background music here so speakers are louder", resolved: false }
                    ],
                    obsStream: {
                        active: false,
                        server: "rtmp://live.framezonemedia.com/live",
                        key: "fz_live_apex_ep12"
                    }
                },
                {
                    id: "cp-2",
                    title: "Apex Promo Teaser - Product Launch 9:16",
                    status: "Delivered",
                    progress: 100,
                    deliveryDate: "May 20, 2026",
                    videoUrl: "assets/videos/Social Proof.mp4",
                    revisions: [],
                    obsStream: {
                        active: false,
                        server: "rtmp://live.framezonemedia.com/live",
                        key: "fz_live_apex_promo"
                    }
                }
            ],
            briefs: []
        }
    ],
    inbox: [],
    testimonials: [
        {
            id: "test-1",
            name: "Nick Barner",
            role: "Content Creator",
            text: "Honestly, FZ Media are the absolute best in the game. The rapid turnarounds and dynamic revisions are unmatched, and I highly recommend them for any scaling venture.",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
            videoUrl: "assets/videos/Social Proof.mp4",
            rating: 5,
            audioUrl: "",
            attachUrl: ""
        },
        {
            id: "test-2",
            name: "Spencer Pawliw",
            role: "Skool Games Winner",
            text: "I have nothing but great things to say about their workflow. FZ Media definitely helped me kickstart everything that I've done successfully on YouTube and TikTok.",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
            videoUrl: "assets/videos/solo showreel.mp4",
            rating: 5,
            audioUrl: "",
            attachUrl: ""
        },
        {
            id: "test-3",
            name: "Josh Faulkner",
            role: "Ed-tech Entrepreneur",
            text: "Frame Zone Media is the most reliable visual editing partner you could ever ask for to manage your brand creation. Transparent timelines, outstanding motions.",
            avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80",
            videoUrl: "assets/videos/Typo Graphy 1.mp4",
            rating: 5,
            audioUrl: "",
            attachUrl: ""
        }
    ]
};

// 2. Database Fetch & Load
function getDB() {
    let db = localStorage.getItem("fzmedia_db");
    if (!db) {
        localStorage.setItem("fzmedia_db", JSON.stringify(DEFAULT_BRAND_DATA));
        return DEFAULT_BRAND_DATA;
    }
    
    let parsed;
    try {
        parsed = JSON.parse(db);
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
            throw new Error("Invalid database root format");
        }
    } catch(e) {
        console.error("Corrupted database detected in localStorage, re-seeding factory defaults", e);
        localStorage.setItem("fzmedia_db", JSON.stringify(DEFAULT_BRAND_DATA));
        return DEFAULT_BRAND_DATA;
    }
    
    // Deep self-healing merge helper to safely populate nested missing collections/keys
    function deepMerge(target, source) {
        let changed = false;
        for (let key in source) {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                if (!target[key] || typeof target[key] !== 'object' || Array.isArray(target[key])) {
                    target[key] = JSON.parse(JSON.stringify(source[key]));
                    changed = true;
                } else {
                    if (deepMerge(target[key], source[key])) {
                        changed = true;
                    }
                }
            } else {
                if (target[key] === undefined || target[key] === null || (Array.isArray(source[key]) && (!Array.isArray(target[key]) || target[key].length === 0))) {
                    target[key] = JSON.parse(JSON.stringify(source[key]));
                    changed = true;
                }
            }
        }
        return changed;
    }

    const needsSave = deepMerge(parsed, DEFAULT_BRAND_DATA);

    // Migrate logo icon path if using old default file
    if (parsed.settings && parsed.settings.logoIconPath === "assets/img/logo/FZ logo 1.png") {
        parsed.settings.logoIconPath = "assets/img/logo/FZ logo.ico";
        localStorage.setItem("fzmedia_db", JSON.stringify(parsed));
    }

    if (needsSave) {
        localStorage.setItem("fzmedia_db", JSON.stringify(parsed));
    }

    return parsed;
}

function saveDB(data) {
    localStorage.setItem("fzmedia_db", JSON.stringify(data));
}

// 3. Inject CSS Theme Colors & Premium Layout Styles Dynamically
function injectTheme() {
    const data = getDB();
    const s = data.settings;
    
    // Core accent hues
    document.documentElement.style.setProperty('--accent-primary-h', s.primaryColorH);
    document.documentElement.style.setProperty('--accent-primary-s', s.primaryColorS + '%');
    document.documentElement.style.setProperty('--accent-primary-l', s.primaryColorL + '%');

    document.documentElement.style.setProperty('--accent-secondary-h', s.secondaryColorH);
    document.documentElement.style.setProperty('--accent-secondary-s', s.secondaryColorS + '%');
    document.documentElement.style.setProperty('--accent-secondary-l', s.secondaryColorL + '%');

    // Advanced design dynamic properties overrides
    document.documentElement.style.setProperty('--glow-intensity', s.glowIntensity !== undefined ? s.glowIntensity : 1.0);
    document.documentElement.style.setProperty('--glow-speed', (s.glowAnimationSpeed !== undefined ? s.glowAnimationSpeed : 3.0) + 's');
    document.documentElement.style.setProperty('--card-glow-spread', (s.glowSpread !== undefined ? s.glowSpread : 15) + 'px');
    document.documentElement.style.setProperty('--radius-md', (s.cardBorderRadius !== undefined ? s.cardBorderRadius : 12) + 'px');
    document.documentElement.style.setProperty('--radius-lg', ((s.cardBorderRadius !== undefined ? s.cardBorderRadius : 12) + 4) + 'px');
    document.documentElement.style.setProperty('--border-thickness', (s.cardBorderThickness !== undefined ? s.cardBorderThickness : 1) + 'px');
    document.documentElement.style.setProperty('--glass-blur', (s.cardGlassBlur !== undefined ? s.cardGlassBlur : 16) + 'px');
    document.documentElement.style.setProperty('--grid-gap', (s.layoutGaps !== undefined ? s.layoutGaps : 30) + 'px');
    document.documentElement.style.setProperty('--section-padding', (s.sectionPadding !== undefined ? s.sectionPadding : 80) + 'px 0');

    // Advanced HSL Background & Card customization properties
    const bgH = s.customBgH !== undefined ? s.customBgH : 240;
    const bgS = s.customBgS !== undefined ? s.customBgS : 10;
    const bgL = s.customBgL !== undefined ? s.customBgL : 3;
    document.documentElement.style.setProperty('--bg-primary', `hsl(${bgH}, ${bgS}%, ${bgL}%)`);

    const cardL = s.customCardL !== undefined ? s.customCardL : 5;
    const cardA = s.customCardA !== undefined ? s.customCardA : 0.4;
    document.documentElement.style.setProperty('--card-bg-custom', `hsla(${bgH}, ${bgS + 5}%, ${cardL}%, ${cardA})`);

    const borderH = s.customBorderH !== undefined ? s.customBorderH : 240;
    const borderA = s.customBorderA !== undefined ? s.customBorderA : 0.08;
    document.documentElement.style.setProperty('--border-color-custom', `hsla(${borderH}, 20%, 80%, ${borderA})`);

    const glowH = s.customGlowH !== undefined ? s.customGlowH : s.primaryColorH;
    const glowS = s.customGlowS !== undefined ? s.customGlowS : 90;
    document.documentElement.style.setProperty('--glow-color-custom', `hsla(${glowH}, ${glowS}%, 50%, 0.15)`);

    // Set dynamic text colors [NEW]
    document.documentElement.style.setProperty('--text-primary', s.textColorPrimary || '#f8fafc');
    document.documentElement.style.setProperty('--text-secondary', s.textColorSecondary || '#94a3b8');
    document.documentElement.style.setProperty('--text-muted', s.textColorMuted || '#64748b');

    // Advanced typography overrides loader
    const fontPreset = s.fontPreset || "minimal-slate";
    if (fontPreset === "cyberpunk") {
        document.documentElement.style.setProperty('--font-headings', "'Courier New', Courier, monospace");
        document.documentElement.style.setProperty('--font-body', "'Courier New', Courier, monospace");
    } else if (fontPreset === "tech-modern") {
        document.documentElement.style.setProperty('--font-headings', "'Roboto', sans-serif");
        document.documentElement.style.setProperty('--font-body', "'Roboto', sans-serif");
    } else { // minimal-slate (Outfit + Plus Jakarta)
        document.documentElement.style.setProperty('--font-headings', "'Outfit', sans-serif");
        document.documentElement.style.setProperty('--font-body', "'Plus Jakarta Sans', sans-serif");
    }

    // Dynamic Multi-Page Layout Themes Engine [NEW]
    const activeTheme = s.theme || "default";
    
    // Remove existing layout classes
    document.body.classList.remove("theme-liquid", "theme-saas", "theme-gradient", "theme-flat");
    
    if (activeTheme === "liquid") {
        document.body.classList.add("theme-liquid");
        
        // Inject organic moving background blobs for Liquid Theme
        if (!document.querySelector(".liquid-bg-blob")) {
            const blob1 = document.createElement("div");
            blob1.className = "liquid-bg-blob blob-1";
            const blob2 = document.createElement("div");
            blob2.className = "liquid-bg-blob blob-2";
            document.body.appendChild(blob1);
            document.body.appendChild(blob2);
        }
    } else {
        // Clear any blobs if not active
        document.querySelectorAll(".liquid-bg-blob").forEach(el => el.remove());
        
        if (activeTheme === "saas") {
            document.body.classList.add("theme-saas");
        } else if (activeTheme === "gradient") {
            document.body.classList.add("theme-gradient");
        } else if (activeTheme === "flat") {
            document.body.classList.add("theme-flat");
        }
    }

    // Apply Active Global Theme Preset classes
    const preset = s.themePreset || "midnight";
    document.body.classList.remove(
        "theme-preset-preset-3d", 
        "theme-preset-preset-3d-anim", 
        "theme-preset-preset-glass-glow", 
        "theme-preset-preset-motion", 
        "theme-preset-preset-cyberpunk",
        "theme-preset-preset-neon-saas",
        "theme-preset-preset-cyber-command",
        "theme-preset-preset-luxury-gold",
        "theme-preset-preset-aurora-liquid",
        "theme-preset-midnight",
        "theme-preset-aurora",
        "theme-preset-minimal"
    );
    document.body.classList.add(`theme-preset-${preset}`);

    // Dynamic theme assets clean up & injection
    document.querySelectorAll(".kinetic-orbs-container, .cyberpunk-scanline-overlay, .motion-marquee-bar, .luxury-dust-particle").forEach(el => el.remove());

    // Inject marquee bar for preset-aurora-liquid globally
    if (preset === "preset-aurora-liquid") {
        const marquee = document.createElement("div");
        marquee.className = "motion-marquee-bar";
        marquee.innerHTML = `
            <div class="marquee-track">
                <span>⚡ HIGH-RETENTION CREATIVE VIDEO PRODUCTION ⚡ EXTREME DESIGN SPEED ⚡ SEAMLESS MOTION RENDERS ⚡ INSTANT STYLE CODES ⚡ OBS LIVE EDITING SESSIONS ⚡</span>
                <span>⚡ HIGH-RETENTION CREATIVE VIDEO PRODUCTION ⚡ EXTREME DESIGN SPEED ⚡ SEAMLESS MOTION RENDERS ⚡ INSTANT STYLE CODES ⚡ OBS LIVE EDITING SESSIONS ⚡</span>
            </div>
        `;
        document.body.insertBefore(marquee, document.body.firstChild);
    }

    // Custom Background System & Link Sharing Engine [NEW]
    document.body.classList.remove("custom-image-bg-active");
    document.body.style.backgroundImage = "";

    if (s.bgType === "image" && s.bgImageUrl) {
        document.body.classList.add("custom-image-bg-active");
        document.body.style.backgroundImage = `url('${encodeURI(s.bgImageUrl)}')`;
    } else if (s.bgType === "animation") {
        const effect = s.bgEffect || "kinetic-orbs";
        if (effect === "kinetic-orbs") {
            const orbsContainer = document.createElement("div");
            orbsContainer.className = "kinetic-orbs-container";
            orbsContainer.innerHTML = `
                <div class="kinetic-orb orb-1"></div>
                <div class="kinetic-orb orb-2"></div>
                <div class="kinetic-orb orb-3"></div>
            `;
            document.body.appendChild(orbsContainer);
            setTimeout(init3DCardTiltListener, 100);
        } else if (effect === "digital-scanlines") {
            const scanline = document.createElement("div");
            scanline.className = "cyberpunk-scanline-overlay";
            document.body.appendChild(scanline);
        } else if (effect === "luxury-dust") {
            for (let i = 0; i < 40; i++) {
                const p = document.createElement("div");
                p.className = "luxury-dust-particle";
                p.style.left = Math.random() * 100 + "vw";
                p.style.animationDelay = Math.random() * 15 + "s";
                p.style.animationDuration = (Math.random() * 10 + 10) + "s";
                p.style.transform = `scale(${Math.random() * 0.6 + 0.4})`;
                document.body.appendChild(p);
            }
        }
    } else {
        // Fallback: Apply Active Global Theme Preset standard assets
        if (preset === "preset-neon-saas") {
            const orbsContainer = document.createElement("div");
            orbsContainer.className = "kinetic-orbs-container";
            orbsContainer.innerHTML = `
                <div class="kinetic-orb orb-1"></div>
                <div class="kinetic-orb orb-2"></div>
                <div class="kinetic-orb orb-3"></div>
            `;
            document.body.appendChild(orbsContainer);
            setTimeout(init3DCardTiltListener, 100);
        } else if (preset === "preset-cyber-command") {
            const scanline = document.createElement("div");
            scanline.className = "cyberpunk-scanline-overlay";
            document.body.appendChild(scanline);
        } else if (preset === "preset-luxury-gold") {
            for (let i = 0; i < 40; i++) {
                const p = document.createElement("div");
                p.className = "luxury-dust-particle";
                p.style.left = Math.random() * 100 + "vw";
                p.style.animationDelay = Math.random() * 15 + "s";
                p.style.animationDuration = (Math.random() * 10 + 10) + "s";
                p.style.transform = `scale(${Math.random() * 0.6 + 0.4})`;
                document.body.appendChild(p);
            }
        }
    }

    // Interactive Character Injector [NEW]
    const characterContainerId = "fz-interactive-editor-character";
    let existingCharacter = document.getElementById(characterContainerId);
    if (s.characterEnabled) {
        const avatar = s.characterAvatar || "rifat-cinematic";
        const position = s.characterPos || "left-bottom";

        let headColor = "#090514";
        let visorColor = "var(--accent-primary)";
        let headphonesColor = "var(--accent-primary)";
        let handColor = "var(--accent-secondary)";

        if (avatar === "protik-motion") {
            visorColor = "var(--accent-secondary)";
            headphonesColor = "var(--accent-secondary)";
            handColor = "var(--accent-primary)";
        } else if (avatar === "neon-cyber") {
            visorColor = "#00ffcc";
            headphonesColor = "#ff007f";
            handColor = "#00ffcc";
        }

        if (!existingCharacter) {
            existingCharacter = document.createElement("div");
            existingCharacter.id = characterContainerId;
            document.body.appendChild(existingCharacter);
        }

        existingCharacter.className = position;
        existingCharacter.innerHTML = `
            <div class="editor-speech-bubble" id="char-speech-bubble">Hello! Let's build something beautiful today! 🎬</div>
            <svg class="editor-svg" viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg">
                <path class="editor-torso" d="M30 240 C30 180, 170 180, 170 240 Z" />
                <path class="editor-left-arm" d="M30 200 Q15 220, 10 240" stroke-width="8" stroke="var(--border-color-custom, rgba(255,255,255,0.15))" fill="none" />
                <g class="editor-right-arm-group">
                    <path class="editor-right-arm" d="M170 200 Q185 210, 180 230" stroke-width="10" stroke="${headphonesColor}" fill="none" />
                    <circle class="editor-hand" cx="180" cy="230" r="10" fill="${handColor}" />
                    <path class="editor-glowing-mouse" d="M175 225 L185 235" stroke-width="4" />
                </g>
                <rect class="editor-neck" x="90" y="145" width="20" height="20" rx="5" />
                <g class="editor-head-group">
                    <circle class="editor-head" cx="100" cy="100" r="50" fill="${headColor}" />
                    <path class="editor-headphones" d="M46 100 A54 54 0 0 1 154 100" stroke-width="12" stroke="${headphonesColor}" fill="none" />
                    <rect class="editor-headphone-ear cup-left" x="42" y="85" width="12" height="30" rx="6" fill="${headColor}" stroke="${headphonesColor}" stroke-width="1.5" />
                    <rect class="editor-headphone-ear cup-right" x="146" y="85" width="12" height="30" rx="6" fill="${headColor}" stroke="${headphonesColor}" stroke-width="1.5" />
                    <path class="editor-visor" d="M60 85 H140 V105 H60 Z" rx="10" stroke="${visorColor}" />
                    <g class="editor-eyes">
                        <ellipse class="editor-eye-outer eye-left" cx="80" cy="95" rx="12" ry="6" />
                        <circle class="editor-pupil pupil-left" cx="80" cy="95" r="4" />
                        <ellipse class="editor-eye-outer eye-right" cx="120" cy="95" rx="12" ry="6" />
                        <circle class="editor-pupil pupil-right" cx="120" cy="95" r="4" />
                    </g>
                    <path class="editor-mouth" d="M85 125 Q100 135, 115 125" fill="none" stroke-width="3" />
                </g>
            </svg>
        `;
    } else {
        if (existingCharacter) {
            existingCharacter.remove();
        }
    }
}

// Helper: 3D Mouse Card Tilt Parallax effect
function init3DCardTiltListener() {
    const cards = document.querySelectorAll(".glass-card, .client-project-card, .portfolio-card");
    cards.forEach(card => {
        card.addEventListener("mousemove", e => {
            if (!document.body.classList.contains("theme-preset-preset-neon-saas")) {
                card.style.transform = "";
                return;
            }
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((centerY - y) / centerY) * 8; // max 8 degrees tilt
            const rotateY = ((x - centerX) / centerX) * 8;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });
        
        card.addEventListener("mouseleave", () => {
            card.style.transform = "";
        });
    });
}

// 4. Inject Shared Navigation & Footer
function injectLayouts() {
    const db = getDB();
    const s = db.settings;
    
    // Inject Header if container exists
    const headerContainer = document.getElementById("global-header");
    if (headerContainer) {
        headerContainer.className = "sticky-header";
        if (s.headerStyle === 'floating-glass') {
            headerContainer.classList.add("header-floating-glass");
        } else if (s.headerStyle === 'centered') {
            headerContainer.classList.add("header-centered");
        }
        
        let logoMarkup = "";
        if (s.logoPath) {
            logoMarkup = `<img src="${encodeURI(s.logoPath)}" alt="${s.agencyName}" class="brand-logo-img" onerror="this.src='assets/img/logo/FZ%20logo.png'">`;
        } else {
            logoMarkup = `<span class="brand-name">${s.agencyName}</span>`;
        }

        const isAdminLogged = sessionStorage.getItem("fzmedia_admin_logged") === "true";
        let adminButtonMarkup = `<li><a href="admin.html" class="btn-primary" style="padding: 8px 16px; font-size: 0.88rem;">Admin</a></li>`;
        if (isAdminLogged) {
            adminButtonMarkup = `
                <li><a href="admin.html" class="btn-primary" style="padding: 8px 16px; font-size: 0.88rem;">Admin</a></li>
                <li><a href="#" id="global-admin-logout" class="btn-secondary" style="padding: 8px 16px; font-size: 0.88rem; border-color: rgba(239, 68, 68, 0.4); color: #f87171;">Logout</a></li>
            `;
        }

        let navLinksMarkup = db.navLinks.map(link => {
            let isActive = window.location.pathname.endsWith(link.url) ? "active" : "";
            if (window.location.pathname === "/" && link.url === "index.html") isActive = "active";
            return `<li><a href="${link.url}" class="nav-link-item ${isActive}">${link.text}</a></li>`;
        }).join("");

        headerContainer.innerHTML = `
            <div class="container">
                <div class="nav-wrapper">
                    <a href="index.html" class="brand-logo-container">
                        ${logoMarkup}
                    </a>
                    
                    <nav class="nav-menu">
                        <ul class="nav-menu-links" id="nav-menu-links">
                            ${navLinksMarkup}
                            <li><a href="client.html" class="btn-secondary" style="padding: 8px 16px; font-size: 0.88rem;">Client Portal</a></li>
                            ${adminButtonMarkup}
                        </ul>
                    </nav>

                    <button class="menu-toggle-btn" id="menu-toggle-btn" aria-label="Toggle Navigation">
                        <span class="menu-toggle-bar"></span>
                        <span class="menu-toggle-bar"></span>
                        <span class="menu-toggle-bar"></span>
                    </button>
                </div>
            </div>
        `;

        // Global Admin Logout Event
        const globalLogoutBtn = document.getElementById("global-admin-logout");
        if (globalLogoutBtn) {
            globalLogoutBtn.addEventListener("click", (e) => {
                e.preventDefault();
                if (confirm("Are you sure you want to exit your Admin session?")) {
                    sessionStorage.removeItem("fzmedia_admin_logged");
                    window.location.href = "index.html";
                }
            });
        }

        // Scroll sticky nav
        window.addEventListener("scroll", () => {
            if (window.scrollY > 50) {
                headerContainer.classList.add("scrolled");
            } else {
                headerContainer.classList.remove("scrolled");
            }
        });

        // Mobile toggle
        const toggleBtn = document.getElementById("menu-toggle-btn");
        const navMenu = document.getElementById("nav-menu-links");
        if (toggleBtn && navMenu) {
            toggleBtn.addEventListener("click", () => {
                toggleBtn.classList.toggle("open");
                navMenu.classList.toggle("open");
            });
        }
    }

    // Inject Footer if container exists
    const footerContainer = document.getElementById("global-footer");
    if (footerContainer) {
        footerContainer.className = "premium-footer";
        
        let logoMarkup = "";
        if (s.logoPath) {
            logoMarkup = `<img src="${encodeURI(s.logoPath)}" alt="${s.agencyName}" class="brand-logo-img" style="height: 48px;" onerror="this.src='assets/img/logo/FZ%20logo.png'">`;
        } else {
            logoMarkup = `<span class="brand-name" style="font-size: 1.8rem;">${s.agencyName}</span>`;
        }

        footerContainer.innerHTML = `
            <div class="container">
                <div class="footer-grid">
                    <div class="footer-brand-col">
                        <a href="index.html" class="brand-logo-container">
                            ${logoMarkup}
                        </a>
                        <p class="footer-description">
                            Delivering cinematic, high-retention video editing, premium motion graphics, and typography animations that scale audience reach on autopilot.
                        </p>
                        <div class="footer-social-icons">
                            <a href="${s.socialLinks.linkedin}" target="_blank" class="social-icon-btn"><i class="social-icon">IN</i></a>
                            <a href="${s.socialLinks.facebook}" target="_blank" class="social-icon-btn"><i class="social-icon">FB</i></a>
                            <a href="${s.socialLinks.instagram}" target="_blank" class="social-icon-btn"><i class="social-icon">IG</i></a>
                            <a href="${s.socialLinks.fiverr}" target="_blank" class="social-icon-btn"><i class="social-icon">FI</i></a>
                            <a href="${s.socialLinks.upwork}" target="_blank" class="social-icon-btn"><i class="social-icon">UP</i></a>
                            <a href="${s.socialLinks.whatsapp}" target="_blank" class="social-icon-btn" style="background: rgba(34,197,94,0.1); border-color: rgba(34,197,94,0.2);"><i class="social-icon" style="color: #4ade80;">WA</i></a>
                        </div>
                    </div>
                    
                    <div>
                        <h4 class="footer-col-title">Navigation</h4>
                        <ul class="footer-links-list">
                            <li><a href="index.html" class="footer-link-item">Home</a></li>
                            <li><a href="about.html" class="footer-link-item">About Team</a></li>
                            <li><a href="services.html" class="footer-link-item">Our Services</a></li>
                            <li><a href="work.html" class="footer-link-item">Portfolio Work</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 class="footer-col-title">Support Hub</h4>
                        <ul class="footer-links-list">
                            <li><a href="client.html" class="footer-link-item">Client Portal</a></li>
                            <li><a href="admin.html" class="footer-link-item">Admin Board</a></li>
                            <li><a href="contact.html" class="footer-link-item">Book Discovery Call</a></li>
                            <li><a href="contact.html" class="footer-link-item">Direct Inquiry</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 class="footer-col-title">Contact Office</h4>
                        <ul class="footer-links-list" style="gap: 10px; color: var(--text-secondary); font-size: 0.95rem;">
                            <li>📍 Frame Zone Media</li>
                            <li>Creative Hub Workspace</li>
                            <li>Email: framezonem@gmail.com</li>
                            <li>Direct Chat: +8801635-333356</li>
                        </ul>
                    </div>
                </div>

                <div class="footer-bottom">
                    <p>&copy; ${new Date().getFullYear()} ${s.agencyFullName}. All Rights Reserved.</p>
                    <p>Designed with High-Retention Aesthetics</p>
                </div>
            </div>
        `;
    }
}

// 5. Inject Floating Glassmorphic Q&A Chatbot
function injectChatbot() {
    // Check if chatbot container already exists
    if (document.getElementById("fz-chatbot-wrapper")) return;

    const wrapper = document.createElement("div");
    wrapper.id = "fz-chatbot-wrapper";
    wrapper.style.position = "fixed";
    wrapper.style.bottom = "30px";
    wrapper.style.right = "30px";
    wrapper.style.zIndex = "9999";
    
    // Custom Chatbot inline CSS
    const style = document.createElement("style");
    style.textContent = `
        .chatbot-btn {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%);
            border: 1px solid rgba(255,255,255,0.15);
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            cursor: pointer;
            box-shadow: 0 10px 30px var(--accent-primary-glow);
            transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
            position: relative;
        }
        .chatbot-btn:hover {
            transform: scale(1.08) translateY(-3px);
            box-shadow: 0 15px 40px rgba(var(--accent-primary-h), var(--accent-primary-s), 50%, 0.4);
        }
        .chatbot-btn .badge-ping {
            position: absolute;
            top: 2px;
            right: 2px;
            width: 14px;
            height: 14px;
            background: #ef4444;
            border-radius: 50%;
            border: 2px solid var(--bg-primary);
            animation: pulse-badge 1.8s infinite;
        }
        @keyframes pulse-badge {
            0% { transform: scale(0.9); opacity: 1; }
            50% { transform: scale(1.15); opacity: 0.8; }
            100% { transform: scale(0.9); opacity: 1; }
        }
        .chatbot-drawer {
            position: fixed;
            bottom: 105px;
            right: 30px;
            width: 380px;
            height: 520px;
            background: rgba(var(--bg-secondary-h), var(--bg-secondary-s), var(--bg-secondary-l), 0.85);
            backdrop-filter: blur(25px);
            -webkit-backdrop-filter: blur(25px);
            border: 1px solid var(--border-glow);
            border-radius: var(--radius-lg);
            box-shadow: 0 20px 50px rgba(0,0,0,0.5);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            z-index: 10000;
            transform: translateY(30px) scale(0.9);
            opacity: 0;
            pointer-events: none;
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .chatbot-drawer.open {
            transform: translateY(0) scale(1);
            opacity: 1;
            pointer-events: auto;
        }
        .chatbot-header {
            padding: 20px;
            background: rgba(255,255,255,0.02);
            border-bottom: 1px solid var(--border-color);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .chatbot-header h3 {
            font-size: 1.15rem;
            font-family: var(--font-body);
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .chatbot-status-dot {
            width: 8px;
            height: 8px;
            background: #4ade80;
            border-radius: 50%;
            display: inline-block;
            box-shadow: 0 0 10px #4ade80;
        }
        .chatbot-close-btn {
            background: none;
            border: none;
            font-size: 1.5rem;
            color: var(--text-secondary);
            cursor: pointer;
            line-height: 0;
            transition: var(--transition-snappy);
        }
        .chatbot-close-btn:hover {
            color: var(--text-primary);
        }
        .chatbot-body {
            flex-grow: 1;
            overflow-y: auto;
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 16px;
        }
        .chat-bubble {
            max-width: 80%;
            padding: 12px 16px;
            border-radius: var(--radius-md);
            font-size: 0.9rem;
            line-height: 1.45;
        }
        .chat-bubble.bot {
            background: rgba(255,255,255,0.03);
            border: 1px solid var(--border-color);
            align-self: flex-start;
            border-top-left-radius: 2px;
            color: var(--text-primary);
        }
        .chat-bubble.user {
            background: var(--accent-primary);
            color: var(--text-primary);
            align-self: flex-end;
            border-top-right-radius: 2px;
            box-shadow: 0 5px 15px var(--accent-primary-glow);
        }
        .chat-options-flex {
            display: flex;
            flex-direction: column;
            gap: 8px;
            margin-top: 6px;
        }
        .chat-option-btn {
            background: rgba(255,255,255,0.02);
            border: 1px solid var(--border-color);
            padding: 8px 14px;
            border-radius: var(--radius-sm);
            color: var(--text-primary);
            font-size: 0.82rem;
            font-weight: 600;
            text-align: left;
            cursor: pointer;
            transition: var(--transition-snappy);
        }
        .chat-option-btn:hover {
            background: var(--accent-primary-glow);
            border-color: var(--accent-primary);
            color: var(--accent-primary);
            padding-left: 18px;
        }
        .chatbot-footer {
            padding: 16px;
            border-top: 1px solid var(--border-color);
            background: rgba(0,0,0,0.1);
            display: flex;
            gap: 10px;
        }
        .chatbot-input {
            flex-grow: 1;
            background: rgba(0,0,0,0.2);
            border: 1px solid var(--border-color);
            border-radius: var(--radius-sm);
            padding: 10px 14px;
            color: #fff;
            font-size: 0.88rem;
        }
        .chatbot-input:focus {
            outline: none;
            border-color: var(--accent-primary);
        }
        .chatbot-send-btn {
            background: var(--accent-primary);
            border: none;
            color: #fff;
            padding: 0 16px;
            border-radius: var(--radius-sm);
            cursor: pointer;
            font-weight: 600;
            transition: var(--transition-snappy);
        }
        .chatbot-send-btn:hover {
            background: var(--accent-secondary);
        }
        @media (max-width: 480px) {
            .chatbot-drawer {
                width: calc(100vw - 40px);
                height: 480px;
                right: 20px;
                bottom: 95px;
            }
        }
    `;
    document.head.appendChild(style);

    wrapper.innerHTML = `
        <button class="chatbot-btn" id="fz-chatbot-btn" aria-label="Open Assistant">
            <span class="badge-ping"></span>
            <span class="chatbot-icon">💬</span>
        </button>
        
        <div class="chatbot-drawer" id="fz-chatbot-drawer">
            <div class="chatbot-header">
                <h3><span class="chatbot-status-dot"></span> Orin Support Team</h3>
                <button class="chatbot-close-btn" id="fz-chatbot-close">&times;</button>
            </div>
            
            <div class="chatbot-body" id="fz-chatbot-body">
                <div class="chat-bubble bot">
                    Hello! I am <strong>Orin</strong>, your dedicated <strong>Support Team Intelligence Agent</strong>. 🤖🎬<br><br>
                    I am here to help you engineer the perfect video production pipeline, onboard you seamlessly, and get your project started. What is your brand's niche/industry?
                    
                    <div class="chat-options-flex">
                        <button class="chat-option-btn" onclick="botSelectNiche('YouTube Creator')">🎥 YouTube Content Creator</button>
                        <button class="chat-option-btn" onclick="botSelectNiche('SaaS or Corporate Brand')">💻 SaaS / Corporate Brand</button>
                        <button class="chat-option-btn" onclick="botSelectNiche('Real Estate Broker')">🏢 Real Estate Broker</button>
                        <button class="chat-option-btn" onclick="botSelectNiche('Podcast Host')">🎙 Podcast Host</button>
                    </div>
                </div>
            </div>
            
            <div class="chatbot-footer">
                <input type="text" class="chatbot-input" id="fz-chatbot-input" placeholder="Type a message (e.g. options, package, pricing)...">
                <button class="chatbot-send-btn" id="fz-chatbot-send">Send</button>
            </div>
        </div>
    `;

    document.body.appendChild(wrapper);

    // Wire up open / close triggers
    const trigger = document.getElementById("fz-chatbot-btn");
    const drawer = document.getElementById("fz-chatbot-drawer");
    const closeBtn = document.getElementById("fz-chatbot-close");
    const sendBtn = document.getElementById("fz-chatbot-send");
    const textInput = document.getElementById("fz-chatbot-input");

    if (trigger && drawer && closeBtn) {
        trigger.addEventListener("click", () => {
            drawer.classList.toggle("open");
            // Clear ping badge once opened
            const ping = trigger.querySelector(".badge-ping");
            if (ping) ping.style.display = "none";
        });
        
        closeBtn.addEventListener("click", () => {
            drawer.classList.remove("open");
        });
    }

    // Input handlers
    if (sendBtn && textInput) {
        sendBtn.addEventListener("click", handleChatbotInputSubmit);
        textInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") handleChatbotInputSubmit();
        });
    }
}

// Chatbot Flow Parameters
let botState = {
    niche: "",
    assets: "",
    deadline: "",
    budget: ""
};

window.botSelectNiche = function(niche) {
    botState.niche = niche;
    appendUserBubble(niche);
    
    let compliment = "";
    if (niche.includes("YouTube")) {
        compliment = `Excellent choice! For digital video platforms, high-retention hook dynamics (especially within the first 5 seconds) are the absolute key to scaling reach and organic traffic. Our editing systems are engineered around kinetic visual text pacing, retention-optimized transitions, and precise sound editing to keep viewers hooked to their screens from start to finish. Let's make your channel stand out!`;
    } else if (niche.includes("SaaS") || niche.includes("Corporate")) {
        compliment = `Incredible! B2B and SaaS brands require clean, high-production explainer videos. Ingesting smooth product mockups, keyframed zoom effects, and premium motion graphics has been shown to increase platform sign-ups and sales landing page conversions by over 80%. We ensure your dashboard and brand identity look highly premium, sleek, and polished.`;
    } else if (niche.includes("Real Estate")) {
        compliment = `Outstanding niche! High-end cinematic property tours depend on crystal-clear aerial sequences, seamless speed ramps, and professional color grading. We treat every single listing as an architectural work of art, applying precise property-line highlights and location tracking to ensure listings generate high-intent inquiries immediately.`;
    } else if (niche.includes("Podcast")) {
        compliment = `Fantastic space! The secret to a premium podcast isn't just voice clarity; it's tight conversational pacing, professional voice leveling, and extracting high-interest social media micro-clips (9:16 vertical reels) to capture organic audience loops across multiple platforms. We make sure your authority sounds completely flawless!`;
    }

    setTimeout(() => {
        appendBotBubble(`🤖 <strong>Orin Consultation Agent:</strong><br><br>
            <strong>${compliment}</strong><br><br>
            To customize our creative pipeline to your exact workflow, what primary raw footage assets do you typically produce?
            <div class="chat-options-flex">
                <button class="chat-option-btn" onclick="botSelectAssets('4K Camera A-Roll')">📸 High-Res Camera A-Roll</button>
                <button class="chat-option-btn" onclick="botSelectAssets('Drone raw clips')">🚁 Drone / Aerial Footage</button>
                <button class="chat-option-btn" onclick="botSelectAssets('Multi-mic audio files')">🎙️ Multi-mic Podcast Audio</button>
                <button class="chat-option-btn" onclick="botSelectAssets('Screen-records & Mockups')">🖥️ Screen Recordings & Mockups</button>
            </div>
        `);
    }, 800);
};

window.botSelectAssets = function(assets) {
    botState.assets = assets;
    appendUserBubble(assets);

    let feedback = "";
    if (assets.includes("A-Roll")) {
        feedback = "High-Res camera files are ideal for establishing personal authority. Our professional editing system applies three-way cinematic color grading, advanced background noise filtering, and speaker volume balance to deliver an elite final master.";
    } else if (assets.includes("Drone")) {
        feedback = "Incredible asset choice! We apply professional software warp stabilization, custom boundaries outlining, and high-precision 3D location-marker pins to draw viewer eyes to key property highlights.";
    } else if (assets.includes("Audio")) {
        feedback = "Podcast audio requires pristine phase alignment and loudness mastering. We'll strip hums, pops, and ambient background noises, then build custom animated waveforms that make your audio extremely engaging.";
    } else if (assets.includes("Screen")) {
        feedback = "SaaS product walks are highly effective! We clean up mouse cursors, add smooth dynamic zooms, customized UI pans, and elegant 3D canvas wraps to make your dashboard look absolutely stunning.";
    }

    setTimeout(() => {
        appendBotBubble(`🤖 <strong>Orin Consultation Agent:</strong><br><br>
            <strong>${feedback}</strong><br><br>
            What is your preferred project deadline? We prioritize and lock our calendar schedules to ensure rapid, high-quality turnarounds.
            <div class="chat-options-flex">
                <button class="chat-option-btn" onclick="botSelectDeadline('Express Delivery (2-3 Days)')">⚡ Urgent Express (2-3 Days)</button>
                <button class="chat-option-btn" onclick="botSelectDeadline('Standard Campaign (4-5 Days)')">📅 Standard Elite (4-5 Days)</button>
            </div>
        `);
    }, 800);
};

window.botSelectDeadline = function(deadline) {
    botState.deadline = deadline;
    appendUserBubble(deadline);

    setTimeout(() => {
        appendBotBubble(`🤖 <strong>Orin Consultation Agent:</strong><br><br>
            Got it! We'll prioritize our editing queues to meet a <strong>${deadline}</strong> turnaround with absolute precision. Every frame is supervised directly by our senior creative directors and lead motion designers to guarantee elite performance.<br><br>
            To match you with the ultimate package tier, what is your targeted investment level for this creative video project?
            <div class="chat-options-flex">
                <button class="chat-option-btn" onclick="botSelectBudget('Standard Creative ($100 - $250)')">💵 Standard Creative ($100 - $250)</button>
                <button class="chat-option-btn" onclick="botSelectBudget('Premium Scaler ($250 - $500)')">💳 Premium Scaler ($250 - $500)</button>
                <button class="chat-option-btn" onclick="botSelectBudget('Elite Growth Partner ($500+)')">🔥 Elite Growth Partner ($500+)</button>
            </div>
        `);
    }, 800);
};

window.botSelectBudget = function(budget) {
    botState.budget = budget;
    appendUserBubble(budget);

    setTimeout(() => {
        // Run diagnosis recommendation
        let recommendedService = "Cinematic Video Editing";
        let recommendedPackage = "Premium";
        let srvIndex = 1; // Default
        
        if (botState.niche.includes("Podcast") || botState.assets.includes("Podcast")) {
            recommendedService = "Podcast Editing";
            recommendedPackage = botState.budget.includes("Standard") ? "Advanced" : "Premium Growth";
            srvIndex = 0;
        } else if (botState.assets.includes("Drone")) {
            recommendedService = "Real Estate Drone Editing";
            recommendedPackage = botState.budget.includes("Standard") ? "Standard" : "Premium";
            srvIndex = 3;
        } else if (botState.niche.includes("SaaS") || botState.budget.includes("500") || botState.budget.includes("250")) {
            recommendedService = "Motion Graphics (AE)";
            recommendedPackage = botState.budget.includes("Standard") ? "Medium Length" : "Long Video";
            srvIndex = 2;
        } else {
            recommendedService = "Cinematic Video Editing";
            recommendedPackage = botState.budget.includes("Standard") ? "Standard+" : "Premium";
            srvIndex = 1;
        }

        const db = getDB();
        const srv = db.services[srvIndex];
        const pkg = srv.packages.find(p => p.name === recommendedPackage || p.name.includes(recommendedPackage));
        const price = pkg ? pkg.price : 150;

        if (botState.budget.includes("$500+")) {
            appendBotBubble(`🤖 <strong>Orin Consultation Agent:</strong><br><br>
                🎉 <strong>Onboarding Diagnosis Complete!</strong><br><br>
                Based on your premium vision, we highly recommend our custom **Elite Growth Retainer Suite**.<br><br>
                As an <strong>Elite Growth Partner</strong>, you gain:<br>
                🌟 VIP Priority Queue directly with our Senior Directors and Lead Editors<br>
                🚀 High-End Custom Motion graphics, dynamic audio designs, and color-graded cinematic masters<br>
                🔄 Unlimited revisions handled in our high-end timestamp Frame-by-Frame Revision Hub<br><br>
                Let's secure your project slot or book a direct premium consultation right now to get started!<br><br>
                <a href="checkout.html?service=${encodeURIComponent(recommendedService)}&package=${encodeURIComponent(recommendedPackage)}&price=${price}" class="btn-primary" style="display: block; text-align: center; font-size: 0.85rem; padding: 10px; margin-bottom: 10px;">Proceed to Elite Checkout ➔</a>
                <a href="contact.html" class="btn-secondary" style="display: block; text-align: center; font-size: 0.85rem; padding: 10px;">Book VIP Discovery Call 📞</a>
            `);
        } else {
            appendBotBubble(`🤖 <strong>Orin Consultation Agent:</strong><br><br>
                🎉 <strong>Onboarding Diagnosis Complete!</strong><br><br>
                Based on your parameters, we highly recommend our premium **${recommendedService} (${recommendedPackage} Tier)**.<br><br>
                🔹 <strong>Tier Level:</strong> ${recommendedPackage} Production Suite<br>
                🔹 <strong>Target Price:</strong> $${price}<br>
                🔹 <strong>Features Included:</strong> ${pkg ? pkg.features.slice(0, 4).join(', ') + '...' : 'Premium Grade Editing, Cinematic Color Grading'}<br><br>
                This package ensures your visual brand is positioned flawlessly to justify premium scaling. Secure your creative slot below immediately to initiate production!<br><br>
                <a href="checkout.html?service=${encodeURIComponent(recommendedService)}&package=${encodeURIComponent(recommendedPackage)}&price=${price}" class="btn-primary" style="display: block; text-align: center; font-size: 0.85rem; padding: 10px;">Secure Slot & Checkout ➔</a>
            `);
        }
    }, 850);
};

// Conversational Chatbot text queries
function handleChatbotInputSubmit() {
    const input = document.getElementById("fz-chatbot-input");
    const query = input.value.trim().toLowerCase();
    if (!query) return;

    appendUserBubble(input.value);
    input.value = "";

    setTimeout(() => {
        if (query.includes("niche") || query.includes("industry")) {
            appendBotBubble("🤖 <strong>Orin Support Agent:</strong> We tailor advanced creative workflows for elite niches! Our production pipelines are highly optimized for YouTube Creators, SaaS/Corporate Brands, Real Estate Brokers, and Podcast Hosts. Each category has dedicated technical guidelines for premium, high-retention results.");
        } else if (query.includes("budget") || query.includes("price") || query.includes("cost") || query.includes("rate") || query.includes("package")) {
            appendBotBubble("🤖 <strong>Orin Support Agent:</strong> To deliver premium, ROI-driven quality, our standard edit suites range from $40 up to $150. For elite campaigns or enterprise After Effects motion graphics, custom monthly retainers range from $300 to $500+. Check out our full tiered details on the <a href='services.html' style='color: var(--accent-primary); font-weight: 700;'>Services Page</a>!");
        } else if (query.includes("deadline") || query.includes("time") || query.includes("fast") || query.includes("turnaround")) {
            appendBotBubble("🤖 <strong>Orin Support Agent:</strong> Speed is key! Standard turnarounds are 3-4 days, while our Express option delivers in 2-3 days. Every project is edit-locked and rendered with multi-point quality checks to ensure no drop in resolution or pacing.");
        } else if (query.includes("revision") || query.includes("change") || query.includes("edit")) {
            appendBotBubble("🤖 <strong>Orin Support Agent:</strong> We are committed to creative perfection! Standard packages include up to 3 revisions. Best of all, clients get access to our **Frame-by-Frame Revision Hub** in the Client Portal, allowing you to pause drafts at the exact millisecond and leave pinpoint instructions directly for our creative editors!");
        } else if (query.includes("social") || query.includes("linkedin") || query.includes("fiverr") || query.includes("upwork") || query.includes("whatsapp")) {
            appendBotBubble(`🤖 <strong>Orin Support Agent:</strong> Connect with our directors and follow our active portfolios:<br><br>
                🔗 <a href="https://www.linkedin.com/in/fz-media/" target="_blank" style="color: var(--accent-primary);">LinkedIn Profile</a><br>
                🔗 <a href="https://www.facebook.com/FZoneM" target="_blank" style="color: var(--accent-primary);">Facebook Page</a><br>
                🔗 <a href="https://www.instagram.com/frame.zone.media/" target="_blank" style="color: var(--accent-primary);">Instagram Feed</a><br>
                🟢 <a href="https://www.fiverr.com/fz_media" target="_blank" style="color: var(--accent-secondary);">Fiverr Creative Gig</a><br>
                🟢 <a href="https://www.upwork.com/freelancers/~0142030ef402084057?mp_source=share" target="_blank" style="color: var(--accent-secondary);">Upwork Agency Slot</a>
            `);
        } else {
            appendBotBubble("🤖 <strong>Orin Support Agent:</strong> We'd love to consult with you on this and launch your video project! For custom edits, raw footage submissions, or custom briefs, you can book a direct 15-minute call on our <a href='contact.html' style='color: var(--accent-primary); font-weight: 700;'>Booking Calendar</a> or chat immediately on WhatsApp at +8801635-333356.");
        }
    }, 600);
}

function appendUserBubble(text) {
    const body = document.getElementById("fz-chatbot-body");
    if (!body) return;

    const bubble = document.createElement("div");
    bubble.className = "chat-bubble user";
    bubble.textContent = text;
    
    body.appendChild(bubble);
    body.scrollTop = body.scrollHeight;
}

function appendBotBubble(htmlContent) {
    const body = document.getElementById("fz-chatbot-body");
    if (!body) return;

    const bubble = document.createElement("div");
    bubble.className = "chat-bubble bot";
    bubble.innerHTML = htmlContent;
    
    body.appendChild(bubble);
    body.scrollTop = body.scrollHeight;
}

// Global Interactive mouse coordinate tracking and pose updates [NEW]
let characterMouseListenerInitialized = false;

function initCharacterMouseTracking() {
    if (characterMouseListenerInitialized) return;
    characterMouseListenerInitialized = true;

    // Initial Hello Wave
    const character = document.getElementById("fz-interactive-editor-character");
    if (character) {
        character.classList.add("editor-waving");
        setTimeout(() => {
            character.classList.remove("editor-waving");
        }, 1800);
    }

    window.addEventListener("mousemove", (e) => {
        const char = document.getElementById("fz-interactive-editor-character");
        if (!char) return;

        const rect = char.getBoundingClientRect();
        const charCenterX = rect.left + rect.width / 2;
        const charCenterY = rect.top + rect.height / 2;

        const angle = Math.atan2(e.clientY - charCenterY, e.clientX - charCenterX);
        const angleDeg = angle * (180 / Math.PI);

        // Limit pupil displacement
        const maxDisplacement = 5;
        const dispX = Math.cos(angle) * maxDisplacement;
        const dispY = Math.sin(angle) * maxDisplacement;

        // Set eye pupil styles dynamically
        const pupils = char.querySelectorAll(".editor-pupil");
        pupils.forEach(pupil => {
            pupil.style.transform = `translate(${dispX}px, ${dispY}px)`;
        });

        // Rotate right arm group to point or align with cursor
        const armGroup = char.querySelector(".editor-right-arm-group");
        if (armGroup) {
            let armAngle = angleDeg - 90;
            if (armAngle > 180) armAngle -= 360;
            if (armAngle < -180) armAngle += 360;
            armAngle = Math.max(-35, Math.min(35, armAngle));
            
            armGroup.style.transform = `rotate(${armAngle}deg)`;
            armGroup.style.transformOrigin = "170px 200px";
        }
    });

    // Poses Contextual triggers
    document.addEventListener("mouseover", (e) => {
        const char = document.getElementById("fz-interactive-editor-character");
        if (!char) return;

        const target = e.target.closest("a, button, .btn-primary, .btn-secondary, .chat-option-btn, .client-project-card, .glass-card, .portfolio-card");
        if (target) {
            if (target.closest(".glass-card, .client-project-card, .portfolio-card")) {
                char.classList.add("editor-pointing");
                char.classList.remove("editor-smiling", "editor-focusing");
            } else {
                char.classList.add("editor-smiling");
                char.classList.remove("editor-pointing", "editor-focusing");
            }
        }
    });

    document.addEventListener("mouseout", (e) => {
        const char = document.getElementById("fz-interactive-editor-character");
        if (!char) return;
        
        const target = e.target.closest("a, button, .btn-primary, .btn-secondary, .chat-option-btn, .client-project-card, .glass-card, .portfolio-card");
        if (target) {
            char.classList.remove("editor-pointing", "editor-smiling");
        }
    });

    document.addEventListener("focusin", (e) => {
        const char = document.getElementById("fz-interactive-editor-character");
        if (!char) return;
        if (e.target.closest("input, textarea, select")) {
            char.classList.add("editor-focusing", "editor-typing");
            char.classList.remove("editor-pointing", "editor-smiling");
        }
    });

    document.addEventListener("focusout", (e) => {
        const char = document.getElementById("fz-interactive-editor-character");
        if (!char) return;
        char.classList.remove("editor-focusing", "editor-typing");
    });

    // Clicking Character SVG interactive quote triggers
    document.addEventListener("click", (e) => {
        const char = document.getElementById("fz-interactive-editor-character");
        if (!char) return;

        const svg = e.target.closest(".editor-svg");
        if (svg) {
            char.classList.add("editor-waving", "editor-smiling");
            setTimeout(() => {
                char.classList.remove("editor-waving", "editor-smiling");
            }, 1800);

            const quotes = [
                "Let's build an absolute masterpiece today! 🎬",
                "Our edit roster is ready to scale your visual brand! 🚀",
                "Ready to capture maximum audience retention? Let's go!",
                "Secure a pricing package to activate your edit queue immediately! ⚡",
                "Our advanced frame-by-frame revision pipelines are fully synced!",
                "Need high-impact kinetic motions? We've got you covered!"
            ];
            const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
            
            const bubble = document.getElementById("char-speech-bubble");
            if (bubble) {
                bubble.textContent = randomQuote;
                bubble.classList.add("active");
                
                if (window.speechBubbleTimeout) clearTimeout(window.speechBubbleTimeout);
                
                window.speechBubbleTimeout = setTimeout(() => {
                    bubble.classList.remove("active");
                }, 3800);
            }
        }
    });
}

// 6. Initial Run
document.addEventListener("DOMContentLoaded", () => {
    injectTheme();
    injectLayouts();
    injectChatbot();
    initCharacterMouseTracking();
});
