import Hero from '../../components/home/Hero'
import StationsCarousel from '../../components/home/StationsCarousel'
import LatestNews from '../../components/home/LatestNews'
import TodaysSchedule from '../../components/home/TodaysSchedule'

export default function Home() {
  return (
    <main>
      <Hero />
      <StationsCarousel />
      <LatestNews />
      <TodaysSchedule />
    </main>
  )
}
