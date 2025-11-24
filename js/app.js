// Главный файл приложения
class NextStepApp {
    constructor() {
        this.currentTab = 'vacancies';
        this.trustScoreSystem = trustScoreSystem;
        this.init();
    }

    init() {
        this.renderContent();
        this.setupEventListeners();
        this.setupFilters();
    }

    setupEventListeners() {
        // Получаем элементы
        const resumeBtn = document.querySelector('.btn-resume');
        const loginBtn = document.querySelector('.btn-login');
        const employerLink = document.getElementById('employerLink');
        const searchInput = document.querySelector('.search-container input');

        // Обработчики вкладок
        document.querySelectorAll('.tab').forEach((tab) => {
            tab.addEventListener('click', (e) => {
                this.switchTab(e.target.getAttribute('data-tab'));
            });
        });

        // Поиск
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }

        // Создание резюме
        if (resumeBtn) {
            resumeBtn.addEventListener('click', () => {
                if (window.userAuth?.currentUser) {
                    window.location.href = 'resume-create.html';
                } else {
                    window.userAuth?.showAuthModal();
                }
            });
        }

        // Вход
        if (loginBtn) {
            loginBtn.addEventListener('click', () => {
                window.userAuth?.showAuthModal();
            });
        }

        // Работодатели
        if (employerLink) {
            employerLink.addEventListener('click', () => {
                this.openEmployerPage();
            });
        }
    }

   openEmployerPage() {
    if (window.userAuth?.currentUser) {
        // Пользователь авторизован - проверяем есть ли компания
        const userCompany = window.userAuth.getUserCompany();
        if (userCompany) {
            window.location.href = 'employer-dashboard.html';
        } else {
            window.location.href = 'employer-register.html';
        }
    } else {
        // Пользователь не авторизован - показываем модальное окно
        if (window.userAuth) {
            window.userAuth.showAuthModal();
            // Сохраняем информацию о том, что после авторизации нужно перейти в раздел работодателей
            window.userAuth.afterLoginAction = 'employer';
        }
        }
    }      

    switchTab(tabName) {
        this.currentTab = tabName;

        // Обновляем активную вкладку
        document.querySelectorAll('.tab').forEach((tab) => {
            tab.classList.remove('active');
        });

        const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
        }

        this.renderContent();
    }

    renderContent() {
        const container = document.getElementById('content-container');
        if (!container) return;

        switch (this.currentTab) {
            case 'vacancies':
                container.innerHTML = this.renderVacancies();
                break;
            case 'companies':
                container.innerHTML = this.renderCompanies();
                break;
            case 'resumes':
                container.innerHTML = this.renderResumes();
                break;
            default:
                container.innerHTML = this.renderVacancies();
        }
    }

    setupFilters() {
        const clearFiltersBtn = document.getElementById('clearFilters');
        const applySalaryBtn = document.getElementById('applySalary');

        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => {
                this.clearAllFilters();
            });
        }

        if (applySalaryBtn) {
            applySalaryBtn.addEventListener('click', () => {
                this.applySalaryFilter();
            });
        }

        document.querySelectorAll('.filter-checkbox input').forEach((checkbox) => {
            checkbox.addEventListener('change', () => {
                this.applyFilters();
            });
        });
    }

    clearAllFilters() {
        // Сбрасываем чекбоксы
        document.querySelectorAll('.filter-checkbox input').forEach((checkbox) => {
            checkbox.checked = false;
        });

        // Сбрасываем зарплату
        document.getElementById('salaryMin').value = '';
        document.getElementById('salaryMax').value = '';

        this.applyFilters();
        this.showNotification('Все фильтры сброшены', 'info');
    }

    applySalaryFilter() {
        const minSalary = document.getElementById('salaryMin').value;
        const maxSalary = document.getElementById('salaryMax').value;

        if (minSalary && maxSalary && parseInt(minSalary) > parseInt(maxSalary)) {
            this.showNotification('Минимальная зарплата не может быть больше максимальной', 'error');
            return;
        }

        this.applyFilters();
        this.showNotification('Фильтр по зарплате применен', 'success');
    }

    applyFilters() {
        const activeFilters = {
            workType: this.getSelectedValues('workType'),
            schedule: this.getSelectedValues('schedule'),
            experience: this.getSelectedValues('experience'),
            industry: this.getSelectedValues('industry'),
            salaryMin: document.getElementById('salaryMin').value,
            salaryMax: document.getElementById('salaryMax').value,
        };

        console.log('Active filters:', activeFilters);

        // Проверяем, есть ли активные фильтры
        const hasActiveFilters = Object.keys(activeFilters).some(key => 
            (Array.isArray(activeFilters[key]) && activeFilters[key].length > 0) || 
            (typeof activeFilters[key] === 'string' && activeFilters[key])
        );

        if (hasActiveFilters) {
            this.showNotification('Фильтры применены', 'success');
        }
    }

    getSelectedValues(filterName) {
        const checkboxes = document.querySelectorAll(`input[name="${filterName}"]:checked`);
        return Array.from(checkboxes).map(cb => cb.value);
    }

    showNotification(message, type = 'info') {
        if (window.userAuth?.showNotification) {
            window.userAuth.showNotification(message, type);
        } else {
            console.log(`${type}: ${message}`);
        }
    }

    renderVacancies() {
        let html = '<div class="content-grid">';

        vacanciesData.forEach((vacancy) => {
            const trustScore = this.trustScoreSystem.analyzeCompany(vacancy.companyId);

            html += `
                <div class="job-card">
                    <div class="job-header">
                        <div class="job-icon">
                            <i class="fas fa-${vacancy.icon}"></i>
                        </div>
                        <div class="job-info">
                            <h2 class="job-title">${vacancy.title}</h2>
                            <div class="job-salary">${vacancy.salary}</div>
                            <div class="job-meta">
                                <div class="meta-item">
                                    <i class="fas fa-building"></i>
                                    <span>${vacancy.company}</span>
                                </div>
                                <div class="meta-item">
                                    <i class="fas fa-map-marker-alt"></i>
                                    <span>${vacancy.location}</span>
                                </div>
                                <div class="meta-item">
                                    <i class="fas fa-briefcase"></i>
                                    <span>${vacancy.employment}</span>
                                </div>
                            </div>
                            ${trustScore ? this.renderTrustScore(trustScore) : ''}
                        </div>
                    </div>
                    
                    ${trustScore?.analysis ? `
                    <div class="ai-analysis">
                        <div class="ai-analysis-header">
                            <i class="fas fa-robot"></i>
                            <h3>AI-анализ компании</h3>
                        </div>
                        <div class="ai-analysis-content">
                            ${trustScore.analysis}
                        </div>
                    </div>
                    ` : ''}
                    
                    <div class="job-section">
                        <h3>Требования:</h3>
                        <ul>
                            ${vacancy.requirements.map(req => `<li>${req}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="job-section">
                        <h3>Условия:</h3>
                        <ul>
                            ${vacancy.conditions.map(cond => `<li>${cond}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            `;
        });

        html += '</div>';
        return html;
    }

    renderCompanies() {
        let html = '<div class="content-grid">';

        companiesData.forEach((company) => {
            const trustScore = this.trustScoreSystem.analyzeCompany(company.id);

            html += `
                <div class="company-card">
                    <div class="company-header">
                        <div class="company-icon">
                            <i class="fas fa-${company.icon}"></i>
                        </div>
                        <div class="company-info">
                            <h2 class="company-name">${company.name}</h2>
                            <div class="company-rating">Рейтинг: ${company.rating}</div>
                            ${trustScore ? this.renderTrustScore(trustScore) : ''}
                        </div>
                    </div>
                    
                    <div class="company-section">
                        <h3>О компании:</h3>
                        <p>${company.description}</p>
                    </div>
                    
                    ${trustScore?.analysis ? `
                    <div class="ai-analysis">
                        <div class="ai-analysis-header">
                            <i class="fas fa-robot"></i>
                            <h3>AI-анализ на основе ${trustScore.sources.length} источников</h3>
                        </div>
                        <div class="ai-analysis-content">
                            ${trustScore.analysis}
                        </div>
                    </div>
                    ` : ''}
                    
                    <div class="company-stats">
                        <div class="stat">
                            <div class="stat-value">${company.vacanciesCount}</div>
                            <div class="stat-label">Открытые вакансии</div>
                        </div>
                        <div class="stat">
                            <div class="stat-value">${company.employeesCount}+</div>
                            <div class="stat-label">Сотрудников</div>
                        </div>
                        <div class="stat">
                            <div class="stat-value">${company.yearsOnMarket} лет</div>
                            <div class="stat-label">На рынке</div>
                        </div>
                    </div>
                </div>
            `;
        });

        html += '</div>';
        return html;
    }

    renderResumes() {
        const currentUser = window.userAuth?.currentUser;
        
        if (!currentUser) {
            return this.renderResumesGuest();
        }

        const userResumes = JSON.parse(localStorage.getItem(`userResumes_${currentUser.id}`) || '[]');
        
        if (userResumes.length === 0) {
            return this.renderNoResumes();
        }

        return this.renderUserResumes(userResumes);
    }

    renderResumesGuest() {
        return `
            <div class="content-grid">
                <div class="job-card">
                    <div class="job-header">
                        <div class="job-icon">
                            <i class="fas fa-user-tie"></i>
                        </div>
                        <div class="job-info">
                            <h2 class="job-title">Раздел резюме</h2>
                            <div class="job-salary">Войдите, чтобы управлять резюме</div>
                        </div>
                    </div>
                    
                    <div class="job-section">
                        <h3>Функционал:</h3>
                        <ul>
                            <li>Создание и редактирование резюме</li>
                            <li>Просмотр ваших откликов</li>
                            <li>Рекомендации по улучшению резюме</li>
                            <li>Статистика просмотров</li>
                        </ul>
                        <button class="btn-login" onclick="window.userAuth.showAuthModal()" style="margin-top: 15px;">
                            Войти в систему
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    renderNoResumes() {
        return `
            <div class="content-grid">
                <div class="job-card">
                    <div class="job-header">
                        <div class="job-icon">
                            <i class="fas fa-file-alt"></i>
                        </div>
                        <div class="job-info">
                            <h2 class="job-title">У вас пока нет резюме</h2>
                            <div class="job-salary">Создайте первое резюме</div>
                        </div>
                    </div>
                    
                    <div class="job-section">
                        <p>Разместите резюме, чтобы работодатели могли найти вас.</p>
                        <button class="btn-resume" onclick="window.location.href='resume-create.html'" style="margin-top: 15px;">
                            Создать резюме
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    renderUserResumes(resumes) {
        let html = '<div class="content-grid">';
        
        resumes.forEach((resume, index) => {
            html += `
                <div class="job-card">
                    <div class="job-header">
                        <div class="job-icon">
                            <i class="fas fa-user-tie"></i>
                        </div>
                        <div class="job-info">
                            <h2 class="job-title">${resume.position}</h2>
                            <div class="job-salary">${resume.firstName} ${resume.lastName}</div>
                            <div class="job-meta">
                                <div class="meta-item">
                                    <i class="fas fa-envelope"></i>
                                    <span>${resume.email}</span>
                                </div>
                                <div class="meta-item">
                                    <i class="fas fa-phone"></i>
                                    <span>${resume.phone}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="job-section">
                        <h3>Навыки:</h3>
                        <p>${resume.skills || 'Не указаны'}</p>
                    </div>
                    
                    <div class="job-section">
                        <h3>Опыт работы:</h3>
                        <p>${resume.experience || 'Не указан'}</p>
                    </div>
                    
                    <div class="job-actions">
                        <button class="btn-edit" onclick="nextStepApp.editResume(${index})">
                            Редактировать
                        </button>
                        <button class="btn-delete" onclick="nextStepApp.deleteResume(${index})">
                            Удалить
                        </button>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        return html;
    }

    renderTrustScore(trustScore) {
        const level = trustScore.level;
        const text = this.trustScoreSystem.getScoreText(level);
        const icon = this.trustScoreSystem.getScoreIcon(level);

        return `
            <div class="trust-score ${level}">
                <i class="fas ${icon}"></i>
                <span>TrustScore: ${trustScore.score}/100 - ${text}</span>
            </div>
        `;
    }

    handleSearch(query) {
        console.log('Поиск:', query);
        // В реальном приложении здесь будет фильтрация
        this.renderContent();
    }

    editResume(index) {
        // Сохраняем индекс редактируемого резюме
        sessionStorage.setItem('editingResumeIndex', index);
        window.location.href = 'resume-create.html';
    }

    deleteResume(index) {
        const currentUser = window.userAuth?.currentUser;
        if (!currentUser) return;

        const userResumes = JSON.parse(localStorage.getItem(`userResumes_${currentUser.id}`) || '[]');
        userResumes.splice(index, 1);
        localStorage.setItem(`userResumes_${currentUser.id}`, JSON.stringify(userResumes));

        this.showNotification('Резюме удалено', 'success');
        this.renderContent();
    }
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    window.nextStepApp = new NextStepApp();
});