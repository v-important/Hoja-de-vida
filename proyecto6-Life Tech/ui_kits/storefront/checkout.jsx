// checkout.jsx — Flujo de pago con formularios funcionales

// ── Helpers ──────────────────────────────────────────────────────────────────
function Row({ k, v }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", color: "var(--fg-2)", fontSize: 13 }}>
      <span>{k}</span>
      <span style={{ color: "var(--fg)", fontWeight: 500 }}>{v}</span>
    </div>
  );
}

function CheckoutCard({ title, children }) {
  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 24 }}>
      <h3 style={{ font: "700 18px/1 var(--font-sans)", letterSpacing: "-0.01em", marginBottom: 20 }}>{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div className="lt-field">
      <label>{label}</label>
      {children}
      {error && (
        <span style={{ font: "400 11px/1 var(--font-sans)", color: "var(--brand-red)" }}>{error}</span>
      )}
    </div>
  );
}

// ── Selector de tipo de dirección / etiqueta ──────────────────────────────────
function LabelPicker({ value, onChange }) {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      {["Casa", "Oficina", "Otro"].map(l => (
        <button
          key={l}
          type="button"
          onClick={() => onChange(l)}
          style={{
            flex: 1, height: 36, borderRadius: 8, cursor: "pointer",
            border: `1px solid ${value === l ? "var(--brand-red)" : "var(--border)"}`,
            background: value === l ? "rgb(239 43 43 / 0.10)" : "transparent",
            color: value === l ? "var(--fg)" : "var(--fg-3)",
            font: "600 12px/1 var(--font-sans)",
            transition: "all .15s",
          }}
        >{l}</button>
      ))}
    </div>
  );
}

// ── Formulario de nueva dirección ─────────────────────────────────────────────
function AddressForm({ onSave, onCancel }) {
  const [form, setForm] = React.useState({
    label: "Casa", name: "", line1: "", city: "Bogotá",
    state: "Cundinamarca", zip: "", country: "Colombia",
  });
  const [errors, setErrors] = React.useState({});

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())  e.name  = "Campo requerido";
    if (!form.line1.trim()) e.line1 = "Campo requerido";
    if (!form.city.trim())  e.city  = "Campo requerido";
    if (!form.zip.trim())   e.zip   = "Campo requerido";
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    onSave({ ...form, id: Date.now(), default: false });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, animation: "lt-fade-in .2s ease" }}>

      <LabelPicker value={form.label} onChange={v => set("label", v)}/>

      <Field label="Nombre completo" error={errors.name}>
        <input
          className="lt-input"
          placeholder="Juan García"
          value={form.name}
          onChange={e => set("name", e.target.value)}
        />
      </Field>

      <Field label="Dirección" error={errors.line1}>
        <input
          className="lt-input"
          placeholder="Calle 123 # 45-67, Apto 8B"
          value={form.line1}
          onChange={e => set("line1", e.target.value)}
        />
      </Field>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Field label="Ciudad" error={errors.city}>
          <input
            className="lt-input"
            value={form.city}
            onChange={e => set("city", e.target.value)}
          />
        </Field>
        <Field label="Departamento">
          <input
            className="lt-input"
            value={form.state}
            onChange={e => set("state", e.target.value)}
          />
        </Field>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Field label="Código postal" error={errors.zip}>
          <input
            className="lt-input"
            placeholder="110111"
            value={form.zip}
            onChange={e => set("zip", e.target.value.replace(/\D/g, "").slice(0, 7))}
          />
        </Field>
        <Field label="País">
          <input
            className="lt-input"
            value={form.country}
            onChange={e => set("country", e.target.value)}
          />
        </Field>
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
        <button
          onClick={handleSave}
          className="lt-btn lt-btn--primary lt-btn--block"
        >
          Guardar dirección <Icon name="check" size={15}/>
        </button>
        <button
          onClick={onCancel}
          className="lt-btn lt-btn--ghost"
          style={{ flexShrink: 0, padding: "0 18px" }}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

