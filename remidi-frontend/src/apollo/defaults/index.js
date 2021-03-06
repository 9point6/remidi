export default {
    appState: {
        __typename: 'appState',
        selectedInput: '',
        selectedOutput: '',
        playState: 'STOPPED',
        sendingClock: false,
        linkClockToStart: true,
        bpm: 125,
        notes: '',
        beat: 0,
        sequencer: '',
        patternLength: 16,
        key: 'C',
        keyTonic: 'chromatic',
        linkSequencerToKey: true,
        startRange: 'F1',
        endRange: 'F5'
    },
    midiDevices: {
        __typename: 'midiDevices',
        initialised: false,
        inputs: [],
        outputs: []
    }
};
