
const addRecruiter = async (req, res) => {
    try {
        const { companyName, location, email, phoneno, category, website_url, status, employees_count, password, adminId, branchId,role } = req.body;
        if (!companyName || !location || !email || !phoneno || !category || !website_url || !employees_count || !password || !adminId || !branchId) {
            return res.status(400).json({ message: 'missing required fields!' })
        }

        const userExist = await User.findOne({ email: email })
        if (userExist) {
            return res.status(500).json({ message: "user already exists with the same email!" })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newRecruiter = new User({
            companyName,
            location,
            email,
            phoneno,
            email,
            category,
            role,
            website_url,
            branch: branchId,
            status,
            employees_count,
            hashedPassword,
            admin: adminId
        })

        await newRecruiter.save()

        res.status(201).json({ message: "User registered successfully", newRecruiter });
    }
    catch (error) {
        console.log(error.message)
        return res.status(500).json({ message: error.message })
    }
}







module.exports = {
    addRecruiter
}