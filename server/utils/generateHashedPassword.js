import bcrypt from "bcryptjs"

const generateHashedPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};

export default generateHashedPassword;
