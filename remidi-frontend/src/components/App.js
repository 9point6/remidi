import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Setup from './Setup';
import Play from './Play';
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
                        <Route exact path="/play" component={Play} />
                    </Switch>
                </main>
            </div>
        );
    }
}

export default App;
