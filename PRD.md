# Documento de Requisitos do Produto (PRD)
# Finanças para Motoristas de App

**Versão:** 1.0
**Status:** MVP Implementado
**Data:** 14/02/2026

## 1. Introdução
O **Finanças para Motoristas de App** é uma ferramenta de gestão financeira especializada projetada para motoristas de aplicativos (Uber, 99, etc.). Diferente de aplicativos de finanças genéricos, ele foca nas métricas que realmente importam para o motorista: ganhos por hora, eficiência de combustível (Km/L ou R$/Km) e lucro líquido diário após os custos do veículo.

## 2. Declaração do Problema
Motoristas de aplicativo muitas vezes têm dificuldade em separar o "ganho bruto" do "lucro líquido" devido a custos imediatos como combustível e custos de longo prazo como manutenção. Falta uma ferramenta simples para acompanhar o valor real da hora trabalhada e o progresso em direção a metas financeiras enquanto estão na rua.

## 3. Público-Alvo
*   **Primário:** Motoristas de Aplicativo (Uber, 99, Indrive).
*   **Necessidades:** Entrada rápida de dados, funcionamento offline, visualização clara do "Lucro Real".

## 4. Funcionalidades Principais

### 4.1. Dashboard Financeiro
*   **Cartões de Resumo:** Visualização instantânea de Ganhos, Custos do Carro, Gastos Pessoais e Saldo Final.
*   **Métricas de Eficiência:**
    *   **R$/Hora:** Cálculo do ganho real por hora trabalhada.
    *   **R$/Km:** Ganhos e custos por Quilômetro rodado (para analisar a rentabilidade das corridas).

### 4.2. Gestão de Transações
*   **Entrada Rápida:** Formulário minimalista para adicionar transações em segundos.
*   **Categorias:**
    *   **Ganhos:** Valor recebido + Horas trabalhadas.
    *   **Custos (Carro):** Combustível, Manutenção + Km percorrido (odômetro).
    *   **Pessoal:** Alimentação, outros custos.
*   **Histórico:** Lista de transações recentes com capacidade de edição/exclusão.

### 4.3. Sistema de Metas e Conquistas
*   **Meta Mensal:** Permite definir um alvo de ganho mensal.
    *   *Visual:* Barra de progresso mostrando a % atingida.
*   **Lista de Desejos (Wishlist):** Motoristas podem adicionar itens específicos que desejam comprar (ex: "Pneu Novo", "Celular").
    *   *Lógica:* O app indica se o *Saldo Líquido* atual é suficiente para comprar o item.
*   **Interface em Abas:** Separação limpa entre Meta Mensal e Lista de Desejos para melhor usabilidade no celular.

### 4.4. Copiloto Financeiro (IA)
*   **Recurso:** Uma interface de "Chat" integrada com lógica local (sem necessidade de API externa).
*   **Capacidades:**
    *   Responde perguntas como "Posso comprar o pneu?".
    *   Fornece resumos: "Quanto ganhei por km?".
    *   Motiva o motorista com base no progresso das metas.

### 4.5. Persistência de Dados e Confiabilidade
*   **Armazenamento Local:** Todos os dados são salvos localmente no dispositivo do usuário (navegador). Sem login ou internet necessária.
*   **Recuperação de Falhas:** Salvaguardas integradas para detectar e corrigir dados corrompidos automaticamente sem perder a funcionalidade do app.

## 5. Requisitos Técnicos
*   **Plataforma:** Aplicação Web (Responsiva para Mobile).
*   **Tecnologias:** React (Vite), CSS3, Recharts (para análise gráfica).
*   **Armazenamento:** Browser localStorage.
*   **Desempenho:** Carregamento instantâneo, funciona offline (após o carregamento inicial).

## 6. Histórias de Usuário
1.  *Como motorista, quero registrar meu gasto com combustível e a quilometragem para saber se meu carro está consumindo muito.*
2.  *Como motorista, quero definir uma meta de R$ 3000/mês e ver uma barra de progresso para me manter motivado.*
3.  *Como motorista, quero adicionar "Pneu Novo" a uma lista de desejos e que o app me diga quando tenho lucro suficiente para comprá-los.*
4.  *Como usuário, quero que meus dados sejam salvos automaticamente para não perdê-los quando fechar o navegador.*

## 7. Roteiro Futuro (Pós-MVP)
*   **Sincronização na Nuvem:** Login opcional para salvar dados na nuvem.
*   **Alertas de Manutenção:** Lembretes para troca de óleo baseados nos Km percorridos.
*   **Relatórios Semanais:** Exportação de ganhos em PDF para fins fiscais.
