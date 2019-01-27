import React from 'react';
import gql from 'graphql-tag';
import { difference } from 'lodash';
import { Mutation } from 'react-apollo';

import { updateAppStateQuery } from '../../graphql/updateAppState';
import {
    startMidiClock,
    stopMidiClock,
    sendNoteOn,
    sendNoteOff,
    sendPlay,
    sendStop,
    sendContinue,
    getBeat,
    setSequence
} from '../../lib/midi';

function handleSendingClockChange(sendingClock, output, bpm, beatFunc) {
    if (sendingClock) {
        startMidiClock(output, bpm, beatFunc);
    } else {
        stopMidiClock(output);
    }
}

function handlePlayStateChange(playState, output) {
    if (playState === 'PLAYING') {
        sendPlay(output);
    } else if (playState === 'CONTINUE') {
        sendContinue(output);
    } else {
        sendStop(output);
    }
}

function handleBpmChange(sendingClock, output, bpm) {
    if (sendingClock) {
        startMidiClock(output, bpm);
    }
}

function handleNotesChange(output, notes, previousNotes) {
    const onNotes = Object.keys(notes).filter((note) => notes[note]);
    const onPreviousNotes = Object.keys(previousNotes).filter((note) => previousNotes[note]);
    const newOnNotes = difference(onNotes, onPreviousNotes);

    const offNotes = difference(Object.keys(notes), onNotes);
    const offPreviousNotes = difference(Object.keys(previousNotes), onPreviousNotes);
    const newOffNotes = difference(offNotes, offPreviousNotes);

    console.log('Notes change. New On:', newOnNotes, '; New off:', newOffNotes);
    newOnNotes.map((note) => sendNoteOn(output, note));
    newOffNotes.map((note) => sendNoteOff(output, note));
}

function handleSequencerChange(output, sequence) {
    setSequence(output, sequence);
}

const resolver = async (_, vars, { cache }) => {
    const {
        selectedInput,
        selectedOutput,
        playState,
        sendingClock,
        bpm,
        notes,
        beat,
        linkClockToStart,
        sequencer
    } = vars;
    const query = gql`
        query GetAppState {
            appState @client {
                selectedInput
                selectedOutput
                playState
                sendingClock
                bpm
                notes
                beat
                linkClockToStart
                sequencer
            }
        }
    `;

    const { appState } = cache.readQuery({ query });
    const output = selectedOutput || appState.selectedOutput;
    const data = {
        appState: {
            ...appState,
            selectedInput: selectedInput || appState.selectedInput,
            selectedOutput: output,
            playState: playState || appState.playState,
            sendingClock: typeof sendingClock !== 'undefined' ? sendingClock : appState.sendingClock,
            bpm: bpm || appState.bpm,
            notes: notes || appState.notes || {},
            beat: getBeat(output),
            linkClockToStart: typeof linkClockToStart !== 'undefined' ? linkClockToStart : appState.linkClockToStart,
            sequencer: sequencer || appState.sequencer || {}
        }
    };

    const playStateChanged = (
        playState &&
        playState !== appState.playState &&
        output
    );

    if (playStateChanged && data.appState.linkClockToStart) {
        data.appState.sendingClock = (playState === 'PLAYING' || playState === 'CONTINUE');
    }

    if (
        typeof data.appState.sendingClock !== 'undefined' &&
        data.appState.sendingClock !== appState.sendingClock &&
        output
    ) {
        handleSendingClockChange(data.appState.sendingClock, output, data.appState.bpm);
    }

    if (playStateChanged) {
        handlePlayStateChange(playState, output);
        if (playState === 'CONTINUE') {
            data.appState.playState = 'PLAYING';
        }
    }

    if (
        bpm &&
        bpm !== appState.bpm &&
        output
    ) {
        handleBpmChange(data.appState.sendingClock, output, bpm);
    }

    if (
        notes &&
        notes !== appState.notes &&
        output
    ) {
        handleNotesChange(output, notes, appState.notes);
    }

    if (
        sequencer &&
        sequencer !== appState.sequencer &&
        output
    ) {
        handleSequencerChange(output, sequencer);
    }

    cache.writeQuery({
        query,
        data
    });

    return null;
};

export default resolver;
