import teoria from 'teoria';

function oldGenerateNotes(start, end) {
    const baseNotes = teoria.note('C3')
        .scale('chromatic')
        .notes()
        .map((note) => note.scientific().slice(0, -1));

    let output = [];
    for (let i = start; i <= end; i++) {
        output = output.concat(baseNotes.map((note) => ({
            note: `${note}${i}`,
            blackKey: note.indexOf('#') !== -1 || note.indexOf('b') !== -1
        })));
    }

    return output;
}

function newGenerateNotes(start, end) {
    const lowerStart = start.toLowerCase();
    const lowerEnd = end.toLowerCase();
    const startOctave = Number(start.slice(-1));
    const endOctave = Number(end.slice(-1)) + 1;
    const notes = oldGenerateNotes(startOctave, endOctave);

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

export function generateNotes(start, end) {
    if (typeof start === 'number' && typeof end === 'number') {
        return oldGenerateNotes(start, end);
    }

    return newGenerateNotes(start, end);
}
