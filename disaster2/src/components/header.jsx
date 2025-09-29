import { useState } from "react";
import { Menu, X, Phone, AlertTriangle } from "lucide-react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const styles = {
    header: { backgroundColor: "#ffffff", color: "#1f2937", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", borderBottom: "1px solid #e5e7eb" },
    container: { width: "100%", padding: "0 48px", margin: "0 auto" },
    flexBetween: { display: "flex", alignItems: "center", justifyContent: "space-between", height: "80px" },
    logoWrapper: { display: "flex", alignItems: "center", gap: "12px" },
    logoText: { fontSize: "1.5rem", fontWeight: 700, color: "#dc2626" },
    navDesktop: { display: "none", gap: "48px" },
    navDesktopLink: { color: "#374151", textDecoration: "none", transition: "color 0.2s", fontSize: "1rem", fontWeight: 500 },
    navDesktopLinkHover: { color: "#dc2626" },
    emergencyBtn: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "10px 20px",
      borderRadius: "8px",
      border: "2px solid #dc2626",
      backgroundColor: "#dc2626",
      color: "#ffffff",
      cursor: "pointer",
      fontSize: "0.95rem",
      fontWeight: 600,
      transition: "all 0.2s",
    },
    emergencyBtnHover: { backgroundColor: "#b91c1c", borderColor: "#b91c1c" },
    mobileToggle: { background: "none", border: "none", cursor: "pointer", color: "#374151" },
    mobileNav: { padding: "16px 0", borderTop: "1px solid #e5e7eb", display: "flex", flexDirection: "column", gap: "16px" },
  };

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <div style={styles.flexBetween}>
          {/* Logo */}
          <div style={styles.logoWrapper}>
            <AlertTriangle size={32} color="#dc2626" />
            <span style={styles.logoText}>DisasterAlert</span>
          </div>

          {/* Desktop Nav */}
          <nav style={{ ...styles.navDesktop, display: window.innerWidth >= 768 ? "flex" : "none" }}>
            {["Home", "Services", "Preparedness", "Emergency Contacts", "Resources"].map((link, i) => (
              <a
                key={i}
                href={`#${link.toLowerCase().replace(/\s/g, "")}`}
                style={styles.navDesktopLink}
                onMouseEnter={(e) => (e.target.style.color = "#dc2626")}
                onMouseLeave={(e) => (e.target.style.color = "#374151")}
              >
                {link}
              </a>
            ))}
          </nav>

          {/* Emergency Button Desktop */}
          {window.innerWidth >= 768 && (
            <button
              style={styles.emergencyBtn}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#b91c1c";
                e.currentTarget.style.borderColor = "#b91c1c";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#dc2626";
                e.currentTarget.style.borderColor = "#dc2626";
              }}
            >
              <Phone size={16} />
              Emergency: 911
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button style={styles.mobileToggle} onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div style={styles.mobileNav}>
            {["Home", "Services", "Preparedness", "Emergency Contacts", "Resources"].map((link, i) => (
              <a
                key={i}
                href={`#${link.toLowerCase().replace(/\s/g, "")}`}
                style={styles.navDesktopLink}
                onMouseEnter={(e) => (e.target.style.color = "#dc2626")}
                onMouseLeave={(e) => (e.target.style.color = "#374151")}
              >
                {link}
              </a>
            ))}
            <button
              style={styles.emergencyBtn}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#b91c1c";
                e.currentTarget.style.borderColor = "#b91c1c";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#dc2626";
                e.currentTarget.style.borderColor = "#dc2626";
              }}
            >
              <Phone size={16} />
              Emergency: 911
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;