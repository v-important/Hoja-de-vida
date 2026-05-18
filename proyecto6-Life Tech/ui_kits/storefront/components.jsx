// Shared components for Life Tech storefront UI kit
// Exports to window: Logo, Header, Footer, ProductImg, ProductCard, Stars, Icon, Button, Badge, IconBtn, Toast, ToastStack
const { useState, useEffect, useRef } = React;

// ---------- Icons (inline Lucide-style strokes) ----------
const ICONS = {
  cart:    <><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></>,
  user:    <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
  search:  <><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></>,
  heart:   <><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></>,
  star:    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>,
  check:   <polyline points="20 6 9 17 4 12"/>,
  truck:   <><rect x="1" y="3" width="15" height="13" rx="1"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></>,
  arrowR:  <><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></>,
  arrowL:  <><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></>,
  close:   <><path d="M18 6 6 18"/><path d="m6 6 12 12"/></>,
  plus:    <><path d="M12 5v14"/><path d="M5 12h14"/></>,
  minus:   <path d="M5 12h14"/>,
  trash:   <><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></>,
  shield:  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>,
  zap:     <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>,
  bolt:    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>,
  package: <><path d="M16.5 9.4 7.55 4.24"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></>,
  settings:<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>,
  logout:  <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
  home:    <><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>,
  mapPin:  <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></>,
  card:    <><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></>,
  filter:  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>,
  sliders: <><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></>,
  spark:   <><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/></>,
  ai:      <><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></>,
};

function Icon({ name, size = 20, fill = false, style = {}, className = "" }) {
  const path = ICONS[name];
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24"
      fill={fill ? "currentColor" : "none"} stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={style}>
      {path}
    </svg>
  );
}

// ---------- Logo ----------
function Logo({ size = 22, onClick }) {
  return (
    <img
      src="./assets/Life Tech Favicon.png"
      alt="Life Tech"
      onClick={onClick}
      style={{
        height: size * 1.9,
        width: "auto",
        display: "block",
        cursor: onClick ? "pointer" : "default",
        borderRadius: 10,
        userSelect: "none",
      }}
    />
  );
}

