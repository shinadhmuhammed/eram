const Branch = require('../../models/branchModel')

const createBranch = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        try {
            const { branchName, branchCode, isActive = true, location,description} = req.body;

            const brand_logo = req.file ? req.file.filename : null;

            if (!name || !location || !description || !home || !about || !services || !contactus) {
                return res.status(400).json({
                    message: "Missing required fields: name, location, and createdBy are required"
                });
            }

            const newBranch = new Branch({
                name,
                location,
                isActive,
                description,
                brand_logo,
                home: home || { title: '', bannerImage: '', content: '' },
                about: about || { title: '', description: '' },
                services: services || [],
                contact: contactus || { email: '', phone: '' }
            });

            await newBranch.save();

            return res.status(201).json(newBranch);

        } catch (error) {
            console.error('Error creating branch:', error.message);
            return res.status(500).json({
                message: "Server error while creating branch",
                error: error.message
            });
        }
    });
};

const getBranch = async (req, res) => {
    try {
        const branch = await Branch.find({})
        return res.status(200).json({ branch })
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