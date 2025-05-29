const User = require('../../models/userModel')


const addAdmin = async (req, res) => {
    try {
        const { firstName, lastName, fullName, role, email, phone, cPassword, branchId } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(cPassword, salt);

        const newAdmin = new User({
            firstName,
            lastName,
            fullName,
            role,
            email,
            phone,
            hashedPassword,
            branch: branchId
        })

        await newAdmin.save()

        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}


const getAllAdmin = async(req,res) =>{
    try{
        const allAdmins = await User.find({ role:'admin'})
        return res.status(200).json({allAdmins})
    }
    catch(error){
        console.log(error.message)
        return res.status(500).json({message:error.message})
    }
}


module.exports = {
    adminLogin,
    addAdmin,
    getAllAdmin
}