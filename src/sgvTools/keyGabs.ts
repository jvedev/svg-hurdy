import {IHurdySpecs} from "../hurdy";
import Key, {IShaft} from "./key";

const MIN_KEY_GAB = 2;
export default (specs: IHurdySpecs) => {
    checkGabs(Key.wholeNotes);
    checkGabs(Key.halfNotes);
}


const checkGabs = (row: Key[]) => {
    row.forEach(key => {
        debugger;
        // get the previous key from this row
        const {previous} = key.row;
        if (previous) { // we have a previous
            //get the shafts
            const prev = previous.shaft;
            const current = key.shaft;
            //calculate the gab
            let gab = current.l - prev.r;
            debugger;
            console.log(gab)
            if (gab >= MIN_KEY_GAB) {
                //gab is big enough do nothing
                return
            }

            if (gab > 0) { //keys are not overlapping
                const remove = (MIN_KEY_GAB - gab) / 2
                current.l -= remove;
                prev.r -= remove

            } else { //keys are overlapping
                gab *= -.5;
                move(current, gab);
                move(prev, -gab);
            }
            setCenter(current);
            setCenter(prev);

        }
    })
}

const setCenter = (shaft: IShaft) => {
    shaft.w = shaft.r - shaft.l;
    shaft.c.x = shaft.r + (shaft.w / 2)
}


const move = (shaft: IShaft, move: number) => {
    shaft.l += move;
    shaft.r += move;
    shaft.moved = move;
}
