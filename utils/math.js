export function sum(numberArray, bool = false) {
    const initialVal = (bool ? true : 0)
    return numberArray.reduce((partialSum, x) => partialSum + x, 0) 
}

export function mean(numberArray) {
    return sum(numberArray) / numberArray.length
}

export function variance(numberArray, dfMinus) {
    let mean_ = mean(numberArray)
    let sqDiffs = numberArray.map(d =>  (d - mean_) ** 2) 
    return sum(sqDiffs) / (numberArray.length - dfMinus)
}

export function standardDeviation(numberArray, dfMinus = 0) {
    let variance_ = variance(numberArray, dfMinus)
    return Math.sqrt(variance_)
}

export function roundDecimal(number, places) {
    return Math.round(number * (10 ** places), places) / (10 ** places)
}

export function gamma(z) {
    return Math.sqrt(2 * Math.PI / z) * Math.pow((1 / Math.E) * (z + 1 / (12 * z - 1 / (10 * z))), z);
  }

export function normalPdf(input, currentMu, currentSd) {
    let expression_1 = 1/(Math.sqrt(2*Math.PI) * currentSd)
    let z = zScore(currentMu, input, currentSd)
    let expression_2 = Math.exp(-0.5*(z**2))
  
    return expression_1 * expression_2
}

export function betaPdf(x, a, b) {
    return (Math.pow(x, a - 1) * Math.pow(1 - x, b - 1)) / betaFunc(a, b)
}

export function bernoulliPdf(x, p) {
    return (p ** x) * ((1-p) ** (1-x))
}

export function uniformPdf(x, a, b) {
    return 1/Math.abs(b-a)
}

export function betaFunc(a, b) {
    return (factorial(a - 1) * factorial(b-1))/factorial(a + b -1)
}

export function factorial(x) {
    if (x == 0) {
        return 1;
    }
    return x * factorial(x - 1)
}

export function zScore(mu, observed, sd) {
    return (observed - mu) / sd
}

export function areaUnderCurve(func, start, end, delta) {
    let range = d3.range(start, end, delta)
    return range.reduce((total, currentVal) => total + (Math.abs(func(currentVal)) * delta), 0)
}

export function reverseLookupAreaUnderCurve(func, end, delta, targetArea) {
    let area = 0;
    let i = end
    while (area < targetArea) {
        area += Math.abs(func(i)) * delta
        i -= delta
    }
    return i
}

export function chiSqValue(observedArray, expectedArray) {
    let n = observedArray.length;
    let addends = d3.range(n).map(idx => ((observedArray.at(idx) - expectedArray.at(idx))**2) / expectedArray.at(idx))
    return sum(addends)
}

export function chiSqDistribution(x, dof) {
    let exp1 = x ** ((dof / 2) - 1)
    let exp2 = Math.E ** (-x/2)
    let exp3 = 1 / (gamma(dof / 2) * 2 ** (dof / 2))
    return exp1 * exp2 * exp3
}