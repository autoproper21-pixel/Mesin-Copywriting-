import { useState, useCallback } from "react";

const THEMES = [
  { id: "motivasi", label: "🔥 Motivasi Hidup", color: "#E85D26" },
  { id: "kemanusiaan", label: "❤️ Kemanusiaan", color: "#C0392B" },
  { id: "sosial", label: "🤝 Sosial & Peduli", color: "#1A6B3C" },
  { id: "pendidikan", label: "📚 Pendidikan", color: "#1A3A6B" },
  { id: "bisnis_baik", label: "💼 Bisnis Berkah", color: "#6B3A1A" },
  { id: "spiritual", label: "☪️ Spiritual & Iman", color: "#4A1A6B" },
];

const OUTPUT_TYPES = [
  { id: "headline", label: "🎯 Headline Powerful", desc: "Judul yang menghentikan scroll" },
  { id: "opening", label: "✍️ Opening Menggugah", desc: "Pembuka yang menyentuh hati" },
  { id: "frasa", label: "💬 Frasa Pendorong", desc: "Kalimat inspirasi & persuasi" },
  { id: "cta", label: "🚀 Call to Action", desc: "Ajakan yang tak bisa ditolak" },
  { id: "full", label: "⚡ Full Copy Lengkap", desc: "Headline + Opening + CTA sekaligus" },
];

const TONE_OPTIONS = [
  { id: "emosional", label: "😢 Emosional" },
  { id: "membakar", label: "🔥 Membakar Semangat" },
  { id: "lembut", label: "🌸 Lembut & Hangat" },
  { id: "tegas", label: "💪 Tegas & Kuat" },
  { id: "menginspirasi", label: "✨ Menginspirasi" },
];

const SYSTEM_PROMPT = `Kamu adalah maestro copywriter Indonesia spesialis konten inspirasi, kemanusiaan, dan kebaikan sosial. Buat output yang MENGGUGAH, MENYENTUH, dan membuat orang ingin segera BERBUAT KEBAIKAN! Gunakan bahasa Indonesia yang powerful. Semua dalam konteks kebaikan dan kemanusiaan.`;

