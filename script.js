// =============================================
// ОСНОВНЫЕ НАСТРОЙКИ И ПЕРЕМЕННЫЕ
// =============================================

// Массив предопределенных чисел
const predefinedNumbers = [7, 42, 15, 23, 56, 89, 10, 3, 77, 100, 33, 66, 12, 45, 78, 5, 18, 91, 24, 37];

// Текущий индекс в массиве
let currentPredefinedIndex = 0;

// История генераций
let generationHistory = [];

// Статистика
let totalGenerated = 0;
let sumOfNumbers = 0;

// =============================================
// ПОЛУЧЕНИЕ ЭЛЕМЕНТОВ DOM
// =============================================
const minInput = document.getElementById('min-value');
const maxInput = document.getElementById('max-value');
const generateBtn = document.getElementById('generate-btn');
const resultElement = document.getElementById('result');
const currentRangeElement = document.getElementById('current-range');
const historyList = document.getElementById('history-list');
const historyEmpty = document.getElementById('history-empty');
const clearHistoryBtn = document.getElementById('clear-history');
const resetAllBtn = document.getElementById('reset-all');

// =============================================
// ОСНОВНЫЕ ФУНКЦИИ
// =============================================

/**
 * Обновляет отображение текущего диапазона
 */
function updateCurrentRange() {
    const min = parseInt(minInput.value) || 1;
    const max = parseInt(maxInput.value) || 100;
    if (currentRangeElement) {
        currentRangeElement.textContent = `${min} - ${max}`;
    }
}

/**
 * Изменяет значение поля ввода
 */
function changeValue(field, delta) {
    const input = field === 'min' ? minInput : maxInput;
    let value = parseInt(input.value) || 0;
    value += delta;
    
    // Проверка границ
    const minVal = parseInt(input.min);
    const maxVal = parseInt(input.max);
    
    if (!isNaN(minVal) && value < minVal) value = minVal;
    if (!isNaN(maxVal) && value > maxVal) value = maxVal;
    
    input.value = value;
    updateCurrentRange();
}

/**
 * Устанавливает диапазон
 */
function setRange(min, max) {
    minInput.value = min;
    maxInput.value = max;
    updateCurrentRange();
    alert(`Диапазон установлен: ${min} - ${max}`);
}

/**
 * Получает следующее предопределенное число
 */
function getNextPredefinedNumber() {
    const number = predefinedNumbers[currentPredefinedIndex];
    currentPredefinedIndex = (currentPredefinedIndex + 1) % predefinedNumbers.length;
    return number;
}

/**
 * Генерирует "случайное" число
 */
function generateRandomNumber() {
    const min = parseInt(minInput.value) || 1;
    const max = parseInt(maxInput.value) || 100;
    
    // Валидация
    if (min > max) {
        alert("❌ Ошибка: Минимальное значение не может быть больше максимального!");
        return null;
    }
    
    if (min === max) {
        return {
            number: min,
            min: min,
            max: max,
            isPredefined: false,
            timestamp: new Date().toLocaleTimeString()
        };
    }
    
    // Пытаемся использовать предопределенное число
    let attempts = 0;
    let foundNumber = null;
    let isPredefined = false;
    
    while (attempts < predefinedNumbers.length * 2 && !foundNumber) {
        const number = getNextPredefinedNumber();
        
        if (number >= min && number <= max) {
            foundNumber = number;
            isPredefined = true;
        }
        
        attempts++;
    }
    
    // Если не нашли подходящее предопределенное число
    if (!foundNumber) {
        foundNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        isPredefined = false;
    }
    
    return {
        number: foundNumber,
        min: min,
        max: max,
        isPredefined: isPredefined,
        timestamp: new Date().toLocaleTimeString()
    };
}

/**
 * Отображает результат
 */
function displayResult(result) {
    if (!result) return;
    
    // Анимация
    resultElement.classList.remove('result-animation');
    void resultElement.offsetWidth;
    resultElement.classList.add('result-animation');
    
    // Отображение числа
    resultElement.textContent = result.number;
    
    // Обновление статистики
    totalGenerated++;
    sumOfNumbers += result.number;
    
    // Добавление в историю
    addToHistory(result);
}

/**
 * Добавляет результат в историю
 */
