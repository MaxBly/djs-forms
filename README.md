# djs-forms

`djs forms` is a little extension to `discord.js`
This module helps you to manage `RichEmbed`, with some templating methods, and catch all `MessageReactions` easyly.

If you are building a `discord bot` and you want to easyly interact with the users, this module will provide you a `component-like` management of your RichEmbed forms 

## Getting Started

- Install the package

```
npm i djs-forms
```

- Import Statement
```js
import form from 'djs-form'
```

### Prerequisites

You will need an existing discord bot project, with at least an event that can handle the post creation

```js
bot.on('message', msg => {
    if (msg.content === "hello") {
            //create a form instance
            let f = form(bot, msg.channel);

            //then create how many post you want
            let helloPost = f.createPost({
                post: {
                    content: 'New message',
                    embed: new djs.RichEmbed()
                        .setAuthor('Romuald')
                        .setTitle('Hello World')
                }
            });
            //then just display it, this will build the post and render it
            f.display(helloPost);
        }
    })

```
## Docs

### f.createPost(rules: PostCreatorOptions)

`rules` need to be defined following one of those formats

#### `post || postBuilder` 

```js
f.creatPost({
    post: {
        embed: new djs.RichEmbed()
            .setAuthor('Romuald')
            .setTitle('Hello world'), 
        content: 'New message'
    },
})
```
or

```js
f.creatPost({
    postBuilder(ops) { //example on given ops: {author: 'Romuald'}
        let embed = new djs.RichEmbed()
            .setAuthor(ops.author)
            .setTitle('Hello world'), 
        let content = 'New message'
        return { embed, content }
    },
})
```
same as the upper one but you have access to the `ops` parameter which has provided when doing `f.display(post, ops)`

```js
f.creatPost({
    async postBuilder(ops) { //example on given ops: {id: '2134'}
        let author = await fetchFromApi('someapi.com/user?id=' + ops.id)
        let embed = new djs.RichEmbed()
            .setAuthor(author)
            .setTitle('Hello world'), 
        let content = 'New message'
        return { embed, content }
    },
})
```
This function can also be `async` returning a _Promise_ that resolves `{embed, content}`


```js
f.creatPost({
    postBuilder(ops) { //example on given ops: {id: '651'}
        return new Promise(async resolve => {
            let author = await fetchFromApi('someapi.com/user?id=' + ops.id)
            let embed = new djs.RichEmbed()
                .setAuthor(author)
                .setTitle('Hello world'), 
            let content = 'New message'
            resolve({ embed, content })
        })
    },
})
```
Same as the previous one.

#### `(post || postBuilder) && (reacts || reactsBuilder) && reactsHandler` 

`reacts` and `reactsBuilder` work the same way as `post` and `postBuilder` you only need one of both.
**Unless**, if you declare a `reacts` or `reactsBuilder` statement you will need to define a `reactsHandler` method

```js
f.creatPost({
    post: {
        embed: new djs.RichEmbed()
            .setAuthor('Romuald')
            .setTitle('Hello world'), 
        content: 'New message'
    },
    reacts: ['🥃','🍇','💼'], 
    reactsHandler(react) {
        console.log('reaction!', react.emoji.name)
    }
```
`reacts` contains an `Array` of `unicode emojis`

```js
f.creatPost({
    post: {
        embed: new djs.RichEmbed()
            .setAuthor('Romuald')
            .setTitle('Hello world'), 
        content: 'New message'
    },
    reactsBuilder (ops) { //example on given ops: {Quit: '❎ ', Prev: '⏪', Next: '⏩', Ok: '✅'}
        let emojis = [ops.Quit, ops.Prev, ops.Next, ops.Ok]
    }, 
    reactsHandler(react) {
        console.log('reaction!', react.emoji.name)
    }
})
```
Same as the upper one but you have access to the `ops` parameter which has provided when doing `f.display(post, ops)`.
This function can also be `async` returning a _Promise_ that resolves an _Array_ of *unicode emoji*.

#### `globalBuilder && reactsHandler` 

The `globalBuilder` permits to build the `post` and the `reacts` in the same _statement_,
It returns and _Object_ containing an `{embed, content}` _Object_ as `post` and an _Array_ of *unicode emoji* as `reacts`.
You also need a `reactsHandler` because you are also building emojis.

```js
f.createPost({
    globalBuilder (ops) { //example of given ops: {author: 'Romuald'}
        let embed = new djs.RichEmbed()
            .setAuthor(author)
            .setTitle('Hello world');
        let content = 'New Message';
        return {
            post: {embed, content}, reacts: ['🥃','🍇','💼']
        }
    },
    reactsHandler (react) {
        console.log('reaction!', react.emoji.name)
    }
})
```
Of course it can be asyncronous, same as before.

### f.display(post: Post, ops?: any)

The `post` parameter is a _Post_ provided by the `f.createPost()` method
The `ops` parameter is an _Object_ which contains all the data you want to pass to the `postBuilder | reactsBuilder | globalBuilder`

```js
let post = f.creatPost({
    post: {
        embed: new djs.RichEmbed()
            .setAuthor('Romuald')
            .setTitle('Hello world'), 
        content: 'New message'
    },
    reactsBuilder (ops) {
        let emojis = [ops.Quit, ops.Prev, ops.Next, ops.Ok]
    }, 
    reactsHandler(react) {
        console.log('reaction!', react.emoji.name)
    }
})

f.display(post, {Quit: '❎ ', Prev: '⏪', Next: '⏩', Ok: '✅'});
```

### f.onReplies(handler: (msg) => void, filter?: (msg) => boolean)

```js
f.onReplies(msg => {
    console.log('reply!', msg.content)
})
```
Get all _Messages_ sent on the _Channel_ provided at `let f = form(bot, msg.channel)`

```js
f.onReplies(msg => {
    console.log('reply!', msg.content)
}, msg => msg.mentions.members.get(bot.user.id) ? true : false)
```

Get only the _Messages_ which @mention the bot, sent on the _Channel_ provided at `let f = form(bot, msg.channel)`

### Examples 

See [Example](examples/example1.js)

See [Example1](examples/example2.js)

See [Example2](examples/example3.js)

## Authors

* **MaxBly** - *Initial work* - [MaxBly](https://github.com/MaxBly)

## License

This project is licensed under the ISC License
