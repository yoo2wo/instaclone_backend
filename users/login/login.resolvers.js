import client from "../../client"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export default {
	Mutation : {
		login: async (_, {username, password})=> {
			//username 이 있는지 확인
			const user = await client.user.findFirst({where:{username}});
			if(!user){
				return {
					ok : false,
					error: "User not found",
				};
			}
			//password 일치하는지 확인
			const passwordOk = await bcrypt.compare(password, user.password)
			if(!passwordOk){
				return {
					ok : false,
					error: "Incorrect password",
				}
			}
			//token 발행
			const token = await jwt.sign({id: user.id}, process.env.SECRET_KEY);
			return {
				ok: true,
				token,
			}
		},
	}
}
