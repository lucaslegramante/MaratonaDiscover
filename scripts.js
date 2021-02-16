// defini constante
const Modal = {
    open_close(){ //criei uma funcionalidade para essa constante
        document.querySelector('.modal-overlay').classList.toggle('active')     // excecução    
    }
}

const Storage = {
    get () {
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
    },

    set(transactions) {
        localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions))
    }
}

const Transaction = {
    all: Storage.get(),

    add(transaction) {
        Transaction.all.push(transaction)

        App.reload()
    },

    remove(index){
        Transaction.all.splice(index,1)

        App.reload()
    },

    incomes (){ // soma das entradas
        let income = 0;
        // pegar todas Transações
        // para cada transacao
        Transaction.all.forEach((transaction) => {
            // se for maior que zero 
            if(transaction.amount > 0 ){
                // somar a uma variavel e retornar uam varial
                income += transaction.amount;
            }
        })
        return income;
    },

    expenses () { // soma das saidas
        let expense = 0;
        // pegar todas Transações
        // para cada transacao
        Transaction.all.forEach((transaction) => {
            // se for menor que zero 
            if(transaction.amount < 0 ){
                // somar a uma variavel e retornar uam varial
                expense += transaction.amount;
            }
        })
        return expense;
    },

    total () {// entradas - saidas 
        return Transaction.incomes() + Transaction.expenses();
    }
}

// Substituir os dados do HTML com os dados do JS
// criação da TR no html
const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index) { // criar uma nova transacao
        
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index

        DOM.transactionsContainer.appendChild(tr)
    },

    innerHTMLTransaction(transaction, index) { // formato de cada transacao
        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        const amount = Ultils.formatCurrency(transaction.amount)

        const html =`
        <td class="description">${transaction.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td>
                <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover Transação">
        </td>    
        `

        return html
    },

    updateBalance() { // atualizar entradas, saidas e total
        document.getElementById('incomeDisplay').innerHTML = Ultils.formatCurrency(Transaction.incomes())

        document.getElementById('expenseDisplay').innerHTML = Ultils.formatCurrency(Transaction.expenses())

        document.getElementById('totalDisplay').innerHTML = Ultils.formatCurrency(Transaction.total())
    },

    clearTransactions() { // limpar transacoes
        DOM.transactionsContainer.innerHTML =""
    }
}

// formata os numemes das transações
const Ultils = {
    formatAmount(value){
        value = Number(value.replace(/\,\./g,"")) * 100

        return value
    },

    formatDate(date){
        const splittedDate = date.split("-")
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },

    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : ""

        value = String(value).replace(/\D/g, "")

        value = Number(value) / 100

        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })

        return signal + value
    }
}

// formulario
const Form = {
    description : document.querySelector('input#description'),
    amount : document.querySelector('input#amount'),
    date : document.querySelector('input#date'),

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value ,
            date: Form.date.value
        }
    },

    validateField() {
        const { description , amount, date } = Form.getValues()

        if(description.trim() ==="" || 
            amount.trim() === "" || 
            date.trim() === ""){
                throw new Error("Por favor, preencha todos os campos")
            }
    },

    formatValues(){
        let { description , amount, date } = Form.getValues()

        amount = Ultils.formatAmount(amount)

        date = Ultils.formatDate(date)

        return {
            description,
            amount,
            date
        }

        
    },

    clearFields() {
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },
    
    submit(event) {
        event.preventDefault()

        try {
             // verificar se todas informacoes foram preenchidas
            Form.validateField()
            // formatar os dados para salvar
            const transaction = Form.formatValues()
            // salvar e adicionar transacao
            Transaction.add(transaction)
            // limpar os dados do formulario
            Form.clearFields()
            // modal feche
            Modal.open_close()
            // atualizar a aplicacao esta acontecendo no ADD
                  
        } catch (error) {
            alert(error.message)
        }
    }
}

const App = {
    init () {// pega todas as transacoes  e adiciona no documento 
        // adiciona todos transactions na lista ''popula ''
        Transaction.all.forEach((transaction, index) => {
            DOM.addTransaction(transaction, index)            
        })

        DOM.updateBalance()

        Storage.set(Transaction.all) // atualizando ou guarndando seus dados
    },

    reload () { // limpa a pagina e recarrega os dados
        DOM.clearTransactions()
        App.init()

    },
}

App.init()



