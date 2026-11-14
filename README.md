### MISSION: VECTOR*

Created by Team Trust The Physics

//Project debrief:
Mission: Vector is an educational browser game that invites players to think like spacecraft systems engineers. Players plan a mission, assemble a spacecraft from different hardware options, weigh competing engineering constraints, and observe the outcome of their design through a mission simulation. Rather than choosing the most powerful component in every category, players must make trade-offs involving spacecraft mass, propulsion, available power, communications, scientific instruments, cost, reliability, and mission objectives. The game connects these decisions to numerical assessments and a mission score, making the consequences of engineering choices visible. Mission: Vector also includes an arcade-style asteroid survival challenge, where players steer their craft, collect science coins, fire single-shot blasters, and try to survive for as long as their hull holds. Players can enter their names and compare records in local, same-device sessions with friends. An in-game mission guide offers topic-based help, and animated mission trajectories add a visual dimension to the final simulation. The project combines educational gameplay, interactive visual design, engineering-inspired mathematics, and team-led creative development. Its aim is to make the complexities and trade-offs of spacecraft mission planning more approachable and engaging.

//Team Trust The Physics:
- ### **Shree Hande**: Team Lead; aspiring entrepreneur
- ### **Ajay Pillai**: Aspiring corporate lawyer
- ### **Abhik Prasad**: Aspiration engineer
- ### **Varaakan Ravinthiran**: Aspiring engineer
- ### **Srivatsan Venkatasubramanuim**: Aspiring doctor
- ### **Brihadeshwar Swaminathan**: Aspiring surgeon
The credits are to value everyones contribution to the development of this game. This does not mean the tasks were equally split nor does it mean for the development of the project they worked towards there necessary aspirations, but tasks were divided to the highest fairness possible.

//How to play:
1. Extract the downloaded game folder.
2. Double-click **START_GAME.html** in a modern browser. No installation or server is required.
3. Select a mission and configure spacecraft systems.
4. Review the design's engineering constraints and performance indicators.
5. Play the asteroid survival minigame, then review the mission simulation and score.
6. Use the mission guide for help and the local leaderboard to compare runs with friends.
7. Some NASA-hosted imagery may require an internet connection. The core game can run offline.

//Engineering model and scientific accuracy:
The simulation uses genuine engineering principles, including the rocket equation, mass budgeting, power balance, communications throughput, and reliability modelling. Using established equations does not make all results experimentally verified or precise predictions of real spacecraft performance. The game's spacecraft hardware specifications, mission assumptions, costs, reliability factors, and scoring weights are educational and illustrative unless independently sourced and validated. Simplifications in the model mean that the results should not be presented as NASA-certified or as accurate forecasts for real missions. The asteroid minigame is arcade gameplay, not a realistic flight-dynamics simulation; its science coins and survival score are separate from the engineering mission score.

//NASA data and resources:
NASA Space Apps projects are encouraged or required, depending on the selected challenge, to work with relevant NASA and other open scientific resources. Displaying NASA images or using physics formulas is not, by itself, proof that the numerical simulation is driven by NASA datasets. Mission: Vector includes NASA-linked visual/science references, but this version's component catalogue and mission inputs have not been verified here as direct imports from specific NASA datasets. The team should identify the exact challenge requirements, record the URLs and licences of NASA resources actually used, and distinguish sourced measurements from estimated or invented gameplay parameters before making a stronger data-use claim. A future data provenance table could record, for each value: parameter, NASA source or technical reference, dataset version/date, units, any conversions, and whether it is measured, estimated, or a gameplay assumption.

//Project status and attribution:
Mission: Vector is a student-led educational project by **Team Trust The Physics**. It is not an official NASA product, and NASA does not sponsor or endorse the game. Any NASA imagery belongs to its respective source and should be attributed according to the source's usage guidance.

//Technical notes:
The game is provided as a standalone browser build. The engineering calculations and mission outcomes are implemented locally in JavaScript. Local leaderboard records are stored in the player's browser on the device being used, rather than being synchronised across devices.


//NASA/JPL Scientific Reference:
The game has a seperate, **source-backed reference physics panel** to the mission briefing for the Moon and Mars. It calculates circular-orbit speed, orbital period, escape speed at the reference orbit, and surface gravity from gravitational parameters and mean body radii. It also shows inverse-square reference solar irradiance and an Earth-orbit comparison.

//Sources:
- NASA/JPL Solar System Dynamics, Astrodynamic Parameters (DE440 GM values): https://ssd.jpl.nasa.gov/astro_par.html
- NASA/JPL Planetary Satellite Physical Parameters (lunar mean radius): https://ssd.jpl.nasa.gov/sats/phys_par/
- NASA/JPL Planetary Physical Parameters: https://ssd.jpl.nasa.gov/planets/phys_par.html
- NASA/JPL Horizons (future precise, epoch-dependent ephemerides): https://ssd.jpl.nasa.gov/horizons/
- NASA NAIF SPICE (future spacecraft/planet trajectory integration): https://naif.jpl.nasa.gov/naif/

//Important scientific boundaries:
The physical constants are sourced from NASA/JPL; this does NOT make the complete game an operationally accurate mission design tool. The original spacecraft catalogue's masses, costs, reliability estimates, launch performance, communications factors, eclipse assumptions, delta-v budgets and mission timelines are *illustrative*. The game's stochastic failure model and arcade minigame are not flight-certified physics. Solar irradiance uses a nominal 1361 W/m² at 1 AU and inverse-square scaling; the Mars value uses mean heliocentric distance rather than date-specific ephemerides. Earth and Mars mean radii are approximate and should not be mistaken for high-precision shape models.

The original mission evaluation and score engine were deliberately left unchanged to preserve existing gameplay and parity tests. A future upgrade to actual date-dependent transfer trajectories would require epoch-specific JPL Horizons/SPICE ephemerides, numerical integration, a selected mission profile, verified propulsion and launch-vehicle performance, and validation against reference trajectories.


//NASA Photo Gallery:

Select **NASA PHOTO GALLERY** on the home screen to browse NASA Image and Video Library photographs of the Moon, Mars, rockets, astronauts, space probes and satellites. The gallery fetches NASA-hosted image records, thumbnails and captions while running; **an internet connection is required to display these photographs**. The spacecraft designer, physics calculations, mission simulation, minigame, and built-in guide continue to run without an internet connection. Note that some pre-existing mission and home-screen images also use remote URLs and may not display offline.

Gallery API: https://images-api.nasa.gov/search (public endpoint, no API key stored). Source images and individual credits link to https://images.nasa.gov/. NASA imagery is generally available for educational use under its media guidelines, subject to third-party restrictions: https://www.nasa.gov/nasa-brand-center/images-and-media/. NASA does not endorse Mission: Vector.

### **For this project/game research, images, data, and reference format was done with the help of AI. However, game development, originality, idea, data logging and all other aspects were done solely by team members.