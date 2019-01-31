import gql from 'graphql-tag';

export const getAppStateQuery = gql`
    query {
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
            patternLength
        }
    }
`;

export const getAppStateOptions = ({
    props: ({ data: { appState } }) => ({
        appState
    })
});
