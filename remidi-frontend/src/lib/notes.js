const NOTES = [
    'C',
    'C#',
    'D',
    'D#',
    'E',
    'F',
    'F#',
    'G',
    'G#',
    'A',
    'A#',
    'B'
];

export function generateNotes(start, end) {
    let output = [];
    for (let i = start; i <= end; i++) {
        output = output.concat(NOTES.map((note) => ({
            note: `${note}${i}`,
            blackKey: note.indexOf('#') !== -1
        })));
    }

    return output;
}
