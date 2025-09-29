import { AlertTriangle, Phone, MapPin } from "lucide-react";

export function HeroSection() {
  const styles = {
    section: {
      background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
      color: "#fff",
      padding: "120px 20px",
      textAlign: "center",
      minHeight: "calc(100vh - 80px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    container: {
      width: "100%",
      maxWidth: "1200px",
      margin: "0 auto",
    },
    icon: {
      width: "80px",
      height: "80px",
      margin: "0 auto 32px",
      color: "#facc15",
      strokeWidth: "2",
    },
    heading: {
      fontSize: "5rem",
      fontWeight: "700",
      marginBottom: "32px",
      lineHeight: "1.2",
      letterSpacing: "-0.02em",
    },
    paragraph: {
      fontSize: "1.25rem",
      marginBottom: "48px",
      color: "#fecaca",
      maxWidth: "900px",
      margin: "0 auto 48px",
      lineHeight: "1.6",
    },
    buttonContainer: {
      display: "flex",
      flexDirection: "row",
      gap: "20px",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "wrap",
      marginBottom: "80px",
    },
    button: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      padding: "14px 32px",
      borderRadius: "8px",
      fontWeight: "600",
      fontSize: "17px",
      cursor: "pointer",
      border: "none",
      transition: "all 0.3s ease",
      minWidth: "200px",
      justifyContent: "center",
    },
    emergencyBtn: {
      backgroundColor: "#facc15",
      color: "#000",
    },
    shelterBtn: {
      backgroundColor: "transparent",
      border: "2px solid #fff",
      color: "#fff",
    },
    alertBox: {
      backgroundColor: "rgba(0, 0, 0, 0.2)",
      borderRadius: "12px",
      padding: "20px 40px",
      display: "inline-block",
      backdropFilter: "blur(10px)",
    },
    alertHeading: {
      fontSize: "1.25rem",
      fontWeight: "600",
      marginBottom: "16px",
    },
    alertContent: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "12px",
      fontSize: "1.05rem",
    },
    alertDot: {
      width: "14px",
      height: "14px",
      backgroundColor: "#22c55e",
      borderRadius: "50%",
      animation: "pulse 2s infinite",
    },
  };

  return (
    <section style={styles.section} id="home">
      <div style={styles.container}>
        <AlertTriangle style={styles.icon} />
        <h1 style={styles.heading}>
          Stay Safe, Stay Prepared
        </h1>
        <p style={styles.paragraph}>
          Your comprehensive resource for disaster preparedness, emergency response, and community safety
        </p>

        <div style={styles.buttonContainer}>
          <button
            style={{ ...styles.button, ...styles.emergencyBtn }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#eab308";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(250, 204, 21, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#facc15";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <Phone size={20} />
            Report Emergency
          </button>

          <button
            style={{ ...styles.button, ...styles.shelterBtn }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#fff";
              e.currentTarget.style.color = "#b91c1c";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#fff";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <MapPin size={20} />
            Find Shelter
          </button>
        </div>

        <div style={styles.alertBox}>
          <h3 style={styles.alertHeading}>Current Alert Status</h3>
          <div style={styles.alertContent}>
            <div style={styles.alertDot}></div>
            <span>All Clear - No Active Alerts</span>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes pulse {
            0%, 100% { 
              transform: scale(1); 
              opacity: 1; 
              box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
            }
            50% { 
              transform: scale(1.1); 
              opacity: 0.8;
              box-shadow: 0 0 0 8px rgba(34, 197, 94, 0);
            }
          }
          
          @media (max-width: 768px) {
            h1 { 
              font-size: 2rem !important; 
            }
            p {
              font-size: 1.1rem !important;
            }
          }
        `}
      </style>
    </section>
  );
}

export default HeroSection;