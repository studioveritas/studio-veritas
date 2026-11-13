// Day / night by the sun. This script runs inline in <head> (app/layout.tsx) before first paint, so the
// page never flashes the wrong mode. Kept as a string so it ships inside the HTML, with no extra request.
export const SV_SUN_SCRIPT = String.raw`/* Studio Veritas: day / night by the sun. Runs inline in <head> before first paint.
   - window.svSun.city()          → { code, lat, lon, tz } for the visitor's time zone
   - window.svSun.ams             → the studio: { code: 'AMS', lat, lon, tz }
   - window.svSun.isNight(d, c)   → true between sunset and sunrise at city c (default: visitor)
   The page starts in night mode after sunset, unless the visitor chose a mode this
   visit (sessionStorage 'sv-theme'). */
(function () {
  var CITIES = {
    'Europe/Amsterdam': ['AMS', 52.37, 4.90], 'Europe/London': ['LON', 51.51, -0.13],
    'Europe/Paris': ['PAR', 48.86, 2.35], 'Europe/Berlin': ['BER', 52.52, 13.40],
    'Europe/Brussels': ['BRU', 50.85, 4.35], 'Europe/Madrid': ['MAD', 40.42, -3.70],
    'Europe/Lisbon': ['LIS', 38.72, -9.14], 'Europe/Rome': ['ROM', 41.90, 12.50],
    'Europe/Zurich': ['ZRH', 47.38, 8.54], 'Europe/Copenhagen': ['CPH', 55.68, 12.57],
    'Europe/Stockholm': ['STO', 59.33, 18.07], 'Europe/Oslo': ['OSL', 59.91, 10.75],
    'Europe/Dublin': ['DUB', 53.35, -6.26], 'Europe/Vienna': ['VIE', 48.21, 16.37],
    'Europe/Luxembourg': ['LUX', 49.61, 6.13], 'Europe/Warsaw': ['WAW', 52.23, 21.01],
    'Africa/Johannesburg': ['JNB', -26.20, 28.05], 'Asia/Dubai': ['DXB', 25.20, 55.27],
    'Asia/Singapore': ['SIN', 1.35, 103.82], 'Asia/Tokyo': ['TYO', 35.68, 139.69],
    'Asia/Hong_Kong': ['HKG', 22.32, 114.17], 'Asia/Shanghai': ['SHA', 31.23, 121.47],
    'Australia/Sydney': ['SYD', -33.87, 151.21], 'America/New_York': ['NYC', 40.71, -74.01],
    'America/Chicago': ['CHI', 41.88, -87.63], 'America/Los_Angeles': ['LAX', 34.05, -118.24],
    'America/Toronto': ['TOR', 43.65, -79.38], 'America/Sao_Paulo': ['SAO', -23.55, -46.63],
    'America/Mexico_City': ['MEX', 19.43, -99.13]
  };
  var tz = 'Europe/Amsterdam';
  try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || tz; } catch (e) {}
  var hit = CITIES[tz];
  var city = hit ? { code: hit[0], lat: hit[1], lon: hit[2], tz: tz }
    : { code: (tz.split('/').pop() || '').replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase(), lat: null, lon: null, tz: tz };
  var AMS = { code: 'AMS', lat: 52.37, lon: 4.90, tz: 'Europe/Amsterdam' };
  var R = Math.PI / 180;
  // Sunrise equation (accurate to a couple of minutes, plenty for a mode switch).
  // Sunrise and sunset of solar day n (days since 1 Jan 2000) at city.
  function sun(n, city) {
    var Js = n - city.lon / 360;
    var M = (357.5291 + 0.98560028 * Js) % 360;
    var C = 1.9148 * Math.sin(M * R) + 0.02 * Math.sin(2 * M * R) + 0.0003 * Math.sin(3 * M * R);
    var L = (M + C + 180 + 102.9372) % 360;
    var Jt = 2451545.0 + Js + 0.0053 * Math.sin(M * R) - 0.0069 * Math.sin(2 * L * R);
    var dec = Math.asin(Math.sin(L * R) * Math.sin(23.4397 * R));
    var c = (Math.sin(-0.833 * R) - Math.sin(city.lat * R) * Math.sin(dec)) / (Math.cos(city.lat * R) * Math.cos(dec));
    if (c > 1) return { polar: 'night' };
    if (c < -1) return { polar: 'day' };
    var w = Math.acos(c) / R / 360;
    var toMs = function (j) { return (j - 2440587.5) * 864e5; };
    return { rise: toMs(Jt - w), set: toMs(Jt + w) };
  }
  function isNight(d, c) {
    d = d || new Date(); c = c || city;
    if (c.lat == null) { var h = d.getHours(); return h < 7 || h >= 19; }
    // Daylight windows of the solar days around now: day if inside any of them.
    var t = d.getTime(), n0 = Math.round(t / 864e5 + 2440587.5 - 2451545.0), polar = null;
    for (var k = -1; k <= 1; k++) {
      var s = sun(n0 + k, c);
      if (s.polar) { polar = s.polar; continue; }
      if (t >= s.rise && t < s.set) return false;
    }
    return polar ? polar === 'night' : true;
  }
  window.svSun = { city: function () { return city; }, ams: AMS, isNight: isNight };
  var night;
  try {
    var chosen = sessionStorage.getItem('sv-theme');
    night = chosen ? chosen === 'night' : isNight();
  } catch (e) { night = isNight(); }
  if (night) document.documentElement.classList.add('sv-night');
})();
`
