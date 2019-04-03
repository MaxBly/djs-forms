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
### Examples 

See [Example](examples/example1.js)

See [Example1](examples/example2.js)

See [Example2](examples/example3.js)

## Authors

* **MaxBly** - *Initial work* - [MaxBly](https://github.com/MaxBly)

## License

This project is licensed under the MIT License

```js
    let reacts = ['🥃','🍇','💼']
```