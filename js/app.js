// Главный файл приложения
class NextStepApp {
  constructor() {
    this.currentTab = "vacancies";
    this.trustScoreSystem = trustScoreSystem;
    this.init();
  }

  init() {
    this.renderContent();
    this.setupEventListeners();
  }
  
  setupEventListeners() {
    // Обработчики вкладок
    document.querySelectorAll(".tab").forEach((tab) => {
      tab.addEventListener("click", (e) => {
        this.switchTab(e.target.getAttribute("data-tab"));
      });
    });

    // Поиск
    const searchInput = document.querySelector(".search-container input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.handleSearch(e.target.value);
      });
    }

    // Кнопки в хедере
    const resumeBtn = document.querySelector('.btn-resume');
    const loginBtn = document.querySelector('.btn-login');
    const employerLink = document.getElementById('employerLink');
    
    if (resumeBtn) {
        resumeBtn.addEventListener('click', () => {
             if (window.userAuth && window.userAuth.currentUser) {
                // Пользователь авторизован - создаем резюме
                // Просто выполняем действие без alert
                console.log('Создание резюме для авторизованного пользователя');
                // Здесь будет функционал создания резюме
            } else {
                // Пользователь не авторизован - открываем модальное окно
                if (window.userAuth) {
                    window.userAuth.showAuthModal();
                }
            }
        });
    }
    
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            if (window.userAuth) {
                window.userAuth.showAuthModal();
            }
        });
    }
    
    if (employerLink) {
        employerLink.addEventListener('click', () => {
            this.openEmployerPage();
        });
    }
    // Кнопка "Создать резюме"
    if (resumeBtn) {
        resumeBtn.addEventListener('click', () => {
            if (window.userAuth && window.userAuth.currentUser) {
                // Пользователь авторизован - создаем резюме
                alert('Функция создания резюме будет доступна в ближайшее время!');
            } else {
                // Пользователь не авторизован - предлагаем войти
                alert('Для создания резюме необходимо войти в систему');
                if (window.userAuth) {
                    window.userAuth.showAuthModal();
                }
            }
        });
    }
    
  }
  openEmployerPage() {
    // Проверяем, есть ли уже зарегистрированный работодатель
    const existingEmployer = localStorage.getItem('currentEmployer');
    
    if (existingEmployer) {
        window.location.href = 'employer-dashboard.html';
    } else {
        window.location.href = 'employer.html';
    }
}
  switchTab(tabName) {
    this.currentTab = tabName;

    // Обновляем активную вкладку
    document.querySelectorAll(".tab").forEach((tab) => {
      tab.classList.remove("active");
    });

    const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeTab) {
      activeTab.classList.add("active");
    }

    // Обновляем контент
    this.renderContent();
  }

  renderContent() {
    const container = document.getElementById("content-container");
    if (!container) return;

    switch (this.currentTab) {
      case "vacancies":
        container.innerHTML = this.renderVacancies();
        break;
      case "companies":
        container.innerHTML = this.renderCompanies();
        break;
      case "resumes":
        container.innerHTML = this.renderResumes();
        break;
      default:
        container.innerHTML = this.renderVacancies();
    }
  }

  renderVacancies() {
    let html = '<div class="content-grid">';

    vacanciesData.forEach((vacancy) => {
      const trustScore = this.trustScoreSystem.analyzeCompany(
        vacancy.companyId
      );

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
                            ${
                              trustScore
                                ? this.renderTrustScore(trustScore)
                                : ""
                            }
                        </div>
                    </div>
                    
                    ${
                      trustScore && trustScore.analysis
                        ? `
                    <div class="ai-analysis">
                        <div class="ai-analysis-header">
                            <i class="fas fa-robot"></i>
                            <h3>AI-анализ компании</h3>
                        </div>
                        <div class="ai-analysis-content">
                            ${trustScore.analysis}
                        </div>
                    </div>
                    `
                        : ""
                    }
                    
                    <div class="job-section">
                        <h3>Требования:</h3>
                        <ul>
                            ${vacancy.requirements
                              .map((req) => `<li>${req}</li>`)
                              .join("")}
                        </ul>
                    </div>
                    
                    <div class="job-section">
                        <h3>Условия:</h3>
                        <ul>
                            ${vacancy.conditions
                              .map((cond) => `<li>${cond}</li>`)
                              .join("")}
                        </ul>
                    </div>
                </div>
            `;
    });

    html += "</div>";
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
                            <div class="company-rating">Рейтинг: ${
                              company.rating
                            }</div>
                            ${
                              trustScore
                                ? this.renderTrustScore(trustScore)
                                : ""
                            }
                        </div>
                    </div>
                    
                    <div class="company-section">
                        <h3>О компании:</h3>
                        <p>${company.description}</p>
                    </div>
                    
                    ${
                      trustScore && trustScore.analysis
                        ? `
                    <div class="ai-analysis">
                        <div class="ai-analysis-header">
                            <i class="fas fa-robot"></i>
                            <h3>AI-анализ на основе ${trustScore.sources.length} источников</h3>
                        </div>
                        <div class="ai-analysis-content">
                            ${trustScore.analysis}
                        </div>
                    </div>
                    `
                        : ""
                    }
                    
                    <div class="company-stats">
                        <div class="stat">
                            <div class="stat-value">${
                              company.vacanciesCount
                            }</div>
                            <div class="stat-label">Открытые вакансии</div>
                        </div>
                        <div class="stat">
                            <div class="stat-value">${
                              company.employeesCount
                            }+</div>
                            <div class="stat-label">Сотрудников</div>
                        </div>
                        <div class="stat">
                            <div class="stat-value">${
                              company.yearsOnMarket
                            } лет</div>
                            <div class="stat-label">На рынке</div>
                        </div>
                    </div>
                </div>
            `;
    });

    html += "</div>";
    return html;
  }

  renderResumes() {
    return `
            <div class="content-grid">
                <div class="job-card">
                    <div class="job-header">
                        <div class="job-icon">
                            <i class="fas fa-user-tie"></i>
                        </div>
                        <div class="job-info">
                            <h2 class="job-title">Раздел резюме</h2>
                            <div class="job-salary">Создайте свое резюме</div>
                        </div>
                    </div>
                    
                    <div class="job-section">
                        <h3>Функционал в разработке:</h3>
                        <ul>
                            <li>Создание и редактирование резюме</li>
                            <li>Просмотр ваших откликов</li>
                            <li>Рекомендации по улучшению резюме</li>
                            <li>Статистика просмотров</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
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
    // В реальном приложении здесь был бы поиск по данным
    console.log("Поиск:", query);
    // Пока просто перерисовываем контент
    this.renderContent();
  }
  
}

// Инициализация приложения после загрузки DOM
document.addEventListener("DOMContentLoaded", () => {
  new NextStepApp();
});
