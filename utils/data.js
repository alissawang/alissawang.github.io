import { normalPdf, zScore, sum, mean } from "./math.js"
import { randomSeedArray } from "./constants.js"

export function generateNormalData(xRange, currentMu, currentSd) {
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

export function sampleDistribution(probabilities, fixedRand = null) {
    let sumProbabilities = probabilities.reduce((sum, d) => sum += d.y, 0)
    let rand = fixedRand ? fixedRand * sumProbabilities : Math.random() * sumProbabilities
    let cumProbabilities = 0;
    let idx = 0;
    while (cumProbabilities < rand) {
        cumProbabilities += probabilities[idx].y
        idx ++;
    }
    return probabilities[idx - 1]
}

export function arraySampleDistribution(probabilities, n) {
    let sampleArray = []
    for (let i = 0; i < n; i++) {
        sampleArray.push(sampleDistribution(probabilities))
    }
    return sampleArray
}

export function seedSampleDistribution(probabilities, n) {
    let fixedRands = randomSeedArray.slice(0, n)
    return fixedRands.map(d => sampleDistribution(probabilities, d))
}

export function seedSampleNormalDistribution(mean, sd, n) {
    let xRange = d3.range(mean - (10 * sd), mean + (10 * sd), 0.001)
    let normalDistrData = generateNormalData(xRange, mean, sd)
    let fixedRands = randomSeedArray.slice(0, n)
    return fixedRands.map(d => sampleDistribution(normalDistrData, d))
}

export function sampleNormalDistribution(mean, sd, n) {
    let xRange = d3.range(mean - (10 * sd), mean + (10 * sd), 0.001)
    let normalDistrData = generateNormalData(xRange, mean, sd)
    return d3.range(n).map(d => sampleDistribution(normalDistrData))
}

export function forceArrayMean(array, targetMean) {
    let n = array.length
    let modifiedArray = array.slice(1, n)
    let diff = (targetMean * n) - (sum(modifiedArray))
    let newValue = Math.max(diff, 0)
    let newArray = modifiedArray.concat(newValue)
    return newArray
}

export function shuffleArray(dataArray) {
    let randomIndex = dataArray.map(d => {return {"x": d, "idx": Math.random()}})
    let shuffled = randomIndex.sort((a, b) => a.idx - b.idx)
    return shuffled.map(d => d.x)
}

export function jitterXValues(data) {
    return data.map(point => {return {"x": 0.5 + Math.random() * 0.5, "y": point.x}})
}

export function closestInArray(dataArray, target) {
    let sortedArray = dataArray.sort((a, b) => a - b)
    return sortedArray.reduce((prev, current) => Math.abs(target - current) < Math.abs(target - prev) ? current : prev)
}