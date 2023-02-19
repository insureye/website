import '/node_modules/vite/dist/client/env.mjs';

const base$1 = "/" || '/';
// set :host styles to make playwright detect the element as visible
const template = /*html*/ `
<style>
:host {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 99999;
  --monospace: 'SFMono-Regular', Consolas,
  'Liberation Mono', Menlo, Courier, monospace;
  --red: #ff5555;
  --yellow: #e2aa53;
  --purple: #cfa4ff;
  --cyan: #2dd9da;
  --dim: #c9c9c9;

  --window-background: #181818;
  --window-color: #d8d8d8;
}

.backdrop {
  position: fixed;
  z-index: 99999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  margin: 0;
  background: rgba(0, 0, 0, 0.66);
}

.window {
  font-family: var(--monospace);
  line-height: 1.5;
  width: 800px;
  color: var(--window-color);
  margin: 30px auto;
  padding: 25px 40px;
  position: relative;
  background: var(--window-background);
  border-radius: 6px 6px 8px 8px;
  box-shadow: 0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);
  overflow: hidden;
  border-top: 8px solid var(--red);
  direction: ltr;
  text-align: left;
}

pre {
  font-family: var(--monospace);
  font-size: 16px;
  margin-top: 0;
  margin-bottom: 1em;
  overflow-x: scroll;
  scrollbar-width: none;
}

pre::-webkit-scrollbar {
  display: none;
}

.message {
  line-height: 1.3;
  font-weight: 600;
  white-space: pre-wrap;
}

.message-body {
  color: var(--red);
}

.plugin {
  color: var(--purple);
}

.file {
  color: var(--cyan);
  margin-bottom: 0;
  white-space: pre-wrap;
  word-break: break-all;
}

.frame {
  color: var(--yellow);
}

.stack {
  font-size: 13px;
  color: var(--dim);
}

.tip {
  font-size: 13px;
  color: #999;
  border-top: 1px dotted #999;
  padding-top: 13px;
}

code {
  font-size: 13px;
  font-family: var(--monospace);
  color: var(--yellow);
}

.file-link {
  text-decoration: underline;
  cursor: pointer;
}
</style>
<div class="backdrop" part="backdrop">
  <div class="window" part="window">
    <pre class="message" part="message"><span class="plugin"></span><span class="message-body"></span></pre>
    <pre class="file" part="file"></pre>
    <pre class="frame" part="frame"></pre>
    <pre class="stack" part="stack"></pre>
    <div class="tip" part="tip">
      Click outside or fix the code to dismiss.<br>
      You can also disable this overlay by setting
      <code>server.hmr.overlay</code> to <code>false</code> in <code>vite.config.js.</code>
    </div>
  </div>
</div>
`;
const fileRE = /(?:[a-zA-Z]:\\|\/).*?:\d+:\d+/g;
const codeframeRE = /^(?:>?\s+\d+\s+\|.*|\s+\|\s*\^.*)\r?\n/gm;
// Allow `ErrorOverlay` to extend `HTMLElement` even in environments where
// `HTMLElement` was not originally defined.
const { HTMLElement = class {
} } = globalThis;
class ErrorOverlay extends HTMLElement {
    constructor(err, links = true) {
        var _a;
        super();
        this.root = this.attachShadow({ mode: 'open' });
        this.root.innerHTML = template;
        codeframeRE.lastIndex = 0;
        const hasFrame = err.frame && codeframeRE.test(err.frame);
        const message = hasFrame
            ? err.message.replace(codeframeRE, '')
            : err.message;
        if (err.plugin) {
            this.text('.plugin', `[plugin:${err.plugin}] `);
        }
        this.text('.message-body', message.trim());
        const [file] = (((_a = err.loc) === null || _a === void 0 ? void 0 : _a.file) || err.id || 'unknown file').split(`?`);
        if (err.loc) {
            this.text('.file', `${file}:${err.loc.line}:${err.loc.column}`, links);
        }
        else if (err.id) {
            this.text('.file', file);
        }
        if (hasFrame) {
            this.text('.frame', err.frame.trim());
        }
        this.text('.stack', err.stack, links);
        this.root.querySelector('.window').addEventListener('click', (e) => {
            e.stopPropagation();
        });
        this.addEventListener('click', () => {
            this.close();
        });
    }
    text(selector, text, linkFiles = false) {
        const el = this.root.querySelector(selector);
        if (!linkFiles) {
            el.textContent = text;
        }
        else {
            let curIndex = 0;
            let match;
            fileRE.lastIndex = 0;
            while ((match = fileRE.exec(text))) {
                const { 0: file, index } = match;
                if (index != null) {
                    const frag = text.slice(curIndex, index);
                    el.appendChild(document.createTextNode(frag));
                    const link = document.createElement('a');
                    link.textContent = file;
                    link.className = 'file-link';
                    link.onclick = () => {
                        fetch(`${base$1}__open-in-editor?file=` + encodeURIComponent(file));
                    };
                    el.appendChild(link);
                    curIndex += frag.length + file.length;
                }
            }
        }
    }
    close() {
        var _a;
        (_a = this.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(this);
    }
}
const overlayId = 'vite-error-overlay';
const { customElements } = globalThis; // Ensure `customElements` is defined before the next line.
if (customElements && !customElements.get(overlayId)) {
    customElements.define(overlayId, ErrorOverlay);
}

console.debug('[vite] connecting...');
const importMetaUrl = new URL(import.meta.url);
// use server configuration, then fallback to inference
const serverHost = "127.0.0.1:5173/";
const socketProtocol = null || (importMetaUrl.protocol === 'https:' ? 'wss' : 'ws');
const hmrPort = null;
const socketHost = `${null || importMetaUrl.hostname}:${hmrPort || importMetaUrl.port}${"/"}`;
const directSocketHost = "127.0.0.1:5173/";
const base = "/" || '/';
const messageBuffer = [];
let socket;
try {
    let fallback;
    // only use fallback when port is inferred to prevent confusion
    if (!hmrPort) {
        fallback = () => {
            // fallback to connecting directly to the hmr server
            // for servers which does not support proxying websocket
            socket = setupWebSocket(socketProtocol, directSocketHost, () => {
                const currentScriptHostURL = new URL(import.meta.url);
                const currentScriptHost = currentScriptHostURL.host +
                    currentScriptHostURL.pathname.replace(/@vite\/client$/, '');
                console.error('[vite] failed to connect to websocket.\n' +
                    'your current setup:\n' +
                    `  (browser) ${currentScriptHost} <--[HTTP]--> ${serverHost} (server)\n` +
                    `  (browser) ${socketHost} <--[WebSocket (failing)]--> ${directSocketHost} (server)\n` +
                    'Check out your Vite / network configuration and https://vitejs.dev/config/server-options.html#server-hmr .');
            });
            socket.addEventListener('open', () => {
                console.info('[vite] Direct websocket connection fallback. Check out https://vitejs.dev/config/server-options.html#server-hmr to remove the previous connection error.');
            }, { once: true });
        };
    }
    socket = setupWebSocket(socketProtocol, socketHost, fallback);
}
catch (error) {
    console.error(`[vite] failed to connect to websocket (${error}). `);
}
function setupWebSocket(protocol, hostAndPath, onCloseWithoutOpen) {
    const socket = new WebSocket(`${protocol}://${hostAndPath}`, 'vite-hmr');
    let isOpened = false;
    socket.addEventListener('open', () => {
        isOpened = true;
    }, { once: true });
    // Listen for messages
    socket.addEventListener('message', async ({ data }) => {
        handleMessage(JSON.parse(data));
    });
    // ping server
    socket.addEventListener('close', async ({ wasClean }) => {
        if (wasClean)
            return;
        if (!isOpened && onCloseWithoutOpen) {
            onCloseWithoutOpen();
            return;
        }
        console.log(`[vite] server connection lost. polling for restart...`);
        await waitForSuccessfulPing(protocol, hostAndPath);
        location.reload();
    });
    return socket;
}
function warnFailedFetch(err, path) {
    if (!err.message.match('fetch')) {
        console.error(err);
    }
    console.error(`[hmr] Failed to reload ${path}. ` +
        `This could be due to syntax errors or importing non-existent ` +
        `modules. (see errors above)`);
}
function cleanUrl(pathname) {
    const url = new URL(pathname, location.toString());
    url.searchParams.delete('direct');
    return url.pathname + url.search;
}
let isFirstUpdate = true;
const outdatedLinkTags = new WeakSet();
async function handleMessage(payload) {
    switch (payload.type) {
        case 'connected':
            console.debug(`[vite] connected.`);
            sendMessageBuffer();
            // proxy(nginx, docker) hmr ws maybe caused timeout,
            // so send ping package let ws keep alive.
            setInterval(() => {
                if (socket.readyState === socket.OPEN) {
                    socket.send('{"type":"ping"}');
                }
            }, 30000);
            break;
        case 'update':
            notifyListeners('vite:beforeUpdate', payload);
            // if this is the first update and there's already an error overlay, it
            // means the page opened with existing server compile error and the whole
            // module script failed to load (since one of the nested imports is 500).
            // in this case a normal update won't work and a full reload is needed.
            if (isFirstUpdate && hasErrorOverlay()) {
                window.location.reload();
                return;
            }
            else {
                clearErrorOverlay();
                isFirstUpdate = false;
            }
            await Promise.all(payload.updates.map(async (update) => {
                if (update.type === 'js-update') {
                    return queueUpdate(fetchUpdate(update));
                }
                // css-update
                // this is only sent when a css file referenced with <link> is updated
                const { path, timestamp } = update;
                const searchUrl = cleanUrl(path);
                // can't use querySelector with `[href*=]` here since the link may be
                // using relative paths so we need to use link.href to grab the full
                // URL for the include check.
                const el = Array.from(document.querySelectorAll('link')).find((e) => !outdatedLinkTags.has(e) && cleanUrl(e.href).includes(searchUrl));
                if (!el) {
                    return;
                }
                const newPath = `${base}${searchUrl.slice(1)}${searchUrl.includes('?') ? '&' : '?'}t=${timestamp}`;
                // rather than swapping the href on the existing tag, we will
                // create a new link tag. Once the new stylesheet has loaded we
                // will remove the existing link tag. This removes a Flash Of
                // Unstyled Content that can occur when swapping out the tag href
                // directly, as the new stylesheet has not yet been loaded.
                return new Promise((resolve) => {
                    const newLinkTag = el.cloneNode();
                    newLinkTag.href = new URL(newPath, el.href).href;
                    const removeOldEl = () => {
                        el.remove();
                        console.debug(`[vite] css hot updated: ${searchUrl}`);
                        resolve();
                    };
                    newLinkTag.addEventListener('load', removeOldEl);
                    newLinkTag.addEventListener('error', removeOldEl);
                    outdatedLinkTags.add(el);
                    el.after(newLinkTag);
                });
            }));
            notifyListeners('vite:afterUpdate', payload);
            break;
        case 'custom': {
            notifyListeners(payload.event, payload.data);
            break;
        }
        case 'full-reload':
            notifyListeners('vite:beforeFullReload', payload);
            if (payload.path && payload.path.endsWith('.html')) {
                // if html file is edited, only reload the page if the browser is
                // currently on that page.
                const pagePath = decodeURI(location.pathname);
                const payloadPath = base + payload.path.slice(1);
                if (pagePath === payloadPath ||
                    payload.path === '/index.html' ||
                    (pagePath.endsWith('/') && pagePath + 'index.html' === payloadPath)) {
                    location.reload();
                }
                return;
            }
            else {
                location.reload();
            }
            break;
        case 'prune':
            notifyListeners('vite:beforePrune', payload);
            // After an HMR update, some modules are no longer imported on the page
            // but they may have left behind side effects that need to be cleaned up
            // (.e.g style injections)
            // TODO Trigger their dispose callbacks.
            payload.paths.forEach((path) => {
                const fn = pruneMap.get(path);
                if (fn) {
                    fn(dataMap.get(path));
                }
            });
            break;
        case 'error': {
            notifyListeners('vite:error', payload);
            const err = payload.err;
            if (enableOverlay) {
                createErrorOverlay(err);
            }
            else {
                console.error(`[vite] Internal Server Error\n${err.message}\n${err.stack}`);
            }
            break;
        }
        default: {
            const check = payload;
            return check;
        }
    }
}
function notifyListeners(event, data) {
    const cbs = customListenersMap.get(event);
    if (cbs) {
        cbs.forEach((cb) => cb(data));
    }
}
const enableOverlay = true;
function createErrorOverlay(err) {
    if (!enableOverlay)
        return;
    clearErrorOverlay();
    document.body.appendChild(new ErrorOverlay(err));
}
function clearErrorOverlay() {
    document
        .querySelectorAll(overlayId)
        .forEach((n) => n.close());
}
function hasErrorOverlay() {
    return document.querySelectorAll(overlayId).length;
}
let pending = false;
let queued = [];
/**
 * buffer multiple hot updates triggered by the same src change
 * so that they are invoked in the same order they were sent.
 * (otherwise the order may be inconsistent because of the http request round trip)
 */
async function queueUpdate(p) {
    queued.push(p);
    if (!pending) {
        pending = true;
        await Promise.resolve();
        pending = false;
        const loading = [...queued];
        queued = [];
        (await Promise.all(loading)).forEach((fn) => fn && fn());
    }
}
async function waitForSuccessfulPing(socketProtocol, hostAndPath, ms = 1000) {
    const pingHostProtocol = socketProtocol === 'wss' ? 'https' : 'http';
    // eslint-disable-next-line no-constant-condition
    while (true) {
        try {
            // A fetch on a websocket URL will return a successful promise with status 400,
            // but will reject a networking error.
            // When running on middleware mode, it returns status 426, and an cors error happens if mode is not no-cors
            await fetch(`${pingHostProtocol}://${hostAndPath}`, {
                mode: 'no-cors',
            });
            break;
        }
        catch (e) {
            // wait ms before attempting to ping again
            await new Promise((resolve) => setTimeout(resolve, ms));
        }
    }
}
const sheetsMap = new Map();
// all css imports should be inserted at the same position
// because after build it will be a single css file
let lastInsertedStyle;
function updateStyle(id, content) {
    let style = sheetsMap.get(id);
    {
        if (style && !(style instanceof HTMLStyleElement)) {
            removeStyle(id);
            style = undefined;
        }
        if (!style) {
            style = document.createElement('style');
            style.setAttribute('type', 'text/css');
            style.setAttribute('data-vite-dev-id', id);
            style.textContent = content;
            if (!lastInsertedStyle) {
                document.head.appendChild(style);
                // reset lastInsertedStyle after async
                // because dynamically imported css will be splitted into a different file
                setTimeout(() => {
                    lastInsertedStyle = undefined;
                }, 0);
            }
            else {
                lastInsertedStyle.insertAdjacentElement('afterend', style);
            }
            lastInsertedStyle = style;
        }
        else {
            style.textContent = content;
        }
    }
    sheetsMap.set(id, style);
}
function removeStyle(id) {
    const style = sheetsMap.get(id);
    if (style) {
        if (style instanceof CSSStyleSheet) {
            document.adoptedStyleSheets = document.adoptedStyleSheets.filter((s) => s !== style);
        }
        else {
            document.head.removeChild(style);
        }
        sheetsMap.delete(id);
    }
}
async function fetchUpdate({ path, acceptedPath, timestamp, explicitImportRequired, }) {
    const mod = hotModulesMap.get(path);
    if (!mod) {
        // In a code-splitting project,
        // it is common that the hot-updating module is not loaded yet.
        // https://github.com/vitejs/vite/issues/721
        return;
    }
    let fetchedModule;
    const isSelfUpdate = path === acceptedPath;
    // determine the qualified callbacks before we re-import the modules
    const qualifiedCallbacks = mod.callbacks.filter(({ deps }) => deps.includes(acceptedPath));
    if (isSelfUpdate || qualifiedCallbacks.length > 0) {
        const disposer = disposeMap.get(acceptedPath);
        if (disposer)
            await disposer(dataMap.get(acceptedPath));
        const [acceptedPathWithoutQuery, query] = acceptedPath.split(`?`);
        try {
            fetchedModule = await import(
            /* @vite-ignore */
            base +
                acceptedPathWithoutQuery.slice(1) +
                `?${explicitImportRequired ? 'import&' : ''}t=${timestamp}${query ? `&${query}` : ''}`);
        }
        catch (e) {
            warnFailedFetch(e, acceptedPath);
        }
    }
    return () => {
        for (const { deps, fn } of qualifiedCallbacks) {
            fn(deps.map((dep) => (dep === acceptedPath ? fetchedModule : undefined)));
        }
        const loggedPath = isSelfUpdate ? path : `${acceptedPath} via ${path}`;
        console.debug(`[vite] hot updated: ${loggedPath}`);
    };
}
function sendMessageBuffer() {
    if (socket.readyState === 1) {
        messageBuffer.forEach((msg) => socket.send(msg));
        messageBuffer.length = 0;
    }
}
const hotModulesMap = new Map();
const disposeMap = new Map();
const pruneMap = new Map();
const dataMap = new Map();
const customListenersMap = new Map();
const ctxToListenersMap = new Map();
function createHotContext(ownerPath) {
    if (!dataMap.has(ownerPath)) {
        dataMap.set(ownerPath, {});
    }
    // when a file is hot updated, a new context is created
    // clear its stale callbacks
    const mod = hotModulesMap.get(ownerPath);
    if (mod) {
        mod.callbacks = [];
    }
    // clear stale custom event listeners
    const staleListeners = ctxToListenersMap.get(ownerPath);
    if (staleListeners) {
        for (const [event, staleFns] of staleListeners) {
            const listeners = customListenersMap.get(event);
            if (listeners) {
                customListenersMap.set(event, listeners.filter((l) => !staleFns.includes(l)));
            }
        }
    }
    const newListeners = new Map();
    ctxToListenersMap.set(ownerPath, newListeners);
    function acceptDeps(deps, callback = () => { }) {
        const mod = hotModulesMap.get(ownerPath) || {
            id: ownerPath,
            callbacks: [],
        };
        mod.callbacks.push({
            deps,
            fn: callback,
        });
        hotModulesMap.set(ownerPath, mod);
    }
    const hot = {
        get data() {
            return dataMap.get(ownerPath);
        },
        accept(deps, callback) {
            if (typeof deps === 'function' || !deps) {
                // self-accept: hot.accept(() => {})
                acceptDeps([ownerPath], ([mod]) => deps === null || deps === void 0 ? void 0 : deps(mod));
            }
            else if (typeof deps === 'string') {
                // explicit deps
                acceptDeps([deps], ([mod]) => callback === null || callback === void 0 ? void 0 : callback(mod));
            }
            else if (Array.isArray(deps)) {
                acceptDeps(deps, callback);
            }
            else {
                throw new Error(`invalid hot.accept() usage.`);
            }
        },
        // export names (first arg) are irrelevant on the client side, they're
        // extracted in the server for propagation
        acceptExports(_, callback) {
            acceptDeps([ownerPath], ([mod]) => callback === null || callback === void 0 ? void 0 : callback(mod));
        },
        dispose(cb) {
            disposeMap.set(ownerPath, cb);
        },
        prune(cb) {
            pruneMap.set(ownerPath, cb);
        },
        // Kept for backward compatibility (#11036)
        // @ts-expect-error untyped
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        decline() { },
        // tell the server to re-perform hmr propagation from this module as root
        invalidate(message) {
            notifyListeners('vite:invalidate', { path: ownerPath, message });
            this.send('vite:invalidate', { path: ownerPath, message });
            console.debug(`[vite] invalidate ${ownerPath}${message ? `: ${message}` : ''}`);
        },
        // custom events
        on(event, cb) {
            const addToMap = (map) => {
                const existing = map.get(event) || [];
                existing.push(cb);
                map.set(event, existing);
            };
            addToMap(customListenersMap);
            addToMap(newListeners);
        },
        send(event, data) {
            messageBuffer.push(JSON.stringify({ type: 'custom', event, data }));
            sendMessageBuffer();
        },
    };
    return hot;
}
/**
 * urls here are dynamic import() urls that couldn't be statically analyzed
 */
function injectQuery(url, queryToInject) {
    // skip urls that won't be handled by vite
    if (!url.startsWith('.') && !url.startsWith('/')) {
        return url;
    }
    // can't use pathname from URL since it may be relative like ../
    const pathname = url.replace(/#.*$/, '').replace(/\?.*$/, '');
    const { search, hash } = new URL(url, 'http://vitejs.dev');
    return `${pathname}?${queryToInject}${search ? `&` + search.slice(1) : ''}${hash || ''}`;
}

export { ErrorOverlay, createHotContext, injectQuery, removeStyle, updateStyle };
                                   

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50Lm1qcyIsInNvdXJjZXMiOlsib3ZlcmxheS50cyIsImNsaWVudC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IEVycm9yUGF5bG9hZCB9IGZyb20gJ3R5cGVzL2htclBheWxvYWQnXG5cbi8vIGluamVjdGVkIGJ5IHRoZSBobXIgcGx1Z2luIHdoZW4gc2VydmVkXG5kZWNsYXJlIGNvbnN0IF9fQkFTRV9fOiBzdHJpbmdcblxuY29uc3QgYmFzZSA9IF9fQkFTRV9fIHx8ICcvJ1xuXG4vLyBzZXQgOmhvc3Qgc3R5bGVzIHRvIG1ha2UgcGxheXdyaWdodCBkZXRlY3QgdGhlIGVsZW1lbnQgYXMgdmlzaWJsZVxuY29uc3QgdGVtcGxhdGUgPSAvKmh0bWwqLyBgXG48c3R5bGU+XG46aG9zdCB7XG4gIHBvc2l0aW9uOiBmaXhlZDtcbiAgdG9wOiAwO1xuICBsZWZ0OiAwO1xuICB3aWR0aDogMTAwJTtcbiAgaGVpZ2h0OiAxMDAlO1xuICB6LWluZGV4OiA5OTk5OTtcbiAgLS1tb25vc3BhY2U6ICdTRk1vbm8tUmVndWxhcicsIENvbnNvbGFzLFxuICAnTGliZXJhdGlvbiBNb25vJywgTWVubG8sIENvdXJpZXIsIG1vbm9zcGFjZTtcbiAgLS1yZWQ6ICNmZjU1NTU7XG4gIC0teWVsbG93OiAjZTJhYTUzO1xuICAtLXB1cnBsZTogI2NmYTRmZjtcbiAgLS1jeWFuOiAjMmRkOWRhO1xuICAtLWRpbTogI2M5YzljOTtcblxuICAtLXdpbmRvdy1iYWNrZ3JvdW5kOiAjMTgxODE4O1xuICAtLXdpbmRvdy1jb2xvcjogI2Q4ZDhkODtcbn1cblxuLmJhY2tkcm9wIHtcbiAgcG9zaXRpb246IGZpeGVkO1xuICB6LWluZGV4OiA5OTk5OTtcbiAgdG9wOiAwO1xuICBsZWZ0OiAwO1xuICB3aWR0aDogMTAwJTtcbiAgaGVpZ2h0OiAxMDAlO1xuICBvdmVyZmxvdy15OiBzY3JvbGw7XG4gIG1hcmdpbjogMDtcbiAgYmFja2dyb3VuZDogcmdiYSgwLCAwLCAwLCAwLjY2KTtcbn1cblxuLndpbmRvdyB7XG4gIGZvbnQtZmFtaWx5OiB2YXIoLS1tb25vc3BhY2UpO1xuICBsaW5lLWhlaWdodDogMS41O1xuICB3aWR0aDogODAwcHg7XG4gIGNvbG9yOiB2YXIoLS13aW5kb3ctY29sb3IpO1xuICBtYXJnaW46IDMwcHggYXV0bztcbiAgcGFkZGluZzogMjVweCA0MHB4O1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIGJhY2tncm91bmQ6IHZhcigtLXdpbmRvdy1iYWNrZ3JvdW5kKTtcbiAgYm9yZGVyLXJhZGl1czogNnB4IDZweCA4cHggOHB4O1xuICBib3gtc2hhZG93OiAwIDE5cHggMzhweCByZ2JhKDAsMCwwLDAuMzApLCAwIDE1cHggMTJweCByZ2JhKDAsMCwwLDAuMjIpO1xuICBvdmVyZmxvdzogaGlkZGVuO1xuICBib3JkZXItdG9wOiA4cHggc29saWQgdmFyKC0tcmVkKTtcbiAgZGlyZWN0aW9uOiBsdHI7XG4gIHRleHQtYWxpZ246IGxlZnQ7XG59XG5cbnByZSB7XG4gIGZvbnQtZmFtaWx5OiB2YXIoLS1tb25vc3BhY2UpO1xuICBmb250LXNpemU6IDE2cHg7XG4gIG1hcmdpbi10b3A6IDA7XG4gIG1hcmdpbi1ib3R0b206IDFlbTtcbiAgb3ZlcmZsb3cteDogc2Nyb2xsO1xuICBzY3JvbGxiYXItd2lkdGg6IG5vbmU7XG59XG5cbnByZTo6LXdlYmtpdC1zY3JvbGxiYXIge1xuICBkaXNwbGF5OiBub25lO1xufVxuXG4ubWVzc2FnZSB7XG4gIGxpbmUtaGVpZ2h0OiAxLjM7XG4gIGZvbnQtd2VpZ2h0OiA2MDA7XG4gIHdoaXRlLXNwYWNlOiBwcmUtd3JhcDtcbn1cblxuLm1lc3NhZ2UtYm9keSB7XG4gIGNvbG9yOiB2YXIoLS1yZWQpO1xufVxuXG4ucGx1Z2luIHtcbiAgY29sb3I6IHZhcigtLXB1cnBsZSk7XG59XG5cbi5maWxlIHtcbiAgY29sb3I6IHZhcigtLWN5YW4pO1xuICBtYXJnaW4tYm90dG9tOiAwO1xuICB3aGl0ZS1zcGFjZTogcHJlLXdyYXA7XG4gIHdvcmQtYnJlYWs6IGJyZWFrLWFsbDtcbn1cblxuLmZyYW1lIHtcbiAgY29sb3I6IHZhcigtLXllbGxvdyk7XG59XG5cbi5zdGFjayB7XG4gIGZvbnQtc2l6ZTogMTNweDtcbiAgY29sb3I6IHZhcigtLWRpbSk7XG59XG5cbi50aXAge1xuICBmb250LXNpemU6IDEzcHg7XG4gIGNvbG9yOiAjOTk5O1xuICBib3JkZXItdG9wOiAxcHggZG90dGVkICM5OTk7XG4gIHBhZGRpbmctdG9wOiAxM3B4O1xufVxuXG5jb2RlIHtcbiAgZm9udC1zaXplOiAxM3B4O1xuICBmb250LWZhbWlseTogdmFyKC0tbW9ub3NwYWNlKTtcbiAgY29sb3I6IHZhcigtLXllbGxvdyk7XG59XG5cbi5maWxlLWxpbmsge1xuICB0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTtcbiAgY3Vyc29yOiBwb2ludGVyO1xufVxuPC9zdHlsZT5cbjxkaXYgY2xhc3M9XCJiYWNrZHJvcFwiIHBhcnQ9XCJiYWNrZHJvcFwiPlxuICA8ZGl2IGNsYXNzPVwid2luZG93XCIgcGFydD1cIndpbmRvd1wiPlxuICAgIDxwcmUgY2xhc3M9XCJtZXNzYWdlXCIgcGFydD1cIm1lc3NhZ2VcIj48c3BhbiBjbGFzcz1cInBsdWdpblwiPjwvc3Bhbj48c3BhbiBjbGFzcz1cIm1lc3NhZ2UtYm9keVwiPjwvc3Bhbj48L3ByZT5cbiAgICA8cHJlIGNsYXNzPVwiZmlsZVwiIHBhcnQ9XCJmaWxlXCI+PC9wcmU+XG4gICAgPHByZSBjbGFzcz1cImZyYW1lXCIgcGFydD1cImZyYW1lXCI+PC9wcmU+XG4gICAgPHByZSBjbGFzcz1cInN0YWNrXCIgcGFydD1cInN0YWNrXCI+PC9wcmU+XG4gICAgPGRpdiBjbGFzcz1cInRpcFwiIHBhcnQ9XCJ0aXBcIj5cbiAgICAgIENsaWNrIG91dHNpZGUgb3IgZml4IHRoZSBjb2RlIHRvIGRpc21pc3MuPGJyPlxuICAgICAgWW91IGNhbiBhbHNvIGRpc2FibGUgdGhpcyBvdmVybGF5IGJ5IHNldHRpbmdcbiAgICAgIDxjb2RlPnNlcnZlci5obXIub3ZlcmxheTwvY29kZT4gdG8gPGNvZGU+ZmFsc2U8L2NvZGU+IGluIDxjb2RlPnZpdGUuY29uZmlnLmpzLjwvY29kZT5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG48L2Rpdj5cbmBcblxuY29uc3QgZmlsZVJFID0gLyg/OlthLXpBLVpdOlxcXFx8XFwvKS4qPzpcXGQrOlxcZCsvZ1xuY29uc3QgY29kZWZyYW1lUkUgPSAvXig/Oj4/XFxzK1xcZCtcXHMrXFx8Lip8XFxzK1xcfFxccypcXF4uKilcXHI/XFxuL2dtXG5cbi8vIEFsbG93IGBFcnJvck92ZXJsYXlgIHRvIGV4dGVuZCBgSFRNTEVsZW1lbnRgIGV2ZW4gaW4gZW52aXJvbm1lbnRzIHdoZXJlXG4vLyBgSFRNTEVsZW1lbnRgIHdhcyBub3Qgb3JpZ2luYWxseSBkZWZpbmVkLlxuY29uc3QgeyBIVE1MRWxlbWVudCA9IGNsYXNzIHt9IGFzIHR5cGVvZiBnbG9iYWxUaGlzLkhUTUxFbGVtZW50IH0gPSBnbG9iYWxUaGlzXG5leHBvcnQgY2xhc3MgRXJyb3JPdmVybGF5IGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuICByb290OiBTaGFkb3dSb290XG5cbiAgY29uc3RydWN0b3IoZXJyOiBFcnJvclBheWxvYWRbJ2VyciddLCBsaW5rcyA9IHRydWUpIHtcbiAgICBzdXBlcigpXG4gICAgdGhpcy5yb290ID0gdGhpcy5hdHRhY2hTaGFkb3coeyBtb2RlOiAnb3BlbicgfSlcbiAgICB0aGlzLnJvb3QuaW5uZXJIVE1MID0gdGVtcGxhdGVcblxuICAgIGNvZGVmcmFtZVJFLmxhc3RJbmRleCA9IDBcbiAgICBjb25zdCBoYXNGcmFtZSA9IGVyci5mcmFtZSAmJiBjb2RlZnJhbWVSRS50ZXN0KGVyci5mcmFtZSlcbiAgICBjb25zdCBtZXNzYWdlID0gaGFzRnJhbWVcbiAgICAgID8gZXJyLm1lc3NhZ2UucmVwbGFjZShjb2RlZnJhbWVSRSwgJycpXG4gICAgICA6IGVyci5tZXNzYWdlXG4gICAgaWYgKGVyci5wbHVnaW4pIHtcbiAgICAgIHRoaXMudGV4dCgnLnBsdWdpbicsIGBbcGx1Z2luOiR7ZXJyLnBsdWdpbn1dIGApXG4gICAgfVxuICAgIHRoaXMudGV4dCgnLm1lc3NhZ2UtYm9keScsIG1lc3NhZ2UudHJpbSgpKVxuXG4gICAgY29uc3QgW2ZpbGVdID0gKGVyci5sb2M/LmZpbGUgfHwgZXJyLmlkIHx8ICd1bmtub3duIGZpbGUnKS5zcGxpdChgP2ApXG4gICAgaWYgKGVyci5sb2MpIHtcbiAgICAgIHRoaXMudGV4dCgnLmZpbGUnLCBgJHtmaWxlfToke2Vyci5sb2MubGluZX06JHtlcnIubG9jLmNvbHVtbn1gLCBsaW5rcylcbiAgICB9IGVsc2UgaWYgKGVyci5pZCkge1xuICAgICAgdGhpcy50ZXh0KCcuZmlsZScsIGZpbGUpXG4gICAgfVxuXG4gICAgaWYgKGhhc0ZyYW1lKSB7XG4gICAgICB0aGlzLnRleHQoJy5mcmFtZScsIGVyci5mcmFtZSEudHJpbSgpKVxuICAgIH1cbiAgICB0aGlzLnRleHQoJy5zdGFjaycsIGVyci5zdGFjaywgbGlua3MpXG5cbiAgICB0aGlzLnJvb3QucXVlcnlTZWxlY3RvcignLndpbmRvdycpIS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG4gICAgfSlcbiAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgdGhpcy5jbG9zZSgpXG4gICAgfSlcbiAgfVxuXG4gIHRleHQoc2VsZWN0b3I6IHN0cmluZywgdGV4dDogc3RyaW5nLCBsaW5rRmlsZXMgPSBmYWxzZSk6IHZvaWQge1xuICAgIGNvbnN0IGVsID0gdGhpcy5yb290LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpIVxuICAgIGlmICghbGlua0ZpbGVzKSB7XG4gICAgICBlbC50ZXh0Q29udGVudCA9IHRleHRcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IGN1ckluZGV4ID0gMFxuICAgICAgbGV0IG1hdGNoOiBSZWdFeHBFeGVjQXJyYXkgfCBudWxsXG4gICAgICBmaWxlUkUubGFzdEluZGV4ID0gMFxuICAgICAgd2hpbGUgKChtYXRjaCA9IGZpbGVSRS5leGVjKHRleHQpKSkge1xuICAgICAgICBjb25zdCB7IDA6IGZpbGUsIGluZGV4IH0gPSBtYXRjaFxuICAgICAgICBpZiAoaW5kZXggIT0gbnVsbCkge1xuICAgICAgICAgIGNvbnN0IGZyYWcgPSB0ZXh0LnNsaWNlKGN1ckluZGV4LCBpbmRleClcbiAgICAgICAgICBlbC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShmcmFnKSlcbiAgICAgICAgICBjb25zdCBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpXG4gICAgICAgICAgbGluay50ZXh0Q29udGVudCA9IGZpbGVcbiAgICAgICAgICBsaW5rLmNsYXNzTmFtZSA9ICdmaWxlLWxpbmsnXG4gICAgICAgICAgbGluay5vbmNsaWNrID0gKCkgPT4ge1xuICAgICAgICAgICAgZmV0Y2goYCR7YmFzZX1fX29wZW4taW4tZWRpdG9yP2ZpbGU9YCArIGVuY29kZVVSSUNvbXBvbmVudChmaWxlKSlcbiAgICAgICAgICB9XG4gICAgICAgICAgZWwuYXBwZW5kQ2hpbGQobGluaylcbiAgICAgICAgICBjdXJJbmRleCArPSBmcmFnLmxlbmd0aCArIGZpbGUubGVuZ3RoXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjbG9zZSgpOiB2b2lkIHtcbiAgICB0aGlzLnBhcmVudE5vZGU/LnJlbW92ZUNoaWxkKHRoaXMpXG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IG92ZXJsYXlJZCA9ICd2aXRlLWVycm9yLW92ZXJsYXknXG5jb25zdCB7IGN1c3RvbUVsZW1lbnRzIH0gPSBnbG9iYWxUaGlzIC8vIEVuc3VyZSBgY3VzdG9tRWxlbWVudHNgIGlzIGRlZmluZWQgYmVmb3JlIHRoZSBuZXh0IGxpbmUuXG5pZiAoY3VzdG9tRWxlbWVudHMgJiYgIWN1c3RvbUVsZW1lbnRzLmdldChvdmVybGF5SWQpKSB7XG4gIGN1c3RvbUVsZW1lbnRzLmRlZmluZShvdmVybGF5SWQsIEVycm9yT3ZlcmxheSlcbn1cbiIsImltcG9ydCB0eXBlIHsgRXJyb3JQYXlsb2FkLCBITVJQYXlsb2FkLCBVcGRhdGUgfSBmcm9tICd0eXBlcy9obXJQYXlsb2FkJ1xuaW1wb3J0IHR5cGUgeyBNb2R1bGVOYW1lc3BhY2UsIFZpdGVIb3RDb250ZXh0IH0gZnJvbSAndHlwZXMvaG90J1xuaW1wb3J0IHR5cGUgeyBJbmZlckN1c3RvbUV2ZW50UGF5bG9hZCB9IGZyb20gJ3R5cGVzL2N1c3RvbUV2ZW50J1xuaW1wb3J0IHsgRXJyb3JPdmVybGF5LCBvdmVybGF5SWQgfSBmcm9tICcuL292ZXJsYXknXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm9kZS9uby1taXNzaW5nLWltcG9ydFxuaW1wb3J0ICdAdml0ZS9lbnYnXG5cbi8vIGluamVjdGVkIGJ5IHRoZSBobXIgcGx1Z2luIHdoZW4gc2VydmVkXG5kZWNsYXJlIGNvbnN0IF9fQkFTRV9fOiBzdHJpbmdcbmRlY2xhcmUgY29uc3QgX19TRVJWRVJfSE9TVF9fOiBzdHJpbmdcbmRlY2xhcmUgY29uc3QgX19ITVJfUFJPVE9DT0xfXzogc3RyaW5nIHwgbnVsbFxuZGVjbGFyZSBjb25zdCBfX0hNUl9IT1NUTkFNRV9fOiBzdHJpbmcgfCBudWxsXG5kZWNsYXJlIGNvbnN0IF9fSE1SX1BPUlRfXzogbnVtYmVyIHwgbnVsbFxuZGVjbGFyZSBjb25zdCBfX0hNUl9ESVJFQ1RfVEFSR0VUX186IHN0cmluZ1xuZGVjbGFyZSBjb25zdCBfX0hNUl9CQVNFX186IHN0cmluZ1xuZGVjbGFyZSBjb25zdCBfX0hNUl9USU1FT1VUX186IG51bWJlclxuZGVjbGFyZSBjb25zdCBfX0hNUl9FTkFCTEVfT1ZFUkxBWV9fOiBib29sZWFuXG5cbmNvbnNvbGUuZGVidWcoJ1t2aXRlXSBjb25uZWN0aW5nLi4uJylcblxuY29uc3QgaW1wb3J0TWV0YVVybCA9IG5ldyBVUkwoaW1wb3J0Lm1ldGEudXJsKVxuXG4vLyB1c2Ugc2VydmVyIGNvbmZpZ3VyYXRpb24sIHRoZW4gZmFsbGJhY2sgdG8gaW5mZXJlbmNlXG5jb25zdCBzZXJ2ZXJIb3N0ID0gX19TRVJWRVJfSE9TVF9fXG5jb25zdCBzb2NrZXRQcm90b2NvbCA9XG4gIF9fSE1SX1BST1RPQ09MX18gfHwgKGltcG9ydE1ldGFVcmwucHJvdG9jb2wgPT09ICdodHRwczonID8gJ3dzcycgOiAnd3MnKVxuY29uc3QgaG1yUG9ydCA9IF9fSE1SX1BPUlRfX1xuY29uc3Qgc29ja2V0SG9zdCA9IGAke19fSE1SX0hPU1ROQU1FX18gfHwgaW1wb3J0TWV0YVVybC5ob3N0bmFtZX06JHtcbiAgaG1yUG9ydCB8fCBpbXBvcnRNZXRhVXJsLnBvcnRcbn0ke19fSE1SX0JBU0VfX31gXG5jb25zdCBkaXJlY3RTb2NrZXRIb3N0ID0gX19ITVJfRElSRUNUX1RBUkdFVF9fXG5jb25zdCBiYXNlID0gX19CQVNFX18gfHwgJy8nXG5jb25zdCBtZXNzYWdlQnVmZmVyOiBzdHJpbmdbXSA9IFtdXG5cbmxldCBzb2NrZXQ6IFdlYlNvY2tldFxudHJ5IHtcbiAgbGV0IGZhbGxiYWNrOiAoKCkgPT4gdm9pZCkgfCB1bmRlZmluZWRcbiAgLy8gb25seSB1c2UgZmFsbGJhY2sgd2hlbiBwb3J0IGlzIGluZmVycmVkIHRvIHByZXZlbnQgY29uZnVzaW9uXG4gIGlmICghaG1yUG9ydCkge1xuICAgIGZhbGxiYWNrID0gKCkgPT4ge1xuICAgICAgLy8gZmFsbGJhY2sgdG8gY29ubmVjdGluZyBkaXJlY3RseSB0byB0aGUgaG1yIHNlcnZlclxuICAgICAgLy8gZm9yIHNlcnZlcnMgd2hpY2ggZG9lcyBub3Qgc3VwcG9ydCBwcm94eWluZyB3ZWJzb2NrZXRcbiAgICAgIHNvY2tldCA9IHNldHVwV2ViU29ja2V0KHNvY2tldFByb3RvY29sLCBkaXJlY3RTb2NrZXRIb3N0LCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRTY3JpcHRIb3N0VVJMID0gbmV3IFVSTChpbXBvcnQubWV0YS51cmwpXG4gICAgICAgIGNvbnN0IGN1cnJlbnRTY3JpcHRIb3N0ID1cbiAgICAgICAgICBjdXJyZW50U2NyaXB0SG9zdFVSTC5ob3N0ICtcbiAgICAgICAgICBjdXJyZW50U2NyaXB0SG9zdFVSTC5wYXRobmFtZS5yZXBsYWNlKC9Adml0ZVxcL2NsaWVudCQvLCAnJylcbiAgICAgICAgY29uc29sZS5lcnJvcihcbiAgICAgICAgICAnW3ZpdGVdIGZhaWxlZCB0byBjb25uZWN0IHRvIHdlYnNvY2tldC5cXG4nICtcbiAgICAgICAgICAgICd5b3VyIGN1cnJlbnQgc2V0dXA6XFxuJyArXG4gICAgICAgICAgICBgICAoYnJvd3NlcikgJHtjdXJyZW50U2NyaXB0SG9zdH0gPC0tW0hUVFBdLS0+ICR7c2VydmVySG9zdH0gKHNlcnZlcilcXG5gICtcbiAgICAgICAgICAgIGAgIChicm93c2VyKSAke3NvY2tldEhvc3R9IDwtLVtXZWJTb2NrZXQgKGZhaWxpbmcpXS0tPiAke2RpcmVjdFNvY2tldEhvc3R9IChzZXJ2ZXIpXFxuYCArXG4gICAgICAgICAgICAnQ2hlY2sgb3V0IHlvdXIgVml0ZSAvIG5ldHdvcmsgY29uZmlndXJhdGlvbiBhbmQgaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9zZXJ2ZXItb3B0aW9ucy5odG1sI3NlcnZlci1obXIgLicsXG4gICAgICAgIClcbiAgICAgIH0pXG4gICAgICBzb2NrZXQuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgJ29wZW4nLFxuICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgY29uc29sZS5pbmZvKFxuICAgICAgICAgICAgJ1t2aXRlXSBEaXJlY3Qgd2Vic29ja2V0IGNvbm5lY3Rpb24gZmFsbGJhY2suIENoZWNrIG91dCBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL3NlcnZlci1vcHRpb25zLmh0bWwjc2VydmVyLWhtciB0byByZW1vdmUgdGhlIHByZXZpb3VzIGNvbm5lY3Rpb24gZXJyb3IuJyxcbiAgICAgICAgICApXG4gICAgICAgIH0sXG4gICAgICAgIHsgb25jZTogdHJ1ZSB9LFxuICAgICAgKVxuICAgIH1cbiAgfVxuXG4gIHNvY2tldCA9IHNldHVwV2ViU29ja2V0KHNvY2tldFByb3RvY29sLCBzb2NrZXRIb3N0LCBmYWxsYmFjaylcbn0gY2F0Y2ggKGVycm9yKSB7XG4gIGNvbnNvbGUuZXJyb3IoYFt2aXRlXSBmYWlsZWQgdG8gY29ubmVjdCB0byB3ZWJzb2NrZXQgKCR7ZXJyb3J9KS4gYClcbn1cblxuZnVuY3Rpb24gc2V0dXBXZWJTb2NrZXQoXG4gIHByb3RvY29sOiBzdHJpbmcsXG4gIGhvc3RBbmRQYXRoOiBzdHJpbmcsXG4gIG9uQ2xvc2VXaXRob3V0T3Blbj86ICgpID0+IHZvaWQsXG4pIHtcbiAgY29uc3Qgc29ja2V0ID0gbmV3IFdlYlNvY2tldChgJHtwcm90b2NvbH06Ly8ke2hvc3RBbmRQYXRofWAsICd2aXRlLWhtcicpXG4gIGxldCBpc09wZW5lZCA9IGZhbHNlXG5cbiAgc29ja2V0LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgJ29wZW4nLFxuICAgICgpID0+IHtcbiAgICAgIGlzT3BlbmVkID0gdHJ1ZVxuICAgIH0sXG4gICAgeyBvbmNlOiB0cnVlIH0sXG4gIClcblxuICAvLyBMaXN0ZW4gZm9yIG1lc3NhZ2VzXG4gIHNvY2tldC5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgYXN5bmMgKHsgZGF0YSB9KSA9PiB7XG4gICAgaGFuZGxlTWVzc2FnZShKU09OLnBhcnNlKGRhdGEpKVxuICB9KVxuXG4gIC8vIHBpbmcgc2VydmVyXG4gIHNvY2tldC5hZGRFdmVudExpc3RlbmVyKCdjbG9zZScsIGFzeW5jICh7IHdhc0NsZWFuIH0pID0+IHtcbiAgICBpZiAod2FzQ2xlYW4pIHJldHVyblxuXG4gICAgaWYgKCFpc09wZW5lZCAmJiBvbkNsb3NlV2l0aG91dE9wZW4pIHtcbiAgICAgIG9uQ2xvc2VXaXRob3V0T3BlbigpXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBjb25zb2xlLmxvZyhgW3ZpdGVdIHNlcnZlciBjb25uZWN0aW9uIGxvc3QuIHBvbGxpbmcgZm9yIHJlc3RhcnQuLi5gKVxuICAgIGF3YWl0IHdhaXRGb3JTdWNjZXNzZnVsUGluZyhwcm90b2NvbCwgaG9zdEFuZFBhdGgpXG4gICAgbG9jYXRpb24ucmVsb2FkKClcbiAgfSlcblxuICByZXR1cm4gc29ja2V0XG59XG5cbmZ1bmN0aW9uIHdhcm5GYWlsZWRGZXRjaChlcnI6IEVycm9yLCBwYXRoOiBzdHJpbmcgfCBzdHJpbmdbXSkge1xuICBpZiAoIWVyci5tZXNzYWdlLm1hdGNoKCdmZXRjaCcpKSB7XG4gICAgY29uc29sZS5lcnJvcihlcnIpXG4gIH1cbiAgY29uc29sZS5lcnJvcihcbiAgICBgW2htcl0gRmFpbGVkIHRvIHJlbG9hZCAke3BhdGh9LiBgICtcbiAgICAgIGBUaGlzIGNvdWxkIGJlIGR1ZSB0byBzeW50YXggZXJyb3JzIG9yIGltcG9ydGluZyBub24tZXhpc3RlbnQgYCArXG4gICAgICBgbW9kdWxlcy4gKHNlZSBlcnJvcnMgYWJvdmUpYCxcbiAgKVxufVxuXG5mdW5jdGlvbiBjbGVhblVybChwYXRobmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgY29uc3QgdXJsID0gbmV3IFVSTChwYXRobmFtZSwgbG9jYXRpb24udG9TdHJpbmcoKSlcbiAgdXJsLnNlYXJjaFBhcmFtcy5kZWxldGUoJ2RpcmVjdCcpXG4gIHJldHVybiB1cmwucGF0aG5hbWUgKyB1cmwuc2VhcmNoXG59XG5cbmxldCBpc0ZpcnN0VXBkYXRlID0gdHJ1ZVxuY29uc3Qgb3V0ZGF0ZWRMaW5rVGFncyA9IG5ldyBXZWFrU2V0PEhUTUxMaW5rRWxlbWVudD4oKVxuXG5hc3luYyBmdW5jdGlvbiBoYW5kbGVNZXNzYWdlKHBheWxvYWQ6IEhNUlBheWxvYWQpIHtcbiAgc3dpdGNoIChwYXlsb2FkLnR5cGUpIHtcbiAgICBjYXNlICdjb25uZWN0ZWQnOlxuICAgICAgY29uc29sZS5kZWJ1ZyhgW3ZpdGVdIGNvbm5lY3RlZC5gKVxuICAgICAgc2VuZE1lc3NhZ2VCdWZmZXIoKVxuICAgICAgLy8gcHJveHkobmdpbngsIGRvY2tlcikgaG1yIHdzIG1heWJlIGNhdXNlZCB0aW1lb3V0LFxuICAgICAgLy8gc28gc2VuZCBwaW5nIHBhY2thZ2UgbGV0IHdzIGtlZXAgYWxpdmUuXG4gICAgICBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgIGlmIChzb2NrZXQucmVhZHlTdGF0ZSA9PT0gc29ja2V0Lk9QRU4pIHtcbiAgICAgICAgICBzb2NrZXQuc2VuZCgne1widHlwZVwiOlwicGluZ1wifScpXG4gICAgICAgIH1cbiAgICAgIH0sIF9fSE1SX1RJTUVPVVRfXylcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAndXBkYXRlJzpcbiAgICAgIG5vdGlmeUxpc3RlbmVycygndml0ZTpiZWZvcmVVcGRhdGUnLCBwYXlsb2FkKVxuICAgICAgLy8gaWYgdGhpcyBpcyB0aGUgZmlyc3QgdXBkYXRlIGFuZCB0aGVyZSdzIGFscmVhZHkgYW4gZXJyb3Igb3ZlcmxheSwgaXRcbiAgICAgIC8vIG1lYW5zIHRoZSBwYWdlIG9wZW5lZCB3aXRoIGV4aXN0aW5nIHNlcnZlciBjb21waWxlIGVycm9yIGFuZCB0aGUgd2hvbGVcbiAgICAgIC8vIG1vZHVsZSBzY3JpcHQgZmFpbGVkIHRvIGxvYWQgKHNpbmNlIG9uZSBvZiB0aGUgbmVzdGVkIGltcG9ydHMgaXMgNTAwKS5cbiAgICAgIC8vIGluIHRoaXMgY2FzZSBhIG5vcm1hbCB1cGRhdGUgd29uJ3Qgd29yayBhbmQgYSBmdWxsIHJlbG9hZCBpcyBuZWVkZWQuXG4gICAgICBpZiAoaXNGaXJzdFVwZGF0ZSAmJiBoYXNFcnJvck92ZXJsYXkoKSkge1xuICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKClcbiAgICAgICAgcmV0dXJuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjbGVhckVycm9yT3ZlcmxheSgpXG4gICAgICAgIGlzRmlyc3RVcGRhdGUgPSBmYWxzZVxuICAgICAgfVxuICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgIHBheWxvYWQudXBkYXRlcy5tYXAoYXN5bmMgKHVwZGF0ZSk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgICAgICAgIGlmICh1cGRhdGUudHlwZSA9PT0gJ2pzLXVwZGF0ZScpIHtcbiAgICAgICAgICAgIHJldHVybiBxdWV1ZVVwZGF0ZShmZXRjaFVwZGF0ZSh1cGRhdGUpKVxuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIGNzcy11cGRhdGVcbiAgICAgICAgICAvLyB0aGlzIGlzIG9ubHkgc2VudCB3aGVuIGEgY3NzIGZpbGUgcmVmZXJlbmNlZCB3aXRoIDxsaW5rPiBpcyB1cGRhdGVkXG4gICAgICAgICAgY29uc3QgeyBwYXRoLCB0aW1lc3RhbXAgfSA9IHVwZGF0ZVxuICAgICAgICAgIGNvbnN0IHNlYXJjaFVybCA9IGNsZWFuVXJsKHBhdGgpXG4gICAgICAgICAgLy8gY2FuJ3QgdXNlIHF1ZXJ5U2VsZWN0b3Igd2l0aCBgW2hyZWYqPV1gIGhlcmUgc2luY2UgdGhlIGxpbmsgbWF5IGJlXG4gICAgICAgICAgLy8gdXNpbmcgcmVsYXRpdmUgcGF0aHMgc28gd2UgbmVlZCB0byB1c2UgbGluay5ocmVmIHRvIGdyYWIgdGhlIGZ1bGxcbiAgICAgICAgICAvLyBVUkwgZm9yIHRoZSBpbmNsdWRlIGNoZWNrLlxuICAgICAgICAgIGNvbnN0IGVsID0gQXJyYXkuZnJvbShcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTExpbmtFbGVtZW50PignbGluaycpLFxuICAgICAgICAgICkuZmluZChcbiAgICAgICAgICAgIChlKSA9PlxuICAgICAgICAgICAgICAhb3V0ZGF0ZWRMaW5rVGFncy5oYXMoZSkgJiYgY2xlYW5VcmwoZS5ocmVmKS5pbmNsdWRlcyhzZWFyY2hVcmwpLFxuICAgICAgICAgIClcblxuICAgICAgICAgIGlmICghZWwpIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnN0IG5ld1BhdGggPSBgJHtiYXNlfSR7c2VhcmNoVXJsLnNsaWNlKDEpfSR7XG4gICAgICAgICAgICBzZWFyY2hVcmwuaW5jbHVkZXMoJz8nKSA/ICcmJyA6ICc/J1xuICAgICAgICAgIH10PSR7dGltZXN0YW1wfWBcblxuICAgICAgICAgIC8vIHJhdGhlciB0aGFuIHN3YXBwaW5nIHRoZSBocmVmIG9uIHRoZSBleGlzdGluZyB0YWcsIHdlIHdpbGxcbiAgICAgICAgICAvLyBjcmVhdGUgYSBuZXcgbGluayB0YWcuIE9uY2UgdGhlIG5ldyBzdHlsZXNoZWV0IGhhcyBsb2FkZWQgd2VcbiAgICAgICAgICAvLyB3aWxsIHJlbW92ZSB0aGUgZXhpc3RpbmcgbGluayB0YWcuIFRoaXMgcmVtb3ZlcyBhIEZsYXNoIE9mXG4gICAgICAgICAgLy8gVW5zdHlsZWQgQ29udGVudCB0aGF0IGNhbiBvY2N1ciB3aGVuIHN3YXBwaW5nIG91dCB0aGUgdGFnIGhyZWZcbiAgICAgICAgICAvLyBkaXJlY3RseSwgYXMgdGhlIG5ldyBzdHlsZXNoZWV0IGhhcyBub3QgeWV0IGJlZW4gbG9hZGVkLlxuICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgbmV3TGlua1RhZyA9IGVsLmNsb25lTm9kZSgpIGFzIEhUTUxMaW5rRWxlbWVudFxuICAgICAgICAgICAgbmV3TGlua1RhZy5ocmVmID0gbmV3IFVSTChuZXdQYXRoLCBlbC5ocmVmKS5ocmVmXG4gICAgICAgICAgICBjb25zdCByZW1vdmVPbGRFbCA9ICgpID0+IHtcbiAgICAgICAgICAgICAgZWwucmVtb3ZlKClcbiAgICAgICAgICAgICAgY29uc29sZS5kZWJ1ZyhgW3ZpdGVdIGNzcyBob3QgdXBkYXRlZDogJHtzZWFyY2hVcmx9YClcbiAgICAgICAgICAgICAgcmVzb2x2ZSgpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBuZXdMaW5rVGFnLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCByZW1vdmVPbGRFbClcbiAgICAgICAgICAgIG5ld0xpbmtUYWcuYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLCByZW1vdmVPbGRFbClcbiAgICAgICAgICAgIG91dGRhdGVkTGlua1RhZ3MuYWRkKGVsKVxuICAgICAgICAgICAgZWwuYWZ0ZXIobmV3TGlua1RhZylcbiAgICAgICAgICB9KVxuICAgICAgICB9KSxcbiAgICAgIClcbiAgICAgIG5vdGlmeUxpc3RlbmVycygndml0ZTphZnRlclVwZGF0ZScsIHBheWxvYWQpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2N1c3RvbSc6IHtcbiAgICAgIG5vdGlmeUxpc3RlbmVycyhwYXlsb2FkLmV2ZW50LCBwYXlsb2FkLmRhdGEpXG4gICAgICBicmVha1xuICAgIH1cbiAgICBjYXNlICdmdWxsLXJlbG9hZCc6XG4gICAgICBub3RpZnlMaXN0ZW5lcnMoJ3ZpdGU6YmVmb3JlRnVsbFJlbG9hZCcsIHBheWxvYWQpXG4gICAgICBpZiAocGF5bG9hZC5wYXRoICYmIHBheWxvYWQucGF0aC5lbmRzV2l0aCgnLmh0bWwnKSkge1xuICAgICAgICAvLyBpZiBodG1sIGZpbGUgaXMgZWRpdGVkLCBvbmx5IHJlbG9hZCB0aGUgcGFnZSBpZiB0aGUgYnJvd3NlciBpc1xuICAgICAgICAvLyBjdXJyZW50bHkgb24gdGhhdCBwYWdlLlxuICAgICAgICBjb25zdCBwYWdlUGF0aCA9IGRlY29kZVVSSShsb2NhdGlvbi5wYXRobmFtZSlcbiAgICAgICAgY29uc3QgcGF5bG9hZFBhdGggPSBiYXNlICsgcGF5bG9hZC5wYXRoLnNsaWNlKDEpXG4gICAgICAgIGlmIChcbiAgICAgICAgICBwYWdlUGF0aCA9PT0gcGF5bG9hZFBhdGggfHxcbiAgICAgICAgICBwYXlsb2FkLnBhdGggPT09ICcvaW5kZXguaHRtbCcgfHxcbiAgICAgICAgICAocGFnZVBhdGguZW5kc1dpdGgoJy8nKSAmJiBwYWdlUGF0aCArICdpbmRleC5odG1sJyA9PT0gcGF5bG9hZFBhdGgpXG4gICAgICAgICkge1xuICAgICAgICAgIGxvY2F0aW9uLnJlbG9hZCgpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsb2NhdGlvbi5yZWxvYWQoKVxuICAgICAgfVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdwcnVuZSc6XG4gICAgICBub3RpZnlMaXN0ZW5lcnMoJ3ZpdGU6YmVmb3JlUHJ1bmUnLCBwYXlsb2FkKVxuICAgICAgLy8gQWZ0ZXIgYW4gSE1SIHVwZGF0ZSwgc29tZSBtb2R1bGVzIGFyZSBubyBsb25nZXIgaW1wb3J0ZWQgb24gdGhlIHBhZ2VcbiAgICAgIC8vIGJ1dCB0aGV5IG1heSBoYXZlIGxlZnQgYmVoaW5kIHNpZGUgZWZmZWN0cyB0aGF0IG5lZWQgdG8gYmUgY2xlYW5lZCB1cFxuICAgICAgLy8gKC5lLmcgc3R5bGUgaW5qZWN0aW9ucylcbiAgICAgIC8vIFRPRE8gVHJpZ2dlciB0aGVpciBkaXNwb3NlIGNhbGxiYWNrcy5cbiAgICAgIHBheWxvYWQucGF0aHMuZm9yRWFjaCgocGF0aCkgPT4ge1xuICAgICAgICBjb25zdCBmbiA9IHBydW5lTWFwLmdldChwYXRoKVxuICAgICAgICBpZiAoZm4pIHtcbiAgICAgICAgICBmbihkYXRhTWFwLmdldChwYXRoKSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnZXJyb3InOiB7XG4gICAgICBub3RpZnlMaXN0ZW5lcnMoJ3ZpdGU6ZXJyb3InLCBwYXlsb2FkKVxuICAgICAgY29uc3QgZXJyID0gcGF5bG9hZC5lcnJcbiAgICAgIGlmIChlbmFibGVPdmVybGF5KSB7XG4gICAgICAgIGNyZWF0ZUVycm9yT3ZlcmxheShlcnIpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKFxuICAgICAgICAgIGBbdml0ZV0gSW50ZXJuYWwgU2VydmVyIEVycm9yXFxuJHtlcnIubWVzc2FnZX1cXG4ke2Vyci5zdGFja31gLFxuICAgICAgICApXG4gICAgICB9XG4gICAgICBicmVha1xuICAgIH1cbiAgICBkZWZhdWx0OiB7XG4gICAgICBjb25zdCBjaGVjazogbmV2ZXIgPSBwYXlsb2FkXG4gICAgICByZXR1cm4gY2hlY2tcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gbm90aWZ5TGlzdGVuZXJzPFQgZXh0ZW5kcyBzdHJpbmc+KFxuICBldmVudDogVCxcbiAgZGF0YTogSW5mZXJDdXN0b21FdmVudFBheWxvYWQ8VD4sXG4pOiB2b2lkXG5mdW5jdGlvbiBub3RpZnlMaXN0ZW5lcnMoZXZlbnQ6IHN0cmluZywgZGF0YTogYW55KTogdm9pZCB7XG4gIGNvbnN0IGNicyA9IGN1c3RvbUxpc3RlbmVyc01hcC5nZXQoZXZlbnQpXG4gIGlmIChjYnMpIHtcbiAgICBjYnMuZm9yRWFjaCgoY2IpID0+IGNiKGRhdGEpKVxuICB9XG59XG5cbmNvbnN0IGVuYWJsZU92ZXJsYXkgPSBfX0hNUl9FTkFCTEVfT1ZFUkxBWV9fXG5cbmZ1bmN0aW9uIGNyZWF0ZUVycm9yT3ZlcmxheShlcnI6IEVycm9yUGF5bG9hZFsnZXJyJ10pIHtcbiAgaWYgKCFlbmFibGVPdmVybGF5KSByZXR1cm5cbiAgY2xlYXJFcnJvck92ZXJsYXkoKVxuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKG5ldyBFcnJvck92ZXJsYXkoZXJyKSlcbn1cblxuZnVuY3Rpb24gY2xlYXJFcnJvck92ZXJsYXkoKSB7XG4gIGRvY3VtZW50XG4gICAgLnF1ZXJ5U2VsZWN0b3JBbGwob3ZlcmxheUlkKVxuICAgIC5mb3JFYWNoKChuKSA9PiAobiBhcyBFcnJvck92ZXJsYXkpLmNsb3NlKCkpXG59XG5cbmZ1bmN0aW9uIGhhc0Vycm9yT3ZlcmxheSgpIHtcbiAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwob3ZlcmxheUlkKS5sZW5ndGhcbn1cblxubGV0IHBlbmRpbmcgPSBmYWxzZVxubGV0IHF1ZXVlZDogUHJvbWlzZTwoKCkgPT4gdm9pZCkgfCB1bmRlZmluZWQ+W10gPSBbXVxuXG4vKipcbiAqIGJ1ZmZlciBtdWx0aXBsZSBob3QgdXBkYXRlcyB0cmlnZ2VyZWQgYnkgdGhlIHNhbWUgc3JjIGNoYW5nZVxuICogc28gdGhhdCB0aGV5IGFyZSBpbnZva2VkIGluIHRoZSBzYW1lIG9yZGVyIHRoZXkgd2VyZSBzZW50LlxuICogKG90aGVyd2lzZSB0aGUgb3JkZXIgbWF5IGJlIGluY29uc2lzdGVudCBiZWNhdXNlIG9mIHRoZSBodHRwIHJlcXVlc3Qgcm91bmQgdHJpcClcbiAqL1xuYXN5bmMgZnVuY3Rpb24gcXVldWVVcGRhdGUocDogUHJvbWlzZTwoKCkgPT4gdm9pZCkgfCB1bmRlZmluZWQ+KSB7XG4gIHF1ZXVlZC5wdXNoKHApXG4gIGlmICghcGVuZGluZykge1xuICAgIHBlbmRpbmcgPSB0cnVlXG4gICAgYXdhaXQgUHJvbWlzZS5yZXNvbHZlKClcbiAgICBwZW5kaW5nID0gZmFsc2VcbiAgICBjb25zdCBsb2FkaW5nID0gWy4uLnF1ZXVlZF1cbiAgICBxdWV1ZWQgPSBbXVxuICAgIDsoYXdhaXQgUHJvbWlzZS5hbGwobG9hZGluZykpLmZvckVhY2goKGZuKSA9PiBmbiAmJiBmbigpKVxuICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHdhaXRGb3JTdWNjZXNzZnVsUGluZyhcbiAgc29ja2V0UHJvdG9jb2w6IHN0cmluZyxcbiAgaG9zdEFuZFBhdGg6IHN0cmluZyxcbiAgbXMgPSAxMDAwLFxuKSB7XG4gIGNvbnN0IHBpbmdIb3N0UHJvdG9jb2wgPSBzb2NrZXRQcm90b2NvbCA9PT0gJ3dzcycgPyAnaHR0cHMnIDogJ2h0dHAnXG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnN0YW50LWNvbmRpdGlvblxuICB3aGlsZSAodHJ1ZSkge1xuICAgIHRyeSB7XG4gICAgICAvLyBBIGZldGNoIG9uIGEgd2Vic29ja2V0IFVSTCB3aWxsIHJldHVybiBhIHN1Y2Nlc3NmdWwgcHJvbWlzZSB3aXRoIHN0YXR1cyA0MDAsXG4gICAgICAvLyBidXQgd2lsbCByZWplY3QgYSBuZXR3b3JraW5nIGVycm9yLlxuICAgICAgLy8gV2hlbiBydW5uaW5nIG9uIG1pZGRsZXdhcmUgbW9kZSwgaXQgcmV0dXJucyBzdGF0dXMgNDI2LCBhbmQgYW4gY29ycyBlcnJvciBoYXBwZW5zIGlmIG1vZGUgaXMgbm90IG5vLWNvcnNcbiAgICAgIGF3YWl0IGZldGNoKGAke3BpbmdIb3N0UHJvdG9jb2x9Oi8vJHtob3N0QW5kUGF0aH1gLCB7XG4gICAgICAgIG1vZGU6ICduby1jb3JzJyxcbiAgICAgIH0pXG4gICAgICBicmVha1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIC8vIHdhaXQgbXMgYmVmb3JlIGF0dGVtcHRpbmcgdG8gcGluZyBhZ2FpblxuICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgbXMpKVxuICAgIH1cbiAgfVxufVxuXG4vLyBodHRwczovL3dpY2cuZ2l0aHViLmlvL2NvbnN0cnVjdC1zdHlsZXNoZWV0c1xuY29uc3Qgc3VwcG9ydHNDb25zdHJ1Y3RlZFNoZWV0ID0gKCgpID0+IHtcbiAgLy8gVE9ETzogcmUtZW5hYmxlIHRoaXMgdHJ5IGJsb2NrIG9uY2UgQ2hyb21lIGZpeGVzIHRoZSBwZXJmb3JtYW5jZSBvZlxuICAvLyBydWxlIGluc2VydGlvbiBpbiByZWFsbHkgYmlnIHN0eWxlc2hlZXRzXG4gIC8vIHRyeSB7XG4gIC8vICAgbmV3IENTU1N0eWxlU2hlZXQoKVxuICAvLyAgIHJldHVybiB0cnVlXG4gIC8vIH0gY2F0Y2ggKGUpIHt9XG4gIHJldHVybiBmYWxzZVxufSkoKVxuXG5jb25zdCBzaGVldHNNYXAgPSBuZXcgTWFwPFxuICBzdHJpbmcsXG4gIEhUTUxTdHlsZUVsZW1lbnQgfCBDU1NTdHlsZVNoZWV0IHwgdW5kZWZpbmVkXG4+KClcbi8vIGFsbCBjc3MgaW1wb3J0cyBzaG91bGQgYmUgaW5zZXJ0ZWQgYXQgdGhlIHNhbWUgcG9zaXRpb25cbi8vIGJlY2F1c2UgYWZ0ZXIgYnVpbGQgaXQgd2lsbCBiZSBhIHNpbmdsZSBjc3MgZmlsZVxubGV0IGxhc3RJbnNlcnRlZFN0eWxlOiBIVE1MU3R5bGVFbGVtZW50IHwgdW5kZWZpbmVkXG5cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVTdHlsZShpZDogc3RyaW5nLCBjb250ZW50OiBzdHJpbmcpOiB2b2lkIHtcbiAgbGV0IHN0eWxlID0gc2hlZXRzTWFwLmdldChpZClcbiAgaWYgKHN1cHBvcnRzQ29uc3RydWN0ZWRTaGVldCAmJiAhY29udGVudC5pbmNsdWRlcygnQGltcG9ydCcpKSB7XG4gICAgaWYgKHN0eWxlICYmICEoc3R5bGUgaW5zdGFuY2VvZiBDU1NTdHlsZVNoZWV0KSkge1xuICAgICAgcmVtb3ZlU3R5bGUoaWQpXG4gICAgICBzdHlsZSA9IHVuZGVmaW5lZFxuICAgIH1cblxuICAgIGlmICghc3R5bGUpIHtcbiAgICAgIHN0eWxlID0gbmV3IENTU1N0eWxlU2hlZXQoKVxuICAgICAgc3R5bGUucmVwbGFjZVN5bmMoY29udGVudClcbiAgICAgIGRvY3VtZW50LmFkb3B0ZWRTdHlsZVNoZWV0cyA9IFsuLi5kb2N1bWVudC5hZG9wdGVkU3R5bGVTaGVldHMsIHN0eWxlXVxuICAgIH0gZWxzZSB7XG4gICAgICBzdHlsZS5yZXBsYWNlU3luYyhjb250ZW50KVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoc3R5bGUgJiYgIShzdHlsZSBpbnN0YW5jZW9mIEhUTUxTdHlsZUVsZW1lbnQpKSB7XG4gICAgICByZW1vdmVTdHlsZShpZClcbiAgICAgIHN0eWxlID0gdW5kZWZpbmVkXG4gICAgfVxuXG4gICAgaWYgKCFzdHlsZSkge1xuICAgICAgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpXG4gICAgICBzdHlsZS5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAndGV4dC9jc3MnKVxuICAgICAgc3R5bGUuc2V0QXR0cmlidXRlKCdkYXRhLXZpdGUtZGV2LWlkJywgaWQpXG4gICAgICBzdHlsZS50ZXh0Q29udGVudCA9IGNvbnRlbnRcblxuICAgICAgaWYgKCFsYXN0SW5zZXJ0ZWRTdHlsZSkge1xuICAgICAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHN0eWxlKVxuXG4gICAgICAgIC8vIHJlc2V0IGxhc3RJbnNlcnRlZFN0eWxlIGFmdGVyIGFzeW5jXG4gICAgICAgIC8vIGJlY2F1c2UgZHluYW1pY2FsbHkgaW1wb3J0ZWQgY3NzIHdpbGwgYmUgc3BsaXR0ZWQgaW50byBhIGRpZmZlcmVudCBmaWxlXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIGxhc3RJbnNlcnRlZFN0eWxlID0gdW5kZWZpbmVkXG4gICAgICAgIH0sIDApXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsYXN0SW5zZXJ0ZWRTdHlsZS5pbnNlcnRBZGphY2VudEVsZW1lbnQoJ2FmdGVyZW5kJywgc3R5bGUpXG4gICAgICB9XG4gICAgICBsYXN0SW5zZXJ0ZWRTdHlsZSA9IHN0eWxlXG4gICAgfSBlbHNlIHtcbiAgICAgIHN0eWxlLnRleHRDb250ZW50ID0gY29udGVudFxuICAgIH1cbiAgfVxuICBzaGVldHNNYXAuc2V0KGlkLCBzdHlsZSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZVN0eWxlKGlkOiBzdHJpbmcpOiB2b2lkIHtcbiAgY29uc3Qgc3R5bGUgPSBzaGVldHNNYXAuZ2V0KGlkKVxuICBpZiAoc3R5bGUpIHtcbiAgICBpZiAoc3R5bGUgaW5zdGFuY2VvZiBDU1NTdHlsZVNoZWV0KSB7XG4gICAgICBkb2N1bWVudC5hZG9wdGVkU3R5bGVTaGVldHMgPSBkb2N1bWVudC5hZG9wdGVkU3R5bGVTaGVldHMuZmlsdGVyKFxuICAgICAgICAoczogQ1NTU3R5bGVTaGVldCkgPT4gcyAhPT0gc3R5bGUsXG4gICAgICApXG4gICAgfSBlbHNlIHtcbiAgICAgIGRvY3VtZW50LmhlYWQucmVtb3ZlQ2hpbGQoc3R5bGUpXG4gICAgfVxuICAgIHNoZWV0c01hcC5kZWxldGUoaWQpXG4gIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gZmV0Y2hVcGRhdGUoe1xuICBwYXRoLFxuICBhY2NlcHRlZFBhdGgsXG4gIHRpbWVzdGFtcCxcbiAgZXhwbGljaXRJbXBvcnRSZXF1aXJlZCxcbn06IFVwZGF0ZSkge1xuICBjb25zdCBtb2QgPSBob3RNb2R1bGVzTWFwLmdldChwYXRoKVxuICBpZiAoIW1vZCkge1xuICAgIC8vIEluIGEgY29kZS1zcGxpdHRpbmcgcHJvamVjdCxcbiAgICAvLyBpdCBpcyBjb21tb24gdGhhdCB0aGUgaG90LXVwZGF0aW5nIG1vZHVsZSBpcyBub3QgbG9hZGVkIHlldC5cbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vdml0ZWpzL3ZpdGUvaXNzdWVzLzcyMVxuICAgIHJldHVyblxuICB9XG5cbiAgbGV0IGZldGNoZWRNb2R1bGU6IE1vZHVsZU5hbWVzcGFjZSB8IHVuZGVmaW5lZFxuICBjb25zdCBpc1NlbGZVcGRhdGUgPSBwYXRoID09PSBhY2NlcHRlZFBhdGhcblxuICAvLyBkZXRlcm1pbmUgdGhlIHF1YWxpZmllZCBjYWxsYmFja3MgYmVmb3JlIHdlIHJlLWltcG9ydCB0aGUgbW9kdWxlc1xuICBjb25zdCBxdWFsaWZpZWRDYWxsYmFja3MgPSBtb2QuY2FsbGJhY2tzLmZpbHRlcigoeyBkZXBzIH0pID0+XG4gICAgZGVwcy5pbmNsdWRlcyhhY2NlcHRlZFBhdGgpLFxuICApXG5cbiAgaWYgKGlzU2VsZlVwZGF0ZSB8fCBxdWFsaWZpZWRDYWxsYmFja3MubGVuZ3RoID4gMCkge1xuICAgIGNvbnN0IGRpc3Bvc2VyID0gZGlzcG9zZU1hcC5nZXQoYWNjZXB0ZWRQYXRoKVxuICAgIGlmIChkaXNwb3NlcikgYXdhaXQgZGlzcG9zZXIoZGF0YU1hcC5nZXQoYWNjZXB0ZWRQYXRoKSlcbiAgICBjb25zdCBbYWNjZXB0ZWRQYXRoV2l0aG91dFF1ZXJ5LCBxdWVyeV0gPSBhY2NlcHRlZFBhdGguc3BsaXQoYD9gKVxuICAgIHRyeSB7XG4gICAgICBmZXRjaGVkTW9kdWxlID0gYXdhaXQgaW1wb3J0KFxuICAgICAgICAvKiBAdml0ZS1pZ25vcmUgKi9cbiAgICAgICAgYmFzZSArXG4gICAgICAgICAgYWNjZXB0ZWRQYXRoV2l0aG91dFF1ZXJ5LnNsaWNlKDEpICtcbiAgICAgICAgICBgPyR7ZXhwbGljaXRJbXBvcnRSZXF1aXJlZCA/ICdpbXBvcnQmJyA6ICcnfXQ9JHt0aW1lc3RhbXB9JHtcbiAgICAgICAgICAgIHF1ZXJ5ID8gYCYke3F1ZXJ5fWAgOiAnJ1xuICAgICAgICAgIH1gXG4gICAgICApXG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgd2FybkZhaWxlZEZldGNoKGUsIGFjY2VwdGVkUGF0aClcbiAgICB9XG4gIH1cblxuICByZXR1cm4gKCkgPT4ge1xuICAgIGZvciAoY29uc3QgeyBkZXBzLCBmbiB9IG9mIHF1YWxpZmllZENhbGxiYWNrcykge1xuICAgICAgZm4oZGVwcy5tYXAoKGRlcCkgPT4gKGRlcCA9PT0gYWNjZXB0ZWRQYXRoID8gZmV0Y2hlZE1vZHVsZSA6IHVuZGVmaW5lZCkpKVxuICAgIH1cbiAgICBjb25zdCBsb2dnZWRQYXRoID0gaXNTZWxmVXBkYXRlID8gcGF0aCA6IGAke2FjY2VwdGVkUGF0aH0gdmlhICR7cGF0aH1gXG4gICAgY29uc29sZS5kZWJ1ZyhgW3ZpdGVdIGhvdCB1cGRhdGVkOiAke2xvZ2dlZFBhdGh9YClcbiAgfVxufVxuXG5mdW5jdGlvbiBzZW5kTWVzc2FnZUJ1ZmZlcigpIHtcbiAgaWYgKHNvY2tldC5yZWFkeVN0YXRlID09PSAxKSB7XG4gICAgbWVzc2FnZUJ1ZmZlci5mb3JFYWNoKChtc2cpID0+IHNvY2tldC5zZW5kKG1zZykpXG4gICAgbWVzc2FnZUJ1ZmZlci5sZW5ndGggPSAwXG4gIH1cbn1cblxuaW50ZXJmYWNlIEhvdE1vZHVsZSB7XG4gIGlkOiBzdHJpbmdcbiAgY2FsbGJhY2tzOiBIb3RDYWxsYmFja1tdXG59XG5cbmludGVyZmFjZSBIb3RDYWxsYmFjayB7XG4gIC8vIHRoZSBkZXBlbmRlbmNpZXMgbXVzdCBiZSBmZXRjaGFibGUgcGF0aHNcbiAgZGVwczogc3RyaW5nW11cbiAgZm46IChtb2R1bGVzOiBBcnJheTxNb2R1bGVOYW1lc3BhY2UgfCB1bmRlZmluZWQ+KSA9PiB2b2lkXG59XG5cbnR5cGUgQ3VzdG9tTGlzdGVuZXJzTWFwID0gTWFwPHN0cmluZywgKChkYXRhOiBhbnkpID0+IHZvaWQpW10+XG5cbmNvbnN0IGhvdE1vZHVsZXNNYXAgPSBuZXcgTWFwPHN0cmluZywgSG90TW9kdWxlPigpXG5jb25zdCBkaXNwb3NlTWFwID0gbmV3IE1hcDxzdHJpbmcsIChkYXRhOiBhbnkpID0+IHZvaWQgfCBQcm9taXNlPHZvaWQ+PigpXG5jb25zdCBwcnVuZU1hcCA9IG5ldyBNYXA8c3RyaW5nLCAoZGF0YTogYW55KSA9PiB2b2lkIHwgUHJvbWlzZTx2b2lkPj4oKVxuY29uc3QgZGF0YU1hcCA9IG5ldyBNYXA8c3RyaW5nLCBhbnk+KClcbmNvbnN0IGN1c3RvbUxpc3RlbmVyc01hcDogQ3VzdG9tTGlzdGVuZXJzTWFwID0gbmV3IE1hcCgpXG5jb25zdCBjdHhUb0xpc3RlbmVyc01hcCA9IG5ldyBNYXA8c3RyaW5nLCBDdXN0b21MaXN0ZW5lcnNNYXA+KClcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUhvdENvbnRleHQob3duZXJQYXRoOiBzdHJpbmcpOiBWaXRlSG90Q29udGV4dCB7XG4gIGlmICghZGF0YU1hcC5oYXMob3duZXJQYXRoKSkge1xuICAgIGRhdGFNYXAuc2V0KG93bmVyUGF0aCwge30pXG4gIH1cblxuICAvLyB3aGVuIGEgZmlsZSBpcyBob3QgdXBkYXRlZCwgYSBuZXcgY29udGV4dCBpcyBjcmVhdGVkXG4gIC8vIGNsZWFyIGl0cyBzdGFsZSBjYWxsYmFja3NcbiAgY29uc3QgbW9kID0gaG90TW9kdWxlc01hcC5nZXQob3duZXJQYXRoKVxuICBpZiAobW9kKSB7XG4gICAgbW9kLmNhbGxiYWNrcyA9IFtdXG4gIH1cblxuICAvLyBjbGVhciBzdGFsZSBjdXN0b20gZXZlbnQgbGlzdGVuZXJzXG4gIGNvbnN0IHN0YWxlTGlzdGVuZXJzID0gY3R4VG9MaXN0ZW5lcnNNYXAuZ2V0KG93bmVyUGF0aClcbiAgaWYgKHN0YWxlTGlzdGVuZXJzKSB7XG4gICAgZm9yIChjb25zdCBbZXZlbnQsIHN0YWxlRm5zXSBvZiBzdGFsZUxpc3RlbmVycykge1xuICAgICAgY29uc3QgbGlzdGVuZXJzID0gY3VzdG9tTGlzdGVuZXJzTWFwLmdldChldmVudClcbiAgICAgIGlmIChsaXN0ZW5lcnMpIHtcbiAgICAgICAgY3VzdG9tTGlzdGVuZXJzTWFwLnNldChcbiAgICAgICAgICBldmVudCxcbiAgICAgICAgICBsaXN0ZW5lcnMuZmlsdGVyKChsKSA9PiAhc3RhbGVGbnMuaW5jbHVkZXMobCkpLFxuICAgICAgICApXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY29uc3QgbmV3TGlzdGVuZXJzOiBDdXN0b21MaXN0ZW5lcnNNYXAgPSBuZXcgTWFwKClcbiAgY3R4VG9MaXN0ZW5lcnNNYXAuc2V0KG93bmVyUGF0aCwgbmV3TGlzdGVuZXJzKVxuXG4gIGZ1bmN0aW9uIGFjY2VwdERlcHMoZGVwczogc3RyaW5nW10sIGNhbGxiYWNrOiBIb3RDYWxsYmFja1snZm4nXSA9ICgpID0+IHt9KSB7XG4gICAgY29uc3QgbW9kOiBIb3RNb2R1bGUgPSBob3RNb2R1bGVzTWFwLmdldChvd25lclBhdGgpIHx8IHtcbiAgICAgIGlkOiBvd25lclBhdGgsXG4gICAgICBjYWxsYmFja3M6IFtdLFxuICAgIH1cbiAgICBtb2QuY2FsbGJhY2tzLnB1c2goe1xuICAgICAgZGVwcyxcbiAgICAgIGZuOiBjYWxsYmFjayxcbiAgICB9KVxuICAgIGhvdE1vZHVsZXNNYXAuc2V0KG93bmVyUGF0aCwgbW9kKVxuICB9XG5cbiAgY29uc3QgaG90OiBWaXRlSG90Q29udGV4dCA9IHtcbiAgICBnZXQgZGF0YSgpIHtcbiAgICAgIHJldHVybiBkYXRhTWFwLmdldChvd25lclBhdGgpXG4gICAgfSxcblxuICAgIGFjY2VwdChkZXBzPzogYW55LCBjYWxsYmFjaz86IGFueSkge1xuICAgICAgaWYgKHR5cGVvZiBkZXBzID09PSAnZnVuY3Rpb24nIHx8ICFkZXBzKSB7XG4gICAgICAgIC8vIHNlbGYtYWNjZXB0OiBob3QuYWNjZXB0KCgpID0+IHt9KVxuICAgICAgICBhY2NlcHREZXBzKFtvd25lclBhdGhdLCAoW21vZF0pID0+IGRlcHM/Lihtb2QpKVxuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgZGVwcyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgLy8gZXhwbGljaXQgZGVwc1xuICAgICAgICBhY2NlcHREZXBzKFtkZXBzXSwgKFttb2RdKSA9PiBjYWxsYmFjaz8uKG1vZCkpXG4gICAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoZGVwcykpIHtcbiAgICAgICAgYWNjZXB0RGVwcyhkZXBzLCBjYWxsYmFjaylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgaW52YWxpZCBob3QuYWNjZXB0KCkgdXNhZ2UuYClcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gZXhwb3J0IG5hbWVzIChmaXJzdCBhcmcpIGFyZSBpcnJlbGV2YW50IG9uIHRoZSBjbGllbnQgc2lkZSwgdGhleSdyZVxuICAgIC8vIGV4dHJhY3RlZCBpbiB0aGUgc2VydmVyIGZvciBwcm9wYWdhdGlvblxuICAgIGFjY2VwdEV4cG9ydHMoXywgY2FsbGJhY2spIHtcbiAgICAgIGFjY2VwdERlcHMoW293bmVyUGF0aF0sIChbbW9kXSkgPT4gY2FsbGJhY2s/Lihtb2QpKVxuICAgIH0sXG5cbiAgICBkaXNwb3NlKGNiKSB7XG4gICAgICBkaXNwb3NlTWFwLnNldChvd25lclBhdGgsIGNiKVxuICAgIH0sXG5cbiAgICBwcnVuZShjYikge1xuICAgICAgcHJ1bmVNYXAuc2V0KG93bmVyUGF0aCwgY2IpXG4gICAgfSxcblxuICAgIC8vIEtlcHQgZm9yIGJhY2t3YXJkIGNvbXBhdGliaWxpdHkgKCMxMTAzNilcbiAgICAvLyBAdHMtZXhwZWN0LWVycm9yIHVudHlwZWRcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWVtcHR5LWZ1bmN0aW9uXG4gICAgZGVjbGluZSgpIHt9LFxuXG4gICAgLy8gdGVsbCB0aGUgc2VydmVyIHRvIHJlLXBlcmZvcm0gaG1yIHByb3BhZ2F0aW9uIGZyb20gdGhpcyBtb2R1bGUgYXMgcm9vdFxuICAgIGludmFsaWRhdGUobWVzc2FnZSkge1xuICAgICAgbm90aWZ5TGlzdGVuZXJzKCd2aXRlOmludmFsaWRhdGUnLCB7IHBhdGg6IG93bmVyUGF0aCwgbWVzc2FnZSB9KVxuICAgICAgdGhpcy5zZW5kKCd2aXRlOmludmFsaWRhdGUnLCB7IHBhdGg6IG93bmVyUGF0aCwgbWVzc2FnZSB9KVxuICAgICAgY29uc29sZS5kZWJ1ZyhcbiAgICAgICAgYFt2aXRlXSBpbnZhbGlkYXRlICR7b3duZXJQYXRofSR7bWVzc2FnZSA/IGA6ICR7bWVzc2FnZX1gIDogJyd9YCxcbiAgICAgIClcbiAgICB9LFxuXG4gICAgLy8gY3VzdG9tIGV2ZW50c1xuICAgIG9uKGV2ZW50LCBjYikge1xuICAgICAgY29uc3QgYWRkVG9NYXAgPSAobWFwOiBNYXA8c3RyaW5nLCBhbnlbXT4pID0+IHtcbiAgICAgICAgY29uc3QgZXhpc3RpbmcgPSBtYXAuZ2V0KGV2ZW50KSB8fCBbXVxuICAgICAgICBleGlzdGluZy5wdXNoKGNiKVxuICAgICAgICBtYXAuc2V0KGV2ZW50LCBleGlzdGluZylcbiAgICAgIH1cbiAgICAgIGFkZFRvTWFwKGN1c3RvbUxpc3RlbmVyc01hcClcbiAgICAgIGFkZFRvTWFwKG5ld0xpc3RlbmVycylcbiAgICB9LFxuXG4gICAgc2VuZChldmVudCwgZGF0YSkge1xuICAgICAgbWVzc2FnZUJ1ZmZlci5wdXNoKEpTT04uc3RyaW5naWZ5KHsgdHlwZTogJ2N1c3RvbScsIGV2ZW50LCBkYXRhIH0pKVxuICAgICAgc2VuZE1lc3NhZ2VCdWZmZXIoKVxuICAgIH0sXG4gIH1cblxuICByZXR1cm4gaG90XG59XG5cbi8qKlxuICogdXJscyBoZXJlIGFyZSBkeW5hbWljIGltcG9ydCgpIHVybHMgdGhhdCBjb3VsZG4ndCBiZSBzdGF0aWNhbGx5IGFuYWx5emVkXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbmplY3RRdWVyeSh1cmw6IHN0cmluZywgcXVlcnlUb0luamVjdDogc3RyaW5nKTogc3RyaW5nIHtcbiAgLy8gc2tpcCB1cmxzIHRoYXQgd29uJ3QgYmUgaGFuZGxlZCBieSB2aXRlXG4gIGlmICghdXJsLnN0YXJ0c1dpdGgoJy4nKSAmJiAhdXJsLnN0YXJ0c1dpdGgoJy8nKSkge1xuICAgIHJldHVybiB1cmxcbiAgfVxuXG4gIC8vIGNhbid0IHVzZSBwYXRobmFtZSBmcm9tIFVSTCBzaW5jZSBpdCBtYXkgYmUgcmVsYXRpdmUgbGlrZSAuLi9cbiAgY29uc3QgcGF0aG5hbWUgPSB1cmwucmVwbGFjZSgvIy4qJC8sICcnKS5yZXBsYWNlKC9cXD8uKiQvLCAnJylcbiAgY29uc3QgeyBzZWFyY2gsIGhhc2ggfSA9IG5ldyBVUkwodXJsLCAnaHR0cDovL3ZpdGVqcy5kZXYnKVxuXG4gIHJldHVybiBgJHtwYXRobmFtZX0/JHtxdWVyeVRvSW5qZWN0fSR7c2VhcmNoID8gYCZgICsgc2VhcmNoLnNsaWNlKDEpIDogJyd9JHtcbiAgICBoYXNoIHx8ICcnXG4gIH1gXG59XG5cbmV4cG9ydCB7IEVycm9yT3ZlcmxheSB9XG4iXSwibmFtZXMiOlsiYmFzZSJdLCJtYXBwaW5ncyI6Ijs7QUFLQSxNQUFNQSxNQUFJLEdBQUcsUUFBUSxJQUFJLEdBQUcsQ0FBQTtBQUU1QjtBQUNBLE1BQU0sUUFBUSxZQUFZLENBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Q0E0SHpCLENBQUE7QUFFRCxNQUFNLE1BQU0sR0FBRyxnQ0FBZ0MsQ0FBQTtBQUMvQyxNQUFNLFdBQVcsR0FBRywwQ0FBMEMsQ0FBQTtBQUU5RDtBQUNBO0FBQ0EsTUFBTSxFQUFFLFdBQVcsR0FBRyxNQUFBO0NBQXlDLEVBQUUsR0FBRyxVQUFVLENBQUE7QUFDeEUs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