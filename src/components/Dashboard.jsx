import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import './Dashboard.css';

import TransactionForm from './TransactionForm';
import AIChat from './AIChat';

const Dashboard = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);

    // Inicializar transações do localStorage ou usar padrão
    // Inicializar transações do localStorage ou usar padrão
    // Inicializar transações do localStorage ou usar padrão
    const [transactions, setTransactions] = useState(() => {
        const saved = localStorage.getItem('transactions');
        const defaultTransactions = [
            { id: 1, type: 'income', amount: 85.50, hours: 4, description: 'Uber - Tarde', date: '2023-10-27' },
            { id: 2, type: 'expense', amount: 20.00, description: 'Gasolina', date: '2023-10-27', km: 0 },
        ];

        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) {
                    return parsed.map(t => ({
                        ...t,
                        amount: typeof t.amount === 'number' ? t.amount : (parseFloat(String(t.amount).replace(',', '.')) || 0),
                        hours: typeof t.hours === 'number' ? t.hours : (parseFloat(String(t.hours).replace(',', '.')) || 0),
                        km: typeof t.km === 'number' ? t.km : (parseFloat(String(t.km).replace(',', '.')) || 0),
                    }));
                }
                return defaultTransactions;
            } catch (e) {
                console.error("Error parsing transactions", e);
                return defaultTransactions;
            }
        }
        return defaultTransactions;
    });

    // Inicializar metas do localStorage
    // Inicializar metas do localStorage
    // Inicializar metas do localStorage
    const [goals, setGoals] = useState(() => {
        const saved = localStorage.getItem('goals');
        const defaultGoals = { monthly: 3000, wishlist: [] };
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                const sanitized = { ...defaultGoals, ...parsed };

                // Sanitize monthly goal
                sanitized.monthly = typeof sanitized.monthly === 'number' ? sanitized.monthly : (parseFloat(String(sanitized.monthly).replace(',', '.')) || 3000);

                // Sanitize wishlist
                if (Array.isArray(sanitized.wishlist)) {
                    sanitized.wishlist = sanitized.wishlist.map(w => ({
                        ...w,
                        cost: typeof w.cost === 'number' ? w.cost : (parseFloat(String(w.cost).replace(',', '.')) || 0)
                    }));
                } else {
                    sanitized.wishlist = [];
                }

                return sanitized;
            } catch (e) {
                console.error("Error parsing goals", e);
                return defaultGoals;
            }
        }
        return defaultGoals;
    });

    // Persistência
    useEffect(() => {
        localStorage.setItem('transactions', JSON.stringify(transactions));
    }, [transactions]);

    useEffect(() => {
        localStorage.setItem('goals', JSON.stringify(goals));
    }, [goals]);

    // Estados para formulários de metas
    const [isEditingGoal, setIsEditingGoal] = useState(false);
    const [newGoalValue, setNewGoalValue] = useState(goals.monthly);
    const [wishlistName, setWishlistName] = useState('');
    const [wishlistCost, setWishlistCost] = useState('');
    const [activeTab, setActiveTab] = useState('monthly');

    const handleUpdateMonthlyGoal = () => {
        setGoals(prev => ({ ...prev, monthly: Number(newGoalValue) }));
        setIsEditingGoal(false);
    };

    const handleAddWishlistItem = (e) => {
        e.preventDefault();
        if (!wishlistName || !wishlistCost) return;
        const newItem = {
            id: Date.now(),
            name: wishlistName,
            cost: Number(wishlistCost)
        };
        setGoals(prev => ({ ...prev, wishlist: [...prev.wishlist, newItem] }));
        setWishlistName('');
        setWishlistCost('');
    };

    const handleRemoveWishlistItem = (id) => {
        setGoals(prev => ({ ...prev, wishlist: prev.wishlist.filter(item => item.id !== id) }));
    };

    const [editingTransaction, setEditingTransaction] = useState(null);

    const handleSaveTransaction = (transactionData) => {
        if (editingTransaction) {
            // Editar existente
            const updatedTransactions = transactions.map(t =>
                t.id === editingTransaction.id ? { ...transactionData, id: t.id } : t
            );
            setTransactions(updatedTransactions);
            setEditingTransaction(null);
        } else {
            // Criar nova
            const newTransaction = {
                ...transactionData,
                id: Date.now(),
            };
            setTransactions([newTransaction, ...transactions]);
        }
        setIsFormOpen(false);
    };

    const handleEdit = (transaction) => {
        setEditingTransaction(transaction);
        setIsFormOpen(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Tem certeza que deseja excluir esta transação?')) {
            setTransactions(transactions.filter(t => t.id !== id));
        }
    };

    const income = transactions
        .filter(t => t.type === 'income')
        .reduce((acc, curr) => acc + Number(curr.amount), 0);

    const expense = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, curr) => acc + Number(curr.amount), 0);

    const personalExpense = transactions
        .filter(t => t.type === 'personal')
        .reduce((acc, curr) => acc + Number(curr.amount), 0);

    const totalHours = transactions
        .filter(t => t.type === 'income')
        .reduce((acc, curr) => acc + (Number(curr.hours) || 0), 0);

    const hourlyRate = totalHours > 0 ? income / totalHours : 0;

    const finalBalance = income - expense - personalExpense;

    // Dados para o Gráfico de Despesas
    const expenseData = [
        { name: 'Carro', value: expense, color: '#f87171' }, // Red
        { name: 'Pessoal', value: personalExpense, color: '#60a5fa' }, // Blue
        { name: 'Lucro', value: Math.max(0, finalBalance), color: '#34d399' } // Green
    ].filter(d => d.value > 0);

    // Dados para Gráfico Semanal (Últimos 7 dias)
    const getLast7Days = () => {
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            days.push(d.toISOString().split('T')[0]);
        }
        return days;
    };

    const weeklyData = getLast7Days().map(date => {
        const dayIncome = transactions
            .filter(t => t.type === 'income' && t.date === date)
            .reduce((acc, curr) => acc + Number(curr.amount), 0);
        return { date: date.split('-').slice(1).join('/'), amount: dayIncome };
    });

    return (
        <div className="dashboard">
            <div className="summary-cards">
                <div className="card income">
                    <h3>Ganhos</h3>
                    <p>R$ {isNaN(income) ? '0.00' : income.toFixed(2)}</p>
                </div>
                <div className="card expense">
                    <h3>Custos Carro</h3>
                    <p>R$ {isNaN(expense) ? '0.00' : expense.toFixed(2)}</p>
                </div>
                <div className="card personal">
                    <h3>Pessoal</h3>
                    <p>R$ {isNaN(personalExpense) ? '0.00' : personalExpense.toFixed(2)}</p>
                </div>
                <div className="card hours">
                    <h3>Horas / Média</h3>
                    <p>{totalHours}h • R$ {isNaN(hourlyRate) ? '0.00' : hourlyRate.toFixed(2)}/h</p>
                </div>
                <div className="card balance">
                    <h3>Saldo Final</h3>
                    <p>R$ {isNaN(finalBalance) ? '0.00' : finalBalance.toFixed(2)}</p>
                </div>
            </div>

            {/* Goals Section Moved Here */}
            {/* Goals Section with Tabs */}
            <div className="goals-section-container">
                <div className="goals-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'monthly' ? 'active' : ''}`}
                        onClick={() => setActiveTab('monthly')}
                    >
                        Meta Mensal
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'wishlist' ? 'active' : ''}`}
                        onClick={() => setActiveTab('wishlist')}
                    >
                        Lista de Desejos
                    </button>
                </div>

                <div className="goals-content">
                    {activeTab === 'monthly' ? (
                        <div className="monthly-goal">
                            {isEditingGoal ? (
                                <div className="edit-goal-form">
                                    <input
                                        type="number"
                                        value={newGoalValue}
                                        onChange={(e) => setNewGoalValue(e.target.value)}
                                    />
                                    <button onClick={handleUpdateMonthlyGoal}>✔</button>
                                </div>
                            ) : (
                                <div className="goal-display">
                                    <p>Alvo: R$ {goals.monthly.toFixed(2)}</p>
                                    <button className="btn-small" onClick={() => setIsEditingGoal(true)}>✏️</button>
                                </div>
                            )}
                            <div className="progress-bar-bg">
                                <div
                                    className="progress-bar-fill"
                                    style={{ width: `${Math.min((finalBalance / goals.monthly) * 100, 100)}%` }}
                                ></div>
                            </div>
                            <small>{((finalBalance / goals.monthly) * 100).toFixed(1)}% atingido</small>
                            <div className="goal-status-text">
                                <p>Faltam R$ {Math.max(0, goals.monthly - finalBalance).toFixed(2)} para sua meta!</p>
                            </div>
                        </div>
                    ) : (
                        <div className="wishlist">
                            <form onSubmit={handleAddWishlistItem} className="add-wishlist-form">
                                <input
                                    placeholder="Item (ex: Pneu)"
                                    value={wishlistName}
                                    onChange={(e) => setWishlistName(e.target.value)}
                                />
                                <input
                                    placeholder="R$"
                                    type="number"
                                    value={wishlistCost}
                                    onChange={(e) => setWishlistCost(e.target.value)}
                                />
                                <button type="submit">+</button>
                            </form>
                            <ul className="wishlist-items" style={{ marginTop: '1rem' }}>
                                {goals.wishlist.length === 0 ? (
                                    <li style={{ textAlign: 'center', opacity: 0.5, fontStyle: 'italic', border: 'none' }}>Nenhum desejo na lista ainda.</li>
                                ) : (
                                    goals.wishlist.map(item => (
                                        <li key={item.id} className={finalBalance >= item.cost ? 'can-buy' : ''}>
                                            <span>{item.name}</span>
                                            <small style={{ color: '#94a3b8' }}>R$ {item.cost.toFixed(2)}</small>
                                            {finalBalance >= item.cost ? <span className="status-icon">✅</span> : <span className="status-icon">🔒</span>}
                                            <button onClick={() => handleRemoveWishlistItem(item.id)}>🗑️</button>
                                        </li>
                                    ))
                                )}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            <div className="charts-section">
                <h2>Distribuição Financeira</h2>
                <div className="charts-grid">
                    {expenseData.length > 0 ? (
                        <div className="chart-container">
                            <h3>Destino do Dinheiro</h3>
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie
                                        data={expenseData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={70}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {expenseData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <p className="no-data">Sem dados de despesas.</p>
                    )}

                    <div className="chart-container">
                        <h3>Ganhos da Semana</h3>
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={weeklyData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="date" fontSize={12} />
                                <YAxis fontSize={12} />
                                <Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`} />
                                <Bar dataKey="amount" fill="#34d399" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="recent-transactions">
                <h2>Histórico Recente</h2>
                <ul>
                    {transactions.map(t => (
                        <li key={t.id} className={`transaction-item ${t.type}`}>
                            <div className="transaction-info">
                                <span className="transaction-desc">{t.description}</span>
                                <span className="transaction-date">{t.date}</span>
                                {t.hours > 0 && <span className="transaction-hours">{t.hours}h</span>}
                                {t.km > 0 && <span className="transaction-hours">{t.km} km</span>}
                            </div>
                            <div className="transaction-actions">
                                <span className="transaction-amount">
                                    {t.type === 'income' ? '+' : '-'} R$ {t.amount.toFixed(2)}
                                </span>
                                <button className="btn-icon edit" onClick={() => handleEdit(t)}>✏️</button>
                                <button className="btn-icon delete" onClick={() => handleDelete(t.id)}>🗑️</button>
                            </div>
                        </li>
                    ))}
                </ul>
                <button
                    className="btn-text"
                    style={{ marginTop: '1rem', color: '#64748b', fontSize: '0.8rem' }}
                    onClick={() => {
                        if (window.confirm('Resetar todos os dados para o padrão?')) {
                            localStorage.clear();
                            window.location.reload();
                        }
                    }}
                >
                    Resetar Dados (Debug)
                </button>
            </div>

            <button className="fab-add" onClick={() => {
                setEditingTransaction(null);
                setIsFormOpen(true);
            }}>
                +
            </button>

            <AIChat transactions={transactions} goals={goals} />

            {
                isFormOpen && (
                    <TransactionForm
                        onSave={handleSaveTransaction}
                        onCancel={() => {
                            setIsFormOpen(false);
                            setEditingTransaction(null);
                        }}
                        initialData={editingTransaction}
                    />
                )
            }
        </div>
    );
};

export default Dashboard;
