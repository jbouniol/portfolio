import { getExperiences } from "@/lib/db";
import ExperiencesListClient from "./ExperiencesListClient";

export default async function AdminExperiencesPage() {
  const experiences = await getExperiences();
  return <ExperiencesListClient experiences={experiences} />;
}
