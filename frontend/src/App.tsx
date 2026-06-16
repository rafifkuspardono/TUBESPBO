import { useState } from 'react';
import {
  CheckSquare, Info,
  FileText, AlertCircle,
  Loader2, Scan, BarChart2, ArrowRight,
  FileImage, CloudUpload, ChevronRight
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
}

interface ErrorResponse {
  errorCode: string;
  message: string;
  timestamp: string;
}

// =============================================
// COMPONENTS
// =============================================

const Beranda = ({ navigate }: { navigate: (page: string) => void }) => {
  return (
    <div className="min-h-screen bg-[#000000] text-[#FFFFFF] flex flex-col font-sans">
      <div className="px-8 py-10 md:px-24">
        {/* Header */}
        <div className="mb-20">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="OHIM AI Logo" className="h-10 w-auto object-contain" />
            <span className="font-bold text-xl tracking-wider">OHIM AI</span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-24 mt-10">
          <div className="w-full md:w-1/2">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Detect.<br/>
              Verifiy.<br/>
              <span className="text-[#9747FF]">Trust.</span>
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
            <div className="mt-12 flex items-center gap-10 border-t border-[#3A3A3D] pt-8 max-w-md">
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
          <div className="w-full md:w-1/2 flex justify-end">
            <div className="border border-[#3A3A3D] rounded-2xl bg-[#1E1E20] w-full max-w-2xl overflow-hidden shadow-2xl scale-105 transform origin-right">
              <div className="flex text-[10px] font-bold text-[#7E818C] border-b border-[#3A3A3D] tracking-widest uppercase">
                <div className="flex-1 p-3 text-center border-r border-[#3A3A3D]">Input</div>
                <div className="flex-1 p-3 text-center text-[#9747FF]">Output</div>
              </div>
              <div className="p-8 flex gap-8">
                <div className="w-1/2 bg-[#3A3A3D] rounded-lg aspect-[4/3]"></div>
                <div className="w-1/2 space-y-4">
                  <div className="flex gap-2">
                    <div className="h-4 w-8 bg-[#5A5A5A] rounded"></div>
                    <div className="h-4 flex-1 bg-[#5A5A5A] rounded"></div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-4 flex-1 bg-[#5A5A5A] rounded"></div>
                    <div className="h-4 w-12 bg-[#5A5A5A] rounded"></div>
                  </div>
                  <div className="h-4 w-full bg-[#5A5A5A] rounded"></div>
                  <div className="h-4 w-full bg-[#5A5A5A] rounded"></div>
                  <div className="h-4 w-3/4 bg-[#5A5A5A] rounded"></div>
                  <div className="h-20 w-full bg-[#5A5A5A] rounded mt-6"></div>
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

const CekBerita = () => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setSelectedFile(file);
      setError(null);
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
        console.log("Analysis Result:", data);
        alert("Analisis selesai. (Hasil belum ditampilkan sesuai permintaan)");
      }
    } catch {
      setError('Tidak dapat terhubung ke server backend. Pastikan backend berjalan di port 8080.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto md:mx-0">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">OHIM AI</h1>
        <p className="text-[#7E818C]">Verifikasi screenshot berita berbasis AI</p>
      </div>

      <div className="bg-[#1E1E20] p-8 rounded-xl border border-[#3A3A3D]">
        <h2 className="text-sm font-medium mb-6">Input Analisis</h2>

        <label
          htmlFor="file-upload"
          className="border-2 border-dashed border-[#9747FF]/40 rounded-xl h-[400px] flex flex-col items-center justify-center text-center p-6 bg-[#000000] hover:bg-[#1E1E20]/50 transition-colors cursor-pointer relative"
        >
          {fileName ? (
            <div className="flex flex-col items-center gap-4">
              <FileImage size={48} className="text-[#FFFFFF]" />
              <p className="font-medium text-[#FFFFFF] text-lg">{fileName}</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="bg-[#1E1E20] p-5 rounded-full mb-2 border border-[#3A3A3D] shadow-xl">
                <CloudUpload className="text-[#9747FF]" size={40} strokeWidth={2.5} />
              </div>
              <p className="font-medium text-[#FFFFFF] text-lg mb-1 mt-2">Upload screenshot berita</p>
              <p className="text-sm text-[#7E818C]">Drag &amp; drop atau klik untuk memilih</p>
              <p className="text-sm text-[#5A5A5A]">JPG, JPEG, PNG - Maks. 5MB</p>
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
          className={`mt-6 w-full py-4 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
            selectedFile && !isLoading
              ? 'bg-[#9747FF] hover:bg-[#9747FF]/80 text-[#FFFFFF] cursor-pointer'
              : 'bg-[#3A3A3D] text-[#7E818C] cursor-not-allowed'
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
  );
};

const HasilAnalisis = () => {
  return (
    <div className="max-w-4xl">
      {/* Sesuai permintaan, biarkan kosong dulu */}
    </div>
  );
};

const Tentang = () => {
  return (
    <div className="max-w-4xl mx-auto md:mx-0">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-10">Tentang OHIM AI</h1>
        
        <div className="space-y-6 text-[#7E818C] leading-relaxed text-sm md:text-base">
          <p>
            OHIM AI adalah ruang kerja analisis profesional yang dirancang untuk memverifikasi keaslian tangkapan layar berita. Di era penyebaran informasi yang cepat, membedakan antara berita asli dan gambar yang dimanipulasi sangatlah penting.
          </p>
          <p>
            Alat ini menyediakan antarmuka yang tenang dan otoritatif bagi para analis, jurnalis, dan pemeriksa fakta untuk mengunggah tangkapan layar yang mencurigakan dan menerima verifikasi berbasis AI (Kecerdasan Buatan) yang dicocokkan dengan sumber-sumber web yang telah diketahui.
          </p>
          
          <h2 className="text-2xl font-bold text-[#FFFFFF] mt-12 mb-6">Teknologi</h2>
          <ul className="list-disc pl-5 space-y-3">
            <li>Advance Optical Character Recognition (OCR) untuk mengekstrak teks dari gambar</li>
            <li>Natural Language Processing (NLP) untuk memahami konteks dan maksud</li>
            <li>Cross-referencing pencarian web secara real-time untuk menemukan sumber asli</li>
            <li>Pencocokan heuristik untuk menentukan adanya kemungkinan manipulasi</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// =============================================
// MAIN APP COMPONENT
// =============================================

function App() {
  const [activeMenu, setActiveMenu] = useState('beranda');

  if (activeMenu === 'beranda') {
    return <Beranda navigate={setActiveMenu} />;
  }

  return (
    <div className="flex min-h-screen bg-[#000000] text-[#FFFFFF] font-sans">
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#1E1E20] flex flex-col h-screen sticky top-0 border-r border-[#3A3A3D]">
        <div className="p-6 flex items-center gap-3">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveMenu('beranda')}>
            <img src="/logo.png" alt="OHIM AI Logo" className="h-8 w-auto object-contain" />
            <span className="font-bold text-xl tracking-wider">OHIM AI</span>
          </div>
        </div>
        
        <nav className="flex-1 flex flex-col gap-1 px-3 mt-4">
          <button
            onClick={() => setActiveMenu('cek_berita')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
              activeMenu === 'cek_berita' ? 'bg-[#3A3A3D] text-[#FFFFFF]' : 'text-[#7E818C] hover:text-[#FFFFFF]'
            }`}
          >
            <CheckSquare size={18} color={activeMenu === 'cek_berita' ? '#9747FF' : 'currentColor'} />
            <span className="font-medium text-sm">Cek Berita</span>
          </button>

          <button
            onClick={() => setActiveMenu('hasil_analisis')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
              activeMenu === 'hasil_analisis' ? 'bg-[#3A3A3D] text-[#FFFFFF]' : 'text-[#7E818C] hover:text-[#FFFFFF]'
            }`}
          >
            <FileText size={18} color={activeMenu === 'hasil_analisis' ? '#9747FF' : 'currentColor'} />
            <span className="font-medium text-sm">Hasil Analisis</span>
          </button>
        </nav>
        
        <div className="p-3">
          <button
            onClick={() => setActiveMenu('tentang')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
              activeMenu === 'tentang' ? 'bg-[#3A3A3D] text-[#FFFFFF]' : 'text-[#7E818C] hover:text-[#FFFFFF]'
            }`}
          >
            <Info size={18} color={activeMenu === 'tentang' ? '#9747FF' : 'currentColor'} />
            <span className="font-medium text-sm">Tentang</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-10 overflow-y-auto">
        {activeMenu === 'cek_berita' && <CekBerita />}
        {activeMenu === 'hasil_analisis' && <HasilAnalisis />}
        {activeMenu === 'tentang' && <Tentang />}
      </main>
    </div>
  );
}

export default App;