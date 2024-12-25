const express = require('express');
const { Client: LineClient } = require('@line/bot-sdk');
const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config(); // dotenvを読み込む

const app = express();
const PORT = process.env.PORT || 3000;

// LINEの設定
const lineConfig = {
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.LINE_CHANNEL_SECRET,
};
const lineClient = new LineClient(lineConfig);

// Discordの設定
const discordClient = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

discordClient.login(process.env.DISCORD_BOT_TOKEN);

discordClient.on('messageCreate', async (message) => {
    if (message.channel.id === process.env.DISCORD_CHANNEL_ID) {
        let textToSend = '';

        // 埋め込みメッセージがある場合、その内容を取得
        if (message.embeds.length > 0) {
            const embed = message.embeds[0]; // 最初の埋め込みを取得

            // タイトルを追加
            if (embed.title) {
                textToSend += `【${embed.title}】\n`;
            }

            // 説明を追加
            if (embed.description) {
                textToSend += `${embed.description}\n`;
            }

            // フィールドを追加
            if (embed.fields) {
                embed.fields.forEach(field => {
                    textToSend += `【${field.name}】\n${field.value}\n`;
                });
            }

            // サムネイルを追加（必要に応じて）
            if (embed.thumbnail && embed.thumbnail.url) {
                textToSend += `【サムネイル】 \n${embed.thumbnail.url}\n`;
            }

            // 画像を追加（必要に応じて）
            if (embed.image && embed.image.url) {
                textToSend += `【画像】 \n${embed.image.url}\n`;
            }
        } else {
            textToSend = message.content; // 埋め込みがない場合は通常のメッセージを使用
        }

        // LINEにメッセージを送信
        await lineClient.pushMessage(process.env.LINE_USER_ID, {
            type: 'text',
            text: textToSend,
        });
    }
});

// Webサーバーの起動
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


// Discordのステータスを設定

// Webサーバーの起動
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
