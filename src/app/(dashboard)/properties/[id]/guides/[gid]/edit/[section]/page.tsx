import { notFound } from "next/navigation";
import { requireAccount } from "@/lib/auth/session";
import { getHostGuide, listHouseRuleTemplates } from "@/lib/dashboard/queries";
import { DEFAULT_CONTENT, sectionDisplayName } from "@/lib/guide/defaults";
import type {
  AmenitiesContent,
  CheckInContent,
  CheckOutContent,
  EmergencyContent,
  GuideSectionType,
  HouseRulesContent,
  LocalGuideContent,
  ParkingContent,
  WifiContent,
} from "@/lib/guide/types";
import type { LocalEntryInput } from "@/lib/dashboard/section-actions";
import { CheckInEditor } from "@/components/dashboard/editors/CheckInEditor";
import { CheckOutEditor } from "@/components/dashboard/editors/CheckOutEditor";
import { ParkingEditor } from "@/components/dashboard/editors/ParkingEditor";
import { WifiEditor } from "@/components/dashboard/editors/WifiEditor";
import { AmenitiesEditor } from "@/components/dashboard/editors/AmenitiesEditor";
import { LocalGuideEditor } from "@/components/dashboard/editors/LocalGuideEditor";
import { HouseRulesEditor } from "@/components/dashboard/editors/HouseRulesEditor";
import { ContactEditor } from "@/components/dashboard/editors/ContactEditor";

const SLUG_TO_TYPE: Record<string, GuideSectionType> = {
  "check-in": "check_in",
  "check-out": "check_out",
  parking: "parking",
  wifi: "wifi",
  amenities: "amenities",
  "local-guide": "local_guide",
  "house-rules": "house_rules",
  "emergency-contacts": "emergency_contacts",
};

export default async function EditSectionPage({
  params,
}: {
  params: Promise<{ id: string; gid: string; section: string }>;
}) {
  const account = await requireAccount();
  const { id, gid, section } = await params;
  const type = SLUG_TO_TYPE[section];
  if (!type) notFound();

  const data = await getHostGuide(gid);
  if (!data || data.property?.id !== id) notFound();

  // A guide only edits sections it actually has — staff guides have none, so
  // hand-typed built-in URLs 404 rather than rendering an orphan editor.
  if (!data.sections.some((s) => s.type === type)) notFound();

  const heading = sectionDisplayName(type, data.guide.section_titles);
  const contentOf = <T,>(t: GuideSectionType): T =>
    (data.sections.find((s) => s.type === t)?.content as T) ?? (DEFAULT_CONTENT[t] as T);

  const ruleLibrary =
    type === "house_rules"
      ? await listHouseRuleTemplates(account.id)
      : { templates: [], error: undefined };

  const amenitiesSection = data.sections.find((s) => s.type === "amenities");
  const videoRows = data.media
    .filter((m) => m.type === "video" && m.guide_section_id === amenitiesSection?.id)
    .map((m) => ({
      title: m.caption ?? "",
      subtitle: (m.metadata.subtitle as string) ?? "",
      url: m.url ?? "",
      notes: (m.metadata.notes as string) ?? "",
    }));
  const localEntries: LocalEntryInput[] = data.localEntries.map((e) => ({
    category: e.category,
    name: e.name,
    description: e.description ?? "",
    price: e.price ?? "",
    hours: e.hours ?? "",
    url: e.url ?? "",
  }));

  switch (type) {
    case "check_in":
      return (
        <CheckInEditor
          propertyId={id}
          guideId={gid}
          branding={account}
          heading={heading}
          initial={contentOf<CheckInContent>("check_in")}
        />
      );
    case "parking":
      return (
        <ParkingEditor
          propertyId={id}
          guideId={gid}
          branding={account}
          heading={heading}
          initial={contentOf<ParkingContent>("parking")}
        />
      );
    case "wifi":
      return (
        <WifiEditor
          propertyId={id}
          guideId={gid}
          branding={account}
          heading={heading}
          initial={contentOf<WifiContent>("wifi")}
        />
      );
    case "amenities":
      return (
        <AmenitiesEditor
          propertyId={id}
          guideId={gid}
          branding={account}
          heading={heading}
          initial={contentOf<AmenitiesContent>("amenities")}
          initialVideos={videoRows}
        />
      );
    case "local_guide":
      return (
        <LocalGuideEditor
          propertyId={id}
          guideId={gid}
          branding={account}
          heading={heading}
          initial={contentOf<LocalGuideContent>("local_guide")}
          initialEntries={localEntries}
        />
      );
    case "house_rules":
      return (
        <HouseRulesEditor
          propertyId={id}
          guideId={gid}
          branding={account}
          heading={heading}
          initial={contentOf<HouseRulesContent>("house_rules")}
          templates={ruleLibrary.templates}
          templatesError={ruleLibrary.error}
        />
      );
    case "check_out":
      return (
        <CheckOutEditor
          propertyId={id}
          guideId={gid}
          branding={account}
          heading={heading}
          initial={contentOf<CheckOutContent>("check_out")}
        />
      );
    case "emergency_contacts":
      return (
        <ContactEditor
          propertyId={id}
          guideId={gid}
          branding={account}
          heading={heading}
          initial={contentOf<EmergencyContent>("emergency_contacts")}
        />
      );
    default:
      notFound();
  }
}
