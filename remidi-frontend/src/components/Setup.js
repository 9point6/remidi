import React, { Component } from 'react';

import { initMidi } from '../lib/midi';

import '../styles/Setup.css';

class Setup extends Component {
    render() {
        return (
            <div className="Setup">
                <h1>
                    Setup
                </h1>
                <button
                    onClick={this.setupWebMidi}
                >
                    Setup
                </button>
            </div>
        );
    }

    setupWebMidi() {
        initMidi();
    }
}

export default Setup;
