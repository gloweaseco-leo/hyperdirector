#!/usr/bin/env node
/**
 * Alias entry point for environment checks (Node, HyperFrames CLI, FFmpeg).
 * Delegates to check-env.js — HyperDirector does not replace HyperFrames; it composes upstream for Hermes.
 */
require('./check-env.js');
