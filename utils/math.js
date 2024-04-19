function normal_pdf(input, current_mu) {
    let expression_1 = 1/(Math.sqrt(2*Math.PI*sd))
    let z = (input - current_mu) / sd
    let expression_2 = Math.exp(-0.5*(z**2))
  
    return expression_1 * expression_2
}

function z_score(mu, observed, sd) {
    return (observed - mu) / sd
}