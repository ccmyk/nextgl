// src/lib/animations/createViews.js

import Home from '@/app/home/page';
import Projects from '@/app/projects/page';
import Project from '@/app/project/page';
import About from '@/app/about/page';
import Error from '@/app/error/page';
import Playground from '@/app/playground/page';

/**
 * Legacy-style view instantiation from template names.
 * Bound to App.prototype.createViews.
 */
export function createViews() {
  this.pages = new Map();

  this.pages.set('home', new Home(this.main));
  this.pages.set('projects', new Projects(this.main));
  this.pages.set('project', new Project(this.main));
  this.pages.set('about', new About(this.main));
  this.pages.set('error', new Error(this.main));
  this.pages.set('playground', new Playground(this.main));
}