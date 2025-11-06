/* firstVisit.js – show “You first visited this website on … at …” */

/* -------------------------------------------------------------
   CONFIGURATION
   ------------------------------------------------------------- */
// Set to true only if you *must* use a cookie instead of localStorage.
const useCookie = false;

/* -------------------------------------------------------------
   COOKIE HELPERS (used only when useCookie === true)
   ------------------------------------------------------------- */
const cookie = {
  set(name, value, days = 365) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
  },
  get(name) {
    const match = document.cookie.match(
      new RegExp('(?:^|; )' + encodeURIComponent(name) + '=([^;]*)')
    );
    return match ? decodeURIComponent(match[1]) : null;
  }
};

/* -------------------------------------------------------------
   STORAGE HELPERS (localStorage or cookie)
   ------------------------------------------------------------- */
const storageKey = 'firstVisit';

function getStoredISO() {
  return useCookie ? cookie.get(storageKey) : localStorage.getItem(storageKey);
}
function setStoredISO(iso) {
  return useCookie ? cookie.set(storageKey, iso) : localStorage.setItem(storageKey, iso);
}

/* -------------------------------------------------------------
   MAIN LOGIC
   ------------------------------------------------------------- */
(() => {
  // 1️⃣ Retrieve the stored value (if any)
  let firstVisitISO = getStoredISO();

  // 2️⃣ If nothing is stored yet → this is the first visit → store now
  if (!firstVisitISO) {
    firstVisitISO = new Date().toISOString(); // precise date + time in UTC
    setStoredISO(firstVisitISO);
  }

  // 3️⃣ Parse the ISO string back to a Date object
  const firstVisitDate = new Date(firstVisitISO);

  // 4️⃣ Build a locale‑aware formatter that respects 12/24‑hour prefs
  //    We reuse the same logic you have in loadClock.js.
  const { locale, timeZone } = Intl.DateTimeFormat().resolvedOptions();

  // Detect typical 12‑hour locales (you can extend this list)
  const twelveHourLocales = [
    'en-US', 'en-CA', 'en-AU', 'en-PH', 'en-MY',
    'es-US', 'es-PR', 'es-PH', 'es-MX'
  ];
  const prefers12Hour = twelveHourLocales.some(l => locale.startsWith(l));

  const formatter = new Intl.DateTimeFormat(locale, {
    year:   'numeric',
    month:  '2-digit',
    day:    '2-digit',
    hour:   'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: prefers12Hour,   // true → 12 h, false → 24 h
    timeZone,
    timeZoneName: 'short'    // e.g. PST, CDT, GMT‑6
  });

  // 5️⃣ Split the formatted string into date‑part and time‑part
  //    (Intl may insert commas or other separators depending on locale,
  //    so we extract the pieces manually.)
  const parts = formatter.formatToParts(firstVisitDate);
  const datePart = parts
    .filter(p => ['day','month','year'].includes(p.type))
    .map(p => p.value)
    .join('/');
  const timePart = parts
    .filter(p => ['hour','minute','second'].includes(p.type))
    .map(p => p.value)
    .join(':');
  const tzPart = parts.find(p => p.type === 'timeZoneName')?.value ?? '';

  // 6️⃣ Build the final message
  const msg = `You first visited this website on ${datePart} at ${timePart} ${tzPart}`;

  // 7️⃣ Insert the message into the page
  //    • If you already have <span id="first-visit-msg"> in the markup,
  //      we just fill it.
  //    • Otherwise we create a span right after the <h1 id="welcome-heading">.
  const placeholder = document.getElementById('first-visit-msg');
  if (placeholder) {
    placeholder.textContent = msg;
  } else {
    const heading = document.getElementById('welcome-heading');
    if (heading) {
      const span = document.createElement('span');
      span.id = 'first-visit-msg';
      span.className = 'first-visit';
      span.textContent = msg;
      span.style.marginLeft = '0.5rem';
      heading.parentNode.insertBefore(span, heading.nextSibling);
    }
  }
})();