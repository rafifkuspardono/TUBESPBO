import { useState } from 'react';
import { LayoutDashboard, CheckSquare, Info, UploadCloud, FileSearch, AlertCircle } from 'lucide-react';

function App() {
  // State untuk melacak menu mana yang sedang aktif
  const [activeMenu, setActiveMenu] = useState('dashboard');
  
  // State untuk menyimpan nama file yang dipilih
  const [fileName, setFileName] = useState<string | null>(null);

  // Fungsi untuk menangani saat file dipilih dari File Explorer
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white font-sans">
      
      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-[#121212] flex flex-col p-6">
        {/* Logo Area */}
        <div className="flex items-center gap-3 mb-12">
          {/* Hapus div yang ada bg-white nya, langsung panggil img saja */}
          <img src="/logo.png" alt="OHIM AI Logo" className="h-20 w-auto object-contain" />
          <span className="font-bold text-xl tracking-wider">OHIM AI</span>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2">
          {/* Menu Dashboard */}
          <button 
            onClick={() => setActiveMenu('dashboard')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
              activeMenu === 'dashboard' ? 'bg-[#1e1e1e] border-l-4 border-purple-500 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <LayoutDashboard 
              size={20} 
              // SOLUSI: Garis (color) dan isi (fill) sama-sama ungu agar kotaknya jadi blok padat yang tegas.
              // Kalau ternyata dirasa terlalu tebal, ubah fill-nya menjadi "none" saja.
              color={activeMenu === 'dashboard' ? "#c084fc" : "currentColor"} 
              fill={activeMenu === 'dashboard' ? "#c084fc" : "none"} 
            />
            <span className="font-medium">Dashboard</span>
          </button>
          
          {/* Menu Check Image (Tetap dengan efek negative space yang keren) */}
          <button 
            onClick={() => setActiveMenu('check')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
              activeMenu === 'check' ? 'bg-[#1e1e1e] border-l-4 border-purple-500 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <CheckSquare 
              size={20} 
              color={activeMenu === 'check' ? "#1e1e1e" : "currentColor"} 
              fill={activeMenu === 'check' ? "#c084fc" : "none"} 
            />
            <span className="font-medium">Check Image</span>
          </button>

          {/* Menu About (Tetap dengan efek negative space yang keren) */}
          <button 
            onClick={() => setActiveMenu('about')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
              activeMenu === 'about' ? 'bg-[#1e1e1e] border-l-4 border-purple-500 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Info 
              size={20} 
              color={activeMenu === 'about' ? "#1e1e1e" : "currentColor"} 
              fill={activeMenu === 'about' ? "#c084fc" : "none"} 
            />
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
            
            <label htmlFor="file-upload" className="border-2 border-dashed border-purple-500/50 rounded-lg h-64 flex flex-col items-center justify-center text-center p-6 bg-[#0f0f0f] hover:bg-[#151515] transition-colors cursor-pointer relative">
              <div className="bg-[#1e1e1e] p-3 rounded-full mb-4">
                <UploadCloud size={24} className="text-purple-400" />
              </div>
              
              {fileName ? (
                <p className="font-medium text-purple-400 mb-1 truncate max-w-full px-4">{fileName}</p>
              ) : (
                <>
                  <p className="font-medium mb-1">Upload screenshot berita</p>
                  <p className="text-sm text-gray-500">Drag & drop atau klik untuk memilih</p>
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
          </div>

          {/* Card Hasil Analisis */}
          <div className="bg-[#121212] p-6 rounded-xl border border-[#222]">
            <h2 className="text-lg font-medium mb-4">Hasil Analisis</h2>
            <div className="h-64 flex flex-col items-center justify-center text-center p-6">
              <div className="bg-[#1e1e1e] p-4 rounded-full mb-4">
                <FileSearch size={32} className="text-gray-500" />
              </div>
              <p className="font-medium text-gray-300 mb-1">Belum ada hasil analisis</p>
              <p className="text-sm text-gray-500">Unggah screenshot berita untuk<br />memulai pemeriksaan</p>
            </div>
          </div>

        </div>

        {/* Section Cara Kerja */}
        <div className="mb-10">
          <h2 className="text-xl font-medium mb-4">Cara Kerja</h2>
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-[#121212] p-5 rounded-xl border border-[#222]">
              <div className="text-xs font-bold text-gray-500 mb-2">1</div>
              <h3 className="font-medium text-sm mb-1">Upload</h3>
              <p className="text-xs text-gray-500">Upload screenshot berita</p>
            </div>
            <div className="bg-[#121212] p-5 rounded-xl border border-[#222]">
              <div className="text-xs font-bold text-gray-500 mb-2">2</div>
              <h3 className="font-medium text-sm mb-1">Ekstraksi</h3>
              <p className="text-xs text-gray-500">AI membaca isi gambar</p>
            </div>
            <div className="bg-[#121212] p-5 rounded-xl border border-[#222]">
              <div className="text-xs font-bold text-gray-500 mb-2">3</div>
              <h3 className="font-medium text-sm mb-1">Pencarian</h3>
              <p className="text-xs text-gray-500">Mencari informasi pembanding</p>
            </div>
            <div className="bg-[#121212] p-5 rounded-xl border border-[#222]">
              <div className="text-xs font-bold text-gray-500 mb-2">4</div>
              <h3 className="font-medium text-sm mb-1">Verifikasi</h3>
              <p className="text-xs text-gray-500">Hasil verifikasi ditampilkan</p>
            </div>
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