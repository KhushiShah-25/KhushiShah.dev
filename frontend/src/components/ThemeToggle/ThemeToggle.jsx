
export default function ThemeToggle({ theme, toggle }) {
  return (
    <button
      className={"ThemeToggle-btn"}
      onClick={toggle}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  )
}
