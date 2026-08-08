/**
 * Where a guide lives in the dashboard. Property guides sit under their
 * property; account-level guides (company processes) sit at the top level,
 * because they aren't about any one place.
 */
export function guideBasePath(
  propertyId: string | null | undefined,
  guideId: string,
): string {
  return propertyId
    ? `/properties/${propertyId}/guides/${guideId}`
    : `/guides/${guideId}`;
}

/** The list a guide belongs to — its property's guides, or Company guides. */
export function guideListPath(propertyId: string | null | undefined): string {
  return propertyId ? `/properties/${propertyId}` : "/guides";
}

/**
 * Prefix for uploaded media. Property guides keep grouping files under the
 * property; account-level guides have none, so they group under the guide.
 */
export function storagePrefix(
  propertyId: string | null | undefined,
  guideId: string,
): string {
  return propertyId ?? `guide-${guideId}`;
}
