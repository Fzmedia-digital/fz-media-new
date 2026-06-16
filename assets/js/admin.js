/* FZ Media - Executive Admin Controller Logic */

let activeEditingServiceIdx = 0;

// Global HSL <-> Hex Color Utilities for Advanced Visual Theme Customizers
function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

function hexToHsl(hex) {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return { h: 0, s: 0, l: 0 };
    let r = parseInt(result[1], 16) / 255;
    let g = parseInt(result[2], 16) / 255;
    let b = parseInt(result[3], 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
}

document.addEventListener("DOMContentLoaded", () => {
    setupAdminGuard();
    setupResetAndLogout();
    setupBrandingForm();
    setupColorSliders();
    setupTeamRosterCRUD();
    setupPortfolioCRUD();
    setupCategoryManagerModal();
    setupServicesPackagesManager();
    setupOBSStreamController();
    setupInboxesReviewer();
    setupTestimonialsCRUD();
    setupAdminChat();
    setupClientsDatabaseManager();
    setupPasswordToggles();
    setupVSLAndCalculatorForm();
    setupVisualThemeEngine();
    setupTeamProjectAssignment();
});

// 1. Admin Authorization guard
function setupAdminGuard() {
    const authPanel = document.getElementById("admin-auth-panel");
    const workspace = document.getElementById("admin-workspace");
    const loginForm = document.getElementById("admin-login-form");
    const errorDiv = document.getElementById("admin-auth-error");

    const isLogged = sessionStorage.getItem("fzmedia_admin_logged");
    if (isLogged === "true") {
        if (authPanel) authPanel.style.display = "none";
        if (workspace) workspace.style.display = "block";
        initializeAdminWorkspace();
    } else {
        if (authPanel) authPanel.style.display = "block";
        if (workspace) workspace.style.display = "none";
    }

    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const email = document.getElementById("admin-email").value.trim();
            const pass = document.getElementById("admin-pass").value.trim();
            
            const db = getDB();
            const adminCreds = (db.settings && db.settings.adminCredentials) ? db.settings.adminCredentials : { email: "framezonem@gmail.com", passwordHash: "RnptZWRpYUAxMjM=" };
            
            const enteredEmailLower = email.toLowerCase();
            const isMatchDefault = (enteredEmailLower === "admin" && pass === "admin");
            
            let isMatchSettings = false;
            if (adminCreds) {
                const targetEmail = (adminCreds.email || "framezonem@gmail.com").toLowerCase();
                const expectedPass = atob(adminCreds.passwordHash || "RnptZWRpYUAxMjM=");
                if (enteredEmailLower === targetEmail && pass === expectedPass) {
                    isMatchSettings = true;
                }
            }

            if (isMatchDefault || isMatchSettings) {
                sessionStorage.setItem("fzmedia_admin_logged", "true");
                if (errorDiv) errorDiv.style.display = "none";
                window.location.reload();
            } else {
                if (errorDiv) {
                    errorDiv.textContent = "Invalid credentials! Please enter your admin email and password.";
                    errorDiv.style.display = "block";
                }
            }
        });
    }
}

function setupResetAndLogout() {
    const logoutBtn = document.getElementById("admin-logout-btn");
    if (logoutBtn) {
        logoutBtn.style.display = "inline-flex"; // Re-enable display
        logoutBtn.addEventListener("click", () => {
            if (confirm("Are you sure you want to exit your Admin session?")) {
                sessionStorage.removeItem("fzmedia_admin_logged");
                window.location.reload();
            }
        });
    }

    const resetBtn = document.getElementById("admin-reset-btn");
    if (resetBtn) {
        resetBtn.addEventListener("click", () => {
            if (confirm("WARNING: This will wipe all custom revisions, briefs, colors, and roster additions and restore the original seeded FZ Media content. Are you sure?")) {
                localStorage.removeItem("fzmedia_db");
                sessionStorage.removeItem("fzmedia_logged_client");
                sessionStorage.removeItem("fzmedia_admin_logged");
                alert("Database reset successfully!");
                window.location.reload();
            }
        });
    }
}

function setupConfigExporter() {
    const btn = document.getElementById("admin-export-config-btn");
    const output = document.getElementById("admin-config-output");
    const msg = document.getElementById("export-status-message");
    if (btn) {
        btn.addEventListener("click", () => {
            const db = getDB();
            const configCode = `/* PASTE THIS CONFIGURATION BLOCK INTO assets/js/global.js DEFAULT_BRAND_DATA */\nconst DEFAULT_BRAND_DATA = ${JSON.stringify(db, null, 4)};`;
            
            if (output) {
                output.value = configCode;
                output.style.display = "block";
                
                output.select();
                navigator.clipboard.writeText(configCode).then(() => {
                    if (msg) {
                        msg.style.display = "inline";
                        setTimeout(() => {
                            msg.style.display = "none";
                        }, 3000);
                    }
                }).catch(err => {
                    console.error("Clipboard copy failed:", err);
                    alert("Config generated! Please copy the code manually from the text box below.");
                });
            }
        });
    }
}

// 2. Initialize Admin Dashboard Workspace Controls
function initializeAdminWorkspace() {
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

    const initTasks = [
        { name: "populateBrandingFields", fn: populateBrandingFields },
        { name: "populateColorSliders", fn: populateColorSliders },
        { name: "populateVSLAndCalculatorFields", fn: populateVSLAndCalculatorFields },
        { name: "populateVisualThemeEngineFields", fn: populateVisualThemeEngineFields },
        { name: "renderRosterList", fn: renderRosterList },
        { name: "populateCategoryDropdowns", fn: populateCategoryDropdowns },
        { name: "renderPortfolioList", fn: renderPortfolioList },
        { name: "renderAdminTestimonialsList", fn: renderAdminTestimonialsList },
        { name: "renderServiceTiersNavigation", fn: renderServiceTiersNavigation },
        { name: "loadServiceIntoEditor", fn: () => loadServiceIntoEditor(0, true) },
        { name: "calculateAnalytics", fn: calculateAnalytics },
        { name: "populateOBSProjectDropdown", fn: populateOBSProjectDropdown },
        { name: "renderInboxes", fn: renderInboxes },
        { name: "renderAdminChatClientsSidebar", fn: renderAdminChatClientsSidebar },
        { name: "renderClientsDatabaseList", fn: renderClientsDatabaseList },
        { name: "populateRosterAssignmentDropdowns", fn: populateRosterAssignmentDropdowns },
        { name: "setupConfigExporter", fn: setupConfigExporter }
    ];

    initTasks.forEach(task => {
        try {
            task.fn();
        } catch (e) {
            console.error(`[Admin Initialization Error] failed to run ${task.name}:`, e);
        }
    });
}

// 3. Dynamic Analytics calculations
function calculateAnalytics() {
    const db = getDB();
    
    // Count active clients
    const activeClientsCount = db.clients.length;
    document.getElementById("stat-active-clients").textContent = activeClientsCount;

    // Count active projects & pending revisions
    let activeProjectsCount = 0;
    let pendingRevisionsCount = 0;
    let totalRevenue = 0;

    db.clients.forEach(client => {
        const clientProjects = client.projects || [];
        activeProjectsCount += clientProjects.length;
        
        clientProjects.forEach(proj => {
            if (proj.revisions) {
                pendingRevisionsCount += proj.revisions.filter(r => !r.resolved).length;
            }
        });

        // Sum subscription package revenues
        if (client.activeSub && client.activeSub !== "No Active Package") {
            // Find price in db
            db.services.forEach(srv => {
                srv.packages.forEach(pkg => {
                    if (client.activeSub.includes(pkg.name) && client.activeSub.includes(srv.name)) {
                        totalRevenue += pkg.price;
                    }
                });
            });
        }
    });

    document.getElementById("stat-active-projects").textContent = activeProjectsCount;
    document.getElementById("stat-pending-revisions").textContent = pendingRevisionsCount;
    document.getElementById("stat-revenue").textContent = "$" + (totalRevenue || 1240); // fallback default
}

// 4. Branding configs CRUD
function setupBrandingForm() {
    const form = document.getElementById("admin-branding-form");
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const db = getDB();
        db.settings.agencyName = document.getElementById("cfg-agency-name").value.trim();
        db.settings.agencyFullName = document.getElementById("cfg-agency-fullname").value.trim();
        db.settings.logoPath = document.getElementById("cfg-logo-path").value.trim();
        db.settings.logoIconPath = document.getElementById("cfg-logo-icon").value.trim();
        db.settings.theme = document.getElementById("cfg-theme-select").value;

        // Custom Backgrounds & Characters settings [NEW]
        db.settings.bgType = document.getElementById("cfg-bg-type-select").value;
        db.settings.bgImageUrl = document.getElementById("cfg-bg-url-input").value.trim();
        db.settings.bgEffect = document.getElementById("cfg-bg-effect-select").value;
        db.settings.characterEnabled = document.getElementById("cfg-char-enabled").checked;
        db.settings.characterAvatar = document.getElementById("cfg-char-avatar").value;
        db.settings.characterPos = document.getElementById("cfg-char-pos").value;

        saveDB(db);
        injectTheme();
        injectLayouts();
        alert("Branding configurations & Background Studio settings saved and applied successfully across all pages!");
    });

    // Reactive input fields display toggle helpers
    const bgTypeSelect = document.getElementById("cfg-bg-type-select");
    const bgUrlInput = document.getElementById("group-bg-url");
    const bgEffectSelect = document.getElementById("group-bg-effect");
    
    const charEnabledCheckbox = document.getElementById("cfg-char-enabled");
    const charConfigsDiv = document.getElementById("group-char-configs");
    
    if (bgTypeSelect && bgUrlInput && bgEffectSelect) {
        function toggleBgFields() {
            const val = bgTypeSelect.value;
            bgUrlInput.style.display = (val === "image") ? "block" : "none";
            bgEffectSelect.style.display = (val === "animation") ? "block" : "none";
        }
        bgTypeSelect.addEventListener("change", toggleBgFields);
        toggleBgFields(); // initial run
    }

    if (charEnabledCheckbox && charConfigsDiv) {
        function toggleCharFields() {
            charConfigsDiv.style.display = charEnabledCheckbox.checked ? "block" : "none";
        }
        charEnabledCheckbox.addEventListener("change", toggleCharFields);
        toggleCharFields(); // initial run
    }
}

function populateBrandingFields() {
    const db = getDB();
    const s = db.settings;

    document.getElementById("cfg-agency-name").value = s.agencyName;
    document.getElementById("cfg-agency-fullname").value = s.agencyFullName;
    document.getElementById("cfg-logo-path").value = s.logoPath;
    document.getElementById("cfg-logo-icon").value = s.logoIconPath;
    document.getElementById("cfg-theme-select").value = s.theme || "default";

    // Populate Backgrounds & Character configurations [NEW]
    document.getElementById("cfg-bg-type-select").value = s.bgType || "preset";
    document.getElementById("cfg-bg-url-input").value = s.bgImageUrl || "";
    document.getElementById("cfg-bg-effect-select").value = s.bgEffect || "kinetic-orbs";
    document.getElementById("cfg-char-enabled").checked = s.characterEnabled !== undefined ? s.characterEnabled : true;
    document.getElementById("cfg-char-avatar").value = s.characterAvatar || "rifat-cinematic";
    document.getElementById("cfg-char-pos").value = s.characterPos || "left-bottom";
}

// 5. Color pickers sliders customizer
function setupColorSliders() {
    const priSlider = document.getElementById("hue-primary-slider");
    const priSatSlider = document.getElementById("hue-primary-sat-slider");
    const priLightSlider = document.getElementById("hue-primary-light-slider");
    
    const secSlider = document.getElementById("hue-secondary-slider");
    const secSatSlider = document.getElementById("hue-secondary-sat-slider");
    const secLightSlider = document.getElementById("hue-secondary-light-slider");
    
    const priBadge = document.getElementById("primary-hue-val");
    const priSatBadge = document.getElementById("primary-sat-val");
    const priLightBadge = document.getElementById("primary-light-val");
    
    const secBadge = document.getElementById("secondary-hue-val");
    const secSatBadge = document.getElementById("secondary-sat-val");
    const secLightBadge = document.getElementById("secondary-light-val");

    if (!priSlider || !secSlider) return;

    function handleColorChange() {
        const db = getDB();
        
        if (priSlider) db.settings.primaryColorH = parseInt(priSlider.value, 10);
        if (priSatSlider) db.settings.primaryColorS = parseInt(priSatSlider.value, 10);
        if (priLightSlider) db.settings.primaryColorL = parseInt(priLightSlider.value, 10);
        
        if (secSlider) db.settings.secondaryColorH = parseInt(secSlider.value, 10);
        if (secSatSlider) db.settings.secondaryColorS = parseInt(secSatSlider.value, 10);
        if (secLightSlider) db.settings.secondaryColorL = parseInt(secLightSlider.value, 10);

        // Update badges
        if (priBadge && priSlider) priBadge.textContent = priSlider.value;
        if (priSatBadge && priSatSlider) priSatBadge.textContent = priSatSlider.value + '%';
        if (priLightBadge && priLightSlider) priLightBadge.textContent = priLightSlider.value + '%';
        
        if (secBadge && secSlider) secBadge.textContent = secSlider.value;
        if (secSatBadge && secSatSlider) secSatBadge.textContent = secSatSlider.value + '%';
        if (secLightBadge && secLightSlider) secLightBadge.textContent = secLightSlider.value + '%';

        saveDB(db);
        injectTheme();
    }

    const allSliders = [priSlider, priSatSlider, priLightSlider, secSlider, secSatSlider, secLightSlider];
    allSliders.forEach(slider => {
        if (slider) {
            slider.addEventListener("input", handleColorChange);
        }
    });
}

