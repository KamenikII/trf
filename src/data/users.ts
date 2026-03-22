// src/data/users.js

// Исходные данные для тестирования.
// Вы можете вручную добавлять сюда пользователей для тестирования входа.
// Эти данные будут загружены в localStorage браузера при первом запуске.
export const initialUsers = [
    {
        id: 1,
        email: "student@test.com",
        password: "password123", // В реальном проекте должен быть хэш
        role: "student",
        firstName: "Иван",
        lastName: "Иванов",
        middleName: "Иванович"
    },
    {
        id: 2,
        email: "company@test.com",
        password: "password123",
        role: "company",
        firstName: "Петр",
        lastName: "Петров",
        middleName: ""
    }
];

// Функция для получения всех пользователей
export const getUsers = () => {
    const stored = localStorage.getItem("stajer_users");
    if (stored) {
        return JSON.parse(stored);
    }
    localStorage.setItem("stajer_users", JSON.stringify(initialUsers));
    return initialUsers;
};

// Функция для добавления нового пользователя (регистрация)
export const addUser = (userData) => {
    const users = getUsers();
    const newUser = { id: Date.now(), ...userData };
    users.push(newUser);
    localStorage.setItem("stajer_users", JSON.stringify(users));
    return newUser;
};

// Функция для поиска пользователя по email
export const getUserByEmail = (email) => {
    const users = getUsers();
    return users.find(u => u.email.toLowerCase() === email.toLowerCase());
};

// Функция для обновления данных пользователя
export const updateUser = (id, updates) => {
    const users = getUsers();
    const idx = users.findIndex(u => u.id === id);
    if (idx !== -1) {
        users[idx] = { ...users[idx], ...updates };
        localStorage.setItem("stajer_users", JSON.stringify(users));
        return users[idx];
    }
    return null;
};
