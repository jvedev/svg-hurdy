import Svg from './sgvTools/Sgv';

const SCALE_CONST = 17.817 // Do not change this
const MIN_KEY_GAB = 2;
const MIN_TANGENT_GAB = 4;
const KEY_GAB = .1;
type IKey = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B';

let CI = 0

interface IHurdySpecs {
    root: IKey
    scale: number,
    keys: number,
    bottomRow: number,
    topRow: number,
    keyLegHeight: number,
    keyLegWidth: number
    tangentBoxHeight: number,
    tangentBoxWidth: number,
    topNutSpace: number;

}

interface IKeyDef {
    c: { x: number, y: number },
    w: number,
    h: number,
    previous?: IKeyDef,
    next?: IKeyDef,
    sharp: boolean,
    l: number,
    r: number

}


export class Hurdy {
    private drawing: Svg;
    private keys: IKeyDef[] = [];
    private keyBoard: IKey[] = [];
    private specs: IHurdySpecs;

    constructor(drawing: Svg, specs: IHurdySpecs) {
        this.specs = specs;
        this.drawing = drawing
        this.setKeyBoard();
        this.getPositions();
        this.drawSide()
        this.drawUpperKeys();
        this.getKeys();
    }

    drawSide() {
        const side = {
            x: 0,
            y: 0,
            w: this.specs.tangentBoxWidth + this.specs.topNutSpace,
            h: this.specs.tangentBoxHeight
        }
        this.drawing.rect(side)
        this.drawing.mode = 'construction'
        this.drawing.line({
            x1: this.specs.topNutSpace,
            x2: this.specs.topNutSpace, y1: -10, y2: this.specs.tangentBoxHeight + 10
        })
        this.drawing.mode = 'cut';
        this.keys.forEach(key => {
            this.drawing.rect(key)
        })
    }


    getKeys() {
        this.drawing.offSet = {x: 0, y: 90}

        this.keys.forEach((key, index) => {
            let l = key.c.x - (key.w / 2)
            let r = l + key.w;
            let y = key.sharp ? 0 : 20;
            debugger;

            if (key.previous) { //same row
                l = (key.previous.sharp == key.sharp) ? key.previous.r : key.previous.c.x

                if (key.previous.sharp == key.sharp) { //same row
                    l = key.previous.l
                } else {
                    debugger;
                    if (key.previous.sharp == key.previous?.previous?.sharp) {
                        //top row next to bottom keys
                        l = key.previous.previous.c.x - ((key.previous.previous.c.x - key.previous.c.x) / 2);
                    } else {
                        l = key.previous.c.x;
                    }
                }


            }

            if (key.next) {
                if (key.next.sharp == key.sharp) { //same row
                    r = key.next.l
                } else {
                    if (key.next.sharp == key.next?.next?.sharp) {
                        //top row next to bottom keys
                        r = key.next.c.x + ((key.next.next.c.x - key.next.c.x) / 2);
                    } else {
                        r = key.next.c.x;
                    }
                }
            }

            if (!this.isSharp(index)) {
                y += 5 * index;

                const mode = ['cut','engrave', 'construction','cut','engrave', 'construction','cut','engrave', 'construction','cut','engrave', 'construction','cut','engrave', 'construction','cut','engrave', 'construction','cut','engrave', 'construction'][CI++]
                //@ts-ignore
                this.drawing.mode = mode;
                console.log(mode, index, Math.round(l) , key);
            }

            this.drawing.rect({
                x1: l + KEY_GAB / 2,
                x2: r - KEY_GAB / 2,
                y1: y,
                y2: y + 5
            })


        })
    }

    drawUpperKeys(): void {
        let previous: IKeyDef = this.keys[0];


    }


    getPositions(): void {
        let currentLength = this.specs.scale;

        for (let i = 0; i < this.specs.keys; i++) {
            currentLength = currentLength - (currentLength / SCALE_CONST)
            const spec = {
                c: {
                    x: this.specs.scale - currentLength + this.specs.topNutSpace,
                    y: this.getYKeyRow(i),
                },
                w: this.specs.keyLegWidth,
                h: this.specs.keyLegHeight,
                sharp: this.isSharp(i),
                l: 0,
                r: 0
            }
            this.keys.push(spec)
            // draw the construction line
            this.drawing.mode = 'construction'
            this.drawing.line({
                x1: spec.c.x,
                x2: spec.c.x,
                y1: -10,
                y2: this.specs.tangentBoxHeight + 10
            })
            this.drawing.mode = 'cut'

            let moved = 0;
            if (i > 0) {
                // check gaps and adjust the with if needed
                const previous = this.keys[i - 1];
                const current = this.keys[i];
                current.previous = previous;
                previous.next = current;
                let gab = current.c.x - previous.c.x - current.w
                if (gab < MIN_KEY_GAB && current.c.y == previous.c.y) {

                    if (gab > 0) {
                        current.w = current.w - (MIN_KEY_GAB - gab) / 2
                        previous.w = previous.w - (MIN_KEY_GAB - gab) / 2
                    } else {
                        gab = gab * -.5;
                        current.w = current.w - (MIN_KEY_GAB) / 2
                        previous.w = previous.w - (MIN_KEY_GAB) / 2
                        current.c.x += gab;
                        previous.c.x -= gab;
                        moved = gab
                    }
                }
            }

            if (i > 1) { //check gab for tangents between previous and current
                const previous = this.keys[i - 2];
                const middle = this.keys[i - 1];
                const next = this.keys[i];
                const required = (MIN_TANGENT_GAB + moved) / 2
                // is the middle on the below previous and
                if (middle.c.y > previous.c.y) {
                    const prevLeft = previous.c.x + previous.w / 2;
                    const gab = middle.c.x - prevLeft;
                    if (gab < required) {
                        previous.w -= Math.ceil(required - gab)
                    }
                }
                if (middle.c.y > next.c.y) {
                    const nextRight = next.c.x - next.w / 2;
                    const gab = nextRight - middle.c.x;

                    if (gab < required) {

                        next.w -= Math.ceil(required - gab)

                    }
                }
            }
        }


    }

    setKeyBoard() {
        const keys: IKey[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
        const index = keys.indexOf(this.specs.root) + 1; //root will not be a key
        this.keyBoard = keys.splice(index, this.specs.keys);
    }

    getYKeyRow(keyNr: number): number {
        const y = this.isSharp(keyNr) ? this.specs.topRow : this.specs.bottomRow
        return this.specs.tangentBoxHeight - y;
    }

    isSharp(keyNr: number): boolean {
        return this.keyBoard[keyNr].includes('#')
    }

}




