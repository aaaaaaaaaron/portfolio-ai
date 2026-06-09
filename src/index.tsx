import Elysia, { t } from "elysia";
import { html } from "@elysiajs/html";
import { staticPlugin } from '@elysiajs/static'
import Html from "@kitajs/html"
import {Navigation, About, Expierence, Music, WebsiteInfo} from "./static.tsx"
import {BaseHtml} from "./base.tsx"
import OpenAI from "openai";
import { prompt } from "./prompt.ts";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions.mjs";

const cannedMessage = 'Hey, welcome to my Website! Do you have any questions for me?'

const cookieSchema = {
    cookie: t.Cookie({
        cookie: t.Optional(t.Object({
            messages: t.Array(t.String())
        }))
    })
}

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const app = new Elysia()
    .use(html())
    .use(staticPlugin({ assets: `${import.meta.dir}/../public` }))
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
    }, cookieSchema)
    .put('/reset', ({cookie: {cookie}}) => {
        cookie.httpOnly = true
        if (!cookie.value) {
            cookie.value = { messages: [cannedMessage] }
        } else {
            cookie.value.messages = [cannedMessage]
        }
        cookie.set({})
        return <Chatbox messages={cookie.value.messages}/>
    }, cookieSchema)
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
        console.log(cookie.value.messages)
        cookie.set({})
        return <Message message={response} index={0} />
    }, 
    {
        body: t.Object({message: t.String()}), // define html body response type
        ...cookieSchema
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
        model: "gpt-4o-mini",
        messages: messagesFormatted,
    });
    console.log(response.usage)
    if (response.choices[0].message.content == null) {return "null"} else {return response.choices[0].message.content}
}

const createMessageObject = (messages: string[]) => {
    let messagesFormatted: ChatCompletionMessageParam[] = [{"role": "system", "content": prompt}]
    messages.forEach((message, i) => {
        let role: 'system' | 'user' | 'assistant' | 'function' = i % 2 ? "user": "assistant"
        messagesFormatted.push({"role": role, "content": message})
    })
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
                <button class="sticky top-[1vh] ml-2 bg-zinc-400 hover:bg-zinc-500 transition-colors rounded font-semibold px-1" hx-put="/reset" hx-target="#chatbox" hx-swap="outerHTML" data-loading-disable>
                    Reset
                </button>
                <ul id="messagesList">
                    {messages.map(function(message, i){
                        return <Message message={message} index={i} />;
                    })}
                </ul>
            </div>

            <div class="h-fit overflow-auto rounded-b mx-2" id="chatbox-bottom">
                <form class="grid grid-cols-2 overflow-auto mt-2 mb-1 rounded-b" hx-put="/message" hx-target="#messagesList" hx-swap="beforeend">
                    <input class="mx-2 rounded h-8 p-2" name="message" placeholder="Send a message" id="messagebox" autocomplete="off" data-loading-disable></input>
                    <button class="mx-2 bg-zinc-400 hover:bg-zinc-500 active:bg-zinc-600 transition-colors rounded h-8 font-semibold" type="submit" data-loading-disable>send</button>
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
                If you would like to talk to me for real, find my contact information on my{" "}
                <a class="underline text-blue-600 hover:text-blue-800 visited:text-purple-600" href="/public/aaron_gould_resume_062026.pdf" target="_blank">resume</a>
                {" "}or message me on{" "}
                <a class="underline text-blue-600 hover:text-blue-800 visited:text-purple-600" href="https://www.linkedin.com/in/aaron-gould-287036188/" target="_blank">LinkedIn</a>.
            </p>
        </div>
    )
}

const Message = ({message, index}: {message: string; index: number}) => {
    if (index % 2) {
        return (
            <div class="message-animate m-2 bg-slate-200 max-w-sm rounded md:mr-48 mr-10">
                <p class="mx-2">{message}</p>
            </div>
        )
    } else {
        return (
            <div class="message-animate m-2 bg-gray-200 max-w-sm rounded md:ml-48 ml-10">
                <p class="mx-2">{message}</p>
            </div>
        )
    }
}

