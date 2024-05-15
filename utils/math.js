export function mean(numberArray) {
    let sum = numberArray.reduce((partialSum, x) => partialSum + x, 0) 
    return sum / numberArray.length
}

export function normalPdf(input, currentMu, currentSd) {
    let expression_1 = 1/(Math.sqrt(2*Math.PI*currentSd))
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