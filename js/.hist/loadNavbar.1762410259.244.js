/* loadNavbar.js – fetches the navbar fragment and wires the “Don’t click” button */

/* --------------------------------------------------------------
   1️⃣ Fetch the navbar fragment (adjust the path if you move it)
   -------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  fetch('/navbar.html')                     // <-- change if your fragment lives elsewhere
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.text();
    })
    .then(html => {
      // Insert the navbar at the very top of the page
      document.body.insertAdjacentHTML('afterbegin', html);

      // ----------------------------------------------------------
      // 2️⃣ After insertion, attach the click‑handler script
      // ----------------------------------------------------------
      const script = document.createElement('script');
      script.textContent = `
        // ------- “Don’t click” button logic -------
        (function () {
          const btn = document.getElementById('dont-click-btn');
          if (!btn) return;   // safety guard

          btn.addEventListener('click', () => {
            const host = location.origin;          // e.g. https://blahaj.dedyn.io
            // You can choose ALERT or IN‑PAGE message:
            // ----------------------------------------------------
            // 1️⃣ Alert version (pop‑up):
            // alert(\`\${host} says stupid\`);

            // 2️⃣ In‑page banner version (uncomment the block below):
            // ----------------------------------------------------
            const msg = \`\${host} says stupid\`;
            let banner = document.getElementById('dont-click-banner');
            if (!banner) {
              banner = document.createElement('div');
              banner.id = 'dont-click-banner';
              banner.style.cssText = 'padding:0.5rem;background:#ffeb3b;color:#000;text-align:center;font-weight:bold;';
              document.body.prepend(banner);
            }
            banner.textContent = msg;
          });
        })();
      `;
      // Append the script so it executes immediately
      document.body.appendChild(script);
    })
    .catch(err => console.error('❌ Navbar load error:', err));
});