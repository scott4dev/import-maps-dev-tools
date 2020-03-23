export const initialState = {
    sources: [],
    files: {}
}

export const reducer = function(state, message = {}) {
    switch (message.type) {
        case "query":
            const files = Object.assign({}, state.files);
            const { imports } = JSON.parse(message.content);
            imports && Object.keys(imports).forEach(key => {
                files[imports[key]] = Object.assign(
                    {},
                    files[imports[key]], {
                    key,
                    source: message.key,
                    url: imports[key],
                });
            });
            return {
                ...state,
                files,
                sources: state.sources.concat([message.key]),
            }
        case "request":
            if (state.files[message.event.request.url]) {
                state.files[message.event.request.url] = Object.assign(
                    {},
                    state.files[message.event.request.url], {
                    url: message.event.request.url,
                    size: message.event.response.content.size
                })
            }
            return {
                ...state,
            }
        case "reset":
            return initialState;
        default:
            return state;
    }
}