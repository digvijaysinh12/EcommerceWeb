import bcrypt from 'bcrypt';
export const hashPassword = async(password) => {
    try{
        const saltRound = 10;
        const hashedPassword = bcrypt.hash(password,saltRound);
        return hashedPassword;
    }catch(error){
        console.log(error);
    }
};

export const comparePassword = async(password,hashedPassword) =>{
    return bcrypt.compare(password, hashedPassword);
};