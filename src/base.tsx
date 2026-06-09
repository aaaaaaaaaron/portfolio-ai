import Html from "@kitajs/html"

// es-string-html vscode plugin helps with syntax highlighting here
export const BaseHtml = ({children}: Html.PropsWithChildren) => /* html */`
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
    <style>
        @keyframes message-in {
            from { opacity: 0; transform: translateY(6px); }
            to   { opacity: 1; transform: translateY(0); }
        }
        .message-animate { animation: message-in 0.18s ease-out; }

        @keyframes typing-bounce {
            0%, 60%, 100% { transform: translateY(0); }
            30%           { transform: translateY(-5px); }
        }
        .typing-dot {
            display: inline-block;
            width: 7px; height: 7px;
            border-radius: 50%;
            background: #9ca3af;
            margin: 0 2px;
            animation: typing-bounce 1.1s infinite;
        }
        .typing-dot:nth-child(2) { animation-delay: 0.15s; }
        .typing-dot:nth-child(3) { animation-delay: 0.3s; }
    </style>
    <script>
        document.addEventListener('htmx:beforeRequest', function(event) {
            if (event.detail.requestConfig.path !== '/message') return;
            const input = document.getElementById('messagebox');
            const messagesList = document.getElementById('messagesList');
            const chats = document.getElementById('chats');
            if (!input || !messagesList) return;

            const text = input.value.trim();
            if (!text) return;
            input.value = '';

            // Immediately show user message
            const userDiv = document.createElement('div');
            userDiv.className = 'message-animate m-2 bg-slate-200 max-w-sm rounded md:mr-48 mr-10';
            const userP = document.createElement('p');
            userP.className = 'mx-2';
            userP.textContent = text;
            userDiv.appendChild(userP);
            messagesList.appendChild(userDiv);

            // Typing indicator
            const typingDiv = document.createElement('div');
            typingDiv.id = 'typing-indicator';
            typingDiv.className = 'message-animate m-2 bg-gray-200 max-w-xs rounded md:ml-48 ml-10 py-2 px-3';
            typingDiv.innerHTML = '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';
            messagesList.appendChild(typingDiv);

            if (chats) chats.scrollTop = chats.scrollHeight;
        });

        document.addEventListener('htmx:beforeSwap', function(event) {
            if (event.detail.requestConfig.path !== '/message') return;
            const indicator = document.getElementById('typing-indicator');
            if (indicator) indicator.remove();
        });

        document.addEventListener('htmx:afterSwap', function(event) {
            if (event.detail.target.id === 'messagesList') {
                const chats = document.getElementById('chats');
                if (chats) chats.scrollTop = chats.scrollHeight;
            }
        });

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
