/** OFFICAL AND IMPORT COMMENT
 * This Plugin is self botting, this therfore means it is agains bot Discord and Dank Memer ToS
 * The concearn from the bankmemer staff is spam. I took this into consideration, so the script runs at a fair pace
 * I'd rather you use this as an education refrence of sendMessage, Timeouts, using Powercord enviroment and more
 * If you're a dankmemer mod, admin, or creator, take the methods used below as a way to improve your bot, I'll be glad to help show you more methods
 * Made by Crenshaw#1312, https://discord.gg/Qx2hyttRsU
 */


const { Plugin } = require('powercord/entities')
const { getModule, channels, FluxDispatcher } = require('powercord/webpack')
// modules
const { getCurrentUser } = getModule(['getCurrentUser'], false)
const { getMessages } = getModule([ 'getMessages' ], false)
const { sendMessage } = getModule(['sendMessage'], false)
const { ackMessageId } = getModule(['ackMessageId'], false)
//setup
const user = getCurrentUser()
//misc vars

module.exports = class AutoDank extends Plugin {
	constructor() {
		super()

        this.state = {
            messages: {
                all: [],
                last: {}
            },
            outOfTime: false,
            isOn: false,
            autodank: undefined,
            channel: channels.getChannelId()
        }
	}

    // fetching data
    // messages
    getMessages() {
        this.state.messages.all = getMessages(this.state.channel).toArray()
        this.state.messages.last = this.state.messages.all.pop()
    }
    // awaitMessage, thanks Ven!
    async awaitMessage(checkFn, timeout) {
        return new Promise((resolve, reject) => {
            const fn = (msg) => {
                if (checkFn(msg.message) && this.state.channel == msg.message.channel_id) {
                    FluxDispatcher.unsubscribe("MESSAGE_CREATE", fn)
                    resolve(msg.message)
                }
            }
            setTimeout(() => reject(FluxDispatcher.unsubscribe("MESSAGE_CREATE", fn)), timeout)
            FluxDispatcher.subscribe("MESSAGE_CREATE", fn)
        })
    }

    // background timing manager
    timingHandler() {
        console.log('timingHandler says hi bitch');
        this.state.outOfTime = false
        setTimeout(() => {this.state.outOfTime = true}, 40e3);
        this.fish()
    }
    // activities
    async actionHandler(actionRan) {
        console.log(actionRan + " " + this.state.outOfTime);
        if (!this.state.isOn || this.state.outOfTime) return
        setTimeout(async () => {
            switch (actionRan) {
                case 'fish': await this.hunt()
                    break
                case 'hunt': await this.dig()
                    break
                case 'dig': await this.search()
                    break
                case 'search': await this.postMeme()
                    break
                case 'postMeme': this.random()
                    break
                case 'random': this.beg()
                    break
                case 'beg': await this.fish()
                    break
            }
        }, (Math.random() * 2) * 1000 + 2000)
    }

    // find item and amount
    retrieveItem(message) {
        ackMessageId(message.id)
        let result = {text: false, amount: 1}
        // get the item
        result.text = message.content.match(/Ant|Shovel|Ladybug|Jelly Fish|Worm|Junk|Garbage|Seaweed|Horseshoe|Rabbit|Deer|Bear|Boar|Duck|Skunk|Fishing\sPole|sand|Padlock|(Common|Legendary|Epic|Rare|Exotic)\sFish/gmi)
        if (!result.text) return result
        if (Array.isArray(result.text)) result.text = result.text[0].toLowerCase().replace(" ", "")
        // amount
        if (message.content.match(/(\d|a)\s/i)) result.amount = message.content.match(/(\d|a)\s/gmi)
        if (Array.isArray(result.amount)) result.amount = result.amount[0].replace('a', '1')
        if (result.amount) result.amount = result.amount.trim()

        return result
    }

    async startPlugin() {
        powercord.api.commands.registerCommand({
            command: 'adhelp',
            description: 'help and info on AutoDank',
            executor: (() => {
                return { send: false, 
                    result: {
                        type: "rich",
                        title: "Help",
                        color: 0x4B0082,
                        description: '**Commands**\n'
                        + '`autodank` >> start/stop AutoDank\n'
                        + '`adHelp` >> shows this message\n\n'
                        + '**Terms of Service**\n'
                        + 'This is self botting and against DankMemer ToS, usage of it may get you memberBanned from DankMemer or account deletion from discord.\n'
                        + 'I do not take credit or responsibility for that, I don\'t support this script myself, this is just me being bored.\n'
                        + 'If you\'re a staff memeber of DankMemer, DM me, I want to talk about improving your bot\n\n'
                        + '**Misc**\n'
                        + 'Made by Crenshaw#1312\n'
                        + 'My server: https://discord.gg/Qx2hyttRsU\n'
                        + 'For more help, *no*'
                    }
                }
            })
        })
        // create the command
        powercord.api.commands.registerCommand({
            command: 'autodank',
            description: 'toggle autodank',
            executor: (() => {
                // Disable autodank
                if (this.state.isOn) {
                    this.state.isOn = false
                    clearInterval(this.timingHandler())
                    this.state.outOfTime = false
                    return {send: false, result: 'AutoDank is off!\nIt may take a moment to end...'}
                // trun autodank on
                } else {
                    this.state.channel = channels.getChannelId()
                    this.state.isOn = true
                    this.getMessages()
                    this.actionHandler()
                    setInterval(this.timingHandler(), 50e3)
                    return {send: false, result: 'AutoDank is on\nyou should have already purchased: `rifle`, `fishingpole`, `shovel`, and `laptop`\n\nPlease do not use this channel for commands'}
                }
            })
        })
    }

    // fish
    async fish() {
        sendMessage(this.state.channel, {content: 'pls fish'})
        await this.awaitMessage(msg => msg.author.id == '270904126974590976', 5000).then(() => this.getMessages())
        setTimeout(() => {
            let fishingResult = this.retrieveItem(this.state.messages.last)
            if (!fishingResult.text) return this.actionHandler('fish') 
            // make sending the message not sus
            setTimeout(() => {
                sendMessage(this.state.channel, {content: `pls sell ${fishingResult.text} ${fishingResult.amount}`})
                this.actionHandler('fish')
            }, ((Math.random() * 500) + 1000))
        }, ((Math.random() * 500) + 1000))
    }
    // hunt
    async hunt() {
        sendMessage(this.state.channel, {content: 'pls hunt'})
        await this.awaitMessage(msg => msg.author.id == '270904126974590976', 5000).then(() => this.getMessages())
        setTimeout(() => {
            let huntingResult = this.retrieveItem(this.state.messages.last)
            if (!huntingResult.text) return this.actionHandler('hunt') 
            // make sending the message not sus
            setTimeout(() => {
                sendMessage(this.state.channel, {content: `pls sell ${huntingResult.text} ${huntingResult.amount}`})
                this.actionHandler('hunt')
            }, ((Math.random() * 500) + 1000))
        }, ((Math.random() * 500) + 1000))
    }
    // dig
    async dig() {
        sendMessage(this.state.channel, {content: 'pls dig'})
        await this.awaitMessage(msg => msg.author.id == '270904126974590976', 5000).then(() => this.getMessages())
        setTimeout(() => {
            let diggingResult = this.retrieveItem(this.state.messages.last)
            if (!diggingResult.text) return this.actionHandler('dig') 
            // make sending the message not sus
            setTimeout(() => {
                sendMessage(this.state.channel, {content: `pls sell ${diggingResult.text} ${diggingResult.amount}`})
                this.actionHandler('dig')
            }, ((Math.random() * 500) + 1000))
        }, ((Math.random() * 500) + 1000))
    }
    // search for dem coins bitch
    async search() {
        sendMessage(this.state.channel, {content: 'pls search'})
        await this.awaitMessage(msg => msg.author.id == '270904126974590976'&& msg.content.includes('from the list'), 5000).then(async (msg) => {
            ackMessageId(msg.id)
            // get options and parse
            let options = msg.content.match(/`[^`]+`/img).filter(opt => opt !== '`purse`')
            console.log(options);
            setTimeout(() => {
                sendMessage(this.state.channel, {content: options[Math.floor(Math.random() * options.length)].replace(/`/g, "")})
                this.actionHandler('search')
            }, (Math.random() * 500) + 500)
        })
    }
    // post a juicy meme
    async postMeme() {
        let choice = ['f', 'r', 'i', 'c', 'k']
        choice = choice[Math.floor(Math.random() * choice.length)];
        sendMessage(this.state.channel, {content: 'pls pm'})
        await this.awaitMessage(msg => msg.author.id == '270904126974590976' && !msg.embeds.length, 5000).then(async (msg) => {
            ackMessageId(msg.id)
            // you need a laptop
            if (msg.content.includes('buy a laptop')) {
                setTimeout(() => {sendMessage(this.state.channel, {content: 'pls with 3500'})}, (Math.random() * 5) + 1000)
                setTimeout(() => {
                    sendMessage(this.state.channel, {content: 'pls buy laptop'})
                    this.actionHandler('postMeme')
                }, (Math.random() * 5) + 2000)
            }
            // choose a place to search
            else setTimeout(() => {
                sendMessage(this.state.channel, {content: choice})
                this.actionHandler('postMeme')
            }, Math.floor((Math.random() * 2)) * 1000)
        })
    }
    // throw off the bot ree, and dep all
    random() {
        // random commands woosh
        let command
        let number = Math.floor((Math.random() * 15))
        switch (number) {
            case 1:
                command = 'profile'
                break
            case 2:
                command = 'multi'
                break
            case 3:
                command = 'profile'
                break
            case 4:
            case 5:
                command = 'bal'
                break
            case 6:
            case 7:
            case 8:
            case 9:
            case 10:
                command = 'dep all'
                break
        }
        if (!command) return
        sendMessage(this.state.channel, {content: `pls ${command}`})
        this.actionHandler('random')
    }
    // beg
    beg() {
        sendMessage(this.state.channel, {content: 'pls beg'})
        this.actionHandler('beg')
    }


    // useBanknote
    async useBanknote(amount) {
        sendMessage(this.state.channel, {content: 'pls use banknote'})
        await this.awaitMessage(msg => msg.author.id == '270904126974590976', 5000)
        .then(() => {setTimeout(() => {sendMessage(this.state.channel, {content: amount})}, 1000)})
    }

    pluginWillUnload() {
        this.state.isOn = false
        clearInterval(this.timingHandler())
        this.state.outOfTime = false
        powercord.api.commands.unregisterCommand('adhelp')
        powercord.api.commands.unregisterCommand('autodank')
    }
}