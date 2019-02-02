import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { compose, graphql } from 'react-apollo';
import queryString from 'query-string';

import {
    generateScale,
    generateNotes,
    getTonics,
    getOctaveRange
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
                            className="control-button"
                            onClick={this.handlePlayStop}
                        >
                            {this.props.appState.playState === 'STOPPED' ? 'Play' : 'Stop'}
                        </button>
                    </li>
                    <li>
                        <button
                            className="control-button"
                            onClick={this.handleContinue}
                            disabled={this.props.appState.playState !== 'STOPPED'}
                        >
                            Continue
                        </button>
                    </li>
                    <li className="spacer-left">
                        <button
                            className="control-button"
                            onClick={this.handleNewSequence}
                        >
                            New
                        </button>
                    </li>
                    <li>
                        <button
                            className="control-button"
                            onClick={this.handleSave}
                        >
                            Save Sequence
                        </button>
                    </li>
                    <li>
                        <a
                            className="control-button"
                            download="remidi-sequence.json"
                            href={`data:application/octet-stream,${this.getSequenceJson()}`}
                        >
                            Download Sequence
                        </a>
                    </li>
                    <li>
                        <button
                            className="control-button"
                            onClick={this.handleLoad}
                        >
                            Load Sequence
                        </button>
                    </li>
                    <li>
                        <button
                            className="control-button"
                            onClick={this.handleRandomSequence}
                        >
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
                            id="link-key-sequencer"
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
                    <div className="start-note-range control-field">
                        <label
                            className="control-field__label"
                            htmlFor="range-note-start"
                        >
                            start
                        </label>
                        {this.rangeNoteSelect(true)}
                    </div>
                    <div className="start-octave-range control-field">
                        <label
                            className="control-field__label"
                            htmlFor="range-octave-start"
                        >
                            start
                        </label>
                        {this.rangeOctaveSelect(true)}
                    </div>
                    <div className="end-note-range control-field">
                        <label
                            className="control-field__label"
                            htmlFor="range-note-end"
                        >
                            end
                        </label>
                        {this.rangeNoteSelect(false)}
                    </div>
                    <div className="end-octave-range control-field">
                        <label
                            className="control-field__label"
                            htmlFor="range-octave-end"
                        >
                            end
                        </label>
                        {this.rangeOctaveSelect(false)}
                    </div>
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
                            id="bpm"
                            name="bpm"
                            value={this.props.appState.bpm}
                            onChange={this.handleBpmChange}
                        />}
                    </div>
                    <button
                        className="control-button"
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

    rangeNoteSelect = (start = true) => (
        <select
            id={`range-note-${start ? 'start' : 'end'}`}
            name={`range-note-${start ? 'start' : 'end'}`}
            className="control-field__field"
            onChange={(evt) => this.handleRangeChange(start, true, evt)}
            value={this.props.appState[`${start ? 'start' : 'end'}Range`].slice(0, -1)}
        >
            {generateScale('C', 'chromatic').map((note) => (
                <option
                    value={note}
                    key={note}
                >
                    {note}
                </option>
            ))}
        </select>
    );

    rangeOctaveSelect = (start = true) => (
        <select
            id={`range-octave-${start ? 'start' : 'end'}`}
            name={`range-octave-${start ? 'start' : 'end'}`}
            className="control-field__field"
            onChange={(evt) => this.handleRangeChange(start, false, evt)}
            value={this.props.appState[`${start ? 'start' : 'end'}Range`].slice(-1)}
        >
            {getOctaveRange().map((octave) => (
                <option
                    value={octave}
                    key={octave}
                >
                    {octave}
                </option>
            ))}
        </select>
    );

    keySelect = () => (
        <select
            id="key"
            name="key"
            className="control-field__field"
            onChange={this.handleKeyChange}
            value={this.props.appState.key}
        >
            {generateScale('C', 'chromatic').map((note) => (
                <option
                    value={note}
                    key={note}
                >
                    {note}
                </option>
            ))}
        </select>
    );

    tonicSelect = () => (
        <select
            id="key-tonic"
            name="key-tonic"
            className="control-field__field"
            onChange={this.handleKeyTonicChange}
            value={this.props.appState.keyTonic}
        >
            {getTonics().map((tonic) => (
                <option
                    value={tonic}
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

    handleRangeChange = (start, note, { target: { value } }) => {
        const key = `${start ? 'start' : 'end'}Range`
        const oldRange = this.props.appState[key]
        const newNote = note ? value : oldRange.slice(0, -1);
        const newOctave = note ? oldRange.slice(-1) : value;

        this.props.updateAppState({
            variables: {
                [key]: `${newNote}${newOctave}`
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

    getSequenceJson = () => {
        const output = JSON.stringify(this.props.appState.sequencer);

        return output;
    }

    handleSave = () => {
        prompt('Please copy your pattern JSON from below', this.getSequenceJson());
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
            this.props.appState.startRange,
            this.props.appState.endRange,
            `${this.props.appState.key}3`,
            this.props.appState.keyTonic
        );

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
