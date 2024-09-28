// Elements
const form = document.getElementById('transaction-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const typeInput = document.getElementById('type');
const transactionList = document.getElementById('transaction-list');
const totalBalanceEl = document.getElementById('total-balance');
const totalIncomeEl = document.getElementById('total-income');
const totalExpenseEl = document.getElementById('total-expense');
const filters = document.querySelectorAll('input[name="filter"]');

// Transactions array
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// Update balance, income, and expenses
function updateBalance() {
    const amounts = transactions.map(transaction => transaction.amount);
    const totalBalance = amounts.reduce((acc, amount) => acc + amount, 0);
    const income = amounts.filter(amount => amount > 0).reduce((acc, amount) => acc + amount, 0);
    const expense = amounts.filter(amount => amount < 0).reduce((acc, amount) => acc + amount, 0);

    totalBalanceEl.textContent = `$${totalBalance.toFixed(2)}`;
    totalIncomeEl.textContent = `$${income.toFixed(2)}`;
    totalExpenseEl.textContent = `$${Math.abs(expense).toFixed(2)}`;
}

// Render transactions based on filter
function renderTransactions() {
    transactionList.innerHTML = '';

    const filterValue = document.querySelector('input[name="filter"]:checked').value;
    let filteredTransactions = transactions;

    if (filterValue === 'income') {
        filteredTransactions = transactions.filter(transaction => transaction.amount > 0);
    } else if (filterValue === 'expense') {
        filteredTransactions = transactions.filter(transaction => transaction.amount < 0);
    }

    filteredTransactions.forEach((transaction, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${transaction.description} <span>${transaction.amount > 0 ? '+' : ''}${transaction.amount}</span>
            <button onclick="editTransaction(${index})">Edit</button>
            <button onclick="deleteTransaction(${index})">Delete</button>
        `;
        transactionList.appendChild(li);
    });
    updateBalance();
}

// Add transaction
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const description = descriptionInput.value;
    const amount = +amountInput.value;
    const type = typeInput.value;

    const newTransaction = {
        description,
        amount: type === 'income' ? amount : -amount,
    };

    transactions.push(newTransaction);
    updateLocalStorage();
    renderTransactions();

    // Clear form inputs
    descriptionInput.value = '';
    amountInput.value = '';
});

// Edit transaction
function editTransaction(index) {
    const transaction = transactions[index];
    descriptionInput.value = transaction.description;
    amountInput.value = Math.abs(transaction.amount);
    typeInput.value = transaction.amount > 0 ? 'income' : 'expense';

    // Remove the old entry
    transactions.splice(index, 1);
    updateLocalStorage();
    renderTransactions();
}

// Delete transaction
function deleteTransaction(index) {
    transactions.splice(index, 1);
    updateLocalStorage();
    renderTransactions();
}

// Save to localStorage
function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Filter functionality
filters.forEach(filter => {
    filter.addEventListener('change', renderTransactions);
});

// Initial render
renderTransactions();
