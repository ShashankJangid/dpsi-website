import { useEffect } from 'react'
import { Routes, Route } from 'react-router'
import Home from './pages/Home'
import About from './pages/About'
import Academics from './pages/Academics'
import Admissions from './pages/Admissions'
import Facilities from './pages/Facilities'
import NewsEvents from './pages/NewsEvents'
import Gallery from './pages/Gallery'
import Contact from './pages/Contact'
import Admin from './pages/Admin'
import Login from './pages/Login'
import NotFound from './pages/NotFound'

export default function App() {
  useEffect(() => {
    const existingScript = document.querySelector('script[src="https://size-club-snow-weeks.trycloudflare.com/widget.js"]')
    if (!existingScript) {
      const script = document.createElement('script')
      script.src = 'https://size-club-snow-weeks.trycloudflare.com/widget.js'
      script.async = true
      document.body.appendChild(script)

      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script)
        }
      }
    }
  }, [])

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/academics" element={<Academics />} />
      <Route path="/admissions" element={<Admissions />} />
      <Route path="/facilities" element={<Facilities />} />
      <Route path="/news-events" element={<NewsEvents />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}