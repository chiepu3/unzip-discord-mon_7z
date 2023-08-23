import { REST, Routes, Client, GatewayIntentBits } from 'discord.js';
// const { REST, Routes, Client, GatewayIntentBits, message } = require('discord.js');
import sevenBin from '7zip-bin';
import Seven from 'node-7z';
import fixPath from 'fix-path';

const pathTo7zip = sevenBin.path7za;

// TOKENはconfig.jsonに記載
import config from './config.json' assert { type: "json" };
console.log(config)
const TOKEN = config.TOKEN
const commands = [
  {
    name: 'trypassword',
    description: 'Replies with Pong!',
    options: [
      {
        name: 'password',
        description: 'パスワードを入力してください',
        type: 3,
        required: true,

      }
    ]
  }
];

const rest = new REST({ version: '10' }).setToken(TOKEN);
const CLIENT_ID = "1143871641156325556"
try {
  console.log('Started refreshing application (/) commands.');

  rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });

  console.log('Successfully reloaded application (/) commands.');
} catch (error) {
  console.error(error);
}



const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'trypassword') {
    const archivePath = '_mon_.7z';
    console.log(interaction.options._hoistedOptions[0].value)
    const messageText = interaction.options._hoistedOptions[0].value;

    fixPath();
    try {
      let flag = false;
      const stream = Seven.extract(archivePath, 'export', {
        $progress: true,
        recursive: true,
        $bin: pathTo7zip,
        password: messageText,
        noArchiveOnFail: true,
        techInfo: true,
      })
      interaction.reply('wait a moment...');
      console.log(interaction)
      stream.on("error", (err) => {
        console.error(err)
        flag = true;
        //チャンネルに追加でメッセージを送信
        interaction.channel.send(`${messageText}は違うみたいです`);
      });
      //成功時
      stream.on("end", () => {
        console.log("end")
        //チャンネルに追加でメッセージを送信
        if (!flag) interaction.channel.send('できた できた 解凍ができた\nパスワードは' + messageText + 'だったよ');

      })

    } catch (error) {
      console.log(error);
    }

  }
});

client.login(TOKEN);
