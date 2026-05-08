import { useState } from 'react';
import {
  LayoutDashboard, CheckSquare, Info,
  UploadCloud, FileSearch, AlertCircle,
  Loader2, ShieldCheck, ShieldX, ShieldAlert, HelpCircle,
  ExternalLink
} from 'lucide-react';

// =============================================
// TYPE DEFINITIONS (sesuai DTO backend)
// =============================================

interface SearchEvidence {
  title: string;
  url: string;
  domain: string;
  snippet: string;
}

interface AnalysisResponse {
  headline: string;
  sourceNameInImage: string;
  dateInImage: string;
  mainTextExcerpt: string;
  mainClaim: string;
  detectedLanguage: string;
  verificationStatus: 'MATCHED' | 'PARTIALLY_MATCHED' | 'NOT_MATCHED' | 'INSUFFICIENT_EVIDENCE';
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'UNKNOWN';
  reasoningSummary: string;
  finalVerdict: 'KEMUNGKINAN_SESUAI' | 'KEMUNGKINAN_TIDAK_SESUAI' | 'BUKTI_TIDAK_CUKUP';
  searchEvidence: SearchEvidence[];
}

interface ErrorResponse {
  errorCode: string;
  message: string;
  timestamp: string;
}

// =============================================
// HELPER: Verdict UI config
// =============================================

const verdictConfig = {
  KEMUNGKINAN_SESUAI: {
    icon: ShieldCheck,
    color: 'text-green-400',
    bg: 'bg-green-400/10 border-green-400/30',
    label: 'Kemungkinan Sesuai Fakta',
  },
  KEMUNGKINAN_TIDAK_SESUAI: {
    icon: ShieldX,
    color: 'text-red-400',
    bg: 'bg-red-400/10 border-red-400/30',
    label: 'Kemungkinan Tidak Sesuai / Hoaks',
  },
  BUKTI_TIDAK_CUKUP: {
    icon: HelpCircle,
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/10 border-yellow-400/30',
    label: 'Bukti Tidak Cukup',
  },
};

const riskConfig = {
  LOW: { color: 'text-green-400', bg: 'bg-green-400/20', label: 'Risiko Rendah' },
  MEDIUM: { color: 'text-yellow-400', bg: 'bg-yellow-400/20', label: 'Risiko Sedang' },
  HIGH: { color: 'text-red-400', bg: 'bg-red-400/20', label: 'Risiko Tinggi' },
  UNKNOWN: { color: 'text-gray-400', bg: 'bg-gray-400/20', label: 'Tidak Diketahui' },
};

const BACKEND_URL = 'http://localhost:8080';

// =============================================
// MAIN APP
// =============================================

