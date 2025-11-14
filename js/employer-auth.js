// Employer Authentication System
class EmployerAuth {
    constructor() {
        this.currentEmployer = null;
        this.init();
    }
    
    init() {
        this.checkAuthState();
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Регистрация компании
        const registrationForm = document.getElementById('companyRegistrationForm');
        if (registrationForm) {
            registrationForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegistration();
            });
        }
        
        // Вход для работодателей
        const loginForm = document.getElementById('employerLoginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }
        
        // Кнопка входа в хедере
        const loginBtn = document.getElementById('employerLoginBtn');
        if (loginBtn) {
            loginBtn.addEventListener('click', () => {
                window.location.href = 'employer-login.html';
            });
        }
    }
    
    handleRegistration() {
        const formData = {
            companyName: document.getElementById('companyName').value,
            email: document.getElementById('companyEmail').value,
            phone: document.getElementById('companyPhone').value,
            inn: document.getElementById('companyINN').value,
            description: document.getElementById('companyDescription').value,
            website: document.getElementById('companyWebsite').value,
            password: document.getElementById('password').value,
            confirmPassword: document.getElementById('confirmPassword').value
        };
        
        // Валидация
        if (formData.password !== formData.confirmPassword) {
            alert('Пароли не совпадают!');
            return;
        }
        
        if (formData.password.length < 8) {
            alert('Пароль должен содержать не менее 8 символов');
            return;
        }
        
        // Сохраняем в localStorage (в реальном приложении - отправка на сервер)
        const employerData = {
            ...formData,
            id: this.generateId(),
            createdAt: new Date().toISOString(),
            trustScore: this.calculateInitialTrustScore(formData)
        };
        
        delete employerData.password;
        delete employerData.confirmPassword;
        
        localStorage.setItem('currentEmployer', JSON.stringify(employerData));
        localStorage.setItem('employerVacancies', JSON.stringify([]));
        
        alert('Компания успешно зарегистрирована!');
        window.location.href = 'employer-dashboard.html';
    }
    
    handleLogin() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        // В реальном приложении здесь был бы запрос к серверу
        // Для демо просто проверяем, что пользователь есть в localStorage
        const existingEmployer = localStorage.getItem('currentEmployer');
        
        if (existingEmployer) {
            const employer = JSON.parse(existingEmployer);
            
            // В реальном приложении здесь была бы проверка пароля
            if (employer.email === email) {
                alert('Вход выполнен успешно!');
                window.location.href = 'employer-dashboard.html';
            } else {
                alert('Компания с таким email не найдена. Зарегистрируйтесь сначала.');
            }
        } else {
            alert('Компания с таким email не найдена. Зарегистрируйтесь сначала.');
        }
    }
    
    checkAuthState() {
        const employer = localStorage.getItem('currentEmployer');
        
        if (employer) {
            this.currentEmployer = JSON.parse(employer);
            
            // Если на странице входа/регистрации, но пользователь авторизован - перенаправляем
            if (window.location.pathname.includes('employer.html') || 
                window.location.pathname.includes('employer-login.html')) {
                window.location.href = 'employer-dashboard.html';
            }
        } else {
            // Если на защищенной странице, но пользователь не авторизован - перенаправляем
            if (window.location.pathname.includes('employer-dashboard.html') ||
                window.location.pathname.includes('employer-vacancy.html')) {
                window.location.href = 'employer-login.html';
            }
        }
    }
    
    generateId() {
        return 'employer_' + Math.random().toString(36).substr(2, 9);
    }
    
    calculateInitialTrustScore(employerData) {
        let score = 50;
        
        if (employerData.website) score += 10;
        if (employerData.description && employerData.description.length > 50) score += 10;
        if (employerData.inn && employerData.inn.length === 10) score += 15;
        
        return Math.min(score, 85); // Максимум 85 для новой компании
    }
}

// Инициализация системы аутентификации
document.addEventListener('DOMContentLoaded', () => {
    window.employerAuth = new EmployerAuth();
});