// ---------- Button ----------
function Button({ variant = "primary", size, block, icon, children, onClick, type = "button", disabled }) {
  const cls = ["lt-btn", `lt-btn--${variant}`];
  if (size === "lg") cls.push("lt-btn--lg");
  if (block) cls.push("lt-btn--block");
  if (icon && !children) cls.push("lt-btn--icon");

  function handleClick(e) {
    // Ripple effect
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.8;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top  - size / 2;
    const ripple = document.createElement("span");
    ripple.className = "lt-btn-ripple";
    ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px;`;
    btn.appendChild(ripple);
    ripple.addEventListener("animationend", () => ripple.remove());
    if (onClick) onClick(e);
  }

  return (
    <button type={type} className={cls.join(" ")} onClick={disabled ? undefined : handleClick} disabled={disabled}>
      {icon}{children}
    </button>
  );
}

// ---------- Badge ----------
function Badge({ tone = "soft", children, dot }) {
  return <span className={`lt-badge lt-badge--${tone}`}>{dot && <span className="lt-live"/>}{children}</span>;
}

// ---------- IconBtn (header) ----------
function IconBtn({ name, count, onClick }) {
  return (
    <button className="lt-icon-btn" onClick={onClick} aria-label={name}>
      <Icon name={name} size={18}/>
      {count > 0 && <span className="lt-count">{count}</span>}
    </button>
  );
}

// ---------- Stars ----------
function Stars({ rating, reviews }) {
  const full = Math.floor(rating);
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--fg-2)", fontSize: 12 }}>
      <span style={{ display: "inline-flex", gap: 1 }}>
        {[0,1,2,3,4].map(i => (
          <Icon key={i} name="star" size={12} fill={i < full} style={{ color: i < full ? "#f59e0b" : "var(--border-strong)" }}/>
        ))}
      </span>
      <span className="lt-mono" style={{ fontWeight: 500 }}>{rating}</span>
      {reviews != null && <span style={{ color: "var(--fg-3)" }}>({reviews.toLocaleString("en-US")})</span>}
    </span>
  );
}

// ---------- Product placeholder shapes (CSS-styled SVG silhouettes) ----------
function ProductImg({ shape, size = 120, imageUrl }) {
  // Si hay imagen real subida desde el admin, úsala
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt=""
        style={{ width: size, height: size * 0.7, objectFit: "contain", display: "block" }}
        onError={e => { e.target.style.display = "none"; }}
      />
    );
  }
  const stroke = "#3a3a44";
  const fill = "#15151a";
  const accent = "#ef2b2b";
  const props = { width: size, height: size * 0.7, viewBox: "0 0 200 140", fill: "none" };
  switch (shape) {
    case "keyboard": return (
      <svg {...props}><rect x="10" y="38" width="180" height="68" rx="8" fill={fill} stroke={stroke}/>
        {Array.from({length:5}).map((_,r) => Array.from({length:14}).map((_,c) => (
          <rect key={r+"_"+c} x={18+c*12.4} y={46+r*11} width="9" height="9" rx="1.5" fill="#0a0a0d" stroke={stroke} strokeWidth="0.5"/>
        )))}
        <rect x="65" y="100" width="70" height="6" rx="2" fill="#0a0a0d" stroke={stroke}/>
        <rect x="10" y="38" width="180" height="3" fill={accent} opacity="0.7"/>
      </svg>);
    case "mouse": return (
      <svg {...props}><path d="M70 30 Q100 15 130 30 L140 100 Q140 130 100 130 Q60 130 60 100 Z" fill={fill} stroke={stroke}/>
        <path d="M100 30 L100 80" stroke={stroke}/>
        <rect x="92" y="50" width="16" height="22" rx="3" fill="#0a0a0d" stroke={stroke}/>
        <ellipse cx="100" cy="60" rx="3" ry="4" fill={accent} opacity="0.9"/>
      </svg>);
    case "headset": return (
      <svg {...props}><path d="M40 80 Q40 30 100 30 Q160 30 160 80" stroke={stroke} strokeWidth="3" fill="none"/>
        <rect x="22" y="65" width="36" height="55" rx="10" fill={fill} stroke={stroke}/>
        <rect x="142" y="65" width="36" height="55" rx="10" fill={fill} stroke={stroke}/>
        <circle cx="40" cy="92" r="10" fill="#0a0a0d" stroke={accent}/>
        <circle cx="160" cy="92" r="10" fill="#0a0a0d" stroke={accent}/>
      </svg>);
    case "pad": return (
      <svg {...props}><rect x="15" y="40" width="170" height="70" rx="6" fill={fill} stroke={stroke}/>
        <rect x="20" y="45" width="160" height="60" rx="4" fill="#0a0a0d"/>
        <text x="100" y="80" textAnchor="middle" fill={accent} fontFamily="Inter" fontWeight="900" fontSize="18" letterSpacing="-1">LT</text>
      </svg>);
    case "ram": return (
      <svg {...props}><rect x="20" y="30" width="160" height="80" rx="3" fill={fill} stroke={stroke}/>
        <rect x="20" y="100" width="160" height="10" fill="#0a0a0d" stroke={stroke}/>
        {Array.from({length:8}).map((_,i) => <rect key={i} x={32+i*19} y="38" width="14" height="55" rx="1" fill="#0a0a0d" stroke={stroke}/>)}
        <rect x="20" y="30" width="160" height="6" rx="2" fill={accent} opacity="0.8"/>
      </svg>);
    case "gpu": return (
      <svg {...props}><rect x="10" y="40" width="180" height="70" rx="4" fill={fill} stroke={stroke}/>
        <circle cx="55" cy="75" r="22" fill="#0a0a0d" stroke={stroke}/>
        <circle cx="55" cy="75" r="14" fill="none" stroke={accent}/>
        <circle cx="120" cy="75" r="22" fill="#0a0a0d" stroke={stroke}/>
        <circle cx="120" cy="75" r="14" fill="none" stroke={accent}/>
        <circle cx="55" cy="75" r="3" fill={accent}/>
        <circle cx="120" cy="75" r="3" fill={accent}/>
        <rect x="160" y="55" width="22" height="40" fill="#0a0a0d" stroke={stroke}/>
      </svg>);
    case "cpu": return (
      <svg {...props}><rect x="50" y="20" width="100" height="100" rx="6" fill={fill} stroke={stroke}/>
        <rect x="62" y="32" width="76" height="76" rx="3" fill="#0a0a0d" stroke={stroke}/>
        {Array.from({length:6}).map((_,i) => <line key={i} x1={70+i*12} y1="20" x2={70+i*12} y2="14" stroke={stroke}/>)}
        {Array.from({length:6}).map((_,i) => <line key={i} x1={70+i*12} y1="120" x2={70+i*12} y2="126" stroke={stroke}/>)}
        <text x="100" y="78" textAnchor="middle" fill={accent} fontFamily="Inter" fontWeight="900" fontSize="14" letterSpacing="-1">i9</text>
      </svg>);
    case "chair": return (
      <svg {...props}><rect x="60" y="20" width="80" height="60" rx="8" fill={fill} stroke={stroke}/>
        <rect x="50" y="78" width="100" height="20" rx="4" fill={fill} stroke={stroke}/>
        <line x1="100" y1="98" x2="100" y2="120" stroke={stroke} strokeWidth="3"/>
        <path d="M75 130 L100 120 L125 130" stroke={stroke} strokeWidth="3" fill="none"/>
        <rect x="64" y="24" width="72" height="3" fill={accent} opacity="0.8"/>
      </svg>);
    case "motherboard": return (
      <svg {...props}>
        <rect x="15" y="10" width="170" height="120" rx="6" fill={fill} stroke={stroke}/>
        {/* Socket CPU */}
        <rect x="35" y="22" width="60" height="60" rx="4" fill="#0a0a0d" stroke={stroke}/>
        <rect x="48" y="35" width="34" height="34" rx="2" fill="#111" stroke={accent} strokeWidth="0.8"/>
        <text x="65" y="57" textAnchor="middle" fill={accent} fontFamily="Inter" fontWeight="900" fontSize="11" opacity="0.7">CPU</text>
        {/* RAM slots */}
        <rect x="108" y="14" width="13" height="58" rx="2" fill="#0a0a0d" stroke={stroke}/>
        <rect x="127" y="14" width="13" height="58" rx="2" fill="#0a0a0d" stroke={stroke}/>
        <rect x="146" y="14" width="13" height="58" rx="2" fill="#0a0a0d" stroke={stroke}/>
        {/* PCIe slots */}
        <rect x="22" y="90" width="130" height="10" rx="2" fill="#0a0a0d" stroke={stroke}/>
        <rect x="22" y="108" width="100" height="9" rx="2" fill="#0a0a0d" stroke={stroke}/>
        {/* Chipset */}
        <rect x="115" y="72" width="46" height="34" rx="3" fill="#0a0a0d" stroke={stroke}/>
        <text x="138" y="94" textAnchor="middle" fill={accent} fontFamily="Inter" fontWeight="700" fontSize="9" opacity="0.65">PCH</text>
        {/* Panel I/O */}
        <rect x="15" y="10" width="18" height="72" rx="2" fill="#0a0a0d" stroke={stroke}/>
        <rect x="15" y="10" width="170" height="6" rx="3" fill={accent} opacity="0.55"/>
      </svg>);
    case "hdd": return (
      <svg {...props}>
        <rect x="18" y="20" width="164" height="100" rx="8" fill={fill} stroke={stroke}/>
        {/* Plato */}
        <circle cx="88" cy="70" r="40" fill="#0a0a0d" stroke={stroke}/>
        <circle cx="88" cy="70" r="24" fill="none" stroke={stroke} strokeWidth="0.6" opacity="0.4"/>
        <circle cx="88" cy="70" r="10" fill={stroke}/>
        <circle cx="88" cy="70" r="5" fill={accent}/>
        {/* Brazo lector */}
        <line x1="88" y1="70" x2="152" y2="33" stroke={stroke} strokeWidth="5" strokeLinecap="round"/>
        <ellipse cx="155" cy="30" rx="8" ry="5" fill={fill} stroke={accent} strokeWidth="0.8"/>
        {/* Conector */}
        <rect x="158" y="55" width="22" height="28" rx="2" fill="#0a0a0d" stroke={stroke}/>
        {[0,1,2,3,4].map(i => (
          <line key={i} x1="161" y1={61+i*4} x2="178" y2={61+i*4} stroke={accent} strokeWidth="0.6" opacity="0.5"/>
        ))}
      </svg>);
    case "cooling": return (
      <svg {...props}>
        {/* Marco */}
        <rect x="10" y="5" width="130" height="130" rx="12" fill={fill} stroke={stroke}/>
        <circle cx="75" cy="70" r="55" fill="none" stroke={stroke} strokeWidth="0.7" opacity="0.35"/>
        {/* Aspas (4) */}
        <path d="M75 25 C110 25 125 55 75 60 Z" fill="#0a0a0d" stroke={stroke} strokeWidth="0.7"/>
        <path d="M120 115 C120 80 90 70 75 115 Z" fill="#0a0a0d" stroke={stroke} strokeWidth="0.7"/>
        <path d="M75 115 C40 115 25 85 75 80 Z" fill="#0a0a0d" stroke={stroke} strokeWidth="0.7"/>
        <path d="M30 25 C30 60 60 70 75 25 Z" fill="#0a0a0d" stroke={stroke} strokeWidth="0.7"/>
        {/* Centro */}
        <circle cx="75" cy="70" r="18" fill={fill} stroke={stroke}/>
        <circle cx="75" cy="70" r="8" fill={accent} opacity="0.85"/>
        {/* Tornillos esquinas */}
        <circle cx="22" cy="17" r="5" fill="#0a0a0d" stroke={stroke} strokeWidth="0.8"/>
        <circle cx="128" cy="17" r="5" fill="#0a0a0d" stroke={stroke} strokeWidth="0.8"/>
        <circle cx="22" cy="123" r="5" fill="#0a0a0d" stroke={stroke} strokeWidth="0.8"/>
        <circle cx="128" cy="123" r="5" fill="#0a0a0d" stroke={stroke} strokeWidth="0.8"/>
      </svg>);
    default: return <svg {...props}><rect x="40" y="30" width="120" height="80" rx="6" fill={fill} stroke={stroke}/></svg>;
  }
}

// ---------- Product card ----------
function ProductCard({ product, onOpen, onAdd, fav, onFav, featured }) {
  // Normaliza stock: soporta número (API) o strings legacy ("ok" / "low")
  const stockNum =
    typeof product.stock === "number" ? product.stock :
    product.stock === "ok"  ? 999 :
    product.stock === "low" ? (product.stockN || 3) : 0;

  const isOut = stockNum === 0;
  const isLow = !isOut && stockNum <= 5;

  function handleMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
    const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
    e.currentTarget.style.setProperty("--card-mx", x + "%");
    e.currentTarget.style.setProperty("--card-my", y + "%");
  }

  return (
    <div
      className={"lt-card" + (featured || product.featured ? " lt-card--featured" : "")}
      onClick={() => onOpen?.(product)}
      onMouseMove={handleMouseMove}>
      <div className="lt-card-corner">
        {isOut && (
          <span className="lt-badge lt-badge--ghost" style={{ color: "var(--fg-4)", borderColor: "var(--border)" }}>Agotado</span>
        )}
        {!isOut && (product.badges || []).map((b, i) => (
          <span key={i} className={"lt-badge " + (b.startsWith("−") || b === "Nuevo" ? "lt-badge--red" : "lt-badge--ghost")}>{b}</span>
        ))}
      </div>

      <button className={"lt-card-fav" + (fav ? " on" : "")} onClick={(e) => { e.stopPropagation(); onFav?.(product); }}>
        <Icon name="heart" size={14} fill={fav}/>
      </button>

      {/* Imagen con overlay si está agotado */}
      <div className="lt-card-img" style={{ opacity: isOut ? 0.45 : 1, transition: "opacity .2s" }}>
        <ProductImg shape={product.shape} size={140} imageUrl={product.imageUrl}/>
      </div>

      {/* Estado de stock */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span className="lt-overline" style={{ color: "var(--fg-3)" }}>{product.subcat}</span>
        {isLow && (
          <span className="lt-overline" style={{ color: "var(--warning)" }}>Quedan {stockNum}</span>
        )}
        {!isOut && !isLow && (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--neon-lime)" }}>
            <span className="lt-live"/>En stock
          </span>
        )}
      </div>

      <div className="lt-card-name">{product.name}</div>
      <div className="lt-card-tag">{product.tagline}</div>

      <div className="lt-card-bot">
        <span className="lt-price">
          {product.was && <s>${product.was.toLocaleString("en-US")}</s>}
          ${(product.price || 0).toLocaleString("en-US")}
        </span>

        {/* Botón Añadir / Agotado */}
        <button
          className="lt-btn lt-btn--primary"
          style={{
            height: 32, padding: "0 14px", fontSize: 12,
            ...(isOut ? {
              background: "var(--surface-2)",
              color: "var(--fg-4)",
              boxShadow: "none",
              cursor: "not-allowed",
              border: "1px solid var(--border)",
              transform: "none",
            } : {}),
          }}
          disabled={isOut}
          onClick={(e) => { e.stopPropagation(); if (!isOut) onAdd?.(product); }}
        >
          {isOut ? "Agotado" : "Añadir"}
        </button>
      </div>
    </div>
  );
}

// ---------- UserAvatar ----------
function UserAvatar({ user, size = 32 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: user.color || "var(--brand-red)",
      color: "#fff",
      font: `700 ${Math.floor(size * 0.38)}px/1 var(--font-sans)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0, userSelect: "none",
      border: "2px solid var(--border)",
    }}>
      {(user.initials || (user.name || "?").slice(0, 2)).toUpperCase()}
    </div>
  );
}

