/*  loadClock.js – tiny live date‑time widget
 *
 *  How it works
 *  • Reads the browser’s resolved locale and time‑zone.
 *  • Picks a 12‑hour or 24‑hour format based on the locale.
 *  • Formats the date according to the locale’s day/month order.
 *  • Updates the output once per second.
 *
 *  Usage
 *  1️⃣ Add a placeholder where you want the clock, e.g.
 *        <div id="clock" class="tiny-clock"></div>
 *     (place it inside your navbar markup)
 *
 *  2️⃣ Include the script after the placeholder:
 *        <script src="/js/loadClock.js"></script>
 *
 *  3️⃣ (Optional) Add a few light CSS rules for spacing.
 */

(() => {
    // --------------------------------------------------------------
    // Decide whether the locale normally uses a 12‑hour clock.
    // --------------------------------------------------------------
    const twelveHourLocales = [
        // Common English locales that use 12 h
        'en-US', 'en-CA', 'en-AU', 'en-PH', 'en-MY',
        // Spanish locales that often use 12 h (Mexico, Puerto Rico, etc.)
        'es-US', 'es-PR', 'es-PH', 'es-MX'
    ];

    const prefers12Hour = (locale) =>
        twelveHourLocales.some(l => locale.startsWith(l));

    // --------------------------------------------------------------
    // Build the Intl options for the detected locale / time‑zone.
    // --------------------------------------------------------------
    const getFormatter = () => {
        const { locale, timeZone } =
            Intl.DateTimeFormat().resolvedOptions();

        const opts = {
            year:   'numeric',
            month:  '2-digit',
            day:    '2-digit',
            hour:   'numeric',
            minute: '2-digit',
            second: '2-digit',
            hour12: prefers12Hour(locale),   // true → 12 h, false → 24 h
            timeZone,
            timeZoneName: 'short'           // e.g. “PST”, “CDT”, “GMT‑6”
        };

        return new Intl.DateTimeFormat(locale, opts);
    };

    const formatter = getFormatter();

    // --------------------------------------------------------------
    // Render the widget.
    // --------------------------------------------------------------
    const render = () => {
        const el = document.getElementById('clock');
        if (!el) return;                     // No placeholder → nothing to do

        const now = new Date();
        const parts = formatter.formatToParts(now);

        // Assemble a compact string:  DD/MM/YYYY HH:MM:SS TZ
        const datePart = parts
            .filter(p => ['day','month','year'].includes(p.type))
            .map(p => p.value)
            .join('/');

        const timePart = parts
            .filter(p => ['hour','minute','second'].includes(p.type))
            .map(p => p.value)
            .join(':');

        const tzPart = parts.find(p => p.type === 'timeZoneName')?.value ?? '';

        el.textContent = `${datePart} ${timePart} ${tzPart}`;
    };

    // --------------------------------------------------------------
    // Initialise – draw once now, then refresh each second.
    // --------------------------------------------------------------
    render();                // immediate first paint
    setInterval(render, 1000);
})();