/*==============================================================*/
/* DBMS name:      MySQL 5.0                                    */
/* Created on:     2021/1/12 13:10:11                           */
/*==============================================================*/


drop table if exists addresslist;

drop table if exists cartlist;

drop table if exists goods;

drop table if exists order_detail;

drop table if exists orderlist;

drop table if exists user;

/*==============================================================*/
/* Table: addresslist                                           */
/*==============================================================*/
create table addresslist
(
   addressId            int not null,
   userId               varchar,
   postName             varchar,
   streetName           varchar,
   postCode             int,
   tel                  varchar,
   isDefault            tinyint,
   primary key (addressId)
);

/*==============================================================*/
/* Table: cartlist                                              */
/*==============================================================*/
create table cartlist
(
   cartId               int not null,
   userId               varchar,
   cart_productNum      int,
   cart_totalPrice      varchar,
   checked              int,
   primary key (cartId)
);

/*==============================================================*/
/* Table: goods                                                 */
/*==============================================================*/
create table goods
(
   productId            int not null,
   userId               varchar,
   productName          varchar,
   productPrice         int,
   sub_title            varchar,
   limit_num            int,
   "desc"               varchar,
   descImg              varchar,
   productDetails       varchar,
   primary key (productId)
);

/*==============================================================*/
/* Table: order_detail                                          */
/*==============================================================*/
create table order_detail
(
   orderId              varchar not null,
   productId            int not null,
   proNum               int,
   primary key (orderId, productId)
);

/*==============================================================*/
/* Table: orderlist                                             */
/*==============================================================*/
create table orderlist
(
   orderId              varchar not null,
   userId               varchar,
   addressId            int,
   productNum           iint,
   totalPrice           varchar,
   discount             varchar,
   shipPrice            varchar,
   freightRisk          varchar,
   createDate           varchar,
   ifPay                varchar,
   primary key (orderId)
);

/*==============================================================*/
/* Table: user                                                  */
/*==============================================================*/
create table user
(
   userId               varchar not null,
   userName             varchar,
   userPwd              varchar,
   primary key (userId)
);

alter table addresslist add constraint FK_Relationship_3 foreign key (userId)
      references user (userId) on delete restrict on update restrict;

alter table cartlist add constraint FK_Relationship_1 foreign key (userId)
      references user (userId) on delete restrict on update restrict;

alter table goods add constraint FK_Relationship_4 foreign key (userId)
      references user (userId) on delete restrict on update restrict;

alter table order_detail add constraint FK_Relationship_5 foreign key (productId)
      references goods (productId) on delete restrict on update restrict;

alter table order_detail add constraint FK_Relationship_7 foreign key (orderId)
      references orderlist (orderId) on delete restrict on update restrict;

alter table orderlist add constraint FK_Relationship_2 foreign key (userId)
      references user (userId) on delete restrict on update restrict;

alter table orderlist add constraint FK_Relationship_6 foreign key (addressId)
      references addresslist (addressId) on delete restrict on update restrict;

