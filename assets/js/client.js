/* FZ Media - Client Portal Dashboard Logic */

let activeClientEmail = null;
let activeProjectForRevision = null;

document.addEventListener("DOMContentLoaded", () => {
    setupAuthGuard();
    setupAuthTabs();
    setupDashboardTabs();
    setupPlayheadCapture();
    setupRevisionForm();
    setupBriefForm();
    setupLogout();
    setupClientChat();
    setupPasswordToggles();
});


// 1. Client authentication login and signup guard with OTP verification and Social Logins
function setupAuthGuard() {
    const authPanel = document.getElementById("auth-panel");
    const workspacePanel = document.getElementById("workspace-panel");
    const loginForm = document.getElementById("client-login-form");
    const signupForm = document.getElementById("client-signup-form");
    const errorMsg = document.getElementById("auth-error-msg");

    // OTP form elements
    const otpForm = document.getElementById("client-otp-form");
    const otpInputs = document.querySelectorAll(".otp-box");
    const otpVerifyBtn = document.getElementById("otp-verify-btn");
    const otpResendLink = document.getElementById("otp-resend-link");
    const otpCountdown = document.getElementById("otp-countdown");
    const otpSecondsSpan = document.getElementById("otp-seconds");
    const otpCancelBtn = document.getElementById("otp-cancel-btn");
    const otpEmailSpan = document.getElementById("otp-sent-email");

    // Social login buttons
    const googleBtn = document.getElementById("social-btn-google");
    const linkedinBtn = document.getElementById("social-btn-linkedin");

    // Social popup overlay
    const oauthOverlay = document.getElementById("mock-oauth-overlay");
    const oauthCancel = document.getElementById("oauth-cancel-btn");
    const oauthApprove = document.getElementById("oauth-approve-btn");
    const oauthLoader = document.getElementById("oauth-loader");
    const oauthAccountSelection = document.getElementById("oauth-account-selection");
    const oauthActionsRow = document.getElementById("oauth-actions-row");

    if (!authPanel || !workspacePanel || !loginForm || !signupForm) return;

    let generatedCode = null;
    let pendingUserData = null; // Stash user registration data during verification
    let resendTimer = null;
    let resendSeconds = 60;

    // Check session persistence
    const savedEmail = sessionStorage.getItem("fzmedia_logged_client");
    if (savedEmail) {
        activeClientEmail = savedEmail;
        authPanel.style.display = "none";
        workspacePanel.style.display = "block";
        initializeWorkspace();
    }

    // Helper: Validate email format
    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    // Helper: Trigger simulated mailer notification popup
    function triggerSimulatedMailNotification(email, code) {
        // Remove existing notification if any
        const existingNotify = document.getElementById("simulated-mail-notify");
        if (existingNotify) {
            existingNotify.remove();
        }

        // Create new element
        const notify = document.createElement("div");
        notify.id = "simulated-mail-notify";
        notify.style.cssText = `
            position: fixed;
            top: 24px;
            right: 24px;
            width: calc(100% - 48px);
            max-width: 380px;
            background: rgba(20, 20, 20, 0.9);
            backdrop-filter: blur(16px);
            border: 1px solid var(--accent-primary);
            box-shadow: 0 10px 40px rgba(0,0,0,0.5), 0 0 15px rgba(22, 163, 74, 0.1);
            border-radius: var(--radius-md);
            padding: 16px 20px;
            z-index: 100000;
            display: flex;
            gap: 14px;
            align-items: flex-start;
            transform: translateX(120%);
            transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        `;

        notify.innerHTML = `
            <div style="font-size: 1.6rem; line-height: 1;">✉️</div>
            <div style="flex-grow: 1;">
                <div style="font-weight: 800; font-size: 0.85rem; color: var(--accent-primary); text-transform: uppercase; letter-spacing: 0.8px;">FZ Security Mailer</div>
                <div style="font-size: 0.88rem; font-weight: 700; color: white; margin-top: 4px;">Verification Code: <span style="font-size: 1.25rem; font-weight: 900; color: #ffedd5; background: rgba(255,255,255,0.06); padding: 2px 8px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.1); font-family: monospace;">${code}</span></div>
                <div style="font-size: 0.76rem; color: var(--text-muted); margin-top: 6px;">Simulated OTP sent securely to <strong>${email}</strong></div>
            </div>
            <button type="button" style="background:none; border:none; color:var(--text-muted); cursor:pointer; font-weight:bold; font-size:1.1rem; padding:0 4px;" onclick="this.parentElement.remove()">×</button>
        `;

        document.body.appendChild(notify);
        
        // Slide in
        setTimeout(() => {
            notify.style.transform = "translateX(0)";
        }, 100);

        // Slide out after 12 seconds
        setTimeout(() => {
            if (notify && notify.parentElement) {
                notify.style.transform = "translateX(120%)";
                setTimeout(() => notify.remove(), 600);
            }
        }, 12000);
    }

    // Helper: Initiate verification code flow
    function startVerificationFlow(email, userData) {
        if (!isValidEmail(email)) {
            errorMsg.textContent = "Please enter a valid, complete email address (e.g. name@domain.com).";
            errorMsg.style.display = "block";
            return;
        }

        errorMsg.style.display = "none";
        pendingUserData = userData;

        // Generate 6-digit random code
        generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Trigger simulated mailer notification
        triggerSimulatedMailNotification(email, generatedCode);

        // Transition UI elements inside card
        loginForm.style.display = "none";
        signupForm.style.display = "none";
        document.getElementById("social-auth-box").style.display = "none";
        document.getElementById("auth-tabs-row").style.display = "none";
        
        otpEmailSpan.textContent = email;
        otpForm.style.display = "block";

        // Reset and focus first input box
        otpInputs.forEach(input => {
            input.value = "";
            input.style.borderColor = "var(--border-color)";
        });
        setTimeout(() => otpInputs[0].focus(), 100);

        // Start Resend timer countdown
        clearInterval(resendTimer);
        resendSeconds = 60;
        otpSecondsSpan.textContent = resendSeconds;
        otpCountdown.style.display = "inline";
        otpResendLink.style.display = "none";

        resendTimer = setInterval(() => {
            resendSeconds--;
            otpSecondsSpan.textContent = resendSeconds;
            if (resendSeconds <= 0) {
                clearInterval(resendTimer);
                otpCountdown.style.display = "none";
                otpResendLink.style.display = "inline";
            }
        }, 1000);
    }

    // Program inputs jump logic inside 6 boxes
    otpInputs.forEach((input, idx) => {
        input.addEventListener("input", (e) => {
            // Force numeric only
            input.value = input.value.replace(/[^0-9]/g, "");
            if (input.value.length > 0 && idx < otpInputs.length - 1) {
                otpInputs[idx + 1].focus();
            }
            
            // Check if all filled, trigger automatically
            const allFilled = Array.from(otpInputs).every(inp => inp.value.length === 1);
            if (allFilled) {
                verifyOTP();
            }
        });

        input.addEventListener("keydown", (e) => {
            if (e.key === "Backspace" && input.value.length === 0 && idx > 0) {
                otpInputs[idx - 1].focus();
            }
        });
    });

    // Verification evaluation
    function verifyOTP() {
        const typedCode = Array.from(otpInputs).map(inp => inp.value).join("");
        
        if (typedCode === generatedCode) {
            clearInterval(resendTimer);
            
            // Complete Login or Signup registration
            const db = getDB();
            const email = pendingUserData.email;
            
            if (pendingUserData.isSignup) {
                // Duplicate check just in case
                const duplicate = db.clients.find(c => c.email.toLowerCase() === email.toLowerCase());
                if (!duplicate) {
                    const newClient = {
                        email: email,
                        password: pendingUserData.password,
                        name: pendingUserData.name,
                        company: pendingUserData.company,
                        activeSub: pendingUserData.activeSub || "No Active Package",
                        packageLimits: pendingUserData.packageLimits || "Choose a pricing package to activate monthly deliverables",
                        projects: pendingUserData.projects || [],
                        briefs: []
                    };
                    db.clients.push(newClient);
                    
                    db.inbox.push({
                        id: "inq-" + Date.now(),
                        name: pendingUserData.name,
                        email: email,
                        brand: pendingUserData.company,
                        service: "New Client Account",
                        assetsLink: "",
                        details: `A new client registered an account. Brand: ${pendingUserData.company}. Awaiting package selection/onboarding.`,
                        scheduledCall: "Registered Online",
                        dateReceived: new Date().toLocaleDateString()
                    });
                    saveDB(db);
                }
            }

            activeClientEmail = email;
            sessionStorage.setItem("fzmedia_logged_client", email);

            // Hide auth panel and show workspace panel with bounce entry
            errorMsg.style.display = "none";
            
            // Apply bounce fade out to authPanel
            authPanel.style.transform = "translateY(50px)";
            authPanel.style.opacity = "0";
            authPanel.style.transition = "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
            
            setTimeout(() => {
                authPanel.style.display = "none";
                workspacePanel.style.display = "block";
                
                // Reset styling
                authPanel.style.transform = "none";
                authPanel.style.opacity = "1";
                
                initializeWorkspace();
                
                const welcomeMsg = `Welcome back, ${pendingUserData.name}! Your secure FZ Media Space is fully unlocked.`;
                alert(welcomeMsg);
            }, 300);

        } else {
            // Red glowing highlight for invalid code
            otpInputs.forEach(inp => {
                inp.style.borderColor = "#ef4444";
                inp.style.boxShadow = "0 0 10px rgba(239, 68, 68, 0.3)";
            });
            errorMsg.textContent = "Security verification code mismatch. Please review the simulated mailer code and try again.";
            errorMsg.style.display = "block";
        }
    }

    otpVerifyBtn.addEventListener("click", verifyOTP);

    // Resend OTP trigger
    otpResendLink.addEventListener("click", () => {
        generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
        triggerSimulatedMailNotification(pendingUserData.email, generatedCode);
        
        // Reset countdown timer
        resendSeconds = 60;
        otpSecondsSpan.textContent = resendSeconds;
        otpCountdown.style.display = "inline";
        otpResendLink.style.display = "none";
        
        clearInterval(resendTimer);
        resendTimer = setInterval(() => {
            resendSeconds--;
            otpSecondsSpan.textContent = resendSeconds;
            if (resendSeconds <= 0) {
                clearInterval(resendTimer);
                otpCountdown.style.display = "none";
                otpResendLink.style.display = "inline";
            }
        }, 1000);
    });

    // Go back trigger
    otpCancelBtn.addEventListener("click", () => {
        clearInterval(resendTimer);
        otpForm.style.display = "none";
        
        const isSignupActive = document.getElementById("toggle-signup-tab").classList.contains("active");
        if (isSignupActive) {
            signupForm.style.display = "block";
        } else {
            loginForm.style.display = "block";
        }
        document.getElementById("social-auth-box").style.display = "block";
        document.getElementById("auth-tabs-row").style.display = "flex";
    });

    // Login Form Submission Interceptor
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const emailInput = document.getElementById("client-auth-email").value.trim();
        const passInput = document.getElementById("client-auth-pass").value.trim();
        
        if (!isValidEmail(emailInput)) {
            errorMsg.textContent = "Incorrect email format. Please enter a valid clear email address (e.g. name@company.com).";
            errorMsg.style.display = "block";
            return;
        }

        const db = getDB();
        let client = db.clients.find(c => c.email.toLowerCase() === emailInput.toLowerCase() && c.password === passInput);

        // Self-healing factory fallback in case local fzmedia_db cache is corrupted/modified
        if (!client && emailInput.toLowerCase() === "client@gmail.com" && passInput === "client123") {
            client = db.clients.find(c => c.email.toLowerCase() === "client@gmail.com");
            if (client) {
                client.password = "client123";
            } else {
                client = {
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
                        }
                    ],
                    briefs: []
                };
                db.clients.push(client);
            }
            saveDB(db);
        }

        if (client) {
            // Trigger 2FA simulated verification code
            startVerificationFlow(client.email, {
                isSignup: false,
                email: client.email,
                name: client.name,
                company: client.company
            });
        } else {
            errorMsg.textContent = "Invalid client credentials. Please check your spelling or register a new workspace.";
            errorMsg.style.display = "block";
        }
    });

    // Signup Form Submission Interceptor
    signupForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("client-reg-name").value.trim();
        const company = document.getElementById("client-reg-company").value.trim();
        const email = document.getElementById("client-reg-email").value.trim();
        const pass = document.getElementById("client-reg-pass").value.trim();

        if (!isValidEmail(email)) {
            errorMsg.textContent = "Please enter a valid, complete email address (e.g. name@domain.com).";
            errorMsg.style.display = "block";
            return;
        }

        const db = getDB();
        const duplicate = db.clients.find(c => c.email.toLowerCase() === email.toLowerCase());
        
        if (duplicate) {
            errorMsg.textContent = "This email is already registered in FZ Portal!";
            errorMsg.style.display = "block";
            return;
        }

        // Trigger 2FA simulated verification code
        startVerificationFlow(email, {
            isSignup: true,
            email: email,
            password: pass,
            name: name,
            company: company
        });
    });

    // ==========================================
    // MOCK SOCIAL LOGIN GATEWAY CONTROLLERS
    // ==========================================
    let currentSocialType = null;

    function openSocialMockOAuth(platform) {
        currentSocialType = platform;
        oauthOverlay.style.display = "flex";
        
        // Configure visuals based on Google vs LinkedIn
        const titleNode = document.getElementById("oauth-title");
        const descNode = document.getElementById("oauth-desc");
        const logoPlaceholder = document.getElementById("oauth-logo-placeholder");
        const profileName = document.getElementById("oauth-profile-name");
        const profileEmail = document.getElementById("oauth-profile-email");
        const avatarChar = document.getElementById("oauth-avatar-char");

        oauthAccountSelection.style.display = "block";
        oauthLoader.style.display = "none";
        oauthActionsRow.style.display = "flex";

        if (platform === "google") {
            titleNode.textContent = "Connect with Google Space";
            descNode.textContent = "FZ Media requests permission to fetch your verified Google profile credentials and primary email address.";
            logoPlaceholder.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 18 18">
                    <path fill="#4285F4" d="M17.64 9.2c0-.63-.06-1.25-.16-1.84H9v3.47h4.84a4.14 4.14 0 0 1-1.8 2.71v2.26h2.91a8.78 8.78 0 0 0 2.69-6.6z"/>
                    <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.2l-2.91-2.26a5.52 5.52 0 0 1-8.08-2.9H1v2.33A9 9 0 0 0 9 18z"/>
                    <path fill="#FBBC05" d="M3.97 10.64a5.4 5.4 0 0 1 0-3.28V5.03H1v2.33a9 9 0 0 0 0 8.56l2.97-2.28z"/>
                    <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35L15 2.1A9 9 0 0 0 1 5.03l2.97 2.28A5.4 5.4 0 0 1 9 3.58z"/>
                </svg>
            `;
            profileName.textContent = "Alex Mercer";
            profileEmail.textContent = "alex.mercer@gmail.com";
            avatarChar.textContent = "A";
            avatarChar.style.background = "#4285F4";
        } else {
            titleNode.textContent = "Connect with LinkedIn Secure SSO";
            descNode.textContent = "FZ Media requests authorization to bind your LinkedIn verified workplace identity and connected workspace contact email.";
            logoPlaceholder.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#0A66C2">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
            `;
            profileName.textContent = "Alex Mercer";
            profileEmail.textContent = "alex.mercer@linkedin.com";
            avatarChar.textContent = "A";
            avatarChar.style.background = "#0A66C2";
        }

        // Trigger pop scale entry
        const popupCard = document.querySelector(".oauth-popup-card");
        if (popupCard) {
            setTimeout(() => {
                popupCard.style.transform = "scale(1)";
            }, 50);
        }
    }

    if (googleBtn) googleBtn.addEventListener("click", () => openSocialMockOAuth("google"));
    if (linkedinBtn) linkedinBtn.addEventListener("click", () => openSocialMockOAuth("linkedin"));

    if (oauthCancel) {
        oauthCancel.addEventListener("click", () => {
            const popupCard = document.querySelector(".oauth-popup-card");
            if (popupCard) {
                popupCard.style.transform = "scale(0.9)";
            }
            setTimeout(() => {
                oauthOverlay.style.display = "none";
            }, 200);
        });
    }

    if (oauthApprove) {
        oauthApprove.addEventListener("click", () => {
            oauthAccountSelection.style.display = "none";
            oauthActionsRow.style.display = "none";
            oauthLoader.style.display = "block";

            // Simulating secure OAuth transaction validation
            setTimeout(() => {
                const popupCard = document.querySelector(".oauth-popup-card");
                if (popupCard) {
                    popupCard.style.transform = "scale(0.9)";
                }
                setTimeout(() => {
                    oauthOverlay.style.display = "none";
                    
                    // Setup stashed user registration matching
                    const email = currentSocialType === "google" ? "alex.mercer@gmail.com" : "alex.mercer@linkedin.com";
                    
                    startVerificationFlow(email, {
                        isSignup: true,
                        email: email,
                        password: "social_login_auth_sso",
                        name: "Alex Mercer",
                        company: "Mercer Ventures"
                    });
                }, 200);
            }, 1800);
        });
    }

}

