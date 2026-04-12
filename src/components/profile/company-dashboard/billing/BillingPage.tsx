import { useState } from "react";
import { useAuth } from "../../../../context/AuthContext";
import { useModals } from "../../../../context/ModalContext";
import "./BillingPage.css";

interface Transaction {
    id: string;
    date: string;
    type: 'topup' | 'spending';
    description: string;
    amount: number;
    status: 'completed' | 'pending' | 'failed';
}

const MOCK_TRANSACTIONS: Transaction[] = [
    { id: "1", date: "10.04.2024, 14:20", type: 'spending', description: 'Закреп стажировки "Backend Developer"', amount: 500, status: 'completed' },
    { id: "2", date: "01.04.2024, 09:00", type: 'spending', description: 'Подписка Stajer Pro (Апрель)', amount: 1490, status: 'completed' },
    { id: "3", date: "28.03.2024, 18:35", type: 'topup', description: 'Пополнение баланса (Карта *4242)', amount: 5000, status: 'completed' },
    { id: "4", date: "15.03.2024, 11:10", type: 'spending', description: 'Закреп стажировки "Data Analyst"', amount: 500, status: 'completed' },
];

export const BillingPage = () => {
    const { currentUser } = useAuth();
    const { showToast, openConfirm, closeConfirm } = useModals();
    const [balance, setBalance] = useState(2510);
    const [isSubscribed, setIsSubscribed] = useState(true);
    const [pinBalance, setPinBalance] = useState(12);
    const [pinBuyCount, setPinBuyCount] = useState(1);
    
    const PIN_PRICE = 1500;
    const PREMIUM_PRICE = 2999;

    const handleCancelSubscription = () => {
        openConfirm({
            title: "Отменить подписку?",
            message: "Все преимущества подписки будут доступны до конца оплаченного периода (01.05.2024).",
            confirmLabel: "Подтвердить отмену",
            variant: 'danger',
            onConfirm: () => {
                setIsSubscribed(false);
                closeConfirm();
                showToast("Подписка отменена");
            }
        });
    };

    const handleBuyPins = () => {
        const total = pinBuyCount * PIN_PRICE;
        
        if (balance < total) {
            openConfirm({
                title: "Недостаточно средств",
                message: `Для покупки закрепов необходимо ${total.toLocaleString()} ₽. Ваш баланс: ${balance.toLocaleString()} ₽. Пожалуйста, пополните счет.`,
                confirmLabel: "Понятно",
                onConfirm: () => closeConfirm()
            });
            return;
        }

        setBalance(prev => prev - total);
        setPinBalance(prev => prev + pinBuyCount);
        showToast(`Успешно куплено закрепов: ${pinBuyCount} (Списано ${total.toLocaleString()} ₽)`);
        setPinBuyCount(1);
    };

    const handleCounterChange = (val: string) => {
        const num = parseInt(val);
        if (!isNaN(num)) {
            setPinBuyCount(Math.max(1, num));
        } else if (val === "") {
            setPinBuyCount(0);
        }
    };

    const handleBuySubscription = () => {
        // В реальном проекте здесь был бы редирект на платежный шлюз:
        // window.location.href = "https://payment.gateway/..."
        setIsSubscribed(true);
        showToast("Перенаправление на страницу оплаты...");
    };

    return (
        <div className="billing-page">
            <header className="billing-header">
                <div className="billing-header__text">
                    <h2 className="billing-header__title">Баланс и подписка</h2>
                    <p className="billing-header__desc">Управляйте платежами, подпиской и продвижением ваших вакансий</p>
                </div>
            </header>

            <div className="billing-grid">
                {/* 1. Subscription Premium Card */}
                <div className={`billing-card premium-card ${isSubscribed ? "is-active" : ""}`}>
                    <div className="premium-card__content">
                        {isSubscribed ? (
                            <>
                                <div className="premium-card__info-side">
                                    <h3 className="premium-card__title-text">
                                        Stajer Premium X
                                        <span className="active-dot-wrapper">
                                            <span className="active-dot"></span>
                                            Активна
                                        </span>
                                    </h3>
                                    <p className="renew-date">Следующее списание: 12 мая 2026</p>
                                </div>
                                <div className="premium-actions-active">
                                    <button className="premium-cancel-btn" onClick={handleCancelSubscription}>
                                        Отменить подписку
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="premium-card__info-side">
                                    <h3 className="premium-card__title-text">Stajer Premium X</h3>
                                    <div className="premium-perks-mini">
                                        <ul className="premium-perks__list">
                                            <li>
                                                <span className="check-icon">
                                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                                </span>
                                                Неограниченное кол-во публикаций
                                            </li>
                                            <li>
                                                <span className="check-icon">
                                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                                </span>
                                                1 бесплатный закреп каждую неделю
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <button className="premium-btn" onClick={handleBuySubscription}>
                                    За 2999 ₽ в месяц
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* 2. Balance Card */}
                <div className="billing-card balance-card-new">
                    <div className="card-label">Текущий баланс</div>
                    <div className="balance-value">
                        {balance.toLocaleString()} <span>₽</span>
                    </div>
                    <button className="topup-btn" onClick={() => showToast("Перенаправление на страницу оплаты...")}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        Пополнить
                    </button>
                </div>

                {/* 3. Promotion Card */}
                <div className="billing-card promo-card-new">
                    <div className="card-label">Продвижение</div>
                    
                    <div className="promo-service">
                        <div className="promo-service__info">
                            <span className="promo-service__name">Закрепить вакансию на 7 дней (1500р)</span>
                        </div>
                        
                        <div className="promo-service__inventory">
                            <span className="inventory-label">Баланс ваших закрепов</span>
                            <span className="inventory-value">{pinBalance}</span>
                        </div>
                    </div>

                    <div className="promo-actions-row">
                        <div className="counter-btn-group">
                            <button 
                                className="counter-btn" 
                                onClick={() => setPinBuyCount(Math.max(1, pinBuyCount - 1))}
                                disabled={pinBuyCount <= 1}
                            >—</button>
                            <input 
                                type="number"
                                className="counter-input"
                                value={pinBuyCount === 0 ? "" : pinBuyCount}
                                onChange={(e) => handleCounterChange(e.target.value)}
                                min="1"
                            />
                            <button 
                                className="counter-btn" 
                                onClick={() => setPinBuyCount(pinBuyCount + 1)}
                            >+</button>
                        </div>
                        <button className="buy-service-btn-sm" onClick={handleBuyPins}>
                            Купить за { (pinBuyCount * PIN_PRICE).toLocaleString() } ₽
                        </button>
                    </div>
                </div>
            </div>

            {/* Transaction History Section */}
            <section className="transactions-section">
                <h3 className="transactions-section__title">История транзакций</h3>
                <div className="transactions-container">
                    <table className="transactions-table">
                        <thead>
                            <tr>
                                <th>ДАТА И ВРЕМЯ</th>
                                <th>ОПИСАНИЕ</th>
                                <th align="right">СУММА</th>
                                <th align="center">СТАТУС</th>
                            </tr>
                        </thead>
                        <tbody>
                            {MOCK_TRANSACTIONS.map(tx => (
                                <tr key={tx.id}>
                                    <td className="tx-date">{tx.date}</td>
                                    <td className="tx-desc">{tx.description}</td>
                                    <td className="tx-amount" align="right">
                                        <span className={tx.type === 'topup' ? 'plus' : 'minus'}>
                                            {tx.type === 'topup' ? '+ ' : '- '}
                                            {tx.amount.toLocaleString()} ₽
                                        </span>
                                    </td>
                                    <td align="center">
                                        <span className={`status-tag ${tx.status}`}>
                                            ВЫПОЛНЕНО
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};
