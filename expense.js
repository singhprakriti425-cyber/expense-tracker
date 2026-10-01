/* =====================================================
   EXPENSE TRACKER
   Plain JavaScript + localStorage
===================================================== */


/* ================= DATA ================= */

let transactions =
    JSON.parse(localStorage.getItem("expenseTransactions")) || [];

let selectedMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
);


/* ================= ELEMENTS ================= */

const form =
    document.getElementById("expenseForm");

const amountInput =
    document.getElementById("amount");

const typeInput =
    document.getElementById("type");

const categoryInput =
    document.getElementById("category");

const dateInput =
    document.getElementById("date");

const descriptionInput =
    document.getElementById("description");

const calendar =
    document.getElementById("calendar");

const currentMonth =
    document.getElementById("currentMonth");

const transactionList =
    document.getElementById("transactionList");

const historyList =
    document.getElementById("historyList");

const chart =
    document.getElementById("chart");

const emotionEmoji =
    document.getElementById("emotionEmoji");

const emotionTitle =
    document.getElementById("emotionTitle");

const emotionMessage =
    document.getElementById("emotionMessage");

const moneyTip =
    document.getElementById("moneyTip");

const selectedDay =
    document.getElementById("selectedDay");

const themeToggle =
    document.getElementById("themeToggle");


/* ================= SAVE DATA ================= */

function saveData() {

    localStorage.setItem(
        "expenseTransactions",
        JSON.stringify(transactions)
    );

}


/* ================= MONTH NAME ================= */

function getMonthName(date) {

    return date.toLocaleString(
        "en-IN",
        {
            month: "long",
            year: "numeric"
        }
    );

}


/* ================= MONTH FILTER ================= */

function getMonthTransactions() {

    return transactions.filter(item => {

        const d = new Date(item.date + "T00:00:00");

        return (
            d.getMonth() === selectedMonth.getMonth() &&
            d.getFullYear() === selectedMonth.getFullYear()
        );

    });

}


/* ================= ADD TRANSACTION ================= */

form.addEventListener("submit", function(event) {

    event.preventDefault();


    const amount =
        Number(amountInput.value);


    if (!amount || amount <= 0) {

        alert("Please enter a valid amount.");

        return;

    }


    const transaction = {

        id: Date.now(),

        amount: amount,

        type: typeInput.value,

        category: categoryInput.value,

        date: dateInput.value,

        description: descriptionInput.value.trim()

    };


    transactions.push(transaction);

    saveData();

    form.reset();


    dateInput.value =
        formatDateForInput(new Date());


    renderAll();

    showExpenseReaction();

});


/* ================= DELETE ================= */

function deleteTransaction(id) {

    transactions =
        transactions.filter(
            item => item.id !== id
        );

    saveData();

    renderAll();

}


/* ================= FORMAT DATE ================= */

function formatDateForInput(date) {

    const year =
        date.getFullYear();

    const month =
        String(date.getMonth() + 1)
        .padStart(2, "0");

    const day =
        String(date.getDate())
        .padStart(2, "0");

    return `${year}-${month}-${day}`;

}


/* ================= CALCULATIONS ================= */

function calculateMonth() {

    const data =
        getMonthTransactions();


    let income = 0;

    let expense = 0;


    data.forEach(item => {

        if (item.type === "income") {

            income += item.amount;

        } else {

            expense += item.amount;

        }

    });


    return {

        income,
        expense,
        balance: income - expense

    };

}


/* ================= UPDATE SUMMARY ================= */

function updateSummary() {

    const data =
        calculateMonth();


    animateNumber(
        document.getElementById("totalIncome"),
        data.income
    );


    animateNumber(
        document.getElementById("totalExpense"),
        data.expense
    );


    animateNumber(
        document.getElementById("remainingBalance"),
        data.balance
    );

}


/* ================= NUMBER ANIMATION ================= */

function animateNumber(element, target) {

    const start =
        Number(
            element.dataset.value || 0
        );

    const duration = 500;

    const startTime =
        performance.now();


    function update(currentTime) {

        const progress =
            Math.min(
                (currentTime - startTime) /
                duration,
                1
            );


        const value =
            Math.round(
                start +
                (target - start) *
                progress
            );


        element.textContent =
            "₹" +
            value.toLocaleString("en-IN");


        if (progress < 1) {

            requestAnimationFrame(update);

        }

    }


    element.dataset.value = target;

    requestAnimationFrame(update);

}


/* ================= EMOTION ================= */

