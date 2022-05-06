import Svg from './sgvTools/Sgv';
import Key, {checkGabsOfShafts} from "./key";

export type IKey = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B';

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
    keySpecs: { lower: number[], upper: number[] }
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
    private specs: IHurdySpecs;

    constructor(drawing: Svg, specs: IHurdySpecs) {
        this.specs = specs;
        this.drawing = drawing
        Key.create(specs);
        this.drawSide();
        this.drawShaftWholes();
        Key.keys.forEach(key => key.draw(drawing))
    }

    drawShaftWholes() {
        Key.keys.forEach(key => {
            this.drawing.rect({
                x1: key.shaft.l,
                x2: key.shaft.r,
                y1: key.shaft.c.y - this.specs.keyLegHeight / 2,
                y2: key.shaft.c.y + this.specs.keyLegHeight / 2
            })
        })
    }

    drawSide() {
        this.drawing.rect({
            x: 0,
            y: 0,
            w: this.specs.tangentBoxWidth + this.specs.topNutSpace,
            h: this.specs.tangentBoxHeight
        })
        this.drawing.offSet = {x: this.specs.topNutSpace, y: 0}
        this.drawing.mode = 'construction'
        this.drawing.line({
            x1: this.specs.topNutSpace,
            x2: this.specs.topNutSpace, y1: -10, y2: this.specs.tangentBoxHeight + 10
        })
        //draw key construction lines (real tangent positions)

        Key.keys.forEach(key => {
            this.drawing.line({
                x1: key.fromNut,
                x2: key.fromNut, y1: -10, y2: this.specs.tangentBoxHeight + 10
            })
        })
        this.drawing.mode = 'cut';

    }


}




