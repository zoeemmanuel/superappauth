module.exports = {
  content: [
    './app/views/**/*.{erb,haml,html,slim}',
    './app/helpers/**/*.rb',
    './app/javascript/**/*.{js,jsx}',
    './app/components/**/*.{js,jsx}',
    './app/assets/stylesheets/**/*.css',
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          900: '#111827',
          800: '#1F2937',
          700: '#374151',
          600: '#4B5563',
          500: '#6B7280',
          400: '#9CA3AF',
          300: '#D1D5DB',
          200: '#E5E7EB',
          100: '#F3F4F6',
          50: '#F9FAFB',
        },
        teal: {
          600: '#0D9488',
          500: '#14B8A6',
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