function showExpenseReaction() {

    const {
        income,
        expense,
        balance
    } = calculateMonth();


    let emoji = "🥰";

    let title =
        "Okayyy, we're doing pretty well.";

    let message =
        "Your wallet can breathe peacefully today. 😌";


    if (income === 0 && expense === 0) {

        emoji = "👀";

        title =
            "Your wallet is suspiciously quiet.";

        message =
            "Add some transactions first. I promise I won't judge... much.";

    }


    else if (income > 0 && expense <= income * 0.4) {

        emoji = "🥰";

        title =
            "Look at you being financially responsible!";

        message =
            `You still have ₹${balance.toLocaleString("en-IN")} left. Your future self is sending you a tiny thank-you. 💗`;

    }


    else if (income > 0 && expense <= income * 0.7) {

        emoji = "🙂";

        title =
            "Okay, we're doing pretty well.";

        message =
            "Nothing too dramatic. Your wallet has survived another month.";

    }


    else if (income > 0 && expense <= income) {

        emoji = "😅";

        title =
            "Umm... your wallet is getting nervous.";

        message =
            "Most of your income has already left the building. Maybe slow down a little?";

    }


    else if (income > 0 && expense > income) {

        emoji = "😭";

        title =
            "Bestie... where did the money GO?";

        message =
            `You spent ₹${Math.abs(balance).toLocaleString("en-IN")} more than your income. Your calculator is concerned.`;

    }


    else if (income === 0 && expense > 0) {

        emoji = "🫠";

        title =
            "We need to talk.";

        message =
            "You have expenses but no income recorded. Your wallet would like to file a complaint.";

    }


    emotionEmoji.textContent = emoji;

    emotionTitle.textContent = title;

    emotionMessage.textContent = message;


    /* restart emoji animation */

    emotionEmoji.style.animation = "none";

    void emotionEmoji.offsetWidth;

    emotionEmoji.style.animation =
        "emotionBounce 1.5s ease-in-out infinite";

}


/* ================= MONEY TIPS ================= */

function generateMoneyTip() {

    const data =
        getMonthTransactions();


    const expenses =
        data.filter(
            item => item.type === "expense"
        );


    if (expenses.length === 0) {

        moneyTip.textContent =
            "Add some expenses and I'll have something to say. 👀";

        return;

    }


    const categoryTotals = {};


    expenses.forEach(item => {

        categoryTotals[item.category] =
            (categoryTotals[item.category] || 0) +
            item.amount;

    });


    const biggestCategory =
        Object.entries(categoryTotals)
            .sort(
                (a, b) => b[1] - a[1]
            )[0];


    const category =
        biggestCategory[0];

    const amount =
        biggestCategory[1];


    const funnyTips = {

        Food:
            `🍕 Food is your biggest expense at ₹${amount.toLocaleString("en-IN")}. Your stomach is clearly running the household now. Maybe cook once in a while? 😭`,

        Shopping:
            `🛍️ You spent ₹${amount.toLocaleString("en-IN")} shopping. Your cart apparently has more financial freedom than you do.`,

        Travel:
            `🚕 ₹${amount.toLocaleString("en-IN")} went into Travel. At this point, your wallet deserves a seatbelt.`,

        Entertainment:
            `🎮 ₹${amount.toLocaleString("en-IN")} on Entertainment. Your bank account is not entertained.`,

        Education:
            `📚 ₹${amount.toLocaleString("en-IN")} on Education. At least this money is trying to improve your future.`,

        Bills:
            `💡 ₹${amount.toLocaleString("en-IN")} went into Bills. Unfortunately, electricity companies don't accept vibes as payment.`,

        Health:
            `💊 ₹${amount.toLocaleString("en-IN")} went into Health. Expensive, but at least your money went somewhere useful.`,

        Other:
            `👀 ₹${amount.toLocaleString("en-IN")} went into "Other". Mysterious. Suspicious. We need answers.`

    };


    moneyTip.textContent =
        funnyTips[category] ||
        `You spent ₹${amount.toLocaleString("en-IN")} mostly on ${category}. Your wallet has opinions. 😭`;

}


/* ================= CALENDAR ================= */

