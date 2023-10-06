import * as elements from "typed-html"

export const Navigation = () => {
    return (
        <div class="h-50 bg-white text-center text-4xl py-2 shadow-sm">
            <nav>
                <a class="p-10 hover:bg-zinc-300 hover:text-zinc-700" href="#about">About</a>
                <a class="p-10 hover:bg-zinc-300 hover:text-zinc-700" href="#expierence">Expierence</a>
                <a class="p-10 hover:bg-zinc-300 hover:text-zinc-700" href="#chat">AI Chat</a>
                <a class="p-10 hover:bg-zinc-300 hover:text-zinc-700" href="#music">Music</a>
            </nav>
        </div>
    )
}

export const About = () => {
    return (
        <div class="h-fit bg-zinc-200 shadow-sm grid place-items-center" id="about">
            <h1 class="text-5xl text-center py-5">Hi, I'm Aaron</h1>
            <div class="grid grid-cols-2 justify-center place-items-center max-w-6xl grid-flow-col">
                <img src="/public/donkey.jpg" alt="Aaron and a donkey" class="object-cover h-72 w-72 p-5"></img>
                <p class="px-5">
                    Hey! Welcome to my website! My name is Aaron Gould and I am a developer from Minneapolis, MN. 
                    I have been working as a Software Engineer for the last two years since graduating college with a degree in Computer Science and Applied Mathematics. 
                    I have professional experience writing back end code creating APIs and interacting with large scale data. 
                    I also have experience creating and deploying websites and mobile applications.
                    Currently unemployed, I am looking for work as a Software Engineer or Scientist. Please hire me!
                </p>
            </div>
        </div>
    )
}

export const Expierence = () => {
    return (
        <div class="h-auto bg-zinc-400 shadow-sm grid place-items-center" id="expierence">
            <h1 class="text-5xl text-center py-5">My Expierence</h1>

            <div class="grid grid-cols-1 max-w-6xl"><h1 class="text-4xl text-center drop-shadow-xl font-light">National Park Service</h1></div>
            <div class="grid grid-cols-2 justify-center place-items-center max-w-6xl">
                <img src="/public/nps.jpg" alt="Aaron and Talon at the Toklat" class="object-cover h-72 w-72 p-5 justify-right"></img>
                <p class="px-5">
                    Summer of 2023 I worked at Denali National Park for the National Park Service as a Software Engineer, Data Manager and Acoustic Technician.
                    My main project was creating a mobile app for Park Rangers to upload bear interactions into a database.
                    I also maintained multiple databases including the flight tracking database.
                    I installed acoustic monitoring stations around the park and used Machine Learning and Signal Processing techniques to analyze the data.
                    It was the best Summer ever!!!
                </p>
            </div>

            <div class="grid grid-cols-1 max-w-6xl"><h1 class="text-4xl text-center drop-shadow-xl font-light">Surescripts</h1></div>
            <div class="grid grid-cols-2 justify-center place-items-center max-w-6xl">
                <img src="https://surescripts.com/themes/surescripts/templates/assets/images/surescripts-logo-opengraph.jpg" alt="Surescripts logo" class="object-cover h-72 w-72 p-5 justify-right"></img>
                <p class="px-5">
                    I interned at Surescripts as a Software Engineer in the Summer of 2021 and returned full time from Feburary 2022 till April 2023.
                    It was my first professional expierence developing software and I learned a lot about writing APIs, internal dashboards and working with large scale data.
                    I was on the anomaly detection team where we analyzed all of the medical prescriptions running through our network and developed anomaly detection algorithms
                    and created datastreams to send those to investigators.
                </p>
            </div>

            <div class="grid grid-cols-1 max-w-6xl"><h1 class="text-4xl text-center drop-shadow-xl font-light">Macalester College</h1></div>
            <div class="grid grid-cols-2 justify-center place-items-center max-w-6xl">
                <img src="/public/fig8.png" alt="Aerial coverage algorithm" class="object-cover h-72 w-72 p-5 justify-right"></img>
                <p class="px-5">
                    In the Summer of 2020 I researched Machine Learning and Reinforcement Learning techniques to determine efficient ways for unmanned aerial vehicles
                    to cover spaces. The work was meant to help farmers, forest rangers and anyone who wanted to view spacial areas. We got to fly drones and it was super fun!
                </p>
            </div>

        </div>
    )
}

export const Music = () => {
    return (
        <div class="h-fit bg-zinc-400 shadow-sm grid place-items-center" id="music">
            <h1 class="text-5xl text-center py-5">My Music</h1>
            <h1 class="text-1xl text-center py-5">Check out these songs I've made. I also play viola!</h1>
            <iframe class="px-96"style="display:block;" width="100%" height="450" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1698485913&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"></iframe><div style="font-size: 10px; color: #cccccc;line-break: anywhere;word-break: normal;overflow: hidden;white-space: nowrap;text-overflow: ellipsis; font-family: Interstate,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Garuda,Verdana,Tahoma,sans-serif;font-weight: 100;"><a href="https://soundcloud.com/aaron-gould-7" title="Aaron Gould" target="_blank" style="color: #cccccc; text-decoration: none;">Aaron Gould</a> · <a href="https://soundcloud.com/aaron-gould-7/sets/all-tracks" title="all tracks" target="_blank" style="color: #cccccc; text-decoration: none;">all tracks</a></div>
        </div>
    )
}