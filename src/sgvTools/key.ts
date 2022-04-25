import {IHurdySpecs} from "../hurdy";
import createScale from "./scale";
import checkGabs from "./keyGabs"
export interface IShaft {
    c: { x: number; y: number };
    w: number;
    h: number;
    l: number;
    r: number;
    moved: number;
}

export default class Key {
    public static halfNotes: Key[] = [];
    public static wholeNotes: Key[] = [];
    public static keys: Key[] = [];

    public shaft: IShaft = {
        c: {x: 0, y: 0},
        w: 0,
        h: 0,
        l:0,
        r:0,
        moved:0

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

    static create(specs: IHurdySpecs) {
        debugger;
        createScale(specs);
        debugger;

        checkGabs(specs);
    }


    setInitialShaftDimensions(){
        const half = this.specs.keyLegWidth/2
        this.shaft.c.x = this.fromNut;
        this.shaft.w = this.specs.keyLegWidth;
        this.shaft.h = this.specs.keyLegHeight;

        this.shaft.l = this.fromNut - half;
        this.shaft.r = this.fromNut + half;

    }

    constructor(specs: IHurdySpecs, note: string, fromNut: number) {
        this.specs = specs
        this.fromNut = fromNut;
        this.note = note
        this.setInitialShaftDimensions();


        //setting up linked links
        let previous = Key.keys[Key.keys.length - 1]
        if(previous){
            this.previous = previous;
            previous.next = this;
        }


        Key.keys.push(this);
        this.half = note.includes('#')
        if (this.half) {
            previous = Key.halfNotes[Key.halfNotes.length - 1];
            Key.halfNotes.push(this)
        } else {
            previous = Key.wholeNotes[Key.halfNotes.length - 1];
            Key.wholeNotes.push(this)
        }
        if(previous){
            this.row.previous = previous
            previous.row.next = this;
        }

    }
}