// ---------- UserDropdown ----------
function UserDropdown({ user, onLogout, onClose, onAccount }) {
  const ref = useRef(null);
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const tierColor = user.tier === "PRO" ? "#f59e0b" : "var(--neon-cyan)";
  const menuItems = [
    { icon: "package",  label: "Mis pedidos",  action: () => { onClose(); onAccount("orders");    } },
    { icon: "heart",    label: "Favoritos",    action: () => { onClose(); onAccount("favorites"); } },
    { icon: "settings", label: "Configuración",action: () => { onClose(); onAccount("settings");  } },
  ];

  return (
    <div ref={ref} style={{
      position: "absolute", top: "calc(100% + 10px)", right: 0,
      width: 240, background: "#0e0e12",
      border: "1px solid var(--border)", borderRadius: 14,
      boxShadow: "0 20px 50px rgb(0 0 0 / 0.6)",
      overflow: "hidden", zIndex: 200,
      animation: "lt-fade-in .15s ease",
    }}>
      {/* Profile */}
      <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 12 }}>
        <UserAvatar user={user} size={40}/>
        <div style={{ minWidth: 0 }}>
          <div style={{ font: "600 13px/1 var(--font-sans)", color: "var(--fg)", marginBottom: 5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {user.name}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ font: "400 11px/1 var(--font-mono)", color: "var(--fg-3)" }}>{user.nickname}</span>
            <span style={{ font: "700 9px/1 var(--font-sans)", color: tierColor, background: `${tierColor}22`, borderRadius: 4, padding: "2px 5px", letterSpacing: ".06em" }}>
              {user.tier || "FREE"}
            </span>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div style={{ padding: "6px 0" }}>
        {menuItems.map(({ icon, label, action }) => (
          <button key={label} onClick={() => { onClose(); action?.(); }}
            style={{
              width: "100%", background: "none", border: "none",
              padding: "10px 16px", display: "flex", alignItems: "center", gap: 10,
              font: "500 13px/1 var(--font-sans)", color: "var(--fg-2)",
              cursor: "pointer", textAlign: "left", transition: "background .12s, color .12s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "var(--surface)"; e.currentTarget.style.color = "var(--fg)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "var(--fg-2)"; }}>
            <Icon name={icon} size={15}/>
            {label}
          </button>
        ))}
      </div>

      <div style={{ borderTop: "1px solid var(--border)", padding: "6px 0" }}>
        <button onClick={() => { onClose(); onLogout(); }}
          style={{
            width: "100%", background: "none", border: "none",
            padding: "10px 16px", display: "flex", alignItems: "center", gap: 10,
            font: "500 13px/1 var(--font-sans)", color: "var(--brand-red)",
            cursor: "pointer", textAlign: "left", transition: "background .12s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgb(239 43 43 / 0.08)"}
          onMouseLeave={e => e.currentTarget.style.background = "none"}>
          <Icon name="logout" size={15}/>
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

// ---------- AuthButton (replaces user IconBtn in header) ----------
function AuthButton({ user, onOpenLogin, onLogout, onAccount }) {
  const [open, setOpen] = useState(false);

  if (!user) {
    return (
      <button className="lt-icon-btn" onClick={onOpenLogin} aria-label="Iniciar sesión" title="Iniciar sesión">
        <Icon name="user" size={18}/>
      </button>
    );
  }

  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => setOpen(o => !o)} style={{
        display: "flex", alignItems: "center", gap: 8,
        height: 36, padding: "0 10px 0 6px",
        background: "var(--surface)", border: "1px solid var(--border)",
        borderRadius: 999, cursor: "pointer",
        transition: "border-color .15s",
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = "var(--border-strong)"}
      onMouseLeave={e => { if (!open) e.currentTarget.style.borderColor = "var(--border)"; }}>
        <UserAvatar user={user} size={24}/>
        <span style={{ font: "600 11px/1 var(--font-mono)", color: "var(--fg-2)", maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {user.nickname}
        </span>
      </button>
      {open && (
        <UserDropdown
          user={user}
          onLogout={onLogout}
          onClose={() => setOpen(false)}
          onAccount={onAccount}
        />
      )}
    </div>
  );
}

// ---------- Header ----------
function Header({ route, onNav, cartCount, onCart, onAccount, onLogo, pageLinks, authUser, onAuthOpen, onLogout }) {
  const navItem = (label, cat, hot) => {
    const href = pageLinks?.[cat];
    const active = route === `shop:${cat}`;
    const cls = [(hot ? "hot" : ""), (active ? "active" : "")].filter(Boolean).join(" ");
    // Cuando onNav está disponible, siempre usa el router interno (sin recarga de página)
    if (onNav) {
      return <a key={cat} className={cls} style={{ cursor: "pointer" }} onClick={() => onNav("shop", cat)}>{label}</a>;
    }
    return href
      ? <a key={cat} className={cls} href={href}>{label}</a>
      : <a key={cat} className={cls}>{label}</a>;
  };
  return (
    <header className="lt-header">
      <Logo onClick={onLogo}/>
      <nav className="lt-nav">
        {navItem("Periféricos", "perif")}
        {navItem("Componentes", "comp")}
        {navItem("Setups", "setup")}
        {navItem("Ofertas", "ofer", true)}
      </nav>
      <div className="lt-search" onClick={(e) => e.currentTarget.querySelector("input").focus()}>
        <Icon name="search" size={14}/>
        <input placeholder="Buscar productos…"/>
      </div>
      <div className="lt-spacer"/>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <AuthButton user={authUser} onOpenLogin={onAuthOpen} onLogout={onLogout} onAccount={onAccount}/>
        <IconBtn name="cart" count={cartCount} onClick={onCart}/>
      </div>
    </header>
  );
}

// ---------- Footer ----------
function Footer() {
  return (
    <footer className="lt-footer">
      <div className="lt-footer-inner">
        <div>
          <Logo size={28}/>
          <p style={{ color: "var(--fg-2)", fontSize: 13, marginTop: 16, maxWidth: 320 }}>
            Hardware para gente que juega en serio. Construye tu setup con piezas que aguanten lo que pase.
          </p>
        </div>
        <div>
          <h6>Tienda</h6>
          <ul><li><a>Periféricos</a></li><li><a>Componentes</a></li><li><a>Setups</a></li><li><a>Ofertas</a></li></ul>
        </div>
        <div>
          <h6>Soporte</h6>
          <ul><li><a>Centro de ayuda</a></li><li><a>Garantía</a></li><li><a>Devoluciones</a></li><li><a>Contacto</a></li></ul>
        </div>
        <div>
          <h6>Compañía</h6>
          <ul><li><a>Quiénes somos</a></li><li><a>Trabaja con nosotros</a></li><li><a>Prensa</a></li><li><a>Términos</a></li></ul>
        </div>
      </div>
      <div className="lt-footer-bot">
        <span>© 2026 Life Tech · Tu vida, tu setup.</span>
        <span>Bogotá, Colombia</span>
      </div>
    </footer>
  );
}

// ---------- Toast ----------
function ToastStack({ toasts }) {
  return (
    <div className="lt-toast-stack">
      {toasts.map(t => (
        <div key={t.id} className="lt-toast">
          <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgb(239 43 43 / 0.15)", color: "var(--brand-red)", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
            <Icon name={t.icon || "cart"} size={16}/>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
            <span style={{ font: "600 13px/1.3 var(--font-sans)", color: "var(--fg)" }}>{t.title}</span>
            {t.sub && <span style={{ font: "400 12px/1.3 var(--font-sans)", color: "var(--fg-3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.sub}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

Object.assign(window, { Icon, Logo, Button, Badge, IconBtn, Stars, ProductImg, ProductCard, UserAvatar, UserDropdown, AuthButton, Header, Footer, ToastStack });
