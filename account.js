const fs = require('fs');
const readlineSync = require('readline-sync');
const libGenerateID = require('./functions/generateID.js')
const libWrong = require('./functions/wrongs.js');
const libAction = require('./functions/actions.js');

welcomeChoose();
        
function welcomeChoose() {
    const action = ['Zaloguj' , 'Utworz konto'];
    const index = readlineSync.keyInSelect(action, 'Co chcesz zrobic?');
    
    if (action[index] === 'Utworz konto') {
        
        const newUserName = readlineSync.question('Imie i nazwisko: ');
        const newUserPasswd = readlineSync.question('Podaj haslo: ');

        const userListRaw = fs.readFileSync('users.json');
        const userList = JSON.parse(userListRaw);

        const newUserID = libGenerateID.generateID(1 , 9999999);
        if (userList.id.includes(newUserID) === true) {
            generateID(1 , 9999999);
        }

        fs.writeFileSync('./accounts/' + newUserID + '.json' ,
        '{"id":"' + newUserID + '","passwd":"' + newUserPasswd + '","name":"' + newUserName + '","amount":[0]}');

        userList.id.push(newUserID.toString());
        const usersJson = JSON.stringify(userList);
        fs.writeFileSync('users.json' , usersJson);
        
        console.clear();
        console.log('Twoj numer uzytkownika to: ' + newUserID + '. Uzywaj go do logowania, zapisz i nie zapomnij.');
        
    }
    else if (action[index] === 'Zaloguj') { 
    }
    else {
        process.exit();
    }
}

const userID = readlineSync.question('Podaj numer klienta: ');

const userListRaw = fs.readFileSync('users.json');
const userList = JSON.parse(userListRaw);

if (userList.id.includes(userID) === false) {
    libWrong.wrongUser();
}

const userActiveRaw = fs.readFileSync('./accounts/' + userID + '.json');
const userActive = JSON.parse(userActiveRaw);

const userPasswd = readlineSync.question('Podaj haslo: ');

if (userPasswd !== userActive.passwd) {
    libWrong.wrongPassword();
}

console.log('Witaj ' + userActive.name);
choose();

function choose() {
    const action = ['Wplac' , 'Wyplac' , 'Saldo'];
    const index = readlineSync.keyInSelect(action, 'Co chcesz zrobic?');
    
    if (action[index] === 'Wplac') {
        const amountAdd = readlineSync.question('Ile wplacasz?: ');
        addToAccount(userActive , amountAdd);
        
        choose();
    }
    else if (action[index] === 'Wyplac') {
        const amountCharge = readlineSync.question('Ile wyplacasz?: ');
        chargeAccount(userActive , amountCharge);

        choose();
    }
    else if (action[index] === 'Saldo') {

        const userCurrentAmmount = userActive.amount.reduce(function (prev, curr) {
            return prev + curr;
        }, 0);
        console.log('Masz ' + userCurrentAmmount + ' cebulion??w. Co chcesz zrobi???');
        choose();
    }
}

function chargeAccount(user , amount) {
    const suma = user.amount.reduce(function (prev, curr) {
        return prev + curr;
    }, 0);

    if (amount > suma) {
        console.log(user.name + ': Chcesz wyp??aci?? ' + amount + '. Masz ' + suma + '. Zbyt ma??o cebulion??w!');
    }
    else {
        user.amount.push(-amount);
        const currentAmount = (suma - amount);
        libAction.saveAmount(userActive , userID);
        console.log('Wyp??acono ' + amount + '. Masz na koncie ' + currentAmount + ' cebulion??w');
    }
    return user;
}

function addToAccount(user , amount) {
    user.amount.push(+amount);
    
    libAction.saveAmount(userActive , userID);
    
    const suma = user.amount.reduce(function (prev, curr) {
        return prev + curr;
    }, 0);
    console.log(`Wp??acono ${amount}. Masz na koncie ${suma} cebulion??w`);
    return user;
}