function addToHistory(result) {
    const historyItem = {
        number: result.number,
        min: result.min,
        max: result.max,
        timestamp: result.timestamp,
        id: Date.now()
    };
    
    generationHistory.unshift(historyItem);
    
    // Ограничиваем историю 20 записями
    if (generationHistory.length > 20) {
        generationHistory = generationHistory.slice(0, 20);
    }
    
    updateHistoryDisplay();
}

/**
 * Обновляет отображение истории
 */
function updateHistoryDisplay() {
    if (!historyList || !historyEmpty) return;
    
    historyList.innerHTML = '';
    
    if (generationHistory.length === 0) {
        historyEmpty.style.display = 'flex';
        return;
    }
    
    historyEmpty.style.display = 'none';
    
    generationHistory.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        historyItem.innerHTML = `
            <div class="history-number">${item.number}</div>
            <div class="history-range">${item.min} - ${item.max}</div>
            <div class="history-time">${item.timestamp}</div>
        `;
        
        historyList.appendChild(historyItem);
    });
}

/**
 * Очищает историю
 */
function clearHistory() {
    if (confirm("Вы уверены, что хотите очистить всю историю?")) {
        generationHistory = [];
        updateHistoryDisplay();
        alert("История очищена!");
    }
}

/**
 * Сбрасывает всё
 */
function resetAll() {
    if (confirm("Сбросить все настройки и историю?")) {
        minInput.value = 1;
        maxInput.value = 100;
        resultElement.textContent = '—';
        generationHistory = [];
        totalGenerated = 0;
        sumOfNumbers = 0;
        currentPredefinedIndex = 0;
        
        updateCurrentRange();
        updateHistoryDisplay();
        
        alert("Все настройки сброшены!");
    }
}

/**
 * Генерирует 5 чисел сразу
 */
function generateMultiple() {
    const min = parseInt(minInput.value) || 1;
    const max = parseInt(maxInput.value) || 100;
    
    if (min > max) {
        alert("❌ Ошибка: Минимальное значение не может быть больше максимального!");
        return;
    }
    
    let numbers = [];
    for (let i = 0; i < 5; i++) {
        const result = generateRandomNumber();
        if (result) {
            numbers.push(result.number);
            addToHistory(result);
            totalGenerated++;
            sumOfNumbers += result.number;
        }
    }
    
    resultElement.textContent = numbers.join(', ');
    alert(`Сгенерировано 5 чисел: ${numbers.join(', ')}`);
}

// =============================================
// НАСТРОЙКА СОБЫТИЙ
// =============================================

function setupEventListeners() {
    // Основная кнопка генерации
    if (generateBtn) {
        generateBtn.addEventListener('click', function() {
            const result = generateRandomNumber();
            displayResult(result);
        });
    }
    
    // Кнопка очистки истории
    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', clearHistory);
    }
    
    // Кнопка сброса всего
    if (resetAllBtn) {
        resetAllBtn.addEventListener('click', resetAll);
    }
    
    // Кнопка генерации 5 чисел
    const generateMultipleBtn = document.getElementById('generate-multiple');
    if (generateMultipleBtn) {
        generateMultipleBtn.addEventListener('click', generateMultiple);
    }
    
    // Обновление диапазона при изменении полей
    if (minInput && maxInput) {
        minInput.addEventListener('input', updateCurrentRange);
        maxInput.addEventListener('input', updateCurrentRange);
        minInput.addEventListener('change', updateCurrentRange);
        maxInput.addEventListener('change', updateCurrentRange);
    }
    
    // Генерация по Enter
    if (minInput) {
        minInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const result = generateRandomNumber();
                displayResult(result);
            }
        });
    }
    
    if (maxInput) {
        maxInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const result = generateRandomNumber();
                displayResult(result);
            }
        });
    }
}

// =============================================
// ИНИЦИАЛИЗАЦИЯ
// =============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Light Randomizer загружен');
    
    // Настройка событий
    setupEventListeners();
    
    // Инициализация
    updateCurrentRange();
    updateHistoryDisplay();
    
    // Добавляем быстрые клавиши
    document.addEventListener('keydown', function(e) {
        // Пробел - генерация
        if (e.code === 'Space' && !e.target.matches('input')) {
            e.preventDefault();
            const result = generateRandomNumber();
            displayResult(result);
        }
        
        // R - сброс
        if (e.code === 'KeyR' && e.ctrlKey) {
            e.preventDefault();
            resetAll();
        }
    });
    
    console.log('Готов к работе! Используйте: Space - генерация, Ctrl+R - сброс');
});