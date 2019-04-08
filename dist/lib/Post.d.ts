import Form, { StateProvider } from './Form';
import djs from 'discord.js';
export declare type ReactsHandler = (react: djs.MessageReaction, state: StateProvider) => void;
export declare type ReactsBuilder = (ops: any) => ReactsData | Promise<ReactsData>;
export declare type PostBuilder = (ops: any) => PostData | Promise<PostData>;
export declare type GlobalBuilder = (ops: any) => GlobalData | Promise<GlobalData>;
export interface PostCreatorOptions {
    postBuilder?: PostBuilder;
    globalBuilder?: GlobalBuilder;
    reactsBuilder?: ReactsBuilder;
    reactsHandler?: ReactsHandler;
    post?: PostData;
    reacts?: ReactsData;
}
export declare type React = string;
export declare type ReactsData = React[];
export interface PostData {
    embed?: djs.RichEmbed;
    content?: string;
}
export interface GlobalData {
    reacts: ReactsData;
    post: PostData;
}
export default class Post {
    private rules;
    private clientid;
    parentForm: Form;
    private post;
    private reacts;
    private collector;
    /**
     * @private
     * @constructor
     * Create new Post.
     *
     * @param {PostCreatorOptions} rules
     * @param {string} clientid
     */
    constructor(rules: PostCreatorOptions, clientid: string, parentForm: Form);
    /**
     * @public
     * Set the post
     *
     * @param {PostData | PostBuilder} post
     * @returns Post
     */
    setPost(post: PostData | PostBuilder): Post;
    /**
     * @public
     * Set the reacts and the reacts handler
     *
     * @param {ReactsData | ReactsBuilder} reacts
     * @param {ReactsHandler} handler
     * @returns Post
     */
    setReacts(reacts: ReactsData | ReactsBuilder, handler: ReactsHandler): Post;
    /**
     * @public
     * Set the builder of the post and the reacts handler
     *
     * @param {GlobalBuilder} builder
     * @param {ReactsHandler} handler
     * @returns Post
     */
    setBuilder(builder: GlobalData | GlobalBuilder, handler: ReactsHandler): Post;
    /**
     * @public
     * Build a Post.
     *
     * @param {any} ops
     * @returns {Promise<Post>}
     */
    build(ops?: any): Promise<this>;
    /**
     * @public
     * Display the Post new Post.
     *
    * @param {djs.Message} msg
    * @param {any} ops
    * @returns {Promise<Post>}
    */
    display(ops?: any): Promise<typeof Post>;
}
