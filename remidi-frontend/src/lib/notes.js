import teoria from 'teoria';

function generateScale(startNote, tonic) {
    return teoria.note(startNote)
        .scale(tonic)
        .notes()
        .map((note) => note.scientific().slice(0, -1));
}

function generateOctaves(start, end, key, tonic) {
    const baseNotes = generateScale(key, tonic);

    let output = [];
    for (let i = start; i <= end; i++) {
        output = output.concat(baseNotes.map((note) => ({
            note: `${note}${i}`,
            blackKey: note.indexOf('#') !== -1 || note.indexOf('b') !== -1
        })));
    }

    return output;
}

export function generateNotes(start, end, key = 'C3', tonic = 'chromatic') {
    const lowerStart = start.toLowerCase();
    const lowerEnd = end.toLowerCase();
    const startOctave = Number(start.slice(-1));
    const endOctave = Number(end.slice(-1)) + 1;
    const notes = generateOctaves(startOctave, endOctave, key, tonic);

    let seenStart = false;
    let seenEnd = false;

    return notes.filter(({ note }) => {
        const noteLower = note.toLowerCase();
        if (!seenStart && noteLower === lowerStart) {
            return (seenStart = true);
        }

        if (!seenEnd && noteLower === lowerEnd) {
            return !(seenEnd = true);
        }

        return seenStart && !seenEnd;
    });
}

export function isValidTonic(tonic) {
    return teoria.Scale.KNOWN_SCALES.indexOf(tonic) !== -1;
}
