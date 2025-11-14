// User Authentication System
class UserAuth {
    constructor() {
        this.currentUser = null;
        this.init();
    }
    
    init() {
        this.checkAuthState();
        this.setupEventListeners();
        this.updateUI();
    }
    
    setupEventListeners() {
        // Кнопка входа
        const loginBtn = document.getElementById('userLoginBtn');
        if (loginBtn) {
            loginBtn.addEventListener('click', () => {
                this.showAuthModal();
            });
        }
        
        // Закрытие модального окна
        const closeModal = document.getElementById('closeModal');
        if (closeModal) {
            closeModal.addEventListener('click', () => {
                this.hideAuthModal();
            });
        }
        
        // Клик вне модального окна
        const modal = document.getElementById('authModal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideAuthModal();
                }
            });
        }
        
        // Переключение вкладок
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchAuthTab(e.target.getAttribute('data-tab'));
            });
        });
        
        // Форма входа
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }
        
        // Форма регистрации
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegistration();
            });
        }
        
        // Социальные кнопки (заглушки)
        document.querySelectorAll('.social-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleSocialAuth(e.target.closest('.social-btn').classList[1]);
            });
        });
    }
    
    showAuthModal() {
        const modal = document.getElementById('authModal');
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }
    
    hideAuthModal() {
        const modal = document.getElementById('authModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }
    
    switchAuthTab(tabName) {
        // Обновляем активную вкладку
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        // Показываем соответствующую форму
        document.querySelectorAll('.auth-form').forEach(form => {
            form.classList.remove('active');
        });
        document.getElementById(tabName === 'login' ? 'loginForm' : 'registerForm').classList.add('active');
    }
    
    handleLogin() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        // В реальном приложении здесь был бы запрос к серверу
        const users = JSON.parse(localStorage.getItem('nextstep_users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            this.currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.hideAuthModal();
            this.updateUI();
            this.showNotification('Вход выполнен успешно!', 'success');
        } else {
            this.showNotification('Неверный email или пароль', 'error');
        }
    }
    
    handleRegistration() {
        const formData = {
            name: document.getElementById('registerName').value,
            email: document.getElementById('registerEmail').value,
            password: document.getElementById('registerPassword').value,
            confirmPassword: document.getElementById('registerConfirmPassword').value
        };
        
        // Валидация
        if (formData.password !== formData.confirmPassword) {
            this.showNotification('Пароли не совпадают', 'error');
            return;
        }
        
        if (formData.password.length < 8) {
            this.showNotification('Пароль должен содержать не менее 8 символов', 'error');
            return;
        }
        
        // Проверяем, нет ли уже пользователя с таким email
        const users = JSON.parse(localStorage.getItem('nextstep_users') || '[]');
        if (users.find(u => u.email === formData.email)) {
            this.showNotification('Пользователь с таким email уже зарегистрирован', 'error');
            return;
        }
        
        // Сохраняем пользователя
        const userData = {
            ...formData,
            id: this.generateId(),
            createdAt: new Date().toISOString(),
            resumes: [],
            applications: []
        };
        
        delete userData.confirmPassword;
        
        users.push(userData);
        localStorage.setItem('nextstep_users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(userData));
        
        this.currentUser = userData;
        this.hideAuthModal();
        this.updateUI();
        this.showNotification('Регистрация прошла успешно!', 'success');
        
        // Очищаем форму
        document.getElementById('registerForm').reset();
    }
    
    handleSocialAuth(provider) {
        // Заглушка для социальной авторизации
        this.showNotification(`Авторизация через ${provider} будет доступна в ближайшее время`, 'info');
    }
    
    checkAuthState() {
        const user = localStorage.getItem('currentUser');
        if (user) {
            this.currentUser = JSON.parse(user);
        }
    }
    
    updateUI() {
        const loginBtn = document.getElementById('userLoginBtn');
        const headerButtons = document.querySelector('.header-buttons');
        
        if (this.currentUser) {
            // Пользователь авторизован
            document.body.classList.add('user-authenticated');
            
            // Создаем меню пользователя, если его еще нет
            if (!document.querySelector('.user-menu')) {
                const userMenu = document.createElement('div');
                userMenu.className = 'user-menu';
                userMenu.innerHTML = `
                    <div class="user-avatar" id="userAvatar">
                        ${this.getUserInitials()}
                    </div>
                    <span class="user-name">${this.currentUser.name}</span>
                    <button class="btn btn-logout" id="userLogoutBtn">Выйти</button>
                `;
                headerButtons.appendChild(userMenu);
                
                // Обработчик выхода
                document.getElementById('userLogoutBtn').addEventListener('click', () => {
                    this.handleLogout();
                });
            }
        } else {
            // Пользователь не авторизован
            document.body.classList.remove('user-authenticated');
            const userMenu = document.querySelector('.user-menu');
            if (userMenu) {
                userMenu.remove();
            }
        }
    }
    
    handleLogout() {
        localStorage.removeItem('currentUser');
        this.currentUser = null;
        this.updateUI();
        this.showNotification('Вы вышли из системы', 'info');
    }
    
    getUserInitials() {
        if (!this.currentUser || !this.currentUser.name) return 'U';
        return this.currentUser.name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    }
    
    generateId() {
        return 'user_' + Math.random().toString(36).substr(2, 9);
    }
    
    showNotification(message, type = 'info') {
        // Создаем уведомление
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideInRight 0.3s ease;
        `;
        
        const colors = {
            success: '#4CAF50',
            error: '#f44336',
            info: '#2196F3',
            warning: '#ff9800'
        };
        
        notification.style.background = colors[type] || colors.info;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Удаляем уведомление через 3 секунды
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }
}

// Добавляем CSS анимацию для уведомлений
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
`;
document.head.appendChild(style);

// Инициализация системы аутентификации
document.addEventListener('DOMContentLoaded', () => {
    window.userAuth = new UserAuth();
});