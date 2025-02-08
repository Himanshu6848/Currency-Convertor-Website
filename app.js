const BASE_URL = "https://api.exchangerate-api.com/v4/latest/${fromCurr.value}";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

for (let select of dropdowns) {
    for (currCode in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;
        if (select.name === "from" && currCode === "USD") {
            newOption.selected = "selected";
        } else if (select.name === "to" && currCode === "INR") {
            newOption.selected = "selected";
        }
        select.append(newOption);
    }

    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

const updateExchangeRate = async () => {
    let amount = document.querySelector(".amount input");
    let amtVal = parseFloat(amount.value);

    if (isNaN(amtVal) || amtVal < 1) {
        amtVal = 1;
        amount.value = "1";
    }

    // Debugging: Check selected currencies before API call
    console.log("From Currency:", fromCurr.value);
    console.log("To Currency:", toCurr.value);

    const URL = `https://api.exchangerate-api.com/v4/latest/${fromCurr.value}`;
    console.log("Fetching data from:", URL); // Debugging

    try {
        let response = await fetch(URL);
        if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);

        let data = await response.json();
        console.log("API Response:", data); // Debugging

        // Ensure the target currency exists in response
        if (!data.rates || !data.rates[toCurr.value]) {
            throw new Error(`Exchange rate for ${toCurr.value} not found`);
        }

        let rate = data.rates[toCurr.value];
        let finalAmount = (amtVal * rate).toFixed(2);

        msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
    } catch (error) {
        console.error("Fetch Error:", error);
        msg.innerText = "Error fetching exchange rate. Please try again.";
    }
};


const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode] || "US"; // Default to "US" if not found
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
};

btn.addEventListener("click", (evt) => {
    evt.preventDefault();
    updateExchangeRate();
});

window.addEventListener("load", () => {
    updateExchangeRate();
});