function App() {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [fileName, setFileName] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setSelectedFile(file);
      setResult(null);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch(`${BACKEND_URL}/api/v1/analysis/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        const errData = data as ErrorResponse;
        setError(errData.message || 'Terjadi kesalahan tidak diketahui.');
      } else {
        setResult(data as AnalysisResponse);
        setActiveMenu('check');
      }
    } catch {
      setError('Tidak dapat terhubung ke server backend. Pastikan backend berjalan di port 8080.');
    } finally {
      setIsLoading(false);
    }
  };

  // ---- Render helpers ----
  const renderVerdict = (verdict: AnalysisResponse['finalVerdict']) => {
    const cfg = verdictConfig[verdict];
    const Icon = cfg.icon;
    return (
      <div className={`flex items-center gap-3 p-4 rounded-xl border ${cfg.bg}`}>
        <Icon size={28} className={cfg.color} />
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-widest">Verdict Akhir</p>
          <p className={`font-bold text-lg ${cfg.color}`}>{cfg.label}</p>
        </div>
      </div>
    );
  };

  const renderResultCard = (res: AnalysisResponse) => {
    const risk = riskConfig[res.riskLevel];
    return (
      <div className="space-y-4">
        {/* Verdict Banner */}
        {renderVerdict(res.finalVerdict)}

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#1a1a1a] p-3 rounded-lg border border-[#2a2a2a]">
            <p className="text-xs text-gray-500 mb-1">Sumber Media</p>
            <p className="text-sm font-medium text-white truncate">{res.sourceNameInImage}</p>
          </div>
          <div className="bg-[#1a1a1a] p-3 rounded-lg border border-[#2a2a2a]">
            <p className="text-xs text-gray-500 mb-1">Tanggal Berita</p>
            <p className="text-sm font-medium text-white">{res.dateInImage}</p>
          </div>
          <div className="bg-[#1a1a1a] p-3 rounded-lg border border-[#2a2a2a]">
            <p className="text-xs text-gray-500 mb-1">Status Verifikasi</p>
            <p className="text-sm font-medium text-purple-400">{res.verificationStatus.replace(/_/g, ' ')}</p>
          </div>
          <div className="bg-[#1a1a1a] p-3 rounded-lg border border-[#2a2a2a]">
            <p className="text-xs text-gray-500 mb-1">Tingkat Risiko</p>
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${risk.bg} ${risk.color}`}>
              {risk.label}
            </span>
          </div>
        </div>

        {/* Headline */}
        <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#2a2a2a]">
          <p className="text-xs text-gray-500 mb-1">Judul Berita</p>
          <p className="text-sm font-semibold text-white leading-relaxed">{res.headline}</p>
        </div>

        {/* Main Claim */}
        <div className="bg-[#1a1a1a] p-4 rounded-lg border border-purple-500/20">
          <p className="text-xs text-purple-400 mb-1 font-medium">Klaim Utama yang Diuji</p>
          <p className="text-sm text-gray-300 leading-relaxed">{res.mainClaim}</p>
        </div>

        {/* Reasoning */}
        <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#2a2a2a]">
          <p className="text-xs text-gray-500 mb-1">Ringkasan Analisis</p>
          <p className="text-sm text-gray-300 leading-relaxed">{res.reasoningSummary}</p>
        </div>

        {/* Search Evidence */}
        {res.searchEvidence && res.searchEvidence.length > 0 && (
          <div>
            <p className="text-xs text-gray-500 mb-2 uppercase tracking-widest">Bukti Referensi</p>
            <div className="space-y-2">
              {res.searchEvidence.map((ev, i) => (
                <a
                  key={i}
                  href={ev.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-[#1a1a1a] p-3 rounded-lg border border-[#2a2a2a] hover:border-purple-500/40 transition-colors group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white group-hover:text-purple-300 transition-colors truncate">
                        {ev.title}
                      </p>
                      <p className="text-xs text-purple-400 mb-1">{ev.domain}</p>
                      <p className="text-xs text-gray-500 line-clamp-2">{ev.snippet}</p>
                    </div>
                    <ExternalLink size={14} className="text-gray-500 shrink-0 mt-0.5" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // =============================================
  // RENDER
  // =============================================
  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white font-sans">

      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-[#121212] flex flex-col p-6">
        <div className="flex items-center gap-3 mb-12">
          <img src="/logo.png" alt="OHIM AI Logo" className="h-20 w-auto object-contain" />
          <span className="font-bold text-xl tracking-wider">OHIM AI</span>
        </div>

        <nav className="flex flex-col gap-2">
          <button
            onClick={() => setActiveMenu('dashboard')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
              activeMenu === 'dashboard' ? 'bg-[#1e1e1e] border-l-4 border-purple-500 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <LayoutDashboard size={20} color={activeMenu === 'dashboard' ? '#c084fc' : 'currentColor'} fill={activeMenu === 'dashboard' ? '#c084fc' : 'none'} />
            <span className="font-medium">Dashboard</span>
          </button>

          <button
            onClick={() => setActiveMenu('check')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
              activeMenu === 'check' ? 'bg-[#1e1e1e] border-l-4 border-purple-500 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <CheckSquare size={20} color={activeMenu === 'check' ? '#1e1e1e' : 'currentColor'} fill={activeMenu === 'check' ? '#c084fc' : 'none'} />
            <span className="font-medium">Check Image</span>
          </button>

          <button
            onClick={() => setActiveMenu('about')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
              activeMenu === 'about' ? 'bg-[#1e1e1e] border-l-4 border-purple-500 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Info size={20} color={activeMenu === 'about' ? '#1e1e1e' : 'currentColor'} fill={activeMenu === 'about' ? '#c084fc' : 'none'} />
            <span className="font-medium">About</span>
          </button>
        </nav>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 p-10 overflow-y-auto">

        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">OHIM AI</h1>
          <p className="text-gray-400">Verifikasi screenshot berita berbasis AI</p>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-10">

          {/* Card Input Analisis */}
          <div className="bg-[#121212] p-6 rounded-xl border border-[#222]">
            <h2 className="text-lg font-medium mb-4">Input Analisis</h2>

            <label
              htmlFor="file-upload"
              className="border-2 border-dashed border-purple-500/50 rounded-lg h-48 flex flex-col items-center justify-center text-center p-6 bg-[#0f0f0f] hover:bg-[#151515] transition-colors cursor-pointer relative"
            >
              <div className="bg-[#1e1e1e] p-3 rounded-full mb-4">
                <UploadCloud size={24} className="text-purple-400" />
              </div>
              {fileName ? (
                <p className="font-medium text-purple-400 mb-1 truncate max-w-full px-4">{fileName}</p>
              ) : (
                <>
                  <p className="font-medium mb-1">Upload screenshot berita</p>
                  <p className="text-sm text-gray-500">Drag &amp; drop atau klik untuk memilih</p>
                  <p className="text-xs text-gray-600 mt-4">JPG, JPEG, PNG • Maks. 5MB</p>
                </>
              )}
            </label>

            <input
              id="file-upload"
              type="file"
              className="hidden"
              accept="image/jpeg, image/png, image/jpg"
              onChange={handleFileChange}
            />

            {/* Tombol Analisis */}
            <button
              id="analyze-btn"
              onClick={handleAnalyze}
              disabled={!selectedFile || isLoading}
              className={`mt-4 w-full py-3 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                selectedFile && !isLoading
                  ? 'bg-purple-600 hover:bg-purple-500 text-white cursor-pointer'
                  : 'bg-[#1e1e1e] text-gray-600 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Menganalisis...
                </>
              ) : (
                'Analisis Sekarang'
              )}
            </button>

            {/* Error display */}
            {error && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-2">
                <ShieldAlert size={16} className="text-red-400 shrink-0 mt-0.5" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}
          </div>

          {/* Card Hasil Analisis */}
          <div className="bg-[#121212] p-6 rounded-xl border border-[#222] overflow-y-auto max-h-[600px]">
            <h2 className="text-lg font-medium mb-4">Hasil Analisis</h2>
            {isLoading ? (
              <div className="h-48 flex flex-col items-center justify-center text-center">
                <Loader2 size={32} className="text-purple-400 animate-spin mb-4" />
                <p className="font-medium text-gray-300">Menganalisis gambar...</p>
                <p className="text-sm text-gray-500">AI sedang memproses screenshot berita</p>
              </div>
            ) : result ? (
              renderResultCard(result)
            ) : (
              <div className="h-48 flex flex-col items-center justify-center text-center p-6">
                <div className="bg-[#1e1e1e] p-4 rounded-full mb-4">
                  <FileSearch size={32} className="text-gray-500" />
                </div>
                <p className="font-medium text-gray-300 mb-1">Belum ada hasil analisis</p>
                <p className="text-sm text-gray-500">Unggah screenshot berita untuk<br />memulai pemeriksaan</p>
              </div>
            )}
          </div>

        </div>

        {/* Section Cara Kerja */}
        <div className="mb-10">
          <h2 className="text-xl font-medium mb-4">Cara Kerja</h2>
          <div className="grid grid-cols-4 gap-4">
            {[
              { step: '1', title: 'Upload', desc: 'Upload screenshot berita' },
              { step: '2', title: 'Ekstraksi', desc: 'AI membaca isi gambar' },
              { step: '3', title: 'Pencarian', desc: 'Mencari informasi pembanding' },
              { step: '4', title: 'Verifikasi', desc: 'Hasil verifikasi ditampilkan' },
            ].map(item => (
              <div key={item.step} className="bg-[#121212] p-5 rounded-xl border border-[#222]">
                <div className="text-xs font-bold text-gray-500 mb-2">{item.step}</div>
                <h3 className="font-medium text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-[#121212] p-4 rounded-xl border border-[#222] flex items-start gap-3">
          <AlertCircle size={20} className="text-gray-400 shrink-0 mt-0.5" />
          <p className="text-sm text-gray-400">
            <span className="font-medium">Disclaimer:</span> Hasil analisis bersifat indikatif dan bergantung pada kualitas gambar serta ketersediaan sumber pembanding. Sistem tidak menjamin keakuratan 100%.
          </p>
        </div>

      </main>
    </div>
  );
}

export default App;