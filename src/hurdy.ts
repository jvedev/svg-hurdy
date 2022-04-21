import Svg from './sgvTools/Sgv';

const SCALE_CONST = 17.817 // Do not change this
const MIN_KEY_GAB = 2;
const MIN_TANGENT_GAB = 4;
const MIN_KEY_WIDTH = 12.5;
const KEY_GAB = 1;
export type IKey = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B';

let CI = 0

export interface IHurdySpecs {
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

    getPrevKeySameRow(key: IKeyDef): IKeyDef | null {
        let prev = key;

        while (prev.previous) {
            if (key.sharp == prev.previous.sharp) {
                return prev.previous
            }
            prev = prev.previous;
        }
        return null;
    }

    getNextKeySameRow(key: IKeyDef): IKeyDef | null {
        let next = key;

        while (next.next) {
            if (key.sharp == next.next.sharp) {
                return next.next
            }
            next = next.next;
        }
        return null;
    }

    setKeyR(key: IKeyDef): void {
        // get the next key in this row
        const next = this.getNextKeySameRow(key)
        if (next) {

            const width = next.c.x - key.c.x
            key.r = key.c.x + (width / 2); // in between the two keys
            return;
        }
        //last key on this row
        key.r = key.c.x + key.w;
    }

    setKeyL(key: IKeyDef): void {

        // get the next key in this row
        const prev = this.getPrevKeySameRow(key)
        if (prev) {
            key.l = prev.r
            return
        }
        //last key on this row
        key.l = key.c.x - 20;
    }



    setMinKeyWidth() {
        this.keys.forEach(key => {
            const width = key.r - key.l;
            if (width > MIN_KEY_WIDTH) return;
            const shift = MIN_KEY_WIDTH - width;
            key.r += shift // move right side of the key
            debugger;
            let left = key.next;
            while (left) {
                if (key.sharp == left.sharp) {
                    left.l += shift;
                    left.r += shift;
                }else{
                    left.l
                }

                left = left.next;
            }
        })

    }

    getKeys() {
        this.drawing.offSet = {x: 0, y: 15}
        this.keys.forEach(key => this.setKeyR(key));
        this.keys.forEach(key => this.setKeyL(key));
        this.setMinKeyWidth();

        this.keys.forEach((key, index) => {
            let y = (key.sharp) ? 0 : 15;

            this.drawing.rect({
                x1: key.l + KEY_GAB / 2,
                x2: key.r - KEY_GAB / 2,
                y1: y,
                y2: y + 5
            })
            console.log(index, this.keyBoard[index], key.r - key.l)
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




