import { Routes, Route } from 'react-router'
import Home from './pages/Home'
import Home2 from './pages/Home2'
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
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home-2" element={<Home2 />} />
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