const fs = require('fs');

function saveAmount(user , userID) {
    const user1Json  = JSON.stringify(user);
    fs.writeFileSync(`./accounts/${userID}.json` , user1Json);
}

module.exports = { saveAmount };