# WES downloader V2
## Download wallpapers directly from [wallpaperengine.space](https://wallpaperengine.space)

### https://wes-downloader-mm6502lwz-hieuduong111.vercel.app

<h1 align="center">
	<a href="#"><img src="https://i.ibb.co/7JyCy6bk/image-2.webp"></a>
</h1>


# How it works

<h1 align="center">
	<a href="#"><img src="https://i.ibb.co/bgxhVYwN/Untitled-2026-08-27-2018.png"></a>
</h1>

# Credits

### Developer:

- hieuduong111<br>
    Discord: `hieuduong111`<br>
    GitHub: https://github.com/hieuduong111
    *(Rebuilt & Modernized from original concept)*

### Tech Stack & Core Technologies

- **Framework**: [Next.js (App Router)](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Deployment**: [Vercel](https://vercel.com/)

### Key Features (V2)

- **Direct Media Extraction**: Bypasses complex stream chunking and `mux.js` re-assembly, directly fetching raw `.mp4` files from WES servers.
- **Smart Fallback System**: Automatically handles directory variations (`wallpapers/` vs `fallback/live-capture/`) and falls back to `.webp` posters if video previews are unavailable.
- **Modern Dark UI**: Features a sleek, responsive dark-themed user interface built with Tailwind CSS.