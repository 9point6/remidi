import React, { Component } from 'react';
import { compose, graphql } from 'react-apollo';
import {
    getMidiDevicesQuery,
    getMidiDevicesOptions,
    getAppStateQuery,
    getAppStateOptions,
    updateMidiDevicesQuery,
    updateAppStateQuery
} from '../graphql';

import '../styles/Setup.css';

class Setup extends Component {
    render() {
        if (!this.props.midiDevices.initialised) {
            this.props.updateMidiDevices();
        }

        return (
            <div className="Setup">
                <h1>
                    Setup
                </h1>
                <button
                    onClick={this.refreshDevices}
                >
                    Refresh Devices
                </button>
                {this.listDevices()}
            </div>
        );
    }

    refreshDevices = () => {
        this.props.updateMidiDevices();
        this.props.updateAppState({
            variables: {
                selectedInput: null,
                selectedOutput: null
            }
        });
    }

    connectionListItem = (selectFunc, selected = {}) =>
        (device, i) => {
            const { id, manufacturer, name, state, connection } = device;
            const isSelected = selected.id === id;

            return (
                <li key={i}>
                    <strong>{manufacturer} {name}:{' '}</strong>
                    <span>{state} ({connection})</span>
                    <button
                        onClick={() => selectFunc(device)}
                        disabled={isSelected}
                    >
                        {isSelected ? 'Selected' : 'Select'}
                    </button>
                </li>
            );
        }

    selectInput = (selectedInput) => {
        this.props.updateAppState({
            variables: { selectedInput }
        });
    }

    selectOutput = (selectedOutput) => {
        this.props.updateAppState({
            variables: { selectedOutput }
        });
    }

    listDevices = () => {
        const { inputs, outputs } = this.props.midiDevices;
        const { appState } = this.props;

        if (!inputs.length || !outputs.length) {
            return (
                <div className="setup--no-devices">
                    You don't appear to have any MIDI devices connected. Connect a MIDI device and click refresh above.
                </div>
            );
        }

        return (
            <div>
                <h2>Inputs</h2>
                <ol>
                    {inputs.map(this.connectionListItem(this.selectInput, appState && appState.selectedInput))}
                </ol>
                <h2>Outputs</h2>
                <ol>
                    {outputs.map(this.connectionListItem(this.selectOutput, appState && appState.selectedOutput))}
                </ol>
            </div>
        );
    }
}

export default compose(
    graphql(getMidiDevicesQuery, getMidiDevicesOptions),
    graphql(getAppStateQuery, getAppStateOptions),
    graphql(updateMidiDevicesQuery, { name: 'updateMidiDevices' }),
    graphql(updateAppStateQuery, { name: 'updateAppState' })
)(Setup);
