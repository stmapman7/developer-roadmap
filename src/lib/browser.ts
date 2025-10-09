export function urlToId(url: string) {
  return url
    .replace(/^https?:\/\//, '')
    .replace('roadmap.sh', '')
    .replace(/localhost:[\d]*?/, '')
    .replace(/\?.*$/, '')
    .replace(/\/$/, '')
    .replace(/^\//, '')
    .replace(/[^a-zA-Z0-9]/g, '-')
    .toLowerCase() || 'home';
}

const LAST_PATH_KEY = 'lastPage';

export function storePathAsLastPath() {
  if (typeof window === 'undefined') {
    return;
  }

  const ignoredPaths = [
    '/login',
    '/signup',
    '/verfication-pending',
    '/verify-email',
    '/forgot-password',
  ];

  if (ignoredPaths.includes(window.location.pathname)) {
    return;
  }

  const pagePath = [
    '/respond-invite',
    '/befriend',
    '/r',
    '/ai-roadmaps',
  ].includes(window.location.pathname)
    ? window.location.pathname + window.location.search
    : window.location.pathname;

  localStorage.setItem(LAST_PATH_KEY, pagePath);
}

export function getLastPath() {
  if (typeof window === 'undefined') {
    return;
  }

  return localStorage.getItem(LAST_PATH_KEY) || 'home';
}

type UtmParams = Partial<{
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
  utmTerm: string;
}>;

export function getUrlUtmParams(): UtmParams {
  if (typeof window === 'undefined') {
    return {};
  }

  const utmParams = new URLSearchParams(window.location.search);
  const utmSource = utmParams.get('utm_source') ?? undefined;
  const utmMedium = utmParams.get('utm_medium') ?? undefined;
  const utmCampaign = utmParams.get('utm_campaign') ?? undefined;
  const utmContent = utmParams.get('utm_content') ?? undefined;
  const utmTerm = utmParams.get('utm_term') ?? undefined;

  if (!utmSource || !utmCampaign) {
    return {};
  }

  return {
    utmSource: utmCampaign ? utmSource.toLowerCase() : undefined,
    utmMedium: utmMedium ? utmMedium.toLowerCase() : undefined,
    utmCampaign: utmCampaign ? utmCampaign.toLowerCase() : undefined,
    utmContent: utmContent ? utmContent.toLowerCase() : undefined,
    utmTerm: utmTerm ? utmTerm.toLowerCase() : undefined,
  };
}

export function triggerUtmRegistration() {
  const utmParams = getStoredUtmParams();
  if (!utmParams.utmSource) {
    return;
  }

  localStorage.removeItem('utm_params');

  window.fireEvent({
    category: 'UserRegistration',
    action: `Registration: ${utmParams.utmSource || 'unknown'}-${utmParams.utmCampaign || 'unknown'}`,
    label: `Registration: ${utmParams.utmSource || 'unknown'}-${utmParams.utmCampaign || 'unknown'}`,
  });
}

export function getStoredUtmParams(): UtmParams {
  if (typeof window === 'undefined') {
    return {};
  }

  const utmParams = localStorage.getItem('utm_params');
  if (!utmParams) {
    return {};
  }

  return JSON.parse(utmParams);
}

export function getUrlParams() {
  if (typeof window === 'undefined') {
    return {};
  }

  const params = new URLSearchParams(window.location.search);
  const paramsObj: Record<string, any> = {};
  for (const [key, value] of params.entries()) {
    paramsObj[key] = value;
  }

  return paramsObj;
}

export function parseUrl(url: string) {
  const parser = document.createElement('a');
  parser.href = url;

  return {
    protocol: parser.protocol,
    hostname: parser.hostname,
    port: parser.port,
    pathname: parser.pathname,
    search: parser.search,
    hash: parser.hash,
    host: parser.host,
  };
}

export function deleteUrlParam(key: string) {
  if (typeof window === 'undefined') {
    return;
  }

  const url = new URL(window.location.href);
  if (!url.searchParams.has(key)) {
    return;
  }

  url.searchParams.delete(key);
  window.history.pushState(null, '', url.toString());
}

export function setUrlParams(params: Record<string, string>) {
  if (typeof window === 'undefined') {
    return;
  }

  const url = new URL(window.location.href);
  let hasUpdatedUrl = false;

  for (const [key, value] of Object.entries(params)) {
    if (url.searchParams.get(key) === String(value)) {
      continue;
    }

    url.searchParams.delete(key);
    url.searchParams.set(key, value);

    hasUpdatedUrl = true;
  }

  if (hasUpdatedUrl) {
    window.history.pushState(null, '', url.toString());
  }
}

export function getGclid(): string | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }

  const params = new URLSearchParams(window.location.search);
  const gclid = params.get('gclid');
  
  if (gclid) {
    localStorage.setItem('gclid', gclid);
    return gclid;
  }
  
  return localStorage.getItem('gclid') || undefined;
}

export function generateSessionId(): string {
  if (typeof window === 'undefined') {
    return '';
  }

  const existingSessionId = sessionStorage.getItem('session_id');
  if (existingSessionId) {
    return existingSessionId;
  }

  const sessionId = `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
  sessionStorage.setItem('session_id', sessionId);
  return sessionId;
}

export function getPageTrackingData() {
  if (typeof window === 'undefined') {
    return {};
  }

  const utmParams = getUrlUtmParams();
  const storedUtmParams = getStoredUtmParams();
  
  return {
    page_location: window.location.href,
    page_path: window.location.pathname,
    page_referrer: document.referrer || undefined,
    page_title: document.title,
    user_agent: navigator?.userAgent || '',
    screen_resolution: `${screen.width}x${screen.height}`,
    viewport_size: `${window.innerWidth}x${window.innerHeight}`,
    session_id: generateSessionId(),
    gclid: getGclid(),
    utm_source: utmParams.utmSource || storedUtmParams.utmSource,
    utm_medium: utmParams.utmMedium || storedUtmParams.utmMedium,
    utm_campaign: utmParams.utmCampaign || storedUtmParams.utmCampaign,
    utm_content: utmParams.utmContent || storedUtmParams.utmContent,
    utm_term: utmParams.utmTerm || storedUtmParams.utmTerm,
  };
}
