export function sum(numberArray, bool = false) {
    const initialVal = (bool ? true : 0)
    return numberArray.reduce((partialSum, x) => partialSum + x, 0) 
}

export function mean(numberArray) {
    return sum(numberArray) / numberArray.length
}

export function sumOfSquareDifferences(numberArray) {
    let mean_ = mean(numberArray)
    let sqDiffs = numberArray.map(d =>  (d - mean_) ** 2) 
    return sum(sqDiffs)
}

export function variance(numberArray, dfMinus) {
    let sumSqDiffs = sumOfSquareDifferences(numberArray)
    return sumSqDiffs / (numberArray.length - dfMinus)
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
    let expression1 = 1/(Math.sqrt(2*Math.PI) * currentSd)
    let z = zScore(currentMu, input, currentSd)
    let expression2 = Math.exp(-0.5*(z**2))
  
    return expression1 * expression2
}

export function studentsTPdf(input, df) {
    let expression1 = gamma((df + 1) / 2) / (gamma(df / 2) * Math.sqrt(df * Math.PI))
    let expression2 = (1 + ((input ** 2) / df)) ** (-(df + 1) / 2)
    return expression1 * expression2
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

export function tScore(mu, observed, sd, n) {
    return (observed - mu) / (sd / Math.sqrt(n))
}

export function areaUnderCurve(func, start, end, delta) {
    delta = (end > start) ? delta : -1 * delta
    let range = d3.range(start, end, delta)
    return range.reduce((total, currentVal) => total + (Math.abs(func(currentVal) * delta)), 0)
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

export function FDistribution(x, dof1, dof2) {
    let numeratorExp1 = (dof1 / dof2) ** (dof1 / 2)
    let numeratorExp2 = gamma((dof1 + dof2) / 2)
    let numeratorExp3 = x ** ((dof1 / 2) - 1)
    let denominatorExp1 = gamma(dof1/2) * gamma(dof2 / 2)
    let denominatorExp2 = (1 + ((dof1 * x) / dof2)) ** ((dof1 + dof2) / 2)
    return (numeratorExp1 * numeratorExp2 * numeratorExp3) / (denominatorExp1 * denominatorExp2)
}