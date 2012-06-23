Database objects:
level (
	id int(3) not null auto_increment,
	name varchar(30),
	createtime timestamp,
	savedtime timestamp,
	preparetime int(5),
	primary key (id)
)

rock (
	level int(3),
	`order` int(3),
	type varchar(20),
	spawnDelay int(3),
	x int(3),
	dir float(4,3),
	primary key (level,`order`)
)