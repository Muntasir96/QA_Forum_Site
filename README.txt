{\rtf1\ansi\ansicpg1252\cocoartf1671
{\fonttbl\f0\fswiss\fcharset0 Helvetica;\f1\fswiss\fcharset0 ArialMT;}
{\colortbl;\red255\green255\blue255;\red26\green26\blue26;\red255\green255\blue255;}
{\*\expandedcolortbl;;\cssrgb\c13333\c13333\c13333;\cssrgb\c100000\c100000\c100000;}
\margl1440\margr1440\vieww10800\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 One paragraph description:\
EASY STREET! A simple question / answers forum where users can log in and register with a user name and password. The username has to be unique and the password has to follow a certain criteria. The front page will contain a list of links to questions that are created by users. On the front page each post will have its question as a url, date created, and whoever posted it. When clicking on a post you will be redirected to its page where it has comments. The comments serve as answers to the question. Posts serve as questions and comments serve as answers. One can also search for certain questions on the homepage search button.\
\
Original Wireframes and the sitemap are located in the folder: doc omg\
\
User stories:\
As a user, I want to register so that I can answer questions and ask questions answers as I see fit\
As a asker, I click on the post button so that I can create a page with my question(s) as the header and so that others can answer my question.\
As a answerer, I click on the submit comment button on post pages so that I can submit an answer to the question\
As a user interested on the questions/answers with high or low <specific criteria>, I click on the sort by <specific criteria> on the dropdown box to see the question\
\
Modules / Concepts for research:\
1) Unit Testing - Mocha\
To test specific functions of the web application. \
Modules: Mocha and Supertest\
Screen capture: https://www.youtube.com/watch?v=mz-nDQ9ZK7Y\
\pard\pardeftab720\sl220\partightenfactor0

\f1 \cf2 \cb3 \expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 Mocha is a JavaScript test framework for Node.js programs\
It uses asset libraries and most importantly asynchronous testing, so any short tasks shouldn\'92t have to wait for a long task to run.\
In my specific example I used a superset module that integrate mocha and run 4 simple unit tests on server-test.js in the src folder - testing if homepage, login and register works. It also tests if my server fails from a random page which it does.\
Command line: mocha -R spec server-test.js
\f0 \cf0 \cb1 \kerning1\expnd0\expndtw0 \outl0\strokewidth0 \
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0
\cf0 Points: 3\
\
2) CSS framework - Bootstrap\
Bootstrap is a free and open-source front-end framework for designing websites and web applications. It contains HTML- and CSS-based design templates for typography, forms, buttons, navigation and other interface components, as well as optional JavaScript extensions.\
In my specific example I minimally configured my css on  https://getbootstrap.com/docs/3.3/customize/ and toggle many specific features, downloaded and used it in my css folder for very minimal css structure and presentation.\
Modules: Bootstrap\
Points: 2\
\
3) Form validation - Passport\
Passport's sole purpose is to authenticate requests, which it does through an extensible set of plugins known as strategies. Passport does not mount routes or assume any particular database schema, which maximizes flexibility and allows application-level decisions to be made by the developer.\
In my specific example, I used the passport code from Versoza\'92s slides on Authorization except with the routers and I added logout. The bulk of the code are under the post methods for login and register and in auth.js.\
Modules: Passport\
Points: 3\
}