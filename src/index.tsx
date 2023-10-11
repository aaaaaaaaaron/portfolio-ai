import Elysia, { t } from "elysia";
import { html } from "@elysiajs/html";
import { staticPlugin } from '@elysiajs/static'
import * as elements from "typed-html"
import {Navigation, About, Expierence, Music, WebsiteInfo} from "./static.tsx"
import OpenAI from "openai";
import { prompt } from "./prompt.ts";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions.mjs";

const cannedMessage = 'Hey, welcome to my Website! Do you have any questions for me?'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const app = new Elysia()
    .use(html())
    .use(staticPlugin())
    .get("/", ({ html, cookie: {cookie}}) => {
        cookie.httpOnly = true
        if (!cookie.value) {
            cookie.value = {
                messages: [cannedMessage]
            }
        }
        return html(
            <BaseHtml>
                <div class="flex h-screen flex-col">
                    <Navigation />
                    <About />
                    <Expierence />
                    <AaronIntelligence messages={cookie.value.messages} />
                    <Music />
                    <WebsiteInfo />
                </div>
            </BaseHtml>
        )
    })
    .put('/reset', ({cookie: {cookie}}) => {
        cookie.httpOnly = true
        cookie.value.messages = [cannedMessage]
        cookie.set({})
        return <Chatbox messages={cookie.value.messages}/>
    })
    .put('/message', async ({ body, cookie: {cookie} }) =>  {
        cookie.httpOnly = true
        if (!cookie.value) {
            cookie.value = {
                messages: [cannedMessage]
            }
        }
        cookie.value.messages.push(body.message)
        const response = await respond(cookie.value.messages)
        cookie.value.messages.push(response)
        cookie.set({})
        return <Messages messages={[body.message, response]}/>
    }, 
    {
        body: t.Object({message: t.String()}) // define html body response type
    }
    )
    .listen(3000);

console.log(`Elysia is running on ${app.server?.hostname}:${app.server?.port} `)

// for dev purposes
function delay(ms: number) {
    console.log("sleeping")
    return new Promise( resolve => setTimeout(resolve, ms) );
}

const respond2 = async (messages: string[]) => {
    const cannedResponses = ["Great point!", "Coolio!", "Facts"]
    await delay(500)
    return cannedResponses[Math.floor(Math.random() * cannedResponses.length)]
}

const respond = async (messages: string[]) => {
    const messagesFormatted = createMessageObject(messages)
    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: messagesFormatted,
    });
    console.log(response)
    if (response.choices[0].message.content == null) {return "null"} else {return response.choices[0].message.content}
}

const createMessageObject = (messages: string[]) => {
    let messagesFormatted: ChatCompletionMessageParam[] = [{"role": "system", "content": prompt}]
    messages.forEach((message, i) => {
        let role: 'system' | 'user' | 'assistant' | 'function' = i % 2 ? "user": "assistant"
        messagesFormatted.push({"role": role, "content": message})
    })
    console.log(messagesFormatted)
    return messagesFormatted
}

const Messages = ({messages}: {messages: string[]}) => {
    return (
        <div>
            {messages.map(function(message, i){
                return <Message message={message} index={i+1} />;
            })}
        </div>
    )
}
const Chatbox = ({messages}: {messages: string[]}) => {
    return (
        <div class="h-fit bg-zinc-300 shadow-sm grid place-items-center rounded mx-2" id="chatbox">
            <div class="bg-zinc-300 place-items-center max-w-4xl h-96 overflow-auto mx-2 rounded-t" id="chats" style="overflow-anchor: auto">
                <button class="sticky top-[1vh] ml-2 bg-zinc-400 rounded font-semibold px-1" hx-put="/reset" hx-target="#chatbox" hx-swap="outerHTML" data-loading-disable>
                    Reset
                </button>
                <ul id="messagesList">
                    {messages.map(function(message, i){
                        return <Message message={message} index={i} />;
                    })}
                </ul>
            </div>

            <div class="h-fit overflow-auto rounded-b mx-2" id="chatbox-bottom">
                <form class="grid grid-cols-2 overflow-auto mt-2 mb-1 rounded-b" hx-put="/message" hx-target="#messagesList" hx-swap="beforeend" hx-reset-on-success>
                    <input class="mx-2 rounded h-8 p-2" name="message" placeholder="Send a message" id="messagebox" data-loading-disable></input>
                    <button class="mx-2 bg-zinc-400 rounded h-8 font-semibold" type="submit" data-loading-disable>send</button>
                </form>
            </div>
        </div>
    )
}

const AaronIntelligence = ({messages}: {messages: string[]}) => {
    return (
        <div class="h-fit bg-zinc-200 shadow-sm grid place-items-center" id="chat">
            <h1 class="text-5xl text-center py-5">Talk to me!</h1>
            <h1 class="text-2xl pt-3 text-center">
                Talk to my AI* persona. Ask it facts about me or just have a conversation!
            </h1>
            <p class="pb-4 text-xs">*Aaron Intelligence</p>

            <Chatbox messages={messages} />

            <p class="text-sm mt-2 text-center">Disclaimer! This AI may make up false statements about me.</p>
            <p class="text-sm text-center">It's statements and opinions may not be an actual representation of mine.</p>

            <p class="my-5 mx-2 text-center">
                If you would like to talk to me for real, find my contact information on my 
                <a class="underline text-blue-600 hover:text-blue-800 visited:text-purple-600" href="/public/resume.pdf" target="_blank">resume</a> 
                or message me on 
                <a class="underline text-blue-600 hover:text-blue-800 visited:text-purple-600" href="https://www.linkedin.com/in/aaron-gould-287036188/" target="_blank">LinkedIn</a>.
            </p>
        </div>
    )
}

const Message = ({message, index}: {message: string; index: number}) => {
    if (index % 2) {
        return (
            <div class="m-2 bg-slate-200 max-w-sm rounded md:mr-48 mr-10">
                <p class="mx-2">{message}</p>
            </div>
        )
    } else {
        return (
            <div class="m-2 bg-gray-200 max-w-sm rounded md:ml-48 ml-10">
                <p class="mx-2">{message}</p>
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
    <link rel="icon" type="image/x-icon" href="/public/devfavicon.png">
    <script src="https://unpkg.com/htmx.org@1.9.6"></script>
    <script src="https://unpkg.com/htmx.org/dist/ext/loading-states.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        htmx.defineExtension('reset-on-success', {
            onEvent: function(name, event) {
                if (name !== 'htmx:beforeSwap') return;
                if (event.detail.isError) return;
        
                const triggeringElt = event.detail.requestConfig.elt;
                if (!triggeringElt.closest('[hx-reset-on-success]') && !triggeringElt.closest('[data-hx-reset-on-success]'))
                    return;
        
                switch (triggeringElt.tagName) {
                    case 'INPUT':
                    case 'TEXTAREA':
                        triggeringElt.value = triggeringElt.defaultValue;
                        break;
                    case 'SELECT':
                        //too much work
                        break;
                    case 'FORM':
                        triggeringElt.reset();
                        break;
                }
            }
        });
    </script>
</head>

<body hx-ext="loading-states, reset-on-success">
    ${children}
</body>

`;
