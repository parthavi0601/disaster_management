import { Download, ExternalLink, FileText, Video, Book, Globe } from "lucide-react";
import { useState, useEffect } from "react";

export function ResourcesSection() {
  const [email, setEmail] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [downloads, setDownloads] = useState([]);
  const [downloadingFiles, setDownloadingFiles] = useState(new Set());

  // Static resources that don't require downloads
  const staticResources = [
    {
      icon: Video,
      title: "First Aid Training Videos",
      description: "Step-by-step video tutorials for basic first aid and CPR",
      type: "Video Series",
      action: "Watch",
      url: "https://www.youtube.com/watch?v=9WIwlljva_s" // Red Cross First Aid playlist
    },
    {
      icon: Globe,
      title: "Weather Monitoring Tools",
      description: "Real-time weather tracking and severe weather alerts",
      type: "Web App",
      action: "Access",
      url: "https://www.weather.gov"
    }
  ];

  // Fetch available downloads from backend
  useEffect(() => {
    fetchDownloads();
  }, []);

  const fetchDownloads = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/downloads');
      const data = await response.json();
      
      if (data.success) {
        setDownloads(data.downloads);
      }
    } catch (error) {
      console.error('Error fetching downloads:', error);
    }
  };

  const handleDownload = async (downloadItem) => {
    setDownloadingFiles(prev => new Set([...prev, downloadItem.id]));

    try {
      const response = await fetch(`http://localhost:3001${downloadItem.downloadUrl}`);
      
      if (!response.ok) {
        throw new Error('Download failed');
      }

      // Create blob from response
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = downloadItem.filename;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download file. Please try again.');
    } finally {
      setDownloadingFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(downloadItem.id);
        return newSet;
      });
    }
  };

  const handleStaticResourceClick = (resource) => {
    if (resource.url) {
      window.open(resource.url, '_blank');
    }
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setSubscriptionStatus('Please enter your email address');
      return;
    }

    setIsLoading(true);
    setSubscriptionStatus('');

    try {
      const response = await fetch('http://localhost:3001/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (data.success) {
        setSubscriptionStatus('✅ ' + data.message);
        setEmail('');
      } else {
        setSubscriptionStatus('❌ ' + data.message);
      }
    } catch (error) {
      console.error('Subscription error:', error);
      setSubscriptionStatus('❌ Failed to subscribe. Please check your internet connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const styles = {
    section: { padding: "80px 0", backgroundColor: "#fff" },
    container: { width: "90%", maxWidth: "1200px", margin: "0 auto" },
    header: { textAlign: "center", marginBottom: "64px" },
    title: { fontSize: "2rem", fontWeight: "700", marginBottom: "16px" },
    titleMd: { fontSize: "2.5rem" },
    paragraph: { fontSize: "1.25rem", color: "#4b5563", maxWidth: "700px", margin: "0 auto" },
    grid: { display: "grid", gap: "32px", gridTemplateColumns: "1fr" },
    card: {
      border: "1px solid #e5e7eb",
      borderRadius: "12px",
      padding: "24px",
      transition: "all 0.3s ease",
    },
    cardHover: { 
      boxShadow: "0 10px 15px rgba(0,0,0,0.1)", 
      transform: "translateY(-2px)" 
    },
    cardHeader: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" },
    cardTitle: { fontSize: "1.25rem", fontWeight: "600" },
    cardDescription: { fontSize: "0.875rem", color: "#6b7280" },
    cardContent: { marginTop: "8px" },
    cardMeta: { 
      fontSize: "0.75rem", 
      color: "#9ca3af", 
      marginBottom: "12px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    },
    cardButton: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      padding: "12px 16px",
      backgroundColor: "#dc2626",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: "14px",
      transition: "all 0.3s ease",
    },
    cardButtonHover: { 
      backgroundColor: "#b91c1c", 
      transform: "translateY(-1px)" 
    },
    cardButtonDisabled: { 
      backgroundColor: "#9ca3af", 
      cursor: "not-allowed", 
      transform: "none" 
    },
    stayInformed: {
      marginTop: "64px",
      backgroundColor: "#eff6ff",
      border: "1px solid #bfdbfe",
      borderRadius: "12px",
      padding: "32px",
      textAlign: "center",
    },
    subscribeForm: {
      display: "flex", 
      flexDirection: window.innerWidth >= 640 ? "row" : "column", 
      gap: "16px", 
      justifyContent: "center", 
      maxWidth: "400px", 
      margin: "0 auto"
    },
    input: {
      flex: 1,
      padding: "12px 16px",
      border: "1px solid #93c5fd",
      borderRadius: "8px",
      outline: "none",
      fontSize: "16px",
      transition: "border-color 0.3s, box-shadow 0.3s",
    },
    subscribeButton: {
      padding: "12px 24px",
      backgroundColor: "#2563eb",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: "16px",
      transition: "background-color 0.3s",
      minWidth: "120px",
    },
    subscribeButtonHover: { backgroundColor: "#1d4ed8" },
    subscribeButtonDisabled: { backgroundColor: "#9ca3af", cursor: "not-allowed" },
    statusMessage: {
      marginTop: "16px",
      fontSize: "14px",
      fontWeight: "500",
      padding: "8px 16px",
      borderRadius: "6px",
      backgroundColor: subscriptionStatus.includes('✅') ? "#dcfce7" : "#fef2f2",
      color: subscriptionStatus.includes('✅') ? "#166534" : "#991b1b",
      border: subscriptionStatus.includes('✅') ? "1px solid #bbf7d0" : "1px solid #fecaca",
    },
  };

  // Combine downloads and static resources
  const allResources = [
    ...downloads.map(download => ({
      ...download,
      icon: FileText,
      isDownloadable: true
    })),
    ...staticResources.map(resource => ({
      ...resource,
      isDownloadable: false
    }))
  ];

  return (
    <section style={styles.section} id="resources">
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={{ ...styles.title, ...styles.titleMd }}>Resources & Downloads</h2>
          <p style={styles.paragraph}>
            Access helpful resources, guides, and tools for emergency preparedness
          </p>
        </div>

        <div style={{ 
          ...styles.grid, 
          gridTemplateColumns: window.innerWidth >= 1024 ? "repeat(3,1fr)" : 
                              window.innerWidth >= 768 ? "repeat(2,1fr)" : "1fr" 
        }}>
          {allResources.map((resource, index) => {
            const IconComponent = resource.icon;
            const isDownloading = downloadingFiles.has(resource.id);
            
            return (
              <div
                key={resource.id || index}
                style={styles.card}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = styles.cardHover.boxShadow;
                  e.currentTarget.style.transform = styles.cardHover.transform;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.transform = "none";
                }}
              >
                <div style={styles.cardHeader}>
                  <IconComponent style={{ color: "#dc2626", width: "32px", height: "32px" }} />
                  <div>
                    <div style={styles.cardTitle}>{resource.title}</div>
                    <div style={styles.cardDescription}>
                      {resource.type} {resource.size && `• ${resource.size}`}
                    </div>
                  </div>
                </div>
                
                <div style={styles.cardContent}>
                  <p style={{ color: "#4b5563", marginBottom: "16px" }}>
                    {resource.description}
                  </p>
                  
                  {resource.isDownloadable ? (
                    <button
                      style={{
                        ...styles.cardButton,
                        ...(isDownloading ? styles.cardButtonDisabled : {})
                      }}
                      onClick={() => handleDownload(resource)}
                      disabled={isDownloading}
                      onMouseEnter={(e) => !isDownloading && (e.currentTarget.style.backgroundColor = styles.cardButtonHover.backgroundColor)}
                      onMouseLeave={(e) => !isDownloading && (e.currentTarget.style.backgroundColor = styles.cardButton.backgroundColor)}
                    >
                      <Download style={{ width: "16px", height: "16px", marginRight: "8px" }} />
                      {isDownloading ? 'Downloading...' : 'Download'}
                    </button>
                  ) : (
                    <button
                      style={styles.cardButton}
                      onClick={() => handleStaticResourceClick(resource)}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = styles.cardButtonHover.backgroundColor)}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = styles.cardButton.backgroundColor)}
                    >
                      {resource.action === "Access" && <ExternalLink style={{ width: "16px", height: "16px", marginRight: "8px" }} />}
                      {resource.action === "Watch" && <Video style={{ width: "16px", height: "16px", marginRight: "8px" }} />}
                      {resource.action}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div style={styles.stayInformed}>
          <h3 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "16px", color: "#1e3a8a" }}>
            Stay Informed
          </h3>
          <p style={{ color: "#1d4ed8", marginBottom: "24px" }}>
            Subscribe to our emergency alerts and updates to stay informed about potential disasters and safety
            information in your area.
          </p>
          
          <form onSubmit={handleSubscribe} style={styles.subscribeForm}>
            <input 
              type="email" 
              placeholder="Enter your email address" 
              style={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
            <button
              type="submit"
              style={{
                ...styles.subscribeButton,
                ...(isLoading ? styles.subscribeButtonDisabled : {})
              }}
              disabled={isLoading}
              onMouseEnter={(e) => !isLoading && (e.currentTarget.style.backgroundColor = styles.subscribeButtonHover.backgroundColor)}
              onMouseLeave={(e) => !isLoading && (e.currentTarget.style.backgroundColor = styles.subscribeButton.backgroundColor)}
            >
              {isLoading ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>

          {subscriptionStatus && (
            <div style={styles.statusMessage}>
              {subscriptionStatus}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
