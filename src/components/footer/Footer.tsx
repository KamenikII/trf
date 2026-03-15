import './Footer.css';
export const Footer = () => {
  return (
    <footer className="footer" id="main-footer">
      <div className="footer__inner">
        <div className="footer__top">
          <a href="/" className="footer__logo">
            <img src="/img/Logo.svg" alt="стажёр.рф" className="footer__logo-img" />
          </a>
          <div className="footer__columns">
            <div className="footer__column">
              <h4 className="footer__heading">Платформа</h4>
              <a href="#" className="footer__link">Проекты</a>
              <a href="#" className="footer__link">Задания</a>
              <a href="#" className="footer__link">Стажировки</a>
              <a href="#" className="footer__link">Магазин</a>
            </div>
            <div className="footer__column">
              <h4 className="footer__heading">Поддержка</h4>
              <a href="#" className="footer__link">FAQ</a>
              <a href="#" className="footer__link">Контакты</a>
              <a href="#" className="footer__link">Обратная связь</a>
            </div>
            <div className="footer__column">
              <h4 className="footer__heading">Юридическое</h4>
              <a href="#" className="footer__link">Условия использования</a>
              <a href="#" className="footer__link">Политика конфиденциальности</a>
            </div>
          </div>
        </div>
        <div className="footer__bottom">
          <p className="footer__copy">© 2026 стажёр.рф. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}
