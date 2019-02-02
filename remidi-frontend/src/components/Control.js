import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { compose, graphql } from 'react-apollo';
import queryString from 'query-string';

import {
    generateScale,
    generateNotes,
    isValidTonic,
    getTonics
} from '../lib/notes';
import Sequencer from './Sequencer';
import {
    getAppStateQuery,
    getAppStateOptions,
    updateAppStateQuery
} from '../graphql';

import '../styles/Control.css';

class Control extends Component {
    render() {
        const query = queryString.parse(this.props.location.search);
        if (!this.props.appState.selectedOutput && !query.debug) {
            return this.notSelected();
        }

        return (
            <div className="Control">
                <h1>
                    Control
                </h1>
                <ul className="sequencer-controls">
                    <li>
                        <button
                            onClick={this.handlePlayStop}
                        >
                            {this.props.appState.playState === 'STOPPED' ? 'Play' : 'Stop'}
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={this.handleContinue}
                            disabled={this.props.appState.playState !== 'STOPPED'}
                        >
                            Continue
                        </button>
                    </li>
                    <li className="spacer-left">
                        <button onClick={this.handleNewSequence}>
                            New
                        </button>
                    </li>
                    <li>
                        <button onClick={this.handleSave}>
                            Save Sequence
                        </button>
                    </li>
                    <li>
                        <button onClick={this.handleLoad}>
                            Load Sequence
                        </button>
                    </li>
                    <li>
                        <button onClick={this.handleRandomSequence}>
                            Random Sequence
                        </button>
                    </li>
                    <li className="key-note control-field">
                        <label
                            className="control-field__label"
                            htmlFor="key"
                        >
                            Key
                        </label>
                        {this.keySelect()}
                    </li>
                    <li className="key-tonic control-field">
                        <label
                            className="control-field__label"
                            htmlFor="key-tonic"
                        >
                            Tonic
                        </label>
                        {this.tonicSelect()}
                    </li>
                    <li className="link-key-sequencer">
                        <input
                            name="link-key-sequencer"
                            type="checkbox"
                            checked={this.props.appState.linkSequencerToKey}
                            onChange={this.handleLinkKeySequencerChange}
                        />
                        <label
                            htmlFor="link-key-sequencer"
                        >
                            Link Sequencer Key
                        </label>

                    </li>
                </ul>
                <div className="additional-controls">
                    <div className="bpm control-field">
                        <label
                            className="control-field__label"
                            htmlFor="bpm"
                        >
                            BPM
                        </label>
                        {<input
                            className="control-field__field"
                            type="text"
                            name="bpm"
                            value={this.props.appState.bpm}
                            onChange={this.handleBpmChange}
                        />}
                    </div>
                    <button
                        onClick={this.handleClock}
                    >
                        {this.props.appState.sendingClock ? 'Stop Clock' : 'Send Clock'}
                    </button>
                    <label>
                        <input
                            type="checkbox"
                            checked={this.props.appState.linkClockToStart}
                            onChange={this.handleLinkBpmChange}
                        />
                        <span>
                            Link Clock to Play/Stop
                        </span>
                    </label>
                </div>
                <Sequencer />
            </div>
        );
    }

    notSelected = () => (
        <div className="Control">
            <h1>
                Control
            </h1>
            <p>
                You have not selected MIDI inputs and outputs.
                {' '}
                <Link to="/setup">
                    Return to setup.
                </Link>
            </p>
        </div>
    );

    keySelect = () => (
        <select
            name="key"
            className="control-field__field"
            onChange={this.handleKeyChange}
        >
            {generateScale('C', 'chromatic').map((note) => (
                <option
                    value={note}
                    selected={note === this.props.appState.key}
                    key={note}
                >
                    {note}
                </option>
            ))}
        </select>
    );

    tonicSelect = () => (
        <select
            name="key-tonic"
            className="control-field__field"
            onChange={this.handleKeyTonicChange}
        >
            {getTonics().map((tonic) => (
                <option
                    value={tonic}
                    selected={tonic === this.props.appState.keyTonic}
                    key={tonic}
                >
                    {tonic}
                </option>
            ))}
        </select>
    );

