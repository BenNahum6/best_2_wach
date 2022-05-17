const express = require('express');
userRouters = require('./movies');

let router = express.Router();

router.get('/',(req, res)=>{
    res.send('welcome to movie2watch !');
});

router.post('/movies', userRouters.CreateMovie);//done
router.put('/movies/updateMovie', userRouters.updateMovie);// done
router.put('/movies/AddActorToMovie', userRouters.AddActorToMovie);//done
router.get('/movies/:movieID', userRouters.getMovie);//done
router.get('/movies', userRouters.getMovies);// done
router.delete('/movies/:movieID/actor/:actorName', userRouters.deleteActorFromMovie);//done
router.delete('/movies/:movieID', userRouters.deleteMovie);//done

module.exports = router;
