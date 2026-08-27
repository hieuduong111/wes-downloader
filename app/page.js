'use client';
import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [mediaData, setMediaData] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [videoFailed, setVideoFailed] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    setMediaData(null);
    setError(null);
    setVideoFailed(false);
    
    try {
      const res = await fetch('/api/getVideo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      const data = await res.json();
      
      if (res.ok && (data.videoUrl || data.steamUrl)) {
        setMediaData({
          video: data.videoUrl,
          image: data.videoUrl ? data.videoUrl.replace('/wallpapers/', '/posters/').replace('.mp4', '.webp') : null,
          steam: data.steamUrl
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
    <main className="flex min-h-screen flex-col items-center p-10 font-sans bg-gray-50 text-gray-900">
      <h1 className="text-4xl font-bold mb-8 mt-10">WES Downloader V2</h1>
      
      <div className="w-full max-w-xl flex flex-col gap-4">
        <input 
          type="text" 
          placeholder="Paste WallpaperEngine.Space link here..." 
          className="border-2 border-gray-300 p-4 rounded-lg focus:outline-none focus:border-blue-500"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button 
          onClick={handleDownload} 
          disabled={loading || !url}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-4 rounded-lg transition disabled:bg-gray-400"
        >
          {loading ? 'Extracting...' : 'Get Media Links'}
        </button>
      </div>

      {error && <p className="text-red-500 mt-6 font-medium">{error}</p>}

      {mediaData && (
        <div className="mt-10 text-center flex flex-col items-center w-full max-w-4xl">
          <p className="mb-4 text-green-600 font-bold">Extraction complete!</p>

          {mediaData.steam && (
            <div className="mb-8 p-6 bg-blue-50 rounded-xl border-2 border-blue-200 w-full text-left shadow-sm">
              <p className="font-bold text-blue-800 text-lg mb-2">🔥 Get Original 4K / Scene Version:</p>
              <a href={mediaData.steam} target="_blank" rel="noreferrer" className="text-blue-600 underline break-all font-medium">
                {mediaData.steam}
              </a>
              <p className="text-sm mt-3 text-gray-600">
                Copy this link and paste it into a site like <b>SteamWorkshopDownloader.io</b> to download the full original file.
              </p>
            </div>
          )}

          {!videoFailed && mediaData.video ? (
            <>
              <video 
                src={mediaData.video} 
                controls 
                autoPlay 
                className="w-full rounded-xl shadow-2xl mb-6 bg-black max-h-[60vh]"
                onError={() => setVideoFailed(true)}
              />
              <a href={mediaData.video} target="_blank" rel="noreferrer" 
                 className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-bold shadow-lg transition mb-4">
                Download Preview Video (.mp4)
              </a>
            </>
          ) : mediaData.image ? (
            <>
              <p className="text-orange-600 font-medium mb-4">
                ⚠️ No video preview available. Displaying image preview instead:
              </p>
              <img 
                src={mediaData.image} 
                alt="Wallpaper Preview" 
                className="w-full rounded-xl shadow-2xl mb-6 bg-black max-h-[60vh] object-cover"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <a href={mediaData.image} target="_blank" rel="noreferrer" 
                 className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-bold shadow-lg transition mb-4">
                Download Preview Image (.webp)
              </a>
            </>
          ) : null}
        </div>
      )}
    </main>
  );
}