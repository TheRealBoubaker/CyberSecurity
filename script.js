// ===== CONFIGURATION =====
let apiCalls = 0;
const API_LIMIT = 7; // 7 clics pour le crash
let serverCrashed = false;

// ===== DÉTECTION DES BOUTONS CACHÉS =====

// 1. Bouton dans le logo
document.getElementById('secretBtn1').addEventListener('click', function() {
    if (serverCrashed) return;
    makeApiCall('logo');
    addLog('[SECRET] Bouton logo cliqué', 'warning');
    
    // Effet visuel
    this.style.background = 'rgba(255,71,87,0.3)';
    setTimeout(() => this.style.background = '', 500);
});

// 2. Bouton footer Debug
document.getElementById('secretBtn2').addEventListener('click', function() {
    if (serverCrashed) return;
    makeApiCall('footer');
    addLog('[SECRET] Bouton debug cliqué', 'warning');
    
    // Animation
    this.style.transform = 'rotate(180deg)';
    setTimeout(() => this.style.transform = '', 300);
});

// 3. Bouton dans le texte "club"
document.getElementById('secretBtn3').addEventListener('click', function() {
    if (serverCrashed) return;
    makeApiCall('text');
    addLog('[SECRET] Mot secret cliqué', 'warning');
    
    // Effet
    this.style.color = '#ff4757';
    setTimeout(() => this.style.color = '', 1000);
});

// 4. Compteur API
document.getElementById('secretBtn4').addEventListener('click', function() {
    if (serverCrashed) return;
    makeApiCall('counter');
    addLog('[SECRET] Compteur API cliqué', 'warning');
    
    // Mettre à jour l'affichage
    const counter = this.querySelector('.api-counter');
    counter.textContent = apiCalls;
    counter.style.transform = 'scale(1.2)';
    setTimeout(() => counter.style.transform = '', 300);
});

// 5. Raccourci clavier Ctrl+Alt+E
document.addEventListener('keydown', function(e) {
    if (serverCrashed) return;
    if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'e') {
        makeApiCall('keyboard');
        addLog('[SECRET] Raccourci Ctrl+Alt+E utilisé', 'warning');
        
        // Flash du hint
        const hint = document.querySelector('.keyboard-hint');
        hint.style.background = 'rgba(0,102,204,0.2)';
        setTimeout(() => hint.style.background = '', 1000);
    }
});

// ===== FONCTION API =====
function makeApiCall(source) {
    if (serverCrashed) return;
    
    apiCalls++;
    
    // Mettre à jour le compteur affiché
    const counter = document.querySelector('.api-counter');
    if (counter) counter.textContent = apiCalls;
    
    addLog(`[API] Appel #${apiCalls} depuis: ${source}`, 'info');
    
    // ❌ NOUVEAU CONCEPT: Crash au lieu de admin
    if (apiCalls >= API_LIMIT && !serverCrashed) {
        triggerServerCrash();
    } else if (apiCalls >= API_LIMIT - 2) {
        addLog(`[WARNING] ${API_LIMIT - apiCalls} appels restants avant crash système`, 'error');
    }
}

// ===== CRASH DU SERVEUR =====
function triggerServerCrash() {
    serverCrashed = true;
    
    // Cacher le panel admin existant s'il est visible
    document.getElementById('adminPanel').style.display = 'none';
    const overlay = document.querySelector('.overlay');
    if (overlay) overlay.remove();
    
    // Créer un écran de crash simple
    createCrashScreen();
    
    // Désactiver toutes les interactions
    disableAllInteractions();
    
    // Logs
    addLog('[CRITICAL] 🚨 LIMITE API DÉPASSÉE', 'danger');
    addLog('[CRITICAL] 💥 SERVEUR EN PANNE', 'danger');
    addLog('[CRITICAL] ❌ Système hors service - accès bloqué', 'danger');
    
    // Alert
    setTimeout(() => {
        alert("🚨 SERVEUR EN PANNE !\n\n" +
              "La limite d'API a été dépassée.\n" +
              "Le serveur est tombé - accès impossible.");
    }, 500);
}

