const fastify = require('fastify')({ logger:true});
const mongoose = require('mongoose');
const Article = require('./model/article');

const mongoURL = 'mongodb://localhost:27017/blogapi';

mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() =>{
    console.log('Connected to MongoDB');
}).catch((err) =>{
    console.error('Error connecting to MongoDB', err);
});

fastify.get('/', async (request, reply) =>{
    return {hello: 'world'};
})

fastify.get('/articles', async (request, reply) => {
    const articles = await Article.find();
    return articles;
})

fastify.get('/articles/:id', async (request, reply) =>{
    const {id} = request.params;
    const article = await Article.findById(id);
    if(!article){
        return reply.status(404).send({error: 'Article not found'});
    }
    return article;
})

fastify.post('/articles', async (request, reply) =>{
    const { title, content, author, tags } = request.body;

    const  newArticle = new Article({
        title,
        content,
        author,
        tags,
    })

    await newArticle.save();
    reply.status(201).send(newArticle);
});

fastify.put('/articles/:id', async (request, reply) =>{
    const { id } = request.params;
    const { title, content, author, tags } = request.body;
    
    const article = await Article.findByIdAndUpdate(id, {
        title,
        content,
        author,
        tags,
        updatedAt: Date.now(),
    }, { new: true });

    if(!article){
        return reply.status(404).send({ error: 'Article not found' });
    }
    return article;
})

fastify.delete('/articles/:id', async (request, reply)=>{
    const { id } = request.params;
    const article = await Article.findByIdAndDelete(id);
    if(!article){
        return reply.status(404).send({ error: 'Article not found' });
    }
    return { message: 'Article deleted successfully' };
});


const start = async () =>{
    try{
        await fastify.listen({port:3000});
        console.log('Server is running on http://localhost:3000');
    }catch(err){
        fastify.log.error(err);
        process.exit(1);
    }
}

start();