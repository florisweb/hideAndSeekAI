# Hide and Seek AI
A competitive AI implementation of Hide and Seek / Tag.

<h3>Main Premise</h3>

All agents are paired up in groups of two, one hider (Blue) and one seeker. (Red)
Both are scored on the average distance between oneanother, when the seeker touches the hider the seeker 'wins' and the distance between the two will be zero for the remainder of the round, causeing the average to drop significantly.
After each round the top 50% of both teams are selected and duplicated, where the duplicate is mutated and the original is not. 

<h3>The Graph</h3>

In the bottom right screen a linegraph will appear once you start the simulation. (x-axis: Time, y-axis: average distance)
The blue line symbolizes the average distance between the best hider in that round and its partner. Whereas the red line represents the same but from the best seeker's point of view. (For the seekers the average distance has to be minimized where the hiders want to maximize it.)
The purple line represents the average distance between all seekers and their partner hiders.

