import client from "../../client"
import bcrypt from "bcrypt"
import { ProtectedResolver } from "../users.utils"
import { createWriteStream } from "fs"

const resolverFn = async(_,
	{firstName,lastName,username,email,password:newPassword, bio, avatar},
	{loggedInUser}
	)=> {
			const { filename, createReadStream } = await avatar
			const readStream = createReadStream();
			const writeStream = createWriteStream(process.cwd() + "/uploads/" + filename);
			readStream.pipe(writeStream);
			let uglyPassword = null;
			if(newPassword){
				uglyPassword = await bcrypt.hash(newPassword, 10);
			}
			const updatedUser = await client.user.update({
				where:{
					id: loggedInUser.id,
				},
				data:{
					firstName,
					lastName,
					username,
					email,
					bio,
					...(uglyPassword && {password : uglyPassword})
				},
			});
			if (updatedUser.id){
				return {
					ok:true,
				}
			} else {
				return {
					ok:false,
					error:"could not update profile",
				}
			}
		}

export default {
	Mutation: {
		editProfile: ProtectedResolver(resolverFn),
	}
}
