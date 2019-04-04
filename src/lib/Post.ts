import djs from 'discord.js';
import { Form } from './Form';
export type ReactsHandler = (react: djs.MessageReaction, state: State) => void;
export type ReactsBuilder = (ops: any) => any[] | Promise<any[]>;
export type PostBuilder = (ops: any) => MessageOptions | Promise<MessageOptions>;
export type GlobalBuilder = (ops: any) => GlobalData | Promise<GlobalData>;


let k = new djs.Client()
export interface PostCreatorOptions {
    postBuilder?: PostBuilder,
    globalBuilder?: GlobalBuilder,
    reactsBuilder?: ReactsBuilder,
    reactsHandler?: ReactsHandler,
    post?: MessageOptions,
    reacts?: any[]
}

export interface MessageOptions {
    embed?: djs.RichEmbed,
    content?: string
}

export interface State {
    state: any,
    setState: (value) => void;
}

export interface GlobalData {
    reacts: any[],
    post: MessageOptions
}

export default class Post {
    private post: MessageOptions = {};
    private reacts: any[] = [];
    private collector: djs.ReactionCollector;

    /**
     * Create new Post.
     *
     * @param {PostCreatorOptions} rules
     * @param {string} clientid
     * @returns {Promise<void>}
     * @private
     */

    constructor(private rules: PostCreatorOptions, private clientid: string, public parentForm: Form) { }


    async build(ops: any = {}) {
        ops.state = this.parentForm.state;
        ops.setState = this.parentForm.setState.bind(this.parentForm);
        if (this.rules.globalBuilder) {
            if (this.rules.reactsHandler) {
                let global = await this.rules.globalBuilder(ops);
                this.post = global.post;
                this.reacts = global.reacts;
            } else {
                throw new Error('No reactHandler() Method provided')
            }
        } else {

            if (this.rules.postBuilder) {
                this.post = await this.rules.postBuilder(ops)
            } else if (this.rules.post) {
                this.post = this.rules.post
            } else {
                throw new Error('No post Object or postBuilder() Method provided')
            }

            if (this.rules.reactsHandler) {
                if (this.rules.reactsBuilder) {
                    this.reacts = await this.rules.reactsBuilder(ops)
                } else if ((this.rules.reacts)) {
                    this.reacts = this.rules.reacts
                } else {
                    throw new Error('No react Array or reactBuilder() Method provided')
                }
            } else {
                if (this.rules.reactsBuilder || this.rules.reacts) {
                    throw new Error('No reactHandler() Method provided')
                }
            }
        }
        return;
    }

    /**
    * Display the Post new Post.
    * 
    * @param {djs.Message} msg
    * @param {any} ops
    * @returns {Promise<void>}
    * @private
    */


    async display(msg: djs.Message, ops: any = {}) {
        this.collector && this.collector.stop();
        await msg.clearReactions()
        await this.build(ops);
        if (this.reacts) {
            for (let react of this.reacts) {
                await msg.react(react);
            }
            this.collector = msg.createReactionCollector(
                (react: djs.MessageReaction, user: djs.GuildMember) => user.id !== this.clientid && this.reacts.includes(react.emoji.name));
            this.collector.on('collect', (r: djs.MessageReaction) => this.rules.reactsHandler && this.rules.reactsHandler(r, { state: this.parentForm.state, setState: this.parentForm.setState }));
        }
        await msg.edit(this.post.content, this.post.embed)
        return;
    }
}