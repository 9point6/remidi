import ApolloClient from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link';
import { withClientState } from 'apollo-link-state';
import { persistCache } from 'apollo-cache-persist';

import defaults from './defaults';
import resolvers from './resolvers';

async function apolloInit() {
    const cache = new InMemoryCache();

    await persistCache({
        cache,
        storage: window.localStorage
    });

    const stateLink = withClientState({
        cache,
        defaults,
        resolvers
    });

    return new ApolloClient({
        cache,
        link: ApolloLink.from([
            stateLink
        ]),
        typeDefs: `
            scalar MidiConnection
        `
    });
}

export const client = apolloInit();
