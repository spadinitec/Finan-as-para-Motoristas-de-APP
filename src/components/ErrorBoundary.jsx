import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error", error, errorInfo);
    }

    handleReset = () => {
        if (window.confirm("Isso apagará todos os dados locais para recuperar o app. Tem certeza?")) {
            localStorage.clear();
            window.location.reload();
        }
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh',
                    backgroundColor: '#1e293b',
                    color: 'white',
                    padding: '2rem',
                    textAlign: 'center'
                }}>
                    <h1>Ops! Algo deu errado.</h1>
                    <p>Ocorreu um erro inesperado ao carregar seus dados.</p>
                    <pre style={{
                        background: 'rgba(0,0,0,0.3)',
                        padding: '1rem',
                        borderRadius: '8px',
                        maxWidth: '80%',
                        overflow: 'auto',
                        margin: '1rem 0',
                        fontSize: '0.8rem',
                        color: '#f87171'
                    }}>
                        {this.state.error?.toString()}
                    </pre>
                    <button
                        onClick={this.handleReset}
                        style={{
                            padding: '12px 24px',
                            backgroundColor: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        🔄 Resetar Dados e Recuperar App
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
