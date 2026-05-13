// === ЛР №2: Динамічний список (Додавання тем) ===
const addBtn = document.getElementById('addBtn');
const topicInput = document.getElementById('topicInput');
const topicList = document.getElementById('topicList');

if (addBtn) {
    addBtn.addEventListener('click', function() {
        const text = topicInput.value.trim();
        if (text === '') return alert("Введіть тему!");
        
        const li = document.createElement('li');
        li.innerHTML = `${text} <button class="delete-btn">Видалити</button>`;
        topicList.appendChild(li);
        topicInput.value = '';
    });
}

// === ЛР №2: Видалення елементів (DOM) ===
document.addEventListener('click', function(e) {
    if (e.target && e.target.classList.contains('delete-btn')) {
        e.target.parentElement.remove();
    }
});

// === ЛР №2: Варіант 8 (Згортання та розгортання) ===
function toggleAccordion() {
    const content = document.getElementById('accordion-content');
    const btn = document.querySelector('.accordion-btn');
    
    if (content.style.display === "none" || content.style.display === "") {
        content.style.display = "block";
        btn.innerText = "Приховати деталі методики ▲";
    } else {
        content.style.display = "none";
        btn.innerText = "Детальніше про методику навчання ▼";
    }
}

// === ЛР №4: AJAX GET (Завантаження курсів) ===
async function loadCourses(category) {
    const container = document.getElementById('coursesContainer');
    if (!container) return;

    // 1. Показуємо повідомлення про завантаження
    container.innerHTML = "<p>Отримання даних з сервера...</p>";

    // 2. Імітуємо затримку AJAX-запиту
    setTimeout(() => {
        try {
            const mockData = [
                { id: 1, name: "Алгебра 7-9 клас", price: 400, category: "school", description: "Базові теми та підготовка до ДПА." },
                { id: 2, name: "Підготовка до НМТ", price: 600, category: "exam", description: "Повний розбір тестових завдань." },
                { id: 3, name: "Геометрія", price: 450, category: "school", description: "Планіметрія та стереометрія." },
                { id: 4, name: "Математика (Профіль)", price: 550, category: "exam", description: "Складні задачі та параметри." }
            ];

            // 3. Фільтрація даних
            const filteredData = category === 'all' 
                ? mockData 
                : mockData.filter(item => item.category === category);

            container.innerHTML = ""; 

            if (filteredData.length === 0) {
                container.innerHTML = "<p>Курсів не знайдено.</p>";
                return;
            }

            // 4. Відображення карток
            filteredData.forEach(item => {
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                    <p style="color: #2c3e50; font-weight: bold;">Ціна: ${item.price} грн</p>
                `;
                container.appendChild(card);
            });

        } catch (error) {
            container.innerHTML = "<p style='color:red;'>Помилка завантаження даних.</p>";
        }
    }, 800);
}

// === ЛР №3: Валідація імені (Тільки літери) ===
const nameInput = document.getElementById('userName');
if (nameInput) {
    nameInput.addEventListener('input', function() {
        this.value = this.value.replace(/[0-9]/g, '');
        const nameError = document.getElementById('nameError');
        if (/\d/.test(this.value)) {
            this.style.borderColor = "red";
            if(nameError) nameError.innerText = "Використовуйте лише літери!";
        } else {
            this.style.borderColor = "";
            if(nameError) nameError.innerText = "";
        }
    });
}

// === ДОДАТКОВО: Робота з LocalStorage (Відображення заявок) ===
function displayOrders() {
    const ordersList = document.getElementById('ordersList');
    if (!ordersList) return;
    const savedOrders = JSON.parse(localStorage.getItem('mySiteOrders')) || [];

    if (savedOrders.length === 0) {
        ordersList.innerHTML = "<p>Заявок поки немає...</p>";
        return;
    }

    ordersList.innerHTML = savedOrders.map((order, index) => `
        <div class="card" style="border-left: 5px solid #2c3e50; padding: 15px; background: white; margin-bottom: 10px;">
            <p><strong>Заявка №${index + 1}</strong></p>
            <p>👤 Ім'я: ${order.userName}</p>
            <p>📚 Рівень: ${order.level}</p>
            <p>💻 Формат: ${order.format}</p>
            <p style="font-size: 0.75rem; color: gray; margin-top: 10px;">🕒 ${order.date}</p>
        </div>
    `).join('');
}

function clearOrders() {
    if (confirm("Видалити всі збережені заявки?")) {
        localStorage.removeItem('mySiteOrders');
        displayOrders();
    }
}

// === ЛР №5: AJAX POST (Відправка форми) ===
const orderForm = document.getElementById('orderForm');
if (orderForm) {
    orderForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const nameValue = document.getElementById('userName').value;
        if (/\d/.test(nameValue)) {
            alert("Помилка: Ім'я не може містити цифри!");
            return;
        }

        const formData = new FormData(orderForm);
        const name = formData.get('userName');
        if (!name) return alert("Будь ласка, введіть ваше ім'я!");

        // Дані для відправки та збереження
        const orderData = {
            userName: name,
            level: formData.get('level'),
            format: formData.get('format'),
            date: new Date().toLocaleString()
        };

        try {
            const btn = document.getElementById('submitBtn');
            btn.innerText = "Відправка...";
            btn.disabled = true;

            // 1. Зберігаємо локально в LocalStorage
            const savedOrders = JSON.parse(localStorage.getItem('mySiteOrders')) || [];
            savedOrders.push(orderData);
            localStorage.setItem('mySiteOrders', JSON.stringify(savedOrders));
            displayOrders();

            // 2. Відправляємо на MockAPI
            await fetch('https://672664532793280802c0190a.mockapi.io/api/v1/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });

            // Успішне завершення
            orderForm.style.display = 'none';
            document.getElementById('resultBlock').style.display = 'block';
            document.getElementById('resultContent').innerHTML = `<p>Дякуємо, ${name}! Ваша заявка збережена та надіслана.</p>`;
        } catch (err) {
            alert("Помилка відправки на сервер, але заявка збережена локально.");
            const btn = document.getElementById('submitBtn');
            btn.innerText = "Надіслати заявку";
            btn.disabled = false;
        }
    });
}

// Запуск при завантаженні сторінки
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('coursesContainer')) {
        loadCourses('all');
    }
    displayOrders(); // Відобразити список заявок з пам'яті
});
