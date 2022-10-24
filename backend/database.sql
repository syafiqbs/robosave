drop database if exists robosave;
create database robosave;
use robosave;

create table customer(
    customer_id integer primary key,
    customer_name varchar(20) not null,
    customer_bankNo integer not null,
    constraint check_bankNo CHECK (customer_bankNo BETWEEN 0000 AND 9999)
);
insert into customer values
    (0, "John", 1111);

create table transaction(
    transaction_id integer primary key,
    txn_date datetime not null,
    customer_id integer not null,
    value_before float not null,
    value_after float not null,
    value_roundup float not null,
    constraint transaction_fk foreign key(customer_id) references customer(customer_id)
);
insert into transaction values
    (100, "2021-12-12 15:00:00", 0, 2.50, 3.00, 0.5),
    (101, "2021-12-24 15:00:00", 0, 20.10, 21.00, 0.9);

create table roundup(
    roundup_date date not null,
    customer_id integer not null,
    total float not null,
    primary key (roundup_date, customer_id),
    constraint roundup_fk foreign key(customer_id) references transaction(customer_id)
);
insert into roundup values
    ("2021-12-31 15:00:00", 0, 1.40);
