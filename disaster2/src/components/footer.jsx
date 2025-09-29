import { AlertTriangle, Phone, Mail, MapPin, Facebook, Twitter, Instagram } from "lucide-react";

export function Footer() {
  const styles = {
    footer: { backgroundColor: "#111827", color: "#fff", padding: "48px 0" },
    container: { width: "90%", maxWidth: "1200px", margin: "0 auto" },
    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "32px" },
    sectionTitle: { fontSize: "1.125rem", fontWeight: 600, marginBottom: "16px" },
    link: { color: "#9ca3af", textDecoration: "none", cursor: "pointer" },
    linkHover: { color: "#fff" },
    socialIcons: { display: "flex", gap: "16px" },
    iconHover: { cursor: "pointer" },
    bottomBar: { borderTop: "1px solid #1f2937", marginTop: "32px", paddingTop: "32px", textAlign: "center", color: "#9ca3af" },
    logoWrapper: { display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" },
    logoText: { fontSize: "1.25rem", fontWeight: "700" },
    contactItem: { display: "flex", alignItems: "center", gap: "8px" },
    contactItemStart: { display: "flex", alignItems: "flex-start", gap: "8px" },
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.grid}>
          {/* Logo + About */}
          <div>
            <div style={styles.logoWrapper}>
              <AlertTriangle color="#ef4444" size={32} />
              <span style={styles.logoText}>DisasterAlert</span>
            </div>
            <p style={{ color: "#9ca3af", marginBottom: "16px" }}>
              Keeping communities safe through comprehensive disaster management and emergency preparedness.
            </p>
            <div style={styles.socialIcons}>
              <Facebook color="#9ca3af" size={20} style={styles.iconHover} />
              <Twitter color="#9ca3af" size={20} style={styles.iconHover} />
              <Instagram color="#9ca3af" size={20} style={styles.iconHover} />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 style={styles.sectionTitle}>Quick Links</h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {["Home", "Services", "Preparedness", "Emergency Contacts", "Resources"].map((link, i) => (
                <li key={i} style={{ marginBottom: "8px" }}>
                  <a href={`#${link.toLowerCase().replace(/\s/g, "")}`} style={styles.link}>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Emergency */}
          <div>
            <h3 style={styles.sectionTitle}>Emergency</h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              <li style={styles.contactItem}>
                <Phone color="#ef4444" size={16} />
                <span style={{ color: "#9ca3af" }}>Emergency: 911</span>
              </li>
              <li style={styles.contactItem}>
                <Phone color="#2563eb" size={16} />
                <span style={{ color: "#9ca3af" }}>Non-Emergency: (555) 123-4567</span>
              </li>
              <li style={styles.contactItem}>
                <Mail color="#16a34a" size={16} />
                <span style={{ color: "#9ca3af" }}>info@disasteralert.com</span>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 style={styles.sectionTitle}>Contact Info</h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              <li style={styles.contactItemStart}>
                <MapPin color="#ef4444" size={16} />
                <span style={{ color: "#9ca3af" }}>
                  123 Emergency Lane
                  <br />
                  Safety City, SC 12345
                </span>
              </li>
              <li style={styles.contactItem}>
                <Phone color="#2563eb" size={16} />
                <span style={{ color: "#9ca3af" }}>(555) 987-6543</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={styles.bottomBar}>
          <p>
            © 2024 DisasterAlert. All rights reserved. |{" "}
            <a href="#" style={styles.link}>Privacy Policy</a> |{" "}
            <a href="#" style={styles.link}>Terms of Service</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
