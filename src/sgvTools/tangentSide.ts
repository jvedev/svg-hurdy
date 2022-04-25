import {IHurdySpecs} from "../hurdy";
import Key, {IShaft} from "./key";

const MIN_TANGENT_GAB = 4;




const checkTopRowTangentSpace = (): void => {
    const clearance = MIN_TANGENT_GAB / 2;
    Key.wholeNotes.forEach(key => {
        const {previous, next} = key;

        if (previous && previous.half) { //previous key is on top row
            const available = previous.shaft.r - key.fromNut
            const moveBack = clearance - available;
            if (moveBack > 0) {
                previous.shaft.r -= moveBack;
              //  setCenter(previous.shaft);
            }
        }
        if (next && next.half) { //next key is on top row
            const available = next.shaft.l - key.fromNut;
            const moveForward = clearance - available;
            if (moveForward > 0) {
                next.shaft.l += moveForward;
                //setCenter(next.shaft);
            }
        }


    })

}