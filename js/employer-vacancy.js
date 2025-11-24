// Employer Vacancy Creation with New Auth System
class EmployerVacancy {
    constructor() {
        this.currentUser = null;
        this.userCompany = null;
        this.init();
    }
    
    init() {
        this.checkAuth()
            .then(() => this.setupEventListeners())
            .then(() => this.showContent())
            .catch((error) => {
                console.error('Vacancy page initialization error:', error);
                this.handleAuthError();
            });
    }
    
    checkAuth() {
        return new Promise((resolve, reject) => {
            // Проверяем общую систему аутентификации
            if (!window.userAuth || !window.userAuth.currentUser) {
                reject(new Error('User not authenticated'));
                return;
            }
            
            this.currentUser = window.userAuth.currentUser;
            this.userCompany = window.userAuth.getUserCompany();
            
            // Проверяем, есть ли у пользователя компания
            if (!this.userCompany) {
                reject(new Error('No company registered'));
                return;
            }
            
            // Заполняем данные компании
            document.getElementById('companyName').value = this.userCompany.companyName;
            resolve();
        });
    }
    
    setupEventListeners() {
        const form = document.getElementById('vacancyForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit();
            });
        }
        
        // AI-помощник для описания вакансии
        const improveDescriptionBtn = document.getElementById('improveDescriptionBtn');
        if (improveDescriptionBtn) {
            improveDescriptionBtn.addEventListener('click', () => {
                this.improveDescription();
            });
        }
        
        // AI-помощник для требований
        const improveRequirementsBtn = document.getElementById('improveRequirementsBtn');
        if (improveRequirementsBtn) {
            improveRequirementsBtn.addEventListener('click', () => {
                this.improveRequirements();
            });
        }
        
        // Кнопка сохранения черновика
        const saveDraftBtn = document.getElementById('saveDraftBtn');
        if (saveDraftBtn) {
            saveDraftBtn.addEventListener('click', () => {
                this.saveDraft();
            });
        }
        
        // Кнопка отмены
        const cancelBtn = document.getElementById('cancelBtn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.handleCancel();
            });
        }
        
        // Кнопка перехода в кабинет
        const dashboardBtn = document.getElementById('dashboardBtn');
        if (dashboardBtn) {
            dashboardBtn.addEventListener('click', () => {
                window.location.href = 'employer-dashboard.html';
            });
        }
        
        // Валидация в реальном времени
        this.setupRealTimeValidation();
    }
    
    setupRealTimeValidation() {
        const requiredFields = document.querySelectorAll('input[required], textarea[required], select[required]');
        
        requiredFields.forEach(field => {
            field.addEventListener('blur', () => {
                this.validateField(field);
            });
            
            field.addEventListener('input', () => {
                this.clearFieldError(field);
            });
        });
    }
    
    validateField(field) {
        if (!field.value.trim()) {
            this.showFieldError(field, 'Это поле обязательно для заполнения');
            return false;
        }
        
        if (field.type === 'email' && !this.isValidEmail(field.value)) {
            this.showFieldError(field, 'Введите корректный email адрес');
            return false;
        }
        
        this.clearFieldError(field);
        return true;
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    showFieldError(field, message) {
        this.clearFieldError(field);
        
        field.classList.add('error');
        
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: #e74c3c;
            font-size: 0.85rem;
            margin-top: 0.25rem;
        `;
        
        field.parentNode.appendChild(errorElement);
    }
    
    clearFieldError(field) {
        field.classList.remove('error');
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }
    
    handleFormSubmit() {
        if (!this.validateForm()) {
            this.showNotification('Пожалуйста, заполните все обязательные поля корректно', 'error');
            return;
        }
        
        const vacancyData = this.collectFormData();
        this.saveVacancy(vacancyData)
            .then(() => {
                this.showNotification('Вакансия успешно создана!', 'success');
                setTimeout(() => {
                    window.location.href = 'employer-dashboard.html';
                }, 1500);
            })
            .catch(error => {
                console.error('Error saving vacancy:', error);
                this.showNotification('Произошла ошибка при сохранении вакансии', 'error');
            });
    }
    
    validateForm() {
        const requiredFields = document.querySelectorAll('input[required], textarea[required], select[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        // Дополнительная проверка контактов
        const contacts = document.getElementById('contacts');
        if (contacts && !contacts.value.trim()) {
            this.showFieldError(contacts, 'Укажите контакты для связи с кандидатами');
            isValid = false;
        }
        
        return isValid;
    }
    
    collectFormData() {
        const formData = {
            // Основная информация
            jobTitle: document.getElementById('jobTitle').value.trim(),
            companyName: document.getElementById('companyName').value.trim(),
            salary: document.getElementById('salary').value.trim(),
            workLocation: document.getElementById('workLocation').value,
            
            // Описание вакансии
            jobDescription: document.getElementById('jobDescription').value.trim(),
            
            // Требования
            requirements: document.getElementById('requirements').value.trim(),
            experienceLevel: document.getElementById('experienceLevel').value,
            
            // Условия работы
            conditions: document.getElementById('conditions').value.trim(),
            workSchedule: document.getElementById('workSchedule').value,
            benefits: document.getElementById('benefits').value.trim(),
            
            // Контактная информация
            contacts: document.getElementById('contacts').value.trim(),
            contactPerson: document.getElementById('contactPerson').value.trim(),
            
            // Дополнительные настройки
            autoPublish: document.getElementById('autoPublish').checked,
            receiveNotifications: document.getElementById('receiveNotifications').checked,
            showSalary: document.getElementById('showSalary').checked,
            
            // Метаданные
            companyId: this.userCompany.id,
            userId: this.currentUser.id,
            status: document.getElementById('autoPublish').checked ? 'active' : 'draft',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        formData.id = this.generateVacancyId();
        
        return formData;
    }
    
    saveVacancy(vacancyData) {
        return new Promise((resolve, reject) => {
            try {
                // Получаем существующие вакансии компании
                const companyVacancies = JSON.parse(
                    localStorage.getItem(`employerVacancies_${this.userCompany.id}`) || '[]'
                );
                
                // Добавляем новую вакансию
                companyVacancies.push(vacancyData);
                
                // Сохраняем обратно в localStorage
                localStorage.setItem(
                    `employerVacancies_${this.userCompany.id}`, 
                    JSON.stringify(companyVacancies)
                );
                
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }
    
    saveDraft() {
        const vacancyData = this.collectFormData();
        vacancyData.status = 'draft';
        
        this.saveVacancy(vacancyData)
            .then(() => {
                this.showNotification('Черновик вакансии сохранен!', 'success');
            })
            .catch(error => {
                console.error('Error saving draft:', error);
                this.showNotification('Ошибка при сохранении черновика', 'error');
            });
    }
    
    improveDescription() {
        const textarea = document.getElementById('jobDescription');
        const currentText = textarea.value.trim();
        
        if (!currentText) {
            this.showNotification('Введите описание вакансии для улучшения', 'warning');
            return;
        }
        
        // Показываем индикатор загрузки
        this.showAILoading('Улучшаем описание...');
        
        // Имитация работы AI (в реальном приложении здесь был бы API вызов)
        setTimeout(() => {
            const improvedText = this.aiImproveDescription(currentText);
            textarea.value = improvedText;
            this.hideAILoading();
            this.showNotification('Описание улучшено с помощью AI!', 'success');
        }, 2000);
    }
    
    improveRequirements() {
        const textarea = document.getElementById('requirements');
        const currentText = textarea.value.trim();
        
        if (!currentText) {
            this.showNotification('Введите требования для оптимизации', 'warning');
            return;
        }
        
        // Показываем индикатор загрузки
        this.showAILoading('Оптимизируем требования...');
        
        // Имитация работы AI
        setTimeout(() => {
            const improvedRequirements = this.aiImproveRequirements(currentText);
            textarea.value = improvedRequirements;
            this.hideAILoading();
            this.showNotification('Требования оптимизированы с помощью AI!', 'success');
        }, 2000);
    }
    
    aiImproveDescription(text) {
        // В реальном приложении здесь был бы вызов к AI API
        const improvements = [
            "\n\n🌟 **Ключевые преимущества:**\n• Современный технологический стек\n• Профессиональная команда\n• Возможности для карьерного роста",
            "\n\n💼 **Что мы предлагаем:**\n• Интересные проекты\n• Стабильную компанию\n• Современный офис/удаленный формат",
            "\n\n🚀 **Перспективы:**\n• Обучение за счет компании\n• Участие в конференциях\n• Регулярный пересмотр зарплаты"
        ];
        
        const randomImprovement = improvements[Math.floor(Math.random() * improvements.length)];
        return text + randomImprovement + "\n\n[Текст улучшен с помощью AI]";
    }
    
    aiImproveRequirements(text) {
        // В реальном приложении здесь был бы вызов к AI API
        const improvements = [
            "\n\n🎯 **Будет плюсом:**\n• Опыт работы в смежных областях\n• Знание английского языка\n• Наличие портфолио",
            "\n\n💡 **Мы ценим:**\n• Ответственность и инициативность\n• Умение работать в команде\n• Стремление к профессиональному развитию",
            "\n\n🏆 **Ключевые компетенции:**\n• Аналитическое мышление\n• Клиентоориентированность\n• Готовность к обучению"
        ];
        
        const randomImprovement = improvements[Math.floor(Math.random() * improvements.length)];
        return text + randomImprovement + "\n\n[Требования оптимизированы с помощью AI]";
    }
    
    showAILoading(message) {
        // Создаем индикатор загрузки
        const loadingIndicator = document.createElement('div');
        loadingIndicator.id = 'aiLoading';
        loadingIndicator.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 20px 30px;
            border-radius: 8px;
            z-index: 10001;
            display: flex;
            align-items: center;
            gap: 15px;
            font-weight: 600;
        `;
        loadingIndicator.innerHTML = `
            <div class="spinner" style="width: 20px; height: 20px; border: 2px solid #f3f3f3; border-top: 2px solid #667eea; border-radius: 50%; animation: spin 1s linear infinite;"></div>
            ${message}
        `;
        
        document.body.appendChild(loadingIndicator);
        
        // Добавляем стили для анимации, если их еще нет
        if (!document.querySelector('#aiLoadingStyles')) {
            const styles = document.createElement('style');
            styles.id = 'aiLoadingStyles';
            styles.textContent = `
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(styles);
        }
    }
    
    hideAILoading() {
        const loadingIndicator = document.getElementById('aiLoading');
        if (loadingIndicator) {
            loadingIndicator.remove();
        }
    }
    
    handleCancel() {
        if (confirm('Вы уверены, что хотите отменить создание вакансии? Все несохраненные данные будут потеряны.')) {
            window.location.href = 'employer-dashboard.html';
        }
    }
    
    handleAuthError() {
        this.showNotification('Для создания вакансии необходимо зарегистрировать компанию', 'error');
        setTimeout(() => {
            window.location.href = 'employer-register.html';
        }, 2000);
    }
    
    generateVacancyId() {
        return 'vacancy_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    }
    
    showContent() {
        const preloader = document.getElementById('preloader');
        const content = document.getElementById('employerContent');
        
        if (preloader) {
            preloader.style.display = 'none';
        }
        
        if (content) {
            content.style.display = 'block';
            content.style.opacity = '0';
            content.style.transition = 'opacity 0.3s ease';
            
            setTimeout(() => {
                content.style.opacity = '1';
            }, 50);
        }
    }
    
    showNotification(message, type = 'info') {
        // Используем общую систему уведомлений или создаем простую
        if (window.userAuth && window.userAuth.showNotification) {
            window.userAuth.showNotification(message, type);
        } else {
            // Простая реализация уведомлений
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${this.getNotificationColor(type)};
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                z-index: 10000;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                max-width: 400px;
            `;
            notification.textContent = message;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 5000);
        }
    }
    
    getNotificationColor(type) {
        const colors = {
            success: '#27ae60',
            error: '#e74c3c',
            info: '#3498db',
            warning: '#f39c12'
        };
        return colors[type] || colors.info;
    }
}

// Добавляем стили для ошибок в CSS
const errorStyles = document.createElement('style');
errorStyles.textContent = `
    .form-group input.error,
    .form-group textarea.error,
    .form-group select.error {
        border-color: #e74c3c !important;
        background-color: #fdf2f2;
    }
    
    .field-error {
        color: #e74c3c;
        font-size: 0.85rem;
        margin-top: 0.25rem;
        display: block;
    }
    
    .btn-cancel {
        background: #95a5a6;
        color: white;
        border: none;
        padding: 12px 25px;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .btn-cancel:hover {
        background: #7f8c8d;
        transform: translateY(-2px);
    }
    
    .visually-hidden {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        border: 0;
    }
    
    .field-hint {
        display: block;
        font-size: 0.85rem;
        color: #666;
        margin-top: 0.25rem;
    }
`;
document.head.appendChild(errorStyles);

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    new EmployerVacancy();
});