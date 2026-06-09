import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Wifi,
  WifiOff,
  Signal,
  MapPin,
  History,
  Settings,
  Play,
  Square,
  Search,
  Download,
  Trash2,
  Globe,
  RefreshCw,
  FileCode,
  Check,
  CheckCircle2,
  Info,
  X,
  Satellite,
  Lock,
  ChevronRight,
  Terminal,
  Activity,
  Compass,
  Laptop,
  ShieldAlert,
  Zap
} from "lucide-react";
import { KOTLIN_FILES } from "./kotlinCode";

// Define structured translation types
interface LanguageStrings {
  title: string;
  tagline: string;
  diagnostics: string;
  rsrpLabel: string;
  rsrqLabel: string;
  sinrLabel: string;
  rssiLabel: string;
  cellIdLabel: string;
  operatorLabel: string;
  predictedHoles: string;
  predictionModel: string;
  confidenceLabel: string;
  predictedHolesToggle: string;
  cameroonContext: string;
  gpsLabel: string;
  highAccuracy: string;
  outageGap: string;
  poor: string;
  average: string;
  excellent: string;
  stable: string;
  interference: string;
  premium: string;
  satisfactory: string;
  degraded: string;
  startCollection: string;
  stopCollection: string;
  points: string;
  tracking: string;
  inactive: string;
  gpsLock: string;
  searchPlaceholder: string;
  exportCsv: string;
  exportGeoJson: string;
  legendHeader: string;
  historyTitle: string;
  roomRepo: string;
  noSessions: string;
  synced: string;
  syncNow: string;
  settingsTitle: string;
  langLabel: string;
  ruleLabel: string;
  wifiOnlyLabel: string;
  wifiOnlyDesc: string;
  wifiAntennaLabel: string;
  wifiAntennaDesc: string;
  dbAdminLabel: string;
  dbAdminDesc: string;
  purgeButton: string;
  purgeWarning: string;
  copied: string;
  dlBtn: string;
  descTitle: string;
  termsTitle: string;
  termsSubtitle: string;
  termsBody: string;
  termsAgree: string;
  termsDeny: string;
}

const TRANSLATIONS: Record<string, LanguageStrings> = {
  English: {
    title: "CrowdSenseNet",
    tagline: "Crowdsensed Coverage Prediction",
    diagnostics: "Live Network Diagnostics",
    rsrpLabel: "RSRP (Signal Power)",
    rsrqLabel: "RSRQ (Signal Quality)",
    sinrLabel: "SINR (Noise Ratio)",
    rssiLabel: "RSSI (Received Strength Indicator)",
    cellIdLabel: "Simulated Cell ID",
    operatorLabel: "Active Carrier (Cameroon)",
    predictedHoles: "AI Propagation Holes",
    predictionModel: "Hole Prediction Model",
    confidenceLabel: "Confidence Level",
    predictedHolesToggle: "AI Coverage Holes",
    cameroonContext: "Cameroon Regional Grid",
    gpsLabel: "GPS Status",
    highAccuracy: "High Accuracy (±3.6m)",
    outageGap: "Outage Gap",
    poor: "Poor Signal",
    average: "Average Coverage",
    excellent: "Excellent Coverage",
    stable: "Stable Connection",
    interference: "High Interference",
    premium: "Premium Link",
    satisfactory: "Satisfactory",
    degraded: "Degraded",
    startCollection: "ENGAGE TRACKING NETWORK",
    stopCollection: "HALT CROWD-SENSING",
    points: "readings",
    tracking: "Tracking Coverage",
    inactive: "Recording Inactive",
    gpsLock: "GPS Lock Active",
    searchPlaceholder: "Search Cameroon city or neighborhood...",
    exportCsv: "Export CSV",
    exportGeoJson: "Export GeoJSON",
    legendHeader: "RSRP HEATMAP CAP",
    historyTitle: "Telemetry History",
    roomRepo: "Room DB Repository",
    noSessions: "No recorded sessions discovered.",
    synced: "Synced",
    syncNow: "Sync Now",
    settingsTitle: "Settings & Rules",
    langLabel: "Global App Language",
    ruleLabel: "Transmission Rules",
    wifiOnlyLabel: "WiFi-only uploads",
    wifiOnlyDesc: "Helps conserve mobile subscription data in Cameroon",
    wifiAntennaLabel: "System WiFi Receiver",
    wifiAntennaDesc: "Toggle mobile's simulated hardware antenna",
    dbAdminLabel: "Storage & Administration",
    dbAdminDesc: "Clears and resets the local SQLite Room DB cache schema permanently.",
    purgeButton: "Purge Room Cache Database",
    purgeWarning: "Room database cleared successfully.",
    copied: "Copied source code!",
    dlBtn: "Download File",
    descTitle: "Compose Blueprint Notes",
    termsTitle: "Terms of Service & Privacy Statement",
    termsSubtitle: "CrowdSenseNet Mobile Signal Diagnostics Consent",
    termsBody: "To enable crowdsensed coverage prediction mapping, CrowdSenseNet automatically collects and logs technical network performance telemetry. This includes signal descriptors such as Reference Signal Received Power (RSRP), Reference Signal Received Quality (RSRQ), and Signal-to-Interference-plus-Noise Ratio (SINR), paired alongside fine high-accuracy GPS coordinates. This telemetry is serialized and cached securely inside your local Room SQLite database replica prior to cellular transmission. By interacting with our analytics system, you explicitly agree that this diagnostic telemetry will be consolidated anonymously to improve connection fidelity overlays. No personally identifiable tracking records or private messages are ever collected.",
    termsAgree: "I Agree & Consent to Terms",
    termsDeny: "Decline and Exit Application"
  },
  Français: {
    title: "CrowdSenseNet",
    tagline: "Prédiction de Couverture Participative",
    diagnostics: "Diagnostics Réseau en Direct",
    rsrpLabel: "RSRP (Puissance du Signal)",
    rsrqLabel: "RSRQ (Qualité du Signal)",
    sinrLabel: "SINR (Rapport Signal-Bruit)",
    rssiLabel: "RSSI (Indicateur de Force de Réception)",
    cellIdLabel: "ID Cellule Simulé",
    operatorLabel: "Opérateur Actif (Cameroun)",
    predictedHoles: "Zones d'Ombre IA",
    predictionModel: "Modèle de Prédiction d'Ombre",
    confidenceLabel: "Niveau de Confiance",
    predictedHolesToggle: "Zones Blanches IA",
    cameroonContext: "Grille Régionale Cameroun",
    gpsLabel: "Statut GPS",
    highAccuracy: "Haute Précision (±3.6m)",
    outageGap: "Perte de Couverture",
    poor: "Signal Faible",
    average: "Couverture Moyenne",
    excellent: "Excellente Couverture",
    stable: "Connexion Stable",
    interference: "Forte Interférence",
    premium: "Liaison Premium",
    satisfactory: "Satisfaisant",
    degraded: "Dégradé",
    startCollection: "ACTIVER LA COLLECTE",
    stopCollection: "ARRÊTER LA COLLECTE",
    points: "mesures",
    tracking: "Suivi de Couverture Actif",
    inactive: "Enregistrement Inactif",
    gpsLock: "Verrouillage GPS Actif",
    searchPlaceholder: "Rechercher une ville ou quartier...",
    exportCsv: "Exporter en CSV",
    exportGeoJson: "Exporter en GeoJSON",
    legendHeader: "HEATMAP RSRP SEC",
    historyTitle: "Historique Télémétrique",
    roomRepo: "Dépôt Room DB",
    noSessions: "Aucun historique de session disponible.",
    synced: "Synchronisé",
    syncNow: "Sinc. Maintenant",
    settingsTitle: "Paramètres & Règles",
    langLabel: "Langue de l'application",
    ruleLabel: "Règles de Transmission",
    wifiOnlyLabel: "Téléchargement WiFi-uniquement",
    wifiOnlyDesc: "Permet d'économiser votre forfait mobile au Cameroun",
    wifiAntennaLabel: "Récepteur WiFi Interne",
    wifiAntennaDesc: "Changer l'état matériel de l'antenne",
    dbAdminLabel: "Stockage & Administration",
    dbAdminDesc: "Efface définitivement le cache local de la base SQLite Room.",
    purgeButton: "Purger la Base Locale Room",
    purgeWarning: "Base de données Room purgée.",
    copied: "Code source copié !",
    dlBtn: "Télécharger",
    descTitle: "Notes de Conception Compose",
    termsTitle: "Conditions d'Utilisation & Déclaration de Confidentialité",
    termsSubtitle: "Consentement de Diagnostic des Signaux Mobiles CrowdSenseNet",
    termsBody: "Afin de permettre la prédiction participative de la couverture réseau, CrowdSenseNet collecte et enregistre automatiquement les données de performance technique de votre réseau. Cela inclut des indicateurs de puissance RSRP, de qualité RSRQ et de rapport signal-bruit SINR, associés à des coordonnées GPS de haute précision. Ces données télémétriques sont sérialisées et mises en cache de manière sécurisée dans la copie locale de votre base SQLite Room avant leur transmission. En interagissant avec notre système, vous consentez explicitement à ce que ces données anonymisées soient synthétisées pour affiner les cartes de couverture. Aucune information d'identification personnelle n'est collectée.",
    termsAgree: "J'accepte et je consens aux conditions",
    termsDeny: "Refuser et quitter l'application"
  }
};

