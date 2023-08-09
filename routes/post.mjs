import express from 'express'
import {nanoid} from 'nanoid'
import {client} from './../mongodb.mjs'

const db = client.db("cruddb")
const col = db.collection("posts");


let router = express.Router()


let posts = [
  {
    id : nanoid(),
    title: "abc 123",
    text: "hello 123"
  }
]
router.post('/post', async (req, res, next) => {
  // console.log('this is signup!', new Date());

  if (
      !req.body.title
      || !req.body.text
  ) {
      res.status(403);
      res.send(`required parameters missing, 
      example request body:
      {
          title: "abc post title",
          text: "some post text"
      } `);
      return;
  }

  const insertResponse = await col.insertOne({
      id: nanoid(),
      title: req.body.title,
      text: req.body.text,
  });
  console.log("insertResponse: ", insertResponse);

  res.send('post created');
})

router.get('/posts', async (req, res, next) => {

  const cursor = col.find({});
  let results = await cursor.toArray()
  console.log("results: ", results);
  res.send(results);
})
//GET '/api/v1/post/:userId/'
router.get('/post/:postId', (req,res,next)=>{
if(isNaN(req.params.postId)){
  res.status(403).send(`post id must be a valid number, no alphabets allowed`)

}
for(let i = 0; i<posts.length; i++){
  if(posts[i].id === Number(req.params.postId)){
    res.send(posts[i])
    return
  }
  res.send(`post not found with id ` + req.params.postId)
}
  }) 
  router.put('/post/:postId', async (req, res, next) => {
    const postId = req.params.postId;
  
    const filter = { id: postId };
    const update = {};
  
    if (req.body.title) {
      update.title = req.body.title;
    }
    if (req.body.text) {
      update.text = req.body.text;
    }
  
    const updateResponse = await col.updateOne(filter, { $set: update });
  
    if (updateResponse.modifiedCount === 1) {
      res.send('Post edited successfully');
    } else {
      res.status(404).send(`Error in editing Post with id ${postId}`);
    }
  });
router.delete('/post/:postId', async (req, res, next) => {
  const postId = req.params.postId

  const deleteResponse = await col.deleteOne({ id: postId });
  if (deleteResponse.deletedCount === 1) {
    res.send('Post deleted successfully');
  } else {
    res.status(404).send(`Error in deleting Post with id ${postId}`);
  }
});


  export default router