// 2. Auth tabs toggling (Login vs Signup)
function setupAuthTabs() {
    const loginTab = document.getElementById("toggle-login-tab");
    const signupTab = document.getElementById("toggle-signup-tab");
    const loginForm = document.getElementById("client-login-form");
    const signupForm = document.getElementById("client-signup-form");
    const errorMsg = document.getElementById("auth-error-msg");

    if (!loginTab || !signupTab || !loginForm || !signupForm) return;

    loginTab.addEventListener("click", () => {
        loginTab.classList.add("active");
        signupTab.classList.remove("active");
        
        loginForm.style.display = "block";
        signupForm.style.display = "none";
        if (errorMsg) errorMsg.style.display = "none";
    });

    signupTab.addEventListener("click", () => {
        signupTab.classList.add("active");
        loginTab.classList.remove("active");

        signupForm.style.display = "block";
        loginForm.style.display = "none";
        if (errorMsg) errorMsg.style.display = "none";
    });
}

// 3. Initialize Workspace
function initializeWorkspace() {
    const db = getDB();
    const client = db.clients.find(c => c.email === activeClientEmail);
    if (!client) return;

    // Set header welcome texts
    const firstName = client.name ? client.name.trim().split(/\s+/)[0] : "Client";
    document.getElementById("client-welcome-name").textContent = firstName;
    document.getElementById("client-company-badge").textContent = client.company;
    document.getElementById("client-active-sub").textContent = client.activeSub;
    document.getElementById("client-sub-limits").textContent = client.packageLimits;

    // Render active deliverables
    renderActiveDeliverables(client);

    // Set default project for revision if present
    const revHub = document.getElementById("dash-revision-hub");
    if (client.projects.length > 0) {
        loadProjectIntoRevision(client.projects[0]);
    } else {
        // Render dynamic premium empty state inside the Revision Hub tab
        if (revHub) {
            revHub.innerHTML = `
                <div class="glass-card" style="text-align: center; padding: 60px 40px; max-width: 600px; margin: 40px auto; border-color: rgba(255,255,255,0.06); background: rgba(10, 8, 20, 0.25);">
                    <div style="font-size: 3rem; margin-bottom: 20px; filter: drop-shadow(0 0 12px var(--accent-primary));">📁</div>
                    <h3 style="font-size: 1.5rem; margin-bottom: 12px; font-family: var(--font-headings); color: var(--text-primary);">No Active Project Drafts</h3>
                    <p style="color: var(--text-secondary); font-size: 0.95rem; line-height: 1.6; margin-bottom: 28px;">You don't have any active video deliverables currently undergoing creative edits. Once you purchase a package and submit your intake brief coordinates, your editor's live revision draft timeline will appear here!</p>
                    <a href="services.html" class="btn-primary" style="display: inline-flex; align-items: center; gap: 8px;">
                        <span>🛒</span> Browse Pricing & Packages
                    </a>
                </div>
            `;
        }
    }

    // Render support chat logs
    renderChatMessages(client);
}

