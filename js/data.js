// Данные вакансий
const vacanciesData = [
    {
        id: 1,
        title: "Строитель",
        salary: "70 000 - 90 000 руб.",
        company: "СтройГарант",
        companyId: 1,
        experience: "1-3 года",
        employment: "Полная занятость",
        location: "Москва",
        requirements: [
            "Опыт работы от 1 года",
            "Знание строительных норм и правил",
            "Умение читать чертежи",
            "Физическая выносливость"
        ],
        conditions: [
            "Официальное трудоустройство",
            "График 5/2 с 9:00 до 18:00",
            "Страхование",
            "Оплачиваемый отпуск"
        ],
        icon: "hard-hat"
    },
    {
        id: 2,
        title: "Frontend разработчик",
        salary: "120 000 - 180 000 руб.",
        company: "TechSolutions",
        companyId: 2,
        experience: "2-5 лет",
        employment: "Полная занятость",
        location: "Удаленно",
        requirements: [
            "Опыт разработки на React от 2 лет",
            "Знание JavaScript, TypeScript",
            "Опыт работы с REST API",
            "Знание HTML5, CSS3"
        ],
        conditions: [
            "Удаленная работа",
            "Гибкий график",
            "Официальное трудоустройство",
            "ДМС"
        ],
        icon: "laptop-code"
    },
    {
        id: 3,
        title: "Медсестра/медбрат",
        salary: "45 000 - 60 000 руб.",
        company: "Городская больница №1",
        companyId: 3,
        experience: "Опыт не требуется",
        employment: "Полная занятость",
        location: "Санкт-Петербург",
        requirements: [
            "Среднее медицинское образование",
            "Ответственность",
            "Внимательность",
            "Готовность к работе в сменном графике"
        ],
        conditions: [
            "Официальное трудоустройство",
            "Сменный график",
            "Социальный пакет",
            "Возможность повышения квалификации"
        ],
        icon: "user-nurse"
    }
];

// Данные компаний
const companiesData = [
    {
        id: 1,
        name: "СтройГарант",
        description: "Ведущая строительная компания, специализирующаяся на возведении жилых и коммерческих объектов. Работаем на рынке более 15 лет.",
        rating: "4.7/5",
        vacanciesCount: 24,
        employeesCount: 350,
        yearsOnMarket: 15,
        icon: "building"
    },
    {
        id: 2,
        name: "TechSolutions",
        description: "IT-компания, разрабатывающая программное обеспечение для международных клиентов. Специализируемся на веб-разработке и мобильных приложениях.",
        rating: "4.9/5",
        vacanciesCount: 12,
        employeesCount: 120,
        yearsOnMarket: 8,
        icon: "code"
    },
    {
        id: 3,
        name: "Городская больница №1",
        description: "Крупное многопрофильное медицинское учреждение, предоставляющее полный спектр медицинских услуг населению.",
        rating: "4.3/5",
        vacanciesCount: 38,
        employeesCount: 850,
        yearsOnMarket: 45,
        icon: "hospital"
    }
];