// Heatmap Coordinate Structure
interface Heatpoint {
  lat: number;
  lng: number;
  rsrp: number;
}

// History Session Structure
interface SessionRecord {
  id: string;
  date: string;
  duration: string;
  readingCount: number;
  isSynced: boolean;
}

// Elegant, precise SVG vector representation of CrowdSenseNet logo replicating the crescent orb and connected crowd node mesh.
export function CrowdSenseNetLogo({ className = "", size = 38 }: { className?: string; size?: number }) {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 rotate-45" style={{ transform: "rotate(45deg)" }}>
        <defs>
          <linearGradient id="orbGrad" x1="10" y1="10" x2="110" y2="110" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0D1B4C" />
            <stop offset="60%" stopColor="#005B94" />
            <stop offset="100%" stopColor="#00B8A9" />
          </linearGradient>
          <linearGradient id="glowGrad" x1="40" y1="40" x2="80" y2="80" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00B8A9" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0D1B4C" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Dynamic Connected mesh grid lines */}
        <path d="M 60 22 L 35 52 L 85 52 Z" stroke="#00B8A9" strokeWidth="1.2" strokeOpacity="0.5" strokeDasharray="1.5 1.5" />
        <path d="M 35 52 L 45 88 L 75 88 L 85 52 Z" stroke="#005B94" strokeWidth="1.2" strokeOpacity="0.5" />
        <path d="M 60 22 L 45 88 L 60 70 L 75 88 L 60 22 Z" stroke="#0D1B4C" strokeWidth="1" strokeOpacity="0.4" />
        
        {/* Luminous Core glow */}
        <circle cx="60" cy="55" r="10" fill="url(#glowGrad)" className="animate-pulse" />
        <circle cx="60" cy="55" r="4" fill="#00B8A9" />

        {/* Linked Vertices nodes */}
        <circle cx="60" cy="22" r="3.5" fill="#0D1B4C" stroke="#fff" strokeWidth="1" />
        <circle cx="35" cy="52" r="3.5" fill="#005B94" stroke="#fff" strokeWidth="1" />
        <circle cx="85" cy="52" r="3.5" fill="#00B8A9" stroke="#fff" strokeWidth="1" />
        <circle cx="45" cy="88" r="4.5" fill="#0D1B4C" stroke="#fff" strokeWidth="1" />
        <circle cx="75" cy="88" r="4.5" fill="#000" stroke="#fff" strokeWidth="1" />
        <circle cx="60" cy="70" r="3" fill="#005B94" stroke="#fff" strokeWidth="1" />

        {/* Crescent outer sweeping orbit */}
        <path d="M 23 48 A 40 40 0 1 0 97 48 A 36 36 0 1 1 23 48 Z" fill="url(#orbGrad)" />

        {/* Humanoid 1 (Top) representing crowd-sensing participant */}
        <circle cx="60" cy="13" r="6.5" fill="#0D1B4C" stroke="#fff" strokeWidth="1" />
        
        {/* Humanoid 2 (Left) */}
        <circle cx="17" cy="55" r="6.5" fill="#005B94" stroke="#fff" strokeWidth="1" />
        
        {/* Humanoid 3 (Bottom Left) */}
        <circle cx="23" cy="84" r="6.5" fill="#00B8A9" stroke="#fff" strokeWidth="1" />
      </svg>
      <div>
        <div className="flex items-center leading-none">
          <span className="text-lg font-black tracking-tight text-[#0D1B4C]">Crowd</span>
          <span className="text-lg font-bold tracking-tight text-[#00B8A9]">SenseNet</span>
        </div>
        <div className="text-[8px] font-bold tracking-widest text-slate-500 uppercase mt-0.5 leading-none">
          CONNECTED INTELLIGENCE & ANALYTICS
        </div>
      </div>
    </div>
  );
}

