/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'background': 'var(--color-background)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'border-subtle': 'var(--color-border-subtle)',
        'hover-bg': 'var(--color-hover-bg)',
      },
      fontFamily: {
        'serif': ['"Crimson Text"', 'Lora', 'Georgia', '"Times New Roman"', 'serif'],
        'mono': ['"Courier Prime"', '"Courier New"', 'monospace'],
      },
      fontSize: {
        'xs': '14px',
        'sm': '15px',
        'base': '18px',
        'lg': '20px',
        'xl': '24px',
      },
      spacing: {
        '6': '6px',
        '12': '12px',
        '16': '16px',
        '18': '18px',
        '24': '24px',
        '32': '32px',
        '48': '48px',
        '64': '64px',
      },
      lineHeight: {
        'book': '1.3',
      },
    },
  },
  plugins: [],
}
