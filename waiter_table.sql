create table shifts(
id serial not null primary key,
days text not null
);

create table waiters(
id serial not null primary key,
waiters_names text not null
);

create table admin(
id serial not null primary key,
waiters_id int not null,
foreign key (waiters_id) references waiters(id),
shifts_id int not null,
foreign key (shifts_id) references shifts(id)
);

insert into shifts(days) values ('Monday');
insert into shifts(days) values ('Tuesday');
insert into shifts(days) values ('Wednesday');
insert into shifts(days) values ('Thursday');
insert into shifts(days) values ('Friday');
insert into shifts(days) values ('Saturday');
insert into shifts(days) values ('Sunday');
