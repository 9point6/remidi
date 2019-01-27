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
        sequencer: ''
    },
    midiDevices: {
        __typename: 'midiDevices',
        initialised: false,
        inputs: [],
        outputs: []
    }
};
