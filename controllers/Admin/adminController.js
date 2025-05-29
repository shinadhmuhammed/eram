

const adminLogin = async (req,res) =>{
    try {
        const {email,password} = req.body
        console.log(req.body,'hihihi')
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    adminLogin
}