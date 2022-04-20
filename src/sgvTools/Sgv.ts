interface ISgvOptions {
    height: number;
    width: number;
    units: 'mm' | 'cm';
    padding:number;
}

interface IPoint {
    x: number,
    y: number
}

export default class Sgv {
    private readonly svg: SVGSVGElement;
    private readonly units: 'mm' | 'cm';
    private stroke: 'red' | 'black' | 'blue' = 'black';
    private readonly padding:number = 0;
    public offSet: IPoint = {x:0,y:0}



    constructor(placeHolder: HTMLElement | null, options: ISgvOptions) {

        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.units = options.units
        this.padding = options.padding;
        if (!placeHolder) {
            return;
        }

        this.svg.setAttribute('height', options.height + options.units);
        this.svg.setAttribute('width', options.width + options.units);
        // svg.setAttribute('viewBox', `0 0 ${options.height} ${options.width}`); //

        placeHolder.appendChild(this.svg)
    }

    set mode(mode: 'cut' | 'engrave' | 'construction') {
        switch (mode) {
            case 'cut':
                this.stroke = 'black';
                break;
            case 'engrave':
                this.stroke = 'red';
                break;
            case 'construction':
                this.stroke = 'blue';
                break;
        }
    }


    getLineOptions(options: { x1: number, x2: number, y1: number, y2: number } | IPoint []): { x1: number, x2: number, y1: number, y2: number } {
        if ('x1' in options) {
            return options;
        }
        if (options.length != 2) {
            console.log(' point array must be length 2 for a line')
            return {x1: 0, x2: 0, y1: 0, y2: 0};
        }
        return {
            x1: options[0].x,
            y1: options[0].y,
            x2: options[1].x,
            y2: options[1].y
        }
    }

    line(options: { x1: number, x2: number, y1: number, y2: number } | IPoint []) {
        const {x1, x2, y1, y2} = this.getLineOptions(options)
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');

        line.setAttribute("x1", this.unit(x1 + this.offSet.x));
        line.setAttribute("x2", this.unit(x2 + this.offSet.x));
        line.setAttribute("y1", this.unit(y1 + this.offSet.y));
        line.setAttribute("y2", this.unit(y2 + this.offSet.y));
        line.style.stroke = this.stroke;
        line.style.strokeWidth = '.2mm';
        this.svg.appendChild(line)
    }

    poly(options: {points: IPoint[] }): void {
        const {points} = options;
        let from = points[0];
        if(!from){
            return;
        }

        points.forEach(point=>{
            const to = {x: from.x + point.x, y: from.y + point.y};
            this.line([from, to])
            from = to
        })




    }


    private getRectOptions(options:
                               { x1: number, x2: number, y1: number, y2: number } |
                               { x: number, y: number, h: number, w: number } |
                               { c: IPoint, h: number, w: number }): { x: number, y: number, h: number, w: number } {

        if ('c' in options) {
            return {
                x: options.c.x - (options.w / 2),
                y: options.c.y - (options.h / 2),
                w: options.w,
                h: options.h,
            }
        }

        if ('h' in options) {
            return options;

        }

        const {x1, x2, y1, y2} = options;
        return {
            x: x1, y: y1, w: x2 - x1, h: y1 - y2
        }


    }

    rect(options: { x1: number, x2: number, y1: number, y2: number } |
        { x: number, y: number, h: number, w: number } |
        { c: IPoint, h: number, w: number }
    ) {


        const {x, y, h, w} = this.getRectOptions(options);


        const tl = {x, y};
        const tr = {x: x + w, y};
        const bl = {x, y: y + h};
        const br = {x: x + w, y: y + h}

        this.line([tl, tr]);
        this.line([tr, br]);
        this.line([br, bl]);
        this.line([bl, tl]);


    }

    private unit(n: number | string): string {
        return (typeof n == 'number') ? (n + this.padding)+ this.units : n;
    }


}