// 4. Render client dynamic deliverables
function renderActiveDeliverables(client) {
    const container = document.getElementById("active-projects-container");
    if (!container) return;

    if (!client.activeSub || client.activeSub.trim() === "" || client.activeSub.toLowerCase().includes("no active package")) {
        container.innerHTML = `
            <div class="glass-card" style="grid-column: span 2; text-align: center; padding: 50px 30px; border-color: rgba(239, 68, 68, 0.2); background: rgba(239, 68, 68, 0.02); margin: 20px auto; max-width: 700px; border-radius: var(--radius-lg);">
                <div style="font-size: 3.5rem; margin-bottom: 20px; filter: drop-shadow(0 0 10px rgba(239,68,68,0.3));">🔒</div>
                <h3 style="font-size: 1.5rem; color: var(--text-primary); font-family: var(--font-headings); margin-bottom: 12px;">Creative Production Roster Locked</h3>
                <p style="color: var(--text-secondary); font-size: 0.95rem; max-width: 500px; margin: 0 auto 28px auto; line-height: 1.6;">Your active production timeline and edit queues are currently locked because you do not have an active package subscription. Activate a premium creative package below to secure your slots and launch production briefs!</p>
                <a href="services.html" class="btn-primary" style="display: inline-flex; align-items: center; gap: 8px; text-decoration: none;">
                    <span>⚡</span> View Roster Pricing & Packages
                </a>
            </div>
        `;
        return;
    }

    if (client.projects.length === 0) {
        container.innerHTML = `
            <div class="glass-card" style="grid-column: span 2; text-align: center; padding: 40px;">
                <p style="font-size: 1.1rem; color: var(--text-muted);">No active deliverables at this time.</p>
                <a href="services.html" class="btn-primary" style="margin-top: 16px;">View Pricing & Packages</a>
            </div>
        `;
        return;
    }

    container.innerHTML = client.projects.map(proj => {
        let badgeClass = "status-queue";
        if (proj.status === "First Cut Editing") badgeClass = "status-edit";
        if (proj.status === "Awaiting Review") badgeClass = "status-review";
        if (proj.status === "Delivered") badgeClass = "status-delivered";

        // Check if OBS livestream is active from editors!
        let obsMarkup = "";
        if (proj.obsStream && proj.obsStream.active) {
            obsMarkup = `
                <div class="glass-card" style="grid-column: span 2; margin-top: 20px; border-color: #ef4444; background: rgba(239, 68, 68, 0.03); padding: 24px; position: relative;">
                    <div style="position: absolute; top: 16px; right: 24px; display: inline-flex; align-items: center; gap: 6px;">
                        <span style="width: 10px; height: 10px; background: #ef4444; border-radius: 50%; display: inline-block; animation: pulse-badge 1.5s infinite;"></span>
                        <span style="font-size: 0.72rem; font-weight: 800; color: #f87171; text-transform: uppercase; letter-spacing: 0.05em;">OBS Live Session Online</span>
                    </div>
                    
                    <h4 style="font-size: 1.15rem; color: var(--text-primary); margin-bottom: 8px;">🔴 FZ Editor Live Stream Active</h4>
                    <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.4; margin-bottom: 20px; max-width: 80%;">Your editor has started a live streaming session! copy the OBS Server and Stream Key credentials below to pull the direct high-quality video feed inside your VLC media player, web browser RTMP tools, or direct streams receiver.</p>
                    
                    <div class="obs-credentials-container" style="display: flex; gap: 16px; flex-wrap: wrap;">
                        <div style="flex: 1; min-width: 250px;">
                            <label class="form-label" style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">OBS RTMP Server URL</label>
                            <div class="copy-input-flex" style="display: flex; gap: 8px; margin-top: 4px;">
                                <input type="text" class="form-control" style="font-size: 0.82rem; padding: 6px 12px; background: rgba(0,0,0,0.3);" value="${proj.obsStream.server}" readonly id="obs-srv-${proj.id}">
                                <button class="btn-secondary" style="padding: 6px 12px; font-size: 0.8rem;" onclick="copyOBSValue('obs-srv-${proj.id}', this)">Copy</button>
                            </div>
                        </div>
                        <div style="flex: 1; min-width: 200px;">
                            <label class="form-label" style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">OBS Stream Key</label>
                            <div class="copy-input-flex" style="display: flex; gap: 8px; margin-top: 4px;">
                                <input type="text" class="form-control" style="font-size: 0.82rem; padding: 6px 12px; background: rgba(0,0,0,0.3);" value="${proj.obsStream.key}" readonly id="obs-key-${proj.id}">
                                <button class="btn-secondary" style="padding: 6px 12px; font-size: 0.8rem;" onclick="copyOBSValue('obs-key-${proj.id}', this)">Copy</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        let processingWidgetMarkup = "";
        if (proj.status === "In Queue" || proj.status === "First Cut Editing") {
            processingWidgetMarkup = `
                <div class="vsl-processing-widget" data-proj-id="${proj.id}" data-real-progress="${proj.progress}">
                    <div class="processing-orbit-container">
                        <svg class="processing-ring-svg">
                            <circle class="processing-ring-bg" cx="34" cy="34" r="30"></circle>
                            <circle class="processing-ring-active" cx="34" cy="34" r="30" id="ring-active-${proj.id}"></circle>
                        </svg>
                        <div class="processing-orbit-percent" id="ring-percent-${proj.id}">0%</div>
                    </div>
                    <div class="processing-details">
                        <h4 class="processing-phase-title" id="ring-title-${proj.id}">⚙️ FZ Render System Active</h4>
                        <p class="processing-phase-subtitle" id="ring-sub-${proj.id}">Awaiting asset verification...</p>
                    </div>
                </div>
            `;
        }

        const assigned = proj.assignedMember || {
            name: "Rifat Khan",
            role: "Professional Video Editor",
            image: "",
            skills: "Premiere Pro, DaVinci Resolve, Colorist"
        };

        const editorAvatar = assigned.image ? 
            `<img src="${assigned.image}" alt="${assigned.name}" style="width: 42px; height: 42px; border-radius: 50%; object-fit: cover; border: 1.5px solid var(--accent-primary);">` : 
            `<div style="width: 42px; height: 42px; border-radius: 50%; background: var(--accent-primary-glow); border: 1.5px solid var(--accent-primary); display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 1.1rem; color: var(--text-primary);"><span>${assigned.name[0]}</span></div>`;

        const assignedEditorMarkup = `
            <div class="assigned-editor-card" style="display: flex; align-items: center; gap: 14px; margin-top: 24px; padding: 14px 18px; background: rgba(255,255,255,0.02); border: 1px solid var(--border-color); border-radius: var(--radius-sm);">
                ${editorAvatar}
                <div style="flex-grow: 1;">
                    <span style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700; display: block; letter-spacing: 0.5px;">Assigned Creative Editor</span>
                    <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--text-primary); margin: 2px 0 0 0;">${assigned.name}</h4>
                    <p style="font-size: 0.78rem; color: var(--accent-secondary); margin: 0;">${assigned.role} • <span style="color: var(--text-muted); font-size: 0.72rem;">${assigned.skills}</span></p>
                </div>
                <div class="assigned-editor-active-dot" style="display: flex; align-items: center; gap: 6px; flex-shrink: 0;">
                    <span style="width: 8px; height: 8px; background: #22c55e; border-radius: 50%; display: inline-block; animation: pulse-badge 1.8s infinite;"></span>
                    <span style="font-size: 0.68rem; font-weight: 800; color: #4ade80; text-transform: uppercase; letter-spacing: 0.05em;">Online</span>
                </div>
            </div>
        `;

        return `
            <div class="glass-card client-project-card" style="grid-column: span 2; display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                    <div class="project-card-header">
                        <div>
                            <span class="project-badge ${badgeClass}">${proj.status}</span>
                            <h3 style="margin-top: 10px;">${proj.title}</h3>
                        </div>
                    </div>
                    
                    <div class="project-progress-row">
                        <div class="progress-label-flex">
                            <span>Production Progress</span>
                            <span>${proj.progress}%</span>
                        </div>
                        <div class="progress-track">
                            <div class="progress-fill" style="width: ${proj.progress}%;"></div>
                        </div>
                    </div>
                    
                    ${processingWidgetMarkup}
                    ${assignedEditorMarkup}
                </div>
                
                <div class="project-card-footer" style="margin-top: 16px;">
                    <div class="delivery-tag">Target Delivery: <strong>${proj.deliveryDate}</strong></div>
                    <button class="btn-primary" style="padding: 8px 16px; font-size: 0.82rem;" onclick="openProjectInRevision('${proj.id}')">
                        Open Frame Review 🎬
                    </button>
                </div>
                
                ${obsMarkup}
            </div>
        `;
    }).join("");

    startProcessingLoops();
}

// Copy OBS fields trigger
window.copyOBSValue = function(id, btn) {
    const input = document.getElementById(id);
    if (input) {
        input.select();
        document.execCommand("copy");
        btn.textContent = "Copied!";
        setTimeout(() => btn.textContent = "Copy", 1500);
    }
};

// 5. Tab selection logic
function setupDashboardTabs() {
    const tabs = document.querySelectorAll(".dash-tab");
    const contents = document.querySelectorAll(".dash-tab-content");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            if (tab.classList.contains("active")) return;

            const targetId = tab.getAttribute("data-target");
            const targetContent = document.getElementById(targetId);
            const activeContent = document.querySelector(".dash-tab-content.active");

            // Deactivate all tab buttons first to give instant feedback
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");

            if (activeContent && activeContent !== targetContent) {
                // Add leaving animation to currently active settings section
                activeContent.classList.add("leaving");
                activeContent.classList.remove("active");

                // After exit animation finishes (0.18s / 180ms), swap sections with the pop-up enter animation
                setTimeout(() => {
                    activeContent.classList.remove("leaving");
                    contents.forEach(c => c.classList.remove("active"));
                    if (targetContent) {
                        targetContent.classList.add("active");
                    }
                }, 180);
            } else {
                contents.forEach(c => c.classList.remove("active"));
                if (targetContent) {
                    targetContent.classList.add("active");
                }
            }
        });
    });
}

// 6. Load specific project in the dynamic revision player
window.openProjectInRevision = function(projId) {
    const db = getDB();
    const client = db.clients.find(c => c.email === activeClientEmail);
    const proj = client.projects.find(p => p.id === projId);

    if (proj) {
        loadProjectIntoRevision(proj);
        
        const tabs = document.querySelectorAll(".dash-tab");
        const contents = document.querySelectorAll(".dash-tab-content");
        
        tabs.forEach(t => t.classList.remove("active"));
        contents.forEach(c => c.classList.remove("active"));

        const targetTab = Array.from(tabs).find(t => t.getAttribute("data-target") === "dash-revision-hub");
        if (targetTab) targetTab.classList.add("active");
        
        document.getElementById("dash-revision-hub").classList.add("active");
    }
};

let streamTimecodeInterval = null;
let vuInterval = null;
let canvasAnimationId = null;

function loadProjectIntoRevision(proj) {
    activeProjectForRevision = proj.id;
    
    document.getElementById("active-revision-project-title").textContent = proj.title;
    
    const player = document.getElementById("draft-video-player");
    if (player) {
        player.src = proj.videoUrl;
        player.load();
    }

    // Connect player tabs switching
    const tabDraft = document.getElementById("tab-review-draft");
    const tabLive = document.getElementById("tab-live-broadcast");
    const draftContainer = document.querySelector(".draft-video-player-container");
    const liveContainer = document.getElementById("live-broadcast-container");
    
    if (tabDraft && tabLive && draftContainer && liveContainer) {
        // Reset active tabs style
        tabDraft.classList.add("active");
        tabDraft.style.color = "var(--text-primary)";
        tabDraft.style.fontWeight = "600";
        tabLive.classList.remove("active");
        tabLive.style.color = "var(--text-secondary)";
        tabLive.style.fontWeight = "500";
        draftContainer.style.display = "block";
        liveContainer.style.display = "none";
        
        // Remove old listeners to avoid multiple attachments
        const newTabDraft = tabDraft.cloneNode(true);
        const newTabLive = tabLive.cloneNode(true);
        tabDraft.parentNode.replaceChild(newTabDraft, tabDraft);
        tabLive.parentNode.replaceChild(newTabLive, tabLive);
        
        newTabDraft.addEventListener("click", () => {
            newTabDraft.classList.add("active");
            newTabDraft.style.color = "var(--text-primary)";
            newTabDraft.style.fontWeight = "600";
            
            newTabLive.classList.remove("active");
            newTabLive.style.color = "var(--text-secondary)";
            newTabLive.style.fontWeight = "500";
            
            draftContainer.style.display = "block";
            liveContainer.style.display = "none";
        });
        
        newTabLive.addEventListener("click", () => {
            newTabLive.classList.add("active");
            newTabLive.style.color = "var(--text-primary)";
            newTabLive.style.fontWeight = "600";
            
            newTabDraft.classList.remove("active");
            newTabDraft.style.color = "var(--text-secondary)";
            newTabDraft.style.fontWeight = "500";
            
            draftContainer.style.display = "none";
            liveContainer.style.display = "block";
            
            // Recalculate canvas size
            const canvas = document.getElementById("offline-shutter-canvas");
            if (canvas) {
                const rect = canvas.parentNode.getBoundingClientRect();
                canvas.width = rect.width || 600;
                canvas.height = rect.height || 337;
            }
        });
    }

    // Toggle active stream elements
    const liveTab = document.getElementById("tab-live-broadcast");
    const pingDot = liveTab ? liveTab.querySelector(".live-ping-dot") : null;
    const offlineView = document.getElementById("live-offline-view");
    const onlineView = document.getElementById("live-online-view");

    // Clean up old intervals and animations
    if (streamTimecodeInterval) clearInterval(streamTimecodeInterval);
    if (vuInterval) clearInterval(vuInterval);
    if (canvasAnimationId) cancelAnimationFrame(canvasAnimationId);

    if (proj.obsStream && proj.obsStream.active) {
        if (pingDot) pingDot.style.display = "block";
        if (offlineView) offlineView.style.display = "none";
        if (onlineView) {
            onlineView.style.display = "block";
            document.getElementById("online-stream-project-title").textContent = proj.title;
            document.getElementById("online-stream-credentials").textContent = `RTMP Server: ${proj.obsStream.server} | Key: ${proj.obsStream.key}`;
        }
        startLiveSimulation();
    } else {
        if (pingDot) pingDot.style.display = "none";
        if (offlineView) offlineView.style.display = "block";
        if (onlineView) onlineView.style.display = "none";
        initOfflineShutterCanvas();
    }

    renderRevisionsTimeline(proj);
}

function startLiveSimulation() {
    const timecodeEl = document.getElementById("stream-timecode");
    const leftGreen = document.getElementById("vu-left-green");
    const leftYellow = document.getElementById("vu-left-yellow");
    const leftRed = document.getElementById("vu-left-red");
    const rightGreen = document.getElementById("vu-right-green");
    const rightYellow = document.getElementById("vu-right-yellow");
    const rightRed = document.getElementById("vu-right-red");
    
    let frames = 0;
    let seconds = 0;
    let minutes = 0;
    let hours = 0;
    
    streamTimecodeInterval = setInterval(() => {
        frames += 1;
        if (frames >= 60) {
            frames = 0;
            seconds += 1;
        }
        if (seconds >= 60) {
            seconds = 0;
            minutes += 1;
        }
        if (minutes >= 60) {
            minutes = 0;
            hours += 1;
        }
        
        const pad = (n) => String(n).padStart(2, "0");
        if (timecodeEl) {
            timecodeEl.textContent = `TC ${pad(hours)}:${pad(minutes)}:${pad(seconds)}:${pad(frames)}`;
        }
    }, 16.6); // 60fps timecode sweep
    
    vuInterval = setInterval(() => {
        const randL = Math.random();
        const randR = Math.random();
        
        if (leftGreen) leftGreen.style.width = `${Math.floor(randL * 60) + 20}%`;
        if (leftYellow) leftYellow.style.width = `${Math.floor(randL * 15)}%`;
        if (leftRed) leftRed.style.width = `${Math.floor(randL * 5)}%`;
        
        if (rightGreen) rightGreen.style.width = `${Math.floor(randR * 62) + 18}%`;
        if (rightYellow) rightYellow.style.width = `${Math.floor(randR * 12)}%`;
        if (rightRed) rightRed.style.width = `${Math.floor(randR * 3)}%`;
    }, 80);
}

function initOfflineShutterCanvas() {
    const canvas = document.getElementById("offline-shutter-canvas");
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    let ripples = [];
    
    const resizeCanvas = () => {
        if (!canvas) return;
        const rect = canvas.parentNode.getBoundingClientRect();
        canvas.width = rect.width || 600;
        canvas.height = rect.height || 337;
    };
    
    resizeCanvas();
    
    // Track cursor interactions for dynamic ripple graphics
    const mouseMoveHandler = (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        if (ripples.length < 25) {
            ripples.push({
                x,
                y,
                radius: 2,
                alpha: 1.0,
                hue: Math.random() * 60 + 250 // Neon Purple to Cyan
            });
        }
    };
    
    canvas.removeEventListener("mousemove", mouseMoveHandler);
    canvas.addEventListener("mousemove", mouseMoveHandler);
    
    let rotation = 0;
    
    function draw() {
        if (!canvas) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const maxRadius = Math.min(cx, cy) * 0.7;
        
        // Draw orbital grid background lines
        ctx.strokeStyle = "rgba(255, 255, 255, 0.02)";
        ctx.lineWidth = 1;
        for (let r = 40; r < maxRadius * 1.5; r += 40) {
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        // Draw crosshair sweeps
        ctx.strokeStyle = "rgba(6, 182, 212, 0.05)";
        ctx.beginPath();
        ctx.moveTo(cx - maxRadius, cy);
        ctx.lineTo(cx + maxRadius, cy);
        ctx.moveTo(cx, cy - maxRadius);
        ctx.lineTo(cx, cy + maxRadius);
        ctx.stroke();
        
        // Draw a slow radar sweeping line
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rotation * 0.5);
        let grad = ctx.createRadialGradient(0,0, 0, 0,0, maxRadius);
        grad.addColorStop(0, "rgba(6, 182, 212, 0.15)");
        grad.addColorStop(1, "rgba(6, 182, 212, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(0,0);
        ctx.arc(0,0, maxRadius, -0.2, 0.2);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        
        // Draw spinning camera shutter lens outline
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rotation);
        
        // Outer shutter ring
        ctx.strokeStyle = "rgba(139, 92, 246, 0.25)";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(0, 0, 80, 0, Math.PI * 2);
        ctx.stroke();
        
        // Draw 6 shutter blades
        ctx.strokeStyle = "rgba(6, 182, 212, 0.35)";
        ctx.lineWidth = 2;
        for (let i = 0; i < 6; i++) {
            ctx.rotate(Math.PI / 3);
            ctx.beginPath();
            ctx.moveTo(0, -80);
            ctx.lineTo(60, -40);
            ctx.stroke();
        }
        ctx.restore();
        
        // Draw active tracking brackets
        ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
        ctx.lineWidth = 2;
        const b = 15;
        // Top Left
        ctx.beginPath();
        ctx.moveTo(cx - 100, cy - 60 + b);
        ctx.lineTo(cx - 100, cy - 60);
        ctx.lineTo(cx - 100 + b, cy - 60);
        ctx.stroke();
        // Top Right
        ctx.beginPath();
        ctx.moveTo(cx + 100, cy - 60 + b);
        ctx.lineTo(cx + 100, cy - 60);
        ctx.lineTo(cx + 100 - b, cy - 60);
        ctx.stroke();
        // Bottom Left
        ctx.beginPath();
        ctx.moveTo(cx - 100, cy + 60 - b);
        ctx.lineTo(cx - 100, cy + 60);
        ctx.lineTo(cx - 100 + b, cy + 60);
        ctx.stroke();
        // Bottom Right
        ctx.beginPath();
        ctx.moveTo(cx + 100, cy + 60 - b);
        ctx.lineTo(cx + 100, cy + 60);
        ctx.lineTo(cx + 100 - b, cy + 60);
        ctx.stroke();
        
        // Handle ripples
        ripples.forEach((rp, idx) => {
            rp.radius += 2.2;
            rp.alpha -= 0.035;
            if (rp.alpha <= 0) {
                ripples.splice(idx, 1);
                return;
            }
            ctx.strokeStyle = `hsla(${rp.hue}, 90%, 60%, ${rp.alpha})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(rp.x, rp.y, rp.radius, 0, Math.PI * 2);
            ctx.stroke();
        });
        
        rotation += 0.008;
        canvasAnimationId = requestAnimationFrame(draw);
    }
    
    draw();
}

