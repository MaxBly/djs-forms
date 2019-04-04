"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = __importDefault(require("discord.js"));
let k = new discord_js_1.default.Client();
class Post {
    /**
     * Create new Post.
     *
     * @param {PostCreatorOptions} rules
     * @param {string} clientid
     * @returns {Promise<void>}
     * @private
     */
    constructor(rules, clientid, parentForm) {
        this.rules = rules;
        this.clientid = clientid;
        this.parentForm = parentForm;
        this.post = {};
        this.reacts = [];
    }
    async build(ops = {}) {
        ops.state = this.parentForm.state;
        ops.setState = this.parentForm.setState.bind(this.parentForm);
        if (this.rules.globalBuilder) {
            if (this.rules.reactsHandler) {
                let global = await this.rules.globalBuilder(ops);
                this.post = global.post;
                this.reacts = global.reacts;
            }
            else {
                throw new Error('No reactHandler() Method provided');
            }
        }
        else {
            if (this.rules.postBuilder) {
                this.post = await this.rules.postBuilder(ops);
            }
            else if (this.rules.post) {
                this.post = this.rules.post;
            }
            else {
                throw new Error('No post Object or postBuilder() Method provided');
            }
            if (this.rules.reactsHandler) {
                if (this.rules.reactsBuilder) {
                    this.reacts = await this.rules.reactsBuilder(ops);
                }
                else if ((this.rules.reacts)) {
                    this.reacts = this.rules.reacts;
                }
                else {
                    throw new Error('No react Array or reactBuilder() Method provided');
                }
            }
            else {
                if (this.rules.reactsBuilder || this.rules.reacts) {
                    throw new Error('No reactHandler() Method provided');
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
    async display(msg, ops = {}) {
        this.collector && this.collector.stop();
        await msg.clearReactions();
        await this.build(ops);
        if (this.reacts) {
            for (let react of this.reacts) {
                await msg.react(react);
            }
            this.collector = msg.createReactionCollector((react, user) => user.id !== this.clientid && this.reacts.includes(react.emoji.name));
            this.collector.on('collect', (r) => this.rules.reactsHandler && this.rules.reactsHandler(r, { state: this.parentForm.state, setState: this.parentForm.setState }));
        }
        await msg.edit(this.post.content, this.post.embed);
        return;
    }
}
exports.default = Post;
