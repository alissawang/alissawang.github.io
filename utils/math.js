export function normalPdf(input, currentMu, currentSd) {
    let expression_1 = 1/(Math.sqrt(2*Math.PI*currentSd))
    let z = zScore(currentMu, input, currentSd)
    let expression_2 = Math.exp(-0.5*(z**2))
  
    return expression_1 * expression_2
}

export function zScore(mu, observed, sd) {
    return (observed - mu) / sd
}