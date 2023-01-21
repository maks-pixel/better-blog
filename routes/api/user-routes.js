const router = require('express').Router();
const { User } = require('../../models');

//GET /api/users
router.get('/', (req, res) => {
    //Access our user model and run .findAll() method
    User.findAll({
        attributes:{exclude: ['password']} //excluding password from calls
    })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//GET /api/users/1
router.get('/:id', (req, res) => {
    User.findOne({
        attributes: {exclude: ['password']}, // excluding the password from calls
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if(!dbUserData) {
            res.status(404).json({ message: 'No user found with this id'});
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});
//POST /api/users
router.post('/', (req, res)=> {
    //expects {username: 'Lernantino', email: 'lernantino@gmail.com', password:'password1234'}
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    .then(dbUserData => res.json(dbUserData))
    .catch( err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//using a post request is more secure then a get request. using the emaul to identify whether this user exists in the database 
router.post('/login', (req, res) => {
    //expects {email: 'lernantino@gmail.com', password: 'password1234'}
    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(dbUserData => {
        if(!dbUserData){
            res.status(400).json({ message: ' No user with that email address!'});
            return;
        }
        
       // res.json({ user: dbUserData });
       //verify user
        const validPassword = dbUserData.checkPassword(req.body.password);
        if(!validPassword){
            res.status(400).json({ message: ' Incorrect password! '});
            return;
        }
        res.json({ user: dbUserData, message: 'You have been granted access! youre in!' });
        
    });
});
//PUT /api/users/1
router.put('/:id', (req, res) => {
     //expects {username: 'Lernantino', email: 'lernantino@gmail.com', password:'password1234'}
    //if re.body has exact key/value pairs to match the model, you can just use `req.body` instead
    User.update(req.body,
        {
            where: {
                id: req.params.id
            }
        })
        .then(dbUserData => {
            if(!dbUserData[0]){
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// DELETE /api/users/1
router.delete('/:id', (req, res) => {
    User.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if (!dbUserData){
            res.status(404).json({ message: 'No user found with this id'});
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;