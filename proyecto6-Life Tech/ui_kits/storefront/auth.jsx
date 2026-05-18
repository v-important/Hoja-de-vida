// Auth — Login / register panel + Google centered modal

// ── Server API helpers ─────────────────────────────────────────────────────
async function apiLookupUser(email) {
  try {
    const r = await fetch(`http://localhost:3001/api/public/users/lookup?email=${encodeURIComponent(email)}`);
    if (r.status === 404) return null;
    if (!r.ok) return null;
    return await r.json();
  } catch { return null; }
}

async function apiRegisterUser(userData) {
  try {
    const r = await fetch("http://localhost:3001/api/public/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    if (!r.ok) return null;
    return await r.json();
  } catch { return null; }
}

// ── Google sub-components ──────────────────────────────────────────────────
function GoogleIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function GoogleWordmark() {
  const letters = [
    { c: "G", col: "#4285F4" }, { c: "o", col: "#EA4335" }, { c: "o", col: "#FBBC05" },
    { c: "g", col: "#4285F4" }, { c: "l", col: "#34A853" }, { c: "e", col: "#EA4335" },
  ];
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: 0, marginBottom: 20 }}>
      {letters.map(({ c, col }, i) => (
        <span key={i} style={{ font: "700 28px/1 Arial, sans-serif", color: col }}>{c}</span>
      ))}
    </div>
  );
}

// ── Shared styles ──────────────────────────────────────────────────────────
const G = {
  input: {
    width: "100%", height: 54, padding: "0 16px", boxSizing: "border-box",
    border: "1px solid #dadce0", borderRadius: 4,
    font: "400 16px/1 Arial, sans-serif", color: "#202124",
    outline: "none", background: "#fff", transition: "border-color .15s",
  },
  btnPrimary: {
    background: "#1a73e8", color: "#fff", border: "none", borderRadius: 4,
    height: 36, padding: "0 24px", font: "500 14px/1 Arial, sans-serif",
    cursor: "pointer",
  },
  link: {
    font: "500 14px/1 Arial, sans-serif", color: "#1a73e8",
    background: "none", border: "none", cursor: "pointer", padding: 0,
  },
  label: {
    position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
    font: "400 16px/1 Arial, sans-serif", color: "#5f6368",
    pointerEvents: "none", transition: "all .15s",
  },
};