// ── Vista previa de tarjeta ───────────────────────────────────────────────────
function CardVisual({ number, name, exp }) {
  const digits = (number || "").replace(/\s/g, "");
  const brand =
    digits.startsWith("4") ? "VISA" :
    digits.startsWith("51") || digits.startsWith("52") ||
    digits.startsWith("53") || digits.startsWith("54") ||
    digits.startsWith("55") ? "MASTERCARD" :
    digits.startsWith("3") ? "AMEX" : "";

  const gradients = {
    VISA:       "linear-gradient(135deg, #1a1a3e 0%, #0f1e6b 100%)",
    MASTERCARD: "linear-gradient(135deg, #1a0a00 0%, #7b1c00 100%)",
    AMEX:       "linear-gradient(135deg, #003a1e 0%, #006c38 100%)",
    "":         "linear-gradient(135deg, #0f0f18 0%, #1e1e2e 100%)",
  };

  return (
    <div style={{
      width: "100%", height: 156, borderRadius: 14,
      background: gradients[brand],
      border: "1px solid var(--border-strong)",
      padding: "18px 22px",
      display: "flex", flexDirection: "column", justifyContent: "space-between",
      position: "relative", overflow: "hidden",
      boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
      transition: "all .3s ease",
    }}>
      {/* Glow orb */}
      <div style={{
        position: "absolute", right: -30, top: -30,
        width: 140, height: 140, borderRadius: "50%",
        background: brand === "VISA" ? "rgba(34,211,238,0.12)" :
                    brand === "MASTERCARD" ? "rgba(239,68,68,0.18)" :
                    brand === "AMEX" ? "rgba(34,197,94,0.14)" : "rgba(99,102,241,0.1)",
        pointerEvents: "none",
      }}/>
      <div style={{
        position: "absolute", left: -40, bottom: -40,
        width: 130, height: 130, borderRadius: "50%",
        background: "rgba(255,255,255,0.03)",
        pointerEvents: "none",
      }}/>

      {/* Fila superior: chip + marca */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative" }}>
        <div style={{
          width: 36, height: 26, borderRadius: 4,
          background: "linear-gradient(135deg, #f59e0b, #d97706)",
          border: "1px solid rgba(255,255,255,0.2)",
          boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
        }}/>
        {brand && (
          <span style={{ font: "800 13px/1 var(--font-mono)", color: "rgba(255,255,255,0.85)", letterSpacing: ".1em" }}>
            {brand}
          </span>
        )}
        {!brand && (
          <Icon name="card" size={20} style={{ color: "rgba(255,255,255,0.3)" }}/>
        )}
      </div>

      {/* Número */}
      <div style={{
        font: "500 17px/1 var(--font-mono)", letterSpacing: ".2em",
        color: number ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.2)",
        position: "relative",
        textShadow: "0 1px 4px rgba(0,0,0,0.4)",
      }}>
        {number || "•••• •••• •••• ••••"}
      </div>

      {/* Fila inferior: titular + vencimiento */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", position: "relative" }}>
        <div>
          <div style={{ font: "400 8px/1 var(--font-sans)", color: "rgba(255,255,255,0.4)", letterSpacing: ".12em", marginBottom: 4 }}>
            TITULAR
          </div>
          <div style={{ font: "600 11px/1 var(--font-mono)", color: name ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.25)", letterSpacing: ".05em" }}>
            {name || "NOMBRE APELLIDO"}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ font: "400 8px/1 var(--font-sans)", color: "rgba(255,255,255,0.4)", letterSpacing: ".12em", marginBottom: 4 }}>
            VENCE
          </div>
          <div style={{ font: "600 11px/1 var(--font-mono)", color: exp ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.25)" }}>
            {exp || "MM/AA"}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Formulario de nueva tarjeta ───────────────────────────────────────────────
function PaymentForm({ onSave, onCancel }) {
  const [form, setForm] = React.useState({ number: "", name: "", exp: "", cvv: "" });
  const [errors, setErrors] = React.useState({});

  const setField = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: "" }));
  };

  const fmtNumber = v => {
    const d = v.replace(/\D/g, "").slice(0, 16);
    return d.replace(/(.{4})/g, "$1 ").trim();
  };

  const fmtExp = v => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    if (d.length > 2) return `${d.slice(0, 2)}/${d.slice(2)}`;
    return d;
  };

  const detectBrand = n => {
    const d = n.replace(/\s/g, "");
    if (d.startsWith("4")) return "Visa";
    if (/^5[1-5]/.test(d)) return "Mastercard";
    if (d.startsWith("3")) return "Amex";
    return "Tarjeta";
  };

  const validate = () => {
    const e = {};
    if (form.number.replace(/\s/g, "").length < 16) e.number = "Número inválido (16 dígitos)";
    if (!form.name.trim())  e.name = "Campo requerido";
    if (form.exp.length < 5) e.exp  = "Fecha inválida (MM/AA)";
    if (form.cvv.length < 3) e.cvv  = "CVV inválido";
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    const digits = form.number.replace(/\s/g, "");
    onSave({
      id: Date.now(),
      brand: detectBrand(form.number),
      last4: digits.slice(-4),
      exp: form.exp,
      holderName: form.name,
      default: false,
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, animation: "lt-fade-in .2s ease" }}>

      {/* Vista previa */}
      <CardVisual number={form.number} name={form.name} exp={form.exp}/>

      <Field label="Número de tarjeta" error={errors.number}>
        <input
          className="lt-input"
          placeholder="1234 5678 9012 3456"
          value={form.number}
          maxLength={19}
          onChange={e => setField("number", fmtNumber(e.target.value))}
          style={{ fontFamily: "var(--font-mono)", letterSpacing: ".08em" }}
        />
      </Field>

      <Field label="Nombre en la tarjeta" error={errors.name}>
        <input
          className="lt-input"
          placeholder="JUAN GARCIA"
          value={form.name}
          onChange={e => setField("name", e.target.value.toUpperCase())}
          style={{ fontFamily: "var(--font-mono)", letterSpacing: ".06em" }}
        />
      </Field>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Field label="Vencimiento" error={errors.exp}>
          <input
            className="lt-input"
            placeholder="MM/AA"
            value={form.exp}
            maxLength={5}
            onChange={e => setField("exp", fmtExp(e.target.value))}
            style={{ fontFamily: "var(--font-mono)" }}
          />
        </Field>
        <Field label="CVV" error={errors.cvv}>
          <input
            className="lt-input"
            placeholder="•••"
            type="password"
            value={form.cvv}
            maxLength={4}
            onChange={e => setField("cvv", e.target.value.replace(/\D/g, "").slice(0, 4))}
            style={{ fontFamily: "var(--font-mono)" }}
          />
        </Field>
      </div>

      {/* Badge seguridad */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "10px 12px", borderRadius: 8,
        background: "rgb(182 255 60 / 0.06)",
        border: "1px solid rgb(182 255 60 / 0.2)",
      }}>
        <Icon name="shield" size={14} style={{ color: "var(--neon-lime)", flexShrink: 0 }}/>
        <span style={{ font: "400 11px/1.4 var(--font-sans)", color: "var(--fg-3)" }}>
          Tus datos van cifrados con TLS 256-bit. El CVV nunca se almacena.
        </span>
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
        <button
          onClick={handleSave}
          className="lt-btn lt-btn--primary lt-btn--block"
        >
          Añadir tarjeta <Icon name="check" size={15}/>
        </button>
        <button
          onClick={onCancel}
          className="lt-btn lt-btn--ghost"
          style={{ flexShrink: 0, padding: "0 18px" }}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

