const router = require('express').Router();
const {LogModel} = require('../models');
const middleware = require("../middleware");
const Log = require('../models/log');
const User = require('../models/user');

/*
===============
* CREATE LOG
===============
*/

router.post('/', middleware.validateSession, async (req, res) =>{
    const {description, title, category, date, status} = req.body.log;
    const {id} = req.user;
    const logEntry = {
        description,
        title,
        category,
        date, 
        status,
        userId: id
    }
    try{
        const newLog = await LogModel.create(logEntry);
        res.status(200).json(newLog);
    } catch (err) {
        res.status(500).json({ 
            message: "Unable to create log",
            error :err })
    }
});

/**
===============
* GET ALL LOGS
===============
 */

router.get('/', async (req, res) =>{
    try{
        const entries = await LogModel.findAll();
        res.status(200).json(entries);
    } catch (err) {
        res.status(500).json({error: err});
    }
});

/**
============================
* GET ALL LOGS With UserInfo
============================
 */

router.get('/allInfo/', async (req, res) =>{
    try{
        LogModel.findAll({
            where:{},
            include: [{
                 UserModel,
                }]
        }).then ((data) => {
            console.log("*********************\n\n\n\n\n",data);
        })
        
    } catch (err) {
        res.status(500).json({error: err});
    }
});

/*
====================
* GET LOGS BY USER
====================
 */

router.get("/mine/", middleware.validateSession, async(req, res) => {
    let {id} = req.user;
    try{
        const userLogs = await LogModel.findAll({
            where:{
                userId: id
            }
        });
        res.status(200).json(userLogs);
    } catch (err) {
        res.status(500).json({ 
            message: "Unable to retrieve logs",
            error: err });
    }
});

/*
============================
* GET LOGS BY LOG ID BY USER
============================
*/

router.get("/mine/:id", middleware.validateSession, async(req, res) => {
    const logId = req.params.id;
    const userId = req.user.id;
    try {
    const results = await LogModel.findAll({
        where: {
            id: logId,
            userId: userId
        }
    });
        res.status(200).json(results);
} catch (err) {
    res.status(500).json({
        message:'Unable to retrieve log',
        error: err
    })
}    
    
});


/*
============================
* GET ANY LOG BY LOG ID 
============================
*/

router.get("/adminGet/:id",  async(req, res) => {
    const logId = req.params.id;
try {
    const results = await LogModel.findAll({
        where: {
            id: logId,
            
        }
    });
        res.status(200).json(results);
} catch (err) {
    res.status(500).json({
        message:'Unable to retrieve log',
        error: err
    })
}    
    
});



/*
=======================
* UPDATE LOGS By User
=======================
*/
router.put("/update/:entryId", middleware.validateSession , async (req, res) => {
    const { description, title, category, date, status } = req.body.log;
    const logId = req.params.entryId;
    const userId = req.user.id;

    const query = {
        where: {
            id: logId,
            userId: userId
        }
    };

    const updatedLog = {
        description, title, category, date, status
    };

    try {
        const update = await LogModel.update(updatedLog, query);
        res.status(200).json(update);
        console.log(updatedLog);
    } catch (err) {
        res.status(500).json({ error: err});
    }
});

/*
=======================
*ADMIN UPDATE ANY LOG
=======================
*/

router.put("/adminUpdate/:entryId",  async (req, res) => {
    const { description, title, category, date, status } = req.body.log;
    const logId = req.params.entryId;
    
    const query = {
        where: {
            id: logId
        }
    };

    const updatedLog = {
        description, title, category, date, status
    };

    try {
        const updateByAdmin = await LogModel.update(updatedLog, query);
        res.status(200).json(updateByAdmin);
        console.log(updatedLog, "Log Updated.");
    } catch (err) {
        res.status(500).json({ error: err});
    }
});

/*
=======================
* DELETE LOGS 
=======================
*/
router.delete("/:id", middleware.validateSession, async(req, res) =>{
    const logId = req.params.id;
    const userId = req.user.id;

    try {
        const logDeleted = await LogModel.destroy({
            where: {id: logId, userId:userId }
        })
        res.status(200).json({
            message: "Log deleted",
            logDeleted
        })

    }catch (err) {
        res.status(500).json({
            message: `Failed to delete log: ${err}`
        })
    }
})

/*
=======================
* DELETE ANY LOGS 
=======================
*/
router.delete("/adminDelete/:id",  async(req, res) =>{
    const logId = req.params.id;
    
    try {
        const logDeleted = await LogModel.destroy({
            where: {id: logId }
        })
        res.status(200).json({
            message: "Log deleted",
            logDeleted
        })

    }catch (err) {
        res.status(500).json({
            message: `Failed to delete log: ${err}`
        })
    }
})

module.exports = router;