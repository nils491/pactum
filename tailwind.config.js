/** TACTUS Tailwind-Konfiguration (ersetzt das CDN-Tailwind im Browser) */
module.exports = {
  content: ['./*.html', './js/**/*.js', './data/**/*.js'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        obsidian: '#000000',
        graphite: '#090d14',
        graphiteLight: '#101622',
        slateBorder: '#1e2638',
        slateBorderLight: '#2a364f',
        titan: '#475569',
        champagne: '#c5a880',
        champagneLight: '#dfcaa9',
        feingold: '#d4af37',
        copperGlow: '#c2410c',
        amberBronze: '#b45309',
        bordeaux: '#991b1b',
        bordeauxDark: '#450a0a',
        malachite: '#142b24',
        malachiteLight: '#2e5746',
        cognac: '#8a5232',
        cognacLight: '#b3734a',
        cognacDark: '#4a2818',
        rackGreen: '#15803d',
        rackGreenLight: '#22c55e',
        rackYellow: '#ca8a04',
        rackYellowLight: '#eab308',
        rackRed: '#dc2626',
        rackRedLight: '#ef4444',
        platinum: '#f8fafc',
        silverMuted: '#94a3b8'
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      }
    }
  }
};
