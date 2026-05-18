// account.jsx — Panel de cuenta con pestañas: Overview · Mis pedidos · Favoritos · Configuración

// ── Helpers locales ───────────────────────────────────────────────────────────
function ACard({ title, children, action }) {
  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 24 }}>
      {title && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <h3 style={{ font: "700 16px/1 var(--font-sans)", letterSpacing: "-0.01em" }}>{title}</h3>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

function SectionTitle({ eyebrow, title }) {
  return (
    <div>
      {eyebrow && <span className="lt-overline" style={{ color: "var(--fg-3)" }}>{eyebrow}</span>}
      <h1 style={{ font: "900 36px/1 var(--font-display)", letterSpacing: "-0.04em", marginTop: eyebrow ? 8 : 0 }}>{title}</h1>
    </div>
  );
}

function Toggle({ on, onChange }) {
  return (
    <div
      onClick={onChange}
      style={{
        width: 42, height: 24, borderRadius: 999, cursor: "pointer", flexShrink: 0,
        background: on ? "var(--brand-red)" : "var(--surface-3)",
        position: "relative", transition: "background .2s",
        boxShadow: on ? "0 0 10px -2px var(--brand-red-glow)" : "none",
      }}
    >
      <span style={{
        position: "absolute", top: 4, left: on ? 22 : 4,
        width: 16, height: 16, borderRadius: 999,
        background: "#fff",
        transition: "left .2s var(--ease-out)",
        boxShadow: "0 1px 4px rgba(0,0,0,0.35)",
      }}/>
    </div>
  );
}

function KPI({ label, value, sub, accent }) {
  return (
    <div style={{
      background: "var(--surface)",
      border: `1px solid ${accent ? "var(--brand-red)" : "var(--border)"}`,
      boxShadow: accent ? "var(--shadow-glow-red)" : "none",
      borderRadius: 12, padding: 18,
    }}>
      <span className="lt-overline" style={{ color: "var(--fg-3)" }}>{label}</span>
      <div style={{
        font: "900 30px/1 var(--font-display)", letterSpacing: "-0.03em",
        marginTop: 8, color: accent ? "var(--brand-red)" : "var(--fg)",
      }}>{value}</div>
      {sub && <div style={{ color: "var(--fg-3)", fontSize: 12, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    "entregado":  { tone: "lime", label: "Entregado" },
    "en camino":  { tone: "red",  label: "En camino" },
    "procesando": { tone: "warn", label: "Procesando" },
    "cancelado":  { tone: "ghost",label: "Cancelado" },
  };
  const s = map[(status || "").toLowerCase()] || { tone: "ghost", label: status };
  return <Badge tone={s.tone} dot={s.tone === "red"}>{s.label}</Badge>;
}

// ── TAB: OVERVIEW ─────────────────────────────────────────────────────────────
function OverviewTab({ account, authUser, products, favs, onOpen, onTab }) {
  const user    = authUser || {};
  const displayName = user.name || account.name || "Gamer";
  const firstName   = displayName.split(" ")[0];
  const tierVal     = user.tier || account.tier || "FREE";
  const pointsVal   = user.points ?? account.points ?? 0;
  const orders      = account.orders || [];
  const lastOrder   = orders[0];
  const favList     = products.filter(p => favs && favs.has(p.id)).slice(0, 3);

  return (
    <>
      {/* Saludo */}
      <div>
        <span className="lt-overline" style={{ color: "var(--fg-3)" }}>Tu cuenta</span>
        <h1 style={{ font: "900 42px/1 var(--font-display)", letterSpacing: "-0.04em", marginTop: 8 }}>
          Hola, {firstName} <span style={{ fontSize: 34 }}>👋</span>
        </h1>
        <p style={{ color: "var(--fg-2)", marginTop: 10, fontSize: 14 }}>
          Tienes {orders.length} pedido{orders.length !== 1 ? "s" : ""} con nosotros{favList.length > 0 ? ` y ${favs.size} favorito${favs.size !== 1 ? "s" : ""}` : ""}.
        </p>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
        <KPI label="Puntos LT"      value={pointsVal.toLocaleString("en-US")} sub="Úsalos en tu próximo pedido" accent/>
        <KPI label="Pedidos totales" value={orders.length}/>
        <KPI label="Tier"           value={tierVal} sub={tierVal === "Pro" ? "Envío express gratis" : "Sube a Pro por $999"}/>
      </div>

      {/* Último pedido */}
      {lastOrder && (
        <ACard
          title="Tu último pedido"
          action={<a onClick={() => onTab("orders")} style={{ font: "500 12px/1 var(--font-sans)", color: "var(--brand-red)", cursor: "pointer" }}>Ver todos</a>}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16, paddingBottom: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgb(239 43 43 / 0.12)", color: "var(--brand-red)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon name="truck" size={20}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <span style={{ font: "700 15px/1 var(--font-sans)" }}>#{lastOrder.id}</span>
                <StatusBadge status={lastOrder.status}/>
              </div>
              <div style={{ color: "var(--fg-3)", fontSize: 12 }}>
                {lastOrder.date} · ${(lastOrder.total || 0).toLocaleString("en-US")}
              </div>
            </div>
            <Button variant="secondary" onClick={() => onTab("orders")}>Ver detalles</Button>
          </div>
          {/* Barra de progreso del estado */}
          <div style={{ height: 5, background: "var(--surface-2)", borderRadius: 999, overflow: "hidden" }}>
            <div style={{
              width: lastOrder.status === "entregado" ? "100%" :
                     lastOrder.status === "en camino" ? "60%" : "25%",
              height: "100%",
              background: "linear-gradient(90deg, var(--brand-red), #ff3b3b)",
              borderRadius: 999, boxShadow: "0 0 10px -2px var(--brand-red-glow)",
              transition: "width .6s ease",
            }}/>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 11, color: "var(--fg-3)" }}>
            <span>Confirmado</span>
            <span style={{ color: lastOrder.status === "en camino" ? "var(--brand-red)" : "inherit" }}>En camino</span>
            <span style={{ color: lastOrder.status === "entregado" ? "var(--neon-lime)" : "inherit" }}>Entregado</span>
          </div>
        </ACard>
      )}

      {/* Favoritos preview */}
      {favList.length > 0 ? (
        <ACard
          title="Tus favoritos"
          action={<a onClick={() => onTab("favorites")} style={{ font: "500 12px/1 var(--font-sans)", color: "var(--brand-red)", cursor: "pointer" }}>Ver todos</a>}
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            {favList.map(p => (
              <div key={p.id} onClick={() => onOpen(p)} style={{ display: "flex", gap: 10, padding: 10, background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 10, cursor: "pointer", transition: "border-color .15s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "var(--brand-red)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
              >
                <div style={{ width: 48, height: 48, background: "linear-gradient(180deg,#0c0c0f,#050506)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <ProductImg shape={p.shape} size={42} imageUrl={p.imageUrl}/>
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ font: "600 12px/1.3 var(--font-sans)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                  <div style={{ font: "700 12px/1 var(--font-sans)", color: "var(--brand-red)", marginTop: 4 }}>${(p.price || 0).toLocaleString("en-US")}</div>
                </div>
              </div>
            ))}
          </div>
        </ACard>
      ) : (
        <ACard title="Tus favoritos">
          <div style={{ textAlign: "center", padding: "20px 0", color: "var(--fg-4)" }}>
            <Icon name="heart" size={28} style={{ marginBottom: 10 }}/>
            <div style={{ font: "500 13px/1 var(--font-sans)", color: "var(--fg-3)" }}>Aún no tienes favoritos.</div>
            <div style={{ font: "400 12px/1.4 var(--font-sans)", color: "var(--fg-4)", marginTop: 4 }}>
              Pulsa el ❤ en cualquier producto para guardarlo aquí.
            </div>
          </div>
        </ACard>
      )}
    </>
  );
}

// ── TAB: MIS PEDIDOS ──────────────────────────────────────────────────────────
function OrdersTab({ account, products }) {
  const orders = account.orders || [];

  if (orders.length === 0) {
    return (
      <>
        <SectionTitle eyebrow="Historial" title="Mis pedidos"/>
        <div style={{ textAlign: "center", padding: "60px 20px", border: "1px dashed var(--border)", borderRadius: 12, background: "var(--surface)" }}>
          <Icon name="package" size={36} style={{ color: "var(--fg-4)", marginBottom: 14 }}/>
          <div style={{ font: "600 15px/1 var(--font-sans)", color: "var(--fg-2)", marginBottom: 6 }}>Todavía no tienes pedidos</div>
          <div style={{ font: "400 13px/1.4 var(--font-sans)", color: "var(--fg-4)" }}>Cuando completes tu primera compra, aparecerá aquí.</div>
        </div>
      </>
    );
  }

  return (
    <>
      <SectionTitle eyebrow="Historial" title="Mis pedidos"/>
      <p style={{ color: "var(--fg-2)", fontSize: 13, marginTop: -8 }}>
        {orders.length} pedido{orders.length !== 1 ? "s" : ""} · todos en su lugar.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {orders.map(o => {
          const isActive = (o.status || "").toLowerCase() === "en camino";
          const lines = (o.items || [])
            .map(i => ({ ...i, p: products.find(p => p.id === i.id) }))
            .filter(l => l.p);

          return (
            <div key={o.id} style={{
              background: "var(--surface)",
              border: `1px solid ${isActive ? "var(--brand-red)" : "var(--border)"}`,
              boxShadow: isActive ? "var(--shadow-glow-red)" : "none",
              borderRadius: 12, padding: 20,
            }}>
              {/* Header del pedido */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5 }}>
                    <span style={{ font: "700 15px/1 var(--font-sans)" }}>#{o.id}</span>
                    <StatusBadge status={o.status}/>
                  </div>
                  <div style={{ color: "var(--fg-3)", fontSize: 12 }}>
                    Pedido el {o.date}
                    {o.eta ? ` · ETA ${o.eta.toLowerCase()}` : ""}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ font: "700 20px/1 var(--font-sans)" }}>${(o.total || 0).toLocaleString("en-US")}</div>
                  <a style={{ font: "400 11px/1 var(--font-sans)", color: "var(--brand-red)", cursor: "pointer" }}>Ver factura</a>
                </div>
              </div>

              {/* Productos del pedido o placeholder */}
              {lines.length > 0 ? (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
                  {lines.map(l => (
                    <div key={l.id} style={{ display: "flex", gap: 10, padding: "8px 12px", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8 }}>
                      <div style={{ width: 44, height: 44, background: "linear-gradient(180deg,#0c0c0f,#050506)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <ProductImg shape={l.p.shape} size={38} imageUrl={l.p.imageUrl}/>
                      </div>
                      <div>
                        <div style={{ font: "600 12px/1.2 var(--font-sans)", maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.p.name}</div>
                        <div style={{ font: "400 11px/1 var(--font-sans)", color: "var(--fg-3)", marginTop: 3 }}>×{l.q} · ${((l.p.price || 0) * l.q).toLocaleString("en-US")}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", background: "var(--surface-2)", borderRadius: 8, marginBottom: 16 }}>
                  <Icon name="package" size={14} style={{ color: "var(--fg-4)" }}/>
                  <span style={{ font: "400 12px/1 var(--font-sans)", color: "var(--fg-3)" }}>Detalles de artículos no disponibles</span>
                </div>
              )}

              {/* Barra progreso si está en camino */}
              {isActive && (
                <>
                  <div style={{ height: 5, background: "var(--surface-2)", borderRadius: 999, overflow: "hidden", marginBottom: 6 }}>
                    <div style={{ width: "60%", height: "100%", background: "linear-gradient(90deg, var(--brand-red), #ff3b3b)", borderRadius: 999, boxShadow: "0 0 10px -2px var(--brand-red-glow)" }}/>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--fg-3)", marginBottom: 14 }}>
                    <span>Confirmado</span><span style={{ color: "var(--brand-red)" }}>En camino</span><span>Entregado</span>
                  </div>
                </>
              )}

              {/* Acciones */}
              <div style={{ display: "flex", gap: 8 }}>
                {isActive && (
                  <Button variant="secondary"><Icon name="truck" size={14}/>Rastrear envío</Button>
                )}
                <Button variant="ghost">Volver a comprar</Button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

// ── TAB: FAVORITOS ────────────────────────────────────────────────────────────
function FavoritesTab({ products, favs, onFav, onAdd, onOpen }) {
  const favList = products.filter(p => favs && favs.has(p.id));
  const [added, setAdded] = React.useState(new Set());

  const handleAdd = (p) => {
    onAdd(p);
    setAdded(s => new Set(s).add(p.id));
    setTimeout(() => setAdded(s => { const n = new Set(s); n.delete(p.id); return n; }), 1500);
  };

  return (
    <>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <SectionTitle eyebrow="Mi lista" title="Favoritos"/>
        {favList.length > 0 && (
          <span style={{ font: "500 12px/1 var(--font-mono)", color: "var(--fg-3)", marginBottom: 4 }}>
            {favList.length} producto{favList.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {favList.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", border: "1px dashed var(--border)", borderRadius: 12, background: "var(--surface)" }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, background: "var(--surface-2)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: "var(--fg-4)" }}>
            <Icon name="heart" size={28}/>
          </div>
          <div style={{ font: "600 15px/1 var(--font-sans)", color: "var(--fg-2)", marginBottom: 8 }}>Tu lista está vacía</div>
          <div style={{ font: "400 13px/1.5 var(--font-sans)", color: "var(--fg-4)", maxWidth: 280, margin: "0 auto" }}>
            Pulsa el <Icon name="heart" size={12} style={{ display: "inline", verticalAlign: "middle" }}/> en cualquier producto para guardarlo aquí.
          </div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
          {favList.map(p => {
            const isAdded = added.has(p.id);
            const stockNum = typeof p.stock === "number" ? p.stock : p.stock === "ok" ? 999 : p.stock === "low" ? (p.stockN || 3) : 0;
            const isOut = stockNum === 0;

            return (
              <div key={p.id} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden", transition: "border-color .15s, transform .15s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--border-strong)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                {/* Imagen */}
                <div
                  onClick={() => onOpen(p)}
                  style={{ height: 140, background: "linear-gradient(180deg,#0c0c0f,#050506)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", opacity: isOut ? 0.45 : 1 }}
                >
                  <ProductImg shape={p.shape} size={110} imageUrl={p.imageUrl}/>
                </div>

                {/* Info */}
                <div style={{ padding: "12px 14px 14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ font: "600 13px/1.3 var(--font-sans)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                      <div style={{ font: "400 11px/1 var(--font-sans)", color: "var(--fg-3)", marginTop: 3 }}>{p.brand} · {p.subcat}</div>
                    </div>
                    {/* Quitar de favoritos */}
                    <button
                      onClick={() => onFav(p)}
                      title="Quitar de favoritos"
                      style={{ background: "none", border: "none", color: "var(--brand-red)", cursor: "pointer", padding: "2px 4px", borderRadius: 6, flexShrink: 0, marginLeft: 8 }}
                    >
                      <Icon name="heart" size={16} fill={true}/>
                    </button>
                  </div>

                  {/* Stock */}
                  {isOut && (
                    <span className="lt-overline" style={{ color: "var(--fg-4)", display: "block", marginBottom: 8 }}>Agotado</span>
                  )}
                  {!isOut && stockNum <= 5 && (
                    <span className="lt-overline" style={{ color: "var(--warning)", display: "block", marginBottom: 8 }}>Quedan {stockNum}</span>
                  )}

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
                    <span style={{ font: "700 16px/1 var(--font-sans)" }}>${(p.price || 0).toLocaleString("en-US")}</span>
                    <button
                      onClick={() => !isOut && !isAdded && handleAdd(p)}
                      disabled={isOut}
                      style={{
                        height: 32, padding: "0 14px", borderRadius: 8, border: "none",
                        font: "600 12px/1 var(--font-sans)", cursor: isOut ? "not-allowed" : "pointer",
                        background: isOut ? "var(--surface-2)" : isAdded ? "rgb(182 255 60 / 0.15)" : "var(--brand-red)",
                        color: isOut ? "var(--fg-4)" : isAdded ? "var(--neon-lime)" : "#fff",
                        display: "flex", alignItems: "center", gap: 5,
                        transition: "all .2s",
                        boxShadow: isOut || isAdded ? "none" : "var(--shadow-glow-red)",
                      }}
                    >
                      {isOut ? "Agotado" : isAdded ? <><Icon name="check" size={12}/>Añadido</> : <><Icon name="cart" size={12}/>Añadir</>}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

// ── TAB: CONFIGURACIÓN ────────────────────────────────────────────────────────
function SettingsTab({ account, authUser }) {
  const user = authUser || {};
  const [form, setForm] = React.useState({
    name:  user.name  || account.name  || "",
    email: user.email || account.email || "",
  });
  const [saved, setSaved] = React.useState(false);
  const [notifs, setNotifs] = React.useState({
    drops: true, offers: true, orders: true, newsletter: false,
  });
  const [pwForm, setPwForm] = React.useState({ current: "", next: "", confirm: "" });
  const [pwSaved, setPwSaved] = React.useState(false);
  const [pwErr, setPwErr] = React.useState("");

  const setF = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const setP = (k, v) => { setPwForm(f => ({ ...f, [k]: v })); setPwErr(""); };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handlePwSave = () => {
    if (!pwForm.current.trim())      { setPwErr("Ingresa tu contraseña actual."); return; }
    if (pwForm.next.length < 6)      { setPwErr("La nueva contraseña debe tener al menos 6 caracteres."); return; }
    if (pwForm.next !== pwForm.confirm) { setPwErr("Las contraseñas no coinciden."); return; }
    setPwSaved(true);
    setPwForm({ current: "", next: "", confirm: "" });
    setTimeout(() => setPwSaved(false), 2500);
  };

  const notifLabels = [
    { key: "drops",      label: "Drops semanales",              desc: "Nuevas llegadas y lanzamientos exclusivos" },
    { key: "offers",     label: "Ofertas y descuentos",         desc: "Alertas de precios y promos flash" },
    { key: "orders",     label: "Estado de mis pedidos",        desc: "Actualizaciones de envío y entrega" },
    { key: "newsletter", label: "Newsletter mensual",           desc: "Resumen del mes y novedades Life Tech" },
  ];

  const inputSt = { font: "400 14px/1 var(--font-sans)", height: 44 };

  return (
    <>
      <SectionTitle eyebrow="Tu cuenta" title="Configuración"/>

      {/* Datos personales */}
      <ACard title="Datos personales">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div className="lt-field">
            <label>Nombre</label>
            <input className="lt-input" style={inputSt} value={form.name} onChange={e => setF("name", e.target.value)}/>
          </div>
          <div className="lt-field">
            <label>Nickname</label>
            <input className="lt-input" style={inputSt} defaultValue={user.nickname || ""} readOnly style={{ ...inputSt, opacity: 0.6, cursor: "default" }}/>
          </div>
          <div className="lt-field" style={{ gridColumn: "span 2" }}>
            <label>Correo electrónico</label>
            <input className="lt-input" style={inputSt} value={form.email} onChange={e => setF("email", e.target.value)}/>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 18 }}>
          <button
            onClick={handleSave}
            className="lt-btn lt-btn--primary"
          >
            {saved ? <><Icon name="check" size={14}/>Guardado</> : "Guardar cambios"}
          </button>
          {saved && (
            <span style={{ font: "400 12px/1 var(--font-sans)", color: "var(--neon-lime)", animation: "lt-fade-in .2s ease" }}>
              ✓ Cambios guardados correctamente
            </span>
          )}
        </div>
      </ACard>

      {/* Cambiar contraseña */}
      {(user.provider === "email" || !user.provider) && (
        <ACard title="Contraseña">
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div className="lt-field">
              <label>Contraseña actual</label>
              <input className="lt-input" type="password" style={inputSt} placeholder="••••••••" value={pwForm.current} onChange={e => setP("current", e.target.value)}/>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div className="lt-field">
                <label>Nueva contraseña</label>
                <input className="lt-input" type="password" style={inputSt} placeholder="Mín. 6 caracteres" value={pwForm.next} onChange={e => setP("next", e.target.value)}/>
              </div>
              <div className="lt-field">
                <label>Confirmar contraseña</label>
                <input className="lt-input" type="password" style={inputSt} placeholder="••••••••" value={pwForm.confirm} onChange={e => setP("confirm", e.target.value)}/>
              </div>
            </div>
            {pwErr && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--brand-red)", font: "400 12px/1 var(--font-sans)" }}>
                <Icon name="close" size={11}/>{pwErr}
              </div>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 4 }}>
              <button onClick={handlePwSave} className="lt-btn lt-btn--secondary">
                {pwSaved ? <><Icon name="check" size={14}/>Actualizada</> : "Cambiar contraseña"}
              </button>
              {pwSaved && (
                <span style={{ font: "400 12px/1 var(--font-sans)", color: "var(--neon-lime)" }}>
                  ✓ Contraseña actualizada
                </span>
              )}
            </div>
          </div>
        </ACard>
      )}

      {/* Sesión Google badge */}
      {user.provider === "google" && (
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <div>
            <div style={{ font: "600 13px/1 var(--font-sans)" }}>Cuenta vinculada con Google</div>
            <div style={{ font: "400 11px/1 var(--font-sans)", color: "var(--fg-3)", marginTop: 3 }}>{user.email}</div>
          </div>
          <span style={{ marginLeft: "auto" }}><Badge tone="lime">Vinculada</Badge></span>
        </div>
      )}

      {/* Notificaciones */}
      <ACard title="Notificaciones">
        <div style={{ display: "flex", flexDirection: "column" }}>
          {notifLabels.map(({ key, label, desc }) => (
            <div key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderTop: "1px solid var(--border-subtle)" }}>
              <div>
                <div style={{ font: "500 13px/1 var(--font-sans)", color: "var(--fg)" }}>{label}</div>
                <div style={{ font: "400 11px/1.3 var(--font-sans)", color: "var(--fg-4)", marginTop: 3 }}>{desc}</div>
              </div>
              <Toggle on={notifs[key]} onChange={() => setNotifs(n => ({ ...n, [key]: !n[key] }))}/>
            </div>
          ))}
        </div>
      </ACard>

      {/* Zona de peligro */}
      <div style={{ padding: 20, border: "1px solid rgb(239 43 43 / 0.3)", borderRadius: 12, background: "rgb(239 43 43 / 0.04)" }}>
        <div style={{ font: "700 14px/1 var(--font-sans)", color: "var(--brand-red)", marginBottom: 6 }}>Zona de peligro</div>
        <div style={{ font: "400 12px/1.4 var(--font-sans)", color: "var(--fg-3)", marginBottom: 14 }}>
          Eliminar tu cuenta es una acción permanente e irreversible. Se borrarán todos tus datos, pedidos y puntos.
        </div>
        <button
          disabled
          style={{ height: 34, padding: "0 16px", borderRadius: 8, border: "1px solid rgb(239 43 43 / 0.4)", background: "transparent", color: "var(--fg-4)", font: "600 12px/1 var(--font-sans)", cursor: "not-allowed", opacity: 0.5 }}
        >
          Eliminar mi cuenta
        </button>
      </div>
    </>
  );
}

// ── Pantalla principal de cuenta ──────────────────────────────────────────────
function AccountScreen({ account, products, favs, onFav, onAdd, onOpen, onLogout, onShop, initialTab, authUser }) {
  const [tab, setTab] = React.useState(initialTab || "overview");

  // Sincroniza si se cambia la pestaña desde fuera (dropdown)
  React.useEffect(() => {
    if (initialTab) setTab(initialTab);
  }, [initialTab]);

  const user = authUser || {};
  const displayName = user.name || account.name || "Gamer";
  const tierVal     = user.tier || account.tier || "FREE";
  const pointsVal   = user.points ?? account.points ?? 0;
  const initials    = user.initials || account.avatar || displayName.slice(0, 2).toUpperCase();
  const avatarColor = user.color || "var(--brand-red)";

  const NAV = [
    { id: "overview",   label: "Overview",       icon: "home"     },
    { id: "orders",     label: "Mis pedidos",     icon: "package"  },
    { id: "favorites",  label: "Favoritos",       icon: "heart"    },
    { id: "settings",   label: "Configuración",   icon: "settings" },
  ];

  return (
    <section className="lt-section" style={{ paddingTop: 32 }}>
      <div className="lt-section-inner" style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 32, alignItems: "flex-start" }}>

        {/* ── Sidebar ─────────────────────────────────────────────── */}
        <aside style={{ position: "sticky", top: 80, display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Perfil */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 16, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12 }}>
            <div style={{
              width: 46, height: 46, borderRadius: 999, flexShrink: 0,
              background: avatarColor,
              display: "flex", alignItems: "center", justifyContent: "center",
              font: "700 15px/1 var(--font-sans)", color: "#fff",
              boxShadow: "0 0 16px -4px rgba(0,0,0,0.5)",
            }}>
              {initials}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ font: "700 13px/1.2 var(--font-sans)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {displayName}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                <Badge tone={tierVal === "Pro" || tierVal === "PRO" ? "red" : "ghost"}>{tierVal}</Badge>
                <span className="lt-mono" style={{ color: "var(--fg-3)", fontSize: 10 }}>{pointsVal} pts</span>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav style={{ display: "flex", flexDirection: "column", gap: 2, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 8 }}>
            {NAV.map(it => {
              const active = tab === it.id;
              return (
                <a
                  key={it.id}
                  onClick={() => setTab(it.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 12px", borderRadius: 8, cursor: "pointer",
                    background: active ? "rgb(239 43 43 / 0.10)" : "transparent",
                    color: active ? "var(--fg)" : "var(--fg-2)",
                    font: `${active ? 600 : 400} 13px/1 var(--font-sans)`,
                    transition: "all .15s",
                    borderLeft: `3px solid ${active ? "var(--brand-red)" : "transparent"}`,
                  }}
                  onMouseEnter={e => { if (!active) { e.currentTarget.style.background = "var(--surface-2)"; e.currentTarget.style.color = "var(--fg)"; }}}
                  onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--fg-2)"; }}}
                >
                  <Icon name={it.icon} size={15}/>
                  {it.label}
                  {it.id === "favorites" && favs && favs.size > 0 && (
                    <span style={{ marginLeft: "auto", background: "var(--brand-red)", color: "#fff", font: "700 9px/1 var(--font-sans)", borderRadius: 999, padding: "2px 6px" }}>
                      {favs.size}
                    </span>
                  )}
                </a>
              );
            })}

            <hr style={{ border: 0, borderTop: "1px solid var(--border-subtle)", margin: "6px 0" }}/>

            <a
              onClick={onLogout}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 12px", borderRadius: 8, cursor: "pointer",
                color: "var(--fg-3)", font: "400 13px/1 var(--font-sans)",
                transition: "color .15s, background .15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.color = "var(--brand-red)"; e.currentTarget.style.background = "rgb(239 43 43 / 0.08)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "var(--fg-3)"; e.currentTarget.style.background = "transparent"; }}
            >
              <Icon name="logout" size={15}/>
              Cerrar sesión
            </a>
          </nav>
        </aside>

        {/* ── Contenido de pestaña ─────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24, animation: "lt-fade-in .2s ease" }} key={tab}>
          {tab === "overview" && (
            <OverviewTab
              account={account} authUser={authUser} products={products}
              favs={favs || new Set()} onOpen={onOpen} onTab={setTab}
            />
          )}
          {tab === "orders" && (
            <OrdersTab account={account} products={products}/>
          )}
          {tab === "favorites" && (
            <FavoritesTab
              products={products}
              favs={favs || new Set()}
              onFav={onFav}
              onAdd={onAdd}
              onOpen={onOpen}
            />
          )}
          {tab === "settings" && (
            <SettingsTab account={account} authUser={authUser}/>
          )}
        </div>
      </div>
    </section>
  );
}

window.AccountScreen = AccountScreen;
