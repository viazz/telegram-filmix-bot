const {google} = require('googleapis'),
    wsId = '1CoQvwf3mRX0pAIG5NG_B4htqpZx3SX0nC-9T30ctUnw',//"search" ws
    client_email = "edit-google-spreadsheeds@telegram-bot-1561813072634.iam.gserviceaccount.com",
    private_key = "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCo7uIngn4OZTun\ndxP0pSZbhWXjcfjn0+cdv1T3SRCBaPc4tgHPW5K6eJjyOIPvc3c5vs5Bp/EoBHpd\nth3xSs/Av39E63rCyRlnpNJN0izyKRG16YHY6caj+gP0Z3mo0uHU1uHDeMhFp9z+\nVvluHnGTReAIFSJ1rArtG5NoJBFKOeq1PLrh7Nh/lvus0r8hyb6zcpgtMvKDzEMo\n9JPkgHMpomzNXGNJQQNc3VjnE3qM+18mGKUPrMasNsrJyqRjmBsi3zbcSlUUZerE\n63s9E0pXqE7T7YJovznMCSiYh6KKEaBN31cx0TDOKphUqm4asHIYVJMSTSbHfB6c\nM/aJ4uKLAgMBAAECggEAQz5riTyZPtOvDjcJG33NqeqMpx+L64Pe4Glzwcc0qb6F\nge55A/g4jL9KakhyxBLbJ4I7Ccl25e36Y2kFvDGCRwAzAdUWFYkE8suZ5t49g9sz\nMI0VYamUp1ryzguOUtQ2jolGbo+acJekER2/xcSagvvydGUtRVfJNZ6fa3nH5BpI\n4wwjdmnLnBalzbDs5tXgIOTLAZVHSYj5W3PCV2HtlSftAJ06IuBUddLILq5DJLY+\nid+42hY95G7l6rcE6fxEMdyWo5hsqFDyQLlRFdjvztow3qZ+ga/LsBVLOeLYIjMn\nEJaR9LgijY3Uyw+bixCkBdMQQH+USqBxUmymFoZtIQKBgQDr2Aa/FxtuYtYyj77o\nz5RA93+eLpx9X613EIed27cEAslm8VtME63Gh56Fl4EYcyGf6Tr6xVJjpTZ5GgUU\nCY17lb4uXf0h6QFsjrO3wZcrClN5orDkBgTyZUsURn8vQOIqnT6tE5A80MQGIsa9\njoMdTS7IFI0rVByUPD2a+mE6+wKBgQC3Xu7P+GsAo9IviCc7eCZAXSxCAr7rThlf\nHUWzNElhbA5bUXoreQb+AbKGPgfyzvOXxHa3ZKHY/JJeBBQdAYYLJy48q0F4cbp9\nyIJYwEkqQ/+5gC5tVkCAdQfm5JCUmgZR2C3I1L3EGBbQmUxXvYG+mJ42HiAvKjKq\nK9qZvvBhsQKBgAvV/piudzD2AtvsvN8AM+eCxEPTAQWFvLXh/Xxdn3SzExp4eGV8\nA1eYTMtVjCQG+yQEV3JoXrcjfnVbae/UfuY54J6BFwgRooGpM7nAHG8LiJ7tHEWF\nS9BCZx8wXoenkPIkjBWxiqaSr5PDQQgYU9ovmm5uIZuQEBMcZtcVQ7XrAoGAIfyr\ngMqHcqfqhjrTIrejR1y9nkKKBm0EUNfJGmz/iNoRUyWn4jTdcej4oN8QdBWdmqyk\nYFt7kA9IRbq1y6aDpL+PV1lamitiKHwohLCnHvlZhZVXhZZuACEw5L/KeHCP6U2L\nNuUPgy//0owHVV/fk2cQM/Gjf3pvx5C3RLXaMhECgYB7tOZc0IaU2PjBknK9nzAJ\nNLDceotcei0G68rgkGKMwfOm8WRC8gQGRUryZM8bmHPcSDOch9Spf02HA8v6uo/p\nPgy6uvewLHfOacZCHU5sFf/JDchCtGJUlISrYRalGdGE5q6Xa6gAh+aMhtdcmGxb\nWUdA6NK9krsB1WYi7jR1lw==\n-----END PRIVATE KEY-----\n",
    scopes = ['https://www.googleapis.com/auth/spreadsheets'];
const xpath = require('xpath'),
    dom = require('xmldom').DOMParser,
    iconv = require('iconv-lite'),
    request = require('request'),
    express = require('express'),
    expressApp = express();
const TelegramBot = require('node-telegram-bot-api'),
    token = "617476169:AAGvOg3PTjtP2-OqyHS78rGZKCzXOalNl5c";//test-bot

const port = process.env.PORT || 3000
expressApp.get('/', (req, res) => {
    res.send('Working!!!')
})
expressApp.listen(port, () => {
    console.log(`Listening on port ${port}`)
})