// ===== CRÉER ÉCRAN DE CRASH SIMPLE =====
function createCrashScreen() {
    // Créer un overlay de crash
    const crashOverlay = document.createElement('div');
    crashOverlay.id = 'crashOverlay';
    crashOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #000;
        z-index: 9998;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        color: #fff;
        font-family: 'Courier New', monospace;
        text-align: center;
        padding: 20px;
    `;
    
    // Contenu de l'écran de crash
    crashOverlay.innerHTML = `
        <div style="font-size: 4rem; color: #ff4757; margin-bottom: 20px;">💥</div>
        <h1 style="color: #ff4757; font-size: 2.5rem; margin-bottom: 10px;">SERVER CRASH</h1>
        <div style="background: #1a1a1a; padding: 20px; border-radius: 10px; margin: 20px 0; max-width: 600px;">
            <div style="color: #00ff00; font-size: 0.9rem; text-align: left;">
                <div>> ERROR: API_LIMIT_EXCEEDED (0x7A29F)</div>
                <div>> SYSTEM: SERVER_OVERLOAD</div>
                <div>> API_CALLS: ${apiCalls}</div>
                <div>> STATUS: CRITICAL_FAILURE</div>
                <div>> TIME: ${new Date().toLocaleTimeString()}</div>
            </div>
        </div>
        <p style="color: #ccc; margin-bottom: 30px;">
            Limite d'API dépassée. Serveur hors service.
        </p>
        <div style="color: #ffcc00; font-size: 0.9rem;">
            <i class="fas fa-exclamation-triangle"></i> Contactez l'administrateur
        </div>
    `;
    
    document.body.appendChild(crashOverlay);
    
    // Ajouter un effet de clignotement rouge
    let blinkCount = 0;
    const blinkInterval = setInterval(() => {
        crashOverlay.style.backgroundColor = blinkCount % 2 === 0 ? '#400000' : '#000';
        blinkCount++;
        if (blinkCount > 10) clearInterval(blinkInterval);
    }, 200);
}

// ===== DÉSACTIVER TOUTES LES INTERACTIONS =====
function disableAllInteractions() {
    // Désactiver tous les liens
    const allLinks = document.querySelectorAll('a');
    allLinks.forEach(link => {
        link.style.pointerEvents = 'none';
        link.style.opacity = '0.5';
        link.style.cursor = 'not-allowed';
    });
    
    // Désactiver tous les boutons
    const allButtons = document.querySelectorAll('button, .secret-btn, .secret-btn-footer, .secret-word, .secret-stats');
    allButtons.forEach(button => {
        button.style.pointerEvents = 'none';
        button.style.opacity = '0.5';
        button.style.cursor = 'not-allowed';
    });
    
    // Désactiver le clavier
    document.removeEventListener('keydown', arguments.callee);
    
    // Changer le curseur global
    document.body.style.cursor = 'not-allowed';
}

// ===== FONCTIONS ADMIN (DÉSACTIVÉES) =====
function openFile(filename) {
    // Cette fonction est maintenant désactivée
    addLog(`[BLOCKED] Tentative d'ouverture: ${filename}`, 'danger');
    alert("❌ ACCÈS BLOQUÉ\n\nServeur en panne. Opération impossible.");
}

function deleteFiles() {
    // Cette fonction est maintenant désactivée
    addLog('[BLOCKED] Tentative de suppression fichiers', 'danger');
    alert("❌ ACCÈS BLOQUÉ\n\nServeur en panne. Opération impossible.");
}

function closeAdminPanel() {
    // Cette fonction est maintenant désactivée
    addLog('[BLOCKED] Tentative de fermeture panel admin', 'danger');
    alert("❌ ACCÈS BLOQUÉ\n\nServeur en panne. Opération impossible.");
}

// ===== FONCTIONS UTILITAIRES =====
function addLog(message, type = 'info') {
    const logsDiv = document.getElementById('logs');
    const timestamp = new Date().toLocaleTimeString();
    
    let color;
    switch(type) {
        case 'error': color = '#ff6b6b'; break;
        case 'warning': color = '#ffcc00'; break;
        case 'danger': color = '#ff4757'; break;
        case 'success': color = '#51cf66'; break;
        default: color = '#4dabf7';
    }
    
    const logEntry = document.createElement('div');
    logEntry.innerHTML = `<span style="color: ${color}">[${timestamp}] ${message}</span>`;
    logsDiv.appendChild(logEntry);
    
    // Scroll automatique
    logsDiv.scrollTop = logsDiv.scrollHeight;
    
    // Limiter à 50 lignes
    if (logsDiv.children.length > 50) {
        logsDiv.removeChild(logsDiv.firstChild);
    }
}

// ===== INITIALISATION =====
document.addEventListener('DOMContentLoaded', function() {
    addLog('[SYSTEM] Site Eniso Cyberguards initialisé', 'info');
    addLog('[INFO] Interface utilisateur chargée', 'success');
    addLog('[HINT] 💡 Cherchez les éléments cachés...', 'warning');
    
    // Initialiser le compteur
    document.querySelector('.api-counter').textContent = '0';
});