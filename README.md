Simple appointement management system
---------------------------------

This application uses ES modules and swagger for documenting the API.

Te purpose of the application is to allow users to create appointments as well as signing up to them.

Features
----------
Unauthenticated users:
* See public appointments on the start page
* Search for public and unlisted appointments if they have an id
* Open a link to a public or unlisted appointment
* Sign up for an appointment
* Register (become authenticated user) or sign in

Authenticated users:
* All features of an unauthenticated user
* Create public/ unlisted and private appointments
* See there onw private and unlisted appointments of the start page
* View list of users signed up for one oof their events
* Change the visibility of one of the there events

Deployment
------------
As of the time of creating this file, the webpage is deploye at calender.lk-vt.de.

The server application is running on a private server, accessed over the internet via nginx as a reverse proxy
at the subdomain "calender". The application uses a private mongodb instance running on a server inside the same network. 
The public connection is secured via https.


Author: Vincent Horn and Lars Kölbel | 
Hochschule Stralsund