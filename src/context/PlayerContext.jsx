import { createContext, useContext, useRef, useState } from 'react'

const PlayerContext = createContext(null)

export function PlayerProvider({ children }) {
  const [activeStation, setActiveStation] = useState(null)
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume]   = useState(0.8)
  const audioRef = useRef(null)

  const play = (item) => {
    const url = item?.stream_url || item?.audio_url
    if (!url) return
    if (activeStation?.id === item.id) { toggle(); return }
    setActiveStation(item)
    setPlaying(true)
    if (audioRef.current) {
      audioRef.current.src = url
      audioRef.current.volume = volume
      audioRef.current.play().catch(() => setPlaying(false))
    }
  }

  const toggle = () => {
    if (!audioRef.current) return
    if (playing) { audioRef.current.pause(); setPlaying(false) }
    else         { audioRef.current.play().catch(() => {}); setPlaying(true) }
  }

  const stop = () => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = '' }
    setPlaying(false); setActiveStation(null)
  }

  const changeVolume = (v) => {
    setVolume(v)
    if (audioRef.current) audioRef.current.volume = v
  }

  return (
    <PlayerContext.Provider value={{ activeStation, playing, volume, play, toggle, stop, changeVolume }}>
      <audio ref={audioRef} />
      {children}
    </PlayerContext.Provider>
  )
}

export const usePlayer = () => useContext(PlayerContext)
