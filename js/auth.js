/**
 * GREY CORNER — Module d'Authentification Sécurisée (Supabase Auth)
 * Protège et verrouille l'accès à l'espace Direction et aux données confidentielles.
 */
(function(global) {
  'use strict';

  const SUPABASE_URL = 'https://bxgguavmuiefthqmzygy.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4Z2d1YXZtdWllZnRocW16eWd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkzNzYyNzIsImV4cCI6MjEwNDk1MjI3Mn0.7aGDBXzzMApGkxXuDDcwMJXxPlPsG8LEYb5WIcA--00';

  let supabaseClient = null;
  let currentSession = null;
  let isCheckingAuth = true;

  // Initialisation du client Supabase
  function getClient() {
    if (!supabaseClient && global.supabase && typeof global.supabase.createClient === 'function') {
      supabaseClient = global.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      });
    }
    return supabaseClient;
  }

  const GC_Auth = {
    /**
     * Initialise la vérification d'authentification
     */
    init: async function() {
      // Masquer le contenu confidentiel immédiatement
      this.injectAuthOverlay();

      const client = getClient();
      if (!client) {
        console.error('[GC_Auth] Supabase SDK non chargé');
        this.showLoginModal("Le service d'authentification n'a pas pu être chargé. Vérifiez votre connexion.");
        return;
      }

      // Écouter les changements d'état d'authentification
      client.auth.onAuthStateChange((event, session) => {
        console.log('[GC_Auth] Événement Auth:', event);
        currentSession = session;
        if (session && session.user) {
          this.onAuthenticated(session.user);
        } else {
          this.onUnauthenticated();
        }
      });

      // Vérifier la session actuelle
      try {
        const { data: { session }, error } = await client.auth.getSession();
        if (error) throw error;

        currentSession = session;
        if (session && session.user) {
          this.onAuthenticated(session.user);
        } else {
          this.onUnauthenticated();
        }
      } catch (err) {
        console.warn('[GC_Auth] Erreur lecture session:', err);
        this.onUnauthenticated();
      }
    },

    /**
     * Obtenir le token d'accès JWT courant
     */
    getAccessToken: function() {
      return currentSession ? currentSession.access_token : SUPABASE_ANON_KEY;
    },

    /**
     * Obtenir l'utilisateur connecté
     */
    getUser: function() {
      return currentSession ? currentSession.user : null;
    },

    /**
     * Vérifier si l'utilisateur est connecté
     */
    isAuthenticated: function() {
      return !!(currentSession && currentSession.user);
    },

    /**
     * Injecte l'écran de verrouillage / formulaire de login
     */
    injectAuthOverlay: function() {
      if (document.getElementById('gc-auth-gate')) return;

      const overlay = document.createElement('div');
      overlay.id = 'gc-auth-gate';
      overlay.style.cssText = `
        position: fixed;
        inset: 0;
        background: #070b14;
        z-index: 999999;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        color: #f8fafc;
      `;

      overlay.innerHTML = `
        <div style="max-width: 420px; width: 100%; background: #0f172a; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 20px; padding: 36px 30px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7); position: relative; overflow: hidden;">
          
          <!-- Ligne d'accent supérieure or -->
          <div style="position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, #f59e0b, #fbbf24);"></div>
          
          <!-- En-tête de marque -->
          <div style="text-align: center; margin-bottom: 28px;">
            <div style="display: inline-flex; align-items: center; justify-content: center; width: 56px; height: 56px; border-radius: 16px; background: linear-gradient(135deg, #1e293b, #0f172a); border: 2px solid rgba(245, 158, 11, 0.4); box-shadow: 0 10px 20px rgba(0,0,0,0.4); margin-bottom: 14px;">
              <span style="color: #fbbf24; font-weight: 900; font-size: 22px; letter-spacing: -0.5px;">GC</span>
            </div>
            <h2 style="margin: 0 0 6px 0; font-size: 20px; font-weight: 800; color: #f8fafc; letter-spacing: -0.3px;">GREY CORNER</h2>
            <div style="display: inline-block; padding: 3px 12px; background: rgba(245, 158, 11, 0.12); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 999px; font-size: 11px; font-weight: 800; color: #fbbf24; text-transform: uppercase; letter-spacing: 1px;">
              🔒 Espace Direction Réservé
            </div>
            <p style="margin: 10px 0 0 0; font-size: 13px; color: #94a3b8;">
              Accès strictement confidentiel réservé aux gérants et administrateurs.
            </p>
          </div>

          <!-- Message d'erreur -->
          <div id="gc-auth-error" style="display: none; background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.35); border-radius: 10px; padding: 10px 14px; margin-bottom: 20px; font-size: 13px; color: #fca5a5; text-align: center;">
          </div>

          <!-- Formulaire de connexion -->
          <form id="gc-auth-form" onsubmit="event.preventDefault(); window.GC_Auth.handleLogin();">
            <div style="margin-bottom: 18px;">
              <label style="display: block; font-size: 12px; font-weight: 700; color: #cbd5e1; margin-bottom: 6px;">Email Direction</label>
              <input type="email" id="gc-auth-email" required placeholder="direction@greycorner.com" autocomplete="username" style="width: 100%; box-sizing: border-box; padding: 12px 14px; border-radius: 10px; border: 1px solid rgba(255, 255, 255, 0.15); background: #1e293b; color: #f8fafc; font-size: 15px; outline: none; transition: border-color 0.2s;" onfocus="this.style.borderColor='#f59e0b'" onblur="this.style.borderColor='rgba(255, 255, 255, 0.15)'" />
            </div>

            <div style="margin-bottom: 24px; position: relative;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                <label style="font-size: 12px; font-weight: 700; color: #cbd5e1;">Mot de passe</label>
              </div>
              <div style="position: relative;">
                <input type="password" id="gc-auth-password" required placeholder="••••••••••••" autocomplete="current-password" style="width: 100%; box-sizing: border-box; padding: 12px 42px 12px 14px; border-radius: 10px; border: 1px solid rgba(255, 255, 255, 0.15); background: #1e293b; color: #f8fafc; font-size: 15px; outline: none; transition: border-color 0.2s;" onfocus="this.style.borderColor='#f59e0b'" onblur="this.style.borderColor='rgba(255, 255, 255, 0.15)'" />
                <button type="button" onclick="window.GC_Auth.togglePasswordVisibility()" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; color: #94a3b8; cursor: pointer; font-size: 16px; padding: 4px;">👁️</button>
              </div>
            </div>

            <button type="submit" id="gc-auth-submit-btn" style="width: 100%; padding: 13px; border-radius: 10px; border: none; background: linear-gradient(135deg, #f59e0b, #d97706); color: #000; font-weight: 800; font-size: 14px; cursor: pointer; transition: transform 0.1s, opacity 0.2s; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);">
              Déverrouiller l'Espace Direction ➔
            </button>
          </form>

          <div style="margin-top: 20px; text-align: center; font-size: 11.5px; color: #64748b;">
            🔒 Authentification sécurisée par Supabase & chiffrement RSA
          </div>
        </div>
      `;

      document.body.appendChild(overlay);
    },

    togglePasswordVisibility: function() {
      const pwdInput = document.getElementById('gc-auth-password');
      if (pwdInput) {
        pwdInput.type = pwdInput.type === 'password' ? 'text' : 'password';
      }
    },

    /**
     * Traitement du formulaire de connexion
     */
    handleLogin: async function() {
      const emailInput = document.getElementById('gc-auth-email');
      const pwdInput = document.getElementById('gc-auth-password');
      const submitBtn = document.getElementById('gc-auth-submit-btn');
      const errBox = document.getElementById('gc-auth-error');

      const email = (emailInput?.value || '').trim();
      const password = (pwdInput?.value || '').trim();

      if (!email || !password) {
        this.showError("Veuillez renseigner votre email et mot de passe.");
        return;
      }

      submitBtn.disabled = true;
      submitBtn.innerText = "Connexion sécurisée en cours...";
      submitBtn.style.opacity = "0.7";
      errBox.style.display = "none";

      const client = getClient();
      try {
        const { data, error } = await client.auth.signInWithPassword({
          email: email,
          password: password
        });

        if (error) throw error;

        currentSession = data.session;
        this.onAuthenticated(data.user);
      } catch (err) {
        console.error('[GC_Auth] Échec connexion:', err);
        let msg = "Email ou mot de passe incorrect.";
        if (err.message && err.message.includes('Invalid login credentials')) {
          msg = "Identifiants invalides. Vérifiez l'adresse email et le mot de passe.";
        } else if (err.message) {
          msg = err.message;
        }
        this.showError(msg);
        submitBtn.disabled = false;
        submitBtn.innerText = "Déverrouiller l'Espace Direction ➔";
        submitBtn.style.opacity = "1";
      }
    },

    showError: function(msg) {
      const errBox = document.getElementById('gc-auth-error');
      if (errBox) {
        errBox.innerText = msg;
        errBox.style.display = "block";
      }
    },

    /**
     * Action après authentification réussie
     */
    onAuthenticated: function(user) {
      const overlay = document.getElementById('gc-auth-gate');
      if (overlay) {
        overlay.style.transition = 'opacity 0.3s ease';
        overlay.style.opacity = '0';
        setTimeout(() => overlay.remove(), 300);
      }

      this.injectUserHeaderBadge(user);

      // Déclencher la synchronisation des données connectées
      if (global.GC_Supabase && typeof global.GC_Supabase.syncIngredientsFromCloud === 'function') {
        global.GC_Supabase.syncIngredientsFromCloud().catch(e => console.warn('[Supabase Sync]', e));
      }

      if (global.GC_Toast) {
        global.GC_Toast.show(`Bienvenue Direction (${user.email})`, 'success');
      }
    },

    /**
     * Action si utilisateur non authentifié
     */
    onUnauthenticated: function() {
      this.injectAuthOverlay();
    },

    /**
     * Déconnexion sécurisée
     */
    logout: async function() {
      if (!confirm("Voulez-vous verrouiller et quitter votre session Direction ?")) return;

      const client = getClient();
      if (client) {
        await client.auth.signOut();
      }
      currentSession = null;
      window.location.reload();
    },

    /**
     * Ajoute le badge utilisateur et le bouton déconnexion dans l'en-tête
     */
    injectUserHeaderBadge: function(user) {
      if (document.getElementById('gc-auth-user-badge')) return;

      const navContainer = document.querySelector('.app-header-nav') || 
                           document.querySelector('.top-system-nav > div:last-child');
      if (!navContainer) return;

      const userBadge = document.createElement('div');
      userBadge.id = 'gc-auth-user-badge';
      userBadge.style.cssText = `
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(255, 255, 255, 0.15);
        padding: 4px 10px;
        border-radius: 999px;
        font-size: 12px;
      `;

      const emailPrefix = (user.email || 'Direction').split('@')[0];

      userBadge.innerHTML = `
        <span style="width: 8px; height: 8px; border-radius: 50%; background: #10b981; box-shadow: 0 0 6px #10b981;"></span>
        <span style="font-weight: 700; color: #f8fafc;" title="${user.email}">👤 ${emailPrefix}</span>
        <button type="button" onclick="window.GC_Auth.logout()" title="Verrouiller et fermer la session" style="background: none; border: none; color: #f87171; cursor: pointer; font-size: 13px; font-weight: 700; padding: 2px 4px; display: inline-flex; align-items: center; gap: 3px;">
          🚪 Quitter
        </button>
      `;

      navContainer.appendChild(userBadge);
    }
  };

  global.GC_Auth = GC_Auth;

  // Lancement automatique dès que le DOM est prêt
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => GC_Auth.init());
  } else {
    GC_Auth.init();
  }
})(typeof window !== 'undefined' ? window : globalThis);
