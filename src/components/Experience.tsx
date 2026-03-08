import { getPublishedExperiences } from "@/lib/db";
import ExperienceClient from "./ExperienceClient";

export default async function Experience() {
  const experiences = await getPublishedExperiences();
  const workExperience = experiences.filter((e) => e.type === "work");
  const leadership = experiences.filter((e) => e.type === "leadership");

  return <ExperienceClient workExperience={workExperience} leadership={leadership} />;
}
