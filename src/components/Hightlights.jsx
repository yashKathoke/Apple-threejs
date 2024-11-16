import React from 'react'
import { rightImg, watchImg } from '../utils'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import {ScrollTrigger} from 'gsap/all'
import VideoCarousel from './VideoCarousel'

const Hightlights = () => {
    
    gsap.registerPlugin(ScrollTrigger) 
    useGSAP(()=>{
        gsap.to('#title',{
            scrollTrigger: '#title',
            opacity:1,
            y: 0,
            
        })

        gsap.to('.link', {scrollTrigger: '#highlights',opacity:1, y:0, duration:2, stagger:0.25})
    },[])
  return (
    <section id='highlights' className='w-screen overflow-hidden h-full common-padding bg-zinc'>
        <div  className='screen-max-width'>
            <div className='mb-12 w-full md:flex items-end justify-between'>
                <h1 id='title' className='section-heading'>Get the Highlights</h1>

                <div className='flex gap-5 flex-wrap items-end'>
                    <p className='link'>Watch the film 
                        <img src={watchImg} alt="watch" className='ml-2' />
                    </p>
                    <p className='link'> 
                        Watch the Events 
                        <img src={rightImg} alt="right" className='ml-2' />

                    </p>
                </div>
            </div>

            <VideoCarousel />
        </div>
    </section>
  )
}

export default Hightlights