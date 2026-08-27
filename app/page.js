'use client';
import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [mediaSrc, setMediaSrc] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [videoFailed, setVideoFailed] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    setMediaSrc(null);
    setError(null);
    setVideoFailed(false);
    
    try {
      const res = await fetch('/api/getVideo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      const data = await res.json();
      
      if (res.ok && data.videoUrl) {
        setMediaSrc({
          video: data.videoUrl,
          image: data.videoUrl.replace('/wallpapers/', '/posters/').replace('.mp4', '.webp')
        });
      } else {
        setError(data.error || 'An error occurred, media not found.');
      }
    } catch (err) {
      setError('Connection to server failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-10 font-sans bg-gray-950 text-gray-100">
      <h1 className="text-4xl font-extrabold mb-8 mt-10 tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
        WES Downloader V2
      </h1>
      
      <div className="w-full max-w-xl flex flex-col gap-4">
        <input 
          type="text" 
          placeholder="Paste WallpaperEngine.Space link here..." 
          className="border border-gray-800 bg-gray-900 text-gray-100 placeholder-gray-500 p-4 rounded-xl focus:outline-none focus:border-indigo-500 shadow-inner transition"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button 
          onClick={handleDownload} 
          disabled={loading || !url}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-4 rounded-xl transition shadow-lg disabled:bg-gray-800 disabled:text-gray-600"
        >
          {loading ? 'Extracting...' : 'Get Video Link'}
        </button>
      </div>

      {error && <p className="text-red-400 mt-6 font-medium">{error}</p>}

      {mediaSrc && (
        <div className="mt-10 text-center flex flex-col items-center w-full max-w-4xl">
          <p className="mb-4 text-emerald-400 font-semibold">Extraction complete!</p>

          {!videoFailed ? (
            <>
              <video 
                src={mediaSrc.video} 
                controls 
                autoPlay 
                className="w-full rounded-2xl shadow-2xl mb-6 bg-black border border-gray-800 max-h-[60vh]"
                onError={() => setVideoFailed(true)}
              />
              <a href={mediaSrc.video} target="_blank" rel="noreferrer" 
                 className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg transition mb-4">
                Download Video (.mp4)
              </a>
            </>
          ) : (
            <>
              <p className="text-amber-400 font-medium mb-4">
                ⚠️ No video preview available. Displaying image preview instead:
              </p>
              <img 
                src={mediaSrc.image} 
                alt="Wallpaper Preview" 
                className="w-full rounded-2xl shadow-2xl mb-6 bg-black border border-gray-800 max-h-[60vh] object-cover"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <a href={mediaSrc.image} target="_blank" rel="noreferrer" 
                 className="bg-amber-600 hover:bg-amber-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg transition mb-4">
                Download Image (.webp)
              </a>
            </>
          )}
        </div>
      )}
    </main>
  );
}