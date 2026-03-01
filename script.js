document.addEventListener("DOMContentLoaded", function () {

const service = document.getElementById("service");
const quantity = document.getElementById("quantity");
const totalDisplay = document.getElementById("total");
const descBox = document.getElementById("serviceDesc");
const qrBox = document.getElementById("qrBox");
const qrImage = document.getElementById("qrImage");
const payBtn = document.getElementById("payBtn");
const progressCircle = document.getElementById("progressCircle");

let currentAmount = 0;

// CALCULATE PRICE
function calculate() {
    let price = parseFloat(service.value);
    let qty = parseInt(quantity.value);

    if (!qty || qty < 100) {
        totalDisplay.innerText = "0.00";
        currentAmount = 0;
        return;
    }

    currentAmount = ((price / 1000) * qty).toFixed(2);
    totalDisplay.innerText = currentAmount;
}

// UPDATE DESCRIPTION
service.addEventListener("change", function () {
    descBox.innerText = service.options[service.selectedIndex].dataset.desc;
    calculate();
});

quantity.addEventListener("input", calculate);

// GENERATE QR
window.generateQR = function () {

    calculate();

    if (!currentAmount || currentAmount === "0.00") {
        alert("Enter minimum 100 quantity.");
        return;
    }

    const upiURL = "upi://pay?pa=rahikhann@fam&pn=RAHI%20SMM%20PROVIDER&am=" + currentAmount + "&cu=INR";

    qrImage.src = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" + encodeURIComponent(upiURL);
    qrBox.style.display = "block";

    let seconds = 10;
    payBtn.disabled = true;
    progressCircle.innerText = seconds;

    let interval = setInterval(() => {
        seconds--;
        let degree = (10 - seconds) * 36;
        progressCircle.style.background =
            `conic-gradient(#00f5a0 ${degree}deg, rgba(255,255,255,0.1) ${degree}deg)`;
        progressCircle.innerText = seconds;

        if (seconds <= 0) {
            clearInterval(interval);
            payBtn.disabled = false;
            progressCircle.innerText = "✔";
        }
    }, 1000);
};

// REDIRECT TO GOOGLE FORM
window.paymentDone = function () {

    if (!currentAmount || currentAmount === "0.00") {
        alert("Please generate QR first.");
        return;
    }

    let selectedService = service.options[service.selectedIndex].text;
    let qty = quantity.value;
    let generatedOrderID = "RAHI" + Math.floor(100000 + Math.random() * 900000);

    let formURL =
    "https://docs.google.com/forms/d/e/1FAIpQLSc5Gv_SuCXrYk8PoMzquO9YPFPNohBFhayvqtsABZbEDNs17w/viewform?usp=pp_url"
    + "&entry.1899401784=" + encodeURIComponent(generatedOrderID)
    + "&entry.1259951026=" + encodeURIComponent(selectedService)
    + "&entry.1231461818=" + encodeURIComponent(qty)
    + "&entry.1143870330=" + encodeURIComponent(currentAmount);

    window.location.href = formURL;
};

});