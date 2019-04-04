# djs-forms

`djs forms` is a little extension to `discord.js`
This modules helps you to manage `RichEmbed`, with some templatings methods, and catch all `MessageReactions` easly.

If you are building a `discord bot` and you want to easly interact with the users, this module will provides you a `component-like` management of your RichEmbed forms 

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

`rules` need to be defined following one of thoses formats

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
    postBuilder(ops) { 
        let embed = new djs.RichEmbed()
            .setAuthor(ops.author)
            .setTitle('Hello world'), 
        let content = 'New message'
        return { embed, content }
    },
})
```
same as the upper one but you have access to the `ops` parameter which is provided when `f.display(post, ops)`

```js
f.creatPost({
    async postBuilder(ops) { 
        let author = await fetchFromApi('someapi.com/user?id=' + ops.id)
        let embed = new djs.RichEmbed()
            .setAuthor(author)
            .setTitle('Hello world'), 
        let content = 'New message'
        return { embed, content }
    },
})
```
This function can also be an `async` resolving a `Promise` of `{embed, content}`


```js
f.creatPost({
    postBuilder(ops) { 
        return new Promise(resolve => {
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
same as the previous one

#### (`post || postBuilder`) && (`reacts || reactsBuilder) && reactsHandler` 



#### `globalBuilder && reactsHandler` 

```ts
f.creatPost({
    post: : {
        embed: new djs.RichEmbed()
            .setAuthor('Romuald')
            .setTitle('Hello world'), 
        content: 'New message'
    },
})
```

the `PostCreatorOptions` is an objetc like :
```ts


let rules = {
    post: {
        embed: new djs.RichEmbed()
            .setAuthor('Romuald')
            .setTitle('Hello world'), 
        content: 'New message'
    },
    postBuilder (ops? : any) { //ops is provided when doing f.display(post, ops)
        let embed = new djs.RichEmbed()
            .setAuthor('Romuald')
            .setTitle('Hello world');
        let content = 'New Message';
        return {embed, content}
    },
    globalBuilder (ops? : any) { //ops is provided when doing f.display(post, ops)
        let embed = new djs.RichEmbed()
            .setAuthor('Romuald')
            .setTitle('Hello world');
        let content = 'New Message';
        return {
            post: {embed, content}, reacts: ['🥃','🍇','💼']
        }
    },
    reacts: ['🥃','🍇','💼'],
    reactsBuilder (ops: any) {
        let reacts = ['🥃','🍇','💼'];
        return reacts;
    },

    reactsHandler (react: djs.MessageReaction) {
        console.log('react', reacts.emoji.name)
    },
}

```




### Examples 

See [Example](examples/example1.js)

See [Example1](examples/example2.js)

See [Example2](examples/example3.js)

## Authors

* **MaxBly** - *Initial work* - [MaxBly](https://github.com/MaxBly)

## License

This project is licensed under the MIT License
