import { useState, useEffect } from 'react';
import {
  AlertCircle,
  Loader2, Scan, BarChart2, ArrowRight,
  FileImage, CloudUpload, ChevronRight, FileText,
  ScanSearch, BarChart, Home
} from 'lucide-react';

const BACKEND_URL = 'http://localhost:8080';

// =============================================
// TYPE DEFINITIONS
// =============================================
interface AnalysisResponse {
  headline: string;
  sourceNameInImage: string;
  dateInImage: string;
  mainTextExcerpt: string;
  mainClaim: string;
  detectedLanguage: string;
  verificationStatus: string;
  riskLevel: string;
  reasoningSummary: string;
  finalVerdict: string;
  searchEvidence: any[];
  elaScore: number;
  elaStatus: string;
  base64ElaImage: string;
}

interface ErrorResponse {
  errorCode: string;
  message: string;
  timestamp: string;
}

// =============================================
// COMPONENTS
// =============================================

const BADGE_STATES = [
  { label: 'SCANNING',       bg: 'bg-[#9747FF]/15', border: 'border-[#9747FF]/40', text: 'text-[#9747FF]',  dot: 'bg-[#9747FF]' },
  { label: 'ANALYZING',      bg: 'bg-blue-500/15',   border: 'border-blue-500/40',  text: 'text-blue-400',   dot: 'bg-blue-400' },
  { label: 'RISK DETECTED',  bg: 'bg-orange-500/15', border: 'border-orange-500/40',text: 'text-orange-400', dot: 'bg-orange-400' },
  { label: 'UNVERIFIED',     bg: 'bg-yellow-500/15', border: 'border-yellow-500/40',text: 'text-yellow-400', dot: 'bg-yellow-400' },
];

