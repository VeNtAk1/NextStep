// Employer Page Application
class EmployerApp {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        console.log('Employer app initialized');
    }
    
    setupEventListeners() {
        const form = document.getElementById('vacancyForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit();
            });
        }
        
        const loginBtn = document.querySelector('.btn-login');
        if (loginBtn) {
            loginBtn.addEventListener('click', () => {
                this.handleLogin();
            });
        }
    }
    
    handleFormSubmit() {
        const formData = {
            jobTitle: document.getElementById('jobTitle').value,
            companyName: document.getElementById('companyName').value,
            salary: document.getElementById('salary').value,
            jobDescription: document.getElementById('jobDescription').value,
            requirements: document.getElementById('requirements').value,
            conditions: document.getElementById('conditions').value,
            contacts: document.getElementById('contacts').value
        };
        
        // В реальном приложении здесь был бы AJAX-запрос
        console.log('Form submitted:', formData);
        alert('Вакансия успешно создана! В реальном приложении здесь будет отправка на сервер.');
        
        // Очистка формы
        document.getElementById('vacancyForm').reset();
    }
    
    improveText() {
        const textarea = document.getElementById('jobDescription');
        const currentText = textarea.value;
        
        if (!currentText.trim()) {
            alert('Пожалуйста, введите текст для улучшения');
            return;
        }
        
        // Имитация работы AI - в реальном приложении здесь был бы запрос к серверу
        const improvedText = this.aiImproveDescription(currentText);
        textarea.value = improvedText;
        
        this.showAIMessage('Текст успешно улучшен с помощью AI!');
    }
    
    improveRequirements() {
        const textarea = document.getElementById('requirements');
        const currentText = textarea.value;
        
        if (!currentText.trim()) {
            alert('Пожалуйста, введите требования для оптимизации');
            return;
        }
        
        // Имитация работы AI
        const improvedRequirements = this.aiImproveRequirements(currentText);
        textarea.value = improvedRequirements;
        
        this.showAIMessage('Требования оптимизированы с помощью AI!');
    }
    
    aiImproveDescription(text) {
        // Заглушка для AI-улучшения текста
        // В реальном приложении здесь был бы вызов к AI API
        return text + '\n\n[Улучшено AI: Добавлены ключевые моменты для привлечения кандидатов]';
    }
    
    aiImproveRequirements(text) {
        // Заглушка для AI-оптимизации требований
        return text + '\n\n[Оптимизировано AI: Сформулированы четкие и измеримые требования]';
    }
    
    showAIMessage(message) {
        // Создаем временное уведомление
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 3000);
    }
    
    handleLogin() {
        alert('Функция входа для работодателей будет доступна в ближайшее время!');
    }
}

// Инициализация приложения после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    window.employerApp = new EmployerApp();
});