// Render revision comments checklist
function renderRevisionsTimeline(proj) {
    const feed = document.getElementById("feedback-checklist-feed");
    if (!feed) return;

    if (!proj.revisions || proj.revisions.length === 0) {
        feed.innerHTML = `
            <div class="no-revisions-msg">
                <span style="font-size: 2.2rem;">🎬</span>
                <p style="margin-top: 12px;">No frame revision requests logged yet.</p>
                <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 4px;">Pause the draft video at any time, write your suggestion, and hit submit to log the first one!</p>
            </div>
        `;
        return;
    }

    feed.innerHTML = proj.revisions.map((rev, idx) => {
        let statusMarkup = rev.resolved ? 
            `<span class="feedback-status-badge resolved" style="color: #4ade80;">✓ Completed</span>` : 
            `<span class="feedback-status-badge pending" style="color: var(--accent-primary);">● Editorial Queue</span>`;

        return `
            <div class="feedback-timeline-item" onclick="scrubToTimestamp('${rev.time}')">
                <div class="feedback-item-header">
                    <span class="feedback-time-stamp">⏱ ${rev.time}</span>
                    ${statusMarkup}
                </div>
                <p class="feedback-item-text">"${rev.text}"</p>
            </div>
        `;
    }).join("");
}

// 7. Playhead time capture dynamics
function setupPlayheadCapture() {
    const player = document.getElementById("draft-video-player");
    const badge = document.getElementById("current-playhead-badge");
    const captureBtn = document.getElementById("capture-time-btn");

    if (!player || !badge) return;

    function formatTime(seconds) {
        const m = Math.floor(seconds / 60).toString().padStart(2, "0");
        const s = Math.floor(seconds % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    }

    player.addEventListener("timeupdate", () => {
        badge.textContent = formatTime(player.currentTime);
    });

    if (captureBtn) {
        captureBtn.addEventListener("click", () => {
            badge.textContent = formatTime(player.currentTime);
        });
    }
}

// Jumps video playhead
window.scrubToTimestamp = function(timeStr) {
    const player = document.getElementById("draft-video-player");
    if (!player) return;

    const parts = timeStr.split(":");
    if (parts.length === 2) {
        const min = parseInt(parts[0], 10);
        const sec = parseInt(parts[1], 10);
        player.currentTime = (min * 60) + sec;
        player.play().catch(e => console.log("Interrupted"));
    }
};

// 8. Feedback Form Submission
function setupRevisionForm() {
    const form = document.getElementById("timestamp-feedback-form");
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        if (!activeProjectForRevision) {
            alert("No active draft project loaded for feedback!");
            return;
        }

        const timeStamp = document.getElementById("current-playhead-badge").textContent;
        const textValue = document.getElementById("feedback-text").value.trim();

        const db = getDB();
        const client = db.clients.find(c => c.email === activeClientEmail);
        const proj = client.projects.find(p => p.id === activeProjectForRevision);

        if (proj) {
            if (!proj.revisions) proj.revisions = [];
            
            proj.revisions.push({
                time: timeStamp,
                text: textValue,
                resolved: false
            });

            saveDB(db);
            renderRevisionsTimeline(proj);

            document.getElementById("feedback-text").value = "";
            alert(`Logged your revision request at frame time ${timeStamp}!`);
        }
    });
}

