import {IHurdySpecs} from "./hurdy";
import createScale from "./scale";
import Svg from "./sgvTools/Sgv";

export interface IShaft {
    c: { x: number; y: number };
    w: number;
    h: number;
    l: number;
    r: number;
    moved: number;
}


const MIN_KEY_GAB = 2;
const MIN_KEY_WIDTH = 16;
const KEY_GAB = 1;

export default class Key {
    public static halfNotes: Key[] = [];
    public static wholeNotes: Key[] = [];
    public static keys: Key[] = [];

    public shaft: IShaft = {
        c: {x: 0, y: 0},
        w: 0,
        h: 0,
        l: 0,
        r: 0,
        moved: 0

    }

    public c: { x: number, y: number } = {x: 0, y: 0}

    public w: number = 0;
    public h: number = 0;
    public l: number = 0;
    public r: number = 0;
    public previous?: Key;
    public next?: Key;
    public row: {
        previous?: Key,
        next?: Key
    } = {
        previous: undefined,
        next: undefined
    }
    public readonly half: boolean;
    public readonly fromNut: number;
    public readonly note: string;
    private readonly specs: IHurdySpecs;
    public octave: number;

    static create(specs: IHurdySpecs) {
        createScale(specs);
        checkGabs(Key.wholeNotes);
        checkGabs(Key.halfNotes);
        setKeyEnds();
        setKeyToSpec(specs);
    }


    setInitialShaftDimensions() {
        const half = this.specs.keyLegWidth / 2
        this.shaft.c.x = this.fromNut;
        this.shaft.c.y = this.specs.tangentBoxHeight - (this.half ? this.specs.topRow : this.specs.bottomRow)
        this.shaft.w = this.specs.keyLegWidth;
        this.shaft.h = this.specs.keyLegHeight;
        this.shaft.l = this.fromNut - half;
        this.shaft.r = this.fromNut + half;
    }

    constructor(specs: IHurdySpecs, note: string, fromNut: number, octave:number) {
        this.specs = specs;
        this.fromNut = fromNut;
        this.note = note;
        this.half = note.includes('#')
        this.octave = octave;
        this.setInitialShaftDimensions();
        this.link();

    }

    private link() {
        //setting up linked links
        let previous = Key.keys[Key.keys.length - 1]
        if (previous) {
            this.previous = previous;
            previous.next = this;
        }


        Key.keys.push(this);

        if (this.half) {
            previous = Key.halfNotes[Key.halfNotes.length - 1];
            Key.halfNotes.push(this)
        } else {
            previous = Key.wholeNotes[Key.wholeNotes.length - 1];
            Key.wholeNotes.push(this)
        }
        if (previous) {
            this.row.previous = previous
            previous.row.next = this;
        }
    }


    draw(drawing: Svg) {
        const row = this.half ? this.specs.bottomRow : this.specs.topRow
        drawing.rect({
            x1: this.l,
            x2: this.r,
            y1: row,
            y2: row + this.specs.keyLegHeight
        })

    }
    get width(){
        return this.r - this.l;
    }

}

const checkGabs = (row: Key[]) => {
    row.forEach(key => {
        if (!key.row.next) {
            return;
        }
        const current = key.shaft;
        const next = key.row.next.shaft;

        //check distance between two key shafts
        const distance = next.l - current.r;

        // console.log(key.note,key.fromNut,key.row.next.fromNut,key.row.next.fromNut-key.fromNut);

        if (distance < MIN_KEY_GAB) {
            const moveDist = MIN_KEY_GAB - distance;
            const back = moveDist * -.5
            const forward = moveDist / 2
            if (current.moved) {
                move(next, moveDist)//move next all the way forward;
                return;
            }
            //move away from each other both directions
            move(current, back)//move current back;
            move(next, forward)//move current back;
        }
    })
}


const move = (shaft: IShaft, move: number) => {
    shaft.l += move;
    shaft.r += move;
    shaft.moved = move;
}

const setKeyEnds = () => {


    Key.keys.forEach(key => {
        const {next} = key;

        key.l = (key.row.previous) ? key.row.previous.r + KEY_GAB : key.fromNut - MIN_KEY_WIDTH;

        //last key in row
        if (!next) {
            key.r = key.fromNut + MIN_KEY_WIDTH
            return;
        }

        if (next && ['B','E'].includes(key.note)) {
            const halfWay = (next.fromNut - key.fromNut - MIN_KEY_GAB)/2;
            key.r = key.fromNut + halfWay ;
            return;
        }

        if (next.next && ['A#','D#'].includes(key.note)) {
            const halfWay = (next.next.fromNut - next.fromNut - MIN_KEY_GAB)/2;
            key.r = next.fromNut + halfWay ;
            return;
        }
        key.r = next.fromNut - KEY_GAB / 2;



        return;

    });

}

const setKeyToSpec = (specs: IHurdySpecs) => {
    let shift = 0;
    let i = 1;
    return;
    Key.keys.forEach(key=>{
        if(key.half){
            return;
        }
        // move the key if there is a shift
        key.l += shift;
        key.r += shift;
        i++;


        if( key.width<MIN_KEY_WIDTH){
            const enlarge = MIN_KEY_WIDTH - key.width
            console.log(key.note)
            console.log(key.width)
            key.r += enlarge;
            shift += enlarge;
            console.log(key.width, shift)
        }
    })
}
