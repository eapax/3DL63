# How to view

Go to 
[eapax.github.io/my-page/3DL63/](https://eapax.github.io/my-page/3DL63/)

I haven't added a loading animation yet, so give it a second or two to load :)

# Background

The Lorenz equations give a three dimensional, nonlinear dynamical system which 
illustrates some very cool features representative of the earth's atmosphere. 
Namely:
1. Chaos.
2. A predictable long-term statistics.

Chaos means that small differences in the inital condition can grow 
exponentially with time, making it hard to predict exactly what
the system will do next. But, over a long enough timeframe, the amount
of time the system spends in a given region of state space is predictable,
thus giving a well-defined probability distribution.
This is analogous to the fact that the weather on a given day in the far
future is completely unknowable, while the climate
(e.g., the average UK July temperature) is predictable.

This repo contains some code for building an interactive 3D visualisation
of the Lorenz system using the JavaScript package
[threejs](https://threejs.org/). 

The main motivation was to see what a 3D
probability distribution would look like when probability mass is
represented by transparency (i.e. a kind of 3D histogram). Any ideas for
other ways to visualise a 3D probability distribution, or for general
improvements or alternative visual effects are very welcome! 

# Steps to reproduce

* Do `git clone https://github.com/eapax/3DL63` to clone the repo.
* Run the python script `python py/main.py`. This will integrate the L63
  equations to generate the data for the web app. The resulting data will
  be saved in a new folder called `assets`.
* Run `npm install` to install the required JavaScript packages (read by
  default from `package.json`).
* To view the web app locally, run `npx vite`. This should set up a local
  web server which can be accessed via your browser at
  [localhost:5173](http://localhost:5173/).

# Building for external deployment

To build the web app for deployment on an external web server,
run the `npx vite build` command. This will build the app
(handling all of the import statements) to a new folder called
`dist`. Before this app can be deployed, the .npy and fonts
files in `assets` will need to be copied over to `dist/assets`.
A simple bash script which automates this is included as `build.sh`.
Note that this (currently) assumes that the web server will run
with dist as root. If a different folder is running as root, you'll get a
file not found error. This can be fixed by moving the .npy files
instead into a new folder called `assets` locating in the root directory,
or alternatively by altering the file paths in the JavaScript.