// 9. Submit Intake Brief Form
function setupBriefForm() {
    const form = document.getElementById("client-brief-form");
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const title = document.getElementById("brief-title").value.trim();
        const platform = document.getElementById("brief-platform").value;
        const pacing = document.getElementById("brief-pacing").value;
        const textAnim = document.getElementById("brief-text-anim").value;
        const footageUrl = document.getElementById("brief-footage").value.trim();
        const details = document.getElementById("brief-details").value.trim();

        const db = getDB();
        const client = db.clients.find(c => c.email === activeClientEmail);

        if (client) {
            const newBriefProj = {
                id: "cp-" + Date.now(),
                title: title,
                status: "In Queue",
                progress: 0,
                deliveryDate: "Awaiting Schedule",
                videoUrl: "assets/videos/solo showreel.mp4",
                revisions: [],
                obsStream: {
                    active: false,
                    server: "rtmp://live.framezonemedia.com/live",
                    key: "fz_live_" + client.name.replace(/\s+/g, '_').toLowerCase()
                },
                metadata: {
                    platform: platform,
                    pacing: pacing,
                    textAnim: textAnim,
                    footageUrl: footageUrl,
                    details: details
                }
            };

            client.projects.push(newBriefProj);
            
            db.inbox.push({
                id: "inq-" + Date.now(),
                name: client.name,
                email: client.email,
                brand: client.company,
                service: platform + " Editing",
                assetsLink: footageUrl,
                details: `Project: ${title}. Pacing: ${pacing}. Subtitles Style: ${textAnim}. Direct Guidelines: ${details}`,
                scheduledCall: "Awaiting Assignment",
                dateReceived: new Date().toLocaleDateString()
            });

            saveDB(db);

            renderActiveDeliverables(client);

            form.reset();
            alert("Success! Your video brief has been sent to our editor queue. Our creative team will review assets and schedule delivery!");

            const tabs = document.querySelectorAll(".dash-tab");
            const contents = document.querySelectorAll(".dash-tab-content");
            
            tabs.forEach(t => t.classList.remove("active"));
            contents.forEach(c => c.classList.remove("active"));

            const targetTab = Array.from(tabs).find(t => t.getAttribute("data-target") === "dash-active-projects");
            if (targetTab) targetTab.classList.add("active");
            
            document.getElementById("dash-active-projects").classList.add("active");
        }
    });
}

