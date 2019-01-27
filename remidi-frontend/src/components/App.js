import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Setup from './Setup';
import Control from './Control';
import Header from './Header';

import '../styles/App.css';

class App extends Component {
    render() {
        return (
            <div className="App">
                <Header />
                <main>
                    <Switch>
                        <Route exact path='/' render={() => <Redirect to='/setup' />} />
                        <Route exact path="/setup" component={Setup} />
                        <Route exact path="/control" component={Control} />
                    </Switch>
                </main>
            </div>
        );
    }
}

export default App;
