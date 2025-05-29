const Branch = require('../../models/branchModel')

const createBranch = async (req, res) => {
    try {
        const { name, location } = req.body;
        if (!name || !location) {
            return res.status(400).json({ message: "missing required fields!!" })
        }
        const newBranch = new Branch({
            name,
            location
        })

        await newBranch.save();
        return res.status(200).json({ newBranch })

    }
    catch (error) {
        console.log(error.message)
        return res.status(500).json({ message: error.message })
    }
}

const getBranch = async (req, res) => {
    try {
     const branch = await Branch.find({})
     return res.status(200).json({branch})
    }
    catch (error) {
        console.log(error.message)
        return res.status(500).json({ message: error.message })
    }
}

module.exports = {
    createBranch,
    getBranch
}