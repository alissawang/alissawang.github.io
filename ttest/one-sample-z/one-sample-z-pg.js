export function page3Transition() {
    let z = parseFloat(zSlider.value);
    zValue.innerHTML = `z = ${z}`;
    zValue.style.left = `${(z + 6) * 41}px`
    highlightPArea(normalDistrDynamicSvg, "normal-distribution", normalDistrData, z, normalPdfPartial, normalXGraphValues, normalYGraphValues, normalDistrWidth, normalDistrHeight, normalDistrMargins, 1)
}