// 10. Client Portal Log Out Workspace Logic
function setupLogout() {
    const logoutBtn = document.getElementById("client-logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            sessionStorage.removeItem("fzmedia_logged_client");
            activeClientEmail = null;
            // Clear session memory and redirect back to login panel
            window.location.reload();
        });
    }
}

// 11. Client Support Chat Hub [NEW]
function setupClientChat() {
    const chatForm = document.getElementById("client-chat-form");
    if (!chatForm) return;

    chatForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const input = document.getElementById("client-chat-input");
        const msgText = input.value.trim();
        if (!msgText) return;

        const db = getDB();
        const client = db.clients.find(c => c.email === activeClientEmail);
        if (!client) return;

        client.messages = client.messages || [];
        
        client.messages.push({
            sender: "client",
            text: msgText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });

        saveDB(db);
        renderChatMessages(client);
        
        input.value = "";
    });
}

function renderChatMessages(client) {
    const chatContainer = document.getElementById("client-chat-messages");
    if (!chatContainer) return;

    const messages = client.messages || [];

    if (messages.length === 0) {
        chatContainer.innerHTML = `
            <div style="text-align: center; color: var(--text-muted); margin-top: 80px;">
                <span style="font-size: 2.2rem; display: block; margin-bottom: 12px;">💬</span>
                <strong>Start a conversation!</strong>
                <p style="font-size: 0.85rem; margin-top: 4px;">Type a message below to coordinate revisions or strategy questions with Protik Hasan.</p>
            </div>
        `;
        return;
    }

    chatContainer.innerHTML = messages.map(msg => {
        const isAdmin = msg.sender === "admin";
        const align = isAdmin ? "flex-start" : "flex-end";
        const bg = isAdmin ? "rgba(255,255,255,0.04)" : "var(--accent-primary-glow)";
        const border = isAdmin ? "border-color: var(--border-color);" : "border-color: var(--accent-primary);";
        const senderName = isAdmin ? "FZ Support" : "You";
        const color = isAdmin ? "color: var(--accent-secondary);" : "color: var(--accent-primary);";

        return `
            <div style="align-self: ${align}; max-width: 75%; background: ${bg}; border: 1px solid; ${border} padding: 12px 18px; border-radius: var(--radius-sm); display: flex; flex-direction: column; gap: 4px; box-shadow: 0 4px 15px rgba(0,0,0,0.15); margin-bottom: 4px;">
                <div style="display: flex; justify-content: space-between; gap: 20px; font-size: 0.72rem; font-weight: 700; ${color}">
                    <span>${senderName}</span>
                    <span style="color: var(--text-muted);">${msg.timestamp || ''}</span>
                </div>
                <div style="font-size: 0.9rem; line-height: 1.45; color: var(--text-primary); word-break: break-word;">${msg.text}</div>
            </div>
        `;
    }).join("");

    // Auto scroll chat to the bottom
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function setupPasswordToggles() {
    const toggleBtns = document.querySelectorAll(".password-toggle-eye");
    toggleBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const input = btn.parentElement.querySelector("input");
            if (!input) return;
            const isPassword = input.type === "password";
            input.type = isPassword ? "text" : "password";
            
            const visibleIcon = btn.querySelector(".eye-icon-visible");
            const hiddenIcon = btn.querySelector(".eye-icon-hidden");
            
            if (isPassword) {
                if (visibleIcon) visibleIcon.style.display = "block";
                if (hiddenIcon) hiddenIcon.style.display = "none";
            } else {
                if (visibleIcon) visibleIcon.style.display = "none";
                if (hiddenIcon) hiddenIcon.style.display = "block";
            }
        });
    });
}

