import {
  Person,
  WebTechLead,
  StudentResearcher,
  HallEntry,
  AlumniMember,
  AcademicPartner,
} from '../types';
import peopleData from '../data/generated/people.json';

interface RawPeopleData {
  leadership_and_faculty: Person[];
  web_tech_lead: WebTechLead[];
  hall_of_fame: HallEntry[];
  graduate_and_undergraduate_student_researchers: StudentResearcher[];
  alumni: AlumniMember[];
  global_academic_partners: AcademicPartner[];
}

const data = peopleData as unknown as RawPeopleData;

export function getPeople(): RawPeopleData {
  return data;
}

export function getFaculty(): Person[] {
  return data.leadership_and_faculty || [];
}

export function getWebTechLeads(): WebTechLead[] {
  return data.web_tech_lead || [];
}

export function getStudentResearchers(): StudentResearcher[] {
  return data.graduate_and_undergraduate_student_researchers || [];
}

export function getHallOfFame(): HallEntry[] {
  return data.hall_of_fame || [];
}

export function getAlumni(): AlumniMember[] {
  return data.alumni || [];
}

export function getGlobalPartners(): AcademicPartner[] {
  return data.global_academic_partners || [];
}

export function getPersonById(id: string): Person | WebTechLead | StudentResearcher | undefined {
  const allPeople: (Person | WebTechLead | StudentResearcher)[] = [
    ...(data.leadership_and_faculty || []),
    ...(data.web_tech_lead || []),
    ...(data.graduate_and_undergraduate_student_researchers || []),
  ];
  return allPeople.find((p) => p.id === id);
}
