/* loadNavbar.js – fetches the navbar fragment and then starts the clock */
document.addEventListener('DOMContentLoaded', () => {
  // 1️⃣ Fetch the correct navbar file
  fetch('/priority/navbar.html')
    .then(resp => {
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      return resp.text();
    })
    .then(html => {
      // 2️⃣ Insert the navbar at the very top of <body>
      document.body.insertAdjacentHTML('afterbegin', html);

      // 3️⃣ Now that the <span id="clock"> element exists,
      //    dynamically load the clock script so it can run.
      loadClockScript();
    })
    .catch(err => console.error('❌ Error loading navbar:', err));
});

/* Helper that injects the external clock script */
function loadClockScript() {
  const script = document.createElement('script');
  script.src = '/js/loadClock.js';   // path to your clock module
  script.defer = true;               // runs after the element is parsed
  document.body.appendChild(script);
}