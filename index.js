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
const snoowrap = require('snoowrap');
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
        
        multserialy()
        function multserialy() {
        var url = {
                url: 'http://filmix.cc/multserialy',
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
        5 * 1000,
    )
}








var token_m = "653858876:AAGRCJcIeBvMoP_Tc6pgT-AsVjbxxbIDOYQ",
    token_s = "Bearer BQDrzNw0wE-SiesdZOEzAWi29AM6tJHY0nzr6nYF0vLbE3c9D8H2FTL2NyTGuNfzL3d1BpdI4IopjPtzlpz5T_WwEp3siKetVhqKs_68L9avV_Pi0gAdGh9nqAm9VXGtE4iEh7QlBorYkTCHSbP7Ml1g8rFIwZc7abuK8KQU4xF-gReATt755bl1pSrxxxaw",
    chat_id = 582743262;

const bot_m = new TelegramBot(token_m,{polling: true});

var options = {
    url: 'https://accounts.spotify.com/api/token',
    method: 'POST',
    headers: {
        Authorization: 'Basic MGUyZTlkZTg3MDgzNGYzNWJmOWU5ZTk2Y2Y3Y2Y2Nzg6NjRkYzQ5NzYzMjMzNGRlMjg4MzExYzIwZmIxNGZjY2Q='
        },
    form: {
        grant_type: 'refresh_token',
        refresh_token: "AQA8AuuT0Ugr_mGZwTMso-EGOiTzHD5ceO8oWYjqhahqFT-fqyI3UXRl2cmfx4dUylG4z5Fmo3fxMpYPnUXBoKQ6ZywwZBSiAaIX3NTt2Oo11ePtGmDmmnC5ZOGVeddMWqLYAg"
    }
};

bot_m.on('message', msg =>{
    if (msg.audio !== undefined){
        var artist = msg.audio.performer.toString(),
            title = msg.audio.title.toString(),
            text = artist+" "+title
    } else {
        if (msg.text !== "/now" && msg.text !== "/list") {
            var text = msg.text
        }
    }
    if (text !== undefined) {
        text = text.split(" ");
        search_word = text.join("%20").toLowerCase()
        request(options, search_callback);
    }
})

bot_m.onText(/\/now/, msg => {
    request(options, now_callback);
})

bot_m.onText(/\/list/, msg => {
    var ms_id = msg.message_id;
    request(options, list_callback);
    setTimeout( () =>
        bot_m.deleteMessage(chat_id, ms_id) &
        bot_m.deleteMessage(chat_id, ms_id+1) &
        bot_m.deleteMessage(chat_id, ms_id+2) &
        bot_m.deleteMessage(chat_id, ms_id+3) &
        bot_m.deleteMessage(chat_id, ms_id+4) &
        bot_m.deleteMessage(chat_id, ms_id+5),
        10 * 1000,
    )
})

function now_callback(error, response, body) {
    token_s = "Bearer " + JSON.parse(body).access_token.toString()
    request({
        url: "https://api.spotify.com/v1/me/player/currently-playing",
        headers: {"Authorization": token_s}
        }, function (err, res) {
        if (res.body) {
            var playback = JSON.parse(res.body),
                artist = playback.item.artists[0].name,
                title = playback.item.name,
                art = playback.item.album.images[0].url;
            send_form(artist,title,art, "empty")
        }
    })
}

function search_callback(error, response, body) {
    token_s = "Bearer " + JSON.parse(body).access_token.toString()
    request({
        url: "https://api.spotify.com/v1/search?q="+search_word+"&type=artist,track",
        headers: {
            "Authorization": token_s
        }}, function (err, res) {
        if (res) {
            var body = JSON.parse(res.body);
            if (body.tracks.items[0] !== undefined) {
                var song_id = body.tracks.items[0].id,
                    artist = body.tracks.items[0].artists[0].name,
                    title = body.tracks.items[0].name,
                    art = body.tracks.items[0].album.images[0].url;
                send_form(artist,title,art,song_id)
            }
        }
    })
}

