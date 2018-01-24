'use strict';

const fs = require('fs');
const path = require('path');

const apifcraftpl = require('api-fcraft.pl');
const Discord = require('discord.js');
const moment = require('moment');

const config = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'config.json')));

const apiClient = new apifcraftpl(config.key);

module.exports = async (message) => {
    try {
        const args = message.content.split(/\s+/);

        if(!args[1]) {
            message.reply('prawidłowe użycie: `!gracz <gracz>`!');
        } else {
            apiClient.globalPlayer(args[1]).then(player => {
                const embed = new Discord.RichEmbed();
                embed.setAuthor('fEntertainment', 'https://cdn.fcraft.pl/logo/150px/v2.2.png');
                embed.setColor('FFF000');
                embed.setThumbnail(`https://api.fcraft.pl/player/${args[1]}/head?size=16`);
                embed.addField('Gracz', args[1]);
                embed.addField('Konto', (player.premium.last ? 'Oryginalne' : 'Pirackie'));
                embed.addField('Pierwsze wejście', moment(player.time.first * 1000).format('D.MM.YYYY H:mm'));
                embed.addField('Ostatnie wejście', moment(player.time.last * 1000).format('D.MM.YYYY H:mm'));

                message.channel.send(embed);
            }).catch(error => {
                message.reply('nie można było uzyskać informacji nt. podanego gracza!');
            });
        }
    } catch(error) {
        message.reply('wystąpił błąd!');
        console.error(error);
    } finally {
        message.channel.stopTyping();
    }
};
