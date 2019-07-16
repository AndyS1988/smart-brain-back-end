const handleProfileGet = (req, res, db) => {
	const { id } = req.params;
	db.select('*').from('users').where({id})
		.then(user => {
			if (user.length) {
				res.json(user[0])
			} else {
				res.status(400).json('User was not found.')
			}
		})
		.catch(err => res.status(400).json('Error getting user.'))
}

const hadleProfileEmailPut = (req, res, db) => {
	const { userEmail, newEmail } = req.body;
	if (!newEmail) {
		return res.status(400).json("Incorrect submission. Please provide valid email address!")
	}
	db.transaction(trx => {
		trx('users')
			.where('email', '=', userEmail)
			.update({
				email: newEmail
		})
		.returning('email')
		.then(usersNewEmail => {
			return trx('login')
				.where('email', '=', userEmail)
				.update({
					email: usersNewEmail[0]					
				})
				.returning('email')				
				.then(email => {
					res.json("Email change was successful");	
				})
			})
			.then(trx.commit)
			.catch(trx.rollback)
		})
		.catch(err => res.status(400).json('Unable to change email address.'))
}


const hadleProfilePasswordPut = (req, res, db, bcrypt) => {
	const { userEmail, newPassword } = req.body;
	if (!newPassword) {
		return res.status(400).json("Incorrect submission. New password must be entered.")
	}
	const newHash = bcrypt.hashSync(newPassword);
	return db('login')
		.where('email', '=', userEmail)
		.update({
			hash: newHash					
				})
		.returning('hash')
		.then(hash => {
			res.json("Password change was successful");
		})
		.catch(err => res.status(400).json("Unable to change password."))
}

const hadleProfileDelete = (req, res, db) => {
	const { userEmail } = req.body;
	db.transaction(trx => {
		trx('users')
			.where('email', '=', userEmail)
			.del()		
		.then(() => {
			return trx('login')
				.where('email', '=', userEmail)
				.del()								
				.then(() => {
					res.json("User profile was deleted successfully");	
				})
			})
			.then(trx.commit)
			.catch(trx.rollback)
		})
		.catch(err => res.status(400).json('Unable to delete user.'))
	
}

module.exports = {
	handleProfileGet: handleProfileGet,
	hadleProfileEmailPut: hadleProfileEmailPut,
	hadleProfilePasswordPut: hadleProfilePasswordPut,
	hadleProfileDelete: hadleProfileDelete
}