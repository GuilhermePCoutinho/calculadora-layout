class CalculatorController {
    constructor() {
        this._dateEl = document.querySelector('.date');
        this._timeEl = document.querySelector('.time');
        this._displayEl = document.querySelector('.expression');
        this._prevEl = document.querySelector('.preview');
        this._listExp = ['0'];
        this._prev = 0;
        this.start();
        this.initAddEventsBtns();
        this.initAddEventsKeyboard();
        this._ifResult = false
    }

    start() {
        this.attDate();
        setInterval(() => {
            this.attDate();
        }, 1000)
    }

    inverse() {
        if (this.verifOperator(this.returnLast())) {
            this._listExp.pop()
        }
        if (this.returnLast() == '0') {
            return;
        }
        this._listExp[this._listExp.length - 1] = (1 / this.returnLast()).toString();
        this._ifResult = true;
        this.attDisplay()
    }

    attDate() {
        let date = new Date();

        this._dateEl.innerHTML = date.toLocaleDateString('pt-BR');
        this._timeEl.innerHTML = date.toLocaleTimeString('pt-BR');
    }

    attDisplay() {
        this._displayEl.innerHTML = this._listExp.join('');
        this._prevEl.innerHTML = this._prev;
        this._displayEl.scrollBy(100, 0)
    }

    clear() {
        this._listExp = ['0'];
        this._prev = '0'
        this.attDisplay();
    }

    erase() {
        this._listExp[this._listExp.length - 1] = this.returnLast().slice(0, -1);
        if (this.returnLast() == '') {
            if (this._listExp.length == 1) {
                this._listExp = ['0']
            } else {
                this._listExp.pop();
            }
        }
        this.attDisplay()
    }

    error() {
        this._displayEl.innerHTML = 'ERROR';
        this._prevEl.innerHTML = '';
        this._ifResult = true;
    }

    returnLast() {
        return this._listExp[this._listExp.length - 1];
    }

    verifOperator(val) {
        return ['×', '÷', '+', '-'].indexOf(val) > -1;

    }

    addValExp(val) {
        if (this.verifOperator(val)) {
            //se não for número
            //mandar o val para um index novo na nossa lista
            if (this.verifOperator(this.returnLast())) {
                this._listExp[this._listExp.length - 1] = val;
            } else {
                this._listExp.push(val);
            }
        } else {
            //se for um número
            //adicionar o número dentro do ultimo index da lista
            if (this.verifOperator(this.returnLast())) {
                this._listExp.push(val);
            } else {
                if (this.returnLast() == '0' && val.toString() != '.') {
                    this._listExp[this._listExp.length - 1] = '';
                }
                if (this.returnLast().indexOf('.') > -1 && val.toString() == '.') {
                    return
                }
                this._listExp[this._listExp.length - 1] += val.toString();
            }

        }
        this.attDisplay();

    }

    multiIndexOf(arrPrincipal, arr) {
        for (let i = 0; i < arrPrincipal.length; i++) {
            let v = arrPrincipal[i];
            for (let i2 = 0; i2 < arr.length; i2++) {
                let v2 = arr[i2];
                if (v == v2) {
                    return [i, v2];
                }
            }
        }
        return [-1, '']
    }

    calculate(arr) {
        for (let i = 0; i < arr.length; i += 2) {
            arr[i] = parseFloat(arr[i])
        }

        while (this.multiIndexOf(arr, ['÷', '×'])[0] > -1) {

            let operation = this.multiIndexOf(arr, ['÷', '×']); //[index,'el']
            let result;
            switch (operation[1]) {
                case '÷':
                    result = arr[operation[0] - 1] / arr[operation[0] + 1];
                    break;
                case '×':
                    result = arr[operation[0] - 1] * arr[operation[0] + 1];
                    break;
            }
            arr.splice(operation[0] - 1, 3, result);
        }
        while (this.multiIndexOf(arr, ['+', '-'])[0] > -1) {
            let operation = this.multiIndexOf(arr, ['+', '-']); //[index,'el']
            let result;
            switch (operation[1]) {
                case '+':
                    result = arr[operation[0] - 1] + arr[operation[0] + 1];
                    break;
                case '-':
                    result = arr[operation[0] - 1] - arr[operation[0] + 1];
                    break;
            }
            arr.splice(operation[0] - 1, 3, result);

        }
        this._ifResult = true;
        arr[0] = arr[0].toString();
        this.attDisplay();
    }

    calcPrev() {
        let listPrev = [];
        this._listExp.forEach((v) => {
            listPrev.push(v);
        })
        this.calculate(listPrev);
        this._ifResult = false;
        if (isNaN(listPrev[0])) {
            return;
        }
        this._prev = listPrev.join('');
        this.attDisplay();

    }

    initAddEventsKeyboard() {
        document.addEventListener('keyup', (e) => {
            switch (e.key) {
                case 'c':
                    this.clear();
                    //limpar tudo
                    break;
                case 'Backspace':
                    if (this._ifResult == true) {
                        this.clear();
                    }
                    this.erase();
                    this.calcPrev();
                    //apagar ultimo caractere
                    break;
                case 'Enter':
                    //calcular valor final
                    if (this._ifResult == true) {
                        return;
                    }
                    this._prev = '';
                    this.calculate(this._listExp)
                    break;
                case '+':
                case '-':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                case '0':
                case '.':
                    if (this._ifResult == true) {
                        this.clear();
                        this._ifResult = false;
                    }
                    this.addValExp(e.key);
                    this.calcPrev();
                    break;
                case '/':
                    if (this._ifResult == true) {
                        this.clear();
                        this._ifResult = false;
                    }
                    this.addValExp('÷');
                    this.calcPrev();
                    break;
                case '*':
                    if (this._ifResult == true) {
                        this.clear();
                        this._ifResult = false;
                    }
                    this.addValExp('×');
                    this.calcPrev();
                    break;
            }
        })
    }

    initAddEventsBtns() {
        let buttons = document.querySelectorAll('table.buttons td');

        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                let val = btn.innerHTML;

                switch (val) {
                    case 'AC':
                        this.clear();
                        //limpar tudo
                        break;
                    case 'backspace':
                        if (this._ifResult == true) {
                            this.clear();
                        }
                        this.erase();
                        this.calcPrev();
                        //apagar ultimo caractere
                        break;
                    case '=':
                        //calcular valor final
                        if (this._ifResult == true) {
                            return;
                        }
                        this._prev = '';
                        this.calculate(this._listExp)
                        break;
                    case '1/x':
                        //inverter ultimo valor digitado
                        this.inverse()
                        this.calcPrev();
                        break;
                    case '+':
                    case '-':
                    case '÷':
                    case '×':
                    case '1':
                    case '2':
                    case '3':
                    case '4':
                    case '5':
                    case '6':
                    case '7':
                    case '8':
                    case '9':
                    case '0':
                    case '.':
                        if (this._ifResult == true) {
                            this.clear();
                            this._ifResult = false;
                        }
                        this.addValExp(val);
                        this.calcPrev();
                        //adicionar lista de expressão
                        break;
                }
                if (isNaN(this._listExp[0])) {
                    this.error();
                }
            })
        });

    }

}