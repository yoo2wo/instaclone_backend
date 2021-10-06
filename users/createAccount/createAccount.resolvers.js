import client from "../../client"
import bcrypt from "bcrypt"

export default {
	Mutation : {
		createAccount: async (_,{
			firstName,
			lastName,
			username,
			email,
			password
		}) => {
			//1. B에 중복된 username과 email이 있는지 확인
			try {
				const existingUser = await client.user.findFirst({
					where: {
						OR: [
							{
								username,
							},
							{
								email,
							},
						],
					},
				});
				if (existingUser){
					throw new Error("This username/email is already taken.");
				}
				//2. 만약 없다면 password 암호화하기
				const uglyPassword = await bcrypt.hash(password, 10);
				return client.user.create({
					data:{
						username,
						email,
						firstName,
						lastName,
						password: uglyPassword,
					}
				})
			} catch(e) {
				return (e);
			}
			//3. 저장한후 user return
		},
	}
}
