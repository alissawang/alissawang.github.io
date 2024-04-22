import { normalPdf, zScore } from "./math.js"

export function generateData(xRange, currentMu, currentSd) {
    var data = xRange.map(function(d) {return {"x": d, "z": zScore(currentMu, d, currentSd), "y": normalPdf(d, currentMu, currentSd)}})
    return data
}