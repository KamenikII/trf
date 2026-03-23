import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import { ProfilePage } from "./ProfilePage";

// Обёртка с провайдерами для тестирования
const renderWithProviders = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <ProfilePage />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe("ProfilePage", () => {
  it("renders profile page with mock data when no user is logged in", () => {
    renderWithProviders();

    // Проверяем, что отображается мок-имя
    expect(screen.getByText("Леонид Каменик")).toBeInTheDocument();
  });

  it("renders all tabs", () => {
    renderWithProviders();

    expect(screen.getByRole("tab", { name: "Основная" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Проекты" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Задания" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Стажировки" })).toBeInTheDocument();
  });

  it("shows 'Основная' tab as active by default", () => {
    renderWithProviders();

    const mainTab = screen.getByRole("tab", { name: "Основная" });
    expect(mainTab).toHaveAttribute("aria-selected", "true");
  });

  it("displays stats cards on main tab", () => {
    renderWithProviders();

    expect(screen.getByText("РЕЙТИНГ")).toBeInTheDocument();
    expect(screen.getByText("ЗАРАБОТАНО")).toBeInTheDocument();
  });

  it("displays skills on main tab", () => {
    renderWithProviders();

    expect(screen.getByText("НАВЫКИ")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
  });

  it("switches to projects tab and shows placeholder", () => {
    renderWithProviders();

    fireEvent.click(screen.getByRole("tab", { name: "Проекты" }));

    expect(screen.getByText("Проекты скоро появятся")).toBeInTheDocument();
    expect(screen.getByText("Здесь будут отображаться ваши проекты")).toBeInTheDocument();
  });

  it("switches to tasks tab and shows placeholder", () => {
    renderWithProviders();

    fireEvent.click(screen.getByRole("tab", { name: "Задания" }));

    expect(screen.getByText("Заданий пока нет")).toBeInTheDocument();
  });

  it("switches to internships tab and shows placeholder", () => {
    renderWithProviders();

    fireEvent.click(screen.getByRole("tab", { name: "Стажировки" }));

    expect(screen.getByText("Стажировки скоро появятся")).toBeInTheDocument();
  });

  it("renders resume download button", () => {
    renderWithProviders();

    expect(screen.getByText("Скачать резюме")).toBeInTheDocument();
  });

  it("renders avatar with initials", () => {
    renderWithProviders();

    // Инициалы «ЛК» из мока (Леонид Каменик)
    const avatar = screen.getByText("ЛК");
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveClass("profile__avatar");
  });
});
