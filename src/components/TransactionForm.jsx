import React, { useState } from 'react';
import './TransactionForm.css';

const TransactionForm = ({ onSave, onCancel, initialData }) => {
    const [type, setType] = useState(initialData ? initialData.type : 'income');
    const [description, setDescription] = useState(initialData ? initialData.description : '');
    const [amount, setAmount] = useState(initialData ? String(initialData.amount).replace('.', ',') : '');
    const [hours, setHours] = useState(initialData ? initialData.hours : '');
    const [km, setKm] = useState(initialData ? initialData.km : '');
    const [date, setDate] = useState(initialData ? initialData.date : new Date().toISOString().split('T')[0]);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validação básica
        if (!description || !amount) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        // Tratamento robusto de números
        let cleanAmountString = String(amount).replace(',', '.').replace(/[^0-9.]/g, '');
        const numericAmount = parseFloat(cleanAmountString);

        if (isNaN(numericAmount) || numericAmount <= 0) {
            alert('Valor inválido.');
            return;
        }

        const numericHours = hours ? parseFloat(hours) : 0;
        const numericKm = km ? parseFloat(km) : 0;

        onSave({
            type,
            description,
            amount: numericAmount,
            hours: numericHours,
            km: numericKm,
            date
        });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{initialData ? 'Editar Transação' : 'Nova Transação'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Tipo</label>
                        <div className="type-selector">
                            <button
                                type="button"
                                className={type === 'income' ? 'active income' : ''}
                                onClick={() => setType('income')}
                            >
                                Ganho
                            </button>
                            <button
                                type="button"
                                className={type === 'expense' ? 'active expense' : ''}
                                onClick={() => setType('expense')}
                            >
                                Carro
                            </button>
                            <button
                                type="button"
                                className={type === 'personal' ? 'active personal' : ''}
                                onClick={() => setType('personal')}
                            >
                                Pessoal
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Descrição</label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Ex: Gasolina, Uber..."
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Valor (R$)</label>
                            <input
                                type="text"
                                inputMode="decimal"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0,00"
                            />
                        </div>

                        {type === 'income' && (
                            <div className="form-group">
                                <label>Horas Trabalhadas</label>
                                <input
                                    type="number"
                                    step="0.5"
                                    value={hours}
                                    onChange={(e) => setHours(e.target.value)}
                                    placeholder="Ex: 8"
                                />
                            </div>
                        )}

                        {type === 'expense' && (
                            <div className="form-group">
                                <label>Km Rodados (Opcional)</label>
                                <input
                                    type="number"
                                    step="1"
                                    value={km}
                                    onChange={(e) => setKm(e.target.value)}
                                    placeholder="Ex: 300"
                                />
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Data</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn-cancel" onClick={onCancel}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn-save">
                            Salvar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TransactionForm;
