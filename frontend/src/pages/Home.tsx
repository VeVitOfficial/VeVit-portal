import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../store/authStore'
import Hero from '../components/Hero'
import StatsRow from '../components/StatsRow'
import BentoGrid from '../components/BentoGrid'
import ActivityFeed from '../components/ActivityFeed'
import Features from '../components/Features'
import PremiumUpsell from '../components/PremiumUpsell'
import ChangelogTeaser from '../components/ChangelogTeaser'
import ContactNewsletter from '../components/ContactNewsletter'

export default function Home() {
  const { isLoggedIn, user } = useAuthStore()

  return (
    <div>
      <Hero isLoggedIn={isLoggedIn} user={user} />
      <StatsRow />
      <BentoGrid />
      <ActivityFeed />
      <Features />
      <PremiumUpsell />
      <ChangelogTeaser />
      <ContactNewsletter />
    </div>
  )
}