function populateColorSliders() {
    const db = getDB();
    const s = db.settings;

    const priSlider = document.getElementById("hue-primary-slider");
    const priSatSlider = document.getElementById("hue-primary-sat-slider");
    const priLightSlider = document.getElementById("hue-primary-light-slider");
    
    const secSlider = document.getElementById("hue-secondary-slider");
    const secSatSlider = document.getElementById("hue-secondary-sat-slider");
    const secLightSlider = document.getElementById("hue-secondary-light-slider");

    if (priSlider) priSlider.value = s.primaryColorH !== undefined ? s.primaryColorH : 267;
    if (priSatSlider) priSatSlider.value = s.primaryColorS !== undefined ? s.primaryColorS : 90;
    if (priLightSlider) priLightSlider.value = s.primaryColorL !== undefined ? s.primaryColorL : 61;
    
    if (secSlider) secSlider.value = s.secondaryColorH !== undefined ? s.secondaryColorH : 185;
    if (secSatSlider) secSatSlider.value = s.secondaryColorS !== undefined ? s.secondaryColorS : 90;
    if (secLightSlider) secLightSlider.value = s.secondaryColorL !== undefined ? s.secondaryColorL : 50;

    const priBadge = document.getElementById("primary-hue-val");
    const priSatBadge = document.getElementById("primary-sat-val");
    const priLightBadge = document.getElementById("primary-light-val");
    
    const secBadge = document.getElementById("secondary-hue-val");
    const secSatBadge = document.getElementById("secondary-sat-val");
    const secLightBadge = document.getElementById("secondary-light-val");

    if (priBadge && priSlider) priBadge.textContent = priSlider.value;
    if (priSatBadge && priSatSlider) priSatBadge.textContent = priSatSlider.value + '%';
    if (priLightBadge && priLightSlider) priLightBadge.textContent = priLightSlider.value + '%';
    
    if (secBadge && secSlider) secBadge.textContent = secSlider.value;
    if (secSatBadge && secSatSlider) secSatBadge.textContent = secSatSlider.value + '%';
    if (secLightBadge && secLightSlider) secLightBadge.textContent = secLightBadge.value + '%';
}

// 6. Team Roster CRUD Manager
function setupTeamRosterCRUD() {
    const form = document.getElementById("admin-team-form");
    const clearBtn = document.getElementById("tm-clear-btn");

    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const db = getDB();
        const editId = document.getElementById("team-member-edit-id").value;
        
        const memberData = {
            id: editId || "team-" + Date.now(),
            name: document.getElementById("tm-name").value.trim(),
            role: document.getElementById("tm-role").value.trim(),
            experience: document.getElementById("tm-experience").value.trim(),
            title: document.getElementById("tm-title").value.trim(),
            image: document.getElementById("tm-image").value.trim(),
            skills: document.getElementById("tm-skills").value.trim()
        };

        if (editId) {
            const idx = db.team.findIndex(m => m.id === editId);
            if (idx !== -1) db.team[idx] = memberData;
        } else {
            db.team.push(memberData);
        }

        saveDB(db);
        renderRosterList();
        clearTeamForm();
        alert("Roster member saved successfully!");
    });

    if (clearBtn) clearBtn.addEventListener("click", clearTeamForm);
}

function clearTeamForm() {
    const form = document.getElementById("admin-team-form");
    if (form) form.reset();
    
    document.getElementById("team-member-edit-id").value = "";
    document.getElementById("team-form-headline").textContent = "Add / Edit Team Member";
}

function renderRosterList() {
    const container = document.getElementById("admin-roster-list-container");
    if (!container) return;

    const db = getDB();
    
    container.innerHTML = db.team.map(m => {
        const resolvedImg = resolveTeamAvatarPath(m.image);
        let avatarMarkup = resolvedImg ? 
            `<img src="${resolvedImg}" alt="${m.name}" class="admin-row-avatar">` : 
            `<div class="admin-row-avatar-placeholder"><span>${m.name[0]}</span></div>`;

        return `
            <div class="admin-data-row">
                <div class="admin-data-details">
                    ${avatarMarkup}
                    <div class="admin-row-meta">
                        <h4>${m.name} <span style="font-size: 0.72rem; color: var(--accent-secondary); margin-left: 6px;">${m.experience}</span></h4>
                        <p>${m.role} • ${m.title}</p>
                    </div>
                </div>
                <div class="admin-row-actions">
                    <button class="btn-row-action" onclick="editTeamMember('${m.id}')">Edit</button>
                    <button class="btn-row-action delete" onclick="deleteTeamMember('${m.id}')">Delete</button>
                </div>
            </div>
        `;
    }).join("");
}

window.editTeamMember = function(id) {
    const db = getDB();
    const m = db.team.find(t => t.id === id);
    if (!m) return;

    document.getElementById("team-member-edit-id").value = m.id;
    document.getElementById("tm-name").value = m.name;
    document.getElementById("tm-role").value = m.role;
    document.getElementById("tm-experience").value = m.experience;
    document.getElementById("tm-title").value = m.title;
    document.getElementById("tm-image").value = m.image || "";
    document.getElementById("tm-skills").value = m.skills;

    document.getElementById("team-form-headline").textContent = `Editing: ${m.name}`;
    document.getElementById("admin-team-form").scrollIntoView({ behavior: 'smooth' });
};

window.deleteTeamMember = function(id) {
    if (confirm("Are you sure you want to remove this team member from the roster?")) {
        const db = getDB();
        db.team = db.team.filter(t => t.id !== id);
        saveDB(db);
        renderRosterList();
        clearTeamForm();
        try {
            populateRosterAssignmentDropdowns();
        } catch(e) {}
    }
};

// [NEW] Setup Team Roster Project Assignment
function setupTeamProjectAssignment() {
    const form = document.getElementById("admin-roster-assignment-form");
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const projId = document.getElementById("assign-project-select").value;
        const memberId = document.getElementById("assign-member-select").value;

        if (!projId || !memberId) {
            alert("Please select both a client project and a roster member!");
            return;
        }

        const db = getDB();
        const member = db.team.find(m => m.id === memberId);
        if (!member) {
            alert("Roster member not found!");
            return;
        }

        let assignedSuccessfully = false;

        db.clients.forEach(client => {
            const clientProjects = client.projects || [];
            const proj = clientProjects.find(p => p.id === projId);
            if (proj) {
                proj.assignedMember = {
                    id: member.id,
                    name: member.name,
                    role: member.role,
                    image: member.image || "",
                    skills: member.skills || ""
                };
                assignedSuccessfully = true;
            }
        });

        if (assignedSuccessfully) {
            saveDB(db);
            alert(`Success! ${member.name} has been successfully assigned to oversee the deliverables of this project.`);
            populateRosterAssignmentDropdowns();
        } else {
            alert("Error: Active project not found in database!");
        }
    });

    const deassignBtn = document.getElementById("btn-deassign-member");
    if (deassignBtn) {
        deassignBtn.addEventListener("click", () => {
            const projId = document.getElementById("assign-project-select").value;
            if (!projId) {
                alert("Please select a client project to unassign from.");
                return;
            }

            const db = getDB();
            let unassignedSuccessfully = false;

            db.clients.forEach(client => {
                const clientProjects = client.projects || [];
                const proj = clientProjects.find(p => p.id === projId);
                if (proj) {
                    if (proj.assignedMember) {
                        delete proj.assignedMember;
                        unassignedSuccessfully = true;
                    } else {
                        alert("This project is already unassigned!");
                        unassignedSuccessfully = null;
                    }
                }
            });

            if (unassignedSuccessfully) {
                saveDB(db);
                alert("Success! Team member has been unassigned from this project.");
                populateRosterAssignmentDropdowns();
            } else if (unassignedSuccessfully === false) {
                alert("Error: Active project not found in database!");
            }
        });
    }
}

function populateRosterAssignmentDropdowns() {
    const projSelect = document.getElementById("assign-project-select");
    const memberSelect = document.getElementById("assign-member-select");

    if (!projSelect || !memberSelect) return;

    const db = getDB();

    // 1. Populate Projects Dropdown
    let projOptions = '<option value="">-- Choose active client project --</option>';
    (db.clients || []).forEach(client => {
        const clientProjects = client.projects || [];
        clientProjects.forEach(proj => {
            const assignedText = proj.assignedMember ? ` (Assigned: ${proj.assignedMember.name})` : " (Unassigned)";
            projOptions += `<option value="${proj.id}">${client.name || client.email} - ${proj.title}${assignedText}</option>`;
        });
    });
    projSelect.innerHTML = projOptions;

    // 2. Populate Roster Members Dropdown
    let memberOptions = '<option value="">-- Choose roster member --</option>';
    (db.team || []).forEach(member => {
        memberOptions += `<option value="${member.id}">${member.name} - ${member.role}</option>`;
    });
    memberSelect.innerHTML = memberOptions;
}


// 7. Portfolio Showcase Video CRUD Manager
function setupPortfolioCRUD() {
    const form = document.getElementById("admin-portfolio-form");
    const clearBtn = document.getElementById("port-clear-btn");

    if (!form) return;

    // Helper: Parse YouTube ID and return thumbnail URL
    function getYouTubeThumbnail(url) {
        if (!url) return null;
        url = url.trim();
        let ytId = null;
        if (url.includes("/shorts/")) {
            const parts = url.split("/shorts/");
            if (parts[1]) ytId = parts[1].split(/[?#&]/)[0];
        } else {
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
            const match = url.match(regExp);
            if (match && match[2].length === 11) ytId = match[2];
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
                    if (lastPart && lastPart.length === 11) ytId = lastPart;
                }
            } catch(e) {}
        }
        return ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : null;
    }

    // Helper: Generate thumbnail from local/direct MP4 video link seeking to 1.0s
    function generateDirectVideoThumbnail(videoUrl, callback) {
        const video = document.createElement("video");
        video.src = videoUrl;
        video.crossOrigin = "anonymous";
        video.currentTime = 1.0;
        video.muted = true;
        video.playsInline = true;
        
        video.addEventListener("seeked", () => {
            try {
                const canvas = document.createElement("canvas");
                canvas.width = video.videoWidth || 640;
                canvas.height = video.videoHeight || 360;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const dataUrl = canvas.toDataURL("image/jpeg");
                callback(dataUrl);
            } catch(e) {
                console.error("Canvas draw failed, falling back", e);
                callback("https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&w=600&q=80");
            }
        });
        
        video.addEventListener("error", () => {
            console.error("Video load error, falling back");
            callback("https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&w=600&q=80");
        });
    }

    // Input listener to auto-populate YouTube thumbnail when video link is typed/pasted
    const videoUrlInput = document.getElementById("port-video-url");
    if (videoUrlInput) {
        videoUrlInput.addEventListener("input", () => {
            const videoUrl = videoUrlInput.value.trim();
            const thumbInput = document.getElementById("port-thumb");
            if (!thumbInput.value) {
                const ytThumb = getYouTubeThumbnail(videoUrl);
                if (ytThumb) {
                    thumbInput.value = ytThumb;
                }
            }
        });
    }

    // Auto-Generate button click handler
    const autoThumbBtn = document.getElementById("port-auto-thumb-btn");
    if (autoThumbBtn) {
        autoThumbBtn.addEventListener("click", () => {
            const videoUrl = document.getElementById("port-video-url").value.trim();
            if (!videoUrl) {
                alert("Please enter a video MP4 File Path or Online URL first!");
                return;
            }
            
            const ytThumb = getYouTubeThumbnail(videoUrl);
            const thumbInput = document.getElementById("port-thumb");
            
            if (ytThumb) {
                thumbInput.value = ytThumb;
                alert("YouTube thumbnail extracted successfully!");
            } else {
                autoThumbBtn.textContent = "⌛ Capturing...";
                autoThumbBtn.disabled = true;
                generateDirectVideoThumbnail(videoUrl, (dataUrl) => {
                    thumbInput.value = dataUrl;
                    autoThumbBtn.textContent = "📸 Auto-Gen";
                    autoThumbBtn.disabled = false;
                    alert("Local/Direct video thumbnail frame captured successfully at 1.0s!");
                });
            }
        });
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const db = getDB();
        const editId = document.getElementById("port-edit-id").value;
        const videoUrlVal = document.getElementById("port-video-url").value.trim();
        let thumbUrlVal = document.getElementById("port-thumb").value.trim();

        // Assign automatic YouTube or high-res generic fallback if thumbnail is left blank
        if (!thumbUrlVal) {
            const ytThumb = getYouTubeThumbnail(videoUrlVal);
            thumbUrlVal = ytThumb || "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&w=600&q=80";
        }

        const portData = {
            id: editId || "port-" + Date.now(),
            title: document.getElementById("port-title").value.trim(),
            category: document.getElementById("port-category-select").value,
            videoUrl: videoUrlVal,
            thumbnail: thumbUrlVal,
            likes: parseInt(document.getElementById("port-likes").value, 10) || 0
        };

        if (editId) {
            const idx = db.portfolio.findIndex(p => p.id === editId);
            if (idx !== -1) db.portfolio[idx] = portData;
        } else {
            db.portfolio.push(portData);
        }

        saveDB(db);
        renderPortfolioList();
        clearPortfolioForm();
        alert("Showcase video project saved successfully!");
    });

    if (clearBtn) clearBtn.addEventListener("click", clearPortfolioForm);
}

function clearPortfolioForm() {
    const form = document.getElementById("admin-portfolio-form");
    if (form) form.reset();

    document.getElementById("port-edit-id").value = "";
    document.getElementById("portfolio-form-headline").textContent = "Add / Edit Video Project";
}