// ── Pantalla principal de checkout ────────────────────────────────────────────
function CheckoutScreen({ cart, products, account, onBack, onComplete }) {
  const [step, setStep] = React.useState(1);

  // Estado local de direcciones y tarjetas (arranca vacío)
  const [addresses,    setAddresses]    = React.useState([]);
  const [cards,        setCards]        = React.useState([]);
  const [selectedAddr, setSelectedAddr] = React.useState(null);
  const [selectedCard, setSelectedCard] = React.useState(null);

  // Control de formularios inline
  const [showAddrForm, setShowAddrForm] = React.useState(false);
  const [showCardForm, setShowCardForm] = React.useState(false);

  // Líneas del pedido
  const lines = (cart || [])
    .map(i => ({ ...i, p: products.find(p => p.id === i.id) }))
    .filter(l => l.p);

  const subtotal = lines.reduce((s, l) => s + (l.p.price || 0) * l.q, 0);
  const shipping = subtotal >= 999 ? 0 : 99;
  const tax      = Math.round(subtotal * 0.19);
  const total    = subtotal + shipping + tax;

  const addAddress = (addr) => {
    const isFirst = addresses.length === 0;
    setAddresses(a => [...a, { ...addr, default: isFirst }]);
    if (isFirst) setSelectedAddr(addr.id);
    setShowAddrForm(false);
  };

  const addCard = (card) => {
    const isFirst = cards.length === 0;
    setCards(c => [...c, { ...card, default: isFirst }]);
    if (isFirst) setSelectedCard(card.id);
    setShowCardForm(false);
  };

  // Validación de pasos
  const canContinue =
    (step === 1 && selectedAddr !== null) ||
    (step === 2 && selectedCard !== null) ||
    step === 3;

  const handleContinue = () => {
    if (canContinue) setStep(s => s + 1);
  };

  return (
    <section className="lt-section" style={{ paddingTop: 32 }}>
      <div className="lt-section-inner">

        {/* Back */}
        <a onClick={onBack} style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--fg-3)", fontSize: 13, cursor: "pointer", marginBottom: 24 }}>
          <Icon name="arrowL" size={14}/> Seguir comprando
        </a>

        <h1 style={{ font: "900 44px/1 var(--font-display)", letterSpacing: "-0.04em", marginBottom: 8 }}>Checkout</h1>
        <p style={{ color: "var(--fg-2)", marginBottom: 32 }}>Tres pasos. Sin sorpresas.</p>

        {/* Stepper */}
        <div style={{ display: "flex", gap: 12, marginBottom: 32 }}>
          {["Envío", "Pago", "Revisar"].map((s, i) => (
            <div key={s} style={{
              flex: 1, padding: "12px 16px",
              border: `1px solid ${step >= i + 1 ? "var(--brand-red)" : "var(--border)"}`,
              borderRadius: 10,
              display: "flex", alignItems: "center", gap: 10,
              background: step === i + 1 ? "rgb(239 43 43 / 0.08)" : "transparent",
              transition: "all .2s",
            }}>
              <span style={{
                width: 24, height: 24, borderRadius: 999, flexShrink: 0,
                background: step >= i + 1 ? "var(--brand-red)" : "var(--surface-2)",
                color: step >= i + 1 ? "#fff" : "var(--fg-3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 700,
              }}>
                {step > i + 1 ? <Icon name="check" size={12}/> : i + 1}
              </span>
              <span style={{ font: "600 13px/1 var(--font-sans)", color: step >= i + 1 ? "var(--fg)" : "var(--fg-3)" }}>
                {s}
              </span>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 32, alignItems: "flex-start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

            {/* ── PASO 1: DIRECCIÓN ─────────────────────────────────── */}
            {step === 1 && (
              <CheckoutCard title="Dirección de envío">

                {/* Lista de direcciones guardadas */}
                {addresses.length > 0 && !showAddrForm && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                    {addresses.map(a => {
                      const sel = selectedAddr === a.id;
                      return (
                        <div
                          key={a.id}
                          onClick={() => setSelectedAddr(a.id)}
                          style={{
                            display: "flex", alignItems: "flex-start", gap: 12,
                            padding: 14, borderRadius: 10, cursor: "pointer",
                            border: `1px solid ${sel ? "var(--brand-red)" : "var(--border)"}`,
                            background: sel ? "rgb(239 43 43 / 0.06)" : "var(--surface-2)",
                            transition: "all .15s",
                          }}
                        >
                          {/* Radio */}
                          <span style={{
                            width: 18, height: 18, borderRadius: 999, marginTop: 1, flexShrink: 0,
                            border: `2px solid ${sel ? "var(--brand-red)" : "var(--border-strong)"}`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}>
                            {sel && <span style={{ width: 8, height: 8, borderRadius: 999, background: "var(--brand-red)" }}/>}
                          </span>
                          <div style={{ flex: 1 }}>
                            <div style={{ font: "600 13px/1.2 var(--font-sans)", color: "var(--fg)" }}>
                              {a.label}
                              {a.default && (
                                <span className="lt-overline" style={{ color: "var(--brand-red)", marginLeft: 8 }}>Predeterminada</span>
                              )}
                            </div>
                            <div style={{ color: "var(--fg-2)", fontSize: 13, marginTop: 3 }}>{a.line1}</div>
                            <div style={{ color: "var(--fg-3)", fontSize: 12, marginTop: 2 }}>
                              {a.city}, {a.state} · CP {a.zip} · {a.country}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Estado vacío — ninguna dirección */}
                {addresses.length === 0 && !showAddrForm && (
                  <div style={{
                    padding: "28px 20px", textAlign: "center",
                    border: "1px dashed var(--border)", borderRadius: 10,
                    background: "var(--surface-2)", marginBottom: 16,
                  }}>
                    <Icon name="mapPin" size={28} style={{ color: "var(--fg-4)", marginBottom: 10 }}/>
                    <div style={{ font: "600 14px/1 var(--font-sans)", color: "var(--fg-2)", marginBottom: 6 }}>
                      No tienes direcciones guardadas
                    </div>
                    <div style={{ font: "400 12px/1.4 var(--font-sans)", color: "var(--fg-4)" }}>
                      Añade una dirección para continuar con tu pedido.
                    </div>
                  </div>
                )}

                {/* Formulario inline */}
                {showAddrForm && (
                  <div style={{ marginBottom: 8 }}>
                    <AddressForm
                      onSave={addAddress}
                      onCancel={() => setShowAddrForm(false)}
                    />
                  </div>
                )}

                {/* Botón añadir */}
                {!showAddrForm && (
                  <button
                    onClick={() => setShowAddrForm(true)}
                    style={{
                      display: "flex", alignItems: "center", gap: 7,
                      background: "none", border: "none",
                      color: "var(--brand-red)", font: "600 13px/1 var(--font-sans)",
                      cursor: "pointer", padding: "4px 0",
                      transition: "opacity .15s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = "0.75"}
                    onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                  >
                    <Icon name="plus" size={14}/>
                    Añadir {addresses.length > 0 ? "otra dirección" : "dirección"}
                  </button>
                )}
              </CheckoutCard>
            )}

            {/* ── PASO 2: PAGO ──────────────────────────────────────── */}
            {step === 2 && (
              <CheckoutCard title="Método de pago">

                {/* Lista de tarjetas guardadas */}
                {cards.length > 0 && !showCardForm && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                    {cards.map(c => {
                      const sel = selectedCard === c.id;
                      return (
                        <div
                          key={c.id}
                          onClick={() => setSelectedCard(c.id)}
                          style={{
                            display: "flex", alignItems: "center", gap: 12,
                            padding: 14, borderRadius: 10, cursor: "pointer",
                            border: `1px solid ${sel ? "var(--brand-red)" : "var(--border)"}`,
                            background: sel ? "rgb(239 43 43 / 0.06)" : "var(--surface-2)",
                            transition: "all .15s",
                          }}
                        >
                          {/* Radio */}
                          <span style={{
                            width: 18, height: 18, borderRadius: 999, flexShrink: 0,
                            border: `2px solid ${sel ? "var(--brand-red)" : "var(--border-strong)"}`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}>
                            {sel && <span style={{ width: 8, height: 8, borderRadius: 999, background: "var(--brand-red)" }}/>}
                          </span>
                          <Icon name="card" size={18} style={{ color: "var(--fg-3)" }}/>
                          <div style={{ flex: 1 }}>
                            <div style={{ font: "600 13px/1.2 var(--font-sans)" }}>
                              {c.brand} ···· {c.last4}
                            </div>
                            <div style={{ color: "var(--fg-3)", fontSize: 12, marginTop: 2 }}>
                              {c.holderName} · Vence {c.exp}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Estado vacío — ninguna tarjeta */}
                {cards.length === 0 && !showCardForm && (
                  <div style={{
                    padding: "28px 20px", textAlign: "center",
                    border: "1px dashed var(--border)", borderRadius: 10,
                    background: "var(--surface-2)", marginBottom: 16,
                  }}>
                    <Icon name="card" size={28} style={{ color: "var(--fg-4)", marginBottom: 10 }}/>
                    <div style={{ font: "600 14px/1 var(--font-sans)", color: "var(--fg-2)", marginBottom: 6 }}>
                      No tienes tarjetas guardadas
                    </div>
                    <div style={{ font: "400 12px/1.4 var(--font-sans)", color: "var(--fg-4)" }}>
                      Añade una tarjeta para completar tu compra.
                    </div>
                  </div>
                )}

                {/* Formulario inline */}
                {showCardForm && (
                  <div style={{ marginBottom: 8 }}>
                    <PaymentForm
                      onSave={addCard}
                      onCancel={() => setShowCardForm(false)}
                    />
                  </div>
                )}

                {/* Botón añadir tarjeta */}
                {!showCardForm && (
                  <button
                    onClick={() => setShowCardForm(true)}
                    style={{
                      display: "flex", alignItems: "center", gap: 7,
                      background: "none", border: "none",
                      color: "var(--brand-red)", font: "600 13px/1 var(--font-sans)",
                      cursor: "pointer", padding: "4px 0",
                      transition: "opacity .15s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = "0.75"}
                    onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                  >
                    <Icon name="plus" size={14}/>
                    {cards.length > 0 ? "Añadir otra tarjeta" : "Añadir tarjeta"}
                  </button>
                )}

                {/* Badge seguridad general */}
                {!showCardForm && (
                  <div style={{ marginTop: 16, padding: "10px 12px", background: "var(--surface-2)", border: "1px dashed var(--border)", borderRadius: 10, display: "flex", gap: 10, alignItems: "center" }}>
                    <Icon name="shield" size={16} style={{ color: "var(--neon-lime)", flexShrink: 0 }}/>
                    <div>
                      <div style={{ font: "600 12px/1.2 var(--font-sans)" }}>Pago protegido</div>
                      <div style={{ color: "var(--fg-3)", fontSize: 11, marginTop: 2 }}>Cifrado de extremo a extremo · Stripe</div>
                    </div>
                  </div>
                )}
              </CheckoutCard>
            )}

            {/* ── PASO 3: REVISAR ───────────────────────────────────── */}
            {step === 3 && (
              <CheckoutCard title="Revisar pedido">
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {lines.map(l => (
                    <div key={l.id} style={{ display: "flex", gap: 14, padding: 12, background: "var(--surface-2)", borderRadius: 10 }}>
                      <div style={{ width: 60, height: 60, background: "linear-gradient(180deg,#0c0c0f,#050506)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <ProductImg shape={l.p.shape} size={56} imageUrl={l.p.imageUrl}/>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ font: "600 13px/1.2 var(--font-sans)" }}>{l.p.name}</div>
                        <div style={{ color: "var(--fg-3)", fontSize: 11, marginTop: 2 }}>{l.p.brand} · Cantidad: {l.q}</div>
                      </div>
                      <span style={{ font: "700 14px/1 var(--font-sans)", alignSelf: "center" }}>
                        ${((l.p.price || 0) * l.q).toLocaleString("en-US")}
                      </span>
                    </div>
                  ))}

                  {/* Resumen de envío y pago seleccionados */}
                  <div style={{ marginTop: 8, padding: "12px 14px", background: "var(--surface-2)", borderRadius: 10, display: "flex", flexDirection: "column", gap: 8 }}>
                    {selectedAddr !== null && (() => {
                      const a = addresses.find(x => x.id === selectedAddr);
                      return a ? (
                        <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                          <Icon name="mapPin" size={14} style={{ color: "var(--fg-4)", marginTop: 1, flexShrink: 0 }}/>
                          <div>
                            <div style={{ font: "600 12px/1 var(--font-sans)", color: "var(--fg-2)", marginBottom: 2 }}>Envío a</div>
                            <div style={{ font: "400 12px/1.4 var(--font-sans)", color: "var(--fg-3)" }}>
                              {a.line1}, {a.city} · CP {a.zip}
                            </div>
                          </div>
                        </div>
                      ) : null;
                    })()}
                    {selectedCard !== null && (() => {
                      const c = cards.find(x => x.id === selectedCard);
                      return c ? (
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          <Icon name="card" size={14} style={{ color: "var(--fg-4)", flexShrink: 0 }}/>
                          <div style={{ font: "400 12px/1 var(--font-sans)", color: "var(--fg-3)" }}>
                            {c.brand} ···· {c.last4} · Vence {c.exp}
                          </div>
                        </div>
                      ) : null;
                    })()}
                  </div>
                </div>
              </CheckoutCard>
            )}
          </div>

          {/* ── Resumen lateral ──────────────────────────────────────── */}
          <aside style={{
            position: "sticky", top: 80,
            background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: 12, padding: 20,
            display: "flex", flexDirection: "column", gap: 12,
          }}>
            <h4 style={{ font: "700 16px/1 var(--font-sans)", marginBottom: 4 }}>Resumen</h4>

            <Row k={`Subtotal (${lines.length})`} v={`$${subtotal.toLocaleString("en-US")}`}/>
            <Row k="Envío" v={shipping === 0
              ? <span style={{ color: "var(--neon-lime)" }}>Gratis 🚚</span>
              : `$${shipping.toLocaleString("en-US")}`}
            />
            <Row k="IVA (19%)" v={`$${tax.toLocaleString("en-US")}`}/>
            <hr style={{ border: 0, borderTop: "1px solid var(--border)", margin: "4px 0" }}/>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ font: "600 14px/1 var(--font-sans)" }}>Total</span>
              <span style={{ font: "900 28px/1 var(--font-display)", letterSpacing: "-0.03em" }}>
                ${total.toLocaleString("en-US")}
              </span>
            </div>

            {/* Puntos */}
            <div style={{ display: "flex", gap: 8, padding: 10, background: "rgb(34 211 238 / 0.08)", border: "1px solid rgb(34 211 238 / 0.25)", borderRadius: 8 }}>
              <Icon name="ai" size={14} style={{ color: "var(--neon-cyan)", flexShrink: 0, marginTop: 1 }}/>
              <span style={{ fontSize: 12, color: "var(--fg-2)", lineHeight: 1.4 }}>
                Ganarás <span style={{ color: "var(--neon-cyan)", fontWeight: 600 }}>{Math.round(total / 10)} pts</span> con esta compra.
              </span>
            </div>

            {/* Botón continuar / pagar */}
            {step < 3 ? (
              <>
                <button
                  onClick={handleContinue}
                  disabled={!canContinue}
                  className="lt-btn lt-btn--primary lt-btn--lg lt-btn--block"
                  style={!canContinue ? { opacity: 0.4, cursor: "not-allowed", transform: "none", boxShadow: "none" } : {}}
                >
                  Continuar <Icon name="arrowR" size={16}/>
                </button>
                {!canContinue && (
                  <p style={{ font: "400 11px/1.4 var(--font-sans)", color: "var(--fg-4)", textAlign: "center", margin: "0" }}>
                    {step === 1 ? "Añade y selecciona una dirección para continuar" : "Añade y selecciona una tarjeta para continuar"}
                  </p>
                )}
              </>
            ) : (
              <button
                onClick={onComplete}
                className="lt-btn lt-btn--primary lt-btn--lg lt-btn--block"
              >
                Pagar ${total.toLocaleString("en-US")} <Icon name="check" size={16}/>
              </button>
            )}

            {step > 1 && (
              <button onClick={() => setStep(s => s - 1)} className="lt-btn lt-btn--ghost lt-btn--block">
                Atrás
              </button>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}

window.CheckoutScreen = CheckoutScreen;
