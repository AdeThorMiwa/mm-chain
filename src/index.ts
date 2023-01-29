#!/usr/bin/env node
import Vorpal from "vorpal";
import app from "./app";

new Vorpal().use(app);
