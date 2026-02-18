# Finanças para Motoristas de App 🚗💸

Aplicativo desenvolvido para ajudar motoristas de aplicativo (Uber, 99, etc.) a controlarem seus ganhos, custos e lucro real.

## 🌟 Funcionalidades
*   **Controle Financeiro**: Registre Ganhos, Gastos com Carro (Combustível/Manutenção) e Gastos Pessoais.
*   **Cálculo de Lucro**: Saiba exatamente quanto sobrou no fim do dia.
*   **Metas e Desejos**: Defina sua meta mensal e crie uma lista de desejos (o app diz se você pode comprar!).
*   **Análise de Km**: Saiba quanto está ganhando por Km rodado.
*   **100% Offline**: Seus dados ficam salvos no seu celular/navegador.

---

## 🚀 Como Colocar no Ar (GitHub Pages)

Este projeto já está configurado para ser publicado automaticamente!

### Passo 1: Subir os Arquivos para o GitHub
1.  Crie um novo repositório no GitHub.
2.  Vá em **Upload files** (Carregar arquivos).
3.  Arraste **TODOS** os arquivos desta pasta para lá, **EXCETO**:
    *   ❌ A pasta `node_modules`.
    *   ❌ A pasta `.gemini` ou `.git`.
4.  **IMPORTANTE**: Certifique-se de arrastar também a pasta oculta `.github` (ela contém o robô de deploy).

### Passo 2: Configurar o GitHub Pages
1.  No seu repositório no GitHub, vá em **Settings** (Configurações).
2.  No menu lateral esquerdo, clique em **Pages**.
3.  Em **Build and deployment** > **Source**, escolha **GitHub Actions**.
4.  Pronto! Em alguns minutos, o GitHub vai gerar um link (ex: `seu-usuario.github.io/driver-finance`) onde o app estará funcionando.

---

## 🛠️ Como Rodar no seu Computador

1.  Instale o [Node.js](https://nodejs.org/).
2.  Abra o terminal na pasta do projeto.
3.  Instale as dependências:
    ```bash
    npm install
    ```
4.  Rode o projeto:
    ```bash
    npm run dev
    ```
