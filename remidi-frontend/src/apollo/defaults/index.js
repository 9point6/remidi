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
        patternLength: 16
    },
    midiDevices: {
        __typename: 'midiDevices',
        initialised: false,
        inputs: [],
        outputs: []
    }
};
