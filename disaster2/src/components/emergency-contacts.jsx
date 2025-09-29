import { Phone, MapPin, Shield, Heart, Flame, Zap, AlertTriangle } from "lucide-react";

export function EmergencyContacts() {
  const contacts = [
    {
      icon: Phone,
      title: "General Emergency",
      number: "112",
      description: "Police, Fire, Medical emergencies",
      color: "#dc2626",
    },
    {
      icon: Shield,
      title: "Police Non-Emergency",
      number: "100",
      description: "Non-urgent police matters",
      color: "#2563eb",
    },
    {
      icon: Flame,
      title: "Fire Department",
      number: "101",
      description: "Fire prevention and safety",
      color: "#f97316",
    },
    {
      icon: Heart,
      title: "Poison Control",
      number: "1-800-222-1222",
      description: "24/7 poison emergency hotline",
      color: "#7c3aed",
    },
    {
      icon: Zap,
      title: "Utility Emergency",
      number: "1-800-555-1212",
      description: "Gas, electric, water emergencies",
      color: "#f59e0b",
    },
    {
      icon: MapPin,
      title: "Emergency Management",
      number: "1-800-555-3434",
      description: "Local emergency coordination",
      color: "#16a34a",
    },
  ];

  const styles = {
    section: { padding: "100px 48px", backgroundColor: "#f9fafb" },
    container: { width: "100%", maxWidth: "1400px", margin: "0 auto" },
    header: { textAlign: "center", marginBottom: "72px" },
    title: { fontSize: "3rem", marginBottom: "20px", fontWeight: "700", color: "#111827", letterSpacing: "-0.02em" },
    subtitle: { fontSize: "1.35rem", color: "#6b7280", maxWidth: "700px", margin: "0 auto", lineHeight: "1.6" },
    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "32px" },
    card: { 
      borderRadius: "20px", 
      padding: "32px", 
      backgroundColor: "#fff", 
      boxShadow: "0 2px 8px rgba(0,0,0,0.06)", 
      transition: "all 0.3s ease",
      border: "1px solid #e5e7eb"
    },
    cardHover: { 
      boxShadow: "0 12px 24px rgba(0,0,0,0.12)",
      transform: "translateY(-4px)"
    },
    iconWrapper: { 
      padding: "16px", 
      borderRadius: "16px", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      width: "64px",
      height: "64px"
    },
    cardTitle: { fontSize: "1.25rem", fontWeight: "600", color: "#111827", marginBottom: "4px" },
    cardDesc: { fontSize: "0.95rem", color: "#6b7280", lineHeight: "1.5" },
    cardNumber: { fontSize: "1.75rem", fontWeight: "700", color: "#111827", letterSpacing: "-0.01em" },
    callButton: { 
      display: "flex", 
      alignItems: "center", 
      gap: "6px",
      padding: "10px 18px", 
      fontSize: "0.95rem", 
      color: "#fff", 
      borderRadius: "10px", 
      border: "none", 
      cursor: "pointer",
      fontWeight: "600",
      transition: "all 0.2s ease"
    },
    reminderBox: { 
      marginTop: "64px", 
      backgroundColor: "#fef2f2", 
      border: "2px solid #fecaca", 
      borderRadius: "16px", 
      padding: "32px 40px"
    },
    reminderHeader: { display: "flex", alignItems: "center", marginBottom: "16px", gap: "12px" },
    reminderTitle: { fontSize: "1.35rem", fontWeight: "700", color: "#dc2626" },
    reminderText: { color: "#991b1b", fontSize: "1.05rem", lineHeight: "1.7" },
  };

  return (
    <section style={styles.section} id="emergencycontacts">
      <div style={styles.container}>
        {/* Section Header */}
        <div style={styles.header}>
          <h2 style={styles.title}>Emergency Contacts</h2>
          <p style={styles.subtitle}>
            Keep these important numbers handy for emergency situations
          </p>
        </div>

        {/* Contact Cards */}
        <div style={styles.grid}>
          {contacts.map((contact, index) => {
            const IconComponent = contact.icon;
            return (
              <div
                key={index}
                style={styles.card}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = styles.cardHover.boxShadow;
                  e.currentTarget.style.transform = styles.cardHover.transform;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = styles.card.boxShadow;
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", marginBottom: "24px", gap: "16px" }}>
                  <div style={{ ...styles.iconWrapper, backgroundColor: contact.color }}>
                    <IconComponent color="#fff" size={28} strokeWidth={2} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={styles.cardTitle}>{contact.title}</h3>
                    <p style={styles.cardDesc}>{contact.description}</p>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "20px" }}>
                  <span style={styles.cardNumber}>{contact.number}</span>
                  <button 
                    style={{ ...styles.callButton, backgroundColor: contact.color }}
                    onMouseEnter={e => {
                      e.currentTarget.style.opacity = "0.9";
                      e.currentTarget.style.transform = "scale(1.05)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.opacity = "1";
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  >
                    <Phone size={18} />
                    Call
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Reminder Box */}
        <div style={styles.reminderBox}>
          <div style={styles.reminderHeader}>
            <AlertTriangle color="#dc2626" size={28} strokeWidth={2} />
            <h3 style={styles.reminderTitle}>Important Reminder</h3>
          </div>
          <p style={styles.reminderText}>
            In life-threatening emergencies, always call 911 first. These other
            numbers are for non-emergency situations or additional support.
          </p>
        </div>
      </div>
    </section>
  );
}

export default EmergencyContacts;