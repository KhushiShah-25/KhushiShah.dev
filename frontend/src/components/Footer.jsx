
const LINKS = [
  { label:'Home',       href:'#home' },
  { label:'Gallery',    href:'#gallery' },
  { label:'Skills',     href:'#services' },
  { label:'Projects',   href:'#projects' },
  { label:'Blog',       href:'#blog' },
  { label:'Contact',    href:'#contact' },
]

export default function Footer() {
  const scrollTo = (href, e) => {
    e.preventDefault()
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className={"Footer-footer"}>
      <div className={"Footer-copy"}>
        © 2025 <span>Khushi Shah</span> · Bennett University · Greater Noida
      </div>
      <nav className={"Footer-links"}>
        {LINKS.map(l => (
          <a key={l.href} href={l.href} onClick={e => scrollTo(l.href, e)}>{l.label}</a>
        ))}
      </nav>
    </footer>
  )
}
