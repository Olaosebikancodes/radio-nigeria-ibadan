import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Play, Pause } from "lucide-react";
import { usePlayer } from "../../context/PlayerContext";
import { SOCIAL_LINKS } from "../../lib/utils";

const NAV = [
  { label: "Home", to: "/" },
  { label: "Stations", to: "/stations" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

const FacebookIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const YoutubeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

function WaveIcon({ active }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "flex-end",
        gap: "2px",
        height: "14px",
      }}
    >
      {[1, 2, 3, 4].map((i) => (
        <span
          key={i}
          style={{
            display: "block",
            width: "3px",
            borderRadius: "2px",
            backgroundColor: active
              ? "var(--color-accent)"
              : "var(--color-text-muted)",
            height: `${[8, 14, 10, 12][i - 1]}px`,
            animation: active
              ? `wave-bar 0.9s ease-in-out ${i * 0.12}s infinite`
              : "none",
            transformOrigin: "bottom",
          }}
        />
      ))}
    </span>
  );
}

const socialStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "28px",
  height: "28px",
  borderRadius: "7px",
  background: "var(--color-surface)",
  border: "1px solid var(--color-border)",
  color: "var(--color-text-muted)",
  transition: "all 0.2s",
  cursor: "pointer",
};

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { activeStation, playing, toggle } = usePlayer();


  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: "var(--color-surface)",
        borderBottom: "1px solid var(--color-border)",
        overflow: "visible",
      }}
    >
      <div
        style={{ maxWidth: "1280px", margin: "0 auto", padding: "16px 24px" }}
      >
        <div
          className="nav-inner"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "120px",
            gap: "12px",
          }}
        >
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flexShrink: 0,
            }}
          >
            <img
              src="https://tfxpqxxzopsycpnmdyke.supabase.co/storage/v1/object/public/images/Untitled%20design(8).png"
              alt="Radio Nigeria Ibadan"
              className="nav-logo-img"
              style={{
                height: "120px",
                width: "auto",
                objectFit: "contain",
                filter: "brightness(1.15)",
              }}
            />
          </Link>

          <nav
            style={{ display: "flex", alignItems: "center", gap: "2px" }}
            className="desktop-nav"
          >
            {NAV.map(({ label, to }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                style={({ isActive }) => ({
                  padding: "6px 10px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: isActive
                    ? "var(--color-accent)"
                    : "var(--color-text-muted)",
                  background: isActive ? "rgba(240,165,0,0.08)" : "transparent",
                  transition: "all 0.2s",
                  letterSpacing: "-0.01em",
                })}
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flexShrink: 0,
            }}
          >
            <div
              style={{ display: "flex", gap: "6px" }}
              className="social-icons"
            >
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                style={socialStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#1877F222";
                  e.currentTarget.style.color = "#1877F2";
                  e.currentTarget.style.borderColor = "#1877F244";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--color-surface)";
                  e.currentTarget.style.color = "var(--color-text-muted)";
                  e.currentTarget.style.borderColor = "var(--color-border)";
                }}
                title="Facebook"
              >
                <FacebookIcon />
              </a>
              <a
                href={SOCIAL_LINKS.youtube}
                target="_blank"
                rel="noopener noreferrer"
                style={socialStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#FF000022";
                  e.currentTarget.style.color = "#FF0000";
                  e.currentTarget.style.borderColor = "#FF000044";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--color-surface)";
                  e.currentTarget.style.color = "var(--color-text-muted)";
                  e.currentTarget.style.borderColor = "var(--color-border)";
                }}
                title="YouTube"
              >
                <YoutubeIcon />
              </a>
            </div>

            {activeStation && (
              <button
                onClick={toggle}
                className="nav-mini-player"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  padding: "5px 12px",
                  borderRadius: "999px",
                  background: "var(--color-surface-2)",
                  border: "1px solid var(--color-border-light)",
                  color: "var(--color-text)",
                  cursor: "pointer",
                  fontSize: "11px",
                  fontWeight: 500,
                }}
              >
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "var(--color-live)",
                    animation: "pulse-live 1.4s infinite",
                    flexShrink: 0,
                  }}
                />
                <WaveIcon active={playing} />
                <span
                  style={{
                    maxWidth: "90px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {activeStation.name}
                </span>
                <span style={{ color: "var(--color-text-muted)", display:'flex', alignItems:'center' }}>
                  {playing ? <Pause size={10}/> : <Play size={10}/>}
                </span>
              </button>
            )}

            <button
              onClick={() => setOpen((o) => !o)}
              className="hamburger"
              style={{
                display: "none",
                flexDirection: "column",
                gap: "5px",
                padding: "6px",
                background: "none",
                border: "none",
                cursor: "pointer",
                position: "relative",
              }}
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  style={{
                    display: "block",
                    width: "20px",
                    height: "2px",
                    background: "var(--color-text)",
                    borderRadius: "2px",
                  }}
                />
              ))}
              {activeStation && playing && (
                <span
                  style={{
                    position: "absolute",
                    top: "4px",
                    right: "4px",
                    width: "7px",
                    height: "7px",
                    borderRadius: "50%",
                    background: "var(--color-live)",
                    border: "1.5px solid var(--color-bg)",
                    animation: "pulse-live 1.4s infinite",
                  }}
                />
              )}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "rgba(255,255,255,0.96)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid var(--color-border)",
            padding: "12px 20px 20px",
            display: "flex",
            flexDirection: "column",
            gap: "2px",
          }}
        >
          {activeStation && (
            <button
              onClick={toggle}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px 14px",
                borderRadius: "10px",
                background: "var(--color-surface-2)",
                border: "1px solid var(--color-border-light)",
                cursor: "pointer",
                marginBottom: "8px",
                width: "100%",
                textAlign: "left",
              }}
            >
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "var(--color-live)",
                  animation: "pulse-live 1.4s infinite",
                  flexShrink: 0,
                }}
              />
              <WaveIcon active={playing} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "var(--color-text)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {activeStation.name}
                </p>
                <p
                  style={{
                    fontSize: "11px",
                    color: "var(--color-text-muted)",
                    marginTop: "1px",
                  }}
                >
                  {playing
                    ? "Now playing · tap to pause"
                    : "Paused · tap to resume"}
                </p>
              </div>
              <span
                style={{
                  fontSize: "18px",
                  color: "var(--color-text-muted)",
                  flexShrink: 0,
                }}
              >
                {playing ? <Pause size={16}/> : <Play size={16}/>}
              </span>
            </button>
          )}

          {NAV.map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              onClick={() => setOpen(false)}
              style={({ isActive }) => ({
                padding: "11px 14px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: 500,
                color: isActive ? "var(--color-accent)" : "var(--color-text)",
                background: isActive ? "rgba(240,165,0,0.08)" : "transparent",
              })}
            >
              {label}
            </NavLink>
          ))}
          <div
            style={{
              display: "flex",
              gap: "10px",
              padding: "12px 14px 4px",
              marginTop: "4px",
              borderTop: "1px solid var(--color-border)",
            }}
          >
            {[
              {
                href: SOCIAL_LINKS.facebook,
                icon: <FacebookIcon />,
                label: "Facebook",
              },
              {
                href: SOCIAL_LINKS.youtube,
                icon: <YoutubeIcon />,
                label: "YouTube",
              },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  ...socialStyle,
                  width: "36px",
                  height: "36px",
                  borderRadius: "9px",
                }}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 1024px) { .desktop-nav { display: none !important; } .hamburger { display: flex !important; } }
        @media (max-width: 768px)  { .social-icons { display: none !important; } .nav-mini-player { display: none !important; } }
        @media (max-width: 768px)  { .nav-logo-img { height: 72px !important; } .nav-inner { height: 72px !important; } }
        @media (max-width: 400px)  { .nav-logo-img { height: 56px !important; } .nav-inner { height: 56px !important; } .nav-logo-text { display: none !important; } }
      `}</style>
    </header>
  );
}
