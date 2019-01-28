import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { compose, graphql } from 'react-apollo';
import {
    getAppStateQuery,
    getAppStateOptions,
    updateAppStateQuery
} from '../graphql';

import '../styles/Control.css';
import { addTypenameToDocument } from 'apollo-utilities';

const NOTES = [
    'C',
    'C#',
    'D',
    'D#',
    'E',
    'F',
    'F#',
    'G',
    'G#',
    'A',
    'A#',
    'B'
];

function generateNotes(start, end) {
    let output = [];
    for (let i = start; i <= end; i++) {
        output = output.concat(NOTES.map((note) => ({
            note: `${note}${i}`,
            blackKey: note.indexOf('#') !== -1
        })));
    }

    return output;
}

class Control extends Component {
    render() {
        if (!this.props.appState.selectedOutput) {
            return this.notSelected();
        }

        return (
            <div className="Control">
                <h1>
                    Control
                </h1>
                <ul className="track-controls">
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
                        <button
                            onClick={this.handleNewSequence}
                        >
                            New
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={this.handleSave}
                        >
                            Dump Sequence to Console
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={this.handleLoad}
                        >
                            Load Sequence
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={this.handleRandomSequence}
                        >
                            Random Sequence
                        </button>
                    </li>
                </ul>
                <label>
                    <span>
                        BPM
                    </span>
                    <input type="text" name="bpm" value={this.props.appState.bpm} onChange={this.handleBpmChange} />
                </label>
                <button
                    onClick={this.handleClock}
                >
                    {this.props.appState.sendingClock ? 'Stop Clock' : 'Send Clock'}
                </button>
                <label>
                    <input type="checkbox" checked={this.props.appState.linkClockToStart} onChange={this.handleLinkBpmChange} />
                    <span>
                        Link Clock to Play/Stop
                    </span>
                </label>
                {this.sequencer()}
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

    sequencer = () => {
        const notes = generateNotes(2, 4);
        const arr16 = (new Array(16)).fill(true);

        return (
            <table className='sequencer'>
                <tbody>
                    <tr>
                        <td className='empty'>{this.props.appState.beat + 1}</td>
                        {arr16.map((_, i) => {
                            const currentBeat = (i === this.props.appState.beat);
                            return (
                                <td key={i} className={currentBeat ? 'beat-indicator current' : 'beat-indicator'}>
                                    {currentBeat ? 'O' : 'X'}
                                </td>
                            );
                        })}
                    </tr>
                    {notes.map((note, i) => (
                        <tr
                            key={i}
                            className={`${note.note} ${note.blackKey ? 'black-note' : 'white-note'} note`}
                        >
                            <td className='note'>
                                <button
                                    onMouseDown={() => this.handleNoteDown(note)}
                                    onMouseUp={() => this.handleNoteUp(note)}
                                >
                                    {note.note}
                                </button>
                            </td>
                            {arr16.map((_, i) => {
                                const currentBeat = (i === this.props.appState.beat);
                                return (
                                    <td key={i} className={currentBeat ? 'sequencer-cell current' : 'sequencer-cell'}>
                                        <input
                                            type='checkbox'
                                            onChange={(event) => this.handleSequencerCell(note, i, event)}
                                            checked={
                                                (this.props.appState.sequencer[i] || [])
                                                    .filter((item) => item === note.note)
                                                    .length !== 0
                                            }
                                        />
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }

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

    handleNoteDown = ({ note }) => {
        const { notes } = this.props.appState;
        this.props.updateAppState({
            variables: {
                notes: {
                    ...notes,
                    [note]: true
                }
            }
        });
    }

    handleNoteUp = ({ note }) => {
        const { notes } = this.props.appState;
        this.props.updateAppState({
            variables: {
                notes: {
                    ...notes,
                    [note]: false
                }
            }
        });
    }

    handleSequencerCell = (note, beat, event) => {
        const { sequencer } = this.props.appState;
        let beatNotes;

        if (event.target.checked) {
            beatNotes = (sequencer[beat] || []).concat(note.note);
        } else {
            beatNotes = (sequencer[beat] || []).filter((item) => item !== note.note);
        }

        this.props.updateAppState({
            variables: {
                sequencer: {
                    ...sequencer,
                    [beat]: beatNotes
                }
            }
        });
    }

    handleSave = () => {
        console.log('Current Sequence:', JSON.stringify(this.props.appState.sequencer));
    }

    handleLoad = () => {
        const json = prompt('Please paste sequence JSON');

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

    handleRandomSequence = () => {
        const notes = generateNotes(2, 3);
        const arr16 = (new Array(16)).fill(true);
        const sequencer = arr16.reduce((memo, item, i) => {
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