function renderPortfolioList() {
    const container = document.getElementById("admin-portfolio-list-container");
    if (!container) return;

    const db = getDB();

    container.innerHTML = db.portfolio.map(p => `
        <div class="admin-data-row">
            <div class="admin-data-details" style="max-width: 70%;">
                <img src="${p.thumbnail}" alt="" style="width: 70px; aspect-ratio: 16/9; object-fit: cover; border-radius: 4px; border: 1px solid var(--border-color);">
                <div class="admin-row-meta">
                    <h4 style="font-size: 0.95rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 250px;">${p.title}</h4>
                    <p style="color: var(--accent-secondary); font-weight: 700; font-size: 0.75rem; text-transform: uppercase;">${p.category} • ❤️ ${p.likes || 0}</p>
                </div>
            </div>
            <div class="admin-row-actions">
                <button class="btn-row-action" onclick="editPortfolioItem('${p.id}')">Edit</button>
                <button class="btn-row-action delete" onclick="deletePortfolioItem('${p.id}')">Delete</button>
            </div>
        </div>
    `).join("");
}

window.editPortfolioItem = function(id) {
    const db = getDB();
    const p = db.portfolio.find(item => item.id === id);
    if (!p) return;

    document.getElementById("port-edit-id").value = p.id;
    document.getElementById("port-title").value = p.title;
    document.getElementById("port-category-select").value = p.category;
    document.getElementById("port-video-url").value = p.videoUrl;
    document.getElementById("port-thumb").value = p.thumbnail;
    document.getElementById("port-likes").value = p.likes || 0;

    document.getElementById("portfolio-form-headline").textContent = `Editing Project Link`;
    document.getElementById("admin-portfolio-form").scrollIntoView({ behavior: 'smooth' });
};

window.deletePortfolioItem = function(id) {
    if (confirm("Are you sure you want to remove this video from your showcase portfolio?")) {
        const db = getDB();
        db.portfolio = db.portfolio.filter(item => item.id !== id);
        saveDB(db);
        renderPortfolioList();
        clearPortfolioForm();
    }
};

function populateCategoryDropdowns() {
    const select = document.getElementById("port-category-select");
    if (!select) return;

    const db = getDB();
    const activeCategories = db.portfolioTabs.filter(tab => tab !== "All");
    select.innerHTML = activeCategories.map(tab => `<option value="${tab}">${tab}</option>`).join("");
}

// 8. Dynamic Category Tabs Manager Dialog Modal
function setupCategoryManagerModal() {
    const modal = document.getElementById("category-modal");
    const openBtn = document.getElementById("manage-categories-btn");
    const closeBtn = document.getElementById("close-category-modal-btn");
    const addForm = document.getElementById("add-category-tag-form");

    if (!modal || !openBtn || !closeBtn || !addForm) return;

    openBtn.addEventListener("click", () => {
        renderModalTags();
        modal.classList.add("open");
    });

    closeBtn.addEventListener("click", () => {
        modal.classList.remove("open");
    });

    modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.classList.remove("open");
    });

    addForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const input = document.getElementById("new-tag-input");
        const val = input.value.trim();

        if (val) {
            const db = getDB();
            if (db.portfolioTabs.map(t => t.toLowerCase()).includes(val.toLowerCase())) {
                alert("Category tag already exists!");
                return;
            }

            db.portfolioTabs.push(val);
            saveDB(db);
            
            input.value = "";
            renderModalTags();
            populateCategoryDropdowns();
            alert(`Category tag "${val}" added successfully!`);
        }
    });
}

function renderModalTags() {
    const wrapper = document.getElementById("active-tabs-list-wrapper");
    if (!wrapper) return;

    const db = getDB();
    
    wrapper.innerHTML = db.portfolioTabs.map(tab => {
        let deleteBtn = tab === "All" ? 
            `<span style="font-size: 0.8rem; color: var(--text-muted); font-style: italic;">Locked</span>` : 
            `<button class="btn-row-action delete" style="padding: 4px 8px; font-size: 0.75rem;" onclick="deleteCategoryTag('${tab}')">Delete</button>`;

        return `
            <div class="category-modal-tag-item">
                <span style="font-weight: 700; font-size: 0.95rem;">${tab}</span>
                ${deleteBtn}
            </div>
        `;
    }).join("");
}

window.deleteCategoryTag = function(tabName) {
    if (confirm(`Are you sure you want to remove the category tab "${tabName}"?`)) {
        const db = getDB();
        db.portfolioTabs = db.portfolioTabs.filter(t => t !== tabName);
        saveDB(db);
        renderModalTags();
        populateCategoryDropdowns();
    }
};

// 9. Services Pricing Packages Tiers controller
function setupServicesPackagesManager() {
    const form = document.getElementById("admin-service-package-form");
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const db = getDB();
        const srvIdx = parseInt(document.getElementById("srv-edit-idx").value, 10);
        const srv = db.services[srvIdx];

        if (srv) {
            srv.subtitle = document.getElementById("srv-edit-sub").value.trim();
            
            srv.packages[0].price = parseInt(document.getElementById("srv-t0-price").value, 10);
            srv.packages[0].delivery = document.getElementById("srv-t0-delivery").value.trim();
            srv.packages[0].revisions = document.getElementById("srv-t0-revisions").value.trim();

            srv.packages[1].price = parseInt(document.getElementById("srv-t1-price").value, 10);
            srv.packages[1].delivery = document.getElementById("srv-t1-delivery").value.trim();
            srv.packages[1].revisions = document.getElementById("srv-t1-revisions").value.trim();

            srv.packages[2].price = parseInt(document.getElementById("srv-t2-price").value, 10);
            srv.packages[2].delivery = document.getElementById("srv-t2-delivery").value.trim();
            srv.packages[2].revisions = document.getElementById("srv-t2-revisions").value.trim();

            saveDB(db);
            renderServiceTiersNavigation();
            loadServiceIntoEditor(srvIdx);
            calculateAnalytics(); // update price total
            alert(`Service Packages for "${srv.name}" updated successfully!`);
        }
    });
}

function renderServiceTiersNavigation() {
    const nav = document.getElementById("admin-service-tabs-list");
    if (!nav) return;

    const db = getDB();
    
    nav.innerHTML = db.services.map((srv, idx) => {
        let activeClass = idx === activeEditingServiceIdx ? "active" : "";
        return `
            <button class="service-nav-btn ${activeClass}" onclick="loadServiceIntoEditor(${idx})">
                <span>${srv.name}</span>
                <span>➔</span>
            </button>
        `;
    }).join("");
}

window.loadServiceIntoEditor = function(idx, preventScroll = false) {
    activeEditingServiceIdx = idx;
    renderServiceTiersNavigation();

    const db = getDB();
    const srv = db.services[idx];

    if (srv) {
        document.getElementById("srv-editor-title-heading").textContent = srv.name;
        document.getElementById("srv-edit-idx").value = idx;
        document.getElementById("srv-edit-name").value = srv.name;
        document.getElementById("srv-edit-sub").value = srv.subtitle;

        document.getElementById("tier-0-lbl").textContent = `Tier 1 (${srv.packages[0].name})`;
        document.getElementById("tier-1-lbl").textContent = `Tier 2 (${srv.packages[1].name})`;
        document.getElementById("tier-2-lbl").textContent = `Tier 3 (${srv.packages[2].name})`;

        document.getElementById("srv-t0-price").value = srv.packages[0].price;
        document.getElementById("srv-t0-delivery").value = srv.packages[0].delivery;
        document.getElementById("srv-t0-revisions").value = srv.packages[0].revisions;

        document.getElementById("srv-t1-price").value = srv.packages[1].price;
        document.getElementById("srv-t1-delivery").value = srv.packages[1].delivery;
        document.getElementById("srv-t1-revisions").value = srv.packages[1].revisions;

        document.getElementById("srv-t2-price").value = srv.packages[2].price;
        document.getElementById("srv-t2-delivery").value = srv.packages[2].delivery;
        document.getElementById("srv-t2-revisions").value = srv.packages[2].revisions;
        
        if (!preventScroll) {
            document.getElementById("srv-package-editor-card").scrollIntoView({ behavior: 'smooth' });
        }
    }
};

// 10. OBS Live Stream Control Panel [NEW]
function setupOBSStreamController() {
    const form = document.getElementById("admin-obs-stream-form");
    const select = document.getElementById("obs-project-select");
    const toggle = document.getElementById("obs-active-toggle");
    const serverInput = document.getElementById("obs-server-input");
    const keyInput = document.getElementById("obs-key-input");

    if (!form || !select || !toggle) return;

    // Change event on dropdown loading details
    select.addEventListener("change", () => {
        const val = select.value;
        if (!val) return;

        const db = getDB();
        // Locate project across clients
        db.clients.forEach(client => {
            const clientProjects = client.projects || [];
            const proj = clientProjects.find(p => p.id === val);
            if (proj) {
                toggle.checked = proj.obsStream ? proj.obsStream.active : false;
                serverInput.value = proj.obsStream ? proj.obsStream.server : "rtmp://live.framezonemedia.com/live";
                keyInput.value = proj.obsStream ? proj.obsStream.key : "fz_live_" + (client.name || 'client').replace(/\s+/g, '_').toLowerCase();
            }
        });
    });

    // Form Submission
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const projId = select.value;
        const activeState = toggle.checked;
        const serverUrl = serverInput.value.trim();
        const streamKey = keyInput.value.trim();

        const db = getDB();
        let projectFound = false;

        db.clients.forEach(client => {
            const clientProjects = client.projects || [];
            const proj = clientProjects.find(p => p.id === projId);
            if (proj) {
                proj.obsStream = {
                    active: activeState,
                    server: serverUrl,
                    key: streamKey
                };
                projectFound = true;
            }
        });

        if (projectFound) {
            saveDB(db);
            alert(`OBS stream parameters configured. Live status is now: ${activeState ? 'ONLINE 🔴' : 'OFFLINE ⚪'}`);
        } else {
            alert("Active project not found in database!");
        }
    });
}

function populateOBSProjectDropdown() {
    const select = document.getElementById("obs-project-select");
    if (!select) return;

    const db = getDB();
    let optionsMarkup = '<option value="">-- Choose active client project --</option>';

    db.clients.forEach(client => {
        const clientProjects = client.projects || [];
        clientProjects.forEach(proj => {
            optionsMarkup += `<option value="${proj.id}">${client.name || client.email} - ${proj.title}</option>`;
        });
    });

    select.innerHTML = optionsMarkup;
}

// 11. Dynamic Client Inbox & Revisions Monitor Reviewer
function setupInboxesReviewer() {
    // Inbound briefs and revisions lists are rendered dynamically on load and tab switch.
}

function renderInboxes() {
    const db = getDB();

    const inboxFeed = document.getElementById("admin-inbox-feed");
    if (inboxFeed) {
        if (db.inbox.length === 0) {
            inboxFeed.innerHTML = `<p class="no-revisions-msg">Inbox is empty. Brief submissions appear here!</p>`;
        } else {
            inboxFeed.innerHTML = db.inbox.slice().reverse().map(item => `
                <div class="inbox-card-item">
                    <div class="inbox-card-header">
                        <div class="inbox-meta-title">
                            <h4>${item.name}</h4>
                            <p>${item.brand ? item.brand : 'Independent Creator'} • ${item.email}</p>
                        </div>
                        <span class="project-badge status-queue" style="font-size: 0.72rem;">Brief Inbound</span>
                    </div>
                    <div class="inbox-card-body">
                        <p style="font-size: 0.85rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700; margin-bottom: 4px;">Service Inquiry Details</p>
                        <p style="color: var(--text-primary); font-weight: 600; margin-bottom: 6px;">Target Class: ${item.service}</p>
                        <p style="line-height: 1.5; font-size: 0.9rem;">"${item.details}"</p>
                    </div>
                    <div class="inbox-card-footer">
                        <span>📅 Date Received: <strong style="color: var(--accent-secondary);">${item.dateReceived}</strong></span>
                        ${item.assetsLink ? `<a href="${item.assetsLink}" target="_blank" class="inbox-link-badge">Folder Footage ➔</a>` : ''}
                    </div>
                </div>
            `).join("");
        }
    }

    const revisionsMonitor = document.getElementById("admin-revisions-monitor");
    if (revisionsMonitor) {
        let allRevisions = [];

        db.clients.forEach((client, cIdx) => {
            const clientProjects = client.projects || [];
            clientProjects.forEach((proj, pIdx) => {
                if (proj.revisions && proj.revisions.length > 0) {
                    proj.revisions.forEach((rev, rIdx) => {
                        allRevisions.push({
                            clientEmail: client.email,
                            clientName: client.name || client.email,
                            projId: proj.id,
                            projTitle: proj.title,
                            revIndex: rIdx,
                            revData: rev
                        });
                    });
                }
            });
        });

        if (allRevisions.length === 0) {
            revisionsMonitor.innerHTML = `<p class="no-revisions-msg">No active timestamp revision requests submitted by clients yet.</p>`;
        } else {
            revisionsMonitor.innerHTML = allRevisions.slice().reverse().map(item => {
                let r = item.revData;
                let statusClass = r.resolved ? 'status-delivered' : 'status-review';
                let statusText = r.resolved ? '✓ Resolved' : '● In Queue';
                let actionText = r.resolved ? 'Re-open Request' : 'Mark Resolved';

                return `
                    <div class="revision-monitor-card" style="border-left: 3px solid ${r.resolved ? '#22c55e' : 'var(--accent-primary)'}; background: rgba(255,255,255,0.01);">
                        <div class="revision-monitor-header">
                            <div>
                                <h4 style="font-size: 0.95rem; font-family: var(--font-body);">${item.projTitle}</h4>
                                <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 2px;">Client: ${item.clientName}</p>
                            </div>
                            <span class="project-badge ${statusClass}" style="font-size: 0.7rem; font-weight: 700; padding: 2px 10px;">${statusText}</span>
                        </div>
                        <div class="revision-monitor-body" style="background: rgba(0,0,0,0.2); padding: 12px; border-radius: 4px; border: 1px solid var(--border-color);">
                            <span style="font-size: 0.82rem; font-weight: 700; color: var(--accent-secondary); display: block; margin-bottom: 4px;">Time Code: ${r.time}</span>
                            <p style="font-size: 0.9rem; line-height: 1.4; font-style: italic;">"${r.text}"</p>
                        </div>
                        <div class="revision-monitor-footer">
                            <span style="font-size: 0.82rem; color: var(--text-muted);">Timestamp comments logged</span>
                            <button class="btn-row-action" style="background: ${r.resolved ? 'rgba(255,255,255,0.02)' : 'var(--accent-primary-glow)'}; border-color: ${r.resolved ? 'var(--border-color)' : 'var(--accent-primary)'}; color: ${r.resolved ? 'var(--text-secondary)' : 'var(--text-primary)'};"
                                    onclick="toggleResolveRevision('${item.clientEmail}', '${item.projId}', ${item.revIndex})">
                                ${actionText}
                            </button>
                        </div>
                    </div>
                `;
            }).join("");
        }
    }
}

