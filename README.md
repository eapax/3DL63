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