    handleRefresh = () => {
        if (!this.props.appState.sendingClock) {
            if (this.state && this.state.refreshInterval) {
                clearInterval(this.state.refreshInterval);
            }

            this.setState({
                refreshInterval: setInterval(() => {
                    this.props.updateAppState({});
                }, 50)
            });
        } else {
            if (this.state && this.state.refreshInterval) {
                clearInterval(this.state.refreshInterval);
            }

            this.setState({
                refreshInterval: null
            });
        }
    }

    handlePlayStop = () => {
        const playState = this.props.appState.playState === 'STOPPED' ? 'PLAYING' : 'STOPPED';
        this.props.updateAppState({
            variables: { playState }
        });

        this.handleRefresh();
    }

    handleContinue = () => {
        this.props.updateAppState({
            variables: { playState: 'CONTINUE' }
        });

        this.handleRefresh();
    }

    handleClock = () => {
        const { sendingClock } = this.props.appState;
        this.props.updateAppState({
            variables: {
                sendingClock: !sendingClock
            }
        });

        this.handleRefresh();
    }

    handleBpmChange = (event) => {
        this.props.updateAppState({
            variables: {
                bpm: event.target.value
            }
        });
    }

    handleLinkBpmChange = (event) => {
        this.props.updateAppState({
            variables: {
                linkClockToStart: event.target.checked
            }
        });
    }

    handleSave = () => {
        const output = JSON.stringify(this.props.appState.sequencer);

        prompt('Please copy your pattern JSON from below', output);
    }

    handleLoad = () => {
        const json = prompt('Please paste pattern JSON below');

        try {
            const sequencer = JSON.parse(json);
            this.props.updateAppState({
                variables: {
                    sequencer
                }
            });
        } catch (ex) {
            alert('Could not parse JSON');
        }
    }

    handleNewSequence = () => {
        this.props.updateAppState({
            variables: {
                sequencer: {}
            }
        });
    }

    handleKeyChange = (event) => {
        this.props.updateAppState({
            variables: {
                key: event.target.value
            }
        });
    }

    handleKeyTonicChange = (event) => {
        this.props.updateAppState({
            variables: {
                keyTonic: event.target.value
            }
        });
    }

    handleLinkKeySequencerChange = (event) => {
        this.props.updateAppState({
            variables: {
                linkSequencerToKey: event.target.checked
            }
        });
    }

    handleRandomSequence = () => {
        const currentKeyNotes = generateNotes(
            'F1',
            'F5',
            `${this.props.appState.key}3`,
            this.props.appState.keyTonic
        );

        const noteRegex = /^[a-gA-G][b#]?-?[0-9]$/;
        const startNote = prompt(
            'Enter start note (e.g. C3, f#2, ab2)',
            currentKeyNotes[0].note
        );

        if (!noteRegex.test(startNote)) {
            return alert(`Invalid start note entered: ${startNote}`);
        }

        const endNote = prompt(
            'Enter end note (e.g. C3, f#2, ab2)',
            currentKeyNotes[currentKeyNotes.length - 1].note
        );

        if (!noteRegex.test(endNote)) {
            return alert(`Invalid end note entered: ${endNote}`);
        }

        const notes = generateNotes(
            startNote,
            endNote,
            `${this.props.appState.key}3`,
            this.props.appState.keyTonic
        );

        const arrPatternLength = (new Array(this.props.appState.patternLength)).fill(true);
        const sequencer = arrPatternLength.reduce((memo, item, i) => {
            memo[i] = [notes[Math.floor(Math.random() * notes.length)].note];
            return memo;
        }, {});

        this.props.updateAppState({
            variables: {
                sequencer
            }
        });
    }
}

export default compose(
    graphql(getAppStateQuery, getAppStateOptions),
    graphql(updateAppStateQuery, { name: 'updateAppState' })
)(Control);
