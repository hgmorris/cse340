/*1 */
insert into account(account_firstName, account_lastName, account_email, account_password) 
values ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

/*2 */


UPDATE account
SET account_type = 'Admin'
WHERE account_id = 1;


/*3 Using Id to ensure right record is deleted*/
DELETE FROM account WHERE account_id =2;

/*4 */
UPDATE 
   inventory
SET 
   inv_description = regexp_replace(inv_description,'the small interiors' ,'a huge interior')
WHERE 
   inv_make = 'GM' AND inv_model = 'Hummer';


/*5 */
SELECT inv.inv_make, inv.inv_model, cla.classification_name

FROM public.inventory AS inv

INNER JOIN public.classification AS cla

ON inv.classification_id = cla.classification_id

WHERE cla.classification_name = 'Sport'; 


/*6 */
UPDATE public.inventory
 
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),  inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/')