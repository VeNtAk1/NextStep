class EmployerRegister {
    constructor() {
        this.currentUser = null;
        this.init();
    }
    
    init() {
        this.checkAuth()
            .then(() => this.setupEventListeners())
            .then(() => this.showContent())
            .catch((error) => {
                console.error('Auth check failed:', error);
                this.redirectToLogin();
            });
    }
    
    checkAuth() {
        return new Promise((resolve, reject) => {
            // Проверяем авторизацию через общую систему
            if (!window.userAuth || !window.userAuth.currentUser) {
                reject(new Error('Not authenticated'));
                return;
            }
            
            this.currentUser = window.userAuth.currentUser;
            
            // Проверяем, есть ли уже компания
            const existingCompany = window.userAuth.getUserCompany();
            if (existingCompany) {
                this.redirectToDashboard();
                return;
            }
            
            document.getElementById('userGreeting').textContent = `Здравствуйте, ${this.currentUser.name}`;
            resolve();
        });
    }
    
    setupEventListeners() {
        const form = document.getElementById('companyRegistrationForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegistration();
            });
        }
        
        // Заполняем email пользователя по умолчанию
        const companyEmail = document.getElementById('companyEmail');
        if (companyEmail && this.currentUser) {
            companyEmail.value = this.currentUser.email;
        }
    }
    
    handleRegistration() {
        const formData = {
            companyName: document.getElementById('companyName').value,
            email: document.getElementById('companyEmail').value,
            phone: document.getElementById('companyPhone').value,
            inn: document.getElementById('companyINN').value,
            description: document.getElementById('companyDescription').value,
            website: document.getElementById('companyWebsite').value
        };
        
        // Валидация
        if (!this.validateForm(formData)) {
            return;
        }
        
        // Сохраняем компанию через общую систему аутентификации
        const company = window.userAuth.saveUserCompany(formData);
        
        if (company) {
            this.showNotification('Компания успешно зарегистрирована!', 'success');
            setTimeout(() => {
                window.location.href = 'employer-dashboard.html';
            }, 1500);
        } else {
            this.showNotification('Ошибка при регистрации компании', 'error');
        }
    }
    
    validateForm(formData) {
        if (!formData.companyName.trim()) {
            this.showNotification('Введите название компании', 'error');
            return false;
        }
        
        if (!formData.email.trim()) {
            this.showNotification('Введите email компании', 'error');
            return false;
        }
        
        if (!formData.phone.trim()) {
            this.showNotification('Введите телефон компании', 'error');
            return false;
        }
        
        if (!formData.inn.trim() || formData.inn.length < 10) {
            this.showNotification('Введите корректный ИНН', 'error');
            return false;
        }
        
        return true;
    }
    
    showContent() {
        const preloader = document.getElementById('preloader');
        const content = document.getElementById('employerContent');
        
        preloader.style.display = 'none';
        content.style.display = 'block';
    }
    
    redirectToLogin() {
        window.location.href = 'index.html';
    }
    
    redirectToDashboard() {
        window.location.href = 'employer-dashboard.html';
    }
    
    showNotification(message, type = 'info') {
        if (window.userAuth && window.userAuth.showNotification) {
            window.userAuth.showNotification(message, type);
        } else {
            alert(message);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new EmployerRegister();
});