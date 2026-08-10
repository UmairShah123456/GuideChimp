import type { HouseRule } from "./types";

/**
 * The starter house-rule library every new account begins with, so a host's
 * first property isn't a blank list. They're copied into
 * `house_rule_templates` at account creation and are the host's own from that
 * moment — editable, deletable, and never re-added if they remove one.
 *
 * Deliberately limited to rules that are true of essentially every short-let:
 * a default a host has to delete is worse than no default. Anything that
 * depends on the building (which bin, where the slippers live, whether there's
 * a balcony to smoke on) belongs in that property's guide, not in here — the
 * `reason` lines below are written to be safe to send to a guest unedited.
 *
 * Kept in step with pass 2 of migration 0016, which gives the same set to
 * accounts that existed before this feature.
 */
export const STARTER_RULE_TEMPLATES: HouseRule[] = [
  {
    title: "No smoking inside",
    reason:
      "If we are made aware that smoking is taking place inside your security deposit will be charged",
    icon: "no-smoking",
  },
  {
    title: "No noise between 11pm and 7am",
    reason:
      "Please be respectful to the neighbours by not causing noise and disturbance during quiet hours",
    icon: "no-noise",
  },
  {
    title: "No illegal activities",
    reason:
      "If we are made aware of any illegal activities taking place, inside your security deposit will be charged and police will be notified",
    icon: "legal",
  },
  {
    title: "No gatherings or parties",
    reason: "Strictly no parties or any type of gatherings allowed",
    icon: "no-parties",
  },
  {
    title: "No pets",
    reason:
      "This isn't a pet friendly property unfortunately, so please do not bring any with you",
    icon: "no-pets",
  },
];
