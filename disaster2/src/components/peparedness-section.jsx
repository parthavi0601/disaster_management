import { CheckCircle, Package, Droplets, Zap, Radio } from "lucide-react";

export function PreparednessSection() {
  const tips = [
    {
      icon: Package,
      title: "Emergency Kit",
      items: [
        "Water (1 gallon per person per day for 3 days)",
        "Non-perishable food for 3 days",
        "Battery-powered or hand crank radio",
        "Flashlight and extra batteries",
        "First aid kit and medications",
      ],
    },
    {
      icon: Droplets,
      title: "Water Safety",
      items: [
        "Store water in clean containers",
        "Know how to purify water",
        "Locate alternative water sources",
        "Keep water purification tablets",
        "Maintain water storage rotation",
      ],
    },
    {
      icon: Radio,
      title: "Communication Plan",
      items: [
        "Establish family meeting points",
        "Keep emergency contact list",
        "Know local emergency frequencies",
        "Charge devices and have backup power",
        "Register for local alert systems",
      ],
    },
    {
      icon: Zap,
      title: "Power Outages",
      items: [
        "Keep flashlights and batteries ready",
        "Have a battery-powered radio",
        "Unplug electronics to prevent damage",
        "Keep refrigerator and freezer closed",
        "Use generators safely outdoors only",
      ],
    },
  ];

  const styles = {
    section: { padding: "80px 0", backgroundColor: "#fff" },
    container: { width: "90%", maxWidth: "1200px", margin: "0 auto" },
    header: { textAlign: "center", marginBottom: "64px" },
    title: { fontSize: "2rem", fontWeight: "700", marginBottom: "16px" },
    titleMd: { fontSize: "2.5rem" },
    paragraph: { fontSize: "1.25rem", color: "#4b5563", maxWidth: "700px", margin: "0 auto" },
    grid: { display: "grid", gridTemplateColumns: "1fr", gap: "32px" },
    gridMd: { gridTemplateColumns: "1fr 1fr" },
    card: {
      border: "1px solid #e5e7eb",
      borderRadius: "12px",
      padding: "24px",
      transition: "box-shadow 0.3s",
    },
    cardHover: { boxShadow: "0 10px 15px rgba(0,0,0,0.1)" },
    cardHeader: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" },
    cardTitle: { fontSize: "1.25rem", fontWeight: "600" },
    cardContent: {},
    listItem: { display: "flex", alignItems: "flex-start", gap: "8px" },
    listItemText: { color: "#374151" },
    iconRed: { color: "#dc2626", width: "32px", height: "32px" },
    iconGreen: { color: "#22c55e", width: "20px", height: "20px", marginTop: "4px" },
  };

  return (
    <section style={styles.section} id="preparedness">
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={{ ...styles.title, ...styles.titleMd }}>Emergency Preparedness</h2>
          <p style={styles.paragraph}>
            Essential tips and guidelines to help you prepare for emergencies
          </p>
        </div>

        <div style={{ ...styles.grid, ...{ gridTemplateColumns: window.innerWidth >= 768 ? "1fr 1fr" : "1fr" } }}>
          {tips.map((tip, index) => {
            const IconComponent = tip.icon;
            return (
              <div
                key={index}
                style={styles.card}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = styles.cardHover.boxShadow)}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
              >
                <div style={styles.cardHeader}>
                  <IconComponent style={styles.iconRed} />
                  <div style={styles.cardTitle}>{tip.title}</div>
                </div>
                <div style={styles.cardContent}>
                  <ul style={{ paddingLeft: 0, listStyle: "none" }}>
                    {tip.items.map((item, itemIndex) => (
                      <li key={itemIndex} style={styles.listItem}>
                        <CheckCircle style={styles.iconGreen} />
                        <span style={styles.listItemText}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
export default PreparednessSection;