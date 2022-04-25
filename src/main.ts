import Sgv from './sgvTools/Sgv'
import Key from './sgvTools/key'
import {Hurdy} from './hurdy'

import scale from './sgvTools/scale'
function main(placeHolder: HTMLElement | undefined) {
    if (!placeHolder) {
        return;
    }
    const drawing = new Sgv(placeHolder, {
        height: 300,
        width: 400,
        units: "mm",
        padding: 50
    })

    const h = new Hurdy(drawing, {
        root: 'G',
        scale: 345,
        keys: 24,
        bottomRow: 37,
        topRow: 45,
        keyLegHeight: 5,
        keyLegWidth: 8,
        tangentBoxHeight: 60,
        tangentBoxWidth: 300,
        topNutSpace: 10

    })

    Key.create({
        root: 'G',
        scale: 345,
        keys: 24,
        bottomRow: 37,
        topRow: 45,
        keyLegHeight: 5,
        keyLegWidth: 8,
        tangentBoxHeight: 60,
        tangentBoxWidth: 300,
        topNutSpace: 10

    })


    for(let i=0;i<24;i++){
       // if(h.keys[i].c.x != Key.keys[i].shaft.c.x){
            console.log(i);
            console.log('o', h.keys[i].c.x, h.keys[i].c.x - (h.keys[i].w /2));
            console.log('n', Key.keys[i].shaft.c.x, Key.keys[i].shaft.r);
       // }

    }


}

window.addEventListener('load', e => {
    main(document.getElementById('placeholder') as HTMLElement);
})
