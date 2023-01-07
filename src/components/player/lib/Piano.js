import * as THREE from 'three';

import Key from './Key';

export default class Piano {
  constructor() {
    this.flatKeys = [
      new Key('Db2', '@', -55,1+12*2),
      new Key('Eb2', '#', -45,3+12*2),
      new Key('Gb2', '%', -25,6+12*2),
      new Key('Ab2', '^', -15,8+12*2),
      new Key('Bb2', '&', -5,10+12*2),

      new Key('Db3', 'S', 15,1+12*3),
      new Key('Eb3', 'D', 25,3+12*3),
      new Key('Gb3', 'G', 45,6+12*3),
      new Key('Ab3', 'H', 55,8+12*3),
      new Key('Bb3', 'J', 65,10+12*3),

      new Key('Db4', '2', 85,1+12*4),
      new Key('Eb4', '3', 95,3+12*4),
      new Key('Gb4', '5', 115,6+12*4),
      new Key('Ab4', '6', 125,8+12*4),
      new Key('Bb4', '7', 135,10+12*4),

      new Key('Db5', 's', 155,1+12*5),
      new Key('Eb5', 'd', 165,3+12*5),
      new Key('Gb5', 'g', 185,6+12*5),
      new Key('Ab5', 'h', 195,8+12*5),
      new Key('Bb5', 'j', 205,10+12*5),

    ];

    this.naturalKeys = [
      new Key('Q', 'Q', -60,0+12*2),
      new Key('W', 'W', -50,2+12*2),
      new Key('E', 'E', -40,4+12*2),
      new Key('R', 'R', -30,5+12*2),
      new Key('T', 'T', -20,7+12*2),
      new Key('Y', 'Y', -10,9+12*2),
      new Key('U', 'U', 0,11+12*2),

      new Key('Z', 'Z', 10,0+12*3),
      new Key('X', 'X', 20,2+12*3),
      new Key('C', 'C', 30,4+12*3),
      new Key('V', 'V', 40,5+12*3),
      new Key('B', 'B', 50,7+12*3),
      new Key('N', 'N', 60,9+12*3),
      new Key('M', 'M', 70,11+12*3),


      new Key('q', 'q', 80,0+12*4),
      new Key('w', 'w', 90,2+12*4),
      new Key('e', 'e', 100,4+12*4),
      new Key('r', 'r', 110,5+12*4),
      new Key('t', 't', 120,7+12*4),
      new Key('y', 'y', 130,9+12*4),
      new Key('u', 'u', 140,11+12*4),

      new Key('z', 'z', 150,0+12*5),
      new Key('x', 'x', 160,2+12*5),
      new Key('c', 'c', 170,4+12*5),
      new Key('v', 'v', 180,5+12*5),
      new Key('b', 'b', 190,7+12*5),
      new Key('n', 'n', 200,9+12*5),
      new Key('m', 'm', 210,11+12*5),
      new Key(',', ',', 220,0+12*6),

    ];

    this.displayText = true;
    this.highlightColor = '#61DBFB';

    this.pianoGroup = new THREE.Group();
    this.pianoGroup.position.x = -65;
    this.pianoGroup.rotation.x = -Math.PI / 4;
    this.pianoGroup.add(
      ...this.flatKeys.map((key) => key.keyGroup),
      ...this.naturalKeys.map((key) => key.keyGroup)
    );
  }

  hideText() {
    this.naturalKeys.forEach((key) => {
      key.hideKeyText();
    });
  }

  renderText(font) {
    // this.flatKeys.forEach((key) => {
    //   key.renderKeyText(font);
    // });
    this.naturalKeys.forEach((key) => {
      key.renderKeyText(font);
    });
  }

  getPianoGroup() {
    return this.pianoGroup;
  }

  getKeyFromInput(inputKey) {
    const flatKey = this.flatKeys.find((k) => k.inputKey === inputKey);
    const naturalKey = this.naturalKeys.find((k) => k.inputKey === inputKey);
    return flatKey || naturalKey || undefined;
  }

  maybePlayNote(eventKey,midiSounds,selectedInstrument) {
    const key = this.getKeyFromInput(eventKey);
    if (key !== undefined) {
      key.play(this.highlightColor,midiSounds,selectedInstrument);
    }
  }

  maybeStopPlayingNote(eventKey) {
    const key = this.getKeyFromInput(eventKey);
    if (key !== undefined) {
      key.stopPlaying(eventKey);
    }
  }
}
