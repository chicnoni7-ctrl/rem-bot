/require("dotenv").config();

/ Import des modules
const fs = require("fs");
const path = require("path");

// Exemple avec Discord (optionnel)
const { Client, GatewayIntentBits } = require("discord.js");

// Création du client
const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

// Chargement des commandes (structure propre)
client.commands = new Map();

const commandsPath = path.join(__dirname, "commands");
if (fs.existsSync(commandsPath)) {
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        client.commands.set(command.name, command);
    }
}

// Quand le bot est prêt
client.once("ready", () => {
    console.log(`✅ Connecté en tant que ${client.user.tag}`);
});

// Exemple interaction
client.on("interactionCreate", async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply("Erreur lors de l'exécution.");
    }
});

// Connexion (token via variable d'environnement)
client.login(process.env.TOKEN);