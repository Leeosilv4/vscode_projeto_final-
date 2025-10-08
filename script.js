// CONSTANTES E CONFIGURAÇÕES
const CONFIG = {
    PRECOS: {
        "Pizza Calabresa": 15,
        "Pizza Mussarela": 15,
        "Pizza Portuguesa": 18,
        "Pizza Frango c/ Catupiry": 15,
        "Pizza Quatro Queijos": 20,
        "Pizza Chocolate": 30,
        "Pizza Romeu e Julieta": 25,
        "Borda Catupiry": 7,
        "Borda Cheddar": 7,
        "Borda Mista": 10,
        "Borda Doce": 10,
        "Adicional Bacon": 5,
        "Adicional Milho": 2.5
    }
};

// GERENCIAMENTO DO CARRINHO
export function adicionarCarrinho(name, price, quantidade = 1) {
    console.log('Adicionando ao carrinho:', name, price);
    
    let carrinho = obterCarrinho();
    
    // Verifica se o item já existe no carrinho
    const itemExistente = carrinho.find(item => item.name === name);
    if (itemExistente) {
        itemExistente.quantidade += quantidade;
        // Usar preço da configuração se disponível
        itemExistente.price = CONFIG.PRECOS[name] || price;
    } else {
        carrinho.push({ 
            name, 
            price: CONFIG.PRECOS[name] || price,
            quantidade,
            id: Date.now() + Math.random()
        });
    }
    
    salvarCarrinho(carrinho);
    atualizarCarrinho();
    mostrarToast(`✅ ${name} adicionado ao carrinho!`);
}

export function obterCarrinho() {
    try {
        return JSON.parse(localStorage.getItem("carrinho")) || [];
    } catch (error) {
        console.error('Erro ao obter carrinho:', error);
        return [];
    }
}

function salvarCarrinho(carrinho) {
    try {
        localStorage.setItem("carrinho", JSON.stringify(carrinho));
        console.log('Carrinho salvo:', carrinho);
    } catch (error) {
        console.error('Erro ao salvar carrinho:', error);
    }
}

export function atualizarCarrinho() {
    try {
        const carrinho = obterCarrinho();
        const contador = document.getElementById("contador-carrinho");
        const totalItens = carrinho.reduce((total, item) => total + (item.quantidade || 1), 0);
        
        console.log('Atualizando contador:', totalItens, 'itens');
        
        if (contador) {
            contador.textContent = totalItens;
            // Efeito visual quando adiciona items
            if (totalItens > 0) {
                contador.classList.add('pulse');
                setTimeout(() => contador.classList.remove('pulse'), 500);
            }
        }
    } catch (error) {
        console.error('Erro ao atualizar carrinho:', error);
    }
}

export function removerItem(index) {
    try {
        let carrinho = obterCarrinho();
        const itemRemovido = carrinho[index];
        carrinho.splice(index, 1);
        salvarCarrinho(carrinho);
        atualizarCarrinho();
        mostrarToast(`🗑️ ${itemRemovido.name} removido`);
        
        // Recarregar a visualização do carrinho se a função existir
        if (typeof window.carregarCarrinho === 'function') {
            window.carregarCarrinho();
        }
    } catch (error) {
        console.error('Erro ao remover item:', error);
        mostrarToast('❌ Erro ao remover item', 'erro');
    }
}

export function limparCarrinho() {
    try {
        localStorage.removeItem("carrinho");
        atualizarCarrinho();
        mostrarToast("🛒 Carrinho esvaziado");
        
        if (typeof window.carregarCarrinho === 'function') {
            window.carregarCarrinho();
        }
    } catch (error) {
        console.error('Erro ao limpar carrinho:', error);
    }
}

export function calcularTotal() {
    const carrinho = obterCarrinho();
    return carrinho.reduce((total, item) => total + (item.price * (item.quantidade || 1)), 0);
}

// TOAST NOTIFICATIONS
export function mostrarToast(msg, tipo = 'sucesso') {
    let toast = document.getElementById("toast");
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        document.body.appendChild(toast);
    }
    
    toast.textContent = msg;
    toast.className = `toast ${tipo}`;
    toast.style.display = "block";
    
    setTimeout(() => { 
        toast.style.display = "none";
    }, 3000);
}

// INICIALIZAÇÃO
document.addEventListener("DOMContentLoaded", function() {
    console.log('Página carregada, inicializando carrinho...');
    atualizarCarrinho();
});