const bot = new TelegramBot(token,{polling: true});
const id = 582743262;

const client = new google.auth.JWT(
    client_email,
    null,
    private_key,
    scopes,
);

client.authorize(function (err, token) {

    if (err){
        console.log(err);
        return;
    } else {
        console.log('conected');
    }

});

bot.on('message', msg => {
    var text = msg.text,
        mid = msg.message_id;
    if (text !== "/delete") {
        console.log("new message - " + text);
        addNew(client, text, mid)
    }
});//add to list

bot.onText(/\/delete/, (msg) => {
    showDeleteList(client);
    async function showDeleteList(cl) {
        var list = [];
        const gsapi = google.sheets({version: 'v4', auth: cl});
        var lastrow = 1;

        for (var i = 1; i<30; i++){
            var readCell = await gsapi.spreadsheets.values.get({
                spreadsheetId: wsId,
                range: `list!A${i}`,//Ai
            });
            var valueCell = readCell.data.values;
            if (typeof valueCell === 'undefined'){
                lastrow = i;
                break
            };//find last row
            list.push([{ text: `${valueCell}`, callback_data: `${i}` }]);
        };
        list.push([{ text: `Отмена`, callback_data: `cancel` }]);
        var options = {
            reply_markup: JSON.stringify({
                inline_keyboard: list
            })
        };
        bot.sendMessage(id, 'Что удалить:', options);
    }
});//press '/delete' to show list

bot.on("callback_query", function(data){
    var msId = data.message.message_id;
    console.log(msId);
    var i = data.data;
    bot.deleteMessage(id,msId);
    if (i !== 'cancel') {
        console.log(i + ' - position to delete');
        del(client, i);

        async function del(cl, i) {
            const gsapi = google.sheets({version: 'v4', auth: cl});
            var readCellA = await gsapi.spreadsheets.values.get({
                spreadsheetId: wsId,
                range: `list!A${i}`,//
            });
            var valueA = readCellA.data.values;
            await gsapi.spreadsheets.values.update({
                spreadsheetId: wsId,
                range: `list!A${i}`,
                valueInputOption: 'RAW',
                resource: {
                    values: [[""]]
                }
            });
            console.log(valueA + ' - delete');
            bot.sendMessage(id, valueA + ' удалено');

            for (i; i < 30; i++) {
                console.log('for');
                var nextCell = await gsapi.spreadsheets.values.get({
                    spreadsheetId: wsId,
                    range: `list!A${+i + 1}`,
                });
                var nextCellValue = nextCell.data.values;
                console.log(+i + 1);
                if (nextCellValue !== undefined) {
                    await gsapi.spreadsheets.values.update({
                        spreadsheetId: wsId,
                        range: `list!A${i}`,
                        valueInputOption: 'RAW',
                        resource: {values: [[nextCellValue.toString()]]}
                    });
                } else {console.log(i)
                    await gsapi.spreadsheets.values.update({
                        spreadsheetId: wsId,
                        range: `list!A${i}`,
                        valueInputOption: 'RAW',
                        resource: {values: [['']]}
                    })
                    break
                }
            }
        }
    } else {
        bot.sendMessage(id, 'Ок!')
    }
    setTimeout(
        () => bot.deleteMessage(id,msId + 1) & bot.deleteMessage(id,msId - 1),
        2 * 1000,
    )
});//del item

setInterval(() => list(client), 20 * 60 * 1000);//update for new item

