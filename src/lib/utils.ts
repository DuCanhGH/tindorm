export function currentAcademicYear(asOf = new Date(), academicYearStartMonth = 7) {
  // if month >= start month, academic year = this calendar year; else previous year
  return asOf.getMonth() >= academicYearStartMonth ? asOf.getFullYear() : asOf.getFullYear() - 1;
}