// 12. Centralized FZ Rendering loop animation for In Queue/Editing states
let activeProcessingInterval = null;

function startProcessingLoops() {
    // Clear any existing interval to prevent memory leaks
    if (activeProcessingInterval) {
        clearInterval(activeProcessingInterval);
    }

    const widgets = document.querySelectorAll(".vsl-processing-widget");
    if (widgets.length === 0) return;

    // Define standard creative editing phases
    const phases = [
        { title: "Raw Footage Analysis 📁", sub: "Ingesting media files and syncing high-quality dialogue feeds..." },
        { title: "Kinetic Trim & Pacing ✂️", sub: "Trimming filler words and shaping dynamic creative hooks..." },
        { title: "AE Motions & Typo ⚡", sub: "Rendering vector motion animations and custom captions overlay..." },
        { title: "HSL Color Grading 🎨", sub: "Balancing camera profiles and grading premium custom LUTs..." },
        { title: "Sound Design & Master 🔊", sub: "Integrating sound FX sweeps and mastering background elements..." }
    ];

    const projectStates = {};

    widgets.forEach(widget => {
        const id = widget.getAttribute("data-proj-id");
        const realProgress = parseInt(widget.getAttribute("data-real-progress") || "0", 10);
        projectStates[id] = {
            current: 0,
            target: realProgress
        };
        // Remove pulse at beginning
        widget.classList.remove("progress-complete-pulse");
    });

    activeProcessingInterval = setInterval(() => {
        let allDone = true;
        widgets.forEach(widget => {
            const id = widget.getAttribute("data-proj-id");
            const state = projectStates[id];
            if (!state) return;

            if (state.current < state.target) {
                state.current += 1;
                allDone = false;
            } else {
                // Add slowly breathing glow pulse once reached target
                widget.classList.add("progress-complete-pulse");
            }

            // Update percentage label
            const percentEl = document.getElementById(`ring-percent-${id}`);
            if (percentEl) {
                percentEl.textContent = `${state.current}%`;
            }

            // Update SVG circle stroke offset (Circumference = 2 * PI * r = 2 * 3.14 * 30 = 188)
            const circleEl = document.getElementById(`ring-active-${id}`);
            if (circleEl) {
                const circumference = 188;
                const offset = circumference - (state.current / 100) * circumference;
                circleEl.style.strokeDashoffset = offset;
            }

            // Update detailed phase text according to progress brackets (20% increments)
            const titleEl = document.getElementById(`ring-title-${id}`);
            const subEl = document.getElementById(`ring-sub-${id}`);
            
            const phaseIndex = Math.min(Math.floor(state.current / 20), phases.length - 1);
            const currentPhase = phases[phaseIndex];

            if (titleEl && currentPhase) {
                titleEl.innerHTML = `⚙️ ${currentPhase.title}`;
            }
            if (subEl && currentPhase) {
                subEl.textContent = currentPhase.sub;
            }
        });

        if (allDone) {
            clearInterval(activeProcessingInterval);
        }
    }, 45); // Smooth counts up fast!
}

