create table users(
	id serial primary key,
	email varchar(100) not null,
	password varchar(100) not null
)

insert into users(email, password) values
    ('aaa@aa.aa', 'aaa'),
    ('bbb@bb.bb', 'bbb')