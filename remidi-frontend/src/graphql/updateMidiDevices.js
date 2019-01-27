import gql from 'graphql-tag';

export const updateMidiDevicesQuery = gql`
    mutation updateMidiDevices {
        updateMidiDevices @client {
            inputs
            outputs
        }
    }
`;
