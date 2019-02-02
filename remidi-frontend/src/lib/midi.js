import WebMidi from 'webmidi';
import { difference } from 'lodash';
import { delay } from 'bluebird';

const midiClocks = {};
const stepCounts = {};
const beatCounts = {};
const activeNotes = {};

let sequence = {};
let patternLength = 16;

function midiClockFreq(bpm) {
    return (1000 * 60) / (24 * bpm);
}

export function sendNoteOn(output, note) {
    output.playNote(note);

    if (!activeNotes[output.id]) {
        activeNotes[output.id] = {};
    }

    activeNotes[output.id][note] = true;
}

export function sendNoteOff(output, note) {
    output.stopNote(note);

    if (!activeNotes[output.id]) {
        activeNotes[output.id] = {};
    }

    activeNotes[output.id][note] = false;
}

async function switchNotes(output, previousNotes = [], newNotes = []) {
    const on = difference(newNotes, previousNotes);
    const off = difference(previousNotes, newNotes);

    sendNoteOff(output, off);
    await delay(5);
    sendNoteOn(output, on);
    await delay(5);
}

export function stopMidiClock(output) {
    clearInterval(midiClocks[output.id]);
}

export function startMidiClock(output, bpm, beatEvent = (beat) => {}) {
    stopMidiClock(output);
    stepCounts[output.id] = 0;
    beatCounts[output.id] = 0;
    midiClocks[output.id] = setInterval(() => {
        output.sendClock();
        stepCounts[output.id]++;

        if ((stepCounts[output.id] % 6) === 0) {
            beatCounts[output.id] = (beatCounts[output.id] + 1) % patternLength;
            beatEvent({
                id: output.id,
                beat: beatCounts[output.id]
            });

            switchNotes(output, sequence[((patternLength - 1) + beatCounts[output.id]) % patternLength], sequence[beatCounts[output.id]]);
        }
    }, midiClockFreq(bpm));
}

export function sendPlay(output) {
    output.sendStart();
    stepCounts[output.id] = 0;
    beatCounts[output.id] = 0;
}

export function sendContinue(output) {
    output.sendContinue();
}

export function sendStop(output) {
    output.sendStop();

    const notes = Object.keys(activeNotes[output.id]);
    if (notes.length) {
        notes.filter((note) => note).forEach((note) => {
            sendNoteOff(output, note);
            delete activeNotes[output.id][note];
        });
    }
}

export function getBeat(output) {
    return beatCounts[output.id];
}

export function setSequence(output, newSequence) {
    sequence = newSequence || {};
}

export function setPatternLength(length = 16) {
    patternLength = Number(length);
}

export function setBeat(output, beat = 0) {
    beatCounts[output.id] = beat;
    stepCounts[output.id] = beat * 6;
}

export async function initMidi() {
    return new Promise((resolve, reject) => {
        WebMidi.enable(function (err) {
            if (err) {
                reject(err);
            } else {
                const { inputs, outputs } = WebMidi;
                resolve({ inputs, outputs });
            }
        });
    });
}