function renderCalendar() {

    calendar.innerHTML = "";


    const year =
        selectedMonth.getFullYear();

    const month =
        selectedMonth.getMonth();


    currentMonth.textContent =
        getMonthName(selectedMonth);


    const firstDay =
        new Date(year, month, 1);


    let startingDay =
        firstDay.getDay();


    /* Monday = 0 */

    startingDay =
        startingDay === 0
            ? 6
            : startingDay - 1;


    const daysInMonth =
        new Date(
            year,
            month + 1,
            0
        ).getDate();


    for (
        let i = 0;
        i < startingDay;
        i++
    ) {

        const empty =
            document.createElement("div");

        empty.className =
            "calendar-day empty";

        calendar.appendChild(empty);

    }


    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {

        const div =
            document.createElement("div");

        div.className =
            "calendar-day";


        const dateString =
            `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;


        const dayExpenses =
            transactions.filter(item =>

                item.date === dateString &&
                item.type === "expense"

            );


        const total =
            dayExpenses.reduce(
                (sum, item) =>
                    sum + item.amount,
                0
            );


        div.innerHTML = `

            <div class="day-number">
                ${day}
            </div>

            ${
                total > 0
                ? `
                    <div class="day-expense">
                        ₹${total.toLocaleString("en-IN")}
                    </div>
                `
                : ""
            }

        `;


        if (total > 0) {

            div.classList.add(
                "has-expense"
            );

        }


        div.addEventListener(
            "click",
            function() {

                showDayExpenses(
                    dateString,
                    day
                );

            }
        );


        calendar.appendChild(div);

    }

}


/* ================= DAY DETAILS ================= */

function showDayExpenses(
    dateString,
    day
) {

    const expenses =
        transactions.filter(item =>

            item.date === dateString

        );


    document
        .querySelectorAll(".calendar-day")
        .forEach(day => {

            day.classList.remove(
                "selected"
            );

        });


    const headingDate =
        new Date(
            dateString + "T00:00:00"
        ).toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "long"
            }
        );


    if (expenses.length === 0) {

        selectedDay.innerHTML =
            `📅 ${headingDate}: No transactions. A peaceful day. 🌸`;

        return;

    }


    let html =
        `<strong>📅 ${headingDate}</strong><br><br>`;


    expenses.forEach(item => {

        const symbol =
            item.type === "income"
                ? "💵"
                : "💸";


        html += `
            ${symbol}
            ${item.description}
            — ₹${item.amount.toLocaleString("en-IN")}
            <br>
        `;

    });


    selectedDay.innerHTML = html;

}


/* ================= CHART ================= */

function renderChart() {

    chart.innerHTML = "";


    const expenses =
        getMonthTransactions()
            .filter(
                item =>
                    item.type === "expense"
            );


    if (expenses.length === 0) {

        chart.innerHTML =
            `<p class="empty">
                No expense data yet 📊
            </p>`;

        return;

    }


    const totals = {};


    expenses.forEach(item => {

        totals[item.category] =
            (totals[item.category] || 0) +
            item.amount;

    });


    const max =
        Math.max(
            ...Object.values(totals)
        );


    Object.entries(totals)
        .sort(
            (a, b) => b[1] - a[1]
        )
        .forEach(
            ([category, amount]) => {

                const row =
                    document.createElement("div");

                row.className =
                    "chart-row";


                const percentage =
                    (amount / max) * 100;


                row.innerHTML = `

                    <div class="chart-label">
                        ${getCategoryEmoji(category)}
                        ${category}
                    </div>

                    <div>
                        <div
                            class="chart-bar"
                            style="width:${percentage}%"
                        ></div>
                    </div>

                    <div class="chart-value">
                        ₹${amount.toLocaleString("en-IN")}
                    </div>

                `;


                chart.appendChild(row);

            }
        );

}


/* ================= CATEGORY EMOJI ================= */

function getCategoryEmoji(category) {

    const emojis = {

        Food: "🍕",

        Travel: "🚕",

        Shopping: "🛍️",

        Education: "📚",

        Bills: "💡",

        Entertainment: "🎮",

        Health: "💊",

        Other: "📦"

    };


    return emojis[category] || "💰";

}


/* ================= TRANSACTIONS ================= */

function renderTransactions() {

    const data =
        getMonthTransactions()
            .sort(
                (a, b) =>
                    new Date(b.date) -
                    new Date(a.date)
            );


    transactionList.innerHTML = "";


    if (data.length === 0) {

        transactionList.innerHTML =
            `<p class="empty">
                No transactions this month 🌸
            </p>`;

        return;

    }


    data.forEach(item => {

        const div =
            document.createElement("div");

        div.className =
            "transaction";


        const icon =
            item.type === "income"
                ? "💵"
                : getCategoryEmoji(item.category);


        const sign =
            item.type === "income"
                ? "+"
                : "-";


        const amountClass =
            item.type === "income"
                ? "income-amount"
                : "expense-amount";


        div.innerHTML = `

            <div class="transaction-left">

                <div class="transaction-icon">
                    ${icon}
                </div>

                <div>

                    <div class="transaction-name">
                        ${escapeHTML(item.description)}
                    </div>

                    <div class="transaction-date">
                        ${item.category}
                        •
                        ${formatDisplayDate(item.date)}
                    </div>

                </div>

            </div>


            <div>

                <strong class="${amountClass}">
                    ${sign}₹${item.amount.toLocaleString("en-IN")}
                </strong>

                <button
                    class="delete-btn"
                    onclick="deleteTransaction(${item.id})"
                    title="Delete"
                >
                    🗑️
                </button>

            </div>

        `;


        transactionList.appendChild(div);

    });

}


/* ================= ESCAPE HTML ================= */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


/* ================= DISPLAY DATE ================= */

function formatDisplayDate(date) {

    return new Date(
        date + "T00:00:00"
    ).toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "short"
        }
    );

}


/* ================= HISTORY ================= */

function renderHistory() {

    historyList.innerHTML = "";


    const months = {};


    transactions.forEach(item => {

        const d =
            new Date(
                item.date + "T00:00:00"
            );


        const key =
            `${d.getFullYear()}-${d.getMonth()}`;


        if (!months[key]) {

            months[key] = {

                date: new Date(
                    d.getFullYear(),
                    d.getMonth(),
                    1
                ),

                income: 0,

                expense: 0,

                count: 0

            };

        }


        if (item.type === "income") {

            months[key].income +=
                item.amount;

        } else {

            months[key].expense +=
                item.amount;

        }


        months[key].count++;

    });


    const monthArray =
        Object.values(months)
            .sort(
                (a, b) =>
                    b.date - a.date
            );


    if (monthArray.length === 0) {

        historyList.innerHTML =
            `<p class="empty">
                Your money diary is empty for now. 🌸
            </p>`;

        return;

    }


    monthArray.forEach(month => {

        const div =
            document.createElement("div");

        div.className =
            "history-item";


        const balance =
            month.income -
            month.expense;


        div.innerHTML = `

            <div class="history-top">

                <strong>
                    ${getMonthName(month.date)}
                </strong>

                <span>
                    ${month.count} transactions
                </span>

            </div>


            <div class="history-stats">

                <span>
                    💵 ₹${month.income.toLocaleString("en-IN")}
                </span>

                <span>
                    💸 ₹${month.expense.toLocaleString("en-IN")}
                </span>

                <span>
                    🏦 ₹${balance.toLocaleString("en-IN")}
                </span>

            </div>

        `;


        historyList.appendChild(div);

    });

}


/* ================= MONTH NAVIGATION ================= */

document
    .getElementById("prevMonth")
    .addEventListener(
        "click",
        function() {

            selectedMonth =
                new Date(
                    selectedMonth.getFullYear(),
                    selectedMonth.getMonth() - 1,
                    1
                );

            renderAll();

        }
    );


document
    .getElementById("nextMonth")
    .addEventListener(
        "click",
        function() {

            selectedMonth =
                new Date(
                    selectedMonth.getFullYear(),
                    selectedMonth.getMonth() + 1,
                    1
                );

            renderAll();

        }
    );


/* ================= RESET MONTH ================= */

document
    .getElementById("resetMonth")
    .addEventListener(
        "click",
        function() {

            const answer =
                confirm(
                    "Start a new month?\n\nYour old expenses will stay safely in History."
                );


            if (!answer) return;


            const nextMonth =
                new Date(
                    selectedMonth.getFullYear(),
                    selectedMonth.getMonth() + 1,
                    1
                );


            selectedMonth =
                nextMonth;


            dateInput.value =
                formatDateForInput(
                    new Date(
                        selectedMonth.getFullYear(),
                        selectedMonth.getMonth(),
                        1
                    )
                );


            renderAll();


            emotionEmoji.textContent =
                "🌸";

            emotionTitle.textContent =
                "Fresh month. Fresh start.";

            emotionMessage.textContent =
                "Let's try not to let the money mysteriously disappear this time. 😭";

        }
    );


/* ================= DARK MODE ================= */

const savedTheme =
    localStorage.getItem(
        "expenseTheme"
    );


if (savedTheme === "dark") {

    document.body.classList.add("dark");

    themeToggle.textContent = "☀️";

}


themeToggle.addEventListener(
    "click",
    function() {

        document.body.classList.toggle(
            "dark"
        );


        const isDark =
            document.body.classList.contains(
                "dark"
            );


        themeToggle.textContent =
            isDark
                ? "☀️"
                : "🌙";


        localStorage.setItem(
            "expenseTheme",
            isDark
                ? "dark"
                : "light"
        );

    }
);


/* ================= MASTER RENDER ================= */

function renderAll() {

    renderCalendar();

    updateSummary();

    renderChart();

    renderTransactions();

    renderHistory();

    generateMoneyTip();

    showExpenseReaction();

}


/* ================= INITIAL DATE ================= */

dateInput.value =
    formatDateForInput(
        new Date()
    );


/* ================= INITIAL LOAD ================= */

renderAll();