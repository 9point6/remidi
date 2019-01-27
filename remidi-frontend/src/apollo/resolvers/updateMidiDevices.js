import gql from 'graphql-tag';

import { initMidi } from '../../lib/midi';

export default async (_, args, { cache }) => {
    const query = gql`
        query GetMidiDevices {
            midiDevices @client {
                initialised
                inputs
                outputs
            }
        }
    `;

    const { inputs, outputs } = await initMidi();
    const data = {
        midiDevices: {
            __typename: 'midiDevices',
            initialised: true,
            inputs: inputs.map((input) => {
                input.__typename = 'MidiConnection';
                return input;
            }),
            outputs: outputs.map((output) => {
                output.__typename = 'MidiConnection';
                return output;
            })
        }
    };

    cache.writeQuery({
        query,
        data
    });

    return null;
};
