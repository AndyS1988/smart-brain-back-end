const handleRegister = (req, res, db, bcrypt) => {
	const { name, email, password } = req.body;
	if (!name || !email || !password) {
		return res.status(400).json("Incorrect form submission. All fields must be filled in with valid information!")
	}
	const hash = bcrypt.hashSync(password);
	//knex transactions make sure all columns in both tables are updated (if there is an error nothing gets updated):
	db.transaction(trx => {
		trx.insert({
			hash: hash,
			email: email
		})
		.into('login')
		.returning('email')
		.then(loginEmail => {
			return trx('users')
				.returning('*')
				.insert({
					name: name,
					email: loginEmail[0],
					joined: new Date()
				})
				.then(user => {
					res.json(user[0]);	
				})
			})
			.then(trx.commit)
			.catch(trx.rollback)
		})
		.catch(err => res.status(400).json('Unable to register.'))
}

module.exports = {
	handleRegister: handleRegister
}