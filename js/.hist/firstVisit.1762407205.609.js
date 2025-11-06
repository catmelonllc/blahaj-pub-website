/* firstVisit.js – show “You first visited this site on …” */

(() => {
  // ------------------------------------------------------------
  // Configuration – set to true if you *must* use a cookie instead
  // ------------------------------------------------------------
  const useCookie = false;   // ← change to true if you need a cookie

  // ------------------------------------------------------------
  // Helpers for cookie handling (only used when useCookie === true)
  // ------------------------------------------------------------
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

  // ------------------------------------------------------------
  // Get / set the first‑visit timestamp
  // ------------------------------------------------------------
  const storageKey = 'firstVisit';

  const getStoredDate = () => {
    if (useCookie) return cookie.get(storageKey);
    return localStorage.getItem(storageKey);
  };

  const setStoredDate = (isoStr) => {
    if (useCookie) cookie.set(storageKey, isoStr);
    else localStorage.setItem(storageKey, isoStr);
  };

  // ------------------------------------------------------------
  // Main logic
  // ------------------------------------------------------------
  let firstVisitISO = getStoredDate();

  // If nothing stored yet → this is the first visit
  if (!firstVisitISO) {
    firstVisitISO = new Date().toISOString(); // store in ISO for consistency
    setStoredDate(firstVisitISO);
  }

  // Convert ISO → a human‑readable date string that respects the user’s locale
  const firstVisitDate = new Date(firstVisitISO);
  const formatted = firstVisitDate.toLocaleDateString(undefined, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });

  // ------------------------------------------------------------
  // Insert the message into the page
  // ------------------------------------------------------------
  const msgText = `You first visited this website on ${formatted}`;

  // Try to use the placeholder we reserved (if it exists)
  const placeholder = document.getElementById('first-visit-msg');

  if (placeholder) {
    placeholder.textContent = msgText;
  } else {
    // Fallback: create a span and insert it after the <h1 id="welcome-heading">
    const heading = document.getElementById('welcome-heading');
    if (heading) {
      const span = document.createElement('span');
      span.id = 'first-visit-msg';
      span.className = 'first-visit';
      span.textContent = msgText;
      // Add a tiny left margin so it doesn’t jam against the heading
      span.style.marginLeft = '0.5rem';
      heading.parentNode.insertBefore(span, heading.nextSibling);
    }
  }
})();