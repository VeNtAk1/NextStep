// Модуль для работы с TrustScore (имитация AI-анализа)

class TrustScore {
    constructor() {
        this.sources = [
            "HeadHunter",
            "Glassdoor", 
            "SuperJob",
            "Отзовик",
            "Яндекс.Карты"
        ];
    }
    
    // Имитация AI-анализа отзывов с разных платформ
    analyzeCompany(companyId) {
        const company = companiesData.find(c => c.id === companyId);
        if (!company) return null;
        
        // Имитация анализа отзывов и расчета TrustScore
        const baseScore = this.calculateBaseScore(company);
        const reviewAnalysis = this.analyzeReviews(company.name);
        const finalScore = Math.max(10, Math.min(100, baseScore + reviewAnalysis.adjustment));
        
        return {
            score: finalScore,
            level: this.getScoreLevel(finalScore),
            analysis: reviewAnalysis.analysis,
            sources: this.sources
        };
    }
    
    // Базовый расчет на основе данных компании
    calculateBaseScore(company) {
        let score = 50; // Базовый балл
        
        // Бонус за время на рынке
        if (company.yearsOnMarket > 10) score += 15;
        else if (company.yearsOnMarket > 5) score += 10;
        else if (company.yearsOnMarket > 2) score += 5;
        
        // Бонус за количество сотрудников
        if (company.employeesCount > 500) score += 10;
        else if (company.employeesCount > 100) score += 5;
        
        // Бонус за рейтинг
        const rating = parseFloat(company.rating);
        if (rating > 4.5) score += 15;
        else if (rating > 4.0) score += 10;
        else if (rating > 3.5) score += 5;
        
        return score;
    }
    
    // Имитация анализа отзывов
    analyzeReviews(companyName) {
        // В реальном приложении здесь был бы AI-анализ реальных отзывов
        const analyses = [
            {
                adjustment: 20,
                analysis: "AI-анализ выявил преимущественно положительные отзывы сотрудников. Компания ценится за стабильность и социальные гарантии."
            },
            {
                adjustment: 15,
                analysis: "Отзывы в основном положительные. Сотрудники отмечают хорошую атмосферу в коллективе и перспективы карьерного роста."
            },
            {
                adjustment: 10,
                analysis: "Смешанные отзывы. Есть как положительные оценки условий труда, так и замечания по организации рабочих процессов."
            },
            {
                adjustment: 5,
                analysis: "Преобладают нейтральные отзывы. Сотрудники в целом довольны, но есть рекомендации по улучшению системы мотивации."
            },
            {
                adjustment: -10,
                analysis: "Обнаружены противоречивые отзывы. Рекомендуем внимательно изучить условия трудоустройства перед откликом."
            }
        ];
        
        // Детерминированный выбор на основе названия компании
        const index = companyName.length % analyses.length;
        return analyses[index];
    }
    
    getScoreLevel(score) {
        if (score >= 80) return "high";
        if (score >= 60) return "medium";
        return "low";
    }
    
    getScoreText(level) {
        const texts = {
            high: "Проверенный работодатель",
            medium: "Стабильный работодатель", 
            low: "Требуется осторожность"
        };
        return texts[level] || "Не проверен";
    }
    
    getScoreIcon(level) {
        const icons = {
            high: "fa-shield-check",
            medium: "fa-star",
            low: "fa-exclamation-triangle"
        };
        return icons[level] || "fa-question";
    }
}

// Создаем экземпляр для использования в приложении
const trustScoreSystem = new TrustScore();