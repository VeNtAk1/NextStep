// Employer Dashboard
class EmployerDashboard {
    constructor() {
        this.init();
    }
    
    init() {
        this.checkAuth()
            .then(() => this.loadDashboardData())
            .then(() => this.setupEventListeners())
            .then(() => this.showContent())
            .catch((error) => {
                console.error('Dashboard initialization error:', error);
                this.redirectToLogin();
            });
    }
    
    checkAuth() {
        return new Promise((resolve, reject) => {
            const employer = sessionStorage.getItem('currentEmployer');
            
            if (!employer) {
                reject(new Error('Not authenticated'));
                return;
            }
            
            try {
                this.employer = JSON.parse(employer);
                document.getElementById('companyNameHeader').textContent = this.employer.companyName;
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }
    
    loadDashboardData() {
        return new Promise((resolve) => {
            // Имитация загрузки данных
            setTimeout(() => {
                const vacancies = JSON.parse(sessionStorage.getItem('employerVacancies') || '[]');
                
                document.getElementById('activeVacancies').textContent = vacancies.length;
                document.getElementById('profileViews').textContent = '0';
                document.getElementById('totalResponses').textContent = '0';
                
                this.renderVacancies(vacancies);
                resolve();
            }, 500); // Имитация задержки сети
        });
    }
    
    renderVacancies(vacancies) {
        const container = document.getElementById('vacanciesList');
        const noVacancies = document.getElementById('noVacancies');
        
        if (vacancies.length === 0) {
            noVacancies.style.display = 'block';
        } else {
            noVacancies.style.display = 'none';
            // Здесь можно отобразить список вакансий
        }
    }
    
    setupEventListeners() {
        return new Promise((resolve) => {
            // Выход
            document.getElementById('logoutBtn').addEventListener('click', () => {
                this.handleLogout();
            });
            
            // Создание вакансии
            document.getElementById('createVacancyBtn').addEventListener('click', () => {
                window.location.href = 'employer-vacancy.html';
            });
            
            document.getElementById('createFirstVacancyBtn').addEventListener('click', () => {
                window.location.href = 'employer-vacancy.html';
            });
            
            // Редактирование профиля
            document.getElementById('editProfileBtn').addEventListener('click', () => {
                this.showNotification('Функция редактирования профиля будет доступна в ближайшее время', 'info');
            });
            
            resolve();
        });
    }
    
    showContent() {
        // Скрываем прелоадер и показываем контент
        const preloader = document.getElementById('preloader');
        const content = document.getElementById('employerContent');
        
        preloader.style.display = 'none';
        content.style.display = 'block';
        
        // Плавное появление контента
        content.style.opacity = '0';
        content.style.transition = 'opacity 0.3s ease';
        
        setTimeout(() => {
            content.style.opacity = '1';
        }, 50);
    }
    
    handleLogout() {
        sessionStorage.removeItem('currentEmployer');
        this.redirectToLogin();
    }
    
    redirectToLogin() {
        window.location.href = 'employer-login.html';
    }
    
    showNotification(message, type = 'info') {
        // Простая реализация уведомлений
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#e74c3c' : type === 'success' ? '#27ae60' : '#3498db'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    new EmployerDashboard();
});