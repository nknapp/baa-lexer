import {bench, describe} from "vitest";
import {createLocationTracker} from "./locationTrackerFn";
import {LocationTracker} from "./LocationTracker";


const string = "abcdefg\n".repeat(1000)

describe("LocationTracker", () => {
    bench("class", () => {
        const tracker = new LocationTracker()
        for (let i=0; i<string.length; i+=5) {
            tracker.advance(string.slice(i,i+5))
        }
    })

    bench("fn", () => {
        const tracker = createLocationTracker()
        for (let i=0; i<string.length; i+=5) {
            tracker.advance(string.slice(i,i+5))
        }
    })
})