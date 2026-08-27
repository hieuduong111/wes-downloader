import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { url } = await request.json();
    
    if (!url || !url.includes('wallpaperengine.space/wallpaper/')) {
        return NextResponse.json({ error: 'Invalid link. Please enter a valid Wallpaper Engine Space URL.' }, { status: 400 });
    }

    const urlParts = url.split('/wallpaper/');
    let slug = urlParts[1];
    slug = slug.split('?')[0].replace(/\/$/, ""); 

    const possibleUrls = [
      `https://media.wallpaperengine.space/wallpapers/v1/${slug}.mp4`,
      `https://media.wallpaperengine.space/fallback/live-capture/v1/${slug}.mp4`
    ];

    let validVideoUrl = null;

    for (const videoUrl of possibleUrls) {
      try {
        const res = await fetch(videoUrl, { method: 'HEAD' });
        if (res.ok) {
          validVideoUrl = videoUrl;
          break;
        }
      } catch (e) {
      }
    }

    let steamUrl = null;
    try {
      const pageRes = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      
      if (pageRes.ok) {
        const html = await pageRes.text();
        const steamMatch = html.match(/https:\/\/steamcommunity\.com\/sharedfiles\/filedetails\/\?id=\d+/);
        if (steamMatch) {
          steamUrl = steamMatch[0];
        }
      }
    } catch (e) {
    }

    if (validVideoUrl || steamUrl) {
      return NextResponse.json({ 
        videoUrl: validVideoUrl,
        steamUrl: steamUrl 
      });
    }
    
    return NextResponse.json({ error: 'Media file not found on WES servers.' }, { status: 404 });
    
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}