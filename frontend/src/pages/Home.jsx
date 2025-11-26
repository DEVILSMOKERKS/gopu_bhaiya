import React from 'react'
import Hero from '../components/hero/Hero'
import SaanzWeek from '../components/saanaweek/SaanzWeek'
import Who from '../components/who/Who'
import Homeblog from '../components/Homeblog/Homeblog'
import HomeFollow from '../components/homefollowus/HomeFollow'
import Collection from '../components/collections/Collection'
import BestSeller from '../components/BestSeller/BestSeller'
import Clientdiaries from '../components/clientdiaries/Clientdiaries'
import ExploreCollection from '../components/exploreCollection/ExploreCollection'
import SpotLight from '../components/SpotLight/SpotLight'
import HomeVideo from '../components/HomeVideo/HomeVideo'

const Home = () => {
  return (
    <>
      <Hero />
      <SaanzWeek />
      <ExploreCollection />
      <Who />
      <Collection />
      {/* <HomeVideo /> */}
      <BestSeller />
      <SpotLight />

      <Clientdiaries />
      <HomeFollow />
      <Homeblog />
    </>
  )
}

export default Home