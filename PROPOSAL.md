# Project Proposal 

## Project Choice 

- [ ] Circle Jump

## Project Description 

Introducing "Jumper," my gaming application where players engage in an exhilarating challenge of leaping over oncoming obstacles. The scoring system increments with each successful jump until the player collides with another structure, signaling the end of the game. Users can choose to restart and relish a new game. I aspire to enhance the user experience by incorporating improved animations and even introducing artificial intelligence for an added layer of difficulty.

## Wire Frames

**Initial Landing View**
![Alt text](<assets/Game (Start).png>)

**Game In Motion**
![Alt text](<assets/Game (Clicked).png>)

![Alt text](<assets/Game (in Motion).png>)
**Results View**
![Alt text](<assets/Game (End).png>)

## User Stories

#### MVP Goals

- As a player, I desire the ability for my character (represented by a circle) to perform jumps.
- As a player, I prefer obstacles to appear in various sizes, adding an element of unpredictability to the game.
- As a player, clear indication of the game's conclusion due to colliding with an obstacle is important.
- As a player, I seek a prominently displayed score, providing visibility into my highest level of achievement.
- As a player, the option to effortlessly restart the game upon completion is a convenience I appreciate.

#### Stretch Goals

- As a player, I desire an immersive experience with a sound effect accompanying each collision between my character and an obstacle.
- As a player, I seek to enhance the gaming atmosphere with the addition of soothing lofi music playing in the background.
- As a player, I value a competitive edge, and therefore, I wish for the game to retain and showcase the top three players' scores before initiating a new session.


#### Notionboard Template
Notionboard template for building projects ( You can use this for any project )
https://www.notion.so/GA-Unit-3-Tunr-Lab-da2c82fafd4e4a7aa654676732db9ee3

#### Timeline - Daily Accountability

| Day        |   | Task                               | Blockers | Notes/ Thoughts |
|------------|---|------------------------------------|----------|-----------------|
| Thursday   |   | Create and present proposal        |          |                 |
| Friday     |   | Create game enviroment         |          |                 |
| Saturday   |   | Start building functions and impletmenting            |          |                 |
| Sunday     |   | Add functionality                  |          |                 |
| Monday     |   | Add styling                        |          |                 |
| Tuesday    |   | Finaliza MVP                       |          |                 |
| Wedenesday |   | Work on stretch goals              |          |                 |
| Thursday   |   | Work on icebox items if applicable |          |                 |
| Friday     |   | Presentation Day!                  |          |                 |
|            |   |                                    |          |                 |



### Game Pseudocode - Jumper

```//  Define the canvas dimensions
- Canvas width and Height

// Define player properties
- Player itself 
- Player movement position (x || y)

//Define falling and jumping  variables
- Speed of jump
- Speed of fall

//Define obstacle properties 
- Circle
- size 

//Initialize score and label score 
- Score = 0
- scoreLabel


// Create a function to start the game



// Game canvus object


// Create a player function
- width, height, if it sits on (x || y)

// Function to create a obstacle
- block 
- set block properties 
- draw block on canvas
- move block towards player
- reset block position 

// Function to detect collison with obstacle
- detectCollison()

// Function to create a score label
- set score label 

// Function to update canvas
- Check for collision
- Clear the canvas
- Make player fall
- Draw player
- Make player Jump
- Draw block
- Move obstacle (block) towards the player (circle)
- Redraw the score label with updated score


// Create a function to generate a ramdom number 
- To randomize the height and width of obstacles.

// Function to resest Jump after delay
- resetJump()

// Event listener for spacebar key to trigger Jump
- document.body.onkeyup ```


