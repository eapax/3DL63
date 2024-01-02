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
