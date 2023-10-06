import Elysia, { t } from "elysia";
import { html } from "@elysiajs/html";
import { staticPlugin } from '@elysiajs/static'
import * as elements from "typed-html"
import {Navigation, About, Expierence, Music} from "./static.tsx"

const app = new Elysia()
    .use(html())
    .use(staticPlugin())
    .get("/", ({ html, cookie: {cookie}}) => {
        return html(
            <BaseHtml>
                <div class="flex h-screen flex-col">
                    <Navigation />
                    <About />
                    <Expierence />
                    <AaronIntelligence messages={cookie.value.messages} />
                    <Music />
                </div>
            </BaseHtml>
        )
    })
    .put('/message', async ({ body, cookie: {cookie} }) =>  {
        await delay(3000)
        cookie.httpOnly = true
        if (!cookie.value) {
            console.log("set cookies")
            cookie.value = {
                messages: ['Hey, welcome to my Website! Do you have any questions for me?']
            }
        } else {
            console.log("cookies are set already")
        }
        cookie.value.messages.push(body.message) 
        cookie.set({})
        return <Chatbox messages={cookie.value.messages}/>
    }, 
    {
        body: t.Object({message: t.String()}), // define html body response type
        // cookie: t.Cookie({ // this doesn't work
        //     value: t.Object({
        //         messages: t.Array(t.String())
        //     })
        // })
    }
    )
    .listen(3000);

console.log(`Elysia is running on ${app.server?.hostname}:${app.server?.port} `)

// for dev purposes
function delay(ms: number) {
    console.log("sleeping")
    return new Promise( resolve => setTimeout(resolve, ms) );
}

const Chatbox = ({messages}: {messages: string[]}) => {
    return (
        <div class="h-fit bg-zinc-200 shadow-sm grid place-items-center max-w-4xl w-8/12" id="chatbox">
            <div class="grid grid-cols-2 bg-zinc-300 max-w-4xl h-5 w-8/12 overflow-auto mt-5 rounded-t" id="chatbox-header"></div>
            <div class="bg-zinc-300 place-items-center max-w-4xl h-64 w-8/12 overflow-auto" id="chats">
                <ul>
                    {messages.map(function(message, i){
                        return <Message message={message} index={i} />;
                    })}
                </ul>
            </div>
            <div class=" bg-zinc-300 max-w-4xl h-fit w-8/12 overflow-auto mb-5 rounded-b" id="chatbox-bottom">
                <form class="grid grid-cols-2 bg-zinc-300  overflow-auto mb-5 rounded-b" hx-put="/message" hx-target="#chatbox" hx-swap="outerHTML">
                    <input class="m-2 bg-zinc-4d00 rounded h-8 p-2" name="message" placeholder="Send a message"></input>
                    <button class="m-2 bg-zinc-400 rounded h-8 mr-48 font-semibold">send</button>
                </form>
            </div>
        </div>
    )
}

const AaronIntelligence = ({messages}: {messages: string[]}) => {
    return (
        <div class="h-fit bg-zinc-200 shadow-sm grid place-items-center" id="chat">
            <h1 class="text-5xl text-center py-5">Talk to me!</h1>
            <h1 class="text-2xl text-center py-5">Years of advanced research have gone into creating this state of the art AI* chat.</h1>

            <Chatbox messages={messages} />
        </div>
    )
}

const Message = ({message, index}: {message: string; index: number}) => {
    if (index % 2) {
        return (
            <div class="m-2 bg-slate-200 rounded mr-48">
                <p class="mx-2">{message} {index}</p>
            </div>
        )
    } else {
        return (
            <div class="m-2 bg-gray-200 rounded ml-48">
                <p class="mx-2">{message} {index}</p>
            </div>
        )
    }
}

const BaseHtml = ({children}: elements.Children) => `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Aaron Gould</title>
    <script src="https://unpkg.com/htmx.org@1.9.6"></script>
    <script src="https://cdn.tailwindcss.com"></script>
</head>

${children}

`;
