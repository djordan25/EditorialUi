// EditorialUI · consolidated visual-verification map.
//
// The 9 design-handoff bundles each shipped their own story→spec map. Component
// keys are disjoint across bundles, so we import and spread them into one map.
// The runner (visual-verify.mjs) consumes `CASES`, `DIFF_THRESHOLD`,
// `DIM_TOLERANCE_PX` from here.
//
// NOTE: several per-bundle maps still contain `TODO:pair` label guesses (the spec
// cell label that auto-pairing couldn't resolve). Reconcile each component's
// labels against the spec page before trusting a green run:
//     SPEC_DIR=.../editorialui_spec/components node verify/visual-verify.mjs --list-spec <page>
// `foundations` (EdIcon/EdButton/EdIconButton) is already fully paired.

import { CASES as foundations } from '../design_handoffs/design_handoff_editorialui_foundations/verify/story-spec-map.mjs';
import { CASES as forms } from '../design_handoffs/design_handoff_editorialui_forms/verify/story-spec-map.mjs';
import { CASES as selection } from '../design_handoffs/design_handoff_editorialui_selection/verify/story-spec-map.mjs';
import { CASES as display } from '../design_handoffs/design_handoff_editorialui_display/verify/story-spec-map.mjs';
import { CASES as feedback } from '../design_handoffs/design_handoff_editorialui_feedback/verify/story-spec-map.mjs';
import { CASES as containers } from '../design_handoffs/design_handoff_editorialui_containers/verify/story-spec-map.mjs';
import { CASES as navigation } from '../design_handoffs/design_handoff_editorialui_navigation/verify/story-spec-map.mjs';
import { CASES as data } from '../design_handoffs/design_handoff_editorialui_data/verify/story-spec-map.mjs';
import { CASES as composites } from '../design_handoffs/design_handoff_editorialui_composites/verify/story-spec-map.mjs';

/** @type {Record<string, import('../design_handoffs/design_handoff_editorialui_foundations/verify/story-spec-map.mjs').VerifyCase[]>} */
export const CASES = {
  ...foundations,
  ...forms,
  ...selection,
  ...display,
  ...feedback,
  ...containers,
  ...navigation,
  ...data,
  ...composites,
};

// Max fraction of differing pixels (0–1) tolerated after cropping to common
// dimensions. 0.1 absorbs anti-aliasing without hiding a token/geometry change.
export const DIFF_THRESHOLD = 0.1;

// A dimension delta larger than this (px, either axis) fails on its own.
export const DIM_TOLERANCE_PX = 2;
