const router = require('express').Router();
const {LogModel} = require('../models');
const middleware = require("../middleware");
const Log = require('../models/log');

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
        owner_id: id
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

/*
====================
* GET LOGS BY USER
====================
 */

router.get("/", middleware.validateSession, async(req, res) => {
    let {id} = req.user;
    try{
        const userLogs = await LogModel.findAll({
            where:{
                owner_id: id
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
=======================
* GET LOGS BY LOG ID
=======================
*/

router.get("/:id", middleware.validateSession, async(req, res) => {
    const logId = req.params.id;
    const userId = req.user.id;
    try {
    const results = await LogModel.findAll({
        where: {
            id: logId,
            owner_id: userId
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
* UPDATE LOGS 
=======================
*/
router.put("/:id", middleware.validateSession, async (req, res) => {
    const {description, title, category, date, status} = req.body;
    const logId = req.params.id;
    const userId = req.user.id;

    try {
        const update = await LogModel.update({description, title, category, date, status},
            {where: {id: logId, owner_id:userId }});
        res.status(200).json({
            update,
            message: "Log has been updated."});
    } catch (err) {
        res.status(500).json({ 
            message: "Unable to update log",
            error: err});
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
            where: {id: logId, owner_id:userId }
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