// ── AuthPanel ──────────────────────────────────────────────────────────────
function AuthPanel({ onClose, onLogin }) {
  const { useState, useEffect, useRef } = React;

  const [step, setStep]             = useState("main");
  const [gEmail, setGEmail]         = useState("");
  const [gEmailErr, setGEmailErr]   = useState("");
  const [gPassword, setGPassword]   = useState("");
  const [gPassErr, setGPassErr]     = useState("");
  const [gShowPass, setGShowPass]   = useState(false);
  const [nickname, setNickname]     = useState("");
  const [nickErr, setNickErr]       = useState("");
  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [emailNick, setEmailNick]   = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [formErr, setFormErr]       = useState("");
  const [loading, setLoading]       = useState(false);

  const gEmailRef = useRef(null);
  const gPassRef  = useRef(null);

  useEffect(() => {
    const onKey = e => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    if (step === "google-email") setTimeout(() => gEmailRef.current?.focus(), 80);
    if (step === "google-password") setTimeout(() => gPassRef.current?.focus(), 80);
  }, [step]);

  // ── Logic ────────────────────────────────────────────────────────────
  const goGoogleStep2 = () => {
    setGEmailErr("");
    if (!gEmail.trim()) { setGEmailErr("Ingresa una dirección de correo electrónico."); return; }
    if (!gEmail.includes("@") || gEmail.split("@")[1]?.indexOf(".") < 0) {
      setGEmailErr("Ingresa una dirección de correo electrónico válida.");
      return;
    }
    setStep("google-password");
  };

  const completeGoogle = async () => {
    setGPassErr("");
    if (!gPassword.trim()) { setGPassErr("Ingresa una contraseña."); return; }
    if (gPassword.length < 6) { setGPassErr("Contraseña incorrecta. Vuelve a intentarlo."); return; }

    setLoading(true);
    const serverUser = await apiLookupUser(gEmail);
    setLoading(false);

    if (serverUser) {
      // Usuario conocido — login directo con datos del servidor
      const words = (serverUser.name || "").split(" ").filter(Boolean);
      const user = {
        name:      serverUser.name,
        email:     serverUser.email,
        initials:  words.slice(0, 2).map(w => w[0]?.toUpperCase() || "").join("") || "U",
        color:     serverUser.color     || "#4285f4",
        nickname:  serverUser.nickname,
        provider:  serverUser.provider  || "google",
        tier:      serverUser.tier      || "FREE",
        points:    serverUser.points    || 0,
      };
      apiRegisterUser(user); // actualiza lastLogin en background
      onLogin(user); onClose(); return;
    }

    // Usuario nuevo → pedir nickname
    const rawName = gEmail.split("@")[0].replace(/[._\-+]/g, " ");
    const words   = rawName.split(" ").filter(Boolean);
    setNickname(words[0]?.toLowerCase() || "");
    setStep("nickname");
  };

  const confirmNickname = async () => {
    setNickErr("");
    if (!nickname.trim()) { setNickErr("El nickname no puede estar vacío."); return; }
    if (nickname.trim().length < 3) { setNickErr("Mínimo 3 caracteres."); return; }
    const rawName  = gEmail.split("@")[0].replace(/[._\-+]/g, " ");
    const words    = rawName.split(" ").filter(Boolean);
    const name     = words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") || gEmail.split("@")[0];
    const initials = words.slice(0, 2).map(w => w[0]?.toUpperCase() || "").join("") || "U";
    const palette  = ["#4285f4", "#34a853", "#ea4335", "#fbbc05"];
    const color    = palette[Math.floor(Math.random() * 4)];
    const nick     = "@" + nickname.trim().replace(/^@/, "");
    const user     = { name, email: gEmail, initials, color, nickname: nick, provider: "google", tier: "FREE", points: 0 };

    setLoading(true);
    await apiRegisterUser(user); // guarda en la base de datos
    setLoading(false);

    onLogin(user);
    onClose();
  };

  const submitEmail = async () => {
    setFormErr("");
    if (!email.trim() || !password.trim()) { setFormErr("Completa todos los campos."); return; }
    if (isRegister && !emailNick.trim()) { setFormErr("Elige un nickname."); return; }
    if (password.length < 6) { setFormErr("La contraseña debe tener al menos 6 caracteres."); return; }

    setLoading(true);
    const serverUser = await apiLookupUser(email.trim());
    setLoading(false);

    if (isRegister) {
      // Registro: verificar que el correo no esté ya tomado
      if (serverUser) { setFormErr("Este correo ya está registrado. Inicia sesión."); return; }

      const raw  = emailNick.replace(/[._]/g, " ");
      const name = raw.charAt(0).toUpperCase() + raw.slice(1);
      const nick = "@" + emailNick.replace(/^@/, "").replace(/\s/g, "_");
      const user = { name, email: email.trim(), initials: emailNick.slice(0, 2).toUpperCase(), color: "#ef2b2b", nickname: nick, provider: "email", tier: "FREE", points: 0 };

      setLoading(true);
      await apiRegisterUser(user); // guarda en la base de datos
      setLoading(false);

      onLogin(user); onClose();
    } else {
      // Login: usa datos del servidor si existen (recupera nickname guardado)
      if (serverUser) {
        const words = (serverUser.name || "").split(" ").filter(Boolean);
        const user  = {
          name:     serverUser.name,
          email:    serverUser.email,
          initials: words.slice(0, 2).map(w => w[0]?.toUpperCase() || "").join("") || "U",
          color:    serverUser.color    || "#ef2b2b",
          nickname: serverUser.nickname,
          provider: serverUser.provider || "email",
          tier:     serverUser.tier     || "FREE",
          points:   serverUser.points   || 0,
        };
        apiRegisterUser(user); // actualiza lastLogin en background
        onLogin(user); onClose(); return;
      }
      // Sin registro previo en el servidor — lo registramos ahora para que quede guardado
      const raw  = email.split("@")[0].replace(/[._]/g, " ");
      const name = raw.charAt(0).toUpperCase() + raw.slice(1);
      const user = { name, email: email.trim(), initials: raw.slice(0, 2).toUpperCase(), color: "#ef2b2b", nickname: "@" + raw.replace(/\s/g, "_"), provider: "email", tier: "FREE", points: 0 };
      setLoading(true);
      await apiRegisterUser(user); // persiste en server/users.json
      setLoading(false);
      onLogin(user); onClose();
    }
  };

  const pw3 = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const pwC = ["var(--border)", "var(--brand-red)", "#f59e0b", "var(--neon-lime)"][pw3];
  const inputSt = { width: "100%", height: 42, padding: "0 12px", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--fg)", font: "400 13px/1 var(--font-sans)", outline: "none", boxSizing: "border-box" };
  const labelSt = { font: "600 10px/1 var(--font-sans)", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--fg-3)", display: "block", marginBottom: 6 };

  // ── GOOGLE STEPS — centered modal ─────────────────────────────────────
  if (step === "google-email" || step === "google-password") {
    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {/* Backdrop */}
        <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgb(0 0 0 / 0.65)", backdropFilter: "blur(4px)", animation: "lt-fade-in .2s ease" }}/>

        {/* Google modal */}
        <div style={{
          position: "relative", width: 448, background: "#fff",
          borderRadius: 14, overflow: "hidden",
          boxShadow: "0 8px 60px rgb(0 0 0 / 0.45)",
          animation: "lt-scale-in .22s var(--ease-out)",
        }}>
          {/* Left accent stripe */}
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: "linear-gradient(180deg, #4285f4, #34a853, #fbbc05, #ea4335)" }}/>

          {/* Content */}
          <div style={{ padding: "40px 44px 36px" }}>
            <GoogleWordmark/>

            {/* ── Email step ── */}
            {step === "google-email" && (
              <>
                <h2 style={{ font: "400 24px/1.3 Arial, sans-serif", color: "#202124", textAlign: "center", margin: "0 0 6px" }}>
                  Iniciar sesión
                </h2>
                <p style={{ font: "400 14px/1.5 Arial, sans-serif", color: "#5f6368", textAlign: "center", margin: "0 0 28px" }}>
                  Usa tu cuenta de Google
                </p>

                <div style={{ position: "relative", marginBottom: 4 }}>
                  <input
                    ref={gEmailRef}
                    type="email"
                    value={gEmail}
                    onChange={e => { setGEmail(e.target.value); setGEmailErr(""); }}
                    onKeyDown={e => e.key === "Enter" && goGoogleStep2()}
                    placeholder="Correo electrónico o teléfono"
                    style={{
                      ...G.input,
                      borderColor: gEmailErr ? "#d93025" : "#dadce0",
                    }}
                    onFocus={e => e.target.style.borderColor = gEmailErr ? "#d93025" : "#1a73e8"}
                    onBlur={e => e.target.style.borderColor = gEmailErr ? "#d93025" : "#dadce0"}
                  />
                </div>
                {gEmailErr && (
                  <p style={{ font: "400 12px/1.4 Arial, sans-serif", color: "#d93025", margin: "6px 0 0", display: "flex", alignItems: "center", gap: 4 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="#d93025"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                    {gEmailErr}
                  </p>
                )}

                <p style={{ font: "400 13px/1.5 Arial, sans-serif", color: "#202124", margin: "18px 0 0" }}>
                  ¿No tienes una cuenta de Google?{" "}
                  <a href="https://accounts.google.com/signup" target="_blank" rel="noopener" style={{ color: "#1a73e8", fontWeight: 500 }}>Crear cuenta</a>
                </p>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 32 }}>
                  <button onClick={() => setStep("main")} style={G.link}
                    onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
                    onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}>
                    Volver
                  </button>
                  <button onClick={goGoogleStep2} style={G.btnPrimary}
                    onMouseEnter={e => e.currentTarget.style.background = "#1765cc"}
                    onMouseLeave={e => e.currentTarget.style.background = "#1a73e8"}>
                    Siguiente
                  </button>
                </div>
              </>
            )}

            {/* ── Password step ── */}
            {step === "google-password" && (
              <>
                <h2 style={{ font: "400 24px/1.3 Arial, sans-serif", color: "#202124", textAlign: "center", margin: "0 0 14px" }}>
                  Bienvenido
                </h2>

                {/* Email chip */}
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
                  <button onClick={() => { setStep("google-email"); setGPassword(""); setGPassErr(""); }}
                    style={{
                      display: "flex", alignItems: "center", gap: 8,
                      border: "1px solid #dadce0", borderRadius: 20,
                      padding: "7px 14px", background: "#f8f9fa", cursor: "pointer",
                      font: "400 14px/1 Arial, sans-serif", color: "#202124",
                      transition: "background .15s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "#f1f3f4"}
                    onMouseLeave={e => e.currentTarget.style.background = "#f8f9fa"}>
                    <GoogleIcon size={16}/>
                    {gEmail}
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                      <path d="M1 1l5 5 5-5" stroke="#5f6368" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>

                <div style={{ position: "relative" }}>
                  <input
                    ref={gPassRef}
                    type={gShowPass ? "text" : "password"}
                    value={gPassword}
                    onChange={e => { setGPassword(e.target.value); setGPassErr(""); }}
                    onKeyDown={e => e.key === "Enter" && completeGoogle()}
                    placeholder="Ingresa tu contraseña"
                    style={{
                      ...G.input,
                      paddingRight: 80,
                      borderColor: gPassErr ? "#d93025" : "#dadce0",
                    }}
                    onFocus={e => e.target.style.borderColor = gPassErr ? "#d93025" : "#1a73e8"}
                    onBlur={e => e.target.style.borderColor = gPassErr ? "#d93025" : "#dadce0"}
                  />
                  <button onClick={() => setGShowPass(v => !v)}
                    style={{
                      position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                      background: "none", border: "none", cursor: "pointer",
                      font: "500 13px/1 Arial, sans-serif", color: "#1a73e8", padding: "4px 6px",
                    }}>
                    {gShowPass ? "Ocultar" : "Mostrar"}
                  </button>
                </div>
                {gPassErr && (
                  <p style={{ font: "400 12px/1.4 Arial, sans-serif", color: "#d93025", margin: "6px 0 0", display: "flex", alignItems: "center", gap: 4 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="#d93025"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                    {gPassErr}
                  </p>
                )}

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 32 }}>
                  <button style={G.link}
                    onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
                    onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}>
                    ¿Olvidaste tu contraseña?
                  </button>
                  <button onClick={completeGoogle} disabled={loading} style={{ ...G.btnPrimary, opacity: loading ? 0.6 : 1 }}
                    onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "#1765cc"; }}
                    onMouseLeave={e => e.currentTarget.style.background = "#1a73e8"}>
                    {loading ? "Verificando…" : "Siguiente"}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Google footer */}
          <div style={{ background: "#f8f9fa", borderTop: "1px solid #e0e0e0", padding: "14px 44px", display: "flex", justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: 16 }}>
              {["Español (México)", "Ayuda", "Privacidad", "Términos"].map((t, i) => (
                <span key={i} style={{ font: "400 11px/1 Arial, sans-serif", color: "#5f6368", cursor: "pointer" }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── SLIDE PANEL — all other steps ──────────────────────────────────────
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 500, display: "flex", justifyContent: "flex-end" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgb(0 0 0 / 0.62)", backdropFilter: "blur(3px)", animation: "lt-fade-in .2s ease" }}/>

      <div style={{
        position: "relative", width: 420, height: "100%",
        background: "#0d0d11", borderLeft: "1px solid var(--border)",
        display: "flex", flexDirection: "column",
        animation: "lt-slide-in .26s var(--ease-out)",
        overflowY: "auto",
      }}>
        {/* Header */}
        <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", background: "linear-gradient(135deg, #0d0d11, #14141a)", flexShrink: 0 }}>
          <Logo size={18}/>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--fg-3)", cursor: "pointer", padding: 6, borderRadius: 6, display: "flex" }}>
            <Icon name="close" size={17}/>
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, padding: "28px 24px 40px" }}>

          {/* ── MAIN ── */}
          {step === "main" && (
            <>
              <h2 style={{ font: "800 23px/1.1 var(--font-display)", letterSpacing: "-0.035em", marginBottom: 8 }}>
                Bienvenido a <span style={{ color: "var(--brand-red)" }}>Life Tech</span>
              </h2>
              <p style={{ font: "400 13px/1.55 var(--font-sans)", color: "var(--fg-2)", marginBottom: 28 }}>
                Ingresa para guardar favoritos, ver historial de pedidos y comprar de forma segura.
              </p>

              <button onClick={() => setStep("google-email")} style={{
                width: "100%", height: 46, borderRadius: 10,
                border: "1px solid var(--border)", background: "var(--surface)",
                color: "var(--fg)", font: "600 14px/1 var(--font-sans)",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                transition: "background .15s, border-color .15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "var(--surface-2)"; e.currentTarget.style.borderColor = "var(--border-strong)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "var(--surface)"; e.currentTarget.style.borderColor = "var(--border)"; }}>
                <GoogleIcon/>
                Continuar con Google
              </button>

              <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "22px 0" }}>
                <div style={{ flex: 1, height: 1, background: "var(--border)" }}/>
                <span style={{ font: "400 11px/1 var(--font-sans)", color: "var(--fg-3)", whiteSpace: "nowrap" }}>o continúa con email</span>
                <div style={{ flex: 1, height: 1, background: "var(--border)" }}/>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <button onClick={() => { setIsRegister(false); setStep("email"); setFormErr(""); }} className="lt-btn lt-btn--primary lt-btn--block">Iniciar sesión</button>
                <button onClick={() => { setIsRegister(true);  setStep("email"); setFormErr(""); }} className="lt-btn lt-btn--secondary lt-btn--block">Crear una cuenta</button>
              </div>

              <div style={{ marginTop: 24, padding: "12px 14px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, display: "flex", gap: 10, alignItems: "flex-start" }}>
                <Icon name="shield" size={14} style={{ color: "var(--neon-lime)", marginTop: 2, flexShrink: 0 }}/>
                <p style={{ font: "400 11px/1.5 var(--font-sans)", color: "var(--fg-3)", margin: 0 }}>
                  Tus datos están protegidos. Nunca compartimos tu información sin tu consentimiento.
                </p>
              </div>
            </>
          )}

          {/* ── NICKNAME (post-Google) ── */}
          {step === "nickname" && (
            <>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, marginBottom: 28, textAlign: "center" }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#4285f4", color: "#fff", font: "700 22px/1 var(--font-sans)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {gEmail.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div style={{ font: "600 14px/1 var(--font-sans)", color: "var(--fg)" }}>{gEmail}</div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgb(52 168 83 / 0.12)", border: "1px solid rgb(52 168 83 / 0.3)", borderRadius: 999, padding: "4px 12px", marginTop: 8 }}>
                    <Icon name="check" size={11} style={{ color: "#34a853" }}/>
                    <span style={{ font: "600 11px/1 var(--font-sans)", color: "#34a853" }}>Verificado con Google</span>
                  </div>
                </div>
              </div>

              <h2 style={{ font: "800 20px/1.2 var(--font-display)", letterSpacing: "-0.03em", marginBottom: 6 }}>Elige tu nickname</h2>
              <p style={{ font: "400 13px/1.5 var(--font-sans)", color: "var(--fg-2)", marginBottom: 18 }}>Con este nombre te identificarán otros gamers en Life Tech.</p>

              <div style={{ position: "relative", marginBottom: 10 }}>
                <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--fg-3)", font: "600 15px/1 var(--font-mono)", pointerEvents: "none" }}>@</span>
                <input
                  style={{ ...inputSt, height: 48, paddingLeft: 30, font: "600 15px/1 var(--font-mono)" }}
                  placeholder="tu_nickname"
                  value={nickname}
                  onChange={e => { setNickname(e.target.value.replace(/\s/g, "_").replace(/^@/, "")); setNickErr(""); }}
                  onKeyDown={e => e.key === "Enter" && confirmNickname()}
                  autoFocus
                />
              </div>
              {nickErr && <div style={{ font: "400 12px/1 var(--font-sans)", color: "var(--brand-red)", display: "flex", alignItems: "center", gap: 5, marginBottom: 10 }}><Icon name="close" size={11}/>{nickErr}</div>}
              <button onClick={confirmNickname} disabled={loading} className="lt-btn lt-btn--primary lt-btn--block" style={{ opacity: loading ? 0.6 : 1 }}>
                {loading ? "Guardando…" : "Confirmar y entrar"}
              </button>
              <p style={{ font: "400 11px/1.5 var(--font-sans)", color: "var(--fg-3)", marginTop: 14, textAlign: "center" }}>Puedes cambiar tu nickname desde la configuración de tu perfil.</p>
            </>
          )}

          {/* ── EMAIL form ── */}
          {step === "email" && (
            <>
              <button onClick={() => { setStep("main"); setFormErr(""); }}
                style={{ background: "none", border: "none", color: "var(--fg-3)", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, font: "400 12px/1 var(--font-sans)", padding: 0, marginBottom: 22 }}>
                <Icon name="arrowL" size={13}/>Volver
              </button>

              <h2 style={{ font: "800 21px/1.1 var(--font-display)", letterSpacing: "-0.03em", marginBottom: 6 }}>
                {isRegister ? "Crear cuenta" : "Iniciar sesión"}
              </h2>
              <p style={{ font: "400 13px/1.4 var(--font-sans)", color: "var(--fg-2)", marginBottom: 24 }}>
                {isRegister ? "Únete a la comunidad Life Tech." : "Accede a tu cuenta Life Tech."}
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {isRegister && (
                  <div>
                    <label style={labelSt}>Nickname</label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--fg-3)", font: "400 13px/1 var(--font-mono)", pointerEvents: "none" }}>@</span>
                      <input style={{ ...inputSt, paddingLeft: 28 }} placeholder="tu_nickname" value={emailNick} onChange={e => setEmailNick(e.target.value.replace(/\s/g, "_").replace(/^@/, ""))}/>
                    </div>
                  </div>
                )}
                <div>
                  <label style={labelSt}>Email</label>
                  <input style={inputSt} type="email" placeholder="tu@email.com" value={email} onChange={e => setEmail(e.target.value)}/>
                </div>
                <div>
                  <label style={labelSt}>Contraseña</label>
                  <input style={inputSt} type="password" placeholder={isRegister ? "Mínimo 6 caracteres" : "••••••••"} value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && submitEmail()}/>
                  {isRegister && (
                    <div style={{ display: "flex", gap: 4, marginTop: 7 }}>
                      {[1, 2, 3].map(i => <div key={i} style={{ flex: 1, height: 3, borderRadius: 999, background: pw3 >= i ? pwC : "var(--border)", transition: "background .3s" }}/>)}
                    </div>
                  )}
                </div>
                {formErr && <div style={{ font: "400 12px/1 var(--font-sans)", color: "var(--brand-red)", display: "flex", alignItems: "center", gap: 5 }}><Icon name="close" size={11}/>{formErr}</div>}
                <button onClick={submitEmail} disabled={loading} className="lt-btn lt-btn--primary lt-btn--block" style={{ marginTop: 2, opacity: loading ? 0.6 : 1 }}>
                  {loading ? "Verificando…" : isRegister ? "Crear mi cuenta" : "Ingresar"}
                </button>
              </div>

              <p style={{ font: "400 12px/1 var(--font-sans)", color: "var(--fg-3)", marginTop: 18, textAlign: "center" }}>
                {isRegister ? "¿Ya tienes cuenta? " : "¿No tienes cuenta? "}
                <a onClick={() => { setIsRegister(!isRegister); setFormErr(""); }} style={{ color: "var(--brand-red)", cursor: "pointer", fontWeight: 600 }}>
                  {isRegister ? "Inicia sesión" : "Regístrate"}
                </a>
              </p>

              <div style={{ marginTop: 18, paddingTop: 18, borderTop: "1px solid var(--border)" }}>
                <button onClick={() => setStep("google-email")} style={{
                  width: "100%", height: 40, borderRadius: 8,
                  border: "1px solid var(--border)", background: "transparent",
                  color: "var(--fg-2)", font: "500 12px/1 var(--font-sans)",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  transition: "background .15s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "var(--surface)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <GoogleIcon size={16}/>
                  O continúa con Google
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

window.AuthPanel = AuthPanel;
