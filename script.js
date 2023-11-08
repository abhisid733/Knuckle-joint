const outputElement = document.getElementById("output");
const axialForceInput = document.getElementById("axialForce");
const optionSelect = document.getElementById("optionSelect");
const materialSelection = document.getElementById("materialSelection");
const manualInput = document.getElementById("manualInput");
const materialSelect = document.getElementById("materialSelect");
const yieldStrengthInput = document.getElementById("yieldStrength");
const crushingStressInput = document.getElementById("crushingStress");
const safetyFactorInput = document.getElementById("safetyFactor");
const calculateButton = document.getElementById("calculateButton");

var showing = false;
optionSelect.addEventListener("change", function () {
    if (optionSelect.value === "1") {
        materialSelection.style.display = "block";
        manualInput.style.display = "none";
    } else if (optionSelect.value === "2") {
        materialSelection.style.display = "none";
        manualInput.style.display = "block";
    }
});

function getTensileAndCrushingStress(n) {
    switch (n) {
        case 1:
            return [276, 265];
        case 2:
            return [200, 390];
        case 3:
            return [380, 370];
        case 4:
            return [410, 405];
        case 5:
            return [460, 450];
        case 6:
            return [490, 450];
        case 7:
            return [600, 580];
        case 8:
            return [640, 620];
    }
}

function calculate() {
    const p = parseFloat(axialForceInput.value);
    const n = Number(optionSelect.value);
    showing = true;
    const show = () => {
        console.log("running");
        document.getElementById("c2").style.display = "block";

    }

    let s, z;
    if (n == 1) {
        [s, z] = getTensileAndCrushingStress(Number(materialSelect.value));
    } else {
        s = parseFloat(yieldStrengthInput.value);
        z = parseFloat(crushingStressInput.value);
    }
    const f = parseFloat(safetyFactorInput.value);

    const t = s / f;
    const c = s / f;
    const l = (0.5 * s) / f;
    const x = z / f;

    const D = Math.sqrt((4 * p) / (Math.PI * t));
    const cD = Math.ceil(D);

    const D1 = 1.1 * D;
    const cD1 = Math.ceil(D1);

    const a = 0.75 * D;
    const ca = Math.ceil(a);
    const b = 1.25 * D;
    const cb = Math.ceil(b);

    const d = Math.cbrt((32 / (Math.PI * t)) * ((p / 2) * (cb / 4 + ca / 3)));
    const cd = Math.ceil(d);

    const d0 = 2 * D;
    const cd0 = Math.ceil(d0);
    const d1 = 1.5 * D;
    const cd1 = Math.ceil(d1);
    const h = .5 * D;
    const ch = Math.ceil(h);

    const sigma_t = p / (cb * (cd0 - cd));
    const csigma_t = Math.ceil(sigma_t);

    let designEye = "Design is safe for eye\n";
    if (csigma_t > t) {
        designEye = "Design is unsafe for eye\n";
    }

    const sigma_c = p / (cb * cd);
    const csigma_c = Math.ceil(sigma_c);

    let designFork = "Design is safe for fork\n";
    if (csigma_c > c) {
        designFork = "Design is unsafe for fork\n";
    }

    const tau = p / (cb * (cd0 - cd));
    const ctau = Math.ceil(tau);

    let designCrush = "Design is safe in crushing\n";
    if (tau > l) {
        designCrush =
            "Design is unsafe & use material with high crushing stress\n";
    }


    const crush = p / (d * b);
    const ccrush = Math.ceil(crush);

    let crush_in_eye = "design of eye is safe in crushing\n";
    if (crush > c ){
        crush_in_eye=
        "Design is unsafe & use another material"
    }

    const tau_pin = (p * 4 )/(2 * Math.PI * d * d);
    const ctau_pin = Math.ceil(tau_pin)

    let pin_shear = "design of pin is safe\n";

    const results = `
    <div class="container">
    <div class="c1">
      <h2>Permissible stress:</h2>
      Tensile stress = ${t} N/mm^2<br>
      Compressive stress = ${c} N/mm^2<br>
      Shear stress = ${l} N/mm^2<br>
      Crushing stress: ${x}<br>
      Diameter (D) = ${D} mm (Rounded to ${cD} mm)<br>
      Enlarged diameter (D1) = ${D1} mm (Rounded to ${cD1} mm)<br>
      Tickness of Fork & Thickness of Single Eye = ${a} mm & ${b} mm respectively (Rounded to ${ca} mm & ${cb} mm)<br>
      Thickness of Pin head = ${h} mm (Rounded to ${ch} mm)<br>
      Diameter of pin = ${d} mm (Rounded to ${cd} mm)<br>
      Outer dia of Eye & Dia of Knuckle pin head = ${d0} mm & ${d1} mm respectively (Rounded to ${cd0} mm & ${cd1} mm)<br>
      
      <h2>Stresses acting in eye:</h2>
      Tensile stress in eye = ${sigma_t} N/mm^2 (Rounded to ${csigma_t} N/mm^2)<br>
      ${designEye}<br>
      Compressive stress in eye = ${sigma_c}
      (Rounded to ${csigma_c} N/mm^2)<br>
      ${designFork}<br>
      Shear stress in eye = ${tau} N/mm^2 (Rounded to ${ctau} N/mm^2)<br>
      crushing stress in eye = ${crush} N/mm^2 <br> 
      
      <h2>Stresses acting in fork:</h2>
      Tensile stress in fork = ${sigma_t} N/mm^2 (Rounded to ${csigma_t} N/mm^2)<br>
      ${designEye}<br>
      Compressive stress in fork = ${sigma_c} N/mm^2 (Rounded to ${csigma_c} N/mm^2)<br>
      ${designFork}<br>
      Shear stress in fork = ${tau} N/mm^2 (Rounded to ${ctau} N/mm^2)<br><br>

      <h2>Stress acting in Pin:</h2>
      Double shear in pin=${tau_pin} N/mm^2<br>
      Pin is safe in double shear <br>
      
      Crushing stress: ${x} N/mm^2<br>
      ${crush_in_eye}<br><br>

      <button id="btn">Get design</button>
      </div>
      <div id="c2" style="display: none;">
      <image src="./Knuckle.png" alt="no photo">
      </div>
      </div>
      
      <h3>THANK YOU</h3>
  `;

  outputElement.innerHTML = results;
  document.getElementById("btn").addEventListener("click", show)
}

calculateButton.addEventListener("click", calculate);