export default function App() {
  // Simulator States
  const [activeScreen, setActiveScreen] = useState<"splash" | "home" | "map" | "history" | "settings">("splash");
  const [lang, setLang] = useState<"English" | "Français">("English");
  const t = TRANSLATIONS[lang];

  // User Consent & Terms Acceptance States
  const [termsAccepted, setTermsAccepted] = useState<boolean | null>(null);
  const [termsDeclined, setTermsDeclined] = useState<boolean>(false);
  const [logoLoadError, setLogoLoadError] = useState<boolean>(false);

  // Simulated metrics
  const [operator, setOperator] = useState<"MTN Cameroon" | "Orange Cameroun" | "Nexttel" | "Camtel">("MTN Cameroon");
  const [rsrp, setRsrp] = useState<number>(-78);
  const [rsrq, setRsrq] = useState<number>(-11);
  const [sinr, setSinr] = useState<number>(14);
  const [rssi, setRssi] = useState<number>(-55);
  const [cellId, setCellId] = useState<string>("624-01-38294");
  const [isCollecting, setIsCollecting] = useState<boolean>(false);
  const [currentReadingsCount, setCurrentReadingsCount] = useState<number>(0);
  const [gpsLocked, setGpsLocked] = useState<boolean>(true);
  const [isWifiEnabled, setIsWifiEnabled] = useState<boolean>(true);
  const [wifiOnly, setWifiOnly] = useState<boolean>(true);
  const [predictionOverlay, setPredictionOverlay] = useState<boolean>(true);
  
  // Custom alerts triggers
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Plotted coordinates dictionary (for Cameroon cities/sectors)
  const [heatpoints, setHeatpoints] = useState<Heatpoint[]>([
    { lat: 3.8480, lng: 11.5021, rsrp: -78 },   // MTN - Yaoundé Centre (Excellent)
    { lat: 3.8962, lng: 11.5098, rsrp: -68 },   // Bastos (Excellent)
    { lat: 3.8710, lng: 11.4980, rsrp: -105 },  // Mokolo Market (Poor)
    { lat: 3.8210, lng: 11.5170, rsrp: -118 },  // Mvan Sector (Coverage Hole Shadow)
    { lat: 3.8833, lng: 11.5333, rsrp: -85 },   // Omnisports (Good)
    { lat: 4.0511, lng: 9.7679, rsrp: -75 },    // Orange - Douala Akwa (Excellent)
    { lat: 4.0432, lng: 9.7024, rsrp: -115 },   // Douala Port Shadow (Coverage Hole Gap)
    { lat: 4.1542, lng: 9.2415, rsrp: -92 },    // Buea Molyko (Average)
    { lat: 4.1620, lng: 9.2310, rsrp: -121 },   // Mount Cameroon slope shadow (Coverage Hole)
  ]);

  // Saved Session Records (Room DB logic in Local Storage)
  const [sessions, setSessions] = useState<SessionRecord[]>([]);

  // Coordinates centering variables
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat: 3.8480, lng: 11.5021 });
  const [searchQuery, setSearchQuery] = useState<string>("Yaoundé Sector");

  // IDE states
  const [selectedFile, setSelectedFile] = useState<keyof typeof KOTLIN_FILES>("SplashScreen.kt");
  const [copiedStatus, setCopiedStatus] = useState<boolean>(false);
  const [searchTermCode, setSearchTermCode] = useState<string>("");

  // Sync animation triggers
  const [syncingInterval, setSyncingInterval] = useState<string | null>(null);

  // Background generator loop for active tracks
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCollecting) {
      interval = setInterval(() => {
        // Shift values slightly to simulate dynamic cell signal walk
        setRsrp(prev => {
          const shift = Math.floor(Math.random() * 11) - 5;
          const nextVal = Math.max(-140, Math.min(-40, prev + shift));
          return nextVal;
        });
        setRsrq(prev => {
          const shift = Math.floor(Math.random() * 5) - 2;
          return Math.max(-20, Math.min(-3, prev + shift));
        });
        setSinr(prev => {
          const shift = Math.floor(Math.random() * 7) - 3;
          return Math.max(-10, Math.min(30, prev + shift));
        });
        setRssi(prev => {
          const shift = Math.floor(Math.random() * 11) - 5;
          return Math.max(-115, Math.min(-30, prev + shift));
        });
        setCellId(() => {
          // Generate realistic Cameroon MNC based on active operator
          const mnc = operator === "MTN Cameroon" ? "01" :
                      operator === "Orange Cameroun" ? "02" :
                      operator === "Camtel" ? "03" : "04";
          const cellSuffix = Math.floor(10000 + Math.random() * 90000);
          return `624-${mnc}-${cellSuffix}`;
        });

        // Add telemetry point to heatpoints centered around our active map coordinate
        setHeatpoints(prev => {
          const newLat = mapCenter.lat + (Math.random() * 0.015 - 0.0075);
          const newLng = mapCenter.lng + (Math.random() * 0.015 - 0.0075);
          return [...prev, { lat: newLat, lng: newLng, rsrp: Math.floor(Math.random() * 100) - 140 }];
        });

        setCurrentReadingsCount(prev => prev + 1);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isCollecting, mapCenter, operator]);

  // Auto-redirect simulator splash view to home feed after mock delay
  useEffect(() => {
    if (activeScreen === "splash") {
      const timer = setTimeout(() => {
        setActiveScreen("home");
        setSelectedFile("HomeScreen.kt");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [activeScreen]);

  // Synchronize IDE tabs automatically when clicking routes inside simulator
  const handleNavClick = (screen: "home" | "map" | "history" | "settings") => {
    setActiveScreen(screen);
    // Align source code view tab for smart UX
    switch (screen) {
      case "home":
        setSelectedFile("HomeScreen.kt");
        break;
      case "map":
        setSelectedFile("MapScreen.kt");
        break;
      case "history":
        setSelectedFile("HistoryScreen.kt");
        break;
      case "settings":
        setSelectedFile("SettingsScreen.kt");
        break;
    }
  };

  // Prepopulate local storage with default Room records and check user terms consent
  useEffect(() => {
    // Check initial terms acceptance status from local storage
    const accepted = localStorage.getItem("crowdsensenet_terms_accepted");
    if (accepted === "true") {
      setTermsAccepted(true);
    } else {
      // If null/not set or explicitly false, display terms consent choice on startup
      setTermsAccepted(false);
    }

    const saved = localStorage.getItem("crowdsensenet_sessions");
    if (saved) {
      setSessions(JSON.parse(saved));
    } else {
      const defaultLogs: SessionRecord[] = [
        { id: "1", date: "June 7, 2026, 11:15 AM", duration: "12m 4s", readingCount: 124, isSynced: true },
        { id: "2", date: "June 6, 2026, 03:40 PM", duration: "8m 15s", readingCount: 82, isSynced: true },
        { id: "3", date: "June 5, 2026, 09:20 AM", duration: "25m 40s", readingCount: 310, isSynced: false },
        { id: "4", date: "June 3, 2026, 01:10 PM", duration: "4m 52s", readingCount: 41, isSynced: true }
      ];
      localStorage.setItem("crowdsensenet_sessions", JSON.stringify(defaultLogs));
      setSessions(defaultLogs);
    }
  }, []);

  // Sync function writing local session back
  const launchSessionCollectToggle = () => {
    if (isCollecting) {
      // Create session from logs
      const durationSeconds = currentReadingsCount * 3;
      const formattedDuration = `${Math.floor(durationSeconds / 60)}m ${durationSeconds % 60}s`;
      const dateText = new Date().toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true
      });
      
      const newSession: SessionRecord = {
        id: String(Date.now()),
        date: dateText,
        duration: formattedDuration === "0m 0s" ? "2m 14s" : formattedDuration,
        readingCount: currentReadingsCount === 0 ? 38 : currentReadingsCount,
        isSynced: false
      };

      const updated = [newSession, ...sessions];
      setSessions(updated);
      localStorage.setItem("crowdsensenet_sessions", JSON.stringify(updated));
      setIsCollecting(false);
      setCurrentReadingsCount(0);
      setToastMessage(lang === "English" ? "Session cached into Room Database." : "Session enregistrée dans Room SQLite.");
    } else {
      setIsCollecting(true);
      setCurrentReadingsCount(0);
    }
  };

  // CSV Geo-metrics Dynamic Dataset Generator
  const triggerCsvDatasetDownload = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Latitude,Longitude,RSRP_dBm,Signal_Status,Quality_Tag"].join(",") + "\n"
      + heatpoints.map(p => {
          let tag = "Excellent";
          if (p.rsrp < -110) tag = "Gap Hole";
          else if (p.rsrp < -100) tag = "Poor";
          else if (p.rsrp < -85) tag = "Average";
          return `${p.lat.toFixed(5)},${p.lng.toFixed(5)},${p.rsrp},${getRsrpText(p.rsrp)},${tag}`;
        }).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `crowdsensenet_${searchQuery.toLowerCase() || "coverage"}_dump.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setToastMessage(lang === "English" ? "CSV dump exported successfully." : "Export CSV terminé avec succès.");
  };

  // GeoJSON Dynamic Dataset Generator
  const triggerGeoJsonDatasetDownload = () => {
    const geoJson = {
      type: "FeatureCollection",
      generator: "CrowdSenseNet Tracker",
      features: heatpoints.map((p, idx) => ({
        type: "Feature",
        id: idx,
        properties: {
          rsrp: p.rsrp,
          status: getRsrpText(p.rsrp),
        },
        geometry: {
          type: "Point",
          coordinates: [p.lng, p.lat]
        }
      }))
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(geoJson, null, 2));
    const dlAnchor = document.createElement("a");
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `crowdsensenet_${searchQuery.toLowerCase() || "coverage"}_spatial.geojson`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    document.body.removeChild(dlAnchor);
    setToastMessage(lang === "English" ? "GeoJSON structured map downloaded." : "JSON Spatial géolocalisé exporté.");
  };

  // Syncing action simulating API calls
  const triggerOnlineSyncAction = (id: string) => {
    if (!isWifiEnabled && wifiOnly) {
      setToastMessage(
        lang === "English"
          ? "Sync aborted: Device offline + WiFi-Only toggle active!"
          : "Échec : L'appareil est déconnecté du réseau WiFi !"
      );
      return;
    }
    setSyncingInterval(id);
    setTimeout(() => {
      const updated = sessions.map(s => (s.id === id ? { ...s, isSynced: true } : s));
      setSessions(updated);
      localStorage.setItem("crowdsensenet_sessions", JSON.stringify(updated));
      setSyncingInterval(null);
      setToastMessage(
        lang === "English"
          ? "Telemetry payload uploaded safely."
          : "Données téléchargeables transmises avec succès."
      );
    }, 1500);
  };

  // Clear / Purge the Room database (localStorage)
  const purgeRoomDatabaseCache = () => {
    setSessions([]);
    localStorage.removeItem("crowdsensenet_sessions");
    setToastMessage(t.purgeWarning);
  };

  // Search cities handler changing GPS coordinates & injecting new telemetry points
  const fireMapQuerySearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    
    // Simulate latitude lookup boundaries based on input keyword
    let targetCoords = { lat: 3.8480, lng: 11.5021 }; // default Yaoundé
    const query = searchQuery.toLowerCase();
    
    if (query.includes("douala") || query.includes("akwa") || query.includes("bonapriso") || query.includes("deido") || query.includes("bonanjo")) {
      targetCoords = { lat: 4.0511, lng: 9.7679 };
    } else if (query.includes("buea") || query.includes("molyko")) {
      targetCoords = { lat: 4.1542, lng: 9.2415 };
    } else if (query.includes("garoua")) {
      targetCoords = { lat: 9.3015, lng: 13.3935 };
    } else if (query.includes("maroua")) {
      targetCoords = { lat: 10.5966, lng: 14.3160 };
    } else if (query.includes("bamenda")) {
      targetCoords = { lat: 5.9631, lng: 10.1591 };
    } else if (query.includes("bafoussam")) {
      targetCoords = { lat: 5.4778, lng: 10.4173 };
    } else if (query.includes("kribi")) {
      targetCoords = { lat: 2.9506, lng: 9.9084 };
    } else if (query.includes("limbe") || query.includes("limbê")) {
      targetCoords = { lat: 4.0244, lng: 9.2149 };
    } else if (query.includes("bastos") || query.includes("mokolo") || query.includes("mvan") || query.includes("omnisports") || query.includes("yaounde") || query.includes("yaoundé")) {
      targetCoords = { lat: 3.8480, lng: 11.5021 };
    } else {
      // Small shift relative to Yaoundé for unknown Cameroon queries to maintain realistic national mapping
      targetCoords = {
        lat: 3.5 + Math.random() * 2,
        lng: 10.5 + Math.random() * 2
      };
    }

    setMapCenter(targetCoords);
    
    // Auto populate fresh random cells mapping signals around target
    const generatedPoints: Heatpoint[] = Array.from({ length: 12 }).map((_, i) => {
      // Introduce an intentional predictive shadow gap (RSRP < -110) occasionally
      const rsrpVal = i % 4 === 0 
        ? Math.floor(Math.random() * 15) - 130  // -130 to -115 (Coverage Shadow Block)
        : Math.floor(Math.random() * 66) - 100; // -100 to -34 (Strong/Average)
      return {
        lat: targetCoords.lat + (Math.random() * 0.02 - 0.01),
        lng: targetCoords.lng + (Math.random() * 0.02 - 0.01),
        rsrp: rsrpVal
      };
    });

    setHeatpoints(generatedPoints);
    setToastMessage(
      lang === "English" 
        ? `Loaded metrics for ${searchQuery} zone` 
        : `Signaux chargés pour la zone ${searchQuery}`
    );
  };

  // Copy to clipboard helper
  const copyFileToClipboard = (filename: keyof typeof KOTLIN_FILES) => {
    navigator.clipboard.writeText(KOTLIN_FILES[filename]);
    setCopiedStatus(true);
    setTimeout(() => setCopiedStatus(false), 2000);
  };

  // Download raw file handler
  const triggerRawFileDownload = (filename: string, content: string) => {
    const dataBlob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(dataBlob);
    const downloadAnchor = document.createElement("a");
    downloadAnchor.href = url;
    downloadAnchor.download = filename;
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
  };

  // Helper strings mapping values for colors & statuses
  function getRsrpText(dbm: number) {
    if (dbm >= -85) return t.excellent;
    if (dbm >= -100) return t.average;
    if (dbm >= -110) return t.poor;
    return t.outageGap;
  }

  function getRsrpUiColor(dbm: number) {
    if (dbm >= -85) return "text-[#00B8A9] bg-[#00B8A9]/10 border-[#00B8A9]/30 font-bold";
    if (dbm >= -100) return "text-amber-600 bg-amber-50 border-amber-200 font-bold";
    if (dbm >= -110) return "text-rose-600 bg-rose-50 border-rose-200 font-bold";
    return "text-[#0D1B4C] bg-slate-100 border-slate-300 font-bold";
  }

  function getRsrpSignalIcon(dbm: number) {
    if (dbm >= -85) return "bg-[#00B8A9]";
    if (dbm >= -100) return "bg-amber-500";
    if (dbm >= -110) return "bg-rose-500";
    return "bg-[#0D1B4C]";
  }

  // Auto highlighted text generator for visual IDE
  const highlightKotlinSyntax = (code: string) => {
    const lines = code.split("\n");
    return lines.map((line, idx) => {
      // Basic syntax highlight regex swaps
      let hl = line
        .replace(/(package|import|sealed|object|val|val|fun|class|private|init|when|else|return|var)/g, '<span class="text-blue-600 font-semibold">$1</span>')
        .replace(/(@Composable|@OptIn|@Composable)/g, '<span class="text-sky-600">$1</span>')
        .replace(/(\".*?\")/g, '<span class="text-amber-600">$1</span>')
        .replace(/(\/\/.*)/g, '<span class="text-slate-400 font-normal italic">$1</span>');
        
      return (
        <div key={idx} className="table-row">
          <span className="table-cell text-right pr-4 text-slate-300 select-none text-xs w-8">{idx + 1}</span>
          <span className="table-cell whitespace-pre font-mono text-sm leading-6" dangerouslySetInnerHTML={{ __html: hl }} />
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans flex flex-col selection:bg-[#00B8A9] selection:text-white">
      {/* Top Professional Header Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 py-3 px-6 shrink-0 shadow-xs">
        <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {!logoLoadError ? (
              <img 
                src="/assets/logo.png" 
                onError={() => setLogoLoadError(true)} 
                className="h-10 object-contain max-w-[280px]" 
                referrerPolicy="no-referrer"
                alt="Logo"
              />
            ) : null}
            {logoLoadError && <CrowdSenseNetLogo size={42} />}
            <span className="text-[10px] uppercase tracking-wider font-mono font-bold bg-[#0D1B4C]/5 text-[#0D1B4C] border border-slate-200 rounded px-1.5 py-0.5">MVVM COMPOSE</span>
          </div>

          {/* Quick Stats Banner */}
          <div className="hidden lg:flex items-center gap-4 text-xs text-slate-600">
            <div className="flex items-center gap-2 bg-[#F5F7FA] px-3.5 py-1.5 rounded-full border border-slate-200">
              <Compass className="h-3.5 w-3.5 text-[#00B8A9]" />
              <span>Sim GPS Location: <strong className="font-mono text-[#0D1B4C]">{mapCenter.lat.toFixed(4)}, {mapCenter.lng.toFixed(4)}</strong></span>
            </div>
            <div className="flex items-center gap-2 bg-[#F5F7FA] px-3.5 py-1.5 rounded-full border border-slate-200">
              <Activity className="h-3.5 w-3.5 text-[#00B8A9]" />
              <span>DB Readings Cache: <strong className="font-mono text-[#0D1B4C]">{heatpoints.length} cells</strong></span>
            </div>
            <div className="flex items-center gap-2 bg-[#F5F7FA] px-3.5 py-1.5 rounded-full border border-slate-200">
              <Laptop className="h-3.5 w-3.5 text-[#00B8A9]" />
              <span>Target: <strong className="font-mono text-[#0D1B4C]">Kotlin 1.9 & Compose v1.5</strong></span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Responsive Grid Layout */}
      <main className="flex-1 w-full max-w-[1700px] mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch overflow-hidden">
        
        {/* Left Side: Mobile Phone Simulator Panel - taking 5 columns */}
        <div className="lg:col-span-5 flex flex-col items-center justify-start min-h-[750px] lg:min-h-[820px] bg-[#F5F7FA] rounded-2xl border border-slate-200 p-6 relative overflow-hidden shadow-xs">
          {/* Subtle background ambient reflections */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#00B8A9]/5 rounded-full filter blur-[100px] pointer-events-none" />
          <div className="absolute bottom-10 left-10 w-64 h-64 bg-[#0D1B4C]/5  rounded-full filter blur-[80px] pointer-events-none" />

          {/* Top controller buttons on mobile simulation envelope */}
          <div className="w-full flex justify-between items-center mb-4 shrink-0 z-10">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[#00B8A9] animate-ping" />
              <span className="text-xs text-slate-500 font-mono tracking-wider">COMPOSE REAL-TIME VIEW</span>
            </div>
            
            {/* Direct English/French Toggle Selector on Mobile UI Wrapper */}
            <div className="flex items-center gap-1.5 bg-[#FFFFFF] border border-slate-200 rounded-lg p-0.5 shadow-xs">
              <button
                onClick={() => setLang("English")}
                className={`text-[10px] font-bold px-2.5 py-1 rounded-md transition-all ${
                  lang === "English" ? "bg-[#0D1B4C] text-white shadow-sm" : "text-slate-400 hover:text-[#0D1B4C]"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang("Français")}
                className={`text-[10px] font-bold px-2.5 py-1 rounded-md transition-all ${
                  lang === "Français" ? "bg-[#0D1B4C] text-white shadow-sm" : "text-slate-400 hover:text-[#0D1B4C]"
                }`}
              >
                FR
              </button>
            </div>
          </div>

          {/* Interactive Android Device Body Grid with elegant Dark Navy bezel */}
          <div className="w-full max-w-[365px] aspect-[9/19] bg-white border-[10px] border-[#0D1B4C] rounded-[48px] shadow-2xl relative flex flex-col overflow-hidden ring-1 ring-slate-200 shrink-0">
            
            {/* Top Ear Speaker Notch Bar */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-36 bg-[#0D1B4C] rounded-b-2xl z-30 flex items-center justify-center p-1">
              <div className="h-1.5 w-12 bg-slate-800 rounded-full" />
              <div className="h-2 w-2 bg-slate-900 rounded-full ml-3" />
            </div>

            {/* Main Interactive Screen Frame Body */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden bg-white text-slate-900 relative flex flex-col font-sans">
              
              <AnimatePresence mode="wait">
                {/* SPLASH VIEW SCREEN */}
                {activeScreen === "splash" && (
                  <motion.div
                    key="splash"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 bg-[#0D1B4C] flex flex-col items-center justify-center p-6 text-center select-none z-10"
                  >
                    {/* Animated signal ripple orbits using secondary Teal */}
                    <div className="relative mb-6 flex items-center justify-center h-28 w-28">
                      <div className="absolute inset-0 bg-[#00B8A9]/10 rounded-full animate-ping-slow" />
                      <div className="absolute inset-2 bg-[#00B8A9]/20 rounded-full animate-pulse" />
                      <div className="h-18 w-18 bg-slate-950 border-2 border-[#00B8A9] rounded-full flex items-center justify-center shadow-lg">
                        <Signal className="h-8 w-8 text-[#00B8A9]" />
                      </div>
                    </div>

                    <div className="logo-section mb-2">
                       <h2 className="text-white font-bold text-2xl tracking-tight flex items-center justify-center gap-1">
                         <span>Crowd</span><span className="text-[#00B8A9]">SenseNet</span>
                       </h2>
                       <p className="text-[9px] uppercase tracking-wider font-mono text-[#00B8A9] font-semibold">CONNECTED INTELLIGENCE</p>
                    </div>
                    <p className="text-slate-300 font-medium text-[11px] mt-2 uppercase tracking-wide px-3 leading-snug">
                      {t.tagline}
                    </p>

                    <button
                      onClick={() => handleNavClick("home")}
                      className="mt-12 text-[10px] text-slate-300 hover:text-white uppercase tracking-wider font-mono bg-slate-900 px-3 py-1.5 rounded-full border border-[#00B8A9]/30"
                    >
                      Skip Splash ⚡
                    </button>
                  </motion.div>
                )}

                {/* HOME DASHBOARD SCREEN */}
                {activeScreen === "home" && (
                  <motion.div
                    key="home"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-3.5 flex flex-col justify-between flex-1 overflow-y-auto"
                  >
                    <div>
                      {/* Section Title */}
                      <div className="mb-3">
                        <h3 className="text-slate-900 font-display text-base font-bold tracking-tight">
                          {t.diagnostics}
                        </h3>
                        <p className="text-[10px] text-slate-500">Live MVVM active state models</p>
                      </div>

                      {/* Operator Dropdown Selector */}
                      <div className="bg-[#0D1B4C]/5 border border-[#0D1B4C]/15 rounded-xl p-2 mb-3">
                        <label className="text-[9px] font-bold text-[#0D1B4C] uppercase tracking-wider block mb-1">
                          {t.operatorLabel}
                        </label>
                        <select
                          value={operator}
                          onChange={(e) => {
                            const selectedOp = e.target.value as "MTN Cameroon" | "Orange Cameroun" | "Nexttel" | "Camtel";
                            setOperator(selectedOp);
                            // Shift initial cell values based on operator characteristics
                            const mnc = selectedOp === "MTN Cameroon" ? "01" :
                                        selectedOp === "Orange Cameroun" ? "02" :
                                        selectedOp === "Camtel" ? "03" : "04";
                            setCellId(`624-${mnc}-${Math.floor(10000 + Math.random() * 90000)}`);
                            setToastMessage(lang === "English" 
                              ? `Switched to ${selectedOp} (MCC: 624, MNC: ${mnc})`
                              : `Passage à ${selectedOp} (MCC: 624, MNC: ${mnc})`
                            );
                          }}
                          className="w-full text-xs font-semibold py-1 bg-white border border-slate-200 rounded-md text-slate-800 shadow-xs cursor-pointer focus:outline-hidden"
                        >
                          <option value="MTN Cameroon">MTN Cameroon (4G LTE)</option>
                          <option value="Orange Cameroun">Orange Cameroun (4G+)</option>
                          <option value="Camtel">Camtel (Fako LTE)</option>
                          <option value="Nexttel">Nexttel (3G/4G HSPA)</option>
                        </select>
                      </div>

                      {/* Display Cell ID & RSSI */}
                      <div className="grid grid-cols-2 gap-2.5 mb-3">
                        <div className="bg-slate-50 rounded-xl border border-slate-200 p-2.5 shadow-2xs">
                          <span className="text-[9px] text-slate-500 uppercase tracking-wide font-medium block">
                            {t.cellIdLabel}
                          </span>
                          <span className="text-xs font-bold font-mono text-[#0D1B4C] block mt-0.5">
                            {cellId}
                          </span>
                        </div>
                        <div className="bg-slate-50 rounded-xl border border-slate-200 p-2.5 shadow-2xs">
                          <span className="text-[9px] text-slate-500 uppercase tracking-wide font-medium block">
                            {t.rssiLabel}
                          </span>
                          <span className="text-xs font-bold font-mono text-[#0D1B4C] block mt-0.5">
                            {rssi} dBm
                          </span>
                        </div>
                      </div>

                      {/* Power Metric (RSRP) Row - detailed visual rendering */}
                      <div className="bg-white rounded-xl border border-slate-200 p-2.5 shadow-2xs mb-2.5">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] text-slate-500 uppercase tracking-wide font-medium">{t.rsrpLabel}</span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${getRsrpUiColor(rsrp)}`}>
                            {getRsrpText(rsrp)}
                          </span>
                        </div>
                        <div className="flex items-end justify-between">
                          <span className="text-xl font-extrabold font-mono tracking-tight text-slate-900">
                            {rsrp} <span className="text-[10px] font-normal text-slate-500">dBm</span>
                          </span>
                          {/* Speedometer line gauge representing -140 to -40 range */}
                          <div className="w-20 bg-slate-100 h-1.5 rounded-full overflow-hidden flex">
                            <div 
                              className={`h-full ${getRsrpSignalIcon(rsrp)} transition-all duration-300`} 
                              style={{ width: `${Math.max(5, Math.min(100, ((rsrp + 140) / 100) * 100))}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Quality Metric (RSRQ) Row */}
                      <div className="bg-white rounded-xl border border-slate-200 p-2.5 shadow-2xs mb-2.5">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] text-slate-500 uppercase tracking-wide font-medium">{t.rsrqLabel}</span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                            rsrq >= -10 ? "text-emerald-600 bg-emerald-50 border-emerald-100" :
                            rsrq >= -15 ? "text-amber-500 bg-amber-50 border-amber-100" :
                            "text-rose-500 bg-rose-50 border-rose-100"
                          }`}>
                            {rsrq >= -10 ? t.excellent : rsrq >= -15 ? t.satisfactory : t.degraded}
                          </span>
                        </div>
                        <div className="flex items-end justify-between">
                          <span className="text-lg font-bold font-mono text-slate-800">
                            {rsrq} <span className="text-[10px] font-normal text-slate-500">dB</span>
                          </span>
                          <div className="w-20 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-300 ${rsrq >= -10 ? "bg-emerald-500" : rsrq >= -15 ? "bg-amber-400" : "bg-rose-500"}`}
                              style={{ width: `${Math.max(5, Math.min(100, ((rsrq + 20) / 17) * 100))}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Noise Ratio Metric (SINR) Row */}
                      <div className="bg-white rounded-xl border border-slate-200 p-2.5 shadow-2xs mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] text-slate-500 uppercase tracking-wide font-medium">{t.sinrLabel}</span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                            sinr >= 15 ? "text-emerald-600 bg-emerald-50 border-emerald-100" :
                            sinr >= 5 ? "text-amber-600 bg-amber-50 border-amber-100" :
                            "text-rose-600 bg-rose-50 border-rose-100"
                          }`}>
                            {sinr >= 15 ? t.premium : sinr >= 5 ? t.stable : t.interference}
                          </span>
                        </div>
                        <div className="flex items-end justify-between">
                          <span className="text-lg font-bold font-mono text-slate-800">
                            {sinr} <span className="text-[10px] font-normal text-slate-500">dB</span>
                          </span>
                          <div className="w-20 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-300 ${sinr >= 15 ? "bg-emerald-500" : sinr >= 5 ? "bg-amber-400" : "bg-rose-500"}`}
                              style={{ width: `${Math.max(5, Math.min(100, ((sinr + 10) / 40) * 100))}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Orbit / GPS Satellite Hardware Card */}
                      <div className="bg-amber-500/5 border border-amber-350/30 rounded-xl p-3 mb-3 flex items-start gap-2.5">
                        <div className="h-7 w-7 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600 self-center shrink-0">
                          <Lock className="h-4 w-4 animate-bounce" />
                        </div>
                        <div>
                          <h4 className="text-[12px] font-bold text-slate-800 flex items-center gap-1.5">
                            {t.gpsLock}
                          </h4>
                          <p className="text-[10px] text-slate-500 leading-normal">{t.highAccuracy}</p>
                        </div>
                      </div>

                      {/* Logger passive tracker cache count display */}
                      <div className={`p-3 rounded-xl border transition-all ${
                        isCollecting ? "bg-blue-50 border-blue-200" : "bg-slate-100 border-slate-200"
                      }`}>
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-[12px] font-bold text-slate-800 block">
                              {isCollecting ? t.tracking : t.inactive}
                            </span>
                            <span className="text-[10px] text-slate-500">Passive Room Storage Cache</span>
                          </div>
                          <span className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded-md text-white ${
                            isCollecting ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                          }`}>
                            {currentReadingsCount} {t.points}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom main interaction start/stop collect bounds */}
                    <div className="mt-6 pt-3 shrink-0">
                      <button
                        onClick={launchSessionCollectToggle}
                        className={`w-full py-3 px-4 rounded-xl font-bold text-[13px] tracking-wide transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer ${
                          isCollecting 
                            ? "bg-rose-500 text-white hover:bg-rose-600 active:scale-98" 
                            : "bg-blue-900 text-white hover:bg-blue-950 active:scale-98"
                        }`}
                      >
                        {isCollecting ? <Square className="h-4 w-4 fill-white" /> : <Play className="h-4 w-4 fill-white" />}
                        {isCollecting ? t.stopCollection : t.startCollection}
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* COVERAGE MAP HEATMAP SCREEN */}
                {activeScreen === "map" && (
                  <motion.div
                    key="map"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col flex-1 h-full min-h-[440px] relative font-sans"
                  >
                    {/* Floating Form Overlay */}
                    <form onSubmit={fireMapQuerySearch} className="absolute top-2 left-2 right-2 z-20 p-0.5">
                      <div className="relative flex shadow-md rounded-lg">
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder={t.searchPlaceholder}
                          className="w-full text-xs py-2 pl-8 pr-12 bg-white text-slate-800 font-sans border border-slate-300 rounded-lg shadow-inner focus:outline-hidden focus:ring-1 focus:ring-blue-900 focus:border-blue-900"
                        />
                        <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                        <button type="submit" className="absolute right-1 top-1 bg-[#0D1B4C] text-white text-[9px] font-bold px-2 py-1 rounded-md hover:bg-slate-950">
                          GO
                        </button>
                      </div>
                    </form>

                    {/* Simulation Map Canvas with micro roads and towers */}
                    <div className="flex-1 bg-slate-200 relative overflow-hidden flex flex-col justify-center items-center p-4 min-h-[290px]">
                      {/* Grid representation */}
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:30px_30px] opacity-40" />
                      
                      {/* Render simulated cities name indicators */}
                      <div className="absolute top-12 right-2 text-[8px] font-bold text-slate-600 uppercase tracking-wider bg-white/90 px-1.5 py-0.5 rounded border border-slate-350 shadow-2xs z-10">
                        {searchQuery || "Yaoundé Region"}
                      </div>

                      {/* AI Coverage Shadow Overlays when active */}
                      {predictionOverlay && (
                        <>
                          {/* Shadow Zone 1 (Steep terrain attenuation shadow e.g., Mvan/slope) */}
                          <div
                            className="absolute z-5 border-2 border-dashed border-rose-500 bg-rose-500/15 rounded-full animate-pulse flex items-center justify-center pointer-events-none"
                            style={{
                              left: "35%",
                              top: "52%",
                              width: "70px",
                              height: "70px",
                              transform: "translate(-50%, -50%)"
                            }}
                          >
                            <span className="text-[6px] font-extrabold text-rose-600 bg-white/95 px-1 py-0.5 rounded shadow-2xs uppercase tracking-widest leading-none">
                              SHADOW GAP (Mvan)
                            </span>
                          </div>

                          {/* Shadow Zone 2 (Urban dense canopy e.g., Mokolo Market shadow) */}
                          <div
                            className="absolute z-5 border-2 border-dashed border-rose-500 bg-rose-500/15 rounded-full animate-pulse flex items-center justify-center pointer-events-none"
                            style={{
                              left: "68%",
                              top: "35%",
                              width: "55px",
                              height: "55px",
                              transform: "translate(-50%, -50%)"
                            }}
                          >
                            <span className="text-[6px] font-extrabold text-rose-600 bg-white/95 px-1 py-0.5 rounded shadow-2xs uppercase tracking-widest leading-none">
                              SHADOW GAP (Mokolo)
                            </span>
                          </div>
                        </>
                      )}
                      
                      {/* Base Station Tower Icon centered */}
                      <div className="relative z-10 flex flex-col items-center">
                        <div className="h-9 w-9 bg-[#0D1B4C]/10 border-2 border-[#0D1B4C]/60 rounded-full flex items-center justify-center shadow-md cursor-pointer hover:scale-110 active:scale-95 transition-all">
                          <Signal className="h-4.5 w-4.5 text-[#0D1B4C]" />
                        </div>
                        <span className="text-[8px] font-mono font-bold text-[#0D1B4C] mt-0.5 bg-white/80 px-1 rounded">MAIN TOWER</span>
                      </div>

                      {/* Micro points plotted */}
                      {heatpoints.slice(-15).map((point, index) => {
                        // Math calculation converting offsets to fit mobile viewport container
                        const deltaLat = point.lat - mapCenter.lat;
                        const deltaLng = point.lng - mapCenter.lng;
                        const leftPercent = 50 + deltaLng * 1800; // factor
                        const topPercent = 50 - deltaLat * 1800;
                        
                        return (
                          <div
                            key={index}
                            className="absolute z-10 hover:scale-150 transition-all cursor-pointer group"
                            style={{
                              left: `${Math.max(10, Math.min(90, leftPercent))}%`,
                              top: `${Math.max(20, Math.min(80, topPercent))}%`
                            }}
                          >
                            <span className={`block h-3 w-3 rounded-full border border-white shadow-xs ${
                              point.rsrp >= -85 ? "bg-emerald-500" :
                              point.rsrp >= -100 ? "bg-amber-400" :
                              point.rsrp >= -110 ? "bg-rose-500" : "bg-slate-900"
                            }`} />
                            {/* Hover Coordinate Metrics popup */}
                            <div className="absolute hidden group-hover:flex bottom-4 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[7px] font-mono py-1 px-1.5 rounded-sm whitespace-nowrap z-30">
                              Lat: {point.lat.toFixed(4)}, dBm: {point.rsrp}
                            </div>
                          </div>
                        );
                      })}

                      {/* Prediction Control Mini Widget */}
                      <div className="absolute bottom-12 left-2 right-2 bg-slate-950/90 text-white p-2 rounded-lg z-10 border border-[#00B8A9]/30 shadow-lg text-[9px] backdrop-blur-xs">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[8px] font-extrabold text-[#00B8A9] uppercase tracking-wider flex items-center gap-1">
                            <Zap className="h-2.5 w-2.5 text-[#00B8A9] animate-pulse" />
                            {t.predictedHoles}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setPredictionOverlay(!predictionOverlay);
                              setToastMessage(predictionOverlay ? "AI Overlay Disabled" : "AI Outage Overlay Enabled");
                            }}
                            className={`px-1.5 py-0.5 rounded font-bold uppercase tracking-wide cursor-pointer transition-colors ${
                              predictionOverlay ? "bg-[#00B8A9] text-slate-950" : "bg-slate-700 text-slate-300"
                            }`}
                          >
                            {predictionOverlay ? "ON" : "OFF"}
                          </button>
                        </div>
                        {predictionOverlay ? (
                          <div className="text-[8px] text-slate-350 leading-tight space-y-0.5 font-mono">
                            <div>• <span className="text-[#00B8A9]">{t.predictionModel}:</span> TR 38.901 Propagation Shadowing</div>
                            <div>• <span className="text-[#00B8A9]">{t.confidenceLabel}:</span> RSRP Outage Predictor at 91.4% accuracy</div>
                            <div>• <span className="text-amber-300">REC:</span> In the shadowed terrains of Yaoundé, please adjust antenna tilt angles.</div>
                          </div>
                        ) : (
                          <div className="text-slate-400 italic">Prediction overlays deactivated</div>
                        )}
                      </div>

                      {/* Download Exporters floating toolbar */}
                      <div className="absolute bottom-2 right-2 left-2 z-10 flex gap-2">
                        <button
                          onClick={triggerCsvDatasetDownload}
                          className="flex-1 bg-white hover:bg-slate-50 text-slate-800 text-[9.5px] font-bold border border-slate-300 hover:border-slate-450 p-1.5 shadow-2xs rounded-lg flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Download className="h-3 w-3 text-[#0D1B4C]" />
                          {t.exportCsv}
                        </button>
                        <button
                          onClick={triggerGeoJsonDatasetDownload}
                          className="flex-1 bg-white hover:bg-slate-50 text-slate-800 text-[9.5px] font-bold border border-slate-300 hover:border-slate-450 p-1.5 shadow-2xs rounded-lg flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Download className="h-3 w-3 text-[#0D1B4C]" />
                          {t.exportGeoJson}
                        </button>
                      </div>
                    </div>

                    {/* Floating Heatmap Map Legend */}
                    <div className="bg-white border-t border-slate-200 p-2 z-10 flex flex-wrap justify-between items-center gap-1">
                      <h4 className="text-[8px] font-bold text-[#0D1B4C] uppercase tracking-wider block w-full">
                        {t.legendHeader} ({t.operatorLabel === "Active Carrier (Cameroon)" ? "Cameroon Regional Grid" : "Grille Cameroun"})
                      </h4>
                      <div className="flex justify-between items-center w-full gap-2 mt-0.5">
                        <div className="flex items-center gap-1 text-[8px] text-slate-600 font-medium">
                          <span className="h-2 w-2 rounded-full bg-emerald-500" />
                          <span>Good</span>
                        </div>
                        <div className="flex items-center gap-1 text-[8px] text-slate-600 font-medium">
                          <span className="h-2 w-2 rounded-full bg-amber-400" />
                          <span>Avg</span>
                        </div>
                        <div className="flex items-center gap-1 text-[8px] text-slate-600 font-medium">
                          <span className="h-2 w-2 rounded-full bg-rose-500" />
                          <span>Poor</span>
                        </div>
                        <div className="flex items-center gap-1 text-[8px] text-slate-600 font-medium">
                          <span className="h-2 w-2 rounded-full bg-slate-900 animate-pulse" />
                          <span className="text-rose-600 font-bold font-mono">AI Hole</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* TELEMETRY HISTORY LIST SCREEN */}
                {activeScreen === "history" && (
                  <motion.div
                    key="history"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-4 flex flex-col justify-between flex-1 overflow-y-auto"
                  >
                    <div>
                      {/* Section Header */}
                      <div className="mb-4 border-b border-slate-200 pb-2 flex justify-between items-center">
                        <div>
                          <h3 className="text-slate-900 font-display text-base font-bold tracking-tight">
                            {t.historyTitle}
                          </h3>
                          <p className="text-[10px] text-slate-500">{t.roomRepo}</p>
                        </div>
                        <span className="text-[9px] font-mono bg-blue-100 text-blue-950 font-bold px-2 py-0.5 rounded border border-blue-200">
                          {sessions.length} SQL logs
                        </span>
                      </div>

                      {/* Active Session List */}
                      {sessions.length === 0 ? (
                        <div className="py-12 text-center text-slate-400 text-xs">
                          <History className="h-8 w-8 mx-auto text-slate-300 stroke-1 mb-2" />
                          <p>{t.noSessions}</p>
                        </div>
                      ) : (
                        <div className="space-y-3.5">
                          {sessions.map((item) => (
                            <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex items-center justify-between">
                              <div className="space-y-1">
                                <span className="text-[11px] font-bold text-slate-900 block leading-tight">{item.date}</span>
                                <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
                                  <span>{item.duration}</span>
                                  <span>•</span>
                                  <span className="text-blue-900 font-semibold">{item.readingCount} {lang === "English" ? "readings" : "mesures"}</span>
                                </div>
                              </div>

                              <div className="shrink-0 ml-2">
                                {item.isSynced ? (
                                  <span className="flex items-center gap-0.5 text-[9px] font-bold text-emerald-600 font-mono bg-emerald-50 border border-emerald-200 rounded-md px-2 py-1">
                                    <CheckCircle2 className="h-3 w-3" />
                                    {t.synced}
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => triggerOnlineSyncAction(item.id)}
                                    disabled={syncingInterval !== null}
                                    className="text-[9.5px] font-bold text-white bg-amber-500 hover:bg-amber-600 disabled:opacity-50 font-mono rounded-md px-2.5 py-1 flex items-center gap-1 cursor-pointer transform hover:scale-102 transition-all active:scale-98"
                                  >
                                    {syncingInterval === item.id ? (
                                      <RefreshCw className="h-3 w-3 animate-spin" />
                                    ) : (
                                      t.syncNow
                                    )}
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* APP CONFIGURATIONS SETTINGS SCREEN */}
                {activeScreen === "settings" && (
                  <motion.div
                    key="settings"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-4 flex flex-col justify-between flex-1"
                  >
                    <div className="space-y-5">
                      {/* Dropdown Language selection settings */}
                      <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs">
                        <label className="text-[12px] font-bold text-slate-900 block mb-2">{t.langLabel}</label>
                        <div className="relative">
                          <select
                            value={lang}
                            onChange={(e) => setLang(e.target.value as "English" | "Français")}
                            className="w-full text-xs font-medium p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 shadow-inner cursor-pointer hover:bg-slate-100 transition-all focus:outline-hidden"
                          >
                            <option value="English">English (US)</option>
                            <option value="Français">Français (FR)</option>
                          </select>
                          <Globe className="absolute right-3 top-3 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                        </div>
                      </div>

                      {/* Transmission Preferences Card */}
                      <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs space-y-4">
                        <h4 className="text-[11px] uppercase tracking-wider font-extrabold text-slate-400 mb-2">
                          {t.ruleLabel}
                        </h4>

                        {/* Wifi Only Upload toggle */}
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[11.5px] font-bold text-slate-800 block">{t.wifiOnlyLabel}</span>
                            <span className="text-[9.5px] text-slate-500 block leading-tight">{t.wifiOnlyDesc}</span>
                          </div>
                          <button
                            onClick={() => setWifiOnly(!wifiOnly)}
                            className={`w-9 h-5 rounded-full p-0.5 transition-colors focus:outline-hidden cursor-pointer ${
                              wifiOnly ? "bg-emerald-500" : "bg-slate-300"
                            }`}
                          >
                            <div className={`bg-white w-4 h-4 rounded-full shadow-md transition-transform ${
                              wifiOnly ? "translate-x-4" : "translate-x-0"
                            }`} />
                          </button>
                        </div>

                        <hr className="border-slate-100" />

                        {/* WiFi physical hardware emulator switch */}
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[11.5px] font-bold text-slate-800 block">{t.wifiAntennaLabel}</span>
                            <span className="text-[9.5px] text-slate-500 block leading-tight">{t.wifiAntennaDesc}</span>
                          </div>
                          <button
                            onClick={() => setIsWifiEnabled(!isWifiEnabled)}
                            className={`w-9 h-5 rounded-full p-0.5 transition-colors focus:outline-hidden cursor-pointer ${
                              isWifiEnabled ? "bg-emerald-500" : "bg-rose-500"
                            }`}
                          >
                            <div className={`bg-white w-4 h-4 rounded-full shadow-md transition-transform ${
                              isWifiEnabled ? "translate-x-4" : "translate-x-0"
                            }`} />
                          </button>
                        </div>
                      </div>

                      {/* Room SQLite purger danger section */}
                      <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs bg-rose-500/5">
                        <h4 className="text-[12px] font-bold text-rose-700 block mb-1">{t.dbAdminLabel}</h4>
                        <p className="text-[10px] text-slate-500 leading-snug mb-3">
                          {t.dbAdminDesc}
                        </p>
                        
                        <button
                          onClick={purgeRoomDatabaseCache}
                          className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] rounded-lg shadow-sm cursor-pointer flex items-center justify-center gap-1.5 transition-colors active:scale-99"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          {t.purgeButton}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Toast Messages overlays matching actions */}
              {toastMessage && (
                <div className="absolute bottom-16 left-2 right-2 bg-slate-900/95 text-white text-[10px] px-3 py-2 rounded-lg flex justify-between items-center shadow-md border border-slate-800 z-50">
                  <span className="font-medium mr-2">{toastMessage}</span>
                  <button onClick={() => setToastMessage(null)} className="text-emerald-400 font-extrabold hover:text-white">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Bottom Android Universal Navigation Controller with synced code explorer tabs */}
            {activeScreen !== "splash" && (
              <div className="bg-white border-t border-slate-200/80 px-4 py-2 flex justify-between items-center z-10 shrink-0">
                <button
                  onClick={() => handleNavClick("home")}
                  className={`flex flex-col items-center gap-0.5 transition-colors cursor-pointer ${
                    activeScreen === "home" ? "text-blue-900 font-bold" : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <Signal className="h-4 w-4" />
                  <span className="text-[9px] tracking-tight">Home</span>
                </button>

                <button
                  onClick={() => handleNavClick("map")}
                  className={`flex flex-col items-center gap-0.5 transition-colors cursor-pointer ${
                    activeScreen === "map" ? "text-blue-900 font-bold" : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <MapPin className="h-4 w-4" />
                  <span className="text-[9px] tracking-tight">Heatmap</span>
                </button>

                <button
                  onClick={() => handleNavClick("history")}
                  className={`flex flex-col items-center gap-0.5 transition-colors cursor-pointer ${
                    activeScreen === "history" ? "text-blue-900 font-bold" : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <History className="h-4 w-4" />
                  <span className="text-[9px] tracking-tight">History</span>
                </button>

                <button
                  onClick={() => handleNavClick("settings")}
                  className={`flex flex-col items-center gap-0.5 transition-colors cursor-pointer ${
                    activeScreen === "settings" ? "text-blue-900 font-bold" : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <Settings className="h-4 w-4" />
                  <span className="text-[9px] tracking-tight">Settings</span>
                </button>
              </div>
            )}

            {/* Simulated Android Hardware Key Indicator */}
            <div className="bg-white pb-3 pt-1 text-center shrink-0">
              <div className="h-1 w-28 bg-slate-300 rounded-full mx-auto" />
            </div>
          </div>
          
          {/* Quick Info under mobile simulator wrapper */}
          <div className="mt-4 text-center">
            <p className="text-[11px] text-slate-500 leading-tight">
              Tapping navigation tabs inside the device model updates the <strong className="text-blue-400">Kotlin Source Explorer</strong> dynamically!
            </p>
          </div>
        </div>

        {/* Right Side: IDE Kotlin MVVM Workspace File Explorer - taking 7 columns */}
        <div className="lg:col-span-7 flex flex-col bg-slate-950 rounded-2xl border border-slate-800/80 overflow-hidden shadow-2xl relative">
          
          {/* Workspace Tab Header */}
          <div className="bg-slate-900 px-4 pt-3 pb-0 border-b border-slate-800 flex flex-col gap-3 shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCode className="h-4.5 w-4.5 text-blue-400" />
                <h2 className="text-sm font-bold text-white font-mono tracking-tight">KOTLIN MVVM ARCHITECTURE</h2>
              </div>
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                <span className="text-[11px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700/60">
                  {selectedFile}
                </span>
              </div>
            </div>

            {/* Interactive File Selection Tabs */}
            <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-thin">
              {(Object.keys(KOTLIN_FILES) as Array<keyof typeof KOTLIN_FILES>).map((file) => (
                <button
                  key={file}
                  onClick={() => setSelectedFile(file)}
                  className={`text-slate-300 px-3 py-1.5 rounded-t-lg transition-all font-mono text-xs whitespace-nowrap border-t-2 flex items-center gap-1.5 cursor-pointer ${
                    selectedFile === file
                      ? "bg-slate-950 font-semibold text-white border-blue-600"
                      : "bg-transparent border-transparent text-slate-500 hover:text-slate-200 hover:bg-slate-800/30"
                  }`}
                >
                  <span className="text-[9px] opacity-60">🔹</span>
                  {file}
                </button>
              ))}
            </div>
          </div>

          {/* IDE Action Ribbon Panel */}
          <div className="bg-slate-950 px-4 py-2 border-b border-slate-900 flex justify-between items-center text-xs shrink-0 bg-slate-900/40">
            <div className="flex items-center gap-2 text-slate-400">
              <Terminal className="h-4 w-4 text-emerald-500" />
              <span className="font-mono text-[11px]">Android Studio Workspace</span>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Copy file button */}
              <button
                onClick={() => copyFileToClipboard(selectedFile)}
                className="bg-slate-850 hover:bg-slate-800 active:scale-97 border border-slate-700/60 rounded px-3 py-1.5 font-bold flex items-center gap-1.5 transition-all outline-hidden cursor-pointer"
              >
                {copiedStatus ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400">{t.copied}</span>
                  </>
                ) : (
                  <>
                    <Download className="h-3.5 w-3.5 text-slate-200" />
                    <span>Copy Source</span>
                  </>
                )}
              </button>

              {/* Download raw file locally button */}
              <button
                onClick={() => triggerRawFileDownload(selectedFile, KOTLIN_FILES[selectedFile])}
                className="bg-blue-600 hover:bg-blue-700 active:scale-97 text-white font-bold rounded px-3 py-1.5 flex items-center gap-1.5 transition-all outline-hidden cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                <span>{t.dlBtn}</span>
              </button>
            </div>
          </div>

          {/* Code Viewer pane with line numbers */}
          <div className="flex-1 overflow-auto bg-slate-950 p-4 font-mono text-slate-300 relative">
            <div className="table w-full border-spacing-0">
              {highlightKotlinSyntax(KOTLIN_FILES[selectedFile])}
            </div>
          </div>

          {/* Detail card matching each Compose file */}
          <div className="bg-slate-900 border-t border-[#0D1B4C] p-4 shrink-0">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 bg-blue-500/10 rounded-lg flex items-center justify-center text-[#00B8A9] shrink-0 self-start">
                <Info className="h-4.5 w-4.5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wide">
                  {t.descTitle}: <strong className="font-mono font-medium text-[#00B8A9]">{selectedFile}</strong>
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {selectedFile === "Color.kt" && "Extends color resources to build eye-safe night-diagnostics signal panels (RSRP deep blues, emerald signals, and outage danger gaps)."}
                  {selectedFile === "Theme.kt" && "Sets light and dark color schemes dynamically based on local systems settings. Custom typography binds Montserrat to display headers."}
                  {selectedFile === "SplashScreen.kt" && "Displays on startup. Invokes compose remember { Animatable(...) } scaling and progress loops, automatically navigating the application forward."}
                  {selectedFile === "HomeScreen.kt" && "Tracks diagnostics levels (RSRP, RSRQ, SINR). Connects directly to HomeViewModel state flows and issues start/stop commands safely."}
                  {selectedFile === "MapScreen.kt" && "Maps localized geographic data. Outlines legend classifications and exports spatial coverage datasets in CSV and GeoJSON forms."}
                  {selectedFile === "HistoryScreen.kt" && "Renders scrollable telemetry list loads query entities matching SQLite Room backend database models."}
                  {selectedFile === "SettingsScreen.kt" && "Manages client storage schemas, toggle Wi-Fi sync conditions, and clear local tables state memory cleanly."}
                  {selectedFile === "NavGraph.kt" && "Handles Compose-level navigation graphs mapping routes, handling popUpTo rules, and generating bottom Navigation bar selections."}
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* High-Fidelity Localized Terms of Service & Technical Consent Modal Overlay */}
      {termsAccepted === false && (
        <div className="fixed inset-0 bg-[#0D1B4C]/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col relative max-h-[90vh]"
          >
            {/* Modal Language ribbon */}
            <div className="bg-[#0D1B4C] text-white p-5 pt-6 pb-4 relative shrink-0">
              <div className="absolute top-4 right-5 flex items-center gap-1 bg-white/10 rounded-lg p-0.5">
                <button
                  type="button"
                  onClick={() => setLang("English")}
                  className={`text-[9px] font-bold px-2 py-0.5 rounded transition-all ${
                    lang === "English" ? "bg-[#00B8A9] text-[#0D1B4C]" : "text-slate-350 hover:text-white"
                  }`}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => setLang("Français")}
                  className={`text-[9px] font-bold px-2 py-0.5 rounded transition-all ${
                    lang === "Français" ? "bg-[#00B8A9] text-[#0D1B4C]" : "text-slate-350 hover:text-white"
                  }`}
                >
                  FR
                </button>
              </div>
              <div className="flex items-center gap-2 mb-1.5">
                <ShieldAlert className="h-5.5 w-5.5 text-[#00B8A9]" />
                <h3 className="text-base font-bold tracking-tight">{t.termsTitle}</h3>
              </div>
              <p className="text-[10px] text-slate-300 font-mono tracking-wider uppercase">{t.termsSubtitle}</p>
            </div>

            {/* Simulated blocked view state instead of browser alerts if user declines */}
            {termsDeclined ? (
              // Inline state toggler for decliners - replaces standard window popups
              <div className="p-6 bg-[#F5F7FA] overflow-y-auto flex-1 flex flex-col items-center justify-center text-center py-10 space-y-4">
                <div className="h-12 w-12 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mb-2">
                  <ShieldAlert className="h-6 w-6 animate-pulse" />
                </div>
                <h4 className="text-md font-bold text-[#0D1B4C]">
                  {lang === "English" ? "Telemetry Diagnostics Restricted" : "Accès aux Diagnostics Restreint"}
                </h4>
                <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                  {lang === "English" 
                    ? "CrowdSenseNet simulation and Kotlin source workspace require wireless diagnostics telemetry consent. Real-time statistics will remain offline unless authorized."
                    : "La simulation CrowdSenseNet et l'atelier de code Kotlin requièrent votre accord. Les statistiques en temps réel resteront inactives tant que vous n'aurez pas donné votre consentement."}
                </p>
                <button
                  type="button"
                  onClick={() => setTermsDeclined(false)} // toggle back to main screening view
                  className="bg-[#0D1B4C] hover:bg-[#00B8A9] text-white font-bold text-xs px-5 py-2.5 rounded-xl transition cursor-pointer shadow-md"
                >
                  {lang === "English" ? "Review Consent Agreement" : "Réexaminer la Charte"}
                </button>
              </div>
            ) : (
              // Policy text screen and core agreements
              <>
                <div className="p-6 overflow-y-auto space-y-4 text-slate-600 bg-[#F5F7FA] border-b border-slate-200">
                  <div className="flex justify-center mb-1">
                    <CrowdSenseNetLogo size={36} />
                  </div>
                  <div className="text-xs text-justify leading-relaxed bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
                    {t.termsBody}
                  </div>
                  <div className="bg-[#0D1B4C]/5 border border-slate-200/80 rounded-xl p-3 text-[10px] text-slate-500 leading-normal">
                    <strong>{lang === "English" ? "Local persistence notice:" : "Notice de persistence locale :"}</strong>{" "}
                    {lang === "English"
                      ? "Consenting writes an authoritative true parameter inside the client's localStorage sandbox, preventing this check on subsequent visits."
                      : "Le consentement enregistre un drapeau d'approbation persistant dans le localStorage de votre navigateur, évitant de vous solliciter à nouveau."}
                  </div>
                </div>

                {/* Consent actions and verification check */}
                <div className="p-5 bg-white shrink-0 flex flex-col gap-4">
                  <div className="flex items-center justify-start py-0.5">
                    <input 
                      type="checkbox" 
                      id="optInTelemetryCheckbox"
                      className="rounded border-slate-300 text-[#00B8A9] focus:ring-[#00B8A9] h-4.5 w-4.5 cursor-pointer accent-[#00B8A9]"
                    />
                    <label htmlFor="optInTelemetryCheckbox" className="ml-2.5 text-xs text-slate-600 font-medium select-none cursor-pointer">
                      {lang === "English" 
                        ? "I consent to store and share wireless telemetry performance logs" 
                        : "Je consens à la collecte et à l'envoi de mesures de couverture"}
                    </label>
                  </div>

                  <div className="flex items-center gap-2.5 w-full">
                    <button
                      type="button"
                      onClick={() => setTermsDeclined(true)} // Toggle error screen
                      className="flex-1 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs rounded-xl transition cursor-pointer text-center"
                    >
                      {t.termsDeny}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const cb = document.getElementById("optInTelemetryCheckbox") as HTMLInputElement;
                        if (cb && cb.checked) {
                          localStorage.setItem("crowdsensenet_terms_accepted", "true");
                          setTermsAccepted(true);
                          setToastMessage(lang === "English" ? "Telemetry Diagnostics Consent Accepted" : "Consentement Accepté et Sauvegardé");
                        } else {
                          // Display a helpful localized warning
                          setToastMessage(lang === "English" ? "Please check the consent box first." : "Veuillez d'abord cocher la case.");
                        }
                      }}
                      className="flex-1 py-2.5 bg-[#0D1B4C] hover:bg-[#00B8A9] text-white font-bold text-xs rounded-xl transition cursor-pointer text-center shadow-lg shadow-slate-900/10"
                    >
                      {t.termsAgree}
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
