# AWT PJ dash.js 2

TODO description of project 

## Installation
to work local on the project do the following:

```bash
git clone https://gitlab.tubit.tu-berlin.de/annasophiem/awt-pj-ws20-21-dashjs-2.git
```
```bash
brew install git-flow
```
go into repository:
```bash
git flow init 
```
should look like this:

```bash
Branch name for production releases: [master]
Branch name for "next release" development: [develop]

How to name your supporting branch prefixes?
Feature branches? [feature/]
Release branches? [release/]
Hotfix branches? [hotfix/]
Support branches? [support/]
Version tag prefix? []
```

To run the Project locally do the following:

(Node.js and npm package manager should be installed)
go to 'dash-if-reference-player' and type

```bash
npm install
```
the project should start now.

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.


### Angular installation
To install Angular on your local system, you need the following:

*Node.js

*npm package manager

To install the Angular CLI, open a terminal window and run the following command:
```bash
npm install -g @angular/cli
```
# Develop on a branch

check : https://www.atlassian.com/de/git/tutorials/comparing-workflows/gitflow-workflow

always start on develop and check that you have the correct version

```bash
git pull
```

```bash
git flow feature start name_of_branch
```
do some work:

```bash
git add .
git commit -m "commit message"
git push
```

While developing on your branch, the changes should appear automatically in the browser

## Authors

Berit Frech

Johannes Beyer

Anna Mockenhaupt
