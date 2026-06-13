export class MidiDetector {
  constructor(onNoteOn, onNoteOff) {
    this.midiAccess = null;
    this.onNoteOn = onNoteOn;
    this.onNoteOff = onNoteOff;
    this.isRunning = false;
  }

  async start() {
    if (this.isRunning) return;

    if (!navigator.requestMIDIAccess) {
      throw new Error('Web MIDI API is not supported in this browser.');
    }

    try {
      this.midiAccess = await navigator.requestMIDIAccess();
      for (let input of this.midiAccess.inputs.values()) {
        input.onmidimessage = this.getMIDIMessage.bind(this);
      }
      this.midiAccess.onstatechange = (e) => {
        if (e.port.type === 'input' && e.port.state === 'connected') {
          e.port.onmidimessage = this.getMIDIMessage.bind(this);
        }
      };
      this.isRunning = true;
    } catch (err) {
      console.error('MIDI Access denied or failed', err);
      throw err;
    }
  }

  stop() {
    if (this.midiAccess) {
      for (let input of this.midiAccess.inputs.values()) {
        input.onmidimessage = null;
      }
    }
    this.isRunning = false;
  }

  getMIDIMessage(message) {
    const command = message.data[0];
    const note = message.data[1];
    const velocity = (message.data.length > 2) ? message.data[2] : 0;

    // A note on message is 144. Note off is 128. Some devices send note on with 0 velocity as note off.
    if (command === 144 && velocity > 0) {
      if (this.onNoteOn) this.onNoteOn(note, velocity);
    } else if (command === 128 || (command === 144 && velocity === 0)) {
      if (this.onNoteOff) this.onNoteOff(note);
    }
  }

  noteToName(note) {
    const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    const octave = Math.floor(note / 12) - 1;
    return noteNames[note % 12] + octave;
  }
}
