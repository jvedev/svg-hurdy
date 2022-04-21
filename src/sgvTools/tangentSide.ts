import {IHurdySpecs} from "../hurdy";
import Key, {IShaft} from "./key";

const MIN_TANGENT_GAB = 4;
const MIN_KEY_GAB = 2;
export default (specs: IHurdySpecs) => {
    checkGabs(Key.wholeNotes);
    checkGabs(Key.halfNotes);
    checkTopRowTangentSpace();
}


const checkGabs = (row: Key[]) => {
    row.forEach(key => {
        const {previous} = key.row;
        if (previous) {
            const prev = previous.shaft;
            const current = key.shaft;
            let gab = current.l - prev.r;
            if (gab < MIN_KEY_GAB) {
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


const checkTopRowTangentSpace = (): void => {
    const clearance = MIN_TANGENT_GAB / 2;
    Key.wholeNotes.forEach(key => {
        const {previous, next} = key;

        if (previous && previous.half) { //previous key is on top row
            const available = previous.shaft.r - key.fromNut
            const moveBack = clearance - available;
            if (moveBack > 0) {
                previous.shaft.r -= moveBack;
                setCenter(previous.shaft);
            }
        }
        if (next && next.half) { //next key is on top row
            const available = next.shaft.l - key.fromNut;
            const moveForward = clearance - available;
            if (moveForward > 0) {
                next.shaft.l += moveForward;
                setCenter(next.shaft);
            }
        }


    })

}