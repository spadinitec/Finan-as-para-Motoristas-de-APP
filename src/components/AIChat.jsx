import React, { useState, useEffect, useRef } from 'react';
import './AIChat.css';

const AIChat = ({ transactions, goals }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, sender: 'ai', text: 'Olá! Sou seu Copiloto Financeiro. Pode me perguntar sobre seus gastos, metas ou pedir um resumo.' }
    ]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const processMessage = (text) => {
        const lowerText = text.toLowerCase();
        let response = "Desculpe, não entendi. Tente 'resumo', 'bater meta', 'gastos', 'horas' ou 'km'.";

        // Lógica da IA
        const income = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + Number(curr.amount), 0);
        const expense = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + Number(curr.amount), 0);
        const personal = transactions.filter(t => t.type === 'personal').reduce((acc, curr) => acc + Number(curr.amount), 0);
        const totalExpense = expense + personal;
        const balance = income - totalExpense;
        const hours = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + (Number(curr.hours) || 0), 0);

        // Novos cálculos
        const totalKm = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + (Number(curr.km) || 0), 0);

        if (lowerText.includes('resumo') || lowerText.includes('hoje')) {
            response = `Resumo Atual:
            💰 Ganhos: R$ ${income.toFixed(2)}
            💸 Gastos: R$ ${totalExpense.toFixed(2)}
            🏁 Saldo: R$ ${balance.toFixed(2)}`;
        } else if (lowerText.includes('meta')) {
            const metaMensal = goals.monthly;
            const falta = metaMensal - balance;
            if (falta > 0) {
                response = `Sua meta é R$ ${metaMensal.toFixed(2)}. Falta R$ ${falta.toFixed(2)} para atingir! Vamos lá! 🚀`;
            } else {
                response = `Parabéns! 🎉 Você já superou sua meta de R$ ${metaMensal.toFixed(2)} em R$ ${Math.abs(falta).toFixed(2)}!`;
            }
        } else if (lowerText.includes('gastos') || lowerText.includes('gastei')) {
            response = `Você gastou R$ ${expense.toFixed(2)} com o carro e R$ ${personal.toFixed(2)} com despesas pessoais. Total: R$ ${totalExpense.toFixed(2)}.`;
        } else if (lowerText.includes('horas') || lowerText.includes('trabalhei')) {
            const media = hours > 0 ? (income / hours).toFixed(2) : 0;
            response = `Você registrou ${hours} horas trabalhadas. Sua média é de R$ ${media}/hora.`;
        } else if (lowerText.includes('km') || lowerText.includes('rodados') || lowerText.includes('rendimento')) {
            if (totalKm > 0) {
                const reaisPorKm = (income / totalKm).toFixed(2);
                const custoPorKm = (expense / totalKm).toFixed(2);
                response = `Você rodou ${totalKm} km.
                 📈 Rendimento: R$ ${reaisPorKm}/km
                 📉 Custo: R$ ${custoPorKm}/km`;
            } else {
                response = "Ainda não tenho dados de Km. Crie uma despesa de 'Combustível' e informe os Km rodados!";
            }
        } else if (lowerText.includes('comprar') || lowerText.includes('posso')) {
            // Verificar wishlist
            const wishlist = goals?.wishlist || [];
            const itemDesejado = wishlist.find(w => lowerText.includes(w.name.toLowerCase()));

            if (itemDesejado) {
                if (balance >= itemDesejado.cost) {
                    response = `Sim! Você tem R$ ${balance.toFixed(2)}, o suficiente para comprar ${itemDesejado.name} (R$ ${itemDesejado.cost.toFixed(2)})! 🎉`;
                } else {
                    response = `Ainda não. Faltam R$ ${(itemDesejado.cost - balance).toFixed(2)} para comprar ${itemDesejado.name}. Foco! 💪`;
                }
            } else {
                // Lógica genérica antiga
                const valor = text.match(/\d+/);
                if (valor) {
                    const custo = parseFloat(valor[0]);
                    if (balance >= custo) {
                        response = `Sim! Você tem R$ ${balance.toFixed(2)} de saldo, pode gastar R$ ${custo.toFixed(2)}.`;
                    } else {
                        response = `Cuidado! Você só tem R$ ${balance.toFixed(2)}. Faltam R$ ${(custo - balance).toFixed(2)}.`;
                    }
                } else {
                    response = "O que você quer comprar? Fale o nome de um item da sua Lista de Desejos ou um valor (ex: 'posso gastar 50?').";
                }
            }
        }

        return response;
    };

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), sender: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');

        // Simular "pensando"
        setTimeout(() => {
            const aiResponse = processMessage(userMsg.text);
            setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: aiResponse }]);
        }, 500);
    };

    return (
        <>
            <button className="fab-ai" onClick={() => setIsOpen(!isOpen)}>
                🤖
            </button>

            {isOpen && (
                <div className="ai-chat-window">
                    <div className="ai-header">
                        <h3>Copiloto Financeiro</h3>
                        <button onClick={() => setIsOpen(false)}>✖</button>
                    </div>
                    <div className="ai-messages">
                        {messages.map(msg => (
                            <div key={msg.id} className={`message ${msg.sender}`}>
                                {msg.text.split('\n').map((line, i) => <p key={i}>{line}</p>)}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    <form className="ai-input-area" onSubmit={handleSend}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Pergunte algo..."
                        />
                        <button type="submit">➤</button>
                    </form>
                </div>
            )}
        </>
    );
};

export default AIChat;