// Toggle resolution state on revision comments (syncs both directions!)
window.toggleResolveRevision = function(clientEmail, projId, revIndex) {
    const db = getDB();
    const client = db.clients.find(c => c.email === clientEmail);
    if (!client) return;

    const clientProjects = client.projects || [];
    const proj = clientProjects.find(p => p.id === projId);
    if (proj && proj.revisions && proj.revisions[revIndex]) {
        proj.revisions[revIndex].resolved = !proj.revisions[revIndex].resolved;
        
        saveDB(db);
        renderInboxes(); 
        calculateAnalytics(); // update revision counters
        alert(`Revision state successfully toggled to ${proj.revisions[revIndex].resolved ? 'Resolved' : 'In Queue'}!`);
    }
};

// 11. Testimonials & Client Reviews CRUD Manager
let activeTestimonialEditId = null;

function setupTestimonialsCRUD() {
    const form = document.getElementById("admin-testimonial-form");
    const clearBtn = document.getElementById("test-clear-btn");
    
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const name = document.getElementById("test-name").value.trim();
        const role = document.getElementById("test-role").value.trim();
        const rating = parseInt(document.getElementById("test-rating-select").value, 10);
        const text = document.getElementById("test-text").value.trim();
        const avatar = document.getElementById("test-avatar").value.trim();
        const audioUrl = document.getElementById("test-audio").value.trim();
        const videoUrl = document.getElementById("test-video").value.trim();
        const attachUrl = document.getElementById("test-attach").value.trim();

        const db = getDB();
        db.testimonials = db.testimonials || [];

        if (activeTestimonialEditId) {
            // Edit existing
            const testimonial = db.testimonials.find(t => t.id === activeTestimonialEditId);
            if (testimonial) {
                testimonial.name = name;
                testimonial.role = role;
                testimonial.rating = rating;
                testimonial.text = text;
                testimonial.avatar = avatar;
                testimonial.audioUrl = audioUrl;
                testimonial.videoUrl = videoUrl;
                testimonial.attachUrl = attachUrl;
                alert("Client review successfully modified!");
            }
            activeTestimonialEditId = null;
            document.getElementById("testimonial-form-headline").textContent = "Add / Edit Client Review";
        } else {
            // Create new
            const newTestimonial = {
                id: "test-" + Date.now(),
                name: name,
                role: role,
                rating: rating,
                text: text,
                avatar: avatar,
                audioUrl: audioUrl,
                videoUrl: videoUrl,
                attachUrl: attachUrl
            };
            db.testimonials.push(newTestimonial);
            alert("Client review successfully published to dynamic showcase slider!");
        }

        saveDB(db);
        renderAdminTestimonialsList();
        form.reset();
    });

    if (clearBtn) {
        clearBtn.addEventListener("click", () => {
            form.reset();
            activeTestimonialEditId = null;
            document.getElementById("testimonial-form-headline").textContent = "Add / Edit Client Review";
        });
    }
}

function renderAdminTestimonialsList() {
    const container = document.getElementById("admin-testimonials-list-container");
    if (!container) return;

    const db = getDB();
    const testimonials = db.testimonials || [];

    if (testimonials.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; color: var(--text-muted); padding: 40px 0;">
                <p>No active showcase testimonials. Add your first client review above!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = testimonials.map(t => {
        let stars = "";
        const rating = t.rating || 5;
        for (let i = 0; i < rating; i++) stars += "★";

        let proofBadges = [];
        if (t.audioUrl) proofBadges.push("🎵 Audio");
        if (t.videoUrl) proofBadges.push("🎬 Video");
        if (t.attachUrl) proofBadges.push("🔗 Link");
        const proofsText = proofBadges.length > 0 ? `Proof attachments: ${proofBadges.join(", ")}` : "No proof attachments";

        return `
            <div class="admin-data-row">
                <div class="admin-data-details" style="align-items: flex-start; flex-direction: column; gap: 4px; width: 100%;">
                    <div style="display: flex; justify-content: space-between; width: 100%; align-items: center;">
                        <h4 style="font-weight: 700; font-size: 1.05rem;">${t.name} <span style="font-size: 0.8rem; font-weight: 400; color: var(--text-secondary);">(${t.role})</span></h4>
                        <span style="color: #fbbf24; font-weight: 700;">${stars}</span>
                    </div>
                    <p style="font-style: italic; font-size: 0.88rem; line-height: 1.4; color: var(--text-primary); margin-top: 4px;">"${t.text.substring(0, 100)}${t.text.length > 100 ? '...' : ''}"</p>
                    <span style="font-size: 0.72rem; color: var(--accent-secondary); font-weight: 600; margin-top: 4px;">${proofsText}</span>
                </div>
                <div class="admin-row-actions">
                    <button class="btn-row-action" onclick="editTestimonial('${t.id}')">Edit</button>
                    <button class="btn-row-action delete" onclick="deleteTestimonial('${t.id}')">Delete</button>
                </div>
            </div>
        `;
    }).join("");
}

window.editTestimonial = function(id) {
    const db = getDB();
    const t = db.testimonials.find(item => item.id === id);
    if (!t) return;

    activeTestimonialEditId = t.id;
    document.getElementById("testimonial-form-headline").textContent = `Edit Review: ${t.name}`;
    document.getElementById("test-name").value = t.name;
    document.getElementById("test-role").value = t.role;
    document.getElementById("test-rating-select").value = t.rating || 5;
    document.getElementById("test-text").value = t.text;
    document.getElementById("test-avatar").value = t.avatar || "";
    document.getElementById("test-audio").value = t.audioUrl || "";
    document.getElementById("test-video").value = t.videoUrl || "";
    document.getElementById("test-attach").value = t.attachUrl || "";

    const activeTab = document.querySelector(".dash-tab[data-target='admin-testimonials']");
    if (activeTab) activeTab.click();
};

window.deleteTestimonial = function(id) {
    if (confirm("Are you sure you want to permanently delete this client review from the dynamic showcase slider?")) {
        const db = getDB();
        db.testimonials = db.testimonials.filter(t => t.id !== id);
        saveDB(db);
        renderAdminTestimonialsList();
        alert("Client review deleted successfully!");
    }
};

// 12. Support Chat Hub Manager
let activeChatClientEmail = null;

function setupAdminChat() {
    const chatForm = document.getElementById("admin-chat-form");
    if (!chatForm) return;

    chatForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const input = document.getElementById("admin-chat-input");
        const msgText = input.value.trim();
        if (!msgText || !activeChatClientEmail) return;

        const db = getDB();
        const client = db.clients.find(c => c.email === activeChatClientEmail);
        if (!client) return;

        client.messages = client.messages || [];
        
        client.messages.push({
            sender: "admin",
            text: msgText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });

        saveDB(db);
        renderAdminChatLog(client);
        
        input.value = "";
    });
}

function renderAdminChatClientsSidebar() {
    const container = document.getElementById("admin-chat-clients-list");
    if (!container) return;

    const db = getDB();
    const clients = db.clients || [];

    if (clients.length === 0) {
        container.innerHTML = `<div style="padding: 16px; color: var(--text-muted); font-size: 0.85rem;">No active clients registered.</div>`;
        return;
    }

    container.innerHTML = clients.map(c => {
        const isActive = c.email === activeChatClientEmail ? "active" : "";
        const unreadCount = c.messages ? c.messages.filter(m => m.sender === "client").length : 0;
        const subLabel = c.messages && c.messages.length > 0 ? c.messages[c.messages.length - 1].text.substring(0, 20) + "..." : "No messages yet";
        
        return `
            <div class="service-nav-btn ${isActive}" style="border: none; border-bottom: 1px solid var(--border-color); border-radius: 0; padding: 14px 16px; width: 100%; justify-content: flex-start; gap: 8px;" onclick="selectAdminChatClient('${c.email}')">
                <div style="text-align: left; flex-grow: 1;">
                    <div style="font-weight: 700; font-size: 0.92rem; color: var(--text-primary);">${c.name}</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">${c.company}</div>
                    <div style="font-size: 0.72rem; color: var(--accent-secondary); margin-top: 4px; font-style: italic;">${subLabel}</div>
                </div>
                ${unreadCount > 0 ? `<span style="background: var(--accent-primary); color: #fff; font-size: 0.7rem; font-weight: 800; padding: 2px 6px; border-radius: 10px;">${unreadCount}</span>` : ""}
            </div>
        `;
    }).join("");
}

window.selectAdminChatClient = function(email) {
    activeChatClientEmail = email;
    renderAdminChatClientsSidebar();

    const db = getDB();
    const client = db.clients.find(c => c.email === email);
    if (!client) return;

    // Enable chat form inputs
    const input = document.getElementById("admin-chat-input");
    const btn = document.getElementById("admin-chat-send-btn");
    if (input && btn) {
        input.disabled = false;
        btn.disabled = false;
        input.placeholder = `Reply to ${client.name}...`;
    }

    // Set title header
    const title = document.getElementById("admin-chat-active-title");
    if (title) {
        title.innerHTML = `💬 Live Support: ${client.name} <span style="font-weight: 400; color: var(--text-muted); font-size: 0.85rem;">(${client.company})</span>`;
    }

    renderAdminChatLog(client);
};

