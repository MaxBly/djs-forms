import Form, { StateProvider } from './Form';
import djs from 'discord.js';

export type ReactsHandler = (react: djs.MessageReaction, state: StateProvider) => void;
export type ReactsBuilder = (ops: any) => ReactsData | Promise<ReactsData>;
export type PostBuilder = (ops: any) => PostData | Promise<PostData>;
export type GlobalBuilder = (ops: any) => GlobalData | Promise<GlobalData>;

export interface PostCreatorOptions {
    postBuilder?: PostBuilder,
    globalBuilder?: GlobalBuilder,
    reactsBuilder?: ReactsBuilder,
    reactsHandler?: ReactsHandler,
    post?: PostData,
    reacts?: ReactsData
}

export type React = string;
export type ReactsData = React[];

export interface PostData {
    embed?: djs.RichEmbed,
    content?: string
}


export interface GlobalData {
    reacts: ReactsData,
    post: PostData
}


export default class Post {
    private post: PostData = {};
    private reacts: ReactsData = [];
    private collector: djs.ReactionCollector;

    /**
     * @private
     * @constructor
     * Create new Post.
     *
     * @param {PostCreatorOptions} rules
     * @param {string} clientid
     */

    constructor(private rules: PostCreatorOptions = {}, private clientid: string, public parentForm: Form) { }

    /**
     * @public
     * Set the post 
     * 
     * @param {PostData | PostBuilder} post
     * @returns Post
     */

    setPost(post: PostData | PostBuilder): Post {
        if (typeof post === 'function') {
            this.rules.postBuilder = post;
        } else {
            this.post = post
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

    setReacts(reacts: ReactsData | ReactsBuilder, handler: ReactsHandler): Post {
        if (typeof reacts === 'function') {
            this.rules.reactsBuilder = reacts;
        } else {
            this.reacts = reacts
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

    setBuilder(builder: GlobalData | GlobalBuilder, handler: ReactsHandler): Post {
        if (typeof builder === 'function') {
            this.rules.globalBuilder = builder;
        } else {
            this.reacts = builder.reacts
            this.post = builder.post
        }
        this.rules.reactsHandler = handler;
        return this;
    }

    /**
     * @public
     * Build a Post.
     *
     * @param {any} ops
     * @returns {Promise<Post>}
     */

    async build(ops: any = {}) {
        ops.state = this.parentForm.state;
        ops.setDataState = this.parentForm.setStateData.bind(this.parentForm);
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
        return this;
    }

    /**
     * @public
     * Display the Post new Post.
     * 
    * @param {djs.Message} msg
    * @param {any} ops
    * @returns {Promise<Post>}
    */


    async display(ops: any = {}) {
        let msg = await this.parentForm.fetchForm();
        this.collector && this.collector.stop();
        await msg.clearReactions()
        await this.build(ops);
        if (this.reacts) {
            for (let react of this.reacts) {
                await msg.react(react);
            }
            this.collector = msg.createReactionCollector(
                (react: djs.MessageReaction, user: djs.GuildMember) => user.id !== this.clientid && this.reacts.includes(react.emoji.name)
            );
            this.collector.on('collect', (r: djs.MessageReaction) =>
                this.rules.reactsHandler && this.rules.reactsHandler(r, { state: this.parentForm.state, setStateData: this.parentForm.setStateData })
            );
        }
        await msg.edit(this.post.content, this.post.embed)
        return Post;
    }
}