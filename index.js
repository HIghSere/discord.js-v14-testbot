const { Client, Events, WebhookClient, GatewayIntentBits, PermissionsBitField, EmbedBuilder } = require('discord.js');
const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages]
});
const readline = require('readline-sync');

console.log(`
████████╗███████╗███████╗████████╗██████╗  ██████╗ ████████╗        ██╗███████╗
╚══██╔══╝██╔════╝██╔════╝╚══██╔══╝██╔══██╗██╔═══██╗╚══██╔══╝        ██║██╔════╝
   ██║   █████╗  ███████╗   ██║   ██████╔╝██║   ██║   ██║█████╗     ██║███████╗
   ██║   ██╔══╝  ╚════██║   ██║   ██╔══██╗██║   ██║   ██║╚════╝██   ██║╚════██║
   ██║   ███████╗███████║   ██║   ██████╔╝╚██████╔╝   ██║      ╚█████╔╝███████║
   ╚═╝   ╚══════╝╚══════╝   ╚═╝   ╚═════╝  ╚═════╝    ╚═╝       ╚════╝ ╚══════╝
`);

client.on('ready', () => {
    console.log(`login: ${client.user.tag}`);
    setInterval(() => {
        client.user.setActivity({
            name: `c<help | ${client.ws.ping}ms`
        });
    }, 1000);
});

setInterval(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    console.log(`[TIME] ${year}/${month}/${day} ${hours}:${minutes}:${seconds} [PING] ${client.ws.ping}ms`);
}, 10000);

//スラッシュコマンド登録
client.once("ready", async () => {
    const data = [{
        name: "ping",
        description: "pingggggggggggggggggggggggggggg",
    }];
    await client.application.commands.set(data);
    console.log('slash commands ready!')
});

//スラッシュコマンドinteraction
client.on('interaction', interaction => {
    const embed = new MessageEmbed()
        .addField('pong!',`${client.ws.ping}ms`)
        .setTimestamp()
        interaction.reply({ embeds: [embed] });
});

//prefix
const prefix = 'c<'

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    switch (command) {
//help
        case 'help':
            message.reply({
                embeds: [
                    {
                        title: 'help',
                        description: 'このbotはHighSereによって作成されたゴミbotです。',
                        Fields: [
                            {
                                name: 'ping',
                                value: 'botの応答速度を返信します。',
                            },
                            {
                                name: 'nuke',
                                value: 'チャンネルの再作成を行います。',
                            },
                            {
                                name: 'ban <mention> <reason(任意)>',
                                value: '指定したユーザーをBANします。',
                            },
                            {
                                name: 'kick <mention> <reason(任意)>',
                                value: '指定したユーザーをKICKします。',
                            },
                            {
                                name: 'clear <amount>',
                                value: '指定した数のメッセージを削除します。',
                            },
                            {
                                name: 'exit',
                                value: 'botを強制ログアウトさせます。',
                            },
                            {
                                name: 'cch <name>',
                                value: '指定した名前のチャンネルをカテゴリ内に作成します。',
                            },
                            {
                                name: 'dch',
                                value: 'コマンドを使用したチャンネルが削除されます。',
                            },
                            {
                                name: 'google <world>',
                                value: '指定したワードのリンクを返信します。',
                            },
                            {
                                name: 'dice <amount> <num>',
                                value: '<amount>回1~<num>指定した数の中からランダムな数字を返信します。',
                            },
                            {
                                name: 'omikuji',
                                value: 'あなたの運勢を返信します。'
                            },
                            {
                                name: 'kakuni(日独伊なんとか提案)',
                                value: '角煮美味しい！と返信します。',
                            },
                        ]
                    }
                ]
            })
        break;
//ping
        case 'ping':
            const embed = new EmbedBuilder()
            .setTitle('pong!')
            .setDescription(`現在**${client.ws.ping}**msやで`)
            .setTimestamp();
            message.reply({ embeds: [embed] });
        break;
//nuke
        case 'nuke':
            if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                return message.reply('このコマンドを使用するには管理権限が必要です。');
            } else {
                message.channel.clone()
                .then(clonedChannel => {
                    clonedChannel.send({
                        embeds: [
                            {
                                title: 'nuke',
                                description: 'チャンネルの再作成が正常に行われました！',
                            },
                        ],
                    });
                    message.channel.delete();
                })
            }
        break;
