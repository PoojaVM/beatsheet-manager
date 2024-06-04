# BeatSheet Creator Application

## Candidate: Pooja Mule (poojamules95@gmail.com)

## Table of Contents
- [Links](#links)
- [Usage Instructions](#usage-instructions)
- [Features](#features)
- [Bonus Features](#bonus-features)
- [Assumptions](#assumptions)
- [UI Considerations](#ui-considerations)
- [Technologies Used](#technologies-used)


### Links
- AWS Website http://beetsheet-app.s3-website-us-east-1.amazonaws.com
- Github Repository: https://github.com/PoojaVM/beatsheet-manager

###  Usage Instructions
1. Deployed website can be accessed using [this link](http://beetsheet-app.s3-website-us-east-1.amazonaws.com)
2. Local setup instructions
    - Prerequisite
        - Node.js
        - npm
        - git
    - Clone the repository using command "git clone [this link](https://github.com/PoojaVM/beatsheet-manager)"
    - Server setup
        - Navigate to the server directory using command "cd server"
        - Install dependencies using command "npm install"
        - Start the server using command "npm start"
    - Postgres setup
        - Ensure you have database named `postgres ` running on port `5432`
        - Refer to `.env.example` file and create a `.env` file with the required environment variables
        - Migration and seeding can be done using the following commands
            - `npm run migrate:up`
            - `npx run seed`
        - To revert the migration, run the following command 3 times
            - `npm run migrate:down`
    - Client setup
        - Navigate to the client directory using command "cd client"
        - Install dependencies using command "npm install"
        - Start the application using command "npm start"
    - Open the browser and visit `http://localhost:3000` and sign up using gmail to access the application
3. Existing credentials
    - Username: `poojamules95`
    - Password: `Test@123`

### Features
1. Authentication
    - AWS Congito is used for authentication
    - To sign up, use a valid email address, a unique username, and password
    - User can sign up, sign in, reset password, and sign out
2. Routing
    - Routing is protected and user is redirected to login page if not authenticated
    - User is redirected to `beetsheets` page if already authenticated
    - User can view and edit each beatsheet by clicking on the respective row and the route changes accordingly
3. Welcome Page
    - User is shown a welcome message upon login
4. List Beatsheets
    - Users are shows a list of beatsheets post welcome message
    - The beatsheets are sorted by the last updated date
    - Search functionality is provided to search for beatsheets by name or description
    - Each row shows the beatsheet name, description, created date, and last updated date
    - User can click on the action items in the row to view and edit the beatsheet
5. Beatsheet actions
    - Add new beatsheet
    - Edit beatsheet
    - Delete beatsheet
6. Act actions
    - Add new act
    - Edit act
    - Delete act
7. Beats actions
    - Add new beat
    - Edit beat
    - Delete beat

### Bonus Features
1. AWS hosting
2. Animations
3. Beatsheet deletion
4. Beatsheet pagination
5. Reorder acts (drag and drop acts) 
6. Reorder beats (moving beats in same act and across acts)
7. Responsive design
8. Permission based access

### Assumptions
1. User can only view and edit their own beatsheets

### UI Considerations
1. Styling is done using Tailwind CSS
2. Primary color - #FFC300
3. Secondary color - #181818
4. The UI is responsive and works well on all screen sizes
5. Validations are done on the client side and the user is shown an error message if the input is invalid
6. Acknowledgement message is shown on successful actions like adding, editing, and deleting beatsheets, acts, and beats

### Technologies Used
1. React
2. Node.js
3. Express
4. Postgres
5. AWS Cognito
6. Tailwind CSS
8. AWS Elastic Beanstalk
9. AWS S3
