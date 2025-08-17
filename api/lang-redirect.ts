export const config = {
  runtime: 'edge'
};

function pickPrimaryLanguage(acceptLanguage: string | null): string {
  if (!acceptLanguage) return 'ja';
  const lower = acceptLanguage.toLowerCase();
  // Very light-weight detection: prioritize English if it appears first
  const parts = lower.split(',').map(s => s.trim());
  if (parts.length === 0) return 'ja';
  const first = parts[0];
  if (first.startsWith('en')) return 'en';
  return 'ja';
}

export default async function handler(req: Request): Promise<Response> {
  try {
    const url = new URL(req.url);
    // Only handle the site root; other paths should not route here ideally.
    // vercel.json should rewrite only "/" to this function.

    // If language cookie already set, do nothing and return original content.
    const cookie = req.headers.get('cookie') || '';
    if (cookie.includes('vc_lang=')) {
      const proxied = new URL(url.origin + '/index.html');
      return fetch(proxied.toString(), { headers: req.headers });
    }

    const lang = pickPrimaryLanguage(req.headers.get('accept-language'));
    if (lang === 'en') {
      // Set cookie and redirect to English top
      const headers = new Headers();
      headers.set('Location', '/en/');
      headers.append('Set-Cookie', 'vc_lang=en; Path=/; Max-Age=31536000; SameSite=Lax');
      return new Response(null, { status: 302, headers });
    }

    // Default: serve Japanese index
    const proxied = new URL(url.origin + '/index.html');
    return fetch(proxied.toString(), { headers: req.headers });
  } catch {
    return new Response(null, { status: 302, headers: { Location: '/' } });
  }
}


