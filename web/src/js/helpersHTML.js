export function isLocal() {
    return window.location.href.includes('localhost');
}

export async function fetchWithTimeout(resource, options = {}) {
    const { timeout = 8000 } = options;

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    const response = await fetch(resource, {
        ...options,
        signal: controller.signal  
    });
    clearTimeout(id);
    return response;
}

export function cloneObj(obj) {
    return JSON.parse(JSON.stringify(obj));
}

export function clip(text, toaster) {
    navigator.clipboard.writeText(text).then(function() {
        toaster('Copy to clipboard was successful!', 'success');
    }, function(err) {
        toaster('Copy to clipbard failed, bummer!', 'error');
        console.log(err);
    });
}