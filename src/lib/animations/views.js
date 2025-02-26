// VIEWS
import Home from "@/app/home/page.js";
import Projects from "@/app/projects/page.js";
import Project from "@/app/project/page.js";
import About from "@/app/about/page.js";
import Error from "@/app/error/page.js";
import Playground from "@/app/playground/page.js";

// Function to Register Views
export function createViews() {
  this.pages = new Map();
  this.pages.set("home", new Home(this.main));
  this.pages.set("projects", new Projects(this.main));
  this.pages.set("project", new Project(this.main));
  this.pages.set("about", new About(this.main));
  this.pages.set("error", new Error(this.main));
  this.pages.set("playground", new Playground(this.main));
}