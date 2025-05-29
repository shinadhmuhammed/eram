const User = require('../../models/userModel')


const addAdmin = async(req,res) =>{
    try {
    const { firstName,lastName,fullName,role, email,phone,cPassword } = req.body;
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
        hashedPassword
    })

    await newAdmin.save()

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}


const adminLogin = async (req,res) =>{
    try {
        const {email,password} = req.body
        console.log(req.body,'hihihi')
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    adminLogin,
    addAdmin
}