"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Post {
    /**
     * @private
     * @constructor
     * Create new Post.
     *
     * @param {PostCreatorOptions} rules
     * @param {string} clientid
     */
    constructor(rules = {}, parentForm) {
        this.rules = rules;
        this.parentForm = parentForm;
        this.post = {};
        this.reacts = [];
    }
    /**
     * @public
     * Set the post
     *
     * @param {PostData | PostBuilder} post
     * @returns Post
     */
    setPost(post) {
        if (typeof post === 'function') {
            this.rules.postBuilder = post;
        }
        else {
            this.rules.post = post;
        }
        return this;
    }
    /**
     * @public
     * Set the reacts and the reacts handler
     *
     * @param {ReactsData | ReactsBuilder} reacts
     * @param {ReactsHandler} handler
     * @returns Post
     */
    setReacts(reacts, handler) {
        if (typeof reacts === 'function') {
            this.rules.reactsBuilder = reacts;
        }
        else {
            this.rules.reacts = reacts;
        }
        this.rules.reactsHandler = handler;
        return this;
    }
    /**
     * @public
     * Set the builder of the post and the reacts handler
     *
     * @param {GlobalBuilder} builder
     * @param {ReactsHandler} handler
     * @returns Post
     */
    setBuilder(builder, handler) {
        if (typeof builder === 'function') {
            this.rules.globalBuilder = builder;
        }
        else {
            this.rules.reacts = builder.reacts;
            this.rules.post = builder.post;
        }
        this.rules.reactsHandler = handler;
        return this;
    }
    /**
     * @private
     * Build a Post.
     *
     * @param {any} ops
     * @returns {Promise<Post>}
     */
    async build(ops = {}) {
        ops.state = this.parentForm.state;
        ops.setStateData = this.parentForm.setStateData.bind(this.parentForm);
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
    }
    /**
     * @public
     * Display the Post new Post.
     *
    * @param {djs.Message} msg
    * @param {any} ops
    * @returns {Promise<Post>}
    */
    async display(ops = {}) {
        let msg = await this.parentForm.fetchForm();
        this.collector && this.collector.stop();
        await msg.clearReactions();
        await this.build(ops);
        await msg.edit(this.post.content, this.post.embed);
        if (this.reacts) {
            for (let react of this.reacts) {
                await msg.react(react);
            }
            this.collector = msg.createReactionCollector((react, user) => user.id !== msg.client.user.id && this.reacts.includes(react.emoji.name));
            this.collector.on('collect', (r) => this.rules.reactsHandler && this.rules.reactsHandler(r, { state: this.parentForm.state, setStateData: this.parentForm.setStateData }));
        }
        return Post;
    }
}
exports.default = Post;
