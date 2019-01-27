import gql from 'graphql-tag';

export const getMidiDevicesQuery = gql`
    query {
        midiDevices @client {
            initialised
            inputs
            outputs
        }
    }
`;

export const getMidiDevicesOptions = ({
    props: ({ data: { midiDevices } }) => ({
        midiDevices
    })
});
