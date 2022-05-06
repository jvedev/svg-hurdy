import {IHurdySpecs, IKey} from "./hurdy";
import Key from "./key";

const SCALE_CONST = 17.817 // Do not change this

let keyBoard: IKey[] = [];

export default (specs:IHurdySpecs)=>{
    const retKeys:Key[] = []

    setKeyBoard(specs);
    let current = specs.scale
    for (let i = 0; i < specs.keys; i++) {

        current = current - (current / SCALE_CONST)
        const fromNut = specs.scale - current + specs.topNutSpace
        const note = keyBoard[i]
        new Key(specs, note, fromNut, Math.ceil(i/12));
    }
}

const setKeyBoard = (specs:IHurdySpecs) => {
    const keys: IKey[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
    const index = keys.indexOf(specs.root) + 1; //root will not be a key
    keyBoard = keys.splice(index, specs.keys);
}