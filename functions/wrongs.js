function wrongUser() {
    console.clear();
    console.log('Uzytkownik nie istnieje.');
    process.exit();
}

function wrongPassword() {
    console.clear();
    console.log('Bledne haslo.');
    process.exit();
}

module.exports = { wrongUser , wrongPassword };