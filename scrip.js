// Ambil elemen display dan semua tombol
const display = document.getElementById('display');
const buttons = document.querySelector('.buttons');

// Variabel untuk menyimpan status kalkulator
let firstOperand = null; // Angka pertama
let operator = null;     // Operator (+, -, *, /)
let waitingForSecondOperand = false; // Status menunggu angka kedua

// Fungsi untuk mereset semua variabel
function resetCalculator() {
    display.value = '0';
    firstOperand = null;
    operator = null;
    waitingForSecondOperand = false;
}

// Fungsi untuk menampilkan angka yang diklik
function inputDigit(digit) {
    if (waitingForSecondOperand === true) {
        // Jika sedang menunggu angka kedua, ganti display
        display.value = digit;
        waitingForSecondOperand = false;
    } else {
        // Jika tidak, tambahkan angka ke display yang sudah ada
        const currentValue = display.value;
        display.value = currentValue === '0' ? digit : currentValue + digit;
    }
}

// Fungsi untuk menambahkan titik desimal
function inputDecimal(dot) {
    // Pastikan titik desimal hanya ada satu
    if (waitingForSecondOperand === true) {
        display.value = '0.';
        waitingForSecondOperand = false;
        return;
    }
    
    if (!display.value.includes(dot)) {
        display.value += dot;
    }
}

// Fungsi untuk menangani operasi matematika
function handleOperator(nextOperator) {
    const inputValue = parseFloat(display.value);

    // Cek apakah sudah ada angka pertama yang disimpan
    if (firstOperand === null) {
        firstOperand = inputValue;
    } else if (operator) {
        // Lakukan perhitungan jika operator sudah ada
        const result = calculate(firstOperand, inputValue, operator);
        display.value = String(result);
        firstOperand = result; // Hasil menjadi angka pertama untuk perhitungan selanjutnya
    }

    // Siapkan kalkulator untuk menerima angka kedua
    waitingForSecondOperand = true;
    operator = nextOperator;
}

// Fungsi inti perhitungan
function calculate(num1, num2, op) {
    switch(op) {
        case '+':
            return num1 + num2;
        case '-':
            return num1 - num2;
        case '*':
            return num1 * num2;
        case '/':
            return num1 / num2;
        default:
            return num2;
    }
}

// Fungsi untuk menangani tombol aksi khusus
function handleAction(action) {
    const currentValue = parseFloat(display.value);
    switch(action) {
        case 'clear':
            resetCalculator();
            break;
        case 'plus-minus':
            display.value = (currentValue * -1).toString();
            break;
        case 'percent':
            display.value = (currentValue / 100).toString();
            break;
    }
}


// Event Listener Utama untuk semua klik tombol
buttons.addEventListener('click', (event) => {
    // Pastikan yang diklik adalah tombol
    if (!event.target.matches('button')) {
        return;
    }

    const target = event.target;
    const action = target.dataset.action; // Ambil data-action dari tombol

    // Cek apakah tombol adalah angka
    if (!action) {
        inputDigit(target.textContent);
        return;
    }

    // Cek apakah tombol adalah desimal
    if (action === 'decimal') {
        inputDecimal(target.textContent);
        return;
    }
    
    // Cek apakah tombol adalah operasi dasar
    if (['add', 'subtract', 'multiply', 'divide', 'calculate'].includes(action)) {
        // '=' juga dianggap sebagai pemicu perhitungan
        const op = target.textContent;
        handleOperator(op === '=' ? operator : op); 
        return;
    }

    // Cek apakah tombol adalah aksi khusus (C, ±, %)
    if (['clear', 'plus-minus', 'percent'].includes(action)) {
        handleAction(action);
        return;
    }
});

// Inisialisasi kalkulator saat pertama kali dimuat
resetCalculator();
