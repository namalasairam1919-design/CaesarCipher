
// ===== Elements =====
const message = document.getElementById("message");
const result = document.getElementById("result");
const shiftInput = document.getElementById("shift");
const charCount = document.getElementById("charCount");

const encryptTab = document.getElementById("encryptTab");
const decryptTab = document.getElementById("decryptTab");
const processBtn = document.getElementById("processBtn");
const actionText = document.getElementById("actionText");
const copyBtn = document.getElementById("copyBtn");

let currentMode = "encrypt";

// ===== Character Counter =====
message.addEventListener("input", () => {
    charCount.textContent = `${message.value.length}/500`;
});

// ===== Mode Selection =====
function setMode(mode) {
    currentMode = mode;

    encryptTab.classList.toggle("active", mode === "encrypt");
    decryptTab.classList.toggle("active", mode === "decrypt");

    if (mode === "encrypt") {
        actionText.textContent = "🔒 Encrypt Message";
        result.placeholder = "Encrypted text will appear here...";
    } else {
        actionText.textContent = "🔓 Decrypt Message";
        result.placeholder = "Decrypted text will appear here...";
    }

    result.value = "";
}

encryptTab.addEventListener("click", () => setMode("encrypt"));
decryptTab.addEventListener("click", () => setMode("decrypt"));

// ===== Shift Controls =====
function updateShift(value) {
    let number = Number(value);

    if (!Number.isFinite(number)) number = 3;

    number = Math.max(1, Math.min(25, Math.floor(number)));

    shiftInput.value = number;
}

document.getElementById("minus").addEventListener("click", () => {
    updateShift(Number(shiftInput.value) - 1);
});

document.getElementById("plus").addEventListener("click", () => {
    updateShift(Number(shiftInput.value) + 1);
});

shiftInput.addEventListener("change", () => {
    updateShift(shiftInput.value);
});

// ===== Encrypt / Decrypt =====
processBtn.addEventListener("click", async () => {

    const text = message.value;
    const shift = Number(shiftInput.value);

    if (!text.trim()) {
        alert("Please enter your message first!");
        return;
    }

    if (text.length > 500) {
        alert("Maximum 500 characters allowed!");
        return;
    }

    if (!Number.isInteger(shift) || shift < 1 || shift > 25) {
        alert("Shift must be between 1 and 25!");
        return;
    }

    processBtn.disabled = true;
    actionText.textContent = "Processing...";

    try {
        const response = await fetch(`/api/${currentMode}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: text,
                shift: shift
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Something went wrong");
        }

        result.value = data.result;

    } catch (error) {
        alert("Error: " + error.message);
    } finally {
        processBtn.disabled = false;

        actionText.textContent =
            currentMode === "encrypt"
                ? "🔒 Encrypt Message"
                : "🔓 Decrypt Message";
    }
});

// ===== Copy Result =====
copyBtn.addEventListener("click", async () => {
    if (!result.value) {
        alert("No result to copy!");
        return;
    }

    try {
        await navigator.clipboard.writeText(result.value);
        copyBtn.textContent = "✓ Copied!";
        setTimeout(() => copyBtn.textContent = "▢ Copy", 1500);
    } catch {
        result.select();
        document.execCommand("copy");
        alert("Result copied!");
    }
});

// ===== Dark Mode =====
const themeToggle = document.getElementById("themeToggle");

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    themeToggle.textContent =
        document.body.classList.contains("dark") ? "☀️" : "🌙";
});

