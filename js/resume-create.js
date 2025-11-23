/**
 * Resume Creation Module
 * Обрабатывает создание и редактирование резюме
 */
class ResumeCreator {
    constructor() {
        this.isEditing = false;
        this.editingIndex = null;
        this.currentUser = null;
        this.init();
    }

    /**
     * Инициализация модуля
     */
    init() {
        this.checkAuth()
            .then(() => this.checkEditMode())
            .then(() => this.setupEventListeners())
            .then(() => this.updateUI())
            .catch((error) => {
                console.error('Resume creator initialization error:', error);
                this.handleAuthError();
            });
    }

    /**
     * Проверка авторизации пользователя
     */
    checkAuth() {
        return new Promise((resolve, reject) => {
            const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
            
            if (!currentUser) {
                reject(new Error('User not authenticated'));
                return;
            }

            this.currentUser = currentUser;
            resolve();
        });
    }

    /**
     * Проверка режима редактирования
     */
    checkEditMode() {
        return new Promise((resolve) => {
            const editingIndex = sessionStorage.getItem('editingResumeIndex');
            
            if (editingIndex !== null) {
                this.isEditing = true;
                this.editingIndex = parseInt(editingIndex);
                this.loadResumeForEditing();
            }
            
            resolve();
        });
    }

    /**
     * Настройка обработчиков событий
     */
    setupEventListeners() {
        return new Promise((resolve) => {
            const form = document.getElementById('resumeForm');
            const cancelBtn = document.getElementById('cancelBtn');

            if (form) {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.handleSubmit();
                });
            }

            if (cancelBtn) {
                cancelBtn.addEventListener('click', () => {
                    this.handleCancel();
                });
            }

            // Добавляем валидацию в реальном времени
            this.setupRealTimeValidation();
            resolve();
        });
    }

    /**
     * Настройка валидации в реальном времени
     */
    setupRealTimeValidation() {
        const requiredFields = document.querySelectorAll('input[required], textarea[required]');
        
        requiredFields.forEach(field => {
            field.addEventListener('blur', () => {
                this.validateField(field);
            });
            
            field.addEventListener('input', () => {
                this.clearFieldError(field);
            });
        });
    }

    /**
     * Валидация отдельного поля
     */
    validateField(field) {
        if (!field.value.trim()) {
            this.showFieldError(field, 'Это поле обязательно для заполнения');
            return false;
        }
        
        if (field.type === 'email' && !this.isValidEmail(field.value)) {
            this.showFieldError(field, 'Введите корректный email адрес');
            return false;
        }
        
        if (field.type === 'tel' && !this.isValidPhone(field.value)) {
            this.showFieldError(field, 'Введите корректный номер телефона');
            return false;
        }
        
        this.clearFieldError(field);
        return true;
    }

    /**
     * Проверка валидности email
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Проверка валидности телефона
     */
    isValidPhone(phone) {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }

    /**
     * Показать ошибку поля
     */
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

    /**
     * Очистить ошибку поля
     */
    clearFieldError(field) {
        field.classList.remove('error');
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    /**
     * Обновление интерфейса
     */
    updateUI() {
        document.getElementById('userGreeting').textContent = `Здравствуйте, ${this.currentUser.name}`;
        document.getElementById('email').value = this.currentUser.email;

        if (this.isEditing) {
            document.getElementById('pageTitle').textContent = 'Редактирование резюме';
            document.getElementById('pageDescription').textContent = 'Обновите информацию в вашем резюме';
            document.getElementById('submitButtonText').textContent = 'Сохранить изменения';
        }
    }

    /**
     * Загрузка резюме для редактирования
     */
    loadResumeForEditing() {
        const userResumes = JSON.parse(localStorage.getItem(`userResumes_${this.currentUser.id}`) || '[]');
        
        if (userResumes[this.editingIndex]) {
            const resume = userResumes[this.editingIndex];
            this.populateForm(resume);
        }
    }

    /**
     * Заполнение формы данными
     */
    populateForm(resume) {
        const fields = [
            'firstName', 'lastName', 'position', 'email', 'phone', 'city',
            'skills', 'lastJob', 'jobTitle', 'workPeriod', 'experience',
            'education', 'specialty', 'graduationYear', 'about', 'languages'
        ];

        fields.forEach(field => {
            const element = document.getElementById(field);
            if (element && resume[field]) {
                element.value = resume[field];
            }
        });
    }

    /**
     * Обработка отправки формы
     */
    handleSubmit() {
        if (!this.validateForm()) {
            this.showNotification('Пожалуйста, заполните все обязательные поля корректно', 'error');
            return;
        }

        const resumeData = this.collectFormData();
        this.saveResume(resumeData)
            .then(() => {
                const message = this.isEditing ? 'Резюме успешно обновлено!' : 'Резюме успешно создано!';
                this.showNotification(message, 'success');
                this.redirectToMain();
            })
            .catch(error => {
                console.error('Error saving resume:', error);
                this.showNotification('Произошла ошибка при сохранении резюме', 'error');
            });
    }

    /**
     * Валидация всей формы
     */
    validateForm() {
        const requiredFields = document.querySelectorAll('input[required], textarea[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    /**
     * Сбор данных формы
     */
    collectFormData() {
        const resumeData = {
            firstName: document.getElementById('firstName').value.trim(),
            lastName: document.getElementById('lastName').value.trim(),
            position: document.getElementById('position').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            city: document.getElementById('city').value.trim(),
            skills: document.getElementById('skills').value.trim(),
            lastJob: document.getElementById('lastJob').value.trim(),
            jobTitle: document.getElementById('jobTitle').value.trim(),
            workPeriod: document.getElementById('workPeriod').value.trim(),
            experience: document.getElementById('experience').value.trim(),
            education: document.getElementById('education').value.trim(),
            specialty: document.getElementById('specialty').value.trim(),
            graduationYear: document.getElementById('graduationYear').value.trim(),
            about: document.getElementById('about').value.trim(),
            languages: document.getElementById('languages').value.trim(),
            updatedAt: new Date().toISOString()
        };

        if (!this.isEditing) {
            resumeData.createdAt = new Date().toISOString();
            resumeData.id = this.generateResumeId();
        }

        return resumeData;
    }

    /**
     * Сохранение резюме
     */
    saveResume(resumeData) {
        return new Promise((resolve, reject) => {
            try {
                const userResumes = JSON.parse(localStorage.getItem(`userResumes_${this.currentUser.id}`) || '[]');

                if (this.isEditing) {
                    // Сохраняем ID при редактировании
                    resumeData.id = userResumes[this.editingIndex].id;
                    userResumes[this.editingIndex] = resumeData;
                } else {
                    userResumes.push(resumeData);
                }

                localStorage.setItem(`userResumes_${this.currentUser.id}`, JSON.stringify(userResumes));
                
                if (this.isEditing) {
                    sessionStorage.removeItem('editingResumeIndex');
                }

                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Генерация ID для резюме
     */
    generateResumeId() {
        return 'resume_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    }

    /**
     * Обработка отмены
     */
    handleCancel() {
        if (this.isEditing) {
            sessionStorage.removeItem('editingResumeIndex');
        }
        this.redirectToMain();
    }

    /**
     * Перенаправление на главную страницу
     */
    redirectToMain() {
        window.location.href = 'index.html';
    }

    /**
     * Обработка ошибки авторизации
     */
    handleAuthError() {
        this.showNotification('Для создания резюме необходимо войти в систему', 'error');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }

    /**
     * Показать уведомление
     */
    showNotification(message, type = 'info') {
        // Используем существующую систему уведомлений или создаем простую
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

    /**
     * Получить цвет для типа уведомления
     */
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
    .form-group textarea.error {
        border-color: #e74c3c !important;
        background-color: #fdf2f2;
    }
    
    .field-error {
        color: #e74c3c;
        font-size: 0.85rem;
        margin-top: 0.25rem;
        display: block;
    }
`;
document.head.appendChild(errorStyles);

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    new ResumeCreator();
});