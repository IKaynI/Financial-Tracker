document.addEventListener('DOMContentLoaded', () => {
    const addItemForm = document.getElementById('add-item-form');
    const addIncomeForm = document.getElementById('add-income-form');
    const expenseList = document.querySelector('.expense-list');

    function updateExpenseList() {
        const items = JSON.parse(localStorage.getItem('items')) || [];
        expenseList.innerHTML = '';

        items.forEach((item, index) => {
            if (item.type === 'expense') {
                const listItem = document.createElement('li');
                const formattedAmount = item.amount ? item.amount.toFixed(2) : '0.00';
                listItem.textContent = `${item.name} - ${item.category} - $${formattedAmount}`;
                listItem.dataset.index = index;
                expenseList.appendChild(listItem);
            }
        });
    }

    function updateExpenseOverview() {
        const items = JSON.parse(localStorage.getItem('items')) || [];
        let totalIncome = 0;
        let totalExpense = 0;

        items.forEach((item) => {
            if (item.type === 'income') {
                totalIncome += parseFloat(item.amount);
            } else if (item.type === 'expense') {
                totalExpense += parseFloat(item.amount);
            }
        });

        const remainingBalance = totalIncome - totalExpense;

        const overviewContent = document.querySelector('.overview-content');
        overviewContent.innerHTML = `
            <p>Total Income: $${totalIncome.toFixed(2)}</p>
            <p>Total Expenses: $${totalExpense.toFixed(2)}</p>
            <p>Remaining Balance: $${remainingBalance.toFixed(2)}</p>
        `;
    }

    addItemForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const itemName = addItemForm.elements['item-name'].value;
        const itemCategory = addItemForm.elements['item-category'].value;
        const itemAmount = addItemForm.elements['item-amount'].value;

        if (itemName.trim() === '' || itemAmount.trim() === '') {
            alert('Please fill in both the name and amount fields.');
            return;
        }

        const newItem = {
            type: 'expense',
            name: itemName,
            category: itemCategory,
            amount: parseFloat(itemAmount),
        };

        let items = JSON.parse(localStorage.getItem('items')) || [];
        items.push(newItem);
        localStorage.setItem('items', JSON.stringify(items));

        addItemForm.reset();
        updateExpenseList();
        updateExpenseOverview();
    });

    addIncomeForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const incomeCategory = addIncomeForm.elements['income-category'].value;
        const incomeAmount = addIncomeForm.elements['income-amount'].value;

        if (incomeAmount.trim() === '') {
            alert('Please fill in the amount field.');
            return;
        }

        const newIncome = {
            type: 'income',
            category: incomeCategory,
            amount: parseFloat(incomeAmount),
        };

        let items = JSON.parse(localStorage.getItem('items')) || [];
        items.push(newIncome);
        localStorage.setItem('items', JSON.stringify(items));

        addIncomeForm.reset();
        updateExpenseList();
        updateExpenseOverview();
    });

    function clearStoredData() {
        localStorage.removeItem('items');
        updateExpenseList();
        updateExpenseOverview();
    }

    document.getElementById('clear-storage').addEventListener('click', () => {
        if (confirm('Are you sure you want to clear the stored data? This action cannot be undone.')) {
            clearStoredData();
        }
    });

    updateExpenseList();
    updateExpenseOverview();
});