//ban
        case 'ban':
            if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                return message.reply('このコマンドを使用するには管理権限が必要です。');
            } else {
                const user = message.mentions.users.first();
                if (!user) {
                    return message.reply('BANするユーザーをメンションしてください。');
                }
                const member = message.guild.members.cache.get(user.id);
                if (!member.bannable) {
                    return message.reply('このユーザーをBANすることはできません。');
                } else {
                    const reason = args.slice(1).join(' ');
                    member.ban({ reason: reason });
                    message.reply(`${user.tag}をBANしました。`);
                }       
            };
        break;
//kick
        case 'kick':
            if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                return message.reply('このコマンドを使用するには管理権限が必要です。');
            } else {
                const user = message.mentions.users.first();
                if (!user) {
                    return message.reply('KICKするユーザーをメンションしてください。');
                }
                const member = message.guild.members.cache.get(user.id);
                if (!member.kickable) {
                    return message.reply('このユーザーをKICKすることはできません。');
                } else {
                    const reason = args.slice(1).join(' ');
                    member.kick({ reason: reason });
                    message.reply(`${user.tag}をKICKしました。`);
                }
            };
        break;
//clear
        case 'clear':
            if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                return message.reply('このコマンドを使用するには管理権限が必要です。');
            } else {
                const amount = parseInt(args[0]);
                if (isNaN(amount)) {
                    return message.reply('削除するメッセージ数を指定してください。');
                }
                if (amount < 1 || amount > 100) {
                    return message.reply('1から100までの数値を指定してください。');
                }
                await message.channel.bulkDelete(amount, true);
                message.channel.send(`<@${message.author.id}>\n${amount}件のメッセージを削除しました。`);
            }
        break; 
//exit
        case 'exit':
            const specificUserIds = ['user1', 'user2', 'user3'];
            if (!specificUserIds.includes(message.author.id)) {
                return message.reply('このコマンドはBOTを強制終了させるコマンドです、あなたは何故これを使おうとしたのですか？');
            } else {
                await message.reply('BOTをログアウトさせます。')
                .then(() => {
                    process.exit();
                });
            };
        break;
//channel create
        case 'cch':
            if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                return message.reply('このコマンドを使用するには管理権限が必要です。');
            } else {
                const name = args[0];
                if (!name) {
                    return message.reply('作成するチャンネルの名前を指定してください。');
                };
                await message.guild.channels.create({
                    name: name,
                    parent: message.channel.parent,
                })
                .then((createdChannel) => {
                    message.reply(`チャンネルの作成が完了しました。\ncreated: <#${createdChannel.id}>`);
                })
            }
        break;
//delete channel
        case 'dch':
            if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                return message.reply('このコマンドを使用するには管理権限が必要です。');
            };
            message.channel.delete();
        break;
//google
        case 'google':
            const world = args[0];
            if (!world) {
                return message.reply('検索するワードを入力してください。');
            } else {
                message.reply(`link: [${world}](https://www.google.com/search?q=${world})`);
            }
        break;
//dice
        case 'dice':
            const amount =args[0];
            if (isNaN(amount) || amount > 10) {
                return message.reply('サイコロを振る回数を指定してください。または、サイコロを一度に触れる上限回数は10回です。')
            } 
            const num = args[1];
            if (isNaN(num)) {
                return message.reply('目の上限を指定してください。');
            }
            const dice = [];
            for (let i = 0; i < amount; i++) {
                dice.push(Math.floor(Math.random() * num) + 1);
            }
            message.reply({
                embeds: [
                    {
                        title: '🎲サイコロ',
                        description: `${dice.join(',')}が出ました!`,
                    }
                ]
            });
        break;
//omikuji
        case 'omikuji':
            const omikuji = [ '大吉', '吉', '中吉', '小吉', '末吉', '凶', '大凶' ];
            const result = omikuji[Math.floor(Math.random() * omikuji.length)];
            message.reply({
                embeds: [
                    {
                        title: 'おみくじ',
                        description: `あなたの運勢は${result}です！`,
                    }
                ]
            });
        break;
        }
});


// ボットをログイン
client.login(YOUR_TOKEN);
