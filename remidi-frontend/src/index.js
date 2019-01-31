import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';

import './styles/index.css';
import App from './components/App';
import { client } from './apollo';
import * as serviceWorker from './serviceWorker';

async function main() {
    ReactDOM.render(
        (
            <BrowserRouter>
                <ApolloProvider client={await client}>
                    <App />
                </ApolloProvider>
            </BrowserRouter>
        ),
        document.getElementById('root')
    );

    serviceWorker.register();
}

main();