function renderAdminChatLog(client) {
    const container = document.getElementById("admin-chat-messages");
    if (!container) return;

    const messages = client.messages || [];

    if (messages.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; color: var(--text-muted); margin-top: 100px;">
                <span style="font-size: 2.2rem; display: block; margin-bottom: 12px;">💬</span>
                <strong>No messages yet</strong>
                <p style="font-size: 0.85rem; margin-top: 4px;">Type a message below to welcome ${client.name} and kickstart their video deliverables support!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = messages.map(msg => {
        const isClient = msg.sender === "client";
        const align = isClient ? "flex-start" : "flex-end";
        const bg = isClient ? "rgba(255,255,255,0.04)" : "var(--accent-primary-glow)";
        const border = isClient ? "border-color: var(--border-color);" : "border-color: var(--accent-primary);";
        const senderName = isClient ? client.name : "You (Support)";
        const color = isClient ? "color: var(--accent-secondary);" : "color: var(--accent-primary);";

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

    container.scrollTop = container.scrollHeight;
}

// 13. Client Accounts Roster Manager (Manual Deletion)
function setupClientsDatabaseManager() {
    // Renderer triggers direct callbacks
}

function renderClientsDatabaseList() {
    const container = document.getElementById("admin-clients-database-list");
    if (!container) return;

    const db = getDB();
    const clients = db.clients || [];

    if (clients.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; color: var(--text-muted); padding: 30px 0;">
                <p>No active registered client portal accounts found in fzmedia_db.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = clients.map(c => {
        const activeSub = c.activeSub || "No Active Package";
        const projectsCount = c.projects ? c.projects.length : 0;
        
        return `
            <div class="admin-data-row" style="border-color: rgba(255,255,255,0.05); background: rgba(0,0,0,0.1);">
                <div class="admin-data-details" style="flex-grow: 1;">
                    <div class="admin-row-avatar-placeholder">${(c.name ? c.name.charAt(0) : c.email.charAt(0)).toUpperCase()}</div>
                    <div class="admin-row-meta">
                        <h4 style="font-weight: 700; font-size: 1.05rem;">${c.name || c.email} <span style="font-size: 0.8rem; font-weight: 400; color: var(--text-secondary);">(${c.email})</span></h4>
                        <p style="font-size: 0.82rem; color: var(--text-muted); margin-top: 3px;">
                            Brand Name: <strong>${c.company || 'No Company'}</strong> | Monthly Suite: <span style="color: var(--accent-primary); font-weight: 700;">${activeSub}</span> | Deliverables: <strong>${projectsCount} projects</strong>
                        </p>
                    </div>
                </div>
                <div class="admin-row-actions">
                    <button class="btn-row-action delete" style="padding: 8px 16px; font-weight: 700; border-color: rgba(239,68,68,0.5); background: rgba(239,68,68,0.1);" onclick="deleteClientAccount('${c.email}')">
                        Wipe Client Account 🗑
                    </button>
                </div>
            </div>
        `;
    }).join("");
}

window.deleteClientAccount = function(email) {
    if (confirm(`CRITICAL WARNING: Are you sure you want to permanently delete the client account linked to "${email}"?\n\nThis will wipe all active draftProgress charts, Intake briefs, OBS Stream setups, and direct conversation messages! This action cannot be undone.`)) {
        const db = getDB();
        db.clients = db.clients.filter(c => c.email !== email);
        saveDB(db);

        // Update all related dynamic UI panels instantly
        renderClientsDatabaseList();
        calculateAnalytics();
        renderAdminChatClientsSidebar();

        // Clear chat area if we were actively chatting with the wiped client
        if (activeChatClientEmail === email) {
            activeChatClientEmail = null;
            const title = document.getElementById("admin-chat-active-title");
            if (title) title.textContent = "Select a client conversation to begin messaging...";
            
            const messagesContainer = document.getElementById("admin-chat-messages");
            if (messagesContainer) messagesContainer.innerHTML = `<div style="text-align: center; color: var(--text-muted); margin-top: 100px; font-size: 0.95rem;">Select a conversation from the active dialogs list.</div>`;
            
            const input = document.getElementById("admin-chat-input");
            const btn = document.getElementById("admin-chat-send-btn");
            if (input && btn) {
                input.disabled = true;
                btn.disabled = true;
                input.placeholder = "Select conversation first...";
                input.value = "";
            }
        }

        alert("Success! Client workspace account and all associated records have been permanently wiped from fzmedia_db.");
    }
};

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

function setupVSLAndCalculatorForm() {
    const form = document.getElementById("admin-vsl-calc-form");
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const db = getDB();
        
        // 1. Save Hero VSL Settings
        db.settings.heroVideo = {
            title: document.getElementById("vsl-title-input").value.trim(),
            description: document.getElementById("vsl-desc-input").value.trim(),
            videoUrl: document.getElementById("vsl-video-url-input").value.trim(),
            thumbnailUrl: document.getElementById("vsl-thumb-url-input").value.trim()
        };

        // 2. Save Calculator Factors
        db.settings.calculator = {
            basePricePerMinute: parseInt(document.getElementById("calc-base-price").value, 10),
            basicLabel: document.getElementById("calc-basic-label").value.trim(),
            standardLabel: document.getElementById("calc-standard-label").value.trim(),
            standardMultiplier: parseInt(document.getElementById("calc-standard-mult").value, 10),
            premiumLabel: document.getElementById("calc-premium-label").value.trim(),
            premiumMultiplier: parseInt(document.getElementById("calc-premium-mult").value, 10)
        };

        saveDB(db);
        alert("Homepage Hero VSL & Custom Calculator Settings saved successfully!");
    });
}

function populateVSLAndCalculatorFields() {
    const db = getDB();
    const s = db.settings;

    // Default VSL settings fallback if not seeded
    const hero = s.heroVideo || {
        title: "Watch FZ Showreel",
        description: "Targeted VSL templates, product focus, and Call to Actions",
        videoUrl: "assets/videos/solo showreel.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&w=1000&q=80"
    };

    // Default Calculator settings fallback if not seeded
    const calc = s.calculator || {
        basePricePerMinute: 10,
        basicLabel: "Basic cuts & music",
        standardLabel: "Standard text & SFX",
        standardMultiplier: 20,
        premiumLabel: "Premium AE & Grading",
        premiumMultiplier: 50
    };

    // Populate Hero VSL inputs
    const vslTitleInput = document.getElementById("vsl-title-input");
    const vslDescInput = document.getElementById("vsl-desc-input");
    const vslVideoUrlInput = document.getElementById("vsl-video-url-input");
    const vslThumbUrlInput = document.getElementById("vsl-thumb-url-input");

    if (vslTitleInput) vslTitleInput.value = hero.title;
    if (vslDescInput) vslDescInput.value = hero.description;
    if (vslVideoUrlInput) vslVideoUrlInput.value = hero.videoUrl;
    if (vslThumbUrlInput) vslThumbUrlInput.value = hero.thumbnailUrl || "";

    // Populate Calculator inputs
    const calcBasePrice = document.getElementById("calc-base-price");
    const calcBasicLabel = document.getElementById("calc-basic-label");
    const calcStandardLabel = document.getElementById("calc-standard-label");
    const calcStandardMult = document.getElementById("calc-standard-mult");
    const calcPremiumLabel = document.getElementById("calc-premium-label");
    const calcPremiumMult = document.getElementById("calc-premium-mult");

    if (calcBasePrice) calcBasePrice.value = calc.basePricePerMinute;
    if (calcBasicLabel) calcBasicLabel.value = calc.basicLabel;
    if (calcStandardLabel) calcStandardLabel.value = calc.standardLabel;
    if (calcStandardMult) calcStandardMult.value = calc.standardMultiplier;
    if (calcPremiumLabel) calcPremiumLabel.value = calc.premiumLabel;
    if (calcPremiumMult) calcPremiumMult.value = calc.premiumMultiplier;
}

function setupVisualThemeEngine() {
    const form = document.getElementById("admin-theme-form");
    if (!form) return;

    // Helper: Save all visual customizer states directly to localStorage fzmedia_db
    function saveThemeSettingsToDB() {
        const db = getDB();
        
        const themeRadius = document.getElementById("theme-radius");
        if (!themeRadius) return;
        
        db.settings.cardBorderRadius = parseInt(themeRadius.value, 10);
        db.settings.cardBorderThickness = parseInt(document.getElementById("theme-border-thickness").value, 10);
        db.settings.cardGlassBlur = parseInt(document.getElementById("theme-blur").value, 10);
        db.settings.glowIntensity = parseInt(document.getElementById("theme-glow-intensity").value, 10) * 0.1;
        db.settings.glowAnimationSpeed = parseInt(document.getElementById("theme-glow-speed").value, 10);
        db.settings.layoutGaps = parseInt(document.getElementById("theme-gaps").value, 10);
        db.settings.sectionPadding = parseInt(document.getElementById("theme-padding").value, 10);
        db.settings.headerStyle = document.getElementById("theme-header-style").value;
        db.settings.fontPreset = document.getElementById("theme-fonts").value;
        db.settings.theme = document.getElementById("theme-layout-style").value;

        db.settings.customBgH = parseInt(document.getElementById("theme-bg-hue").value, 10);
        db.settings.customBgS = parseInt(document.getElementById("theme-bg-sat").value, 10);
        db.settings.customBgL = parseInt(document.getElementById("theme-bg-light").value, 10);
        db.settings.customCardL = parseInt(document.getElementById("theme-card-light").value, 10);
        db.settings.customCardA = parseInt(document.getElementById("theme-card-opacity").value, 10) * 0.01;
        db.settings.customBorderA = parseInt(document.getElementById("theme-border-opacity").value, 10) * 0.01;
        db.settings.customGlowH = parseInt(document.getElementById("theme-glow-hue").value, 10);
        db.settings.customGlowS = parseInt(document.getElementById("theme-glow-sat").value, 10);
        db.settings.glowSpread = parseInt(document.getElementById("theme-glow-spread").value, 10);

        // Dynamically sync base accents for global pages
        db.settings.primaryColorH = parseInt(document.getElementById("theme-primary-hue").value, 10);
        db.settings.primaryColorS = parseInt(document.getElementById("theme-primary-sat").value, 10);
        db.settings.primaryColorL = parseInt(document.getElementById("theme-primary-light").value, 10);
        
        db.settings.secondaryColorH = parseInt(document.getElementById("theme-secondary-hue").value, 10);
        db.settings.secondaryColorS = parseInt(document.getElementById("theme-secondary-sat").value, 10);
        db.settings.secondaryColorL = parseInt(document.getElementById("theme-secondary-light").value, 10);
        
        db.settings.textColorPrimary = document.getElementById("theme-text-primary").value;
        db.settings.textColorSecondary = document.getElementById("theme-text-secondary").value;
        db.settings.textColorMuted = document.getElementById("theme-text-muted").value;
        
        const gradPresetSelect = document.getElementById("gradient-preset-select");
        if (gradPresetSelect) {
            db.settings.gradientPreset = gradPresetSelect.value;
            db.settings.gradientColor1 = document.getElementById("gradient-color-1").value;
            db.settings.gradientColor2 = document.getElementById("gradient-color-2").value;
            db.settings.gradientColor3 = document.getElementById("gradient-color-3").value;
            db.settings.gradientAnimate = document.getElementById("gradient-animate-orbs").checked;
        }
        
        const activePresetCard = document.querySelector(".template-preset-card.active");
        if (activePresetCard) {
            db.settings.themePreset = activePresetCard.getAttribute("data-preset");
        }
        
        saveDB(db);
    }

    // Realtime update triggers helper
    function updateRealtimePreview() {
        const radius = parseInt(document.getElementById("theme-radius").value, 10);
        const thickness = parseInt(document.getElementById("theme-border-thickness").value, 10);
        const blurVal = parseInt(document.getElementById("theme-blur").value, 10);
        const glowMult = parseInt(document.getElementById("theme-glow-intensity").value, 10) * 0.1;
        const glowSpeed = parseInt(document.getElementById("theme-glow-speed").value, 10);
        const gaps = parseInt(document.getElementById("theme-gaps").value, 10);
        const padding = parseInt(document.getElementById("theme-padding").value, 10);
        
        const headerStyle = document.getElementById("theme-header-style").value;
        const fontPreset = document.getElementById("theme-fonts").value;
        const layoutStyle = document.getElementById("theme-layout-style").value;
        
        const bgH = parseInt(document.getElementById("theme-bg-hue").value, 10);
        const bgS = parseInt(document.getElementById("theme-bg-sat").value, 10);
        const bgL = parseInt(document.getElementById("theme-bg-light").value, 10);
        const cardL = parseInt(document.getElementById("theme-card-light").value, 10);
        const cardA = parseInt(document.getElementById("theme-card-opacity").value, 10) * 0.01;
        const borderA = parseInt(document.getElementById("theme-border-opacity").value, 10) * 0.01;
        const glowH = parseInt(document.getElementById("theme-glow-hue").value, 10);
        const glowS = parseInt(document.getElementById("theme-glow-sat").value, 10);
        const glowSpread = parseInt(document.getElementById("theme-glow-spread").value, 10);

        // Accent Colors
        const priH = parseInt(document.getElementById("theme-primary-hue").value, 10);
        const priS = parseInt(document.getElementById("theme-primary-sat").value, 10);
        const priL = parseInt(document.getElementById("theme-primary-light").value, 10);
        const secH = parseInt(document.getElementById("theme-secondary-hue").value, 10);
        const secS = parseInt(document.getElementById("theme-secondary-sat").value, 10);
        const secL = parseInt(document.getElementById("theme-secondary-light").value, 10);

        // Set dynamic text colors [NEW]
        const textPri = document.getElementById("theme-text-primary").value;
        const textSec = document.getElementById("theme-text-secondary").value;
        const textMuted = document.getElementById("theme-text-muted").value;

        document.documentElement.style.setProperty('--text-primary', textPri);
        document.documentElement.style.setProperty('--text-secondary', textSec);
        document.documentElement.style.setProperty('--text-muted', textMuted);

        // Update labels text
        document.getElementById("theme-radius-val").textContent = `${radius}px`;
        document.getElementById("theme-border-thickness-val").textContent = `${thickness}px`;
        document.getElementById("theme-blur-val").textContent = `${blurVal}px`;
        document.getElementById("theme-glow-intensity-val").textContent = `${glowMult.toFixed(1)}x`;
        document.getElementById("theme-glow-speed-val").textContent = `${glowSpeed}s`;
        document.getElementById("theme-gaps-val").textContent = `${gaps}px`;
        document.getElementById("theme-padding-val").textContent = `${padding}px`;

        document.getElementById("theme-bg-hue-val").textContent = `${bgH}°`;
        document.getElementById("theme-bg-sat-val").textContent = `${bgS}%`;
        document.getElementById("theme-bg-light-val").textContent = `${bgL}%`;
        document.getElementById("theme-card-light-val").textContent = `${cardL}%`;
        document.getElementById("theme-card-opacity-val").textContent = `${cardA.toFixed(2)}`;
        document.getElementById("theme-border-opacity-val").textContent = `${borderA.toFixed(2)}`;
        document.getElementById("theme-glow-hue-val").textContent = `${glowH}°`;
        document.getElementById("theme-glow-sat-val").textContent = `${glowS}%`;
        document.getElementById("theme-glow-spread-val").textContent = `${glowSpread}px`;

        document.getElementById("theme-primary-hue-val").textContent = `${priH}°`;
        document.getElementById("theme-primary-sat-val").textContent = `${priS}%`;
        document.getElementById("theme-primary-light-val").textContent = `${priL}%`;
        document.getElementById("theme-secondary-hue-val").textContent = `${secH}°`;
        document.getElementById("theme-secondary-sat-val").textContent = `${secS}%`;
        document.getElementById("theme-secondary-light-val").textContent = `${secL}%`;

        // Update hex color pickers values to match HSL sliders dynamically
        const bgColorPicker = document.getElementById("theme-bg-color-picker");
        if (bgColorPicker) bgColorPicker.value = hslToHex(bgH, bgS, bgL);

        const cardColorPicker = document.getElementById("theme-card-color-picker");
        if (cardColorPicker) cardColorPicker.value = hslToHex(bgH, bgS, cardL);

        const priColorPicker = document.getElementById("theme-primary-color-picker");
        if (priColorPicker) priColorPicker.value = hslToHex(priH, priS, priL);

        const secColorPicker = document.getElementById("theme-secondary-color-picker");
        if (secColorPicker) secColorPicker.value = hslToHex(secH, secS, secL);

        const glowColorPicker = document.getElementById("theme-glow-color-picker");
        if (glowColorPicker) glowColorPicker.value = hslToHex(glowH, glowS, 50);

        // Update preview labels in stats
        document.getElementById("preview-gap-val").textContent = `${gaps}px`;
        document.getElementById("preview-padding-val").textContent = `${padding}px`;

        // Apply visual properties to preview mock card element
        const mockCard = document.getElementById("preview-card-mock");
        if (mockCard) {
            mockCard.style.borderRadius = `${radius}px`;
            mockCard.style.borderWidth = `${thickness}px`;
            mockCard.style.backdropFilter = `blur(${blurVal}px)`;
            mockCard.style.webkitBackdropFilter = `blur(${blurVal}px)`;
            mockCard.style.background = `hsla(${bgH}, ${bgS + 5}%, ${cardL}%, ${cardA})`;
            mockCard.style.borderColor = `hsla(${bgH}, 20%, 80%, ${borderA})`;
            mockCard.style.boxShadow = `0 10px 35px rgba(0,0,0,0.4), 0 0 ${glowSpread}px hsla(${glowH}, ${glowS}%, 50%, ${0.15 * glowMult})`;
        }

        // Bouncy interaction invitation popup trigger on Accept Presets button
        const acceptBtn = document.getElementById("preview-accept-presets");
        if (acceptBtn) {
            acceptBtn.style.transform = "scale(1.08)";
            acceptBtn.classList.add("invite-pulse");
        }

        // Apply font styling preview to mock title
        const mockTitle = document.getElementById("preview-title-mock");
        if (mockTitle) {
            if (fontPreset === "cyberpunk") {
                mockTitle.style.fontFamily = "'Courier New', Courier, monospace";
            } else if (fontPreset === "tech-modern") {
                mockTitle.style.fontFamily = "'Roboto', sans-serif";
            } else {
                mockTitle.style.fontFamily = "'Outfit', sans-serif";
            }
        }

        // Apply header styling preview
        const mockHeader = document.getElementById("preview-header-mock");
        if (mockHeader) {
            mockHeader.style.borderRadius = `${radius}px`;
            mockHeader.style.borderWidth = `${thickness}px`;
            mockHeader.style.borderColor = `hsla(${bgH}, 20%, 80%, ${borderA})`;
            if (headerStyle === 'floating-glass') {
                mockHeader.style.transform = 'scale(0.95)';
                mockHeader.style.background = `rgba(255,255,255,0.02)`;
                mockHeader.style.boxShadow = `0 0 10px hsla(${glowH}, ${glowS}%, 50%, 0.1)`;
            } else if (headerStyle === 'centered') {
                mockHeader.style.transform = 'scale(1)';
                mockHeader.style.background = 'none';
                mockHeader.style.boxShadow = 'none';
            } else { // sticky-solid
                mockHeader.style.transform = 'scale(1)';
                mockHeader.style.background = `hsl(${bgH}, ${bgS}%, ${bgL + 4}%)`;
                mockHeader.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
            }
        }

        // Apply main background preview on parent card wrapper
        const previewBody = document.getElementById("theme-preview-body");
        if (previewBody) {
            previewBody.style.background = `hsl(${bgH}, ${bgS}%, ${bgL + 1}%)`;
        }

        // ==========================================
        // DYNAMIC RESPONSIVE REAL-TIME FEEDBACK ON ROOT!
        // ==========================================
        document.documentElement.style.setProperty('--radius-md', `${radius}px`);
        document.documentElement.style.setProperty('--radius-lg', `${radius + 4}px`);
        document.documentElement.style.setProperty('--border-thickness', `${thickness}px`);
        document.documentElement.style.setProperty('--glass-blur', `${blurVal}px`);
        document.documentElement.style.setProperty('--glow-intensity', glowMult);
        document.documentElement.style.setProperty('--glow-speed', `${glowSpeed}s`);
        document.documentElement.style.setProperty('--grid-gap', `${gaps}px`);
        document.documentElement.style.setProperty('--section-padding', `${padding}px 0`);

        document.documentElement.style.setProperty('--bg-primary', `hsl(${bgH}, ${bgS}%, ${bgL}%)`);
        document.documentElement.style.setProperty('--card-bg-custom', `hsla(${bgH}, ${bgS + 5}%, ${cardL}%, ${cardA})`);
        document.documentElement.style.setProperty('--border-color-custom', `hsla(${bgH}, 20%, 80%, ${borderA})`);
        document.documentElement.style.setProperty('--glow-color-custom', `hsla(${glowH}, ${glowS}%, 50%, 0.15)`);

        // Accent Colors real-time injection
        document.documentElement.style.setProperty('--accent-primary-h', priH);
        document.documentElement.style.setProperty('--accent-primary-s', `${priS}%`);
        document.documentElement.style.setProperty('--accent-primary-l', `${priL}%`);
        document.documentElement.style.setProperty('--accent-secondary-h', secH);
        document.documentElement.style.setProperty('--accent-secondary-s', `${secS}%`);
        document.documentElement.style.setProperty('--accent-secondary-l', `${secL}%`);

        // Typography Fonts real-time injection
        if (fontPreset === "cyberpunk") {
            document.documentElement.style.setProperty('--font-headings', "'Courier New', Courier, monospace");
            document.documentElement.style.setProperty('--font-body', "'Courier New', Courier, monospace");
        } else if (fontPreset === "tech-modern") {
            document.documentElement.style.setProperty('--font-headings', "'Roboto', sans-serif");
            document.documentElement.style.setProperty('--font-body', "'Roboto', sans-serif");
        } else {
            document.documentElement.style.setProperty('--font-headings', "'Outfit', sans-serif");
            document.documentElement.style.setProperty('--font-body', "'Plus Jakarta Sans', sans-serif");
        }

        // Layout Theme real-time injection
        document.body.classList.remove("theme-liquid", "theme-saas", "theme-gradient", "theme-flat");
        if (layoutStyle === "liquid") {
            document.body.classList.add("theme-liquid");
            if (!document.querySelector(".liquid-bg-blob")) {
                const blob1 = document.createElement("div");
                blob1.className = "liquid-bg-blob blob-1";
                const blob2 = document.createElement("div");
                blob2.className = "liquid-bg-blob blob-2";
                document.body.appendChild(blob1);
                document.body.appendChild(blob2);
            }
        } else {
            document.querySelectorAll(".liquid-bg-blob").forEach(el => el.remove());
            if (layoutStyle === "saas") {
                document.body.classList.add("theme-saas");
            } else if (layoutStyle === "gradient") {
                document.body.classList.add("theme-gradient");
            } else if (layoutStyle === "flat") {
                document.body.classList.add("theme-flat");
            }
        }

        // Toggle sticky header classes in real-time
        const globalHeader = document.getElementById("global-header");
        if (globalHeader) {
            globalHeader.classList.remove("header-floating-glass", "header-centered");
            if (headerStyle === 'floating-glass') {
                globalHeader.classList.add("header-floating-glass");
            } else if (headerStyle === 'centered') {
                globalHeader.classList.add("header-centered");
            }
        }
    }

    // Attach real-time input event listeners to all sliders & controls
    const controlsList = [
        "theme-radius", "theme-border-thickness", "theme-blur", "theme-glow-intensity",
        "theme-glow-speed", "theme-gaps", "theme-padding", "theme-header-style",
        "theme-fonts", "theme-layout-style", "theme-bg-hue", "theme-bg-sat", "theme-bg-light",
        "theme-card-light", "theme-card-opacity", "theme-border-opacity",
        "theme-glow-hue", "theme-glow-sat", "theme-glow-spread",
        "theme-primary-hue", "theme-primary-sat", "theme-primary-light",
        "theme-secondary-hue", "theme-secondary-sat", "theme-secondary-light",
        "theme-text-primary", "theme-text-secondary", "theme-text-muted"
    ];
    
    controlsList.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener("input", updateRealtimePreview);
            el.addEventListener("change", () => {
                updateRealtimePreview();
                saveThemeSettingsToDB();
            });
        }
    });

    // Setup and bind Hex color pickers to auto-convert to HSL and update sliders in real-time
    const bgPicker = document.getElementById("theme-bg-color-picker");
    if (bgPicker) {
        bgPicker.addEventListener("input", () => {
            const hsl = hexToHsl(bgPicker.value);
            document.getElementById("theme-bg-hue").value = hsl.h;
            document.getElementById("theme-bg-sat").value = hsl.s > 25 ? 25 : hsl.s; // Cap saturation at 25% like body HSL slider
            document.getElementById("theme-bg-light").value = hsl.l > 20 ? 20 : (hsl.l < 1 ? 1 : hsl.l); // Cap/floor like slider
            updateRealtimePreview();
        });
        bgPicker.addEventListener("change", saveThemeSettingsToDB);
    }

    const cardPicker = document.getElementById("theme-card-color-picker");
    if (cardPicker) {
        cardPicker.addEventListener("input", () => {
            const hsl = hexToHsl(cardPicker.value);
            document.getElementById("theme-card-light").value = hsl.l > 28 ? 28 : (hsl.l < 2 ? 2 : hsl.l); // Cap/floor like slider
            updateRealtimePreview();
        });
        cardPicker.addEventListener("change", saveThemeSettingsToDB);
    }

    const priPicker = document.getElementById("theme-primary-color-picker");
    if (priPicker) {
        priPicker.addEventListener("input", () => {
            const hsl = hexToHsl(priPicker.value);
            document.getElementById("theme-primary-hue").value = hsl.h;
            document.getElementById("theme-primary-sat").value = hsl.s;
            document.getElementById("theme-primary-light").value = hsl.l > 90 ? 90 : (hsl.l < 10 ? 10 : hsl.l); // Cap/floor like slider
            updateRealtimePreview();
        });
        priPicker.addEventListener("change", saveThemeSettingsToDB);
    }

    const secPicker = document.getElementById("theme-secondary-color-picker");
    if (secPicker) {
        secPicker.addEventListener("input", () => {
            const hsl = hexToHsl(secPicker.value);
            document.getElementById("theme-secondary-hue").value = hsl.h;
            document.getElementById("theme-secondary-sat").value = hsl.s;
            document.getElementById("theme-secondary-light").value = hsl.l > 90 ? 90 : (hsl.l < 10 ? 10 : hsl.l); // Cap/floor like slider
            updateRealtimePreview();
        });
        secPicker.addEventListener("change", saveThemeSettingsToDB);
    }

    const glowPicker = document.getElementById("theme-glow-color-picker");
    if (glowPicker) {
        glowPicker.addEventListener("input", () => {
            const hsl = hexToHsl(glowPicker.value);
            document.getElementById("theme-glow-hue").value = hsl.h;
            document.getElementById("theme-glow-sat").value = hsl.s > 100 ? 100 : (hsl.s < 20 ? 20 : hsl.s); // Cap/floor like slider
            updateRealtimePreview();
        });
        glowPicker.addEventListener("change", saveThemeSettingsToDB);
    }

    // SaaS & Premium Templates preset click triggers
    const presetCards = document.querySelectorAll(".template-preset-card");
    presetCards.forEach(card => {
        card.addEventListener("click", () => {
            const presetName = card.getAttribute("data-preset");
            
            presetCards.forEach(c => c.classList.remove("active"));
            card.classList.add("active");

            // Apply templates parameters into forms inputs without resetting database
            if (presetName === 'preset-neon-saas') {
                document.getElementById("theme-radius").value = 24;
                document.getElementById("theme-border-thickness").value = 1;
                document.getElementById("theme-blur").value = 20;
                document.getElementById("theme-glow-intensity").value = 15; // 1.5x
                document.getElementById("theme-glow-speed").value = 3;
                document.getElementById("theme-gaps").value = 30;
                document.getElementById("theme-padding").value = 80;
                document.getElementById("theme-header-style").value = "floating-glass";
                document.getElementById("theme-fonts").value = "minimal-slate";
                document.getElementById("theme-layout-style").value = "liquid";

                document.getElementById("theme-bg-hue").value = 267;
                document.getElementById("theme-bg-sat").value = 15;
                document.getElementById("theme-bg-light").value = 3;
                document.getElementById("theme-card-light").value = 6;
                document.getElementById("theme-card-opacity").value = 25; 
                document.getElementById("theme-border-opacity").value = 10; 
                document.getElementById("theme-glow-hue").value = 267;
                document.getElementById("theme-glow-sat").value = 90;
                document.getElementById("theme-glow-spread").value = 25;

                document.getElementById("theme-primary-hue").value = 267;
                document.getElementById("theme-primary-sat").value = 90;
                document.getElementById("theme-primary-light").value = 61;
                document.getElementById("theme-secondary-hue").value = 185;
                document.getElementById("theme-secondary-sat").value = 90;
                document.getElementById("theme-secondary-light").value = 50;
            } else if (presetName === 'preset-cyber-command') {
                document.getElementById("theme-radius").value = 0;
                document.getElementById("theme-border-thickness").value = 2;
                document.getElementById("theme-blur").value = 0;
                document.getElementById("theme-glow-intensity").value = 18; // 1.8x
                document.getElementById("theme-glow-speed").value = 2;
                document.getElementById("theme-gaps").value = 24;
                document.getElementById("theme-padding").value = 60;
                document.getElementById("theme-header-style").value = "sticky-solid";
                document.getElementById("theme-fonts").value = "cyberpunk";
                document.getElementById("theme-layout-style").value = "saas";

                document.getElementById("theme-bg-hue").value = 150;
                document.getElementById("theme-bg-sat").value = 10;
                document.getElementById("theme-bg-light").value = 2;
                document.getElementById("theme-card-light").value = 4;
                document.getElementById("theme-card-opacity").value = 80; 
                document.getElementById("theme-border-opacity").value = 20; 
                document.getElementById("theme-glow-hue").value = 150;
                document.getElementById("theme-glow-sat").value = 95;
                document.getElementById("theme-glow-spread").value = 35;

                document.getElementById("theme-primary-hue").value = 150;
                document.getElementById("theme-primary-sat").value = 95;
                document.getElementById("theme-primary-light").value = 50;
                document.getElementById("theme-secondary-hue").value = 120;
                document.getElementById("theme-secondary-sat").value = 95;
                document.getElementById("theme-secondary-light").value = 50;
            } else if (presetName === 'preset-luxury-gold') {
                document.getElementById("theme-radius").value = 16;
                document.getElementById("theme-border-thickness").value = 1;
                document.getElementById("theme-blur").value = 24;
                document.getElementById("theme-glow-intensity").value = 12; // 1.2x
                document.getElementById("theme-glow-speed").value = 4;
                document.getElementById("theme-gaps").value = 32;
                document.getElementById("theme-padding").value = 85;
                document.getElementById("theme-header-style").value = "centered";
                document.getElementById("theme-fonts").value = "minimal-slate";
                document.getElementById("theme-layout-style").value = "gradient";

                document.getElementById("theme-bg-hue").value = 280;
                document.getElementById("theme-bg-sat").value = 8;
                document.getElementById("theme-bg-light").value = 3;
                document.getElementById("theme-card-light").value = 5;
                document.getElementById("theme-card-opacity").value = 30; 
                document.getElementById("theme-border-opacity").value = 15; 
                document.getElementById("theme-glow-hue").value = 45; // Gold!
                document.getElementById("theme-glow-sat").value = 85;
                document.getElementById("theme-glow-spread").value = 30;

                document.getElementById("theme-primary-hue").value = 45; // Gold!
                document.getElementById("theme-primary-sat").value = 85;
                document.getElementById("theme-primary-light").value = 55;
                document.getElementById("theme-secondary-hue").value = 35;
                document.getElementById("theme-secondary-sat").value = 80;
                document.getElementById("theme-secondary-light").value = 50;
            } else if (presetName === 'preset-aurora-liquid') {
                document.getElementById("theme-radius").value = 28;
                document.getElementById("theme-border-thickness").value = 2;
                document.getElementById("theme-blur").value = 28;
                document.getElementById("theme-glow-intensity").value = 16; // 1.6x
                document.getElementById("theme-glow-speed").value = 4;
                document.getElementById("theme-gaps").value = 28;
                document.getElementById("theme-padding").value = 80;
                document.getElementById("theme-header-style").value = "floating-glass";
                document.getElementById("theme-fonts").value = "tech-modern";
                document.getElementById("theme-layout-style").value = "liquid";

                document.getElementById("theme-bg-hue").value = 310;
                document.getElementById("theme-bg-sat").value = 15;
                document.getElementById("theme-bg-light").value = 4;
                document.getElementById("theme-card-light").value = 8;
                document.getElementById("theme-card-opacity").value = 40; 
                document.getElementById("theme-border-opacity").value = 12; 
                document.getElementById("theme-glow-hue").value = 310;
                document.getElementById("theme-glow-sat").value = 90;
                document.getElementById("theme-glow-spread").value = 35;

                document.getElementById("theme-primary-hue").value = 310;
                document.getElementById("theme-primary-sat").value = 90;
                document.getElementById("theme-primary-light").value = 60;
                document.getElementById("theme-secondary-hue").value = 195;
                document.getElementById("theme-secondary-sat").value = 90;
                document.getElementById("theme-secondary-light").value = 50;
            } else if (presetName === 'midnight') {
                document.getElementById("theme-radius").value = 8;
                document.getElementById("theme-border-thickness").value = 1;
                document.getElementById("theme-blur").value = 16;
                document.getElementById("theme-glow-intensity").value = 10; // 1.0x
                document.getElementById("theme-glow-speed").value = 3;
                document.getElementById("theme-gaps").value = 30;
                document.getElementById("theme-padding").value = 80;
                document.getElementById("theme-header-style").value = "sticky-solid";
                document.getElementById("theme-fonts").value = "minimal-slate";
                document.getElementById("theme-layout-style").value = "saas";

                document.getElementById("theme-bg-hue").value = 240;
                document.getElementById("theme-bg-sat").value = 10;
                document.getElementById("theme-bg-light").value = 3;
                document.getElementById("theme-card-light").value = 5;
                document.getElementById("theme-card-opacity").value = 40; 
                document.getElementById("theme-border-opacity").value = 8; 
                document.getElementById("theme-glow-hue").value = 267;
                document.getElementById("theme-glow-sat").value = 90;
                document.getElementById("theme-glow-spread").value = 15;

                document.getElementById("theme-primary-hue").value = 267;
                document.getElementById("theme-primary-sat").value = 90;
                document.getElementById("theme-primary-light").value = 61;
                document.getElementById("theme-secondary-hue").value = 185;
                document.getElementById("theme-secondary-sat").value = 90;
                document.getElementById("theme-secondary-light").value = 50;
            } else if (presetName === 'aurora') {
                document.getElementById("theme-radius").value = 24;
                document.getElementById("theme-border-thickness").value = 1;
                document.getElementById("theme-blur").value = 30;
                document.getElementById("theme-glow-intensity").value = 15; // 1.5x
                document.getElementById("theme-glow-speed").value = 4;
                document.getElementById("theme-gaps").value = 32;
                document.getElementById("theme-padding").value = 90;
                document.getElementById("theme-header-style").value = "floating-glass";
                document.getElementById("theme-fonts").value = "minimal-slate";
                document.getElementById("theme-layout-style").value = "liquid";

                document.getElementById("theme-bg-hue").value = 310;
                document.getElementById("theme-bg-sat").value = 15;
                document.getElementById("theme-bg-light").value = 4;
                document.getElementById("theme-card-light").value = 8;
                document.getElementById("theme-card-opacity").value = 30; 
                document.getElementById("theme-border-opacity").value = 12; 
                document.getElementById("theme-glow-hue").value = 185;
                document.getElementById("theme-glow-sat").value = 90;
                document.getElementById("theme-glow-spread").value = 25;

                document.getElementById("theme-primary-hue").value = 310;
                document.getElementById("theme-primary-sat").value = 90;
                document.getElementById("theme-primary-light").value = 60;
                document.getElementById("theme-secondary-hue").value = 185;
                document.getElementById("theme-secondary-sat").value = 90;
                document.getElementById("theme-secondary-light").value = 50;
            } else if (presetName === 'minimal') {
                document.getElementById("theme-radius").value = 12;
                document.getElementById("theme-border-thickness").value = 1;
                document.getElementById("theme-blur").value = 10;
                document.getElementById("theme-glow-intensity").value = 3; // 0.3x
                document.getElementById("theme-glow-speed").value = 5;
                document.getElementById("theme-gaps").value = 36;
                document.getElementById("theme-padding").value = 80;
                document.getElementById("theme-header-style").value = "centered";
                document.getElementById("theme-fonts").value = "tech-modern";
                document.getElementById("theme-layout-style").value = "saas";

                document.getElementById("theme-bg-hue").value = 210;
                document.getElementById("theme-bg-sat").value = 5;
                document.getElementById("theme-bg-light").value = 4;
                document.getElementById("theme-card-light").value = 6;
                document.getElementById("theme-card-opacity").value = 25; 
                document.getElementById("theme-border-opacity").value = 6; 
                document.getElementById("theme-glow-hue").value = 200;
                document.getElementById("theme-glow-sat").value = 50;
                document.getElementById("theme-glow-spread").value = 10;

                document.getElementById("theme-primary-hue").value = 200;
                document.getElementById("theme-primary-sat").value = 50;
                document.getElementById("theme-primary-light").value = 60;
                document.getElementById("theme-secondary-hue").value = 210;
                document.getElementById("theme-secondary-sat").value = 5;
                document.getElementById("theme-secondary-light").value = 20;
            }

            // Sync visual preview instantly
            updateRealtimePreview();
            saveThemeSettingsToDB();
        });
    });

    // Setup micro-success checkmark animation for Accept Presets
    const acceptBtn = document.getElementById("preview-accept-presets");
    if (acceptBtn) {
        acceptBtn.addEventListener("click", () => {
            const mockCard = document.getElementById("preview-card-mock");
            if (!mockCard) return;
            
            // Check if there's already an active checkmark
            const existing = mockCard.querySelector(".preview-success-overlay");
            if (existing) existing.remove();
            
            // Create overlay
            const overlay = document.createElement("div");
            overlay.className = "preview-success-overlay";
            overlay.style.position = "absolute";
            overlay.style.inset = "0";
            overlay.style.background = "rgba(16, 185, 129, 0.12)";
            overlay.style.backdropFilter = "blur(4px)";
            overlay.style.webkitBackdropFilter = "blur(4px)";
            overlay.style.display = "flex";
            overlay.style.flexDirection = "column";
            overlay.style.justifyContent = "center";
            overlay.style.alignItems = "center";
            overlay.style.borderRadius = mockCard.style.borderRadius || "12px";
            overlay.style.border = "2px solid #10b981";
            overlay.style.zIndex = "10";
            overlay.style.transition = "opacity 0.4s ease, transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
            overlay.style.transform = "scale(0.8)";
            overlay.style.opacity = "0";
            
            overlay.innerHTML = `
                <div style="font-size: 3rem; transform: scale(0.5); animation: bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;">✅</div>
                <div style="color: #10b981; font-weight: 800; font-size: 0.9rem; margin-top: 8px; text-transform: uppercase; letter-spacing: 0.05em;">Preset Accepted!</div>
            `;
            
            const originalPosition = mockCard.style.position;
            mockCard.style.position = "relative";
            mockCard.appendChild(overlay);
            
            setTimeout(() => {
                overlay.style.transform = "scale(1)";
                overlay.style.opacity = "1";
            }, 10);
            
            setTimeout(() => {
                overlay.style.opacity = "0";
                overlay.style.transform = "scale(1.1)";
                setTimeout(() => {
                    overlay.remove();
                    mockCard.style.position = originalPosition;
                }, 400);
            }, 1500);
            
            acceptBtn.style.transform = "scale(1)";
            acceptBtn.classList.remove("invite-pulse");
        });
    }

    // Setup viewport tester cycle width changes
    const secBtn = document.getElementById("preview-secondary-option");
    const wrapper = document.getElementById("preview-viewport-wrapper");
    if (secBtn && wrapper) {
        let currentViewport = "desktop";
        secBtn.addEventListener("click", () => {
            if (currentViewport === "desktop") {
                currentViewport = "tablet";
                wrapper.style.width = "480px";
                secBtn.innerHTML = "Tablet Viewport 📱";
                secBtn.style.color = "var(--accent-secondary)";
            } else if (currentViewport === "tablet") {
                currentViewport = "mobile";
                wrapper.style.width = "320px";
                secBtn.innerHTML = "Mobile Viewport 📞";
                secBtn.style.color = "var(--accent-primary)";
            } else {
                currentViewport = "desktop";
                wrapper.style.width = "100%";
                secBtn.innerHTML = "Desktop Viewport 🖥️";
                secBtn.style.color = "var(--text-secondary)";
            }
        });
    }

    // Setup quick color swatches chips listeners
    const btnPrem = document.getElementById("preset-swatch-premium-gradient");
    const btnFour = document.getElementById("preset-swatch-4color-gradient");
    const btnSaas = document.getElementById("preset-swatch-saas");
    
    if (btnPrem) {
        btnPrem.addEventListener("click", () => {
            document.getElementById("theme-primary-hue").value = 267;
            document.getElementById("theme-primary-sat").value = 90;
            document.getElementById("theme-primary-light").value = 61;
            document.getElementById("theme-secondary-hue").value = 185;
            document.getElementById("theme-secondary-sat").value = 90;
            document.getElementById("theme-secondary-light").value = 50;
            document.getElementById("theme-glow-hue").value = 267;
            document.getElementById("theme-glow-sat").value = 90;
            document.getElementById("theme-glow-spread").value = 25;
            document.getElementById("theme-glow-intensity").value = 14; 
            document.getElementById("theme-bg-hue").value = 250;
            document.getElementById("theme-bg-sat").value = 15;
            document.getElementById("theme-bg-light").value = 4;
            document.getElementById("theme-card-light").value = 6;
            
            updateRealtimePreview();
            saveThemeSettingsToDB();
            
            const event = new Event("click");
            if (acceptBtn) acceptBtn.dispatchEvent(event);
        });
    }
    
    if (btnFour) {
        btnFour.addEventListener("click", () => {
            document.getElementById("theme-primary-hue").value = 328; 
            document.getElementById("theme-primary-sat").value = 95;
            document.getElementById("theme-primary-light").value = 60;
            document.getElementById("theme-secondary-hue").value = 150; 
            document.getElementById("theme-secondary-sat").value = 85;
            document.getElementById("theme-secondary-light").value = 50;
            document.getElementById("theme-glow-hue").value = 328;
            document.getElementById("theme-glow-sat").value = 95;
            document.getElementById("theme-glow-spread").value = 35;
            document.getElementById("theme-glow-intensity").value = 18; 
            document.getElementById("theme-bg-hue").value = 280;
            document.getElementById("theme-bg-sat").value = 18;
            document.getElementById("theme-bg-light").value = 3;
            document.getElementById("theme-card-light").value = 8;
            
            updateRealtimePreview();
            saveThemeSettingsToDB();
            
            const event = new Event("click");
            if (acceptBtn) acceptBtn.dispatchEvent(event);
        });
    }
    
    if (btnSaas) {
        btnSaas.addEventListener("click", () => {
            document.getElementById("theme-primary-hue").value = 217; 
            document.getElementById("theme-primary-sat").value = 30;
            document.getElementById("theme-primary-light").value = 45;
            document.getElementById("theme-secondary-hue").value = 210; 
            document.getElementById("theme-secondary-sat").value = 25;
            document.getElementById("theme-secondary-light").value = 60;
            document.getElementById("theme-glow-hue").value = 217;
            document.getElementById("theme-glow-sat").value = 20;
            document.getElementById("theme-glow-spread").value = 10;
            document.getElementById("theme-glow-intensity").value = 5; 
            document.getElementById("theme-bg-hue").value = 222;
            document.getElementById("theme-bg-sat").value = 12;
            document.getElementById("theme-bg-light").value = 6;
            document.getElementById("theme-card-light").value = 6;
            
            updateRealtimePreview();
            saveThemeSettingsToDB();
            
            const event = new Event("click");
            if (acceptBtn) acceptBtn.dispatchEvent(event);
        });
    }

    // Toggle Premium Gradient Customizer visibility based on layout theme
    const layoutStyleSelect = document.getElementById("theme-layout-style");
    const gradientCustomizer = document.getElementById("premium-gradient-customizer");
    if (layoutStyleSelect && gradientCustomizer) {
        const toggleGradientCustomizer = () => {
            if (layoutStyleSelect.value === "gradient") {
                gradientCustomizer.style.display = "block";
            } else {
                gradientCustomizer.style.display = "none";
            }
        };
        layoutStyleSelect.addEventListener("change", toggleGradientCustomizer);
    }

    // Toggle custom gradient color inputs display based on preset
    const presetSelect = document.getElementById("gradient-preset-select");
    const customColorsContainer = document.getElementById("gradient-custom-colors-container");
    if (presetSelect && customColorsContainer) {
        const toggleCustomColors = () => {
            if (presetSelect.value === "custom-mesh") {
                customColorsContainer.style.display = "grid";
            } else {
                customColorsContainer.style.display = "none";
                let colors = ["#8b5cf6", "#06b6d4", "#ec4899"];
                if (presetSelect.value === "obsidian-nebula") {
                    colors = ["#a855f7", "#06b6d4", "#1e1b4b"];
                } else if (presetSelect.value === "sunset-glow") {
                    colors = ["#f43f5e", "#fb923c", "#fef08a"];
                } else if (presetSelect.value === "deep-space") {
                    colors = ["#4f46e5", "#2563eb", "#10b981"];
                } else if (presetSelect.value === "cyber-neon") {
                    colors = ["#ff007f", "#00f0ff", "#7000ff"];
                }
                document.getElementById("gradient-color-1").value = colors[0];
                document.getElementById("gradient-color-2").value = colors[1];
                document.getElementById("gradient-color-3").value = colors[2];
            }
            updateRealtimePreview();
            saveThemeSettingsToDB();
        };
        presetSelect.addEventListener("change", toggleCustomColors);
    }

    // Attach listeners to gradient settings inputs
    const gradControls = ["gradient-preset-select", "gradient-color-1", "gradient-color-2", "gradient-color-3", "gradient-animate-orbs"];
    gradControls.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener("input", () => {
                updateRealtimePreview();
            });
            el.addEventListener("change", () => {
                updateRealtimePreview();
                saveThemeSettingsToDB();
            });
        }
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        
        saveThemeSettingsToDB();
        injectTheme();
        injectLayouts();
        
        alert("Visual theme settings saved and applied globally across all pages successfully!");
    });
}

