/**
 * Студия танцев «Black Heart Dance House» (ул. Притыцкого, 62/м, г. Минск)
 * Лабораторная работа № 5: Верстка мобильно-ориентированного приложения
 * Интерактивный функционал веб-приложения (Vanilla JavaScript)
 */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------------------------
    // 1. Мобильное меню (Гамбургер)
    // ----------------------------------------------------------------------
    const burgerBtn = document.getElementById('burgerBtn');
    const navMenu = document.getElementById('navMenu');
    const navBackdrop = document.getElementById('navBackdrop');

    function toggleMenu() {
        if (!burgerBtn || !navMenu) return;
        const isOpen = navMenu.classList.contains('open');
        if (isOpen) {
            navMenu.classList.remove('open');
            burgerBtn.classList.remove('active');
            if (navBackdrop) navBackdrop.classList.remove('open');
            document.body.style.overflow = '';
        } else {
            navMenu.classList.add('open');
            burgerBtn.classList.add('active');
            if (navBackdrop) navBackdrop.classList.add('open');
            document.body.style.overflow = 'hidden';
        }
    }

    if (burgerBtn) burgerBtn.addEventListener('click', toggleMenu);
    if (navBackdrop) navBackdrop.addEventListener('click', toggleMenu);

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu && navMenu.classList.contains('open')) {
                toggleMenu();
            }
        });
    });

    // ----------------------------------------------------------------------
    // 2. Фильтрация карточек направлений (Каталог)
    // ----------------------------------------------------------------------
    const filterBtns = document.querySelectorAll('.filter-btn');
    const danceCards = document.querySelectorAll('.dance-card');

    if (filterBtns.length > 0 && danceCards.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const category = btn.getAttribute('data-filter');

                danceCards.forEach(card => {
                    const cardCat = card.getAttribute('data-category');
                    if (category === 'all' || cardCat === category) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // ----------------------------------------------------------------------
    // 3. Табы расписания по дням недели
    // ----------------------------------------------------------------------
    const dayTabBtns = document.querySelectorAll('.day-tab-btn');
    const scheduleRows = document.querySelectorAll('.schedule-row');

    if (dayTabBtns.length > 0 && scheduleRows.length > 0) {
        dayTabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                dayTabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const day = btn.getAttribute('data-day');

                scheduleRows.forEach(row => {
                    const rowDay = row.getAttribute('data-day');
                    if (day === 'all' || rowDay === day) {
                        row.style.display = 'flex';
                    } else {
                        row.style.display = 'none';
                    }
                });
            });
        });
    }

    // ----------------------------------------------------------------------
    // 4. Интерактивный калькулятор абонемента
    // ----------------------------------------------------------------------
    const chipBtns = document.querySelectorAll('.calc-chip-btn');
    const studentCheck = document.getElementById('studentDiscount');
    const calcResultVal = document.getElementById('calcTotalVal');

    const basePrices = {
        '4': 120,
        '8': 175,
        '12': 240,
        'unlim': 410
    };

    let selectedLessons = '8';

    function updatePrice() {
        if (!calcResultVal) return;
        let price = basePrices[selectedLessons] || 175;
        if (studentCheck && studentCheck.checked) {
            price = Math.round(price * 0.9); // скидка 10% студентам
        }
        calcResultVal.textContent = price + ' BYN';
    }

    if (chipBtns.length > 0) {
        chipBtns.forEach(chip => {
            chip.addEventListener('click', () => {
                chipBtns.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                selectedLessons = chip.getAttribute('data-lessons');
                updatePrice();
            });
        });
    }

    if (studentCheck) {
        studentCheck.addEventListener('change', updatePrice);
    }
    updatePrice();

    // ----------------------------------------------------------------------
    // 5. Модальное окно онлайн-записи
    // ----------------------------------------------------------------------
    const modalBackdrop = document.getElementById('modalBackdrop');
    const modalClose = document.getElementById('modalClose');
    const modalClassName = document.getElementById('modalClassName');
    const bookingForm = document.getElementById('bookingForm');
    const toastMsg = document.getElementById('toastMsg');

    function openModal(directionTitle = 'Танцевальное направление') {
        if (!modalBackdrop) return;
        if (modalClassName) modalClassName.value = directionTitle;
        modalBackdrop.classList.add('open');
    }

    function closeModal() {
        if (!modalBackdrop) return;
        modalBackdrop.classList.remove('open');
    }

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', (e) => {
            if (e.target === modalBackdrop) closeModal();
        });
    }

    document.querySelectorAll('[data-open-modal]').forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const classTitle = trigger.getAttribute('data-class') || 'Exotic Pole Dance';
            openModal(classTitle);
        });
    });

    // Функция показа всплывающего Toast
    function showToast(text) {
        if (!toastMsg) return;
        toastMsg.innerHTML = text;
        toastMsg.classList.add('show');
        setTimeout(() => {
            toastMsg.classList.remove('show');
        }, 4000);
    }

    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nameInput = document.getElementById('bookName');
            const phoneInput = document.getElementById('bookPhone');
            const targetClass = modalClassName ? modalClassName.value : 'Занятие';

            if (!phoneInput.value.trim()) {
                alert('Пожалуйста, введите номер телефона!');
                return;
            }

            closeModal();
            showToast('🎉 <strong>' + (nameInput.value || 'Вы') + '</strong>, вы записаны на <em>' + targetClass + '</em>!<br>Ждем вас по адресу: Притыцкого, 62/м');
            bookingForm.reset();
        });
    }

    // ----------------------------------------------------------------------
    // 6. Действия в личном кабинете ученика (profile.html)
    // ----------------------------------------------------------------------
    const btnRefreshQr = document.getElementById('btnRefreshQr');
    if (btnRefreshQr) {
        btnRefreshQr.addEventListener('click', () => {
            showToast('🔄 QR-код обновлен! Срок действия: 15 минут.');
        });
    }

    document.querySelectorAll('.btn-cancel-workout').forEach(btn => {
        btn.addEventListener('click', () => {
            if (confirm('Вы уверены, что хотите отменить бронирование тренировки? Занятие вернется на баланс абонемента.')) {
                const item = btn.closest('.schedule-row') || btn.closest('li');
                if (item) {
                    item.style.opacity = '0.5';
                    item.style.textDecoration = 'line-through';
                    btn.disabled = true;
                    btn.textContent = 'Отменено';
                }
                showToast('✅ Тренировка отменена. 1 занятие возвращено на баланс!');
            }
        });
    });
});
