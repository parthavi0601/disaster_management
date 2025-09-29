import { AlertTriangle, Shield, Radio, Users, MapPin, Heart } from "lucide-react";

export function ServicesSection() {
  const services = [
    {
      icon: AlertTriangle,
      title: "Emergency Alerts",
      description:
        "Real-time notifications about disasters, weather warnings, and emergency situations in your area.",
    },
    {
      icon: Shield,
      title: "Disaster Preparedness",
      description:
        "Comprehensive guides and checklists to help you prepare for various types of emergencies.",
    },
    {
      icon: Radio,
      title: "Emergency Communication",
      description:
        "Stay connected during emergencies with backup communication channels and updates.",
    },
    {
      icon: Users,
      title: "Community Response",
      description:
        "Connect with local emergency responders and volunteer organizations in your community.",
    },
    {
      icon: MapPin,
      title: "Evacuation Routes",
      description:
        "Interactive maps showing evacuation routes, shelters, and safe zones in your area.",
    },
    {
      icon: Heart,
      title: "First Aid Resources",
      description:
        "Essential first aid information and medical emergency response guidelines.",
    },
  ];

  const styles = {
    section: { padding: "80px 0", backgroundColor: "#f9fafb" },
    container: { width: "90%", maxWidth: "1200px", margin: "0 auto" },
    header: { textAlign: "center", marginBottom: "64px" },
    title: { fontSize: "2rem", fontWeight: "700", marginBottom: "16px", color: "#111827" },
    titleMd: { fontSize: "2.5rem" },
    paragraph: { fontSize: "1.25rem", color: "#4b5563", maxWidth: "700px", margin: "0 auto" },
    grid: { display: "grid", gap: "32px", gridTemplateColumns: "1fr" },
    gridMd: { gridTemplateColumns: "repeat(2, 1fr)" },
    gridLg: { gridTemplateColumns: "repeat(3, 1fr)" },
    card: {
      border: "1px solid #e5e7eb",
      borderRadius: "12px",
      padding: "24px",
      textAlign: "center",
      transition: "box-shadow 0.3s",
    },
    cardHover: { boxShadow: "0 10px 15px rgba(0,0,0,0.1)" },
    icon: { color: "#dc2626", width: "48px", height: "48px", marginBottom: "16px" },
    cardTitle: { fontSize: "1.25rem", fontWeight: "600", marginBottom: "8px" },
    cardDescription: { color: "#4b5563", fontSize: "1rem" },
  };

  return (
    <section style={styles.section} id="services">
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={{ ...styles.title, ...styles.titleMd }}>Our Services</h2>
          <p style={styles.paragraph}>
            Comprehensive disaster management services to keep you and your community safe
          </p>
        </div>

        <div
          style={{
            ...styles.grid,
            gridTemplateColumns:
              window.innerWidth >= 1024
                ? "repeat(3,1fr)"
                : window.innerWidth >= 768
                ? "repeat(2,1fr)"
                : "1fr",
          }}
        >
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div
                key={index}
                style={styles.card}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = styles.cardHover.boxShadow)}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
              >
                <IconComponent style={styles.icon} />
                <div style={styles.cardTitle}>{service.title}</div>
                <div style={styles.cardDescription}>{service.description}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
