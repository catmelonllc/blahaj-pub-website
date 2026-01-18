document.addEventListener('DOMContentLoaded', () => {
const useCookie = false;

const cookie = {
  set(name, value, days = 365) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
  },
  get(name) {
    const match = document.cookie.match(new RegExp('(?:^|; )' + encodeURIComponent(name) + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : null;
  }
};

const storageKey = 'firstVisit';

function getStoredISO() {
  return useCookie ? cookie.get(storageKey) : localStorage.getItem(storageKey);
}
function setStoredISO(iso) {
  return useCookie ? cookie.set(storageKey, iso) : localStorage.setItem(storageKey, iso);
}

let firstVisitISO = getStoredISO();
if (!firstVisitISO) {
  firstVisitISO = new Date().toISOString();
  setStoredISO(firstVisitISO);
}

const firstVisitDate = new Date(firstVisitISO);

const { locale, timeZone } = Intl.DateTimeFormat().resolvedOptions();
const twelveHourLocales = ['en-US', 'en-CA', 'en-AU', 'en-PH', 'en-MY', 'es-US', 'es-PR', 'es-PH', 'es-MX'];
const prefers12Hour = twelveHourLocales.some(l => locale.startsWith(l));

const formatter = new Intl.DateTimeFormat(locale, {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: 'numeric',
  minute: '2-digit',
  second: '2-digit',
  hour12: prefers12Hour,
  timeZone,
  timeZoneName: 'short'
});

const parts = formatter.formatToParts(firstVisitDate);
const datePart = parts.filter(p => ['day','month','year'].includes(p.type)).map(p => p.value).join('/');
const timePart = parts.filter(p => ['hour','minute','second'].includes(p.type)).map(p => p.value).join(':');
const tzPart = parts.find(p => p.type === 'timeZoneName')?.value ?? '';

const msg = `You first visited this website on ${datePart} at ${timePart} ${tzPart}`;

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
});