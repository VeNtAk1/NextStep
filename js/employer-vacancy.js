// Employer Vacancy Creation
class EmployerVacancy {
    constructor() {
        this.init();
    }
    
    init() {
        this.checkAuth();
        this.setupEventListeners();
    }
    
    checkAuth() {
        const employer = sessionStorage.getItem('currentEmployer');
        if (!employer) {
            window.location.href = 'employer-login.html';
            return;
        }
        
        this.employer = JSON.parse(employer);
        document.getElementById('companyName').value = this.employer.companyName;
    }
    
    setupEventListeners() {
        const form = document.getElementById('vacancyForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit();
            });
        }
        
        // Обработчики для AI-помощника
        const improveTextBtn = document.querySelector('.helper-btn');
        if (improveTextBtn) {
            improveTextBtn.addEventListener('click', () => {
                this.improveText();
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
            contacts: document.getElementById('contacts').value,
            id: this.generateId(),
            createdAt: new Date().toISOString()
        };
        
        // Сохраняем вакансию в sessionStorage
        const vacancies = JSON.parse(sessionStorage.getItem('employerVacancies') || '[]');
        vacancies.push(formData);
        sessionStorage.setItem('employerVacancies', JSON.stringify(vacancies));
        
        alert('Вакансия успешно создана!');
        window.location.href = 'employer-dashboard.html';
    }
    
    improveText() {
        // Заглушка для AI-улучшения текста
        const textarea = document.getElementById('jobDescription');
        textarea.value += '\n\n[Текст улучшен с помощью AI]';
    }
    
    generateId() {
        return 'vacancy_' + Math.random().toString(36).substr(2, 9);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new EmployerVacancy();
});