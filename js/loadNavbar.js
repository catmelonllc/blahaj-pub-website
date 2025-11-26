document.addEventListener('DOMContentLoaded', () => {
  fetch('/priority/navbar.html')
    .then(resp => {
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      return resp.text();
    })
    .then(html => {
      document.body.insertAdjacentHTML('afterbegin', html);
      loadClockScript();
    })
    .catch(err => console.error('❌ Error loading navbar:', err));
});

function loadClockScript() {
  const script = document.createElement('script');
  script.src = '/js/loadClock.js';
  script.defer = true;
  document.body.appendChild(script);
}