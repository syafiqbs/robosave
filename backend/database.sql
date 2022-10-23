drop database if exists 'robosave';
create database 'robosave';
use 'robosave';

create table customer(
    customer_id integer auto_increment primary key,
    customer_name varchar(20) not null,
    customer_bankNo integer not null
);

create table transaction(
    transaction_id integer primary key,
    customer_id integer not null,
    value_before integer not null,
    value_after integer not null,
    value_roundup integer not null,
    constraint transaction_fk foreign key(customer_id) references customer(customer_id)
);

create table roundup(
    month integer not null,
    customer_id integer not null,
    total integer not null,
    primary key (month, customer_id),
    constraint roundup_fk foreign key(customer_id) references customer(customer_id)
);