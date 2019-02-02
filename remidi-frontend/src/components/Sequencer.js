import React, { Component } from 'react';
import { compose, graphql } from 'react-apollo';

import { generateNotes } from '../lib/notes';
import {
    getAppStateQuery,
    getAppStateOptions,
    updateAppStateQuery
} from '../graphql';

import '../styles/Sequencer.css';

class Sequencer extends Component {
    render() {
        const notes = generateNotes(
            'F1',
            'F5',
            this.props.appState.linkSequencerToKey ? `${this.props.appState.key}3` : 'C3',
            this.props.appState.linkSequencerToKey ? this.props.appState.keyTonic : 'chromatic'
        );
        const arrPatternLength = (new Array(this.props.appState.patternLength)).fill(true);

        return (
            <table className='sequencer'>
                <tbody>
                    <tr>
                        <td className='pattern-length__cell'>
                            <label className="pattern-length__label" htmlFor="pattern-length">
                                steps:
                            </label>
                            <input
                                type="input"
                                value={this.props.appState.patternLength}
                                onChange={this.handlePatternLengthChange}
                                className="pattern-length"
                                name="pattern-length"
                                id="pattern-length"
                                disabled={this.props.appState.playState === 'PLAYING'}
                            />
                        </td>
                        {arrPatternLength.map((_, i) => {
                            const currentBeat = (i === this.props.appState.beat);
                            return (
                                <td key={i}>
                                    <button
                                        className={currentBeat ? 'beat-indicator current' : 'beat-indicator'}
                                        onClick={() => this.handleChangeStep(i)}
                                    >
                                        {i + 1}
                                    </button>
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
                            {arrPatternLength.map((_, i) => {
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

    handlePatternLengthChange = (evt) => {
        const { target: { value: patternLength } } = evt;

        this.props.updateAppState({
            variables: {
                patternLength
            }
        });
    }

    handleChangeStep = (beat) => {
        this.props.updateAppState({
            variables: {
                beat
            }
        });
    }
}

export default compose(
    graphql(getAppStateQuery, getAppStateOptions),
    graphql(updateAppStateQuery, { name: 'updateAppState' })
)(Sequencer);
