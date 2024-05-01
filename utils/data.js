import { normalPdf, zScore } from "./math.js"

export function generateData(xRange, currentMu, currentSd) {
    var data = xRange.map(function(d) {return {"x": d, "z": zScore(currentMu, d, currentSd), "y": normalPdf(d, currentMu, currentSd)}})
    return data
}

export function randomSample(dataArray, n = 1) {
    let sampleArray = []
    for (let i = 0; i < n; i++) {
        sampleArray.push(randomChoice(dataArray))
    }
    return sampleArray
}

export function randomChoice(dataArray) {
    let randIndex = Math.floor(Math.random() * dataArray.length)
    return dataArray[randIndex]
}

export function sampleDistribution(probabilities) {
    let sumProbabilities = probabilities.reduce((sum, d) => sum += d.y, 0)
    let rand = Math.random() * sumProbabilities
    let cumProbabilities = 0;
    let idx = 0;
    while (cumProbabilities < rand) {
        cumProbabilities += probabilities[idx].y
        idx ++;
    }
    return probabilities[idx]
}

export function arraySampleDistribution(probabilities, n) {
    let sampleArray = []
    for (let i = 0; i < n; i++) {
        sampleArray.push(sampleDistribution(probabilities))
    }
    return sampleArray
}