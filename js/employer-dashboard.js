// Employer Dashboard
class EmployerDashboard {
    constructor() {
        this.init();
    }
    
    init() {
        this.checkAuth();
        this.loadDashboardData();
        this.setupEventListeners();
    }
    
    checkAuth() {
        const employer = sessionStorage.getItem('currentEmployer');
        if (!employer) {
            window.location.href = 'employer-login.html';
            return;
        }
        
        this.employer = JSON.parse(employer);
        document.getElementById('companyNameHeader').textContent = this.employer.companyName;
    }
    
    loadDashboardData() {
        // Загрузка данных для дашборда
        const vacancies = JSON.parse(sessionStorage.getItem('employerVacancies') || '[]');
        
        document.getElementById('activeVacancies').textContent = vacancies.length;
        document.getElementById('profileViews').textContent = '0'; // Заглушка
        document.getElementById('totalResponses').textContent = '0'; // Заглушка
        
        this.renderVacancies(vacancies);
    }
    
    renderVacancies(vacancies) {
        const container = document.getElementById('vacanciesList');
        const noVacancies = document.getElementById('noVacancies');
        
        if (vacancies.length === 0) {
            noVacancies.style.display = 'block';
            return;
        }
        
        noVacancies.style.display = 'none';
        // Здесь можно отобразить список вакансий
    }
    
    setupEventListeners() {
        // Выход
        document.getElementById('logoutBtn').addEventListener('click', () => {
            sessionStorage.removeItem('currentEmployer');
            window.location.href = 'employer.html';
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new EmployerDashboard();
});