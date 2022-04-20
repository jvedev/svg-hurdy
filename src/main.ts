import Sgv from './sgvTools/Sgv'
import {Hurdy} from './hurdy';


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


}

window.addEventListener('load', e => {
    main(document.getElementById('placeholder') as HTMLElement);
})