const Beranda = ({ navigate }: { navigate: (page: string) => void }) => {
  const [badgeIdx, setBadgeIdx] = useState(0);

  useEffect(() => {
    const durations = [2200, 2000, 2500, 3000];
    let timeout: ReturnType<typeof setTimeout>;
    const cycle = (idx: number) => {
      timeout = setTimeout(() => {
        const next = (idx + 1) % BADGE_STATES.length;
        setBadgeIdx(next);
        cycle(next);
      }, durations[idx]);
    };
    cycle(badgeIdx);
    return () => clearTimeout(timeout);
  }, []);

  const badge = BADGE_STATES[badgeIdx];

  return (
    <div className="min-h-screen bg-[#000000] text-[#FFFFFF] flex flex-col font-sans">
      <div className="w-full max-w-7xl mx-auto px-8 py-10">
        {/* Header */}
        <div className="mb-20">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="OHIM AI Logo" className="h-10 w-auto object-contain" />
            <span className="font-bold text-xl tracking-wider">OHIM AI</span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-16 mb-24 mt-10">
          <div className="w-full md:w-[45%] shrink-0">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Detect.<br/>
              Verify.<br/>
              <span className="glitch-text text-[#9747FF]" data-text="Trust.">Trust.</span>
            </h1>
            <p className="text-[#7E818C] mb-8 max-w-md leading-relaxed">
              Verifikasi keaslian screenshot berita dengan analisis forensik dan validasi teks berbasis AI
            </p>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('cek_berita')}
                className="bg-[#9747FF] hover:bg-[#9747FF]/80 text-[#FFFFFF] px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
              >
                Cek Gambar Sekarang <ArrowRight size={18} />
              </button>
              <span className="text-xs text-[#7E818C]">Gratis • Tanpa Akun</span>
            </div>
            <div className="mt-12 flex items-center gap-10 border-t border-[#3A3A3D] pt-8">
              <div>
                <div className="text-2xl font-bold">99.2%</div>
                <div className="text-xs text-[#7E818C] uppercase tracking-wider">Akurasi ELA</div>
              </div>
              <div>
                <div className="text-2xl font-bold">2 model</div>
                <div className="text-xs text-[#7E818C] uppercase tracking-wider">AI OCR</div>
              </div>
            </div>
          </div>
          <div className="w-full md:w-[55%] flex justify-center">
            <div className="border border-[#3A3A3D] rounded-2xl bg-[#1E1E20] w-full overflow-hidden shadow-2xl">
              {/* Header bar */}
              <div className="flex text-[10px] font-bold text-[#7E818C] border-b border-[#3A3A3D] tracking-widest uppercase">
                <div className="flex-1 p-3 text-center border-r border-[#3A3A3D]">Input</div>
                <div className="flex-1 p-3 text-center text-[#9747FF]">Output</div>
              </div>

              <div className="p-5 flex gap-5">
                {/* INPUT: Mock news screenshot + scanner */}
                <div className="w-1/2 relative rounded-xl overflow-hidden bg-[#0D0D10]" style={{aspectRatio:'4/3'}}>
                  {/* Mock news page */}
                  <div className="absolute inset-0 p-3 flex flex-col gap-1.5 select-none">
                    {/* Site header */}
                    <div className="flex items-center gap-1.5 border-b border-[#2A2A2D] pb-1.5">
                      <div className="w-3 h-3 bg-red-500 rounded-sm shrink-0"></div>
                      <div className="h-1.5 w-14 bg-[#3A3A3D] rounded"></div>
                      <div className="ml-auto flex gap-1">
                        <div className="h-1.5 w-6 bg-[#2A2A2D] rounded"></div>
                        <div className="h-1.5 w-6 bg-[#2A2A2D] rounded"></div>
                      </div>
                    </div>
                    {/* Tag */}
                    <div className="flex gap-1.5 items-center">
                      <div className="h-1.5 w-10 bg-red-500/70 rounded-sm"></div>
                      <div className="h-1.5 w-8 bg-[#2A2A2D] rounded"></div>
                    </div>
                    {/* Headline */}
                    <div className="space-y-1 mt-0.5">
                      <div className="h-2.5 w-full bg-[#4A4A50] rounded"></div>
                      <div className="h-2.5 w-11/12 bg-[#4A4A50] rounded"></div>
                      <div className="h-2.5 w-4/5 bg-[#4A4A50] rounded"></div>
                    </div>
                    {/* Meta */}
                    <div className="flex gap-2 items-center mt-0.5">
                      <div className="h-1.5 w-12 bg-[#2A2A2D] rounded"></div>
                      <div className="h-1.5 w-1.5 bg-[#2A2A2D] rounded-full"></div>
                      <div className="h-1.5 w-16 bg-[#2A2A2D] rounded"></div>
                    </div>
                    {/* Featured image */}
                    <div className="flex-1 rounded bg-[#1A1A1F] mt-1 relative overflow-hidden">
                      <div className="absolute inset-0 flex flex-col justify-end p-2 gap-1">
                        <div className="h-1.5 w-3/4 bg-[#252528] rounded"></div>
                        <div className="h-1.5 w-1/2 bg-[#252528] rounded"></div>
                      </div>
                    </div>
                    {/* Body text */}
                    <div className="space-y-1 mt-1">
                      <div className="h-1.5 w-full bg-[#2A2A2D] rounded"></div>
                      <div className="h-1.5 w-full bg-[#2A2A2D] rounded"></div>
                      <div className="h-1.5 w-2/3 bg-[#2A2A2D] rounded"></div>
                    </div>
                  </div>

                  {/* Scanner glow trail */}
                  <div className="scanner-glow pointer-events-none"></div>
                  {/* Scanner line */}
                  <div className="scanner-line pointer-events-none"></div>

                  {/* SCANNING badge */}
                  <div className="absolute top-2 right-2 flex items-center gap-1 bg-[#9747FF]/20 border border-[#9747FF]/40 rounded px-1.5 py-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#9747FF] scanning-badge"></div>
                    <span className="text-[8px] font-bold text-[#9747FF] tracking-widest">SCANNING</span>
                  </div>
                </div>

                {/* OUTPUT side */}
                <div className="w-1/2 space-y-2.5">
                  {/* Cycling status badge */}
                  <div className="flex items-center gap-2">
                    <div className={`flex items-center gap-1 px-2 py-0.5 rounded border transition-all duration-700 ${badge.bg} ${badge.border}`}>
                      <div className={`w-1.5 h-1.5 rounded-full scanning-badge ${badge.dot}`}></div>
                      <span className={`text-[8px] font-bold tracking-widest transition-colors duration-700 ${badge.text}`}>{badge.label}</span>
                    </div>
                    <div className="skeleton skeleton-d1 h-1.5 flex-1 rounded opacity-60"></div>
                  </div>

                  {/* Fields – staggered fade in */}
                  <div className="space-y-1.5 mt-1">
                    <div className="field-row-1 flex justify-between items-center">
                      <div className="h-1.5 w-14 bg-[#3A3A3D] rounded"></div>
                      <div className="skeleton skeleton-d1 h-1.5 w-20 rounded"></div>
                    </div>
                    <div className="field-row-2 flex justify-between items-center">
                      <div className="h-1.5 w-10 bg-[#3A3A3D] rounded"></div>
                      <div className="skeleton skeleton-d2 h-1.5 w-24 rounded"></div>
                    </div>
                    <div className="field-row-3 flex justify-between items-center">
                      <div className="h-1.5 w-16 bg-[#3A3A3D] rounded"></div>
                      <div className="skeleton skeleton-d3 h-1.5 w-16 rounded"></div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-[#2A2A2D]"></div>

                  {/* Risk level bar – pulsing */}
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <div className="skeleton skeleton-d2 h-1.5 w-12 rounded"></div>
                      <div className="h-1.5 w-8 bg-yellow-500/50 rounded scanning-badge"></div>
                    </div>
                    <div className="h-1.5 w-full bg-[#2A2A2D] rounded-full overflow-hidden">
                      <div className="risk-bar-fill h-full bg-gradient-to-r from-yellow-500/60 to-yellow-400/80 rounded-full"></div>
                    </div>
                  </div>

                  {/* Summary block – typewriter lines */}
                  <div className="w-full bg-[#252528] rounded-lg mt-1 p-2 space-y-1.5 overflow-hidden">
                    <div className="h-1.5 bg-[#3A3A3D] rounded summary-line-1" style={{maxWidth:'100%'}}></div>
                    <div className="h-1.5 bg-[#3A3A3D] rounded summary-line-2" style={{maxWidth:'100%'}}></div>
                    <div className="h-1.5 bg-[#3A3A3D] rounded summary-line-3" style={{maxWidth:'100%'}}></div>
                    <div className="h-1.5 bg-[#3A3A3D] rounded summary-line-4" style={{maxWidth:'67%'}}></div>
                  </div>

                  {/* Source cards – pulse glow */}
                  <div className="flex gap-1.5 mt-1">
                    <div className="source-card flex-1 h-5 rounded border"></div>
                    <div className="source-card-2 flex-1 h-5 rounded border"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fitur Utama */}
        <div className="mb-24 border-t border-[#3A3A3D] pt-16">
          <div className="text-xs font-bold font-mono text-[#9747FF] uppercase tracking-widest mb-3">Fitur Utama</div>
          <h2 className="text-2xl font-bold mb-10">
            <span className="text-[#FFFFFF]">Teknologi untuk deteksi hoaks</span> <span className="text-[#7E818C]">dalam bentuk berita.</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#1E1E20] p-6 rounded-xl border border-[#3A3A3D]">
              <div className="bg-[#9747FF]/10 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                <Scan className="text-[#9747FF]" size={20} />
              </div>
              <h3 className="text-lg font-bold mb-3">Analis Forensik Visual ELA</h3>
              <p className="text-sm text-[#7E818C] leading-relaxed">Deteksi area manipulasi piksel dengan heatmap interaktif berbasis Error Level Analysis — mengungkap retouching yang tidak terlihat mata.</p>
            </div>
            <div className="bg-[#1E1E20] p-6 rounded-xl border border-[#3A3A3D]">
              <div className="bg-[#9747FF]/10 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                <FileText className="text-[#9747FF]" size={20} />
              </div>
              <h3 className="text-lg font-bold mb-3">Validasi Teks Berita (OCR + AI)</h3>
              <p className="text-sm text-[#7E818C] leading-relaxed">Ekstrak headline dan verifikasi ke sumber berita asli secara real-time menggunakan Gemini API — memastikan teks bukan hasil rekayasa.</p>
            </div>
            <div className="bg-[#1E1E20] p-6 rounded-xl border border-[#3A3A3D]">
              <div className="bg-[#9747FF]/10 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                <BarChart2 className="text-[#9747FF]" size={20} />
              </div>
              <h3 className="text-lg font-bold mb-3">Laporan Komprehensif</h3>
              <p className="text-sm text-[#7E818C] leading-relaxed">Hasil analisis lengkap dalam satu tampilan: heatmap, transkrip teks OCR, status validasi, dan skor kepercayaan konten.</p>
            </div>
          </div>
        </div>

        {/* Cara Penggunaan */}
        <div className="mb-24 border-t border-[#3A3A3D] pt-16">
          <div className="text-xs font-bold font-mono text-[#9747FF] uppercase tracking-widest mb-3">Cara Penggunaan</div>
          <h2 className="text-2xl font-bold mb-16">
            <span className="text-[#FFFFFF]">Tiga Langkah.</span> <span className="text-[#7E818C]">Satu Kebenaran.</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {/* Step 01 */}
            <div className="relative flex flex-col">
              <div className="flex-1 relative">
                <div className="hidden md:block absolute right-[-1.5rem] top-1/2 -translate-y-1/2">
                  <ChevronRight size={16} className="text-[#9747FF]" />
                </div>
                <div className="text-4xl font-bold text-[#9747FF] font-mono mb-4">01</div>
                <h3 className="text-lg font-bold mb-2">Upload Screenshot</h3>
                <p className="text-sm text-[#7E818C] leading-relaxed">Unggah tangkapan layar berita yang ingin kamu verifikasi — format PNG, JPG atau WebP didukung.</p>
              </div>
              {/* Timeline Line & Dot */}
              <div className="hidden md:block mt-12 relative w-full h-4">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[calc(100%+2rem)] h-[1px] bg-[#9747FF]"></div>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#9747FF] z-10"></div>
              </div>
            </div>

            {/* Step 02 */}
            <div className="relative flex flex-col">
              <div className="flex-1 relative">
                <div className="hidden md:block absolute right-[-1.5rem] top-1/2 -translate-y-1/2">
                  <ChevronRight size={16} className="text-[#9747FF]" />
                </div>
                <div className="text-4xl font-bold text-[#9747FF] font-mono mb-4">02</div>
                <h3 className="text-lg font-bold mb-2">Ekstraksi dan Pencarian</h3>
                <p className="text-sm text-[#7E818C] leading-relaxed">OHIM AI membaca isi gambar lalu sistem mencocokkan dengan informasi web.</p>
              </div>
              {/* Timeline Line & Dot */}
              <div className="hidden md:block mt-12 relative w-full h-4">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[calc(100%+2rem)] h-[1px]" style={{ background: 'linear-gradient(90deg, #9747FF 0%, #9747FF 90%, #3A3A3D 100%)' }}></div>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#000000] border-2 border-[#9747FF] z-10"></div>
              </div>
            </div>

            {/* Step 03 */}
            <div className="relative flex flex-col">
              <div className="flex-1 relative">
                <div className="text-4xl font-bold text-[#9747FF] font-mono mb-4">03</div>
                <h3 className="text-lg font-bold mb-2">Lihat Hasilnya</h3>
                <p className="text-sm text-[#7E818C] leading-relaxed">Tampilan heatmap ELA dan status keaslian teks ditampilkan lengkap dengan sumber aslinya.</p>
              </div>
              {/* Timeline Line & Dot */}
              <div className="hidden md:block mt-12 relative w-full h-4">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[1px] bg-[#3A3A3D]"></div>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#000000] border-2 border-[#3A3A3D] z-10"></div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-[#1E1E20] rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between border border-[#3A3A3D] mb-12">
          <div className="mb-6 md:mb-0">
            <h3 className="text-xl font-bold mb-2">Siap memverifikasi berita?</h3>
            <p className="text-[#7E818C] text-sm">Jangan percaya begitu saja — satu klik bisa mengungkap tipuannya.</p>
          </div>
          <button 
            onClick={() => navigate('cek_berita')} 
            className="bg-[#9747FF] hover:bg-[#9747FF]/80 text-[#FFFFFF] px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors w-full md:w-auto justify-center"
          >
            Mulai Verifikasi? <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

const CekBerita = ({ onAnalysisComplete, navigate }: { onAnalysisComplete: (data: AnalysisResponse) => void; navigate: (page: string) => void }) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const applyFile = (file: File) => {
    setFileName(file.name);
    setSelectedFile(file);
    setError(null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) applyFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      applyFile(file);
    } else if (file) {
      setError('Format file tidak didukung. Gunakan JPG atau PNG.');
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
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
        onAnalysisComplete(data as AnalysisResponse);
        navigate('hasil_analisis');
      }
    } catch {
      setError('Tidak dapat terhubung ke server backend. Pastikan backend berjalan di port 8080.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-[#FFFFFF] flex flex-col font-sans">
      <div className="w-full max-w-3xl mx-auto px-8 py-14">
        {/* Title */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-2">OHIM AI</h1>
          <p className="text-[#7E818C]">Verifikasi screenshot berita berbasis AI</p>
        </div>

        {/* Card */}
        <div className="bg-[#1E1E20] p-6 rounded-2xl border border-[#3A3A3D]">
          <h2 className="text-sm font-medium mb-4">Input Analisis</h2>

          <label
            htmlFor="file-upload"
            className={`border-2 border-dashed rounded-xl h-96 flex flex-col items-center justify-center text-center p-8 transition-colors cursor-pointer ${
              isDragging
                ? 'border-[#9747FF] bg-[#9747FF]/10'
                : 'border-[#9747FF]/60 bg-[#1E1E20] hover:bg-[#252527]'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {fileName ? (
              <div className="flex flex-col items-center gap-4">
                <FileImage size={52} className="text-[#FFFFFF]" />
                <p className="font-medium text-[#FFFFFF] text-lg">{fileName}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="bg-[#2A2A2D] p-5 rounded-full">
                  <CloudUpload className="text-[#9747FF]" size={40} strokeWidth={1.8} />
                </div>
                <p className="font-semibold text-[#FFFFFF] text-base mt-2">Upload screenshot berita</p>
                <p className="text-sm text-[#7E818C]">Drag &amp; drop atau klik untuk memilih</p>
                <p className="text-sm text-[#5A5A5A]">JPG, JPEG, PNG · Maks. 5MB</p>
              </div>
            )}
          </label>

          <input
            id="file-upload"
            type="file"
            className="hidden"
            accept="image/jpeg, image/png, image/jpg"
            onChange={handleFileChange}
          />

          <button
            onClick={handleAnalyze}
            disabled={!selectedFile || isLoading}
            className={`mt-4 w-full py-3.5 rounded-full font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
              selectedFile && !isLoading
                ? 'bg-[#9747FF] hover:bg-[#9747FF]/80 text-[#FFFFFF] cursor-pointer'
                : 'bg-[#2A2A2D] text-[#7E818C] cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Menganalisis...
              </>
            ) : (
              'Analisis Sekarang'
            )}
          </button>

          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-2">
              <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const RISK_THEME = {
  HIGH:    { bg: 'bg-red-500/15',    border: 'border-red-500/40',    text: 'text-red-400',    label: 'Tidak Sesuai' },
  MEDIUM:  { bg: 'bg-yellow-500/15', border: 'border-yellow-500/40', text: 'text-yellow-400', label: 'Kemungkinan Tidak Sesuai' },
  LOW:     { bg: 'bg-green-500/15',  border: 'border-green-500/40',  text: 'text-green-400',  label: 'Sesuai' },
  UNKNOWN: { bg: 'bg-[#2A2A2D]',     border: 'border-[#3A3A3D]',     text: 'text-[#7E818C]',  label: 'Tidak Dapat Ditentukan' },
};

const getRiskTheme = (risk: string) =>
  RISK_THEME[(risk?.toUpperCase() as keyof typeof RISK_THEME)] ?? RISK_THEME.UNKNOWN;

const ELA_THEME: Record<string, { bg: string; border: string; text: string; label: string; desc: string }> = {
  'SAFE':                   { bg: 'bg-green-500/10', border: 'border-green-500/40', text: 'text-green-400',  label: 'Aman',               desc: 'Tidak terdeteksi indikasi manipulasi piksel.' },
  'SUSPICIOUS':             { bg: 'bg-yellow-500/10',border: 'border-yellow-500/40',text: 'text-yellow-400', label: 'Mencurigakan',        desc: 'Terdapat area dengan pola kompresi tidak wajar.' },
  'HIGH RISK OF TAMPERING': { bg: 'bg-red-500/10',   border: 'border-red-500/40',   text: 'text-red-400',   label: 'Indikasi Manipulasi', desc: 'Area terang menunjukkan kemungkinan rekayasa gambar.' },
};

const getElaTheme = (status: string) =>
  ELA_THEME[status?.toUpperCase()] ?? ELA_THEME['SUSPICIOUS'];

const HasilAnalisis = ({ result }: { result: AnalysisResponse | null }) => {
  if (!result) {
    return (
      <div className="min-h-screen bg-[#000000] text-[#FFFFFF] flex items-center justify-center">
        <p className="text-[#7E818C]">Tidak ada data analisis.</p>
      </div>
    );
  }

  const riskTheme = getRiskTheme(result.riskLevel);
  const elaTheme  = result.elaStatus ? getElaTheme(result.elaStatus) : null;

  return (
    <div className="min-h-screen bg-[#000000] text-[#FFFFFF] font-sans">
      <div className="w-full max-w-3xl mx-auto px-8 py-14">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-1">Hasil Analisis</h1>
          <p className="text-[#7E818C] text-sm">OHIM AI · Verifikasi screenshot berita</p>
        </div>

        {/* ── Verdict banner (warna dari riskLevel) ── */}
        <div className={`rounded-xl p-5 border mb-6 flex items-center justify-between ${riskTheme.bg} ${riskTheme.border}`}>
          <div>
            <div className="text-[10px] font-bold tracking-widest text-[#7E818C] uppercase mb-1">Verdict Akhir</div>
            <div className={`text-xl font-bold ${riskTheme.text}`}>{riskTheme.label}</div>
          </div>
          <span className={`text-xs font-bold px-3 py-1 rounded-full border ${riskTheme.bg} ${riskTheme.border} ${riskTheme.text}`}>
            {result.riskLevel}
          </span>
        </div>

        {/* ── Meta info ── */}
        <div className="bg-[#1E1E20] rounded-xl border border-[#3A3A3D] p-5 mb-4 space-y-3">
          {result.headline && (
            <div>
              <div className="text-[10px] font-bold text-[#7E818C] uppercase tracking-widest mb-1">Headline</div>
              <div className="text-sm font-medium">{result.headline}</div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            {result.sourceNameInImage && (
              <div>
                <div className="text-[10px] font-bold text-[#7E818C] uppercase tracking-widest mb-1">Sumber</div>
                <div className="text-sm">{result.sourceNameInImage}</div>
              </div>
            )}
            {result.dateInImage && (
              <div>
                <div className="text-[10px] font-bold text-[#7E818C] uppercase tracking-widest mb-1">Tanggal</div>
                <div className="text-sm">{result.dateInImage}</div>
              </div>
            )}
            {result.detectedLanguage && (
              <div>
                <div className="text-[10px] font-bold text-[#7E818C] uppercase tracking-widest mb-1">Bahasa</div>
                <div className="text-sm">{result.detectedLanguage}</div>
              </div>
            )}
            {result.verificationStatus && (
              <div>
                <div className="text-[10px] font-bold text-[#7E818C] uppercase tracking-widest mb-1">Status Verifikasi</div>
                <div className="text-sm">{result.verificationStatus}</div>
              </div>
            )}
          </div>
        </div>

        {/* ── Klaim Utama ── */}
        {result.mainClaim && (
          <div className="bg-[#1E1E20] rounded-xl border border-[#3A3A3D] p-5 mb-4">
            <div className="text-[10px] font-bold text-[#7E818C] uppercase tracking-widest mb-2">Klaim Utama</div>
            <p className="text-sm leading-relaxed">{result.mainClaim}</p>
          </div>
        )}

        {/* ── Ringkasan Analisis ── */}
        {result.reasoningSummary && (
          <div className="bg-[#1E1E20] rounded-xl border border-[#3A3A3D] p-5 mb-4">
            <div className="text-[10px] font-bold text-[#7E818C] uppercase tracking-widest mb-2">Ringkasan Analisis</div>
            <p className="text-sm leading-relaxed text-[#C0C0C8]">{result.reasoningSummary}</p>
          </div>
        )}

        {/* ── OCR ── */}
        {result.mainTextExcerpt && (
          <div className="bg-[#1E1E20] rounded-xl border border-[#3A3A3D] p-5 mb-4">
            <div className="text-[10px] font-bold text-[#7E818C] uppercase tracking-widest mb-2">Teks Terdeteksi (OCR)</div>
            <p className="text-sm leading-relaxed text-[#7E818C] font-mono whitespace-pre-wrap">{result.mainTextExcerpt}</p>
          </div>
        )}

        {/* ── ELA Section ── */}
        {elaTheme && result.elaStatus !== 'UNAVAILABLE' && (
          <div className="mb-4">
            <div className="text-[10px] font-bold text-[#7E818C] uppercase tracking-widest mb-3">Analisis Forensik Foto (ELA)</div>

            {/* ELA status card */}
            <div className={`rounded-xl p-4 border mb-2 flex items-center justify-between ${elaTheme.bg} ${elaTheme.border}`}>
              <div>
                <div className={`text-base font-bold mb-0.5 ${elaTheme.text}`}>{elaTheme.label}</div>
                <div className="text-xs text-[#7E818C]">{elaTheme.desc}</div>
              </div>
              <div className={`text-2xl font-bold tabular-nums ${elaTheme.text}`}>
                {result.elaScore?.toFixed(2)}%
              </div>
            </div>

            <p className="text-[11px] text-[#7E818C] italic mb-3">
              * ELA adalah indikasi awal, bukan vonis final. Gambar yang sering dikirim ulang via WhatsApp/media sosial dapat mempengaruhi akurasi analisis.
            </p>

            {/* Heatmap */}
            {result.base64ElaImage && (
              <div className="bg-[#1E1E20] rounded-xl border border-[#3A3A3D] p-4">
                <div className="text-xs font-medium text-[#7E818C] mb-3">Heat-map ELA</div>
                <img
                  src={`data:image/png;base64,${result.base64ElaImage}`}
                  alt="ELA Heatmap"
                  className="w-full rounded-lg object-contain max-h-96"
                />
                <p className="text-[11px] text-[#7E818C] mt-3">
                  Area terang = potensi manipulasi &bull; Area gelap = kompresi normal
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── Bukti Pencarian ── */}
        {result.searchEvidence && result.searchEvidence.length > 0 && (
          <div className="bg-[#1E1E20] rounded-xl border border-[#3A3A3D] p-5">
            <div className="text-[10px] font-bold text-[#7E818C] uppercase tracking-widest mb-3">
              Bukti Pencarian ({result.searchEvidence.length})
            </div>
            <div className="space-y-2">
              {result.searchEvidence.map((ev: any, i: number) => (
                <a
                  key={i}
                  href={ev.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 bg-[#252528] rounded-lg border border-[#3A3A3D] text-sm hover:border-[#9747FF]/50 hover:bg-[#2A2030] transition-colors group"
                >
                  {ev.title && <div className="font-medium mb-0.5 group-hover:text-[#9747FF] transition-colors">{ev.title}</div>}
                  {ev.snippet && <div className="text-[#7E818C] text-xs leading-relaxed">{ev.snippet}</div>}
                  {ev.url && <div className="text-[#9747FF]/60 text-xs mt-1.5 truncate group-hover:text-[#9747FF] transition-colors">↗ {ev.url}</div>}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


// =============================================
// SLIDING NAVBAR
// =============================================

const SlidingNavbar = ({
  activeMenu,
  navigate,
  hasAnalysis,
  sidebarOpen,
  setSidebarOpen,
}: {
  activeMenu: string;
  navigate: (page: string) => void;
  hasAnalysis: boolean;
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
}) => {
  const navItems = [
    { key: 'cek_berita', label: 'Cek Berita', icon: <ScanSearch size={16} />, disabled: false },
    { key: 'hasil_analisis', label: 'Hasil Analisis', icon: <BarChart size={16} />, disabled: !hasAnalysis },
  ];

  return (
    <>
      {/* Invisible trigger strip on the left edge */}
      <div
        className="fixed left-0 top-0 h-full w-3 z-50"
        onMouseEnter={() => setSidebarOpen(true)}
      />

      {/* Sidebar panel */}
      <div
        className={`fixed left-0 top-0 h-full w-52 bg-[#111112] border-r border-[#3A3A3D] z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
        onMouseLeave={() => setSidebarOpen(false)}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-[#3A3A3D]">
          <img src="/logo.png" alt="OHIM AI Logo" className="h-8 w-auto object-contain" />
          <span className="font-bold text-base tracking-wider text-[#FFFFFF]">OHIM AI</span>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => {
                if (!item.disabled) {
                  navigate(item.key);
                  setSidebarOpen(false);
                }
              }}
              disabled={item.disabled}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                activeMenu === item.key
                  ? 'bg-[#9747FF]/15 text-[#9747FF]'
                  : item.disabled
                  ? 'text-[#3A3A3D] cursor-not-allowed'
                  : 'text-[#7E818C] hover:bg-[#1E1E20] hover:text-[#FFFFFF]'
              }`}
            >
              {item.icon}
              {item.label}
              {item.key === 'hasil_analisis' && !hasAnalysis && (
                <span className="ml-auto text-[10px] text-[#3A3A3D]">Analisis dulu</span>
              )}
            </button>
          ))}
        </nav>

        {/* Bottom: Beranda */}
        <div className="px-3 py-4 border-t border-[#3A3A3D]">
          <button
            onClick={() => { navigate('beranda'); setSidebarOpen(false); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#7E818C] hover:bg-[#1E1E20] hover:text-[#FFFFFF] transition-colors"
          >
            <Home size={16} />
            Beranda
          </button>
        </div>
      </div>
    </>
  );
};

// =============================================
// MAIN APP COMPONENT
// =============================================

function App() {
  const [activeMenu, setActiveMenu] = useState('beranda');
  const [hasAnalysis, setHasAnalysis] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isOnBeranda = activeMenu === 'beranda';

  return (
    <>
      {!isOnBeranda && (
        <SlidingNavbar
          activeMenu={activeMenu}
          navigate={setActiveMenu}
          hasAnalysis={hasAnalysis}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      )}

      {activeMenu === 'beranda' && <Beranda navigate={setActiveMenu} />}
      {activeMenu === 'cek_berita' && (
        <CekBerita
          onAnalysisComplete={(data) => { setHasAnalysis(true); setAnalysisResult(data); }}
          navigate={setActiveMenu}
        />
      )}
      {activeMenu === 'hasil_analisis' && <HasilAnalisis result={analysisResult} />}
    </>
  );
}

export default App;