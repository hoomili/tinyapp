# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).
In this project every user needs to register with an email address and password to be able to access the application features. Each user can access and edit only their own urls. The users are also able to share the short url with special link path for example: /u/gNVtv2.

## Editing and Deleting

Each user is able to edit the original link that was provided for shortening and can delete each shortened link if they no longer require the link

## Security

To make sure the application is secure, each user's password is hashed and then saved on the server.

Furthermore, the application uses encrypted cookies to stop access from unathorized users

## Final Product

![image.png](#)
!["screenshot description"](#)

## Dependencies

- Node.js
- Express
- EJS
- bcryptjs
- cookie-session
- morgan

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.