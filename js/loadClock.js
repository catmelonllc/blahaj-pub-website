(() => {
    const twelveHourLocales = [
        'en-US', 'en-CA', 'en-AU', 'en-PH', 'en-MY',
        'es-US', 'es-PR', 'es-PH', 'es-MX'
    ];

    const prefers12Hour = (locale) => twelveHourLocales.some(l => locale.startsWith(l));

    const getFormatter = () => {
        const { locale, timeZone } = Intl.DateTimeFormat().resolvedOptions();

        const opts = {
            year:   'numeric',
            month:  '2-digit',
            day:    '2-digit',
            hour:   'numeric',
            minute: '2-digit',
            second: '2-digit',
            hour12: prefers12Hour(locale),
            timeZone,
            timeZoneName: 'short'
        };

        return new Intl.DateTimeFormat(locale, opts);
    };

    const formatter = getFormatter();

    const render = () => {
        const el = document.getElementById('clock');
        if (!el) return;

        const now = new Date();
        const parts = formatter.formatToParts(now);

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

    render();
    setInterval(render, 1000);
})();