function list_callback(error, response, body) {
    token_s = "Bearer " + JSON.parse(body).access_token.toString();
    request({url:"https://api.spotify.com/v1/me/tracks", headers:{"Authorization":token_s}}, function (err, res) {
        if (res) {
            var body = JSON.parse(res.body);
            for (i = 0; i < 5; i++) {
                var artist = body.items[i].track.artists[0].name,
                    title = body.items[i].track.name;
                bot_m.sendMessage(chat_id, artist + " - " + title)
            }
        }
    })
}

bot_m.on("callback_query", function(data){
    var ms_id = data.message.message_id,
        i = data.data;
    if (i === "clear"){
        bot_m.deleteMessage(chat_id, ms_id);
        bot_m.deleteMessage(chat_id, ms_id-2);
        bot_m.deleteMessage(chat_id, ms_id-1);
        bot_m.deleteMessage(chat_id, ms_id+1);
    } else {
        var song_id = i;
        request(options, like_callback);
        function like_callback(error, response, body) {
            token_s = "Bearer " + JSON.parse(body).access_token.toString();
            request({
                url: "https://api.spotify.com/v1/me/tracks?ids="+song_id,
                method: 'PUT',
                headers: {
                    "Authorization": token_s,
                }
                }, function (err, res) {
                if (res) {
                    console.log("done")
                    bot_m.deleteMessage(chat_id, ms_id) & bot_m.deleteMessage(chat_id,ms_id-1)
                }
            })
        }
    }
})

function send_form(artist, title, art, song_id) {
    if (song_id === "empty") {
        var options = {
            reply_markup: JSON.stringify({
                inline_keyboard: [
                    [{text:"Ok", callback_data:"clear"}],
                ]
            })
        };
        bot_m.sendMessage(chat_id,artist+" - "+title)
        bot_m.sendPhoto(chat_id,art,options);

    } else {
        var options = {
            reply_markup: JSON.stringify({
                inline_keyboard: [
                    [{text:artist+" - "+title, callback_data: song_id}],
                    [{text:"Отмена", callback_data:"clear"}],
                ]
            })
        };
        bot_m.sendPhoto(chat_id,art,options)
    }
}



const r = new snoowrap({
    userAgent: 'reddit-bot-example-node',
    clientId: 'C15nUxzTc8pm1A',
    clientSecret: '-A8V9HwWVaHXTN9owxuEbQmAV3s',
    username: 'viazzz',
    password: 'cbvjytwm990'
});

const token_r = "720901180:AAHdPgHDWI74jyCIBzr3QJs5J8l7Ny4qpoc",
    bot_r = new TelegramBot(token_r,{polling: true});

bot_r.onText(/\/update/, msg => {
    f(client);
    setTimeout( () =>
        bot_r.deleteMessage(chat_id, msg.message_id),
        1 * 1000,
    )
});

setInterval( () =>
    f(client),
    20 * 1000,
)

async function f(cl) {
        const gsapi = google.sheets({version: 'v4', auth: cl});
        var cell = await gsapi.spreadsheets.values.get({
            spreadsheetId: wsId,
            range: `list!C1`,
        });
        var last_id = cell.data.values.toString();

        r.getMe().getUpvotedContent()
            .then(async post => {
                await gsapi.spreadsheets.values.update({
                    spreadsheetId: wsId,
                    range: `list!C1`,
                    valueInputOption: 'RAW',
                    resource: {values: [[post[0].id.toString()]]}
                });
                for (i=0;i<100;i++) {
                    var title = post[i].title,
                        link = post[i].url,
                        domain = post[i].domain,
                        post_id = post[i].id.toString();
                    if (post_id === last_id){console.log(post_id+" - "+last_id); break}
                    if (domain === "gfycat.com") {
                        if (post[i].preview !== undefined) {
                            var video_link = post[i].preview.reddit_video_preview.fallback_url
                        } else {
                            request(link, function (error, response, body) {
                                var doc = new dom().parseFromString(body);
                                video_link = xpath.select(`string(//*[@id="video-breakableacademicerin"]/source[3]/@src)`, doc);
                            })
                        }
                        bot_r.sendVideo(chat_id, video_link, {caption: title})
                    } else if (domain === "v.redd.it") {
                        bot_r.sendMessage(chat_id,link)
                    } else {
                        bot_r.sendPhoto(chat_id,link,{caption: title})
                    }
                }
            })
    }
