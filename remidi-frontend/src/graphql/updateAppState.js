import gql from 'graphql-tag';

export const updateAppStateQuery = gql`
    mutation updateAppState(
        $selectedInput: Str!, # Actually an object
        $selectedOutput: Str!, # Actually an object
        $playState: Str!,
        $sendingClock: Boolean!,
        $bpm: Int!,
        $notes: Str!, # Actually an object
        $beat: Int!,
        $linkClockToStart: Boolean!,
        $sequencer: Str! # Actually an object
        $patternLength: Int!
    ) {
        updateAppState(
            selectedInput: $selectedInput,
            selectedOutput: $selectedOutput,
            playState: $playState,
            sendingClock: $sendingClock,
            bpm: $bpm,
            notes: $notes,
            beat: $beat,
            linkClockToStart: $linkClockToStart,
            sequencer: $sequencer,
            patternLength: $patternLength
        ) @client {
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