export default function App() {
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [selectedOutput, setSelectedOutput] = useState(null);
  const [selectedTone, setSelectedTone] = useState(null);
  const [customContext, setCustomContext] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("generator");
  const [copySuccess, setCopySuccess] = useState(false);
  const [count, setCount] = useState(3);

  const generate = useCallback(async () => {
    if (!selectedTheme || !selectedOutput || !selectedTone) return;
    setIsLoading(true);
    setResult("");
    const theme = THEMES.find((t) => t.id === selectedTheme);
    const output = OUTPUT_TYPES.find((o) => o.id === selectedOutput);
    const tone = TONE_OPTIONS.find((t) => t.id === selectedTone);
    const userPrompt = `Buat ${count} variasi ${output.label} dengan tema: ${theme.label}, tone: ${tone.label}, konteks: ${customContext || "umum untuk semua kalangan"}. Buat yang POWERFUL dan MENGINSPIRASI!`;
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1500,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: userPrompt }],
        }),
      });
      const data = await response.json();
      const text = data.content?.map((c) => c.text || "").join("\n") || "Gagal generate.";
      setResult(text);
      setHistory((prev) => [{ theme: theme.label, output: output.label, tone: tone.label, text, time: new Date().toLocaleTimeString("id-ID") }, ...prev.slice(0, 9)]);
    } catch (e) {
      setResult("❌ Terjadi kesalahan. Coba lagi.");
    } finally {
      setIsLoading(false);
    }
  }, [selectedTheme, selectedOutput, selectedTone, customContext, count]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const isReady = selectedTheme && selectedOutput && selectedTone;

  return (
    <div style={{ fontFamily: "'Georgia', serif", background: "linear-gradient(135deg, #0D1B0F 0%, #1A0A2E 50%, #0D1B0F 100%)", minHeight: "100vh", color: "#F0EDE6" }}>
      <div style={{ textAlign: "center", padding: "40px 20px 20px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <div style={{ fontSize: "13px", fontFamily: "sans-serif", letterSpacing: "4px", marginBottom: "12px", fontWeight: "700", color: "#E85D26" }}>✦ MESIN COPYWRITING ✦</div>
        <h1 style={{ fontSize: "clamp(24px, 5vw, 48px)", fontWeight: "700", margin: "0 0 8px", color: "#F0EDE6" }}>Generator Kata-Kata<br /><span style={{ background: "linear-gradient(90deg, #E85D26, #FFB347)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Inspirasi & Kemanusiaan</span></h1>
        <p style={{ color: "#A09880", fontFamily: "sans-serif", fontSize: "14px", margin: "0 0 24px" }}>Buat copywriting powerful yang menggerakkan hati dalam hitungan detik</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
          {["generator", "history"].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: "8px 24px", borderRadius: "100px", border: "1px solid", borderColor: activeTab === tab ? "#E85D26" : "rgba(255,255,255,0.2)", background: activeTab === tab ? "#E85D26" : "transparent", color: activeTab === tab ? "white" : "#A09880", cursor: "pointer", fontFamily: "sans-serif", fontSize: "13px" }}>
              {tab === "generator" ? "⚡ Generator" : `📜 Riwayat (${history.length})`}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "generator" ? (
        <div style={{ maxWidth: "860px", margin: "0 auto", padding: "32px 20px" }}>
          <StepCard step="1" title="Pilih Tema" subtitle="Apa fokus kontenmu?">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "10px" }}>
              {THEMES.map((t) => (
                <button key={t.id} onClick={() => setSelectedTheme(t.id)} style={{ padding: "12px", borderRadius: "10px", border: "2px solid", borderColor: selectedTheme === t.id ? t.color : "rgba(255,255,255,0.1)", background: selectedTheme === t.id ? `${t.color}22` : "rgba(255,255,255,0.03)", color: selectedTheme === t.id ? t.color : "#C0B8A8", cursor: "pointer", fontFamily: "sans-serif", fontSize: "13px", fontWeight: selectedTheme === t.id ? "700" : "400", textAlign: "left" }}>{t.label}</button>
              ))}
            </div>
          </StepCard>

          <StepCard step="2" title="Jenis Output" subtitle="Apa yang ingin kamu buat?">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "10px" }}>
              {OUTPUT_TYPES.map((o) => (
                <button key={o.id} onClick={() => setSelectedOutput(o.id)} style={{ padding: "14px", borderRadius: "10px", border: "2px solid", borderColor: selectedOutput === o.id ? "#E85D26" : "rgba(255,255,255,0.1)", background: selectedOutput === o.id ? "rgba(232,93,38,0.12)" : "rgba(255,255,255,0.03)", color: "#F0EDE6", cursor: "pointer", fontFamily: "sans-serif", fontSize: "13px", textAlign: "left" }}>
                  <div style={{ fontWeight: selectedOutput === o.id ? "700" : "500", color: selectedOutput === o.id ? "#E85D26" : "#F0EDE6" }}>{o.label}</div>
                  <div style={{ fontSize: "11px", color: "#7A7060", marginTop: "4px" }}>{o.desc}</div>
                </button>
              ))}
            </div>
          </StepCard>

          <StepCard step="3" title="Tone / Nada" subtitle="Bagaimana gaya penyampaiannya?">
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {TONE_OPTIONS.map((t) => (
                <button key={t.id} onClick={() => setSelectedTone(t.id)} style={{ padding: "10px 18px", borderRadius: "100px", border: "2px solid", borderColor: selectedTone === t.id ? "#FFB347" : "rgba(255,255,255,0.15)", background: selectedTone === t.id ? "rgba(255,179,71,0.15)" : "transparent", color: selectedTone === t.id ? "#FFB347" : "#A09880", cursor: "pointer", fontFamily: "sans-serif", fontSize: "13px", fontWeight: selectedTone === t.id ? "700" : "400" }}>{t.label}</button>
              ))}
            </div>
          </StepCard>

          <StepCard step="4" title="Detail Tambahan" subtitle="Opsional — semakin spesifik, semakin kuat hasilnya">
            <textarea value={customContext} onChange={(e) => setCustomContext(e.target.value)} placeholder="Contoh: untuk penggalangan dana masjid, target ibu-ibu muda..." style={{ width: "100%", minHeight: "80px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "10px", color: "#F0EDE6", padding: "14px", fontFamily: "sans-serif", fontSize: "14px", resize: "vertical", outline: "none", boxSizing: "border-box" }} />
            <div style={{ marginTop: "16px", display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
              <span style={{ fontFamily: "sans-serif", fontSize: "13px", color: "#A09880" }}>Jumlah variasi:</span>
              {[1, 3, 5, 7].map((n) => (
                <button key={n} onClick={() => setCount(n)} style={{ width: "40px", height: "40px", borderRadius: "8px", border: "2px solid", borderColor: count === n ? "#E85D26" : "rgba(255,255,255,0.15)", background: count === n ? "rgba(232,93,38,0.2)" : "transparent", color: count === n ? "#E85D26" : "#A09880", cursor: "pointer", fontFamily: "sans-serif", fontSize: "14px", fontWeight: "700" }}>{n}</button>
              ))}
            </div>
          </StepCard>

          <div style={{ textAlign: "center", margin: "32px 0" }}>
            <button onClick={generate} disabled={!isReady || isLoading} style={{ padding: "18px 52px", fontSize: "16px", fontFamily: "sans-serif", fontWeight: "700", letterSpacing: "1px", borderRadius: "100px", border: "none", background: isReady && !isLoading ? "linear-gradient(135deg, #E85D26, #C0392B)" : "rgba(255,255,255,0.1)", color: isReady && !isLoading ? "white" : "#5A5040", cursor: isReady && !isLoading ? "pointer" : "not-allowed", boxShadow: isReady && !isLoading ? "0 8px 32px rgba(232,93,38,0.4)" : "none" }}>
              {isLoading ? "⏳ Sedang Menghasilkan..." : isReady ? "⚡ GENERATE SEKARANG!" : "⚙️ Lengkapi Pilihan di Atas"}
            </button>
          </div>

          {(result || isLoading) && (
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "16px", padding: "28px", marginBottom: "32px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
                <span style={{ fontFamily: "sans-serif", fontSize: "12px", letterSpacing: "3px", color: "#E85D26", fontWeight: "700" }}>✦ HASIL GENERATE</span>
                {result && <button onClick={copyToClipboard} style={{ padding: "8px 18px", borderRadius: "100px", border: "1px solid rgba(255,255,255,0.2)", background: copySuccess ? "rgba(26,107,60,0.3)" : "rgba(255,255,255,0.07)", color: copySuccess ? "#4CAF50" : "#C0B8A8", cursor: "pointer", fontFamily: "sans-serif", fontSize: "12px" }}>{copySuccess ? "✅ Tersalin!" : "📋 Salin Semua"}</button>}
              </div>
              {isLoading ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <div style={{ fontSize: "32px", marginBottom: "12px" }}>✍️</div>
                  <p style={{ fontFamily: "sans-serif", color: "#7A7060", fontSize: "14px" }}>AI sedang merangkai kata-kata terbaik...</p>
                </div>
              ) : (
                <div style={{ whiteSpace: "pre-wrap", lineHeight: "1.9", fontSize: "15px", color: "#E8E0D0" }}>{result}</div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div style={{ maxWidth: "860px", margin: "0 auto", padding: "32px 20px" }}>
          {history.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "#5A5040" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>📜</div>
              <p style={{ fontFamily: "sans-serif" }}>Belum ada riwayat. Generate sesuatu dulu!</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {history.map((h, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "20px" }}>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "12px" }}>
                    <Tag color="#E85D26">{h.theme}</Tag>
                    <Tag color="#FFB347">{h.output}</Tag>
                    <Tag color="#4CAF50">{h.tone}</Tag>
                    <span style={{ fontFamily: "sans-serif", fontSize: "11px", color: "#5A5040", marginLeft: "auto" }}>{h.time}</span>
                  </div>
                  <div style={{ whiteSpace: "pre-wrap", lineHeight: "1.7", fontSize: "14px", color: "#C0B8A8", maxHeight: "120px", overflow: "hidden" }}>{h.text.slice(0, 250)}...</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <div style={{ textAlign: "center", padding: "32px 20px", borderTop: "1px solid rgba(255,255,255,0.07)", color: "#3A3020", fontFamily: "sans-serif", fontSize: "12px" }}>✦ Mesin Copywriting Inspirasi & Kemanusiaan — Powered by Claude AI ✦</div>
    </div>
  );
}

function StepCard({ step, title, subtitle, children }) {
  return (
    <div style={{ marginBottom: "28px" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "16px" }}>
        <span style={{ fontFamily: "sans-serif", fontSize: "11px", fontWeight: "700", color: "#E85D26", background: "rgba(232,93,38,0.15)", border: "1px solid rgba(232,93,38,0.3)", borderRadius: "100px", padding: "3px 10px" }}>LANGKAH {step}</span>
        <div>
          <div style={{ fontWeight: "700", fontSize: "17px", color: "#F0EDE6" }}>{title}</div>
          <div style={{ fontFamily: "sans-serif", fontSize: "12px", color: "#6A6050", marginTop: "2px" }}>{subtitle}</div>
        </div>
      </div>
      {children}
    </div>
  );
}

function Tag({ color, children }) {
  return <span style={{ fontFamily: "sans-serif", fontSize: "11px", padding: "3px 10px", borderRadius: "100px", border: `1px solid ${color}44`, color, background: `${color}11` }}>{children}</span>;
}