async function list(cl) {
    var list = [];
    const gsapi = google.sheets({version: 'v4', auth: cl});
    for (var i = 1; i<40; i++){
        var readCell = await gsapi.spreadsheets.values.get({
            spreadsheetId: wsId,
            range: `list!A${i}`,//Ai
        });
        var valueCell = readCell.data.values;
        if (typeof valueCell === 'undefined'){
            var last_row = i;
            break
        };//find last row
        list.push(valueCell);
    };
    console.log(list);
    console.log(last_row);

    compare_list (client);
    async function compare_list (cl){
        var compare_list = [];
        const gsapi = google.sheets({version: 'v4', auth: cl});
        for (var i = 1; i<last_row; i++){
            var readCell = await gsapi.spreadsheets.values.get({
                spreadsheetId: wsId,
                range: `list!B${i}`,//Bi
            });
            var valueCell = readCell.data.values;
            compare_list.push(valueCell);
        };
        console.log("compare list: " + compare_list);
        console.log("first item compare list: " + compare_list[1])

        serials()
        function serials() {
        var url = {
                url: 'http://filmix.cc/serialy',
                encoding: null
            };
        request(url, function (error, response, body) {
            body = iconv.decode(Buffer.from(body), 'win1251');
            var doc = new dom().parseFromString(body);
            for (i=1; i<15; i++){
                var title = xpath.select(`string(//*[@id="dle-content"]/article[${i}]/div[2]/div[2]/h2/a)`, doc);
                for (n=0; n<list.length; n++){
                    var title = title.toLowerCase();
                    var list_item = list[n].toString();
                    list_item = list_item.toLowerCase();
                    if (title.match(list_item) != null){
                        var text = xpath.select(`string(//*[@id="dle-content"]/article[${i}]/div[2]/div[3]/span[2])`, doc),
                            link = xpath.select(`string(//*[@id="dle-content"]/article[${i}]/div[1]/span/a/@href)`, doc),
                            name = xpath.select(`string(//*[@id="dle-content"]/article[${i}]/div[2]/div[2]/h2/a)`, doc),
                            compare_item = compare_list[n];
                        (compare_item === undefined) ? compare_item = "1" : compare_item;
                        if (compare_item.toString() !== text.toString()){
                            bot.sendPhoto(id, link, { caption: name + "\n" + text } );
                            add(client, n+1, text);
                        }
                    }
                }
            }
        })
        }

        films()
        function films() {
            var url = {
                url: 'http://filmix.cc/ukrainskij',
                encoding: null
            };
            request(url, function (error, response, body) {
                body = iconv.decode(Buffer.from(body), 'win1251');
                var doc = new dom().parseFromString(body);
                for (i=1; i<15; i++){
                    var title = xpath.select(`string(//*[@id="dle-content"]/article[${i}]/div[2]/div[2]/h2/a)`, doc);
                    for (n=0; n<list.length; n++){
                        var title = title.toLowerCase();
                        var list_item = list[n].toString();
                        list_item = list_item.toLowerCase();
                        if (title.match(list_item) != null){
                            var text = xpath.select(`string(//*[@id="dle-content"]/article[${i}]/div[2]/div[1]/div[1])`, doc),
                                link = xpath.select(`string(//*[@id="dle-content"]/article[${i}]/div[1]/span/a/@href)`, doc),
                                name = xpath.select(`string(//*[@id="dle-content"]/article[${i}]/div[2]/div[2]/h2/a)`, doc),
                                compare_item = compare_list[n];
                            (compare_item === undefined) ? compare_item = "1" : compare_item;
                            if (compare_item.toString() !== text.toString()){
                                bot.sendPhoto(id, link, { caption: name + "\n" + text } );
                                add(client, n+1, text);
                            }
                        }
                    }
                }
            })
        }

        mult()
        function mult() {
            var url = {
                url: 'http://filmix.cc/ukrainskij/s14',
                encoding: null
            };
            request(url, function (error, response, body) {
                body = iconv.decode(Buffer.from(body), 'win1251');
                var doc = new dom().parseFromString(body);
                for (i=1; i<15; i++){
                    var title = xpath.select(`string(//*[@id="dle-content"]/article[${i}]/div[2]/div[2]/h2/a)`, doc);
                    for (n=0; n<list.length; n++){
                        var title = title.toLowerCase();
                        var list_item = list[n].toString();
                        list_item = list_item.toLowerCase();
                        if (title.match(list_item) != null){
                            var text = xpath.select(`string(//*[@id="dle-content"]/article[${i}]/div[2]/div[1]/div[1])`, doc),
                                link = xpath.select(`string(//*[@id="dle-content"]/article[${i}]/div[1]/span/a/@href)`, doc),
                                name = xpath.select(`string(//*[@id="dle-content"]/article[${i}]/div[2]/div[2]/h2/a)`, doc),
                                compare_item = compare_list[n];
                            (compare_item === undefined) ? compare_item = "1" : compare_item;
                            if (compare_item.toString() !== text.toString()){
                                bot.sendPhoto(id, link, { caption: name + "\n" + text } );
                                add(client, n+1, text);
                            }
                        }
                    }
                }
            })
        }
    }
}

async function add(cl, n, text) {
    const gsapi = google.sheets({version: 'v4', auth: cl});
    await gsapi.spreadsheets.values.update({
        spreadsheetId: wsId,
        range: `list!B${n}`,
        valueInputOption: 'RAW',
        resource: {
            values: [[text]] }
    })
}

async function addNew(cl, message, mid) {
    const gsapi = google.sheets({version: 'v4', auth: cl});
    var lastrow = 1;

    for (var i = 1; i<40; i++){
        var readCellA = await gsapi.spreadsheets.values.get({
            spreadsheetId: wsId,
            range: `list!A${i}`,//Ai
        });
        var valueA = readCellA.data.values;
        if (typeof valueA === 'undefined'){
            lastrow = i;
            break
        };
    };

    await gsapi.spreadsheets.values.update({
        spreadsheetId: wsId,
        range: `list!A${lastrow}`,//A lastrow
        valueInputOption: 'RAW',
        resource: {
            values: [[message]] }
    });
    bot.sendMessage(id, message + " - добавлено")
    setTimeout(
        () => bot.deleteMessage(id,mid + 1) & bot.deleteMessage(id,mid),
        2 * 1000,
    )
}
