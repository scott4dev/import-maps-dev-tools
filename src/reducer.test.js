import { reducer, initialState } from './reducer';

test('unknow message dont alter state', () => {
    const state = reducer(1, { type: 'unknown' });
    expect(state).toBe(1);
});

test('reset to initial state', () => {
    const state = reducer(1, { type: 'reset' });
    expect(state).toBe(initialState);
});

test('query with no imports', () => {
    const state = reducer(initialState, {
        type: 'query',
        key: 'import-maps',
        content: "{\"imports\": null }"
    });
    expect(state).toEqual(
        {
            sources: ['import-maps'],
            files: {},
        }
    );
})

test('query from initialState', () => {
    const state = reducer(initialState, {
        type: 'query',
        key: 'import-maps',
        content: "{\"imports\": {\"a\" : \"foo.js\"}}"
    });
    expect(state).toEqual({
        sources: ['import-maps'],
        files: {
            'foo.js': {
                url: 'foo.js',
                key: 'a',
                source: 'import-maps',
            }
        },
    });
})

test('query and request', () => {
    let state = reducer(initialState, {
        type: 'query',
        key: 'import-maps',
        content: "{\"imports\": {\"a\" : \"foo.js\"}}"
    });
    const payload = {
        type: 'request',
        event: {
            request: { url: 'foo.js' },
            response: { content: { size: 1 } },
        }
    }
    state = reducer(state, payload);
    expect(state).toEqual({
        sources: ['import-maps'],
        files: {
            'foo.js': {
                url: 'foo.js',
                key: 'a',
                size: 1,
                source: 'import-maps',
            }
        },
    });
})

test('requests are ignored when there is not query before', () => {
    let state = reducer(initialState, {
        type: 'request',
        event: {
            request: { url: 'foo.js' },
            response: { content: { size: 200 } },
        }
    });
    state = reducer(state, {
        type: 'request',
        event: {
            request: { url: 'bar.js' },
            response: { content: { size: 100 } },
        }
    });
    expect(state).toEqual({
        sources: [],
        files: {},
    });
})

test('requests outside imports are excluded', () => {
    let state = reducer(initialState, {
        type: 'query',
        key: 'import-maps',
        content: "{\"imports\": {\"a\" : \"foo.js\"}}"
    });
    state = reducer(state, {
        type: 'request',
        event: {
            request: { url: 'foo.js' },
            response: { content: { size: 200 } },
        }
    });
    state = reducer(state, {
        type: 'request',
        event: {
            request: { url: 'bar.js' },
            response: { content: { size: 100 } },
        }
    });
    expect(state).toEqual({
        sources: ['import-maps'],
        files: {
            'foo.js': {
                source: 'import-maps',
                key: 'a',
                url: 'foo.js',
                size: 200
            },
        },
    });
})