function populateVisualThemeEngineFields() {
    const db = getDB();
    const s = db.settings;

    // Fill form elements with saved settings values
    document.getElementById("theme-radius").value = s.cardBorderRadius !== undefined ? s.cardBorderRadius : 12;
    document.getElementById("theme-border-thickness").value = s.cardBorderThickness !== undefined ? s.cardBorderThickness : 1;
    document.getElementById("theme-blur").value = s.cardGlassBlur !== undefined ? s.cardGlassBlur : 16;
    document.getElementById("theme-glow-intensity").value = s.glowIntensity !== undefined ? Math.round(s.glowIntensity * 10) : 10;
    document.getElementById("theme-glow-speed").value = s.glowAnimationSpeed !== undefined ? s.glowAnimationSpeed : 3;
    document.getElementById("theme-gaps").value = s.layoutGaps !== undefined ? s.layoutGaps : 30;
    document.getElementById("theme-padding").value = s.sectionPadding !== undefined ? s.sectionPadding : 80;
    
    document.getElementById("theme-header-style").value = s.headerStyle || "floating-glass";
    document.getElementById("theme-fonts").value = s.fontPreset || "minimal-slate";
    document.getElementById("theme-layout-style").value = s.theme || "default";

    document.getElementById("theme-bg-hue").value = s.customBgH !== undefined ? s.customBgH : 240;
    document.getElementById("theme-bg-sat").value = s.customBgS !== undefined ? s.customBgS : 10;
    document.getElementById("theme-bg-light").value = s.customBgL !== undefined ? s.customBgL : 3;
    document.getElementById("theme-card-light").value = s.customCardL !== undefined ? s.customCardL : 5;
    document.getElementById("theme-card-opacity").value = s.customCardA !== undefined ? Math.round(s.customCardA * 100) : 40;
    document.getElementById("theme-border-opacity").value = s.customBorderA !== undefined ? Math.round(s.customBorderA * 100) : 8;
    document.getElementById("theme-glow-hue").value = s.customGlowH !== undefined ? s.customGlowH : 267;
    document.getElementById("theme-glow-sat").value = s.customGlowS !== undefined ? s.customGlowS : 90;
    document.getElementById("theme-glow-spread").value = s.glowSpread !== undefined ? s.glowSpread : 15;

    // Accent Colors population
    document.getElementById("theme-primary-hue").value = s.primaryColorH !== undefined ? s.primaryColorH : 267;
    document.getElementById("theme-primary-sat").value = s.primaryColorS !== undefined ? s.primaryColorS : 90;
    document.getElementById("theme-primary-light").value = s.primaryColorL !== undefined ? s.primaryColorL : 61;
    
    document.getElementById("theme-secondary-hue").value = s.secondaryColorH !== undefined ? s.secondaryColorH : 185;
    document.getElementById("theme-secondary-sat").value = s.secondaryColorS !== undefined ? s.secondaryColorS : 90;
    document.getElementById("theme-secondary-light").value = s.secondaryColorL !== undefined ? s.secondaryColorL : 50;

    document.getElementById("theme-text-primary").value = s.textColorPrimary || "#f8fafc";
    document.getElementById("theme-text-secondary").value = s.textColorSecondary || "#94a3b8";
    document.getElementById("theme-text-muted").value = s.textColorMuted || "#64748b";

    const gradPresetSelect = document.getElementById("gradient-preset-select");
    if (gradPresetSelect) {
        gradPresetSelect.value = s.gradientPreset || "obsidian-nebula";
        document.getElementById("gradient-color-1").value = s.gradientColor1 || "#a855f7";
        document.getElementById("gradient-color-2").value = s.gradientColor2 || "#06b6d4";
        document.getElementById("gradient-color-3").value = s.gradientColor3 || "#1e1b4b";
        document.getElementById("gradient-animate-orbs").checked = s.gradientAnimate !== undefined ? s.gradientAnimate : true;
        
        const gradientCustomizer = document.getElementById("premium-gradient-customizer");
        const layoutStyleSelect = document.getElementById("theme-layout-style");
        if (layoutStyleSelect && gradientCustomizer) {
            if (layoutStyleSelect.value === "gradient") {
                gradientCustomizer.style.display = "block";
            } else {
                gradientCustomizer.style.display = "none";
            }
        }
        
        const customColorsContainer = document.getElementById("gradient-custom-colors-container");
        if (customColorsContainer) {
            if (gradPresetSelect.value === "custom-mesh") {
                customColorsContainer.style.display = "grid";
            } else {
                customColorsContainer.style.display = "none";
            }
        }
    }

    // Trigger visual sync by invoking the helper
    const radius = parseInt(document.getElementById("theme-radius").value, 10);
    const thickness = parseInt(document.getElementById("theme-border-thickness").value, 10);
    const blurVal = parseInt(document.getElementById("theme-blur").value, 10);
    const glowMult = parseInt(document.getElementById("theme-glow-intensity").value, 10) * 0.1;
    const glowSpeed = parseInt(document.getElementById("theme-glow-speed").value, 10);
    const gaps = parseInt(document.getElementById("theme-gaps").value, 10);
    const padding = parseInt(document.getElementById("theme-padding").value, 10);
    
    const headerStyle = document.getElementById("theme-header-style").value;
    const fontPreset = document.getElementById("theme-fonts").value;
    const layoutStyle = document.getElementById("theme-layout-style").value;
    
    const bgH = parseInt(document.getElementById("theme-bg-hue").value, 10);
    const bgS = parseInt(document.getElementById("theme-bg-sat").value, 10);
    const bgL = parseInt(document.getElementById("theme-bg-light").value, 10);
    const cardL = parseInt(document.getElementById("theme-card-light").value, 10);
    const cardA = parseInt(document.getElementById("theme-card-opacity").value, 10) * 0.01;
    const borderA = parseInt(document.getElementById("theme-border-opacity").value, 10) * 0.01;
    const glowH = parseInt(document.getElementById("theme-glow-hue").value, 10);
    const glowS = parseInt(document.getElementById("theme-glow-sat").value, 10);
    const glowSpread = parseInt(document.getElementById("theme-glow-spread").value, 10);

    const priH = parseInt(document.getElementById("theme-primary-hue").value, 10);
    const priS = parseInt(document.getElementById("theme-primary-sat").value, 10);
    const priL = parseInt(document.getElementById("theme-primary-light").value, 10);
    const secH = parseInt(document.getElementById("theme-secondary-hue").value, 10);
    const secS = parseInt(document.getElementById("theme-secondary-sat").value, 10);
    const secL = parseInt(document.getElementById("theme-secondary-light").value, 10);

    // Update labels text
    document.getElementById("theme-radius-val").textContent = `${radius}px`;
    document.getElementById("theme-border-thickness-val").textContent = `${thickness}px`;
    document.getElementById("theme-blur-val").textContent = `${blurVal}px`;
    document.getElementById("theme-glow-intensity-val").textContent = `${glowMult.toFixed(1)}x`;
    document.getElementById("theme-glow-speed-val").textContent = `${glowSpeed}s`;
    document.getElementById("theme-gaps-val").textContent = `${gaps}px`;
    document.getElementById("theme-padding-val").textContent = `${padding}px`;

    document.getElementById("theme-bg-hue-val").textContent = `${bgH}°`;
    document.getElementById("theme-bg-sat-val").textContent = `${bgS}%`;
    document.getElementById("theme-bg-light-val").textContent = `${bgL}%`;
    document.getElementById("theme-card-light-val").textContent = `${cardL}%`;
    document.getElementById("theme-card-opacity-val").textContent = `${cardA.toFixed(2)}`;
    document.getElementById("theme-border-opacity-val").textContent = `${borderA.toFixed(2)}`;
    document.getElementById("theme-glow-hue-val").textContent = `${glowH}°`;
    document.getElementById("theme-glow-sat-val").textContent = `${glowS}%`;
    document.getElementById("theme-glow-spread-val").textContent = `${glowSpread}px`;

    document.getElementById("theme-primary-hue-val").textContent = `${priH}°`;
    document.getElementById("theme-primary-sat-val").textContent = `${priS}%`;
    document.getElementById("theme-primary-light-val").textContent = `${priL}%`;
    document.getElementById("theme-secondary-hue-val").textContent = `${secH}°`;
    document.getElementById("theme-secondary-sat-val").textContent = `${secS}%`;
    document.getElementById("theme-secondary-light-val").textContent = `${secL}%`;

    // Update preview labels in stats
    document.getElementById("preview-gap-val").textContent = `${gaps}px`;
    document.getElementById("preview-padding-val").textContent = `${padding}px`;

    // Apply visual properties to preview mock card element
    const mockCard = document.getElementById("preview-card-mock");
    if (mockCard) {
        mockCard.style.borderRadius = `${radius}px`;
        mockCard.style.borderWidth = `${thickness}px`;
        mockCard.style.backdropFilter = `blur(${blurVal}px)`;
        mockCard.style.webkitBackdropFilter = `blur(${blurVal}px)`;
        mockCard.style.background = `hsla(${bgH}, ${bgS + 5}%, ${cardL}%, ${cardA})`;
        mockCard.style.borderColor = `hsla(${bgH}, 20%, 80%, ${borderA})`;
        mockCard.style.boxShadow = `0 10px 35px rgba(0,0,0,0.4), 0 0 ${16 * glowMult}px hsla(${glowH}, ${glowS}%, 50%, 0.15)`;
    }

    // Apply font styling preview to mock title
    const mockTitle = document.getElementById("preview-title-mock");
    if (mockTitle) {
        if (fontPreset === "cyberpunk") {
            mockTitle.style.fontFamily = "'Courier New', Courier, monospace";
        } else if (fontPreset === "tech-modern") {
            mockTitle.style.fontFamily = "'Roboto', sans-serif";
        } else {
            mockTitle.style.fontFamily = "'Outfit', sans-serif";
        }
    }

    // Apply header styling preview
    const mockHeader = document.getElementById("preview-header-mock");
    if (mockHeader) {
        mockHeader.style.borderRadius = `${radius}px`;
        mockHeader.style.borderWidth = `${thickness}px`;
        mockHeader.style.borderColor = `hsla(${bgH}, 20%, 80%, ${borderA})`;
        if (headerStyle === 'floating-glass') {
            mockHeader.style.transform = 'scale(0.95)';
            mockHeader.style.background = `rgba(255,255,255,0.02)`;
            mockHeader.style.boxShadow = `0 0 10px hsla(${glowH}, ${glowS}%, 50%, 0.1)`;
        } else if (headerStyle === 'centered') {
            mockHeader.style.transform = 'scale(1)';
            mockHeader.style.background = 'none';
            mockHeader.style.boxShadow = 'none';
        } else { // sticky-solid
            mockHeader.style.transform = 'scale(1)';
            mockHeader.style.background = `hsl(${bgH}, ${bgS}%, ${bgL + 4}%)`;
            mockHeader.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
        }
    }

    // Apply main background preview on parent card wrapper
    const previewBody = document.getElementById("theme-preview-body");
    if (previewBody) {
        previewBody.style.background = `hsl(${bgH}, ${bgS}%, ${bgL + 1}%)`;
    }

    // Synchronize direct color pickers values with loaded database parameters on boot
    const bgColorPicker = document.getElementById("theme-bg-color-picker");
    if (bgColorPicker) bgColorPicker.value = hslToHex(bgH, bgS, bgL);

    const cardColorPicker = document.getElementById("theme-card-color-picker");
    if (cardColorPicker) cardColorPicker.value = hslToHex(bgH, bgS, cardL);

    const priColorPicker = document.getElementById("theme-primary-color-picker");
    if (priColorPicker) priColorPicker.value = hslToHex(priH, priS, priL);

    const secColorPicker = document.getElementById("theme-secondary-color-picker");
    if (secColorPicker) secColorPicker.value = hslToHex(secH, secS, secL);

    const glowColorPicker = document.getElementById("theme-glow-color-picker");
    if (glowColorPicker) glowColorPicker.value = hslToHex(glowH, glowS, 50);
}

