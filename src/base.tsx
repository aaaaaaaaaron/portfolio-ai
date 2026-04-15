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
    <script>
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
