import WebMidi from 'webmidi';

export async function initMidi() {
    WebMidi.enable(function (err) {
        if (err) {
            console.log("WebMidi could not be enabled.", err);
        } else {
            console.log("WebMidi enabled!");
            console.log(WebMidi.inputs);
            console.log(WebMidi.outputs);
        }
    });
}
