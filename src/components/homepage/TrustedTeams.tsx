import React from 'react'
import ScrollFloat from './ScrollFloat'

function TrustedTeams() {
    return (
        <section className='flex flex-col z-0 max-w-315 w-full gap-5 my-2'>
            {/* make the h2 element vertically centered between the two sections */}
            <ScrollFloat 
              containerClassName="text-2xl font-bold text-center mb-10 flex justify-center" 
              textClassName="text-2xl font-bold"
            >
              Trusted by growth-focused teams worldwide
            </ScrollFloat>
            <div className="flex items-center justify-center gap-14 flex-wrap">
                <img src="/logos/Vector.svg" alt="Stripe" className="h-6 grayscale opacity-80" />
                <img src="/logos/Group.svg" alt="Shopify" className="h-6 grayscale opacity-80" />
                <img src="/logos/Greenteam logo 1.svg" alt="Airbnb" className="h-6 grayscale opacity-80" />
                <img src="/logos/LOGO.svg" alt="Netflix" className="h-6 grayscale opacity-80" />
                <img src="/logos/Vector2.svg" alt="Spotify" className="h-6 grayscale opacity-80" />
                <img src="/logos/Sharkys 1.svg" alt="Spotify" className="h-6 grayscale opacity-80" />
                <img src="/logos/Layer_1.svg" alt="Spotify" className="h-6 grayscale opacity-80" />
                <img src="/logos/Vector3.svg" alt="Spotify" className="h-6 grayscale opacity-80" />
            </div>

        </section>
    )
}

export default TrustedTeams