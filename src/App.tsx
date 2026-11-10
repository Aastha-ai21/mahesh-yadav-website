import { SoundProvider } from './audio/SoundContext'
import { Nav } from './components/Nav'
import { EnterScreen } from './components/EnterScreen'
import { Hero } from './components/Hero'
import { GitaVerse } from './components/GitaVerse'
import { About } from './components/About'
import { Wisdom } from './components/Wisdom'
import { Reflections } from './components/Reflections'
import { Chant } from './components/Chant'
import { Book } from './components/Book'
import { Connect } from './components/Connect'
import { Footer } from './components/Footer'

export default function App() {
  return (
    <SoundProvider>
      <EnterScreen />
      <Nav />
      <main>
        <Hero />
        <GitaVerse />
        <About />
        <Wisdom />
        <Reflections />
        <Chant />
        <Book />
        <Connect />
      </main>
      <Footer />
    </SoundProvider>
  )
}
