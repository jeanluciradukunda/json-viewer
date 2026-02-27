import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{ts,tsx,html}'],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#F4F3EE',
        'bg-secondary': '#FAF8F4',
        'bg-input': '#FFFFFF',
        surface: '#EDE8DC',
        terra: '#C15F3C',
        'terra-dark': '#A8502F',
        'terra-light': '#F0D6C8',
        'text-primary': '#2D2B28',
        'text-secondary': '#6B6560',
        'text-muted': '#9C958C',
        border: '#DDD8CE',
        'border-subtle': '#EDE8DC',
        'diff-added-bg': '#E6F4E2',
        'diff-added-text': '#2D6A2E',
        'diff-removed-bg': '#FDECEA',
        'diff-removed-text': '#A8302A',
        'diff-modified-bg': '#FFF3CD',
        'diff-modified-text': '#856404',
        'syn-key': '#2D2B28',
        'syn-string': '#B35C3A',
        'syn-number': '#7B6524',
        'syn-boolean': '#6B5B95',
        'syn-null': '#9C958C',
        'syn-bracket': '#8B8078',
        'syn-punctuation': '#B1ADA1',
      },
      fontFamily: {
        serif: ['Georgia', "'Times New Roman'", 'ui-serif', 'serif'],
        mono: ["'JetBrains Mono'", "'Fira Code'", "'SF Mono'", 'monospace'],
      },
      fontSize: {
        xs: '11px',
        sm: '12px',
        base: '13px',
        md: '14px',
        lg: '16px',
      },
      borderRadius: {
        btn: '6px',
        card: '8px',
        panel: '12px',
      },
      boxShadow: {
        sm: '0 1px 2px rgba(45,43,40,0.06)',
        md: '0 2px 8px rgba(45,43,40,0.08)',
        focus: '0 0 0 3px rgba(193,95,60,0.2)',
      },
    },
  },
  plugins: [],
} satisfies Config;
