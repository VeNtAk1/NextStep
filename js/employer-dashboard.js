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
                this.redirectToRegister();
            });
    }
    
    checkAuth() {
        return new Promise((resolve, reject) => {
            if (!window.userAuth || !window.userAuth.currentUser) {
                reject(new Error('Not authenticated'));
                return;
            }
            
            this.currentUser = window.userAuth.currentUser;
            this.userCompany = window.userAuth.getUserCompany();
            
            if (!this.userCompany) {
                reject(new Error('No company registered'));
                return;
            }
            
            document.getElementById('companyNameHeader').textContent = this.userCompany.companyName;
            resolve();
        });
    }
    
    loadDashboardData() {
        return new Promise((resolve) => {
            setTimeout(() => {
                const vacancies = JSON.parse(localStorage.getItem(`employerVacancies_${this.userCompany.id}`) || '[]');
                
                document.getElementById('activeVacancies').textContent = vacancies.length;
                document.getElementById('profileViews').textContent = '0';
                document.getElementById('totalResponses').textContent = '0';
                
                this.renderVacancies(vacancies);
                resolve();
            }, 500);
        });
    }
    
    renderVacancies(vacancies) {
        const container = document.getElementById('vacanciesList');
        const noVacancies = document.getElementById('noVacancies');
        
        if (vacancies.length === 0) {
            noVacancies.style.display = 'block';
        } else {
            noVacancies.style.display = 'none';
            // TODO: отобразить список вакансий
        }
    }
    
    setupEventListeners() {
        document.getElementById('logoutBtn').addEventListener('click', () => {
            userAuth.handleLogout();
        });
        
        document.getElementById('createVacancyBtn').addEventListener('click', () => {
            window.location.href = 'employer-vacancy.html';
        });
        
        document.getElementById('createFirstVacancyBtn').addEventListener('click', () => {
            window.location.href = 'employer-vacancy.html';
        });
        
        document.getElementById('editProfileBtn').addEventListener('click', () => {
            this.showNotification('Функция редактирования профиля будет доступна в ближайшее время', 'info');
        });
    }
    
    showContent() {
        const preloader = document.getElementById('preloader');
        const content = document.getElementById('employerContent');
        
        preloader.style.display = 'none';
        content.style.display = 'block';
    }
    
    redirectToRegister() {
        window.location.href = 'employer-register.html';
    }
    
    showNotification(message, type = 'info') {
        if (window.userAuth && window.userAuth.showNotification) {
            window.userAuth.showNotification(message, type);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